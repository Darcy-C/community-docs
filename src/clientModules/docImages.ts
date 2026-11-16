/**
 * 文档图片的三件事，全部在客户端完成（文档是 CommonMark，用不了 MDX 组件）：
 *
 * 1. 明暗主题切换：<img class="qk-shot" src="..../light.webp" data-dark="..../dark.webp" />
 * 2. 2x 截图按逻辑尺寸显示：自然宽度 >= 1200 的位图视为 2x，显示宽度取一半，
 *    也可以用 data-logical-width="980" 显式指定。
 * 3. 点击放大：所有正文图片点一下弹出大图，点任意处或 Esc 关闭。
 */

const THEME_SELECTOR = 'img.qk-shot[data-dark]';
const ARTICLE_IMG = 'article img';
/** 文档截图基本都在 2x 屏上截的：除很小的图标外，一律按逻辑尺寸（自然宽度的一半）显示 */
const RETINA_MIN_WIDTH = 200;

function currentTheme(): 'light' | 'dark' {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

// ---------------------------------------------------------------- theme swap

function applyTheme(): void {
  if (typeof document === 'undefined') return;
  const theme = currentTheme();
  document.querySelectorAll<HTMLImageElement>(THEME_SELECTOR).forEach((img) => {
    const dark = img.dataset.dark ?? '';
    const light = img.dataset.light ?? img.getAttribute('src') ?? '';
    if (!img.dataset.light && light) img.dataset.light = light;
    const wanted = theme === 'dark' ? dark : light;
    if (wanted && img.getAttribute('src') !== wanted) img.setAttribute('src', wanted);
  });
}

// -------------------------------------------------------------------2x sizing

function fitImage(img: HTMLImageElement): void {
  if (img.dataset.qkSized) return;
  const natural = img.naturalWidth;
  if (!natural) return;

  const explicit = Number(img.dataset.logicalWidth ?? 0);
  const logical = explicit > 0 ? explicit : natural >= RETINA_MIN_WIDTH ? Math.round(natural / 2) : natural;
  if (logical >= natural) return; // 1x 图片：保持原样，别放大

  img.style.width = `${logical}px`;
  img.style.maxWidth = '100%';
  img.style.height = 'auto';
  img.dataset.qkSized = '1';
}

function fitImages(): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll<HTMLImageElement>(ARTICLE_IMG).forEach((img) => {
    if (img.dataset.qkSized) return;
    if (img.complete && img.naturalWidth > 0) fitImage(img);
    else img.addEventListener('load', () => fitImage(img), {once: true});
  });
}

// --------------------------------------------------------------------- zoom

let overlay: HTMLDivElement | null = null;

function ensureOverlay(): HTMLDivElement {
  // 模块可能被 HMR/多次求值执行，DOM 里若已有遮罩就复用，避免叠出第二层
  const existing = document.querySelector<HTMLDivElement>('.qk-zoom-overlay');
  if (existing) {
    overlay = existing;
    return existing;
  }
  const el = document.createElement('div');
  el.className = 'qk-zoom-overlay';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  const big = document.createElement('img');
  big.className = 'qk-zoom-image';
  el.appendChild(big);
  el.addEventListener('click', () => closeZoom());
  document.body.appendChild(el);
  overlay = el;
  return el;
}

function openZoom(src: string, alt: string): void {
  const el = ensureOverlay();
  const big = el.querySelector<HTMLImageElement>('.qk-zoom-image');
  if (!big) return;
  big.src = src;
  big.alt = alt;
  el.classList.add('is-open');
  document.documentElement.classList.add('qk-zoom-locked');
}

function closeZoom(): void {
  document.querySelectorAll('.qk-zoom-overlay.is-open').forEach((el) => el.classList.remove('is-open'));
  overlay?.classList.remove('is-open');
  document.documentElement.classList.remove('qk-zoom-locked');
}

function onDocumentClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null;
  if (!(target instanceof HTMLImageElement)) return;
  if (overlay?.contains(target)) return;
  if (!target.closest('article')) return;
  if (target.closest('a')) return; // 图片链接照常跳转
  if (target.hasAttribute('data-no-zoom')) return;
  event.preventDefault();
  openZoom(target.currentSrc || target.src, target.alt);
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') closeZoom();
}

function start(): void {
  if (typeof document === 'undefined') return;
  // 用 DOM 上的标记而不是模块内变量：模块重复执行时也不会重复绑定
  if (document.documentElement.dataset.qkZoomBound) return;
  document.documentElement.dataset.qkZoomBound = '1';

  document.querySelectorAll('.qk-zoom-overlay').forEach((el, index) => {
    if (index > 0) el.remove(); // 清掉历史遗留的重复遮罩
  });
  overlay = document.querySelector<HTMLDivElement>('.qk-zoom-overlay');

  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeyDown);
  new MutationObserver(() => {
    applyTheme();
    fitImages();
  }).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
}

export function onRouteDidUpdate(): void {
  start();
  applyTheme();
  fitImages();
  closeZoom();
}
