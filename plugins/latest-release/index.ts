/**
 * 构建时扫描版本更新目录，找出最新的一页，写进每个页面的
 * <meta name="qk-latest-release"> 里。
 *
 * /release-notes 中转页（src/clientModules/releaseNotesRedirect.ts）读这个 meta 跳转，
 * 以后新增 docs/release-notes/2028-1.md 这样的页面，不需要再改任何代码。
 *
 * 扫描规则：
 * - 文件名必须是 `年份-版本号.md`（例如 2027-5.md），按数字大小比较，不依赖 sidebar_position；
 * - front matter 里 `draft: true` 的页面跳过；
 * - 路由默认是 `/release-notes/<文件名>`，如果 front matter 写了 slug 则按 slug 走。
 */
import fs from 'node:fs';
import path from 'node:path';

import type {LoadContext, Plugin} from '@docusaurus/types';

export type Options = {
  /** 版本页目录，相对站点根目录 */
  dir?: string;
};

type ReleasePage = {
  /** 页面路由（已含 baseUrl） */
  route: string;
  /** [年份, 版本号]，用于比较大小 */
  version: [number, number];
};

const VERSION_FILE = /^(\d{4})-(\d+)\.md$/;
const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

function frontMatterField(block: string, name: string): string | undefined {
  const line = new RegExp(`^${name}\\s*:\\s*(.+?)\\s*$`, 'm').exec(block)?.[1];
  if (!line) return undefined;
  return line.replace(/^(['"])(.*)\1$/, '$2');
}

/** 拼出以 / 开头、没有重复斜杠的地址 */
function joinUrl(...parts: string[]): string {
  const segments = parts
    .flatMap((part) => part.split('/'))
    .filter((part) => part && part !== '.');
  return `/${segments.join('/')}`;
}

function findLatestRelease(siteDir: string, dir: string, baseUrl: string): ReleasePage | undefined {
  const absDir = path.join(siteDir, dir);
  if (!fs.existsSync(absDir)) return undefined;

  // 文档 id 是相对 docs 根目录的路径，默认 docs 根目录就在版本目录的上一层
  const docsRoot = path.dirname(dir);
  const pages: ReleasePage[] = [];

  for (const entry of fs.readdirSync(absDir, {withFileTypes: true})) {
    if (!entry.isFile()) continue;
    const match = VERSION_FILE.exec(entry.name);
    if (!match) continue;

    const source = fs.readFileSync(path.join(absDir, entry.name), 'utf8');
    const meta = FRONT_MATTER.exec(source)?.[1] ?? '';
    if (frontMatterField(meta, 'draft') === 'true') continue;

    const docId = path
      .relative(docsRoot, path.join(dir, entry.name))
      .replace(/\.md$/, '')
      .split(path.sep)
      .join('/');
    const slug = frontMatterField(meta, 'slug');
    const route = slug
      ? slug.startsWith('/')
        ? joinUrl(baseUrl, slug)
        : joinUrl(baseUrl, path.posix.dirname(docId), slug)
      : joinUrl(baseUrl, docId);

    pages.push({route, version: [Number(match[1]), Number(match[2])]});
  }

  // 新版本在前：先比年份，再比版本号
  pages.sort((a, b) => b.version[0] - a.version[0] || b.version[1] - a.version[1]);
  return pages[0];
}

export default function latestReleasePlugin(context: LoadContext, options: Options = {}): Plugin {
  const {siteDir, baseUrl} = context;
  const dir = options.dir ?? 'docs/release-notes';
  const latest = findLatestRelease(siteDir, dir, baseUrl);

  if (!latest) {
    console.warn(
      `[latest-release] 在 ${dir} 下没有找到版本页（形如 2027-5.md），/release-notes 不会自动跳转。`,
    );
  }

  return {
    name: 'latest-release',
    injectHtmlTags: () =>
      latest
        ? {
            headTags: [
              {
                tagName: 'meta',
                attributes: {name: 'qk-latest-release', content: latest.route},
              },
            ],
          }
        : {},
  };
}
