<template>
    <div
        class="schedule-planner-tabs"
    >
        <div
            class="schedule-planner-tabs__container tabs"
            ref="tabsParent"
        >
            <SchedulePlannerTab
                v-for="(tab, index) in tabs"
                :name="tab.name"
                :key="tab.id"
                :is-active="selectedTab === tab"
                :data-tabId="tab.id"
                :data-tabIndex="index"
                @click="onTabClick(tab)"
                @on-close="closeTab(index, tab)"
                @on-drag="onDrag"
                @on-drag-start="onDragStart($event, tab)"
                @on-drag-end="onDragEnd($event, tab)"
            />
            <a
                class="schedule-planner-tabs__addTab"
                @click="addSearchTab"
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
    new Tab('Foo'),
    new Tab('Bar'),
]);
let selectedTab = ref(tabs.value[0]);

function onTabClick(tab: Tab) {
    setSelectedTab(tab);
}

function closeTab(index: number, tab: Tab) {
    if (tabs.value.length === 1) return;   

    tabs.value.splice(index, 1);

    if (tab === selectedTab.value)
        selectedTab.value = tabs.value[0];
}

function addSearchTab() {
    tabs.value.push(new Tab('Search tab'));
}

function setSelectedTab(tab: Tab) {
    selectedTab.value = tab;
}

const { onDrag, onDragEnd, onDragStart } = useDraggableTabs(tabs, setSelectedTab);
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
        @apply relative;
        @apply overflow-hidden;
        
        &.tabs::before {
            content: '';
            position: absolute;
            height: 100%;
            z-index: 2;
            width: 1px;
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
            position: absolute;
            width: 24px;
            height: 24px;
            @apply rounded;
            @apply bg-gray-300;
        }
    }
}
</style>