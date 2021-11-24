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
    <div class="mars-shortcut" v-if="showShortcut">
      <slot name="shortcut"></slot>
    </div>
  </div>
</template>
<script>
import { computed, defineComponent, nextTick, ref, toRaw, watch } from 'vue'
import { isEmpty, recursive, omitEmpty } from '@/utils'
import { omit, cloneDeep } from 'lodash-es'
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
    const showShortcut = computed(() => !!slots['shortcut'])

    // columns删除disabled属性
    const getColumns = computed(() => {
      console.log(1111111)
      return props.columns.map(column => {
        const props = column?.props || {}
        const options = cloneDeep(props?.options || [])
        const treeData = cloneDeep(props?.treeData || [])
        if (['ASelect', 'AAutoComplete'].includes(column.type)) {
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
        } else if (column.type === 'AInput') {
          return { ...column, props: { maxlength: 100, ...props } }
        } else if (column.type === 'ATextarea') {
          return { ...column, props: { maxlength: 100, multi: true, ...props } }
        } else {
          return column
        }
      })
    })

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
      if (formRef.value?.handleOk) {
        nextTick(() => {
          formRef.value.handleOk()
        })
      }
    }

    // 重置方法
    const onReset = () => {
      if (formRef.value?.handleCancel) {
        nextTick(() => {
          formRef.value.handleCancel()
        })
      }
    }

    // 设置字段和值
    const onSetFieldValue = obj => {
      if (!isEmpty(obj) && formRef.value?.setFieldValue) {
        Object.keys(obj).forEach(field => {
          formRef.value.setFieldValue(field, obj[field])
        })
      }
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
      showShortcut,
      handleSearch,
      handleClear,
      handleReset,
      onSearch,
      onReset,
      onSetFieldValue,
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
    // 文本域模拟替换excel换行符
    textarea[data-multi='true'] {
      overflow: hidden;
      white-space: nowrap;
      padding-right: 24px;
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
  .mars-shortcut {
    border-top: 1px $border-color dashed;
    padding: 10px 10px 0 10px;
    margin-top: 10px;
  }
}
</style>
