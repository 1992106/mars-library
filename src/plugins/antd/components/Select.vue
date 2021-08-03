<template>
  <div class="vxe-table--filter-antd-wrapper">
    <Select v-bind="selectProps" :options="options" v-model:value="option.data" @change="onChange"></Select>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { Select } from 'ant-design-vue'
import { omit } from 'lodash-es'

export default defineComponent({
  name: 'MySelect',
  components: {
    Select
  },
  props: {
    params: { type: Object }
  },
  setup(props) {
    const state = reactive({
      option: null,
      options: [],
      selectProps: {}
    })

    const init = () => {
      const { params } = props
      if (params) {
        const { column } = params
        state.option = column.filters[0]
        const options = column.filterRender?.options || column.filterRender?.props?.options || []
        state.options = options.map(val => omit(val, ['disabled']))
        state.selectProps = column.filterRender?.props || {}
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
