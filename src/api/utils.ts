import { getContentApi } from "./file.js";
import { path } from "@tauri-apps/api";
import {FileInfo} from "./model";

// 定义一个接口来描述文件或文件夹的信息


// 定义一个接口来描述搜索结果的信息
interface SearchRes {
    originDesc: string;
    origin: string;
    originPath: string;
    desc: string[];
    position: { start: number; end: number }[];
}

export function throttle(func: (content: any) => void, delay: number): (content: any) => void {
    let prev = 0;

    return (content) => {
        let now = +new Date();
        if (now - prev >= delay) {
            func.call(null, content);
            prev = now;
        }
    }
}



/**
 * count: number,
 * file_path: 完全路径,
 * update_time: 修改时间
 */
export function handleFolderRes2(res: FileInfo[]): FileInfo[] {
    const MdReg = /\.md$/;
    if (!res.length) {
        return res;
    }
    let result: FileInfo[] = [];
    for (let val of res) {
        let { count,   filePath,   updateTime } = val;
        let title = filePath.split(path.sep).pop() as string;
        if (!MdReg.test(title)) continue;
        title = title.replace(MdReg, "");
        result.push({
            count,
            filePath, children: [], isFile: false, createTime: 0,updateTime: 0
        })
    }

    return result;
}



function getMatchPosition(text: string, fileContent: string): { start: number; end: number }[] {
    let reg = new RegExp(text, 'g');
    let match, res = [];
    while (match = reg.exec(fileContent)) {
        if (match) {
            let start = (match.index - 10) < 0 ? 0 : match.index - 10;
            let end = match.index + text.length + 10 > fileContent.length ? fileContent.length : match.index + text.length + 10;
            res.push({
                start,
                end,
            })
        }
    }

    return res;
}
