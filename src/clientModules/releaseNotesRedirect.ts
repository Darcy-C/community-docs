/**
 * /release-notes/ 是一个中转页：直接跳到最新版本页，避免用户还要自己点一次。
 * 发新版本时只需要改这里的 LATEST。
 */

export const LATEST_RELEASE_PATH = '/release-notes/2027-6';

export function onRouteDidUpdate({location}: {location: {pathname: string}}): void {
  if (typeof window === 'undefined') return;
  const path = location.pathname.replace(/\/+$/, '');
  if (path === '/release-notes') {
    window.location.replace(LATEST_RELEASE_PATH);
  }
}
