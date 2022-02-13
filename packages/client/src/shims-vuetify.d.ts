declare module 'vuetify'
declare module 'vuetify/lib/components'
declare module 'vuetify/lib/directives'

declare module '@vue/runtime-core' {

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $vuetify: vuetify;
  }
}
