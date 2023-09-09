<template>
  <div class="file-tree-view" @focusin="onFocusIn" @focusout="onFocusOut" tabindex="0">
    <div v-for="nodeData in flattenTree" :key="nodeData.path" draggable="true" class="file-tree-node"
         @dragstart.stop="onDragStart(nodeData)" @dragend.stop="onDragEnd"
         @contextmenu.stop.prevent="onNodeContextmenu($event, nodeData)"
    >
      <div :class="[{selected: selectedKeys.has(nodeData.path), focused: focusedKey === nodeData.path}]">
        <div v-if="nodeData.path !== data.path" :style="{'margin-left': (nodeData.level)*20+'px' }"
             class="file-tree-node-content"
             :class="[{
             'node-drag-hover-above': hoverAboveKey===nodeData.path,
             'node-drag-hover-in': hoverInKey===nodeData.path,
             'node-drag-hover-below': hoverBelowKey===nodeData.path,
           }]"
             @dragenter.stop="onDragEnter" @dragover.stop.prevent="onDragOver($event, nodeData)"
             @dragleave.stop="onDragLeave"
             @drop.stop="onDrop(nodeData,data)" @click="onNodeSelect($event, nodeData)">
          <span v-if="nodeData.type === 'folder'" @click.stop="onNodeToggle(nodeData)" class="icon" @dragover.prevent>
            <slot name="toggler" :nodeData="nodeData" :expanded="expandedKeys.has(nodeData.path)">
              <template v-if="expandedKeys.has(nodeData.path)">-</template>
              <template v-else>+</template>
            </slot>
          </span>
          <span>
            <slot name="icon" :nodeData="nodeData">
            <template v-if="nodeData.type === 'folder'">[D]</template>
            <template v-else>[F]</template>
            </slot>
          </span>

          <template v-if="renameKey === nodeData.path">
            <input type="text" @blur="onNodeRename(nodeData)"
                   v-on:keydown.enter="onNodeRename(nodeData)"
                   v-on:keyup.esc="onEditCancel"
                   ref="editInputRef"
                   :value="nodeData.title"
                   class="tree-node-input"
                   :class="[{ 'tree-node-input-error': editErrorKey===nodeData.path, }]"
            >
          </template>
          <slot name="title" :nodeData="nodeData" v-else>
            <span style="width: 100%">{{ nodeData.title }}</span>
          </slot>
        </div>
      </div>
      <div v-if="nodeData.type === 'folder' && ( createFileKey === nodeData.path|| createFolderKey === nodeData.path)"
           :style="{'padding-left': nodeData.level*20+20+'px' }">
        <template v-if="createFolderKey === nodeData.path">
          <input type="text" ref="editInputRef"
                 @blur="onFolderCreate(nodeData)"
                 v-on:keydown.enter="onFolderCreate(nodeData)"
                 v-on:keyup.esc="onEditCancel"
                 class="tree-node-input"
                 :class="[{ 'tree-node-input-error': editErrorKey===nodeData.path, }]"
          >
        </template>

        <template v-else-if="createFileKey === nodeData.path">
          <input style="width: 100%" type="text" ref="editInputRef"
                 @blur="onFileCreate(nodeData)"
                 v-on:keydown.enter="onFileCreate(nodeData)"
                 v-on:keyup.esc="onEditCancel"
                 class="tree-node-input"
                 :class="[{ 'tree-node-input-error': editErrorKey===nodeData.path, }]"
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import type {TreeNode} from "./types";
import useDragDrop from "./useDragDrop";
import useSelect from "./useSelect";
import useEdit from "./useEdit";

const props = defineProps({
  data: {
    type: Object as () => TreeNode,
    required: true
  },
  defaultExtname: {
    type: String,
    required: false
  },
});

const data = reactive(props.data)
const emits = defineEmits(
    ['nodeClick', 'nodeSelect', 'fileCreate', 'folderCreate', 'nodeRename', 'editError',
      'nodeContextmenu', 'nodeExpand', 'nodeCollapse', 'nodeDrop',
      'nodeMove', 'nodeDrop', 'nodeSelect', "nodeContextmenu",
      "nodeExpand", "nodeCollapse"]);

const editInputRef = ref();
const focusedKey = ref<string>('');
const expandedKeys = reactive(new Set<string>());

const flattenTree = computed(() => {
  let result: TreeNode[] = [];

  result.push(data)

  function traverse(tree: TreeNode, level = 0) {
    if (!tree.children) {
      return;
    }
    for (const node of tree.children) {
      node.level = level;
      result.push(node);

      if ((expandedKeys.has(node.path)) && node.children) {
        traverse(node, level + 1);
      }
    }
  }

  traverse(data)

  return result
})
const {selectedKeys, onFocusIn, onFocusOut, onNodeSelect} = useSelect(flattenTree, focusedKey, emits);
const {
  hoverAboveKey,
  hoverInKey,
  hoverBelowKey,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop
} = useDragDrop(expandedKeys, emits);

const {
  renameKey,
  createFolderKey,
  createFileKey,
  editErrorKey,
  startRename,
  startCreateFolder,
  startCreateFile,
  onEditCancel,
  onNodeRename,
  onFileCreate,
  onFolderCreate
} = useEdit(props.defaultExtname, expandedKeys, editInputRef, emits);


defineExpose({startRename, startCreateFolder, startCreateFile})

function onNodeContextmenu(event: MouseEvent, nodeData: TreeNode) {
  focusedKey.value = nodeData.path;
  emits("nodeContextmenu", event, nodeData)
}

function onNodeToggle(nodeData) {
  const expanded = expandedKeys.has(nodeData.path);

  if (!expanded) {
    expandedKeys.add(nodeData.path)
    emits("nodeExpand", nodeData)
  } else {
    expandedKeys.delete(nodeData.path)
    emits("nodeCollapse", nodeData)
  }
}
</script>
<style>

.file-tree-view {
  width: 100%;
}

.file-tree-node {
  border: 2px solid transparent;
}

.file-tree-node .selected {
  background-color: #5295E7;
  border: 2px solid #5295E7;

}

.file-tree-node .focused {
  border: 2px solid #5295E7;
}

.file-tree-node-content {
  border: 2px solid transparent;
  display: flex
}

.node-drag-hover-in {
  background-color: #5295E7;
  color: white;
  border: 2px solid #5295E7;
}

.node-drag-hover-above {
  border-top: 2px solid #5295E7 !important;
}

.node-drag-hover-below {
  border-bottom: 2px solid #5295E7 !important;
}

.tree-node-input {
  width: 100%
}

.tree-node-input-error {
  border-color: red !important;
}
</style>

<style scoped>
.file-tree-view {
  outline: none
}
</style>
