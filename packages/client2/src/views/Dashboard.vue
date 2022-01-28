<template>
  <div>
    <h1>{{ headline }}</h1>
    <div>Hi there, {{ $store.state.auth.user.name }}</div>

    <div>
      Thanks for using the NestJS Vue Boilerplate. I really hope you enjoy it so
      far!
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Dashboard',
  data() {
    return {
      headline: 'Dashboard',
    };
  },
});
</script>
