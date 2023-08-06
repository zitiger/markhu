<template>
  <div class="container">
    <div class="left-column" :style="{ flex: `${leftFlex}` }">
      <slot name="left"></slot>
      <div class="drag-handle" @mousedown="startDrag"></div>
    </div>
    <div class="right-column">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, onUnmounted} from 'vue';

const leftFlex = ref('0 0 200px');
let startX = 0;
let isDragging = false;

const startDrag = (event: MouseEvent) => {
  startX = event.clientX;
  isDragging = true;
};

const handleDrag = (event: MouseEvent) => {
  if (isDragging) {
    const deltaX = event.clientX - startX;
    startX = event.clientX;
    const newWidth = parseInt(leftFlex.value.split(' ')[2]) + deltaX;
    leftFlex.value = `0 0 ${Math.max(newWidth, 200)}px`;
  }
};

const stopDrag = () => {
  isDragging = false;
};

onMounted(() => {
  window.addEventListener('mousemove', handleDrag);
  window.addEventListener('mouseup', stopDrag);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleDrag);
  window.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
  width: 100%;
}

.left-column {
  overflow: hidden;
  position: relative;
  user-select: none; /* 禁止文字选择 */
  -webkit-user-select: none;
}

.right-column {
  overflow-x: hidden;
  width: 100%;
}

.drag-handle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px;
  cursor: col-resize;
  z-index: 89;
  background-color: var(--mh-divider-color);
}

.drag-handle:hover {
  background-color: var(--mh-primary-color);
  width: 3px;
}
</style>
