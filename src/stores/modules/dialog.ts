import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useDialogStore = defineStore('dialog', {
    state: () => {

        const isCreateFileDialogVisible = ref<boolean>(false) //
        const isSaveConfirmDialogVisible = ref<boolean>(false) //
        const isSaveAsDialogVisible = ref<boolean>(false) //
        const isCreateDirDialogVisible = ref<boolean>(false) //
        const isRenameDialogVisible = ref<boolean>(false) //
        const isSaveAllDialogVisible = ref<boolean>(false) //
        const isMoveDialogVisible = ref<boolean>(false) //
        const isHistoryFileDialogVisible = ref<boolean>(false) //

        return {
            isCreateFileDialogVisible,
            isSaveConfirmDialogVisible,
            isSaveAsDialogVisible,
            isCreateDirDialogVisible,
            isSaveAllDialogVisible,
            isRenameDialogVisible,
            isMoveDialogVisible,
            isHistoryFileDialogVisible,
        }
    },
    actions: {
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
