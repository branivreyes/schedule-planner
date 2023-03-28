<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  title?: string;
  content?: string;
}>();

const open = ref(false);

function toggleOpen() {
  open.value = !open.value;
}
</script>

<template>
  <div
    class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
    :class="{
      'collapse-open': open,
    }"
    @click="toggleOpen"
  >
    <div class="collapse-title text-lg font-medium min-h-fit cursor-pointer">
      <slot name="title">
        {{ title }}
      </slot>
    </div>
    <div class="collapse-content">
      <slot>
        {{ content }}
      </slot>
    </div>
  </div>
</template>
