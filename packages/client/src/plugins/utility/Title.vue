<template>
  <h2>
    <slot />
  </h2>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Title',
});
</script>

<style scoped lang="scss">
h2 {
  font-size: 16px;
  line-height: 20px;
  font-weight: 700;
  word-break: initial;
}
</style>
