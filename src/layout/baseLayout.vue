<template>
  <Layout class="layout">
    <LayoutSider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="layout-sider"
      style="background: #fff"
      :collapsedWidth="48"
    >
      <Logo :collapsed="collapsed" />
      <SideMenu :collapsed="collapsed" />
    </LayoutSider>
    <Layout>
      <PageHeader v-model:collapsed="collapsed" />
      <MultiTabs />
      <LayoutContent class="layout-content">
        <AppMain />
      </LayoutContent>
      <!-- <page-footer /> -->
    </Layout>
  </Layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Layout } from 'ant-design-vue'
import Logo from './logo/index.vue'
import AppMain from './main/index.vue'
import SideMenu from './menu/index.vue'
import PageHeader from './header'
import MultiTabs from './multiTabs/index.vue'
// import PageFooter from './footer'

export default defineComponent({
  name: 'BaseLayout',
  components: {
    PageHeader,
    SideMenu,
    MultiTabs,
    Logo,
    AppMain,
    Layout,
    LayoutContent: Layout.Content,
    LayoutSider: Layout.Sider
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
.layout {
  display: flex;
  overflow: hidden;
  height: 100vh;

  .layout-sider ::v-deep(.ant-layout-sider-children) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .ant-layout {
    overflow: hidden;
  }

  .layout-content {
    height: 100%;
  }
}
</style>
