<template>
  <a-layout class="app-layout">
    <app-sider :collapsed="collapsed" />
    <a-layout>
      <app-header v-model:collapsed="collapsed" />
      <MultiTabs />
      <a-layout-content class="app-content">
        <app-main />
      </a-layout-content>
      <app-footer />
    </a-layout>
  </a-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import AppSider from './sider/index'
import AppHeader from './header'
import AppMain from './main/index.vue'
import MultiTabs from './multiTabs/index.vue'
import AppFooter from './footer'

export default defineComponent({
  name: 'BaseLayout',
  components: {
    AppSider,
    AppHeader,
    MultiTabs,
    AppMain,
    AppFooter
  },
  setup() {
    const collapsed = ref(false)

    return {
      collapsed
    }
  }
})
</script>

<style lang="scss" scoped>
.app-layout {
  height: 100vh;

  .app-content {
    overflow-y: auto;
    background-color: $bg-color;
  }
}
</style>
