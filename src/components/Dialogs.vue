<script lang="ts" setup>
import CreateDirDialog from "./dialogs/CreateDirDialog.vue";
import CreateFileDialog from "./dialogs/CreateFileDialog.vue";
import RenameDialog from "./dialogs/RenameDialog.vue";
import SaveAllDialog from "./dialogs/SaveAllDialog.vue";
import MoveDialog from "./dialogs/MoveDialog.vue";
import HistoryFileDialog from "./dialogs/HistoryFileDialog.vue";
import SaveAsDialog from "./dialogs/SaveAsDialog.vue";
</script>

<template>
  <create-dir-dialog></create-dir-dialog>
  <create-file-dialog></create-file-dialog>
  <save-as-dialog></save-as-dialog>
  <save-all-dialog></save-all-dialog>
  <rename-dialog></rename-dialog>
  <move-dialog></move-dialog>
  <history-file-dialog></history-file-dialog>
</template>
<style>


</style>
