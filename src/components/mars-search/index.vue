<template>
  <div class="mars-search">
    <mars-form
      ref="formRef"
      okText="搜索"
      cancelText="重置"
      v-bind="$attrs"
      :columns="columns"
      @ok="handleSearch"
      @cancel="handleReset"
    >
      <template #only>
        <div class="only-btn" v-if="showOnly">
          <a-switch v-model:checked="checked" @change="handleOnly" />
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
import { defineComponent, ref, toRaw, watch } from 'vue'
import { isEmpty, toEmpty } from '@/utils'
import { cloneDeep } from 'lodash'
export default defineComponent({
  name: 'MarsSearch',
  inheritAttrs: false,
  props: {
    // 自定义列
    columns: { type: Array, required: true, default: () => [] },
    // 是否显示只看我的
    showOnly: { type: Boolean, default: true },
    only: { type: Boolean, default: false }
  },
  emits: ['search', 'reset'],
  setup(props, { emit }) {
    const formRef = ref(null)

    const checked = ref(false)
    const handleOnly = () => {
      // 判断是否点击了搜索按钮
      if (isEmpty(searchParams.value)) {
        formRef.value?.handleOk && formRef.value.handleOk()
        return
      }
      emitData()
    }

    watch(
      () => props.only,
      only => {
        checked.value = only
      }
    )

    const searchParams = ref({})
    const handleSearch = ($event = {}) => {
      searchParams.value = $event
      emitData()
    }

    const emitData = () => {
      const searchData = {
        ...toEmpty(cloneDeep(toRaw(searchParams.value))),
        ...(props.showOnly ? { only: checked.value } : {})
      }
      emit('search', searchData)
    }

    const handleReset = () => {
      emit('reset')
    }

    return {
      formRef,
      checked,
      handleOnly,
      handleSearch,
      handleReset
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
