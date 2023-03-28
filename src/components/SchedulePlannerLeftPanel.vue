<script setup lang="ts">
import TheAccordion from "@utils/TheAccordion.vue";

interface SchedulePlannerCategory {
  title: string;
  items: number;
}

defineProps<{
  categories: SchedulePlannerCategory[];
}>();
</script>

<template>
  <div class="schedulePlannerLeftPanel" draggable="false">
    <TheAccordion :items="categories" v-slot="{ item }">
      <div
        v-for="number in item.items"
        :key="number"
        class="grid h-32 flex-grow card bg-slate-300 place-items-center mb-3 rounded-2xl last:mb-0"
      ></div>
    </TheAccordion>
  </div>
</template>

<style lang="scss" scoped>
.schedulePlannerLeftPanel {
  @apply w-52;
  @apply h-full;
  @apply max-h-full;
  @apply place-items-center;
  @apply overflow-y-auto;
}
</style>
