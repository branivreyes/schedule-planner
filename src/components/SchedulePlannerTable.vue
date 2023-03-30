<script setup lang="ts">
import { ref } from "vue";

const columns = ref([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

const hours = ref([
  "5AM",
  "6AM",
  "7AM",
  "8AM",
  "9AM",
  "10AM",
  "11AM",
  "12PM",
  "1PM",
  "2PM",
  "3PM",
  "4PM",
  "5PM",
  "6PM",
  "7PM",
  "8PM",
  "9PM",
  "10PM",
  "11PM",
  "12AM",
]);
</script>

<template>
  <div class="schedule-planner-table-container">
    <table class="schedule-planner-table">
      <thead class="schedule-planner-table__head">
        <tr>
          <th class="schedule-planner-table__head__hours"></th>
          <th v-for="column in columns">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td v-for=" in columns"></td>
        </tr>
        <tr v-for="hour in hours">
          <td class="schedule-planner-table__hours-cell">
            <div class="schedule-planner-table__hours-cell__hour">
              {{ hour }}
            </div>
          </td>
          <td v-for=" in columns"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.schedule-planner-table-container {
  @apply w-full;
  @apply overflow-hidden;
  @apply rounded-2xl;
  @apply border;
  @apply overflow-y-auto;
}
.schedule-planner-table {
  @apply w-full;
  @apply h-full;
  @apply table-auto;
  @apply border-spacing-0;

  &__hours-cell {
    @apply relative;

    &__hour {
      @apply absolute;
      @apply left-0;
      @apply right-0;
      @apply pr-3;
      @apply bg-white;
      @apply top-0;
      @apply -translate-y-1/2;
      @apply text-right;
      @apply text-slate-400;
      @apply text-base;
    }
  }

  &__head {
    @apply sticky;
    @apply top-0;
    @apply bg-white;
    @apply z-10;

    th {
      @apply border;
      @apply font-normal;
      @apply text-lg;
    }

    &__hours {
      @apply w-20;
    }
  }

  thead > tr {
    height: 60px;
    @apply shadow-sm;

    &::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      @apply border-t-2;
    }
  }

  th {
    @apply border-t-0;
  }

  th,
  td {
    @apply p-0;

    &:first-of-type {
      @apply border-l-0;
    }

    &:last-of-type {
      @apply border-r-0;
    }
  }

  tbody {
    td {
      @apply border;
    }

    tr {
      @apply h-14;

      &:first-of-type,
      &:last-of-type {
        height: 30px;
      }

      &:last-of-type td {
        @apply border-b-0;
      }
    }
  }
}
</style>
