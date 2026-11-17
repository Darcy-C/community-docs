/**
 * /release-notes/ 是一个中转页：直接跳到最新版本页，避免用户还要自己点一次。
 *
 * 最新版本不写死：构建时 plugins/latest-release 会扫描 docs/release-notes/*.md，
 * 把最新页面的地址写进 <meta name="qk-latest-release">，这里读出来跳转即可。
 * 发新版本时只需要新增版本页，不用改这里的代码。
 */

const LATEST_RELEASE_META = 'meta[name="qk-latest-release"]';

/** 读取构建时注入的最新版本地址；没有就返回 null，宁可不跳也不猜一个可能不存在的地址 */
function latestReleasePath(): string | null {
  if (typeof document === 'undefined') return null;
  const meta = document.querySelector<HTMLMetaElement>(LATEST_RELEASE_META);
  const path = meta?.content.trim();
  return path ? path : null;
}

export function onRouteDidUpdate({location}: {location: {pathname: string}}): void {
  if (typeof window === 'undefined') return;
  const path = location.pathname.replace(/\/+$/, '');
  if (path !== '/release-notes') return;

  const target = latestReleasePath();
  if (!target || target === path) return;
  window.location.replace(target);
}
