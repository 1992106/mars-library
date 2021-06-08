<template>
  <div class="mars-search">
    <mars-form v-bind="$attrs" :columns="columns" @ok="handleSearch"></mars-form>
    <div class="extra-btn">
      <slot name="extra"></slot>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MarsSearch',
  inheritAttrs: false,
  props: {
    // model: { type: Object, default: () => ({}) },
    // rules: { type: Object, default: () => ({}) },
    // 自定义列
    columns: { type: Array, default: () => [] }
  },
  emits: ['search'],
  setup(_, { emit }) {
    const handleSearch = ($event) => {
      emit('search', $event)
    }
    return {
      handleSearch
    }
  }
})
</script>
<style lang="scss" scoped>
.mars-search {
  display: flex;
  ::v-deep(.mars-form) {
    .ant-input-affix-wrapper,
    .ant-select {
      width: 130px;
    }
    .ant-cascader-picker,
    .tree-select {
      width: 100%;
      min-width: 130px;
    }
    .ant-calendar-picker {
      width: 220px;
    }
  }
  .extra-btn {
    flex: 1;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
