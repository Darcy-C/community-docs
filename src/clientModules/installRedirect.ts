/**
 * /install 是安装说明的入口页：按浏览器报告的操作系统跳到对应平台的安装页，
 * 认不出来就用 macOS（社区版最早支持的平台）。
 *
 * 平台页的地址在这里集中维护，新增平台时只改这一处。
 */

const PLATFORMS = {
  macos: '/install/macos',
  linux: '/install/linux',
} as const;

/** 浏览器 UA 判断平台；Android 的 UA 里也带 Linux，先排除掉 */
function platformPath(): string {
  if (typeof navigator === 'undefined') return PLATFORMS.macos;
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return PLATFORMS.macos;
  if (/Linux/i.test(ua)) return PLATFORMS.linux;
  return PLATFORMS.macos;
}

export function onRouteDidUpdate({location}: {location: {pathname: string}}): void {
  if (typeof window === 'undefined') return;
  const path = location.pathname.replace(/\/+$/, '');
  if (path !== '/install') return;

  const target = platformPath();
  if (target === path) return;
  window.location.replace(target);
}
