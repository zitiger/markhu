import type {TreeNode} from "./types";

export function findNodeByPath(node: TreeNode, targetPath: string): TreeNode | null {

    if (node.path === targetPath) {
        return node;
    }

    if (node.children && node.children.length > 0) {
        for (const n of node.children) {
            const foundNode = findNodeByPath(n, targetPath);
            if (foundNode) {
                return foundNode;
            }
        }
    }

    return null;
}

export function findParentNodeByPath(parentNode: TreeNode, path: string): TreeNode | null {
    if (!parentNode || !parentNode.children || parentNode.children.length === 0) {
        return null;
    }

    for (const child of parentNode.children) {
        if (child.path === path) {
            return parentNode;
        }

        const node = findParentNodeByPath(child, path);
        if (node) {
            return node;
        }
    }

    return null;
}

export function findIndexByPath(data: TreeNode[], path: string): number {
    if (!data) {
        return 0;
    }
    for (let i = 0; i < data.length; i++) {
        if (data[i].path === path) {
            return i;
        }
    }
    return 0;
}

export function sep(paths: string | string[]): string {
    if (Array.isArray(paths)) {
        for (const path of paths) {
            if (path.includes('/')) {
                return '/';
            } else if (path.includes('\\')) {
                return '\\';
            }
        }
    } else {
        if (paths.includes('/')) {
            return '/';
        } else if (paths.includes('\\')) {
            return '\\';
        }
    }

    return /Win\d{2}|Windows/.test(navigator.userAgent) ? '\\' : '/';
}


/**
 * Joins multiple paths together using the appropriate separator.
 * @param {...string} paths - The paths to join.
 * @returns {string} The joined path.
 *
 * @example
 * // Example usage:
 * const joinedPath1 = join('path', 'to', 'file.txt');
 * // joinedPath1: "path/to/file.txt"
 *
 * const joinedPath2 = join('path/', '/to', '/file.txt');
 * // joinedPath2: "path/to/file.txt"
 */
export function join(...paths: string[]): string {
    const separator = sep(paths)
    const joinedPath = paths.join(separator);
    return joinedPath.replace(/[/\\]{2,}/g, separator);
}

/**
 * Gets the base name of a path.
 * @param {string} path - The path.
 * @returns {string} The base name of the path.
 *
 * @example
 * // Example usage:
 * const path1 = '/path/to/file.txt';
 * const baseName1 = basename(path1);
 * // baseName1: "file.txt"
 *
 * const path2 = 'C:\\path\\to\\file.txt';
 * const baseName2 = basename(path2);
 * // baseName2: "file.txt"
 */
export function basename(path: string): string {
    const separator = sep(path)

    let trimmedPath = path;
    while (trimmedPath.endsWith(separator)) {
        trimmedPath = trimmedPath.slice(0, trimmedPath.length - 1);
    }
    const parts = trimmedPath.split(separator);
    return parts[parts.length - 1];
}

/**
 * Gets the directory name of a path.
 * @param {string} path - The path.
 * @returns {string} The directory name of the path.
 *
 * @example
 * // Example usage:
 * const path1 = '/path/to/file.txt';
 * const dirName1 = dirname(path1);
 * // dirName1: "/path/to"
 *
 * const path2 = 'C:\\path\\to\\file.txt';
 * const dirName2 = dirname(path2);
 * // dirName2: "C:\\path\\to"
 */
export function dirname(path: string): string {

    const separator = sep(path)
    let trimmedPath = path;
    while (trimmedPath.endsWith(separator)) {
        trimmedPath = trimmedPath.slice(0, trimmedPath.length - 1);
    }
    const parts = trimmedPath.split(separator);
    return parts.slice(0, -1).join(separator);
}

/**
 * Gets the extension name of a file path.
 * @param {string} path - The file path.
 * @returns {string} The extension name of the file path.
 *
 * @example
 * // Example usage:
 * const path1 = '/path/to/file.txt';
 * const extName1 = extname(path1);
 * // extName1: ".txt"
 *
 * const path2 = 'C:\\path\\to\\file.txt';
 * const extName2 = extname(path2);
 * // extName2: ".txt"
 */
export function extname(path: string): string {
    const separator = sep(path);
    const baseName = basename(path);
    const parts = baseName.split('.');
    if (parts.length > 1) {
        return parts[parts.length - 1];
    }
    return '';
}
