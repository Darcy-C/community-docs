"""截取设置窗口的真实界面，用于文档配图（明/暗两套，2x）。

用法（在应用仓库里用它的虚拟环境跑）：

    cd ../QuickerCommunityEdition
    .venv/bin/python ../community-docs/tools/settings-screenshots.py light ../community-docs/static/img/docs/settings
    .venv/bin/python ../community-docs/tools/settings-screenshots.py dark  ../community-docs/static/img/docs/settings

产物：`<outdir>/<page>/light.webp` 与 `<outdir>/<page>/dark.webp`（1960x1520，即 980x760 的 2x）。

要点：
- 用一个一次性的 userdata 目录，避免把个人动作/设置拍进文档，跑完即删。
- 除了切换应用的「主题观察者」，还要设置 QPalette：很多 QLabel 不经过 qss()，
  它们跟随的是系统调色板，不设就会出现「深色背景 + 黑色文字」。
- 窗口设为 WA_DontShowOnScreen，不会真的弹到屏幕上。
"""

import os
import shutil
import sys

from PySide6.QtCore import Qt
from PySide6.QtGui import QColor, QPalette
from PySide6.QtTest import QTest
from PySide6.QtWidgets import QApplication

from app import config

SHOT_USERDATA_NAME = "QuickerCommunityEdition-docscreenshot"

# 1) 一次性 userdata：绝不碰真实数据
config.QK_USERDATA_FOLDER_NAME = SHOT_USERDATA_NAME
shot_userdata = os.path.join(os.path.expanduser("~/Library/Application Support"), SHOT_USERDATA_NAME)
shutil.rmtree(shot_userdata, ignore_errors=True)

app = QApplication(sys.argv)

mode = sys.argv[1]  # light | dark
outdir = sys.argv[2]
os.makedirs(outdir, exist_ok=True)


def apply_palette(theme: str) -> None:
    pal = QPalette()
    if theme == "dark":
        window, base = QColor(45, 45, 46), QColor(30, 30, 31)
        text, disabled = QColor(232, 232, 234), QColor(120, 120, 124)
    else:
        window, base = QColor(246, 246, 247), QColor(255, 255, 255)
        text, disabled = QColor(28, 28, 30), QColor(140, 140, 144)

    pal.setColor(QPalette.ColorRole.Window, window)
    pal.setColor(QPalette.ColorRole.WindowText, text)
    pal.setColor(QPalette.ColorRole.Base, base)
    pal.setColor(QPalette.ColorRole.AlternateBase, window)
    pal.setColor(QPalette.ColorRole.Text, text)
    pal.setColor(QPalette.ColorRole.Button, window)
    pal.setColor(QPalette.ColorRole.ButtonText, text)
    pal.setColor(QPalette.ColorRole.BrightText, QColor(255, 80, 80))
    pal.setColor(QPalette.ColorRole.Highlight, QColor(67, 133, 246))
    pal.setColor(QPalette.ColorRole.HighlightedText, QColor(255, 255, 255))
    pal.setColor(QPalette.ColorRole.ToolTipBase, base)
    pal.setColor(QPalette.ColorRole.ToolTipText, text)
    pal.setColor(QPalette.ColorRole.PlaceholderText, disabled)
    for role in (
        QPalette.ColorRole.WindowText,
        QPalette.ColorRole.Text,
        QPalette.ColorRole.ButtonText,
    ):
        pal.setColor(QPalette.ColorGroup.Disabled, role, disabled)
    app.setPalette(pal)


apply_palette(mode)

from app.services import observer_system_theme as theme  # noqa: E402

theme.observer._set_system_theme(mode)  # type: ignore[arg-type]

from app.settings import feature_event_triggers, feature_power_keys  # noqa: E402

# 开发模式下这些功能会带示例规则，截图时清掉（只影响一次性 userdata）
for _feature in (feature_power_keys.FeaturePowerKeys, feature_event_triggers.FeatureEventTriggers):
    _f = _feature.load()
    _f.records = []
    _f.freeze()

from app.components.scroll_area import ScrollArea  # noqa: E402
from app.components.window_settings_new import (  # noqa: E402
    MainView,
    NavButton,
    WindowSettings,
    nav_data,
)
from app.components.window_settings_new.pages.common import NavButtonData  # noqa: E402

# 设置页 -> 文档里的目录名
SLUGS = {
    "ContentAbout": "about",
    "ContentActionManager": "actions",
    "ContentTheme": "appearance",
    "ContentBlackList": "blacklist",
    "ContentCommon": "configuration",
    "ContentMaintenanceTool": "maintenance",
    "ContentShowPanel": "panel",
    "ContentCircleMenu": "circle-menu",
    "ContentLeftButtonPlus": "left-button",
    "ContentActionAutoRun": "auto-run",
    "ContentActionShortcut": "action-hotkeys",
    "ContentPanelShortcut": "panel-keys",
    "ContentPowerKeys": "power-keys",
    "ContentDbclickHotkey": "dblclick",
    "ContentTextCommand": "text-command",
    "ContentEventTriggers": "event-triggers",
}

w = WindowSettings()
w.setAttribute(Qt.WidgetAttribute.WA_DontShowOnScreen, True)
w.resize(980, 760)
w.show()
QTest.qWait(600)

mv = w.findChild(MainView)
assert mv is not None

# 真实点击左侧按钮：高亮由 NavButton.mousePressEvent 负责，直接调用
# MainView 的槽函数不会更新高亮。
buttons = {b.title: b for b in w.findChildren(NavButton)}

failed = []
for item in nav_data.g_nav_data:
    if not isinstance(item, NavButtonData):
        continue
    slug = SLUGS.get(item.widget_class.__name__)
    if not slug:
        failed.append(f"no slug for {item.widget_class.__name__}")
        continue
    button = buttons.get(item.title)
    if button is None:
        failed.append(f"no nav button for {item.title}")
        continue
    QTest.mouseClick(button, Qt.MouseButton.LeftButton, pos=button.rect().center())
    QTest.qWait(500)
    for sa in w.findChildren(ScrollArea):
        sa.verticalScrollBar().setValue(0)
    QTest.qWait(250)

    page_dir = os.path.join(outdir, slug)
    os.makedirs(page_dir, exist_ok=True)
    path = os.path.join(page_dir, f"{mode}.webp")
    pix = w.grab()  # 视网膜屏下是 2x：980x760 的窗口 -> 1960x1520
    if not pix.save(path, "WEBP", 92):
        failed.append(f"save failed: {path}")
    else:
        print(f"{path}  {pix.width()}x{pix.height()}  {os.path.getsize(path) // 1024}KB")

shutil.rmtree(shot_userdata, ignore_errors=True)

if failed:
    print("\nFAILED:")
    for f in failed:
        print("  " + f)
    sys.exit(1)
