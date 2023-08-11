export interface FileInfo {
    count: number;
    filePath: string;
    createTime: number;
    updateTime: number;
    isFile: boolean; // 可选属性，表示是否是文件
    children: FileInfo[]; // 可选属性，表示子文件或文件夹
}

export interface StructureNode {
    title: string
    path: string
    key:string
    folder: boolean
    children?: StructureNode[]
}
export interface SearchResult {
    filepath: string;
    matches: SearchMatch[];
}
export interface SearchMatch {
    prefix: string;
    suffix: string;
    row_num: number;
}
