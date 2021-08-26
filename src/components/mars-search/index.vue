<template>
  <div class="mars-search">
    <mars-form
      ref="formRef"
      okText="搜索"
      cancelText="重置"
      v-bind="$attrs"
      :columns="getColumns"
      @ok="handleSearch"
      @clear="handleClear"
      @cancel="handleReset"
    >
      <template #only>
        <div class="only-btn" v-if="showOnly">
          <a-switch v-model:checked="checked" @change="handleOnly" />
          只看我的
        </div>
      </template>
      <div class="extra-btn" v-if="showExtra">
        <slot name="extra"></slot>
      </div>
    </mars-form>
  </div>
</template>
<script>
import { computed, defineComponent, ref, toRaw, watch } from 'vue'
import { isEmpty, recursive, omitEmpty } from '@/utils'
import { omit } from 'lodash-es'
export default defineComponent({
  name: 'MarsSearch',
  inheritAttrs: false,
  props: {
    // 自定义列
    columns: { type: Array, required: true, default: () => [] },
    // 清空搜索
    clearSearch: { type: Boolean, default: false },
    // 重置搜索
    resetSearch: { type: Boolean, default: true },
    // 是否显示只看我的
    showOnly: { type: Boolean, default: true },
    onlyField: { type: String, default: 'is_mine' },
    only: { type: Boolean, default: false }
  },
  emits: ['search', 'reset', 'clear'],
  setup(props, { emit, slots }) {
    const formRef = ref(null)
    const checked = ref(false)
    const handleOnly = () => {
      // 判断是否点击了搜索按钮
      if (isEmpty(searchParams.value)) {
        onSearch()
        return
      }
      emit('search', emitData())
    }

    watch(
      () => props.only,
      only => {
        checked.value = only
      }
    )

    // 是否显示
    const showExtra = computed(() => !!slots['extra'])

    // 监听columns，删除disabled
    const getColumns = ref([])
    watch(
      () => props.columns,
      columns => {
        getColumns.value = columns.map(column => {
          const props = column?.props || {}
          const { options = [], treeData = [] } = props
          if (column.type === 'ASelect') {
            return { ...column, props: { ...props, options: options.map(val => omit(val, ['disabled'])) } }
          } else if (column.type === 'ACascader') {
            recursive(options, node => {
              delete node.disabled
            })
            return { ...column, props: { ...props, options } }
          } else if (column.type === 'ATreeSelect') {
            recursive(treeData, node => {
              delete node.disabled
              delete node.disableCheckbox
            })
            return { ...column, props: { ...props, treeData } }
          } else {
            return column
          }
        })
      },
      { immediate: true, deep: true }
    )

    const searchParams = ref({})

    const emitData = () => {
      return {
        ...omitEmpty(toRaw(searchParams.value)),
        ...(props.showOnly ? { [props.onlyField]: checked.value } : {})
      }
    }

    const handleSearch = ($event = {}) => {
      searchParams.value = $event
      emit('search', emitData())
    }

    const handleClear = ($event = {}) => {
      searchParams.value = $event
      emit('clear', emitData())
      if (props.clearSearch) {
        emit('search', emitData())
      }
    }

    const handleReset = ($event = {}) => {
      searchParams.value = $event
      emit('reset', emitData())
      if (props.resetSearch) {
        emit('search', emitData())
      }
    }

    // 搜索方法
    const onSearch = () => {
      formRef.value?.handleOk && formRef.value.handleOk()
    }

    // 重置方法
    const onReset = () => {
      formRef.value?.handleCancel && formRef.value.handleCancel()
    }

    // 获取最新数据
    const getData = () => {
      return emitData()
    }

    return {
      getColumns,
      formRef,
      checked,
      handleOnly,
      showExtra,
      handleSearch,
      handleClear,
      handleReset,
      onSearch,
      onReset,
      getData
    }
  }
})
</script>
<style lang="scss" scoped>
.mars-search {
  margin-bottom: 10px;
  :deep(.mars-form) {
    .ant-input-affix-wrapper,
    .ant-select {
      width: 150px;
    }
    .tree-select {
      width: 100%;
      min-width: 150px;
    }
    .ant-calendar-picker {
      span[class='ant-calendar-picker-input ant-input'] {
        width: 300px;
      }
    }
  }
  .only-btn {
    display: flex;
    min-width: 105px;
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
