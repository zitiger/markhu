# MarkHu

MarkHu 是一个 Markdown 编辑器，也是一个基于文件系统的笔记系统。它是一个桌面应用，支持 Mac，Windows 和 Linux。它基于 Tauri，一个使用 Rust+Vue3+Ant Design Vue+Vditor 的框架。

## 功能

- 三种编辑模式：所见即所得（WYSIWYG），即时渲染（IR），分屏预览（SV）。你可以根据你的喜好和屏幕大小切换不同的模式。
- 拖拽或者粘贴剪切板上传图片。图片会存储在本地，和 Markdown 文件在同一个文件夹。
- 自动保存内容，防止意外丢失。你也可以使用快捷键保存、打开或者创建新文件。
- 粘贴 HTML 并自动转换为 Markdown。这对于从网页或者其他来源复制内容很有用。
- 多语言支持，内置中文、英文等本地化。
- 多主题支持，内置 Dark 和 Light 主题，或者跟随系统主题。

## 架构（技术栈）

MarkHu 使用了以下技术：

- [Tauri]，一个用于构建所有主流桌面平台的小巧、高速的二进制文件的框架。
- [Rust]，一种让每个人都能构建可靠和高效软件的语言。
- [Vue 3]，一个用于构建用户界面的渐进式框架。
- [Ant Design Vue]，一套高质量的 Vue 组件库。
- [Vditor]，一个用 TypeScript 编写的开源 Markdown 编辑器。

## 如何运行这个项目

要运行这个项目，你需要在你的系统上安装 [yarn]。然后按照以下步骤操作：

1. 克隆这个仓库：`git clone https://github.com/zitiger/markhu.git`
2. 进入项目目录：`cd markhu`
3. 安装依赖：`yarn install`
4. 启动开发服务器：`yarn tauri dev`
5. 享受使用 MarkHu 编辑 Markdown 文件吧！

## 如何下载软件

如果你想下载预编译好的二进制文件，你可以去 [发布页面] 选择最新版本。然后下载对应平台的文件并在你的系统上运行。

或者，你也可以使用以下链接直接下载软件：

- [MarkHu for Mac] https://github.com/zitiger/markhu/releases
- [MarkHu for Windows] https://github.com/zitiger/markhu/releases
- [MarkHu for Linux] https://github.com/zitiger/markhu/releases

我希望这能够帮助你完成你的项目。如果你有任何反馈或者建议，请随时联系我。
