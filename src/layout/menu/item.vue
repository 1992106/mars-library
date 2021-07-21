<template>
  <template v-if="!menuInfo?.meta?.hidden">
    <a-sub-menu v-if="menuInfo.children?.length" :key="menuInfo.name" v-bind="$attrs">
      <template v-slot:title>
        <span>
          <icon-font v-if="menuInfo.meta?.icon" :type="menuInfo.meta.icon" />
          <span>{{ menuInfo.meta?.title }}</span>
        </span>
      </template>
      <template v-for="item in menuInfo.children">
        <template v-if="!item.children">
          <a-menu-item :key="item.name">
            <icon-font v-if="item.meta?.icon" :type="item.meta.icon" />
            <span>{{ item.meta?.title }}</span>
          </a-menu-item>
        </template>
        <template v-else>
          <menu-item :menu-info="item" :key="item.name" />
        </template>
      </template>
    </a-sub-menu>
    <a-menu-item v-else :key="menuInfo.name">
      <icon-font v-if="menuInfo.meta?.icon" :type="menuInfo.meta.icon" />
      <span>{{ menuInfo.meta?.title }}</span>
    </a-menu-item>
  </template>
</template>
<script>
import { defineComponent } from 'vue'
import IconFont from '@/components/iconfont'

export default defineComponent({
  name: 'menu-item',
  components: {
    IconFont
  },
  props: {
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {}
})
</script>

<style lang="scss" scoped></style>
