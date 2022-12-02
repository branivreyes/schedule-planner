<template>
    <a
        class="universal-planner-tab" 
        draggable="true"
        :class="tabClasses" 
        :ondrag="onDrag"
        :ondragstart="onDragStart"
        :ondragend="onDragEnd"
    >
        {{ props.name }}
        <TheIcon
            class="universal-planner-tab__closeIcon" 
            :icon="Icon.X_MARK"
            @click.stop="onClose"
        />
    </a> 
</template>

<script lang="ts" setup>
import TheIcon from '@utils/TheIcon.vue';
import Icon from '@ts/icon';
import { computed } from '@vue/reactivity';

interface Props {
    name: string;
    isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isActive: false,
});

const tabClasses = computed(() => {
    return {
        'tab-active': props.isActive,
    };
});

const emit = defineEmits<{
  (e: 'on-close'): void,
  (e: 'on-drag', data: DragEvent): void,
  (e: 'on-drag-start', data: DragEvent): void,
  (e: 'on-drag-end', data: DragEvent): void,
  (e: 'on-drop', data: DragEvent): void,
}>();

function onClose() {
    emit('on-close');
}

function onDragStart(e: DragEvent) {
    emit('on-drag-start', e);
}

function onDrag(e: DragEvent) {
    emit('on-drag', e);
}

function onDragEnd(e: DragEvent) {
    emit('on-drag-end', e);
}
</script>

<style scoped lang="scss">
.universal-planner-tab {
    @apply tab;
    @apply tab-lg;
    @apply tab-lifted;
    
    &.tab-active:first-child:before {
        background-image: var(--tab-corner-bg);
    }
    
    &__closeIcon {
        @apply ml-3;

        &:hover {
            @apply bg-gray-800;
        }
    }
}
</style>