// The separator based on the operating system.
const sep = /Win\d{2}|Windows/.test(navigator.userAgent) ? '\\' : '/';

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
function join(...paths: string[]): string {
    const joinedPath = paths.join(sep);
    return joinedPath.replace(/[/\\]{2,}/g, sep);
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
function basename(path: string): string {
    let trimmedPath = path;
    while (trimmedPath.endsWith(sep)) {
        trimmedPath = trimmedPath.slice(0, trimmedPath.length - 1);
    }
    const parts = trimmedPath.split(sep);
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
function dirname(path: string): string {
    let trimmedPath = path;
    while (trimmedPath.endsWith(sep)) {
        trimmedPath = trimmedPath.slice(0, trimmedPath.length - 1);
    }
    const parts = trimmedPath.split(sep);
    return parts.slice(0, -1).join(sep);
}

export default {
    join,
    basename,
    dirname,
    sep
};
