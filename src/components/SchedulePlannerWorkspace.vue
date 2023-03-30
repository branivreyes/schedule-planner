<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import SchedulePlannerLeftPanel from "./SchedulePlannerLeftPanel.vue";
import SchedulePlannerTable from "./SchedulePlannerTable.vue";
import { useResizeElementWidth } from "@composables/resizeElement";
import Tab from "@ts/classes/Tab";

const props = defineProps<{
  tab: Tab;
}>();

const divider = ref<HTMLDivElement | null>(null);
const leftPanelComponent = ref<InstanceType<
  typeof SchedulePlannerLeftPanel
> | null>(null);

const isWorkspace = computed(() => !!props.tab.categories.length);

onMounted(() => {
  if (isWorkspace.value)
    useResizeElementWidth(
      leftPanelComponent.value?.$el,
      divider.value!,
      200,
      500
    );
});
</script>

<template>
  <div class="schedule-planner-workspace" v-show="tab.isActive">
    <SchedulePlannerLeftPanel
      v-if="isWorkspace"
      :categories="tab.categories"
      ref="leftPanelComponent"
    />

    <div
      v-if="isWorkspace"
      ref="divider"
      draggable="false"
      class="divider divider-horizontal cursor-ew-resize mx-1"
    ></div>

    <SchedulePlannerTable />
  </div>
</template>

<style lang="scss" scoped>
.schedule-planner-workspace {
  margin-top: -1px;
  @apply border;
  @apply rounded-bl-lg;
  @apply rounded-br-lg;
  @apply flex-1;
  @apply bg-white;
  @apply flex;
  @apply w-full;
  @apply p-3;
  min-height: 0;
}
</style>
