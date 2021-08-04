<template>
  <div class="vxe-table--filter-antd-wrapper">
    <Cascader v-bind="cascaderProps" :options="options" v-model:value="option.data" @change="onChange"></Cascader>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { Cascader } from 'ant-design-vue'
import { recursive } from '@/src/utils'

export default defineComponent({
  name: 'MyCascader',
  components: {
    Cascader
  },
  props: {
    params: { type: Object }
  },
  setup(props) {
    const state = reactive({
      option: null,
      options: [],
      cascaderProps: {}
    })

    const init = () => {
      const { params } = props
      if (params) {
        const { column } = params
        state.option = column.filters[0]
        const cascaderProps = column.filterRender?.props || {}
        const options = column.filterRender?.options || cascaderProps?.options || []
        recursive(options, node => {
          delete node.disabled
        })
        state.options = options
        state.cascaderProps = {
          showSearch: true,
          allowClear: true,
          placeholder: '',
          ...cascaderProps
        }
      }
    }

    const onChange = () => {
      const { params } = props
      const { option } = state
      if (params && option) {
        const { $panel } = params
        const checked = !!option.data
        $panel.changeOption(null, checked, option)
      }
    }

    init()

    return {
      ...toRefs(state),
      onChange
    }
  }
})
</script>
