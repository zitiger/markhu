
export interface TreeNode {
    title: string,
    path: string,
    type: string,
    // expanded?: boolean,
    // selected?: boolean,
    // focused?: boolean,
    children?: TreeNode[],
    // addingFile?: boolean,
    // addingFolder?: boolean,
    // editing?: boolean,
    level?: number
}

export enum Position {
    ABOVE = 'above',
    IN = 'in',
    BELOW = 'below'
}
