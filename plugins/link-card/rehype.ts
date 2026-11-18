/**
 * 把 remark 阶段标记好的链接整段替换成卡片。
 *
 * 放在 rehype 阶段做的原因：这时 Docusaurus 已经把 `./install.md`
 * 解析成最终路由（例如 /install），卡片里的链接才指得对。
 *
 * 只有“整段只有这一个链接”的段落才会变成卡片，
 * 混在文字里的链接保持原样，避免正文被卡片打散。
 */
import type {Element, ElementContent, Root} from 'hast';

import {CARD_ATTRS} from './index';

const CARD_CLASS = 'qk-link-card';

const CLASS = {
  link: `${CARD_CLASS}__link`,
  body: `${CARD_CLASS}__body`,
  title: `${CARD_CLASS}__title`,
  desc: `${CARD_CLASS}__desc`,
};

type ParentNode = Root | Element;

/** hast 里 data-qk-card 可能存成 data-qk-card 或 dataQkCard */
function attrNames(name: string): string[] {
  const camelCase = name.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
  return [name, camelCase];
}

function attrOf(element: Element, name: string): string | null {
  const properties = element.properties ?? {};
  for (const key of attrNames(name)) {
    const value = properties[key];
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
  }
  return null;
}

/** 内部用的标记属性不进页面：没做成卡片的链接要把它们摘掉 */
function stripCardAttrs(element: Element): void {
  if (!element.properties) return;
  for (const name of Object.values(CARD_ATTRS)) {
    for (const key of attrNames(name)) delete element.properties[key];
  }
}

function isWhitespace(node: ElementContent): boolean {
  return node.type === 'text' && node.value.trim() === '';
}

/** 段落里唯一的有效内容是这个卡片链接时返回它 */
function cardLinkIn(paragraph: Element): Element | null {
  const meaningful = (paragraph.children as ElementContent[]).filter((node) => !isWhitespace(node));
  if (meaningful.length !== 1) return null;
  const [only] = meaningful;
  if (only.type !== 'element' || only.tagName !== 'a') return null;
  return attrOf(only, CARD_ATTRS.marker) ? only : null;
}

function span(className: string, children: ElementContent[]): Element {
  return {type: 'element', tagName: 'span', properties: {className: [className]}, children};
}

function buildCard(link: Element): Element | null {
  const title = attrOf(link, CARD_ATTRS.title);
  if (!title) return null;
  const description = attrOf(link, CARD_ATTRS.description) ?? '';
  const href = attrOf(link, 'href');

  const body: ElementContent[] = [span(CLASS.title, [{type: 'text', value: title}])];
  if (description) body.push(span(CLASS.desc, [{type: 'text', value: description}]));

  return {
    type: 'element',
    tagName: 'div',
    properties: {className: [CARD_CLASS]},
    children: [
      {
        type: 'element',
        tagName: 'a',
        properties: {
          ...(href ? {href} : {}),
          className: [CLASS.link],
        },
        children: [span(CLASS.body, body)],
      },
    ],
  };
}

function walk(parent: ParentNode): void {
  const next: ElementContent[] = [];
  for (const child of parent.children as ElementContent[]) {
    if (child.type === 'element' && child.tagName === 'p') {
      const link = cardLinkIn(child);
      const card = link ? buildCard(link) : null;
      if (card) {
        next.push(card);
        continue;
      }
    }
    if (child.type === 'element') {
      if (child.tagName === 'a' && attrOf(child, CARD_ATTRS.marker)) stripCardAttrs(child);
      walk(child as Element);
    }
    next.push(child);
  }
  parent.children = next as ParentNode['children'];
}

export default function rehypeLinkCard() {
  return (tree: Root): void => {
    walk(tree);
  };
}
