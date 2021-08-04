<template>
  <div class="vxe-table--filter-antd-wrapper">
    <DatePicker v-bind="dateProps" v-model:value="option.data" @change="onChange"></DatePicker>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { DatePicker } from 'ant-design-vue'

export default defineComponent({
  name: 'MyDatePicker',
  components: {
    DatePicker
  },
  props: {
    params: { type: Object }
  },
  setup(props) {
    const state = reactive({
      option: null,
      dateProps: {}
    })

    const init = () => {
      const { params } = props
      if (params) {
        const { column } = params
        state.option = column.filters[0]
        state.dateProps = { allowClear: true, ...(column.filterRender?.props || {}) }
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
