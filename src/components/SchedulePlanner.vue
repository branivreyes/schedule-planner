<script lang="ts" setup>
import SchedulePlannerTabs from "./SchedulePlannerTabs.vue";
import SchedulePlannerWorkspace from "./SchedulePlannerWorkspace.vue";
import Tab from "@classes/Tab";
import { ref } from "vue";
import Category from "@ts/classes/Category";

const tabs = ref<Tab[]>([
  new Tab("Foo", undefined, undefined, [
    new Category("Classes", 3),
    new Category("Courses", 1),
    new Category("Lessons", 3),
    new Category("Lorem", 2),
  ]),
  new Tab("Bar", undefined, undefined, [
    new Category("Foo", 5),
    new Category("Bar", 2),
  ]),
  new Tab("Baz", undefined, undefined, [new Category("Bar", 5)]),
  new Tab("Search tab"),
]);
</script>

<template>
  <div class="schedule-planner">
    <SchedulePlannerTabs :tabs="tabs" />

    <SchedulePlannerWorkspace v-for="tab in tabs" :tab="tab" :key="tab.id" />
  </div>
</template>

<style scoped lang="scss">
.schedule-planner {
  @apply w-full;
  @apply h-full;
  @apply rounded-lg;
  @apply overflow-hidden;
  @apply flex;
  @apply flex-col;
  @apply shadow-md;
}
</style>
