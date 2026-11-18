/**
 * 把图片的 alt 文字显示成图片下方的标题（图注），并让图片自动居中。
 *
 * 文档是 CommonMark，写不了 React 组件，所以这里在构建时把
 *
 *   ![🍔 面板动作右键菜单中](/img/xxx.png)
 *
 * 转成
 *
 *   <figure class="qk-figure">
 *     <img src="/img/xxx.png" alt="🍔 面板动作右键菜单中" />
 *     <figcaption class="qk-figure__caption">🍔 面板动作右键菜单中</figcaption>
 *   </figure>
 *
 * Markdown 写法不用改；alt 既是图片的替代文字，也当作图注。
 *
 * 规则：
 * - 单独成段的图片（一张或多张并排）包成 <figure>，图与图之间、整组都居中；
 * - alt 为空、或只是占位文字（"alt text"，编辑器粘贴图片时常见的默认值）时
 *   不生成图注，装饰性图片照旧，但仍然居中；
 * - 段落里文字和图片混排时，只把带 alt 的图片拆出来做成图 + 图注，
 *   其余行内小图（例如快捷键图标）保持原样；
 * - 原文 HTML 里单独成块的 <img>（例如设置页顶部的截图）同样处理，
 *   但写了 width 的小图标（例如 logo）跳过。
 *
 * 注意：`.md` 里的 Markdown 图片会被 Docusaurus 转成 MDX 的 `mdxJsxTextElement`
 * 再进入 hast，所以图片节点有两种形态，这里都要认。
 */
import type {Element, ElementContent, Root} from 'hast';

type ParentNode = Root | Element;

type HastNode = Root['children'][number] | ElementContent;

type MdxJsxNode = Extract<ElementContent, {type: 'mdxJsxTextElement' | 'mdxJsxFlowElement'}>;

type ImageNode = Element | MdxJsxNode;

const FIGURE_CLASS = 'qk-figure';
const CAPTION_CLASS = 'qk-figure__caption';
const ROW_CLASS = 'qk-figure-row';

// ------------------------------------------------------------------ 节点识别

function isElement(node: HastNode): node is Element {
  return node.type === 'element';
}

function isMdxJsx(node: HastNode): node is MdxJsxNode {
  return node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement';
}

/** 是图片节点就返回它，否则返回 null */
function imageOf(node: HastNode): ImageNode | null {
  if (isElement(node)) return node.tagName === 'img' ? node : null;
  if (isMdxJsx(node)) return node.name === 'img' ? node : null;
  return null;
}

function isWhitespace(node: HastNode): boolean {
  return node.type === 'text' && node.value.trim() === '';
}

function attrOf(img: ImageNode, name: string): string | null {
  if (isElement(img)) {
    const value = img.properties?.[name];
    return typeof value === 'string' ? value : null;
  }
  const attr = img.attributes.find((item) => 'name' in item && item.name === name);
  return attr && typeof attr.value === 'string' ? attr.value : null;
}

function hasNoCaptionAttr(img: ImageNode): boolean {
  if (isElement(img)) return Boolean(img.properties && 'dataNoCaption' in img.properties);
  return img.attributes.some((item) => 'name' in item && item.name === 'data-no-caption');
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

/** alt 里的 &amp; 这类实体还原成字符，避免图注显示成源码 */
function unescapeHtml(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, code: string) => {
    if (code.startsWith('#')) {
      const num = /^#x/i.test(code) ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(num) ? String.fromCodePoint(num) : match;
    }
    return NAMED_ENTITIES[code] ?? match;
  });
}

/** 占位 alt（编辑器粘贴图片时常自动写成 "alt text"）不算图注 */
const PLACEHOLDER_ALT = /^alt\s*text$/i;

function altText(img: ImageNode): string {
  const raw = attrOf(img, 'alt');
  if (!raw) return '';
  const text = unescapeHtml(raw).trim();
  return PLACEHOLDER_ALT.test(text) ? '' : text;
}

function withCaption(img: ImageNode): boolean {
  return !hasNoCaptionAttr(img) && altText(img) !== '';
}

// ------------------------------------------------------------------ 生成结构

/** 单张图片 → 图（+ 图注） */
function makeFigure(img: ImageNode): Element {
  const caption = altText(img);
  const children: ElementContent[] = [img];
  if (caption) {
    children.push({
      type: 'element',
      tagName: 'figcaption',
      properties: {className: [CAPTION_CLASS]},
      children: [{type: 'text', value: caption}],
    });
  }
  return {
    type: 'element',
    tagName: 'figure',
    properties: {className: [FIGURE_CLASS]},
    children,
  };
}

/**
 * 段落 → 若干块（文字段落 / figure / 并排图片容器）。
 * 没有可处理的图片时返回 null，交给调用方保持原样。
 */
function transformParagraph(paragraph: Element): ElementContent[] | null {
  const children = paragraph.children as HastNode[];

  const images = children.map(imageOf).filter((img): img is ImageNode => img !== null);
  if (images.length === 0) return null;

  const onlyImages = children.every((node) => imageOf(node) !== null || isWhitespace(node));
  if (!onlyImages && !images.some(withCaption)) return null;

  const blocks: ElementContent[] = [];
  let inline: ElementContent[] = [];
  let figures: Element[] = [];

  const flushInline = (): void => {
    if (inline.some((node) => !isWhitespace(node))) {
      blocks.push({
        type: 'element',
        tagName: 'p',
        properties: paragraph.properties,
        children: inline,
      });
    }
    inline = [];
  };
  const flushFigures = (): void => {
    if (figures.length === 1) {
      blocks.push(figures[0]);
    } else if (figures.length > 1) {
      blocks.push({
        type: 'element',
        tagName: 'div',
        properties: {className: [ROW_CLASS]},
        children: figures,
      });
    }
    figures = [];
  };

  for (const node of children) {
    const img = imageOf(node);
    // 图片与图片之间的换行不打断并排布局
    if (!img && isWhitespace(node) && figures.length > 0) continue;

    if (img && (onlyImages || withCaption(img))) {
      flushInline();
      figures.push(makeFigure(img));
    } else {
      flushFigures();
      inline.push(node as ElementContent);
    }
  }
  flushInline();
  flushFigures();
  return blocks;
}

function walk(parent: ParentNode): void {
  const next: ElementContent[] = [];
  for (const child of parent.children as ElementContent[]) {
    if (child.type === 'element' && child.tagName === 'p') {
      const replacement = transformParagraph(child);
      if (replacement) {
        next.push(...replacement);
        continue;
      }
    }
    // 原文 HTML 里单独成块的截图（例如设置页顶部的 <img class="qk-shot">）也加上图注；
    // 明确写了 width 的小图标（例如 89px 的 logo）跳过
    if (child.type === 'element' && child.tagName === 'img') {
      const hasWidth = Boolean(child.properties && 'width' in child.properties);
      if (!hasWidth && withCaption(child)) {
        next.push(makeFigure(child));
        continue;
      }
    }
    if (child.type === 'element') {
      walk(child as Element);
    }
    next.push(child);
  }
  parent.children = next as ParentNode['children'];
}

export default function rehypeImageCaption() {
  return (tree: Root): void => {
    walk(tree);
  };
}
