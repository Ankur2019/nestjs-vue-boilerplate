<template>
  <VTreeview
    dense
    openAll
    activatable
    hoverable
    shaped
    returnObject
    :items="menus"
    color="primary"
    itemKey="name"
    itemText="name"
    @update:active="onClick"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ComputedOptions,
  MethodOptions,
  ComponentPropsOptions,
  ComputedGetter,
} from 'vue';

import { Menu } from '@/type';

interface Data {
  lastActiveUrl: string;
  menus: Menu[];
}

interface Computed extends ComputedOptions {
  dark: ComputedGetter<boolean>;
  linkClass: ComputedGetter<string>;
}

interface Methods extends MethodOptions {
  onClick(selection: Menu[]): Promise<void>;
}

export default defineComponent<ComponentPropsOptions, unknown, Data, Computed, Methods>({
  name: 'AdminSidebar',
  data() {
    return {
      lastActiveUrl: '',
      menus: [
        { name: 'User', url: '/admin/user-list' },
        { name: 'Settings', url: '/admin/settings' },
      ] as Menu[],
    };
  },

  computed: {
    dark() {
      return this.$vuetify.theme.dark;
    },
    linkClass() {
      return this.dark ? 'white--text' : 'dark--text';
    },
  },

  methods: {
    async onClick(selection: Menu[]) {
      let url;
      if (!selection.length) {
        url = this.lastActiveUrl;
      } else {
        const [menu] = selection;
        url = menu.url;
      }

      this.lastActiveUrl = url;
      if (this.$route.fullPath !== url) {
        await this.$router.push(url);
      }
    },
  },
});

</script>

<style scoped lang="scss">
::v-deep .v-treeview-node__root {
  cursor: pointer;
}
</style>
