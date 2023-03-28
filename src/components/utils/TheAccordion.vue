<script lang="ts">
type Item<T> = {
  title: string;
  content?: string;
} & T;
</script>

<script lang="ts" setup generic="T extends any">
import TheCollapse from "./TheCollapse.vue";

defineProps<{
  items: Item<T>[];
}>();
</script>

<template>
  <div class="accordion">
    <TheCollapse
      v-for="(item, index) in items"
      class="accordion__collapse"
      :key="index"
    >
      <template #title>
        <slot name="title">
          {{ item.title }}
        </slot>
      </template>
      <slot :item="item">
        {{ item.content }}
      </slot>
    </TheCollapse>
  </div>
</template>

<style lang="scss">
.accordion {
  @apply w-full;
  @apply max-h-full;
  @apply h-full;
  @apply relative;

  &__collapse {
    @apply border-b-0;
    @apply rounded-b-none;
    @apply rounded-t-none;

    &:first-child {
      @apply rounded-t-2xl;
    }

    &:last-child {
      @apply border-b;
      @apply rounded-b-2xl;
    }
  }
}
</style>
