
export interface TreeNode {
    title: string,
    path: string,
    type: string,
    children?: TreeNode[],
    level?: number
}

export enum Position {
    ABOVE = 'above',
    IN = 'in',
    BELOW = 'below'
}
