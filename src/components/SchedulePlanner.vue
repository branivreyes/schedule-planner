<template>
    <div class="schedule-planner">
        <SchedulePlannerTabs />
        <div class="schedule-planner__content"></div>
    </div>
</template>

<script lang="ts" setup>
import SchedulePlannerTabs from './SchedulePlannerTabs.vue';
</script>

<style scoped lang="scss">
.schedule-planner {
    @apply w-full;
    @apply h-full;
    @apply rounded-lg;
    @apply overflow-hidden;
    @apply flex;
    @apply flex-col;
    @apply shadow-md;

    &__content {
        margin-top: -1px;
        @apply border;
        @apply rounded-bl-lg; 
        @apply rounded-br-lg; 
        @apply flex-1;
        @apply bg-white;
    }
}

</style>