# MarkHu 📝

MarkHu是一个桌面应用，让你可以编辑和管理你的Markdown文件和笔记。它支持Mac，Windows和Linux平台。它基于[Tauri]，一个提供轻量级和安全的方式来创建跨平台桌面应用的框架。
它使用[Vue3]作为前端框架，[Ant Design Vue]作为UI库，[Vditor]作为Markdown编辑器。

![MarkHu截图](#graphic_art("MarkHu的截图"))

## 功能 🚀

- 三种编辑模式：WYSIWYG（所见即所得），IR（即时渲染），和SV（分屏预览）。你可以根据你的喜好和屏幕大小切换它们。🔄
- 拖拽或者从剪切板粘贴上传图片。你也可以从本地或远程源插入图片。🖼️
- 自动保存内容，防止意外丢失。你也可以把你的文件导出为HTML或PDF。💾
- 粘贴HTML并自动转换为Markdown。你也可以把Markdown复制为HTML。📋
- 多语言支持，内置中文，英文和其他本地化。🌐
- 多主题支持，内置暗色，亮色主题，或者跟随系统主题。🎨

## 架构（技术栈） 🏗️

MarkHu使用以下技术构建：

- [Tauri]：一个允许你使用网络技术构建原生应用的框架。它提供了一种轻量级和安全的方式来创建跨平台桌面应用。
- [Rust]：一种提供性能，可靠性和生产力的编程语言。它用来编写MarkHu的核心逻辑，并与文件系统和原生API交互。
- [Vue3]：一个用于构建用户界面的渐进式框架。它用来创建MarkHu的前端，并提供响应性和组合特性。
- [Ant Design Vue]：一个遵循Ant Design规范并提供一套高质量组件的UI库。
- [Vditor]：一个基于浏览器的Markdown编辑器，支持WYSIWYG，IR和SV模式。它还提供了丰富的功能，如图片上传，代码高亮，图表，数学，mermaid等。

## 如何运行这个项目 🏃‍♂️

要运行这个项目，你需要在你的系统上安装[Node.js]，[Yarn]和[Rust]。然后按照以下步骤：

1. 克隆这个仓库：`git clone https://github.com/zitiger/markhu.git`
2. 进入项目目录：`cd markhu`
3. 安装依赖：`yarn install`
4. 运行开发服务器：`yarn tauri dev`
5. 享受吧！😊

## 如何下载软件 💻

如果你想下载软件而不需要自己构建，你可以去[Release页面]下载最新版本的软件。你也可以在那里查看更新日志和以前的版本。

## 反馈和贡献 💬

如果你对MarkHu有任何反馈，建议或问题，请随时在GitHub上开启一个issue或者一个pull request。我感谢你的帮助和支持！🙏

感谢你使用MarkHu！希望你喜欢它！😄
