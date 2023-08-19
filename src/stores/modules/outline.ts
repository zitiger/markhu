import {defineStore} from 'pinia'
import {ref} from 'vue'
import {OutlineNode} from "../../api/model";

export const useOutlineStore = defineStore('outline', {
    state: () => {
        const outlines = ref<OutlineNode[]>([])
        return {outlines}
    },
    actions: {
        extract() {
            let ul = document.querySelector(".ant-tabs-tabpane-active .vditor-outline__content>ul")
            let result = extractOutline(ul as HTMLUListElement);

            this.outlines.length = 0;
            this.outlines.push(...result)
        },
    }
})

function extractOutline(ul: HTMLUListElement): OutlineNode[] {
    if (ul == null) {
        return [];
    }

    const outlineNodes: OutlineNode[] = [];

    const lis = ul.children;
    for (let i = 0; i < lis.length; i++) {
        const li = lis[i] as HTMLLIElement;
        const span = li.querySelector('span');
        const title = span?.innerText as string;
        const key = span?.dataset.targetId as string;

        const nestedUl = li.querySelector('ul');
        let children: OutlineNode[] = [];
        if (nestedUl) {
            children = extractOutline(nestedUl);
        }

        outlineNodes.push({
            title,
            key,
            children,
        });
    }

    return outlineNodes;
}
