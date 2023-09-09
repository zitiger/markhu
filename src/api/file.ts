import {invoke} from "@tauri-apps/api";
import {listen} from "@tauri-apps/api/event";
import {FileInfo, SearchResult} from "./model";

export interface RustFileInfo {
    file_path: string;
    file_type: string;
    children: RustFileInfo[]; // 可选属性，表示子文件或文件夹
}

// 定义一个接口来描述文件或文件夹的信息

// 定义一个类型别名来描述事件映射对象
type EventMap = Record<string, () => void>;

export async function openFolderApi(): Promise<string> {
    try {
        return await invoke('open_folder') as string;
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function openFileApi(): Promise<string> {
    try {
        return await invoke('open_file') as string;
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function saveFileApi(): Promise<string> {
    try {
        return await invoke('save_file') as string;
    } catch (e) {
        return Promise.reject(e);
    }
}


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
        let {file_path, file_type, children} = item; // 解构赋值
        let filePath = file_path; // 重命名
        let fileType = file_type; // 重命名
        let newChildren = convert(children); // 递归转换子数组
        b.push({filePath, fileType, children: newChildren}); // 把新对象添加到b中
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

export async function showInFolder(path: string) {

    try {
        await invoke('show_in_folder', {path});
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

export async function setMenuSelected(menuId: string, selected: boolean) {
    try {
        await invoke('set_menu_selected', {menuId, selected});
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

export async function moveToTrashApi(path: string) {
    try {
        await invoke('move_to_trash', {path});
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

export async function searchTextApi(path: string, keyword: string, length: number): Promise<SearchResult[]> {
    try {
        let res = await invoke('search_text', {path, keyword, length}) as SearchResult[];

        return res;
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

export async function getTheme(): Promise<string> {
    try {
        let res = await invoke('get_theme') as string;

        return res;
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}


export async function setMenuText(menuId: string, textArray: string[]) {
    try {
        await invoke('set_menu_text', {menuId, textArray});

    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}


export async function changeRecentMenu(filepathArray: string[]) {
    try {
        await invoke('change_recent_menu', {filepathArray});
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

export async function confirmApi(title: string, desc: string, yes: string, no: string) {
    try {
        let res = await invoke('confirm', {title, desc, yes, no}) as string;
        return res;
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

export async function confirmYncApi(title: string, desc: string, yes: string, no: string, cancel: string) {
    try {
        let res = await invoke('confirm_ync', {title, desc, yes, no, cancel}) as string;
        return res;
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

export async function alertApi(title: string, desc: string) {
    try {
        let res = await invoke('alert', {title, desc}) as string;
        return res;
    } catch (error) {
        // 处理错误
        console.error(error);
        throw error;
    }
}

