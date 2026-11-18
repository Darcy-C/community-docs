/**
 * 把带标记的站内链接做成「链接卡片」（类似语雀那种文档卡片）。
 *
 * 写法：
 *
 *   [card](./install.md)              → 标题和简介取目标文档的
 *   [card:安装方法](./install.md)      → 自定义标题
 *
 * 只在单独成段时变成卡片；混在文字里的仍然是一个普通链接，
 * 只是把 “card” 这个标记换成目标文档的标题，读起来不会突兀。
 *
 * 这里只负责认出标记、读目标文档的信息，并把信息挂到链接节点上。
 * 真正的卡片结构在 rehype.ts 里生成——那时 Docusaurus 已经把
 * ./install.md 解析成最终路由了，卡片里的链接才能指对地方。
 */
import path from 'node:path';

import {readDocInfo} from './doc-info';

/** 链接文字就是标记：card、card:自定义标题（也认中文的“卡片”） */
const CARD_MARKER = /^(?:card|卡片)(?:\s*[:：]\s*(.+))?$/i;

/** 卡片信息挂在链接节点上的属性名，和 rehype.ts 里读的一致 */
export const CARD_ATTRS = {
  marker: 'data-qk-card',
  title: 'data-qk-card-title',
  description: 'data-qk-card-description',
} as const;

type MdNode = {
  type: string;
  value?: string;
  url?: string;
  children?: MdNode[];
  data?: Record<string, unknown>;
};

type VFileLike = {
  path?: string;
};

function isLink(node: MdNode): boolean {
  return node.type === 'link' && typeof node.url === 'string';
}

function textOf(node: MdNode): string {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

/** card 标记 → 自定义标题（没写则返回 null） */
function cardTitle(link: MdNode): string | null | undefined {
  const match = CARD_MARKER.exec(textOf(link).trim());
  if (!match) return undefined;
  return match[1]?.trim() || null;
}

/**
 * 链接地址 → 目标文档的绝对路径。
 * 只接受 .md / .mdx 的相对路径：站内路由、外链一律不认，
 * 免得把“指向某页面的普通链接”误判成卡片。
 */
function resolveTarget(rawUrl: string, sourceFile: string): string | null {
  const withoutHash = rawUrl.split('#')[0].split('?')[0];
  if (!/\.mdx?$/i.test(withoutHash)) return null;
  if (withoutHash.startsWith('/') || withoutHash.startsWith('//')) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(withoutHash)) return null;
  return path.resolve(path.dirname(sourceFile), decodeURIComponent(withoutHash));
}

function markAsCard(link: MdNode, title: string, description: string): void {
  link.children = [{type: 'text', value: title}];
  link.data = {
    ...link.data,
    hProperties: {
      [CARD_ATTRS.marker]: '1',
      [CARD_ATTRS.title]: title,
      [CARD_ATTRS.description]: description,
    },
  };
}

function walk(node: MdNode, sourceFile: string): void {
  for (const child of node.children ?? []) {
    if (isLink(child)) {
      const customTitle = cardTitle(child);
      if (customTitle !== undefined) {
        const target = resolveTarget(child.url!, sourceFile);
        const info = target ? readDocInfo(target) : null;
        const title = customTitle ?? info?.title ?? child.url!;
        if (info) {
          markAsCard(child, title, info.description);
        } else {
          child.children = [{type: 'text', value: title}];
        }
        continue;
      }
    }
    walk(child, sourceFile);
  }
}

export default function remarkLinkCard() {
  return (tree: MdNode, file: VFileLike): void => {
    if (!file.path) return;
    walk(tree, file.path);
  };
}
