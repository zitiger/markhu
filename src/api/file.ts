import {invoke} from "@tauri-apps/api";
import {listen} from "@tauri-apps/api/event";
import {FileInfo} from "./model";

export interface RustFileInfo {
    count: number;
    file_path: string;
    create_time: number;
    update_time: number;
    is_file: boolean; // 可选属性，表示是否是文件
    children: RustFileInfo[]; // 可选属性，表示子文件或文件夹
}

// 定义一个接口来描述文件或文件夹的信息

// 定义一个类型别名来描述事件映射对象
type EventMap = Record<string, () => void>;

export async function createDirApi(path: string): Promise<string> {
    try {
        let res = await invoke('create_dir', {
            path
        }) as string;

        return res;
    } catch (e) {
        return Promise.reject(e);
    }
}


export async function createFileApi(path: string): Promise<string> {
    try {
        let res = await invoke('create_file', {
            path
        }) as string;

        return res;
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function readFolderApi(dirPath: string): Promise<FileInfo[]> {
    try {
        let res = await invoke("read_folder", {
            event: dirPath
        }) as RustFileInfo[];

        let converted = convert(res);
        return converted;
    } catch (e) {
        //return Promise.reject(e);
        return JSON.parse("[{\"count\":0,\"filePath\":\"/Users/zitiger/Downloads/md文档/.lock\",\"createTime\":1689202159540,\"updateTime\":1689202159540,\"isFile\":true,\"children\":[]},{\"count\":6148,\"filePath\":\"/Users/zitiger/Downloads/md文档/.DS_Store\",\"createTime\":1688874705150,\"updateTime\":1689260585799,\"isFile\":true,\"children\":[]},{\"count\":160,\"filePath\":\"/Users/zitiger/Downloads/md文档/请从这里开始\",\"createTime\":1689156705531,\"updateTime\":1689254507711,\"isFile\":false,\"children\":[{\"count\":6148,\"filePath\":\"/Users/zitiger/Downloads/md文档/请从这里开始/.DS_Store\",\"createTime\":1689156710959,\"updateTime\":1689260590820,\"isFile\":true,\"children\":[]},{\"count\":17,\"filePath\":\"/Users/zitiger/Downloads/md文档/请从这里开始/内容块2222222222222222222222222222222222222.md\",\"createTime\":1689156696000,\"updateTime\":1689156696000,\"isFile\":true,\"children\":[]},{\"count\":128,\"filePath\":\"/Users/zitiger/Downloads/md文档/请从这里开始/内容块\",\"createTime\":1689156705531,\"updateTime\":1689260591460,\"isFile\":false,\"children\":[{\"count\":6148,\"filePath\":\"/Users/zitiger/Downloads/md文档/请从这里开始/内容块/.DS_Store\",\"createTime\":1689260590816,\"updateTime\":1689260590816,\"isFile\":true,\"children\":[]},{\"count\":4188,\"filePath\":\"/Users/zitiger/Downloads/md文档/请从这里开始/内容块/内容块类型内容块类型内容块类型内容块类型内容块类型内容块类型内容块类型.md\",\"createTime\":1689156696000,\"updateTime\":1689156696000,\"isFile\":true,\"children\":[]}]}]}]")
    }
}

function convert(a: RustFileInfo[]): FileInfo[] {

    if (a == null) {
        return []
    }

    let b: FileInfo[] = []; // 创建一个空数组
    for (let item of a) { // 遍历a中的每个元素
        let {count, file_path, create_time, update_time, is_file, children} = item; // 解构赋值
        let filePath = file_path; // 重命名
        let createTime = create_time; // 重命名
        let updateTime = update_time; // 重命名
        let isFile = is_file; // 重命名
        let newChildren = convert(children); // 递归转换子数组
        b.push({count, filePath, createTime, updateTime, isFile, children: newChildren}); // 把新对象添加到b中
    }
    return b; // 返回b
}

export async function saveContentApi(filepath: string, content: string): Promise<string> {
    try {
        let res = await invoke("save_content", {
            filepath,
            content
        }) as string;

        return res;
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function getContentApi(filepath: string): Promise<string> {
    try {
        let res = await invoke("get_content", {
            filepath
        }) as string;

        return res;
    } catch (e) {
        return "Promise.reject(e)";
    }
}

export async function listenMenuEvent(eventMap: EventMap): Promise<void> {
    try {
        await listen<string>('top_menu_event', async ({event, payload}) => {
            try {
                if (eventMap[payload]) await eventMap[payload]();
            } catch (e) {
                console.log("handle error=======", e);
            }
        });
    } catch (e) {
        console.log("listen do for file error", e);
    }
}

export async function renameApi(from: string, to: string) {

    try {
        let res = await invoke("rename_file", {
            from,
            to
        });
        return (res);
    } catch (e) {

        Promise.reject(e);
    }
}

export async function removeFileApi(path: string) {

    try {
        let res = await invoke("remove_file", {
            path
        });
        return (res);
    } catch (e) {
        return Promise.reject(e);
    }
}


export async function removeDirApi(path: string) {

    try {
        let res = await invoke("remove_dir_all", {
            path
        });
        return (res);
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function existPath(path: string) {

    try {
        let res = await invoke("exist_path", {
            path
        }) as boolean;
        return (res);
    } catch (e) {

        return Promise.reject(e);
    }
}


export async function saveImageApi(path: string, data: any): Promise<void> {
    try {
        await invoke('save_image', {path, data});
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

export async function showInFolder(path:string) {

    try {
        await invoke('show_in_folder', {path});
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

export async function changeMenuTitle(id:string, title:string) {
    try {
        await invoke('change_menu_title',{id, title});
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}
export async function setMenuSelected(id:string, selected:boolean) {
    try {
        await invoke('set_menu_selected',{id, selected});
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}
export async function moveToTrashApi(path:string) {
    try {
        await invoke('move_to_trash',{path});
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

