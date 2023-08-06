# MarkHu - Tauri based Markdown editor

MarkHu is a Markdown editor and a file system-based note-taking system. It is a desktop application that supports Mac, Windows, and Linux. It is based on Tauri, a framework that uses Rust+Vue3+Ant Design Vue+Vditor.

## Features

- Three editing modes: WYSIWYG (what you see is what you get), IR (instant rendering), and SV (split view). You can switch between them according to your preference and screen size.
- Drag and drop or paste from clipboard to upload images. The images are stored locally in the same folder as the Markdown file.
- Auto-save content to prevent accidental loss. You can also use keyboard shortcuts to save, open, or create new files.
- Paste HTML and automatically convert it to Markdown. This is useful for copying content from web pages or other sources.
- Multi-language support, with built-in localization for Chinese, English, and more.
- Multi-theme support, with built-in Dark and Light themes, or follow the system theme.

## Architecture (Tech Stack)

MarkHu uses the following technologies:

- [Tauri], a framework for building tiny, blazing fast binaries for all major desktop platforms.
- [Rust], a language empowering everyone to build reliable and efficient software.
- [Vue 3], a progressive framework for building user interfaces.
- [Ant Design Vue], a set of high-quality Vue components out of the box.
- [Vditor], an open source Markdown editor written in TypeScript.

## How to run this project

To run this project, you need to have [yarn] installed on your system. Then follow these steps:

1. Clone this repository: `git clone https://github.com/zitiger/markhu.git`
2. Enter the project directory: `cd markhu`
3. Install the dependencies: `yarn install`
4. Start the development server: `yarn tauri dev`
5. Enjoy editing Markdown files with MarkHu!

## How to download the software

If you want to download the pre-built binaries for your platform, you can go to the [releases page] and choose the latest version. Then download the corresponding file and run it on your system.

Alternatively, you can use the following links to download the software directly:

- [MarkHu for Mac] https://github.com/zitiger/markhu/releases
- [MarkHu for Windows] https://github.com/zitiger/markhu/releases
- [MarkHu for Linux] https://github.com/zitiger/markhu/releases

I hope this helps you with your project. If you have any feedback or suggestions, please feel free to contact me.
