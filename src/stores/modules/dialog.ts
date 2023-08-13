import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useDialogStore = defineStore('dialog', {
    state: () => {

        const isCreateFileDialogVisible = ref<boolean>(false) //
        const isSaveAsDialogVisible = ref<boolean>(false) //
        const isCreateDirDialogVisible = ref<boolean>(false) //
        const isRenameDialogVisible = ref<boolean>(false) //
        const isSaveAllDialogVisible = ref<boolean>(false) //
        const isMoveDialogVisible = ref<boolean>(false) //
        const isHistoryFileDialogVisible = ref<boolean>(false) //

        return {
            isCreateFileDialogVisible,
            isSaveAsDialogVisible,
            isCreateDirDialogVisible,
            isSaveAllDialogVisible,
            isRenameDialogVisible,
            isMoveDialogVisible,
            isHistoryFileDialogVisible,
        }
    },
    actions: {
        showCreateFileDialog() {
            console.log("showCreateFileDialog");
            this.isCreateFileDialogVisible = true;
        },
        hideCreateFileDialog() {
            console.log("hideCreateFileDialog");
            this.isCreateFileDialogVisible = false;
        },
        showSaveAsDialog() {
            console.log("showSaveAsDialog");
            this.isSaveAsDialogVisible = true;
        },
        hideSaveAsDialog() {
            console.log("hideSaveAsDialog");
            this.isSaveAsDialogVisible = false;
        },
        showCreateDirDialog() {
            console.log("showCreateDirDialog");
            this.isCreateDirDialogVisible = true;
        },
        hideCreateDirDialog() {
            console.log("hideCreateDirDialog");
            this.isCreateDirDialogVisible = false;
        },
        showSaveAllDialog() {
            console.log("showSaveAllDialog");
            this.isSaveAllDialogVisible = true;
        },
        hideSaveAllDialog() {
            console.log("hideSaveAllDialog");
            this.isSaveAllDialogVisible = false;
        },
        showRenameDialog() {
            console.log("showCreateFileDialog");
            this.isRenameDialogVisible = true;
        },
        hideRenameDialog() {
            console.log("showCreateFileDialog");
            this.isRenameDialogVisible = false;
        },
        showMoveDialog() {
            console.log("showMoveDialog");
            this.isMoveDialogVisible = true;
        },
        hideMoveDialog() {
            console.log("hideMoveDialog");
            this.isMoveDialogVisible = false;
        },
        showHistoryFileDialog() {
            console.log("showHistoryFileDialog");
            this.isHistoryFileDialogVisible = true;
        },
        hideHistoryFileDialog() {
            console.log("hideHistoryFileDialog");
            this.isHistoryFileDialogVisible = false;
        }
    }
})
