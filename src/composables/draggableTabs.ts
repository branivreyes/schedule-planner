import { Ref } from 'vue';

export function useDraggableTabs<T>(tabs: Ref<T[]>, setSelectedTab: (tab: T) => void, getMaxXPosition: () => number) {
    let offsetX = 0;
    let draggingTabElement: HTMLAnchorElement | undefined;
    let draggingTabDomRect: DOMRect;
    let ghostTabIndex: number;
    let tabBehind: HTMLElement | undefined;
    let draggingTabIndex: number;
    let firstIteration = true;
    let ghostTabs: HTMLElement[] = [];
    let maxXPosition: number;
    
    function onDragStart(e: DragEvent, tab: T) {
        draggingTabElement = e.target as HTMLAnchorElement;
        
        draggingTabIndex = Number(draggingTabElement?.dataset?.tabindex);
        
        if (isNaN(draggingTabIndex))
            return e.preventDefault();
        
        ghostTabIndex = draggingTabIndex;

        const clientX = e.clientX;

        setSelectedTab(tab);
        
        setDragImage(e);
        
        draggingTabDomRect = draggingTabElement.getBoundingClientRect();
        
        offsetX = clientX - draggingTabDomRect.left;

        maxXPosition = getMaxXPosition();
        
        moveDraggingTab(clientX);

        setDraggingTabStyles();
        
        insertNewGhostTab();
    }
    
    function onDrag(e: DragEvent) {
        const clientX = e.clientX;

        if (clientX === 0) return;

        if (firstIteration)
            draggingTabElement!.style.pointerEvents = 'none';

        firstIteration = false;

        moveDraggingTab(clientX);
        
        tabBehind = getTabBehind(clientX);
        
        if (!tabBehind) return;

        const newGhostTabIndex = getNewGhostTabIndex(
            clientX,
            Number(tabBehind.dataset.tabindex),
            getTabMiddleX(tabBehind)
        );
        
        if (ghostTabIndex === newGhostTabIndex) return;
        
        insertNewGhostTab(newGhostTabIndex);
    }

    function onDragEnd(tab: T) {
        removeLastGhostTab(false);
        
        draggingTabElement?.removeAttribute('style');

        if (draggingTabIndex !== ghostTabIndex && ghostTabIndex !== undefined) {
            tabs.value.splice(draggingTabIndex, 1);
            tabs.value.splice(ghostTabIndex!, 0, tab);
        }
        
        firstIteration = true;
        ghostTabs = [];
        draggingTabElement = undefined;
        tabBehind = undefined;
    }
    
    function getNewGhostTabIndex(
        clientX:number,
        tabBehindIndex: number,
        tabBehindMiddleX: number
    ) {
        let newGhostTabIndex = tabBehindIndex;
        
        if (clientX >= tabBehindMiddleX && newGhostTabIndex < draggingTabIndex)
            newGhostTabIndex++;

        if (clientX < tabBehindMiddleX && newGhostTabIndex > draggingTabIndex)
            newGhostTabIndex--;
        
        return newGhostTabIndex;
    }

    function insertNewGhostTab(newGhostTabIndex?: number) {
        removeLastGhostTab();

        const ghostTab = createNewGhostTab();

        if (newGhostTabIndex === undefined) 
            draggingTabElement!.before(ghostTab);

        else if (newGhostTabIndex > ghostTabIndex)
            tabBehind!.after(ghostTab);

        else
            tabBehind!.before(ghostTab);

        if (newGhostTabIndex !== undefined) {
            ghostTab.getBoundingClientRect();

            ghostTabIndex = newGhostTabIndex;
        }

        ghostTab.style.width = draggingTabDomRect.width + 'px';
        
        ghostTabs.push(ghostTab);
    }
    
    function setDraggingTabStyles() {
        const style = draggingTabElement!.style;
        style.position = 'absolute';
        style.zIndex = '1';
    }
    
    function setDragImage(e: DragEvent) {
        const img = new Image();
        img.src = 'empty.svg';
        e.dataTransfer?.setDragImage(img, 0, 0);
    }

    function getTabMiddleX(element: HTMLElement) {
        const { left, width } = element.getBoundingClientRect();
        return left + (width / 2);
    }

    function moveDraggingTab(clientX: number) {
        const draggingTabStyle = draggingTabElement!.style;
        const virtualTab = clientX + (draggingTabDomRect.width - offsetX);
        
        if (virtualTab > maxXPosition || clientX <= offsetX) return;
        
        draggingTabStyle.left = Math.round(clientX - offsetX) + 'px';
    }

    function createNewGhostTab() {
        const ghostTab = document.createElement('DIV') as HTMLDivElement;
        ghostTab.classList.add('h-12');
        
        const style = ghostTab.style;
        style.width = '0px';
        style.transition = 'width .2s linear';
        style.willChange = 'width';

        return ghostTab;
    }

    function getTabBehind(clientX: number) {
        const elementBehind = document.elementFromPoint(clientX, draggingTabDomRect.top) as HTMLElement;
        
        return elementBehind?.dataset?.tabindex ? elementBehind : undefined;
    }

    function removeLastGhostTab(withAnimation = true) {
        const lastGhostTab = ghostTabs.pop();

        if (!lastGhostTab) return;
        
        if (withAnimation) {
            const width = window.getComputedStyle(lastGhostTab).width;

            if (width === '0px') return lastGhostTab.remove();

            lastGhostTab.style.width = '0px';

            const removeElement = () => {
                lastGhostTab.removeEventListener('transitionend', removeElement);
                lastGhostTab.remove();
            };

            lastGhostTab.addEventListener('transitionend', removeElement);
        } else
            lastGhostTab.remove();
    }
    
    return {
        onDragStart,
        onDrag,
        onDragEnd,
    }
}