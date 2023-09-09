import {ref} from 'vue';
import {Position} from "./types";
import {dirname, findIndexByPath, findNodeByPath, findParentNodeByPath, join} from "./utils";

export default function useDragDrop(emits) {

    const hoverAboveKey = ref<string>("");
    const hoverInKey = ref<string>("");
    const hoverBelowKey = ref<string>("");

    let drag: TreeNode = null;
    let position = Position.IN;

    function onDragStart(nodeData) {
        drag = nodeData;
    }


    function onDragEnter(e: DragEvent) {
    }


    function onDragOver(e: DragEvent, nodeData) {
        // e.preventDefault();

        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "move";
        }

        if (nodeData?.path === drag.path) {
            return
        }

        position = calculateDropPosition(e, nodeData?.type);

        clearHover();
        if (position === Position.ABOVE) {
            hoverAboveKey.value = nodeData.path;
        } else if (position === Position.BELOW) {
            // when a folder is expanded, there is no below position
            if (nodeData.type == "file" || !nodeData.expanded) {
                hoverBelowKey.value = nodeData.path;
            }
        } else {
            hoverInKey.value = nodeData.path;
        }
    }

    function clearHover() {
        hoverAboveKey.value = "";
        hoverInKey.value = "";
        hoverBelowKey.value = "";
    }

    function calculateDropPosition(e: DragEvent, type: string): Position {
        const targetElement = e.target as HTMLElement;
        const offsetTop = getOffset(targetElement).top;
        const offsetHeight = targetElement.offsetHeight;
        const pageY = e.pageY;
        const gapHeight = type === 'folder' ? 0.2 * offsetHeight : 0.5 * offsetHeight;

        if (pageY >= offsetTop + offsetHeight - gapHeight) {
            return Position.BELOW;
        }
        if (pageY < offsetTop + gapHeight) {
            return Position.ABOVE;
        }

        return Position.IN;
    }

    function getOffset(ele: HTMLElement) {
        if (!ele.getClientRects().length) {
            return {top: 0, left: 0};
        }
        const rect = ele.getBoundingClientRect();
        if (rect.width || rect.height) {
            const doc = ele.ownerDocument;
            const win = doc.defaultView;
            const docElem = doc.documentElement;
            if (win) {
                return {
                    //元素距离视窗顶部距离，滚动高度，元素边框厚度
                    top: rect.top + win.scrollY - docElem.clientTop,
                    left: rect.left + win.scrollX - docElem.clientLeft
                };
            }
        }
        return rect;
    }

    function onDragLeave(e: DragEvent) {
        clearHover();
    }

    function onDragEnd(e: DragEvent) {
        clearHover();
    }

    const onDrop = (drop: TreeNode, data) => {
        clearHover();

        if (drop.path === drag.path) {
            return
        }

        const dragItem = findNodeByPath(data, drag.path)
        const dropItem = findNodeByPath(data, drop.path)
        if (!dragItem || !dropItem) {
            return;
        }

        // drop item into its own child
        if (dropItem.path.startsWith(dragItem.path)) {
            return;
        }

        // for an expanded folder, there is no below position
        if (dropItem.type === "folder" && dropItem.expanded && position == Position.BELOW) {
            return;
        }

        // remove from source
        const dragParent = findParentNodeByPath(data, dragItem.path);
        if (dragParent && dragParent.children) {
            for (let i = 0; i < dragParent.children.length; i++) {
                if (dragParent.children[i].title === drag.title) {
                    dragParent.children.splice(i, 1);
                }
            }
        }

        const oldPath = dragItem?.path;
        const title = dragItem?.title
        let newPath;

        if (position === Position.IN) {
            if (!dropItem.children) {
                dropItem.children = [];
            }
            dropItem.children.push(dragItem)
            newPath = join(dropItem.path, title);
        } else {

            const parentPath = dirname(dropItem.path)
            const dropItemParent = findNodeByPath(data, parentPath)
            if (!dropItemParent) {
                return;
            }
            if (!dropItemParent.children) {
                dropItemParent.children = [];
            }

            let index = findIndexByPath(dropItemParent.children, dropItem.path);
            if (position === Position.BELOW) {
                index = index + 1;
            }

            dropItemParent.children.splice(index, 0, dragItem)

            newPath = join(dropItemParent.path, title)
        }

        dragItem.path = newPath

        emits("nodeDrop", newPath, oldPath);

        if (newPath !== oldPath) {
            emits("nodeMove", newPath, oldPath);
        }
    }

    return {
        hoverAboveKey, hoverInKey, hoverBelowKey, onDragStart, onDragEnter, onDragOver, onDragLeave, onDragEnd, onDrop
    };
}
