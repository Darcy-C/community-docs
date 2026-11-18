import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {PluginOptions as LocalSearchOptions} from '@easyops-cn/docusaurus-search-local';

// 把 markdown 图片的 alt 文字渲染成图片下方的图注（见 plugins/image-caption/index.ts）
import rehypeImageCaption from './plugins/image-caption';

// 把 [card](./xxx.md) 这样的站内链接渲染成文档卡片（见 plugins/link-card/）
import remarkLinkCard from './plugins/link-card';
import rehypeLinkCard from './plugins/link-card/rehype';

// 部署时可以不改代码，直接用环境变量覆盖站点地址。
const siteUrl = process.env.DOCUSAURUS_URL || 'https://community-docs.example.com';
const repoUrl = process.env.DOCUSAURUS_REPO || 'https://github.com/Darcy-C/community-docs';

const config: Config = {
  title: 'Quicker 社区版 文档',
  tagline: 'Quicker Community Edition 使用说明与开发参考',
  favicon: 'img/favicon.ico',
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        href: '/img/apple-touch-icon.png',
      },
    },
  ],
  future: {
    v4: true,
  },

  url: siteUrl,
  baseUrl: '/',
  organizationName: 'QuickerOrg',
  projectName: 'community-docs',

  onBrokenLinks: 'throw',

  markdown: {
    // 文档是纯 Markdown：md 按 CommonMark 解析，保留原文 HTML 与 { } 字符。
    format: 'detect',
    mermaid: true,
  },
  plugins: [
    // 构建时扫描 docs/release-notes/，把最新版本页的地址注入页面（见 src/clientModules/releaseNotesRedirect.ts）
    './plugins/latest-release/index.ts',
  ],
  clientModules: [
    './src/clientModules/docImages.ts',
    // /release-notes/ 自动跳到最新版本页
    './src/clientModules/releaseNotesRedirect.ts',
    // /install 自动跳到 macOS 或 Linux 的安装页
    './src/clientModules/installRedirect.ts',
  ],
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: 'filename',
        language: ['en', 'zh'],
        docsRouteBasePath: '/',
        indexBlog: false,
        indexPages: false,
      } satisfies LocalSearchOptions,
    ],
  ],
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: repoUrl + '/tree/main/',
          // 卡片要先拿到目标文档的相对路径（之后会被解析成路由），所以放在默认插件之前
          beforeDefaultRemarkPlugins: [remarkLinkCard],
          rehypePlugins: [rehypeLinkCard, rehypeImageCaption],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/apple-touch-icon.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Quicker 社区版 文档',
      logo: {
        alt: 'Quicker',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {to: '/', label: '介绍', position: 'left'},
        {to: '/settings', label: '设置页说明', position: 'left'},
        {to: '/xaction/module-progress', label: '组合动作', position: 'left'},
        {to: '/tech/tech-stack', label: '技术话题', position: 'left'},
        {to: '/release-notes', label: '版本更新', position: 'left'},
        {type: 'search', position: 'right'},
        {href: 'https://getquicker.net', label: 'Quicker 官网', position: 'right'},
        {href: repoUrl, label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'light',
      links: [
        {label: '安装', to: '/install'},
        {label: '设置页说明', to: '/settings'},
        {label: '组合动作', to: '/xaction/module-progress'},
        {label: '版本更新', to: '/release-notes'},
        {label: 'Quicker 官网', href: 'https://getquicker.net'},
        {label: 'GitHub', href: repoUrl},
      ],
      copyright: `© ${new Date().getFullYear()} Quicker Community Edition`,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
      options: {
        fontFamily: '"Microsoft YaHei UI", "PingFang SC", "Noto Sans CJK SC", sans-serif',
        flowchart: {curve: 'basis', padding: 12, nodeSpacing: 36, rankSpacing: 48, htmlLabels: true},
      },
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['csharp', 'powershell', 'python', 'batch'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
