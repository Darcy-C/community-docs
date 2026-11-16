#!/usr/bin/env node
/**
 * 生成「模块实现进度」表格。
 *
 * 数据来源（需要两个仓库并排存放）：
 *   ../QuickerCommunityEdition/app/resources/others/ce_impl_map.json
 *   ../QuickerCommunityEdition/app/resources/others/qk_module_sig/module_defs.json
 *   ../QuickerCommunityEdition/app/runner/meta.py            (模块分组)
 *   ../QuickerCommunityEdition/app/runner/interpreter.py     (在解释器里实现的模块)
 *   ../QuickerCommunityEdition/app/linux/support.py          (Linux 隐藏项)
 *   ../QuickerCommunityEdition/app/runner/ce_module_defs/*.py (CE 独有模块)
 *
 * 用法：
 *   node tools/gen-module-status.mjs            # 打印 markdown
 *   node tools/gen-module-status.mjs --write    # 写入 docs/xaction/module-progress.md
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(here, '..');
const appRoot = process.env.QK_APP_ROOT || path.resolve(docsRoot, '..', 'QuickerCommunityEdition');

const read = (...p) => fs.readFileSync(path.join(appRoot, ...p), 'utf8');
const readJson = (...p) => JSON.parse(read(...p));

const implMap = readJson('app', 'resources', 'others', 'ce_impl_map.json').data;
const defs = readJson('app', 'resources', 'others', 'qk_module_sig', 'module_defs.json');
const metaSrc = read('app', 'runner', 'meta.py');
const interpreterSrc = read('app', 'runner', 'interpreter.py');
const linuxSrc = read('app', 'linux', 'support.py');

// ---- 分组 ----
const GROUP_TITLES = ['流程指挥舱', '模拟机械臂', 'Quicker 组件', '信息保障区', '其他'];
const groupsBlock = metaSrc.slice(
  metaSrc.indexOf('_g_module_group_keys'),
  metaSrc.indexOf('def ', metaSrc.indexOf('_g_module_group_keys')),
);
const groupLists = [...groupsBlock.matchAll(/\[([^[\]]*)\]/g)].map((m) =>
  [...m[1].matchAll(/"([a-z]+:[^"]+)"/g)].map((x) => x[1]),
);
const groupOf = new Map();
groupLists.forEach((list, groupIndex) => list.forEach((k) => groupOf.set(k, GROUP_TITLES[groupIndex] ?? '其他')));

// ---- 解释器里直接实现的模块 ----
const loopBlock = interpreterSrc.slice(interpreterSrc.indexOf('ModulesImplementedInLoop'));
const loopModules = new Set(
  [...loopBlock.slice(0, loopBlock.indexOf(']')).matchAll(/"([a-z]+:[^"]+)"/g)].map((m) => m[1]),
);

// ---- Linux 隐藏 ----
const unsupportedBlock = linuxSrc.slice(linuxSrc.indexOf('_UNSUPPORTED_MODULES'));
const linuxUnsupported = new Set(
  [...unsupportedBlock.slice(0, unsupportedBlock.indexOf(')')).matchAll(/"([a-z]+:[^"]+)"/g)].map((m) => m[1]),
);

// ---- CE 独有模块 ----
const poPath = path.join(appRoot, 'tasks', 'i18n', 'locale', 'app', 'zh.po');
const poMap = new Map();
if (fs.existsSync(poPath)) {
  let msgid = null;
  for (const line of fs.readFileSync(poPath, 'utf8').split('\n')) {
    const id = line.match(/^msgid\s+"(.*)"$/);
    const str = line.match(/^msgstr\s+"(.*)"$/);
    if (id) msgid = id[1];
    else if (str && msgid) {
      if (str[1]) poMap.set(msgid, str[1]);
      msgid = null;
    }
  }
}
const zh = (s) => poMap.get(s) ?? s;

const ceDir = path.join(appRoot, 'app', 'runner', 'ce_module_defs');
const ceModules = new Map();
for (const file of fs.readdirSync(ceDir)) {
  if (!file.endsWith('.py') || file === '__init__.py') continue;
  const src = fs.readFileSync(path.join(ceDir, file), 'utf8');
  const key = src.match(/Key\s*=\s*"([^"]+)"/)?.[1];
  const name = src.match(/Name\s*=\s*(?:_\()?"([^"]+)"/)?.[1];
  if (key?.startsWith('ce:')) ceModules.set(key, zh(name ?? key));
}

// ---- 组装 ----
const rows = [];
const names = new Map(defs.map((d) => [d.Key, d.Name]));

for (const [key, detail] of Object.entries(implMap)) {
  const flags = [...Object.values(detail.IN ?? {}), ...Object.values(detail.OUT ?? {})];
  const done = flags.filter(Boolean).length;
  rows.push({
    key,
    name: names.get(key) ?? key,
    group: groupOf.get(key) ?? '其他',
    impl: flags.length === 0 ? (detail._is_avaiable ? '内置' : '—') : `${done}/${flags.length}`,
    available: detail._is_avaiable || done > 0,
  });
}
for (const key of loopModules) {
  if (rows.some((r) => r.key === key)) continue;
  rows.push({key, name: names.get(key) ?? key, group: groupOf.get(key) ?? '其他', impl: '内置', available: true});
}
for (const [key, name] of ceModules) {
  rows.push({key, name, group: groupOf.get(key) ?? '其他', impl: 'ce', available: true});
}

const byGroup = new Map(GROUP_TITLES.map((g) => [g, []]));
for (const row of rows) byGroup.get(row.group)?.push(row);
for (const list of byGroup.values()) list.sort((a, b) => a.name.localeCompare(b.name, 'zh'));

const available = rows.filter((r) => r.available);
const summary = [
  `共 **${rows.length}** 个模块，其中 **${available.length}** 个在社区版可用`,
  `（${new Set(available.filter((r) => linuxUnsupported.has(r.key)).map((r) => r.key)).size} 个仅 macOS，Linux 下隐藏）。`,
].join('');

const lines = [];
lines.push('| 模块 | 实现度 | Linux |');
lines.push('| --- | --- | --- |');
for (const title of GROUP_TITLES) {
  const list = byGroup.get(title) ?? [];
  if (list.length === 0) continue;
  lines.push(`| **${title}** | | |`);
  for (const row of list) {
    const linux = row.available ? (linuxUnsupported.has(row.key) ? '❌' : '✅') : '—';
    lines.push(`| ${row.name} | ${row.impl} | ${linux} |`);
  }
}

const md = `---
title: 模块实现进度
sidebar_position: 28
---

社区版没有实现 Windows 版 Quicker 的全部模块。**未实现的模块会被界面直接隐藏**，不会出现在步骤选择器里。

本页由脚本生成：\`node tools/gen-module-status.mjs --write\`（数据来自 \`ce_impl_map.json\`、\`module_defs.json\`、\`meta.py\`、\`linux/support.py\` 与 \`ce_module_defs/\`）。

**实现度** 指该模块已实现参数（输入 + 输出）的比例，\`内置\` 表示由解释器直接实现（无独立参数扫描），\`ce\` 表示社区版独有模块（始终可用）。

${summary}

${lines.join('\n')}
`;

if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(docsRoot, 'docs', 'xaction', 'module-progress.md'), md, 'utf8');
  console.log('written docs/xaction/module-progress.md');
} else {
  process.stdout.write(md);
}
