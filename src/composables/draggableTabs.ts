import { Ref } from 'vue';
import Tab from '@classes/Tab';

export function useDraggableTabs(tabs: Ref<Tab[]>, setSelectedTab: (tab: Tab) => void) {
    let offsetX = 0;
    let ghostTabIndex: number | undefined;
    let ghostTabs: HTMLElement[] = [];
    let draggingTabElement: HTMLAnchorElement | undefined;
    let draggingTabDomRect: DOMRect;
    let tabBehindIndex: number;
    let draggingTabStylesSetted = false;
    let tabBehind: HTMLElement | undefined;
    let firstIteration = true;

    function onDragStart(e: DragEvent, tab: Tab) {
        draggingTabElement = e.target as HTMLAnchorElement;
        
        if (!draggingTabElement?.dataset?.tabid) {
            e.preventDefault();
            draggingTabElement = undefined;
            return;
        }

        const clientX = e.clientX;

        setSelectedTab(tab);
        
        e.dataTransfer?.setDragImage(document.createElement('DIV'), 0, 0);
        
        draggingTabDomRect = draggingTabElement.getBoundingClientRect();
        
        offsetX = clientX - draggingTabDomRect.left;
    }

    function onDrag(e: DragEvent) {
        const clientX = e.clientX;

        if (clientX === 0) return;
        
        if (firstIteration) {
            insertNewGhostTab(0); 
            ghostTabIndex = Number(draggingTabElement?.dataset.tabindex) + 1;
        }

        firstIteration = false;
        
        moveDraggingTab(clientX);

        tabBehind = getTabBehind(clientX);

        if (!tabBehind.dataset.tabid) return;
        
        const tabBehindMiddleX = getTabMiddleX(tabBehind);

        tabBehindIndex = Number(tabBehind.dataset.tabindex);
        
        let newGhostTabIndex = tabBehindIndex;

        if (clientX >= tabBehindMiddleX)
            newGhostTabIndex++;
        
        if (ghostTabIndex === newGhostTabIndex) return;

        insertNewGhostTab(newGhostTabIndex);

        ghostTabIndex = newGhostTabIndex;
    }

    function onDragEnd(e: DragEvent, tab: Tab) {
        const ghostTab = ghostTabs.pop();
        
        ghostTab?.remove();
        
        const tabIndex = Number(draggingTabElement?.dataset.tabindex);

        if (ghostTabIndex! > tabIndex)
            ghostTabIndex!--;

        draggingTabElement?.removeAttribute('style');

        if (tabIndex !== ghostTabIndex && ghostTabIndex !== undefined) {
            tabs.value.splice(tabIndex, 1);
            tabs.value.splice(ghostTabIndex!, 0, tab);
        }
        
        draggingTabStylesSetted = false;
        draggingTabElement = undefined;
        ghostTabIndex = undefined;
        tabBehind = undefined;
        firstIteration = true;
    }

    function insertNewGhostTab(targetIndex: number) {
        removeLastGhostTab();

        const ghostTab = createNewGhostTab();
        
        if (firstIteration)
            draggingTabElement?.before(ghostTab);
        
        else if (tabBehindIndex < targetIndex)
            tabBehind?.after(ghostTab);
            
        else
            tabBehind?.before(ghostTab);

        if (ghostTabIndex)
            ghostTab.getBoundingClientRect();

        ghostTab.style.width = draggingTabDomRect.width + 'px';

        ghostTabs.push(ghostTab);
    }

    function createNewGhostTab() {
        const ghostTab = document.createElement('DIV') as HTMLDivElement;

        ghostTab.classList.add('h-12');
        ghostTab.style.width = '0px';
        ghostTab.style.transition = 'width .2s linear';
        ghostTab.style.willChange = 'width';

        return ghostTab;
    }

    function getTabMiddleX(element: HTMLElement) {
        const { left: tabBehindLeft, width: tabBehindWidth } = element.getBoundingClientRect();
        
        return tabBehindLeft + (tabBehindWidth / 2);
    }

    function getTabBehind(clientX: number) {
        return document.elementFromPoint(clientX, draggingTabDomRect.top) as HTMLElement;
    }

    function moveDraggingTab(clientX: number) {
        const draggingTabStyle = draggingTabElement!.style;

        if (clientX > offsetX)
            draggingTabStyle.left = Math.round(clientX - offsetX) + 'px';

        if (draggingTabStylesSetted) return;
        
        draggingTabStyle.position = 'absolute';
        draggingTabStyle.zIndex = '1';
        draggingTabStyle.pointerEvents = 'none';
        
        draggingTabStylesSetted = true;
    }

    function removeLastGhostTab() {
        const lastGhostTab = ghostTabs.pop();

        if (!lastGhostTab) return;

        lastGhostTab.style.width = '0px';
        
        const removeElement = () => {
            lastGhostTab.removeEventListener('transitionend', removeElement);
            lastGhostTab.remove();
        };

        lastGhostTab.addEventListener("transitionend", removeElement);
    }
    
    return {
        onDragStart,
        onDrag,
        onDragEnd,
    }
}