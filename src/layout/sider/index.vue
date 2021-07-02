<template>
  <Layout.Sider
    class="app-sider"
    :trigger="null"
    collapsible
    v-model:collapsed="siderVisible"
    :collapsedWidth="48"
    :width="200"
  >
    <my-logo :collapsed="collapsed" />
    <my-menu :collapsed="collapsed" />
  </Layout.Sider>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { Layout } from 'ant-design-vue'
import MyLogo from '../logo/index.vue'
import MyMenu from '../menu/index.vue'

export default defineComponent({
  name: 'AppSider',
  components: {
    'Layout.Sider': Layout.Sider,
    MyLogo,
    MyMenu
  },
  props: {
    collapsed: { type: Boolean, require: true }
  },
  setup(props, { emit }) {
    const siderVisible = computed({
      get: () => props.collapsed,
      set: val => {
        emit('update:visible', val)
      }
    })

    return {
      siderVisible
    }
  }
})
</script>

<style lang="scss" scoped></style>
