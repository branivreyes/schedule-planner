<template>
  <i class="icon" :class="iconClasses"></i>
</template>

<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import Icon from "@ts/icon";

interface Props {
  icon: Icon;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "bg-gray-500",
});

const iconClasses = computed(() => {
  return {
    [props.icon]: true,
    [props.color]: true,
  };
});
</script>
