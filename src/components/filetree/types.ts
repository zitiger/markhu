export interface DragDropObject {
    drag: any;
    drop: any;
    position: Position;
}

export interface TreeNode {
    title: string,
    path: string,
    type: string,
    expanded?: boolean,
    selected?: boolean,
    focused?: boolean,
    children?: TreeNode[],
    addingFile?: boolean,
    addingFolder?: boolean,
    editing?: boolean
}

export enum Position {
    ABOVE = 'above',
    IN = 'in',
    BELOW = 'below'
}
