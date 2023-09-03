<template>
  <!--  <transition name="slide-up">-->
  <li draggable="true" class="file-tree-node" @dragstart.stop="onDragStart" @dragend.stop="onDragEnd"
      @contextmenu.stop.prevent="onNodeContextmenu($event, nodeData)">
    <div v-show="nodeData.path!=='/'"
         :class="['node-block',{ selected: nodeData.selected, focused: nodeData.focused }]"
         @dragenter.stop="onDragEnter" @dragover.stop.prevent="onDragOver" @dragleave.stop="onDragLeave"
         @drop.stop="onDrop" @click="onNodeSelect($event, nodeData)">
      <div :style="{'margin-left': (props.level<3?0:(props.level-2)*20)+'px' }" :class="[ dragOverClass]">
        <span v-if="nodeData.type === 'folder'" @click.stop="onNodeToggle" class="icon" @dragover.prevent>
          <slot name="toggler" :nodeData="nodeData">
            <template v-if="nodeData.expanded">-</template>
            <template v-else>+</template>
          </slot>
        </span>
        <span>
          <slot name="icon" :nodeData="nodeData">
            <template v-if="nodeData.type === 'folder'">[D]</template>
            <template v-else>[F]</template>
          </slot>
        </span>

        <template v-if="nodeData.editing">
          <input type="text" @blur="onNodeRename(nodeData,newName)" v-on:keyup.esc="onEditingEsc"
                 v-on:keydown.enter="onNodeRename(nodeData,newName)" ref="editingInputRef" v-model="newName">
        </template>
        <slot name="title" :nodeData="nodeData" v-else>
          <span>{{ nodeData.title }}</span>
        </slot>
      </div>
    </div>
    <ul>
      <template v-if="nodeData.addingFolder || nodeData.addingFile || nodeData.expanded || nodeData.path==='/'">
        <li v-if="nodeData.type === 'folder' && (nodeData.addingFile||nodeData.addingFolder)"
            :style="{'padding-left': (props.level<2?0:(props.level-1)*20)+'px' }">
          <template v-if="nodeData.addingFolder">
            <input type="text" ref="addingFolderInputRef"
                   @blur="onFolderCreate(nodeData,newFolderName)"
                   v-on:keydown.enter="onFolderCreate(nodeData,newFolderName)"
                   v-on:keyup.esc="onFolderEsc"
                   v-model="newFolderName">
          </template>

          <template v-if="nodeData.addingFile">
            <input type="text" ref="addingFileInputRef"
                   @blur="onFileCreate(nodeData,newFileName)"
                   v-on:keydown.enter="onFileCreate(nodeData,newFileName)"
                   v-on:keyup.esc="onFileEsc"
                   v-model="newFileName">
          </template>

        </li>

        <FileTreeNode v-for="item in nodeData.children" :key="item.title" :node-data="item" :level="props.level+1"
                      @nodeDrop="onNodeDrop" @nodeSelect="onNodeSelect"
                      @fileCreate="onFileCreate" @folderCreate="onFolderCreate"
                      @nodeRename="onNodeRename" @nodeContextmenu="onNodeContextmenu"
                      @nodeExpand="onNodeExpand" @nodeCollapse="onNodeCollapse">
          <template v-slot:toggler="{nodeData}">
            <slot name="toggler" :nodeData="nodeData"></slot>
          </template>

          <template v-slot:icon="{nodeData}">
            <slot name="icon" :nodeData="nodeData"></slot>
          </template>

          <template v-slot:title="{nodeData}">
            <slot name="title" :nodeData="nodeData"></slot>
          </template>
        </FileTreeNode>
      </template>
    </ul>
  </li>
  <!--  </transition>-->
</template>
<script lang="ts" setup>
import {inject, nextTick, reactive, ref, watch} from "vue";
import type {DragDropObject, TreeNode} from "./types";
import {Position} from "./types";

const props = defineProps(
    {
      nodeData: {
        type: Object as () => TreeNode,
        required: true
      },
      level: {
        type: Number,
        required: true
      }
    });
const nodeData = reactive(props.nodeData);

const ddo = inject("ddo") as DragDropObject;

const editingInputRef = ref();
const addingFolderInputRef = ref();
const addingFileInputRef = ref();
const dragOverClass = ref("");
// const draggableDom = ref();
// const dropTarget = ref();

const newFileName = ref("");
const newFolderName = ref("");
const newName = ref(nodeData.title);

//
// onMounted(() => {
//   draggableDom.value.draggable = true;
//   draggableDom.value.ondragstart = onDragStart;
//   draggableDom.value.ondragend = onDragEnd;
//
//   // if (nodeData?.type === "folder") {
//   dropTarget.value.ondragenter = onDragEnter;
//   dropTarget.value.ondragover = onDragOver;
//   dropTarget.value.ondragleave = onDragLeave;
//   dropTarget.value.ondrop = onDrop;
//   // }
// })

watch(() => nodeData.editing, async (newValue) => {
  if (newValue) {
    newName.value = nodeData?.title
    await nextTick();
    editingInputRef.value.focus();
  }
})

watch(() => nodeData.addingFolder, async (newValue) => {
  if (newValue) {
    newFolderName.value = ""
    await nextTick();
    addingFolderInputRef.value.focus();
  }
})

watch(() => nodeData.addingFile, async (newValue) => {
  if (newValue) {
    newFileName.value = ""
    await nextTick();
    addingFileInputRef.value.focus();
  }
})

const onNodeContextmenu = async (e: MouseEvent, nodeData: TreeNode) => {
  emits("nodeContextmenu", e, nodeData)
}

const emits = defineEmits(['nodeDrop', 'nodeSelect', 'fileCreate', 'folderCreate',
  'nodeRename', "nodeContextmenu", "nodeExpand", "nodeCollapse"]);

function onNodeToggle() {
  nodeData.expanded = !nodeData.expanded

  if (nodeData.expanded) {
    emits("nodeExpand", nodeData)
  } else {
    emits("nodeCollapse", nodeData)
  }
}

function onNodeRename(node: TreeNode, name: string) {
  // 防止enter和onblur时重复触发
  if (node.editing) {
    if (name.length > 0) {
      emits('nodeRename', node, name);
    } else {
      onEditingEsc();
    }
  }
}

function onEditingEsc() {
  nodeData.editing = false;
}

function onNodeDrop() {
  emits('nodeDrop');
}

function onNodeSelect(e: MouseEvent, nodeData: TreeNode) {
  emits('nodeSelect', e, (nodeData));
}

function onFileCreate(nodeData: TreeNode, newFileName: string) {
  if (nodeData.addingFile) {
    nodeData.expanded = true;
    if (newFileName.length > 0) {
      emits('fileCreate', nodeData, newFileName);
    } else {
      onFileEsc();
    }
  }
}

function onFileEsc() {
  nodeData.expanded = true;
  nodeData.addingFile = false;
}

function onFolderCreate(nodeData: TreeNode, newFileName: string) {
  if (nodeData.addingFolder) {
    nodeData.expanded = true;

    if (newFileName.length > 0) {
      emits('folderCreate', nodeData, newFileName);
    } else {
      onFileEsc();
    }
  }
}

function onFolderEsc() {
  nodeData.expanded = true;
  nodeData.addingFolder = false;
}

function onNodeExpand(nodeData: TreeNode) {
  emits("nodeExpand", nodeData)
}

function onNodeCollapse(nodeData: TreeNode) {
  emits("nodeCollapse", nodeData)
}

function onDragStart(e: DragEvent) {
  ddo.drag = nodeData;

}

//进入目标节点
function onDragEnter(e: DragEvent) {
}


function onDragOver(e: DragEvent) {
  // e.preventDefault();

  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "move";
  }

  if (nodeData?.path === ddo.drag.path) {
    return
  }

  const position = calculateDropPosition(e, nodeData?.type);
  ddo.position = position;
  if (position === Position.ABOVE) {
    dragOverClass.value = "tree-drag-over-top";
  } else if (position === Position.BELOW) {
    // when a folder is expanded, there is no below position
    if (nodeData.type == "file" || !nodeData.expanded) {
      dragOverClass.value = "tree-drag-over-bottom";
    }
  } else {
    dragOverClass.value = "tree-drag-over";
  }
}


//计算拖拽节点的放置方式0（作为目标节点的子节点），-1（放置在目标节点的前面）,1（放置在目标节点的后面）
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
  dragOverClass.value = "";
}

function onDrop(e: DragEvent) {

  ddo.drop = nodeData;
  emits('nodeDrop');
  dragOverClass.value = "";

  return;

}

function onDragEnd(e: DragEvent) {
  dragOverClass.value = "";
}


</script>
<style>

.file-tree-view ul {
  margin-left: 0;
  padding-left: 0;
}


.file-tree-node ul, .file-tree-node li {
  list-style-type: none;
}

.file-tree-node .selected {
  background-color: #5295E7;
}

.file-tree-node .node-block {
  border: 2px solid transparent;
}

.file-tree-node .focused {
  border: 2px #5295E7 solid;
}

.tree-drag-over {
  background-color: #5295E7;
  color: white;
  border: 2px #5295E7 solid;
}

.tree-drag-over-top {
  border-top: 2px #5295E7 solid !important;
}

.tree-drag-over-bottom {
  border-bottom: 2px #5295E7 solid !important;
}
</style>
