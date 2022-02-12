<template>
  <div
    v-if="shouldShow"
    class="text-center"
  >
    <VProgressCircular
      indeterminate
      color="primary"
      size="64"
    />
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProgressCircular',
  props: {
    shouldShow: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
