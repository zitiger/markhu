export interface FileInfo {
    filePath: string;
    fileType: string;
    children: FileInfo[]; // 可选属性，表示子文件或文件夹
}

export interface StructureNode {
    title: string,
    path: string,
    type: string,
    expanded?: boolean,
    selected?: boolean,
    focused?: boolean,
    children?: StructureNode[],
    addingFile?: boolean,
    addingFolder?: boolean,
    editing?: boolean
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

export interface OutlineNode {
    title: string;
    key: string;
    children?: OutlineNode[];
}
