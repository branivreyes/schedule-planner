import { Ref, onMounted } from 'vue';

export function useDraggableTabs<T>(
    tabs: Ref<T[]>,
    setSelectedTab: (tab: T) => void,
    getMaxXPosition: () => number,
    tabsElementContainer: Ref<HTMLElement | null>
) {
    let offsetX = 0;
    let draggingTabElement: HTMLAnchorElement | undefined;
    let draggingTabDomRect: DOMRect;
    let ghostTabIndex: number;
    let tabBehind: HTMLElement | undefined;
    let draggingTabIndex: number;
    let firstIteration = true;
    let ghostTabs: HTMLElement[] = [];
    let maxXPosition: number;
    let clientX = 0;
    let scrollPosition = 0;
    let initialScrollPosition = 0;
    
    onMounted(() => {
        tabsElementContainer.value?.addEventListener('wheel', (e: WheelEvent) => {
            tabsElementContainer.value!.scrollLeft += e.deltaY;
        });
        
        tabsElementContainer.value?.addEventListener('scroll', () => {
            scrollPosition = tabsElementContainer.value!.scrollLeft;
            moveDraggingTab();
        });
    });
    
    function onDragStart(e: DragEvent, tab: T) {
        draggingTabElement = e.target as HTMLAnchorElement;
        
        draggingTabIndex = Number(draggingTabElement?.dataset?.tabindex);
        
        if (isNaN(draggingTabIndex))
            return e.preventDefault();
        
        ghostTabIndex = draggingTabIndex;

        clientX = e.clientX;

        setSelectedTab(tab);
        
        setDragImage(e);
        
        draggingTabDomRect = draggingTabElement.getBoundingClientRect();
        
        offsetX = clientX - draggingTabDomRect.left;

        maxXPosition = getMaxXPosition();
        initialScrollPosition = scrollPosition;
        
        moveDraggingTab();

        setDraggingTabStyles();
        
        insertNewGhostTab();
    }
    
    function onDrag(e: DragEvent) {
        clientX = e.clientX;

        if (clientX === 0) return;

        if (firstIteration)
            draggingTabElement!.style.pointerEvents = 'none';

        firstIteration = false;

        moveDraggingTab();
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

        ghostTab.style.minWidth = Math.round(draggingTabDomRect.width) + 'px';
        
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
    
    function moveDraggingTab() {
        if (!draggingTabElement) return;
        
        const draggingTabStyle = draggingTabElement!.style;
        const virtualTab = clientX + (draggingTabDomRect.width - offsetX);
        const virtualMaxXPosition = maxXPosition - (scrollPosition - initialScrollPosition);

        if (virtualTab <= virtualMaxXPosition && (clientX + scrollPosition) > offsetX)
            draggingTabStyle.left = Math.round((clientX - offsetX) + scrollPosition) + 'px';
        
        checkForNewGhostTab();
    }
    
    function checkForNewGhostTab() {
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

    function createNewGhostTab() {
        const ghostTab = document.createElement('DIV') as HTMLDivElement;
        ghostTab.classList.add('h-12');
        
        const style = ghostTab.style;
        style.minWidth = '0px';
        style.transition = 'min-width .2s linear';
        style.willChange = 'min-width';

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

            lastGhostTab.style.minWidth = '0px';

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