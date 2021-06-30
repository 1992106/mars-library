<template>
  <div class="multi-tabs">
    <Tabs
      hideAdd
      v-model:activeKey="activeKey"
      type="editable-card"
      class="multi-tabs-box"
      @edit="onEdit"
      @tabClick="onTabClick"
    >
      <TabPane v-for="item in visitedRoutes" :key="item.path" style="height: 0" :closable="visitedRoutes.length > 1">
        <template #tab>
          {{ item.meta.title }}
          <ReloadOutlined v-show="activeKey === item.path" @click.stop.prevent="onRefresh()" />
        </template>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { defineComponent, unref, watch, computed, ref } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Tabs } from 'ant-design-vue'
import IconFont from '@/components/iconfont'

export default defineComponent({
  name: 'MultiTabs',
  components: {
    IconFont,
    ReloadOutlined,
    Tabs,
    TabPane: Tabs.TabPane
  },

  setup() {
    const router = useRouter()
    const store = useStore()
    const activeKey = ref('')
    const visitedRoutes = computed(() => store.state.router.visitedRoutes)

    watch(
      () => router.currentRoute.value,
      val => {
        if (['Redirect', 'ErrorPage', 'Login'].includes(router.currentRoute.value.name)) return
        activeKey.value = val.path
        addVisitedRoutes()
      },
      { immediate: true }
    )

    function addVisitedRoutes() {
      const { currentRoute } = router
      store.dispatch('router/addVisitedRoutes', unref(currentRoute))
    }

    const onEdit = (key, action) => {
      if (action === 'remove') {
        store.dispatch('router/delVisitedRoutes', { router, key })
      }
    }

    const onTabClick = key => {
      if (key !== router.currentRoute.value.path) {
        store.dispatch('router/goToVisitedPage', key)
      }
    }

    const onRefresh = () => {
      const { currentRoute, replace } = router
      const route = unref(currentRoute)
      const { path, params, query } = route
      store.commit('router/delCachedTabList', path)
      replace({
        path: `/redirect${path}`,
        query,
        params
      })
    }

    return {
      onEdit,
      onTabClick,
      onRefresh,
      visitedRoutes,
      activeKey
    }
  }
})
</script>

<style lang="scss" scoped>
.multi-tabs-box {
  background: $bg-color;
  margin: 0;
  padding-top: 6px;
  ::v-deep(.ant-tabs-bar) {
    padding-left: 16px;
    margin-bottom: 0;
    .anticon {
      margin: 0 0 0 8px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
      width: 16px;
      height: 14px;
      overflow: hidden;
      vertical-align: middle;
      transition: all 0.3s;
      &:hover {
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
}
</style>
