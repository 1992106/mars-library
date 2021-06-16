<template>
  <div class="mars-search">
    <mars-form okText="搜索" cancelText="重置" v-bind="$attrs" :columns="columns" @ok="handleSearch">
      <template #only>
        <div class="only-btn" v-if="showOnly">
          <a-switch v-model:checked="checked" />
          只看我的
        </div>
      </template>
      <div class="extra-btn">
        <slot name="extra"></slot>
      </div>
    </mars-form>
  </div>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  name: 'MarsSearch',
  inheritAttrs: false,
  props: {
    // 自定义列
    columns: { type: Array, default: () => [] },
    // 是否显示只看我的
    showOnly: { type: Boolean, default: true },
    only: { type: Boolean, default: false }
  },
  emits: ['search'],
  setup(props, { emit }) {
    const checked = ref(false)
    watch(
      () => props.only,
      (only) => {
        checked.value = only
      }
    )
    const handleSearch = ($event = {}) => {
      emit('search', { ...$event, only: checked.value })
    }
    return {
      checked,
      handleSearch
    }
  }
})
</script>
<style lang="scss" scoped>
.mars-search {
  margin-bottom: 10px;
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
  .only-btn {
    display: flex;
    .ant-switch {
      margin-right: 5px;
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
