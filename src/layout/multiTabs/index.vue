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
      <TabPane
        v-for="item in visitedRoutes"
        :key="item.fullPath"
        style="height: 0"
        :closable="visitedRoutes.length > 1"
      >
        <template #tab>
          {{ item.meta.title }}
          <ReloadOutlined v-show="activeKey === item.fullPath" @click.stop.prevent="onRefresh(item)" />
        </template>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { defineComponent, unref, watch, computed, ref, onMounted } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { Tabs } from 'ant-design-vue'
import IconFont from '@components/iconfont'
import { useStore } from 'vuex'

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

    const addVisitedRoutes = () => {
      const { currentRoute } = router
      store.dispatch('router/addVisitedRoutes', unref(currentRoute))
    }

    onMounted(() => {
      addVisitedRoutes()
      activeKey.value = visitedRoutes.value[visitedRoutes.value.length - 1].fullPath
    })

    watch(
      () => router.currentRoute.value.fullPath,
      (val) => {
        if (['Redirect', '404'].includes(router.currentRoute.value.name)) return
        activeKey.value = val
        addVisitedRoutes(val)
      }
    )

    const onEdit = (key, action) => {
      if (action === 'remove') {
        store.commit('router/delVisitedRoutes', key)
      }
    }

    const onTabClick = (key) => {
      if (key !== router.currentRoute.value.fullPath) {
        router.push(key)
      }
    }

    const onRefresh = () => {
      const { currentRoute, push } = router
      const route = unref(currentRoute)
      const { fullPath, params, query } = route
      store.commit('router/delCachedTabList', fullPath)
      push({
        path: `/redirect${fullPath}`,
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
  padding-top: 6px;
  margin: 0;
  background: #fff;
  ::v-deep(.ant-tabs-bar) {
    padding-left: 16px;
    .anticon {
      width: 16px;
      height: 14px;
      margin: 0 0 0 8px;
      overflow: hidden;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      vertical-align: middle;
      transition: all 0.3s;
      &:hover {
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
}
</style>
