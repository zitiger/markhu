<template>
  <div class="file-tree-view" @focusin="onFocusIn" @focusout="onFocusOut" tabindex="0">
    <ul>
      <FileTreeNode :node-data="data" :level="1" @nodeDrop="onNodeDrop" @nodeSelect="onNodeSelect"
                    @fileCreate="onFileCreate" @folderCreate="onFolderCreate" @nodeRename="onNodeRename"
                    @nodeContextmenu="onNodeContextmenu" @nodeExpand="onNodeExpand" @nodeCollapse="onNodeCollapse">
        <template v-slot:title="{nodeData}">
          <slot name="title" :nodeData="nodeData"></slot>
        </template>
        <template v-slot:toggler="{nodeData}">
          <slot name="toggler" :nodeData="nodeData"></slot>
        </template>
        <template v-slot:icon="{nodeData}">
          <slot name="icon" :nodeData="nodeData"></slot>
        </template>
      </FileTreeNode>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import FileTreeNode from "./FileTreeNode.vue";
import {provide, reactive} from "vue";
import type {DragDropObject, TreeNode} from "./types";
import {Position} from "./types";
import {dirname, findIndexByPath, findNodeByPath, findParentNodeByPath, flattenVisibleTree, join} from "./utils";

let ddo: DragDropObject = {
  drag: null,
  drop: null,
  position: Position.IN
};

provide('ddo', ddo);

const emits = defineEmits(['nodeSelect', 'fileCreate', 'folderCreate', 'nodeRename', 'nodeContextmenu', 'nodeExpand', 'nodeCollapse', 'nodeDrop', 'nodeMove']);

const props = defineProps({
  // 数据源列表
  data: {
    type: Array as () => TreeNode[],
    required: true
  }
});

const data: TreeNode = reactive({
  title: "/",
  path: "/",
  type: "folder",
  expanded: true,
  children: props.data
})


let selectedItems = [] as TreeNode[];
let focusedNode: TreeNode | null = null;


function onFocusIn() {
  window.addEventListener('keydown', onKeyDown);
}

function onFocusOut() {
  window.removeEventListener('keydown', onKeyDown);
}

function onKeyDown(event: KeyboardEvent) {
  const keyCode = event.code;
  if (keyCode === 'ArrowDown' || keyCode === 'ArrowUp') {
    event.preventDefault();
    onSelectionMoved(keyCode === 'ArrowUp' ? -1 : 1)
  }
}

function onNodeExpand(node: TreeNode) {
  emits("nodeExpand", node)
}

function onNodeCollapse(node: TreeNode) {
  emits("nodeCollapse", node)
}

function onSelectionMoved(direction: number) {
  if (selectedItems.length === 0) {
    return
  }

  let currentSelectedItem = selectedItems[0];
  data.expanded = true;
  let visibleItems = flattenVisibleTree(data)
  let index = findIndexByPath(visibleItems, currentSelectedItem.path)

  let newIndex = index + direction;
  // 0 is root node
  if (newIndex == 0 || newIndex == visibleItems.length) {
    return;
  }

  selectedItems.forEach(n => n.selected = false)

  let newSelectedItem = visibleItems[newIndex];
  newSelectedItem.selected = true;
  selectedItems = [newSelectedItem]
}

function onNodeContextmenu(event: MouseEvent, nodeData: TreeNode) {
  if (focusedNode !== null) {
    focusedNode.focused = false;
  }
  nodeData.focused = true;
  focusedNode = nodeData;
  emits("nodeContextmenu", event, nodeData)
}


function onNodeRename(node: TreeNode, title: string) {

  const oldTitle = node.title;
  const oldPath = node.path;
  const dir = dirname(oldPath);
  const newPath = join(dir, title);

  node.title = title;
  node.path = newPath;
  node.editing = false;
  emits('nodeRename', node, title, oldTitle, newPath, oldPath);
}

function onFileCreate(node: TreeNode, title: string) {

  let newOne: TreeNode = {
    title,
    path: node.path + "/" + title,
    type: "file"
  }

  if (!node.children) {
    node.children = []
  }
  node.children.unshift(newOne)

  emits('fileCreate', node, title);
}

function onFolderCreate(node: TreeNode, title: string) {
  let newOne: TreeNode = {
    title,
    path: node.path + "/" + title,
    type: "folder"
  }

  if (!node.children) {
    node.children = []
  }
  node.children.unshift(newOne)

  emits('folderCreate', node, title);
}

function onNodeSelect(event: MouseEvent, item: TreeNode) {
  const {path} = item

  if (focusedNode !== null) {
    focusedNode.focused = false;
    focusedNode = null;
  }

  // Check if the user is holding Ctrl or Cmd key
  const isCtrlOrCmdSelect = event.ctrlKey || event.metaKey;
  const isShiftSelect = event.shiftKey;

  if (isCtrlOrCmdSelect) {
    // If the user is holding Ctrl or Cmd key
    const findIndex = selectedItems.findIndex(item => path === item.path)
    if (findIndex > -1) {
      selectedItems.splice(findIndex, 1)
      item.selected = false;

    } else {
      selectedItems.push(item)
      item.selected = true;
    }

  } else if (isShiftSelect) {

    let visibleItems = flattenVisibleTree(data);
    let lastIndex;
    let lastSelectedItem = selectedItems.pop();
    if (lastSelectedItem) {
      const lastSelectPath = lastSelectedItem.path;
      lastIndex = visibleItems.findIndex(i => i.path === lastSelectPath);
    } else {
      lastIndex = 1;
    }

    const currentIndex = visibleItems.findIndex(i => path === i.path);
    let minIndex = Math.min(lastIndex, currentIndex);
    let maxIndex = Math.max(lastIndex, currentIndex);

    let newSelected = visibleItems.slice(minIndex, maxIndex + 1);
    selectedItems.push(...newSelected)

    newSelected.forEach(s => s.selected = true)

  } else {
    for (let node of selectedItems) {
      node.selected = false;
    }
    selectedItems.splice(0, selectedItems.length)
    selectedItems.push(item);
    item.selected = true;
  }

  emits('nodeSelect', selectedItems);
}

function onNodeDrop() {

  if (ddo.drop.path === ddo.drag.path) {
    return
  }

  let dragItem = findNodeByPath(data, ddo.drag.path)
  let dropItem = findNodeByPath(data, ddo.drop.path)
  if (!dragItem || !dropItem) {
    return;
  }

  // drop item into its own child
  if (dropItem.path.startsWith(dragItem.path)) {
    return;
  }

  // for an expanded folder, there is no below position
  if (dropItem.type === "folder" && dropItem.expanded && ddo.position == Position.BELOW) {
    return;
  }

  // remove from source
  let dragParent = findParentNodeByPath(data, dragItem.path);
  if (!dragParent || !dragParent.children) {
    return;
  }
  for (let i = 0; i < dragParent.children.length; i++) {
    if (dragParent.children[i].title === ddo.drag.title) {
      dragParent.children.splice(i, 1);
    }
  }

  const oldPath = dragItem?.path;
  const title = dragItem?.title
  let newPath;

  if (ddo.position === Position.IN) {
    // if (dropItem.type === "folder") {
    if (!dropItem.children) {
      dropItem.children = [];
    }
    dropItem.children.push(dragItem)

    newPath = join(dropItem.path, title);
  } else {
    let dropItemParent = findParentNodeByPath(data, dropItem.path)
    if (!dropItemParent) {
      return;
    }
    if (!dropItemParent.children) {
      dropItemParent.children = [];
    }

    let index = findIndexByPath(dropItemParent.children, dropItem.path);
    if (ddo.position === Position.BELOW) {
      index = index + 1;
    }

    dropItemParent.children.splice(index, 0, dragItem)

    newPath = join(dropItemParent.path, title)
  }

  emits("nodeDrop", newPath, oldPath);

  if (newPath !== oldPath) {
    emits("nodeMove", newPath, oldPath);
  }

}
</script>
<style scoped>
.file-tree-view {
  outline: none
}

.file-tree-view ul {
  margin-left: 0;
}

.file-tree-view ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
