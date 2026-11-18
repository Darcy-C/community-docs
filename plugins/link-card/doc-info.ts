/**
 * 读一篇文档的标题和简介，供「链接卡片」使用。
 *
 * 简介只认 front matter 里的 `description`——没写就只显示标题。
 * 这个字段同时也会成为页面自己的描述（搜索结果里显示的摘要）。
 */
import fs from 'node:fs';

export type DocInfo = {
  /** 卡片标题：front matter 的 title，没有就用正文第一个一级标题 */
  title: string;
  /** 卡片简介：front matter 的 description，没有就是空字符串 */
  description: string;
};

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const cache = new Map<string, {mtimeMs: number; info: DocInfo | null}>();

/** front matter 里某个字段的值，去掉包裹的引号 */
function frontMatterField(block: string, name: string): string | undefined {
  const line = new RegExp(`^${name}\\s*:\\s*(.+?)\\s*$`, 'm').exec(block)?.[1];
  if (!line) return undefined;
  return line.replace(/^(['"])(.*)\1$/, '$2').trim() || undefined;
}

function readDocInfoUncached(filePath: string): DocInfo | null {
  let source: string;
  try {
    source = fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }

  const frontMatter = FRONT_MATTER.exec(source);
  const data = frontMatter?.[1] ?? '';
  const body = frontMatter ? source.slice(frontMatter[0].length) : source;

  const title =
    frontMatterField(data, 'title') ??
    /^#\s+(.+)$/m.exec(body)?.[1]?.trim() ??
    filePath.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '');

  return {title, description: frontMatterField(data, 'description') ?? ''};
}

/**
 * 读取文档信息。同一个文件在开发服务器里会被反复编译，
 * 按修改时间缓存，改完目标文档能立刻反映到卡片上。
 */
export function readDocInfo(filePath: string): DocInfo | null {
  let mtimeMs = 0;
  try {
    mtimeMs = fs.statSync(filePath).mtimeMs;
  } catch {
    return null;
  }

  const cached = cache.get(filePath);
  if (cached && cached.mtimeMs === mtimeMs) return cached.info;

  const info = readDocInfoUncached(filePath);
  cache.set(filePath, {mtimeMs, info});
  return info;
}
