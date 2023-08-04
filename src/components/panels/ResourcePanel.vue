<template>

  <div class="container">
    <div class="toolbar" @click="showContent=!showContent">
      <div class="icon">
        <transition name="arrow-transition">
          <IconFont type="icon-arrow-down" :class="{'arrow-right': showContent, 'arrow-down': !showContent}"/>
        </transition>

      </div>
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="buttons" @click.stop="()=>{}">
        <slot name="buttons"></slot>
      </div>
    </div>
    <transition name="fade">
    <div class="content" v-show="showContent">
      <slot name="content"></slot>
    </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import {RightOutlined, DownOutlined} from "@ant-design/icons-vue";
import {ref} from "@vue/reactivity";

const showContent = ref(true)

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  padding: 5px;
}

.toolbar .icon {
  display: flex;align-items: center;
}

.toolbar .title {
  margin-right: auto;
  padding: 0 5px;
}

.toolbar .buttons :deep(span) {
  margin: 0 3px;
}


.arrow-transition-enter-active,
.arrow-transition-leave-active {
  transition: transform 0.5s;
}

.arrow-transition-enter,
.arrow-transition-leave-to {
  transform: rotate(0);
}

.arrow-right {
  transform: rotate(0);
}

.arrow-down {
  transform: rotate(-90deg);
}


.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}




.content {
  overflow-y: auto;
}


</style>
