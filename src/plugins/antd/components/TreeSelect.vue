<template>
  <div class="vxe-table--filter-antd-wrapper">
    <TreeSelect
      v-bind="treeSelectProps"
      :treeData="treeData"
      v-model:value="option.data"
      @change="onChange"
      @blur="onBlur"
    ></TreeSelect>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { TreeSelect } from 'ant-design-vue'
import { isEmpty, recursive } from '@/src/utils'

export default defineComponent({
  name: 'MyTreeSelect',
  components: {
    TreeSelect
  },
  props: {
    params: { type: Object }
  },
  setup(props) {
    const state = reactive({
      option: null,
      treeData: [],
      treeSelectProps: {}
    })

    const init = () => {
      const { params } = props
      if (params) {
        const { column } = params
        state.option = column.filters[0]
        const treeSelectProps = column.filterRender?.props || {}
        const { treeData = [] } = treeSelectProps
        recursive(treeData, node => {
          delete node.disabled
          delete node.disableCheckbox
        })
        state.treeData = treeData
        state.treeSelectProps = {
          allowClear: true,
          showSearch: true,
          treeCheckable: true,
          maxTagCount: 1,
          ...treeSelectProps
        }
      }
    }

    const onChange = () => {
      const { params } = props
      const { option } = state
      if (params && option) {
        const { $panel } = params
        const checked = !isEmpty(option.data)
        $panel.changeOption(null, checked, option)
        // 清空
        if (isEmpty(option.data)) {
          onFilter()
        }
      }
    }

    const onBlur = () => {
      if (!isEmpty(state.option.data)) {
        onFilter()
      }
    }

    const onFilter = () => {
      const { params: { $panel } = {} } = props
      const { option } = state
      if ($panel && option) {
        // TODO: 未知bug，手动设置
        option.checked = option._checked
        $panel?.confirmFilter(null)
      }
    }

    init()

    return {
      ...toRefs(state),
      onChange,
      onBlur
    }
  }
})
</script>
