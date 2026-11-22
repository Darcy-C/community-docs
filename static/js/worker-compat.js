/**
 * 站内搜索的 Worker 中转（页面侧）。
 *
 * Worker 不会自动加载页面上的 polyfill。这里把 Worker 交给同源的
 * worker-loader.js：它先用官方 polyfill 服务补齐缺失的 API，再执行原脚本。
 * polyfill 地址由 docusaurus.config.ts 通过 ?polyfill= 参数传进来，只维护一处。
 * 只在第一次使用搜索时才会创建 Worker，所以对普通页面没有额外开销。
 */
(function (global) {
  'use strict';

  if (typeof global.Worker !== 'function' || typeof global.document === 'undefined') {
    return;
  }

  // 本文件排在官方 polyfill 之前执行，所以这里看到的就是浏览器的真实能力。
  // 新浏览器不需要中转，保持原生 Worker 行为。
  var needsWorkerPolyfill =
    typeof global.globalThis === 'undefined' ||
    typeof Object.fromEntries !== 'function' ||
    typeof Array.prototype.flat !== 'function' ||
    typeof Promise.allSettled !== 'function';
  if (!needsWorkerPolyfill) {
    return;
  }

  var NativeWorker = global.Worker;
  var currentScript = global.document.currentScript;
  var loaderUrl = currentScript
    ? new URL('worker-loader.js', currentScript.src)
    : new URL('/js/worker-loader.js', global.location.href);
  var polyfillUrl = currentScript
    ? new URL(currentScript.src).searchParams.get('polyfill')
    : null;

  global.Worker = function Worker(url, options) {
    if (options && options.type === 'module') {
      return new NativeWorker(url, options);
    }
    var scriptUrl = new URL(url, global.document.baseURI).href;
    var proxied = loaderUrl.origin + loaderUrl.pathname + '?url=' + encodeURIComponent(scriptUrl);
    if (polyfillUrl) {
      proxied += '&polyfill=' + encodeURIComponent(polyfillUrl);
    }
    return new NativeWorker(proxied, options);
  };
  global.Worker.prototype = NativeWorker.prototype;
})(typeof self !== 'undefined' ? self : this);
