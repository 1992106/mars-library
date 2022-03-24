<template>
  <div class="my-menu">
    <a-menu
      mode="inline"
      style="border: 0 none"
      :inlineCollapsed="collapsed"
      :openKeys="openKeys"
      :selected-keys="selectedKeys"
      @click="onClick"
      @openChange="onOpenChange">
      <template v-for="item in routes" :key="item.name">
        <MenuItem :menu-info="item" />
      </template>
    </a-menu>
  </div>
</template>

<script>
import { defineComponent, reactive, watch, computed, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MenuItem from './item.vue'
import { routes as routeList } from '@/src/router'

export default defineComponent({
  name: 'MyMenu',
  components: {
    MenuItem
  },
  props: {
    collapsed: {
      // 侧边栏菜单是否收起
      type: Boolean
    }
  },
  setup(props) {
    // 当前路由
    const currentRoute = useRoute()
    const router = useRouter()

    const state = reactive({
      openKeys: [], // menu当前展开的keys
      selectedKeys: [], // menu选中的keys
      routes: []
    })
    state.openKeys = getOpenKeys()
    state.selectedKeys = [currentRoute.name]
    state.routes = routeList.flatMap(val => (val.path === '/' ? val.children : [val]))

    // 从routes筛选所有根菜单的名字
    const rootSubmenuKeys = computed(() =>
      state.routes.filter(item => !!item?.children?.length && item.path !== '/').map(item => item.name)
    )

    // 监听菜单收缩状态 && 跟随页面路由变化，切换菜单选中状态
    watch(
      () => [props.collapsed, currentRoute.fullPath],
      ([newCollapsedVal]) => {
        if (['login', 'Redirect'].includes(currentRoute.name)) return
        state.openKeys = newCollapsedVal ? [] : getOpenKeys()
        state.selectedKeys = [currentRoute.name]
      }
    )

    // 获取当前打开的子菜单
    // const getOpenKeys = () => [currentRoute.matched[0]?.name]
    function getOpenKeys() {
      return currentRoute.matched.slice(0, -1).map(item => item.name)
    }

    // 点击菜单
    const onClick = ({ key }) => {
      router.push({ name: key })
    }

    // 展开/关闭子菜单
    const onOpenChange = openKeys => {
      const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1)
      if (rootSubmenuKeys.value.indexOf(latestOpenKey) === -1) {
        state.openKeys = openKeys
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    }

    return {
      ...toRefs(state),
      onClick,
      onOpenChange
    }
  }
})
</script>

<style lang="scss" scoped>
.my-menu {
  height: calc(100% - #{$header-height});
  overflow: hidden auto;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  position: relative;
  z-index: 2;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
}
</style>
