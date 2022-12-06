<template>
    <div
        class="schedule-planner-tabs"
    >
        <div
            class="schedule-planner-tabs__container tabs"
            ref="tabsContainer"
        >
            <TransitionGroup name="tabs">
                <SchedulePlannerTab
                    v-for="(tab, index) in tabs"
                    :name="tab.name"
                    :key="tab.id"
                    :is-active="selectedTab === tab"
                    :data-tabIndex="index"
                    @click="onTabClick(tab)"
                    @on-close="closeTab(index, tab)"
                    @on-drag="onDrag"
                    @on-drag-start="onDragStart($event, tab)"
                    @on-drag-end="onDragEnd(tab)"
                />
            </TransitionGroup>
            <a
                class="schedule-planner-tabs__addTab"
                @click="addSearchTab"
                ref="addSearchTabElement"
            >
                <i class="icon plus bg-gray-500"></i>
            </a>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SchedulePlannerTab from './SchedulePlannerTab.vue';
import Tab from '@classes/Tab';
import { ref } from 'vue';
import { useDraggableTabs } from '@composables/draggableTabs';

const tabs = ref<Tab[]>([
    new Tab('Search tab'),
    new Tab('Lorem Ipsum'),
    new Tab('Baz Lorem'),
    new Tab('Foo Foo Lorem Baz Bar'),
]);
const selectedTab = ref(tabs.value[0]);
const addSearchTabElement = ref<HTMLAnchorElement | null>(null);
const tabsContainer = ref<HTMLDivElement | null>(null);

function onTabClick(tab: Tab) {
    setSelectedTab(tab);
}

function closeTab(index: number, tab: Tab) {
    if (tabs.value.length === 1) return;   

    tabs.value.splice(index, 1);
    
    if (tab === selectedTab.value)
        selectedTab.value = tabs.value[index] || tabs.value[index - 1];
}

function addSearchTab() {
    const newTab = new Tab('Search tab');

    setSelectedTab(newTab);

    tabs.value.push(newTab);

    setTimeout(() => {
        tabsContainer.value!.scrollLeft = tabsContainer.value!.scrollWidth;
    }, 125);
}

function setSelectedTab(tab: Tab) {
    selectedTab.value = tab;
}

function getMaxXposition() {
    const htmlElement = addSearchTabElement.value!;
    return htmlElement.getBoundingClientRect().left - parseInt(window.getComputedStyle(htmlElement).marginLeft);
}

function getScrollPosition() {
    return tabsContainer.value?.scrollLeft || 0;    
}

const { onDrag, onDragStart, onDragEnd } = useDraggableTabs(tabs, setSelectedTab, getMaxXposition, getScrollPosition);
</script>

<style lang="scss" scoped>
.schedule-planner-tabs {
    @apply bg-slate-100;
    @apply border;
    @apply rounded-tl-lg;
    @apply rounded-tr-lg;
    @apply border-b-0;
    
    &__container {
        margin-top: -1px;
        margin-left: -1px;
        flex-wrap: unset !important;
        @apply relative;
        @apply overflow-hidden;
        @apply max-w-full;
        @apply overflow-x-auto;
        
        &::-webkit-scrollbar {
            height: 4px;
        }

        &::-webkit-scrollbar-track {
            @apply bg-slate-100;
        }

        &::-webkit-scrollbar-thumb {
            @apply bg-gray-300;
        }

        &::-webkit-scrollbar-thumb:hover {
            @apply bg-gray-400;
        }
        
        &.tabs::before {
            content: '';
            z-index: 2;
            width: 1px;
            @apply absolute;
            @apply h-full;
            @apply border-l;
            @apply rounded-tl-lg;
        }
    }
    
    &__addTab {
        @apply inline-flex;
        @apply h-12;
        @apply items-center;
        @apply ml-5;
        @apply cursor-pointer;

        .icon {
            width: 24px !important;
            height: 24px !important;
        }
        
        &:hover::before {
            content: "";
            width: 24px;
            height: 24px;
            @apply absolute;
            @apply rounded;
            @apply bg-gray-300;
        }
    }
}

.tabs-enter-active {
    animation: 250ms linear 0s 1 enter;
}

.tabs-leave-active {
    animation: 250ms linear 0s 1 leave;
}

@keyframes enter {
  0% {
    max-width: 0;
    @apply px-0;
    @apply opacity-0;
  }
  50% {
    max-width: 900px;
    @apply px-5;
    @apply opacity-0;
  }
  100% {
    @apply opacity-100;
  }
}

@keyframes leave {
  0% {
    @apply opacity-100;
  }
  50% {
    @apply opacity-0;
  }
  100% {
    max-width: 0;
    @apply opacity-0;
    @apply px-0;
  }
}
</style>