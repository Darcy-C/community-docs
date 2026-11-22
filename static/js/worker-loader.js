/**
 * 站内搜索的 Worker 中转（Worker 侧）。
 *
 * 旧浏览器缺少 globalThis、ES2019（Object.fromEntries / Array.flat 等）和
 * Promise.allSettled，这里用官方 polyfill 服务补齐，再加载真正的 Worker 脚本。
 * polyfill 地址由页面侧通过 ?polyfill= 参数传入，不在这里重复维护。
 * 新浏览器不会走到这里。
 */
var params = new URL(self.location.href).searchParams;
var polyfillUrl = params.get('polyfill');
var target = params.get('url');

var needsPolyfill =
  typeof globalThis === 'undefined' ||
  typeof Object.fromEntries !== 'function' ||
  typeof Array.prototype.flat !== 'function' ||
  typeof Promise.allSettled !== 'function';

if (needsPolyfill && polyfillUrl) {
  importScripts(polyfillUrl);
}

if (target) {
  importScripts(target);
}
