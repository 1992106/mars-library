<template>
  <div class="vxe-table--filter-antd-wrapper">
    <RangePicker v-bind="dateProps" v-model:value="option.data" @change="onChange"></RangePicker>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { DatePicker } from 'ant-design-vue'

export default defineComponent({
  name: 'MyRangePicker',
  components: {
    RangePicker: DatePicker.RangePicker
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
        state.dateProps = {
          allowClear: true,
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          ...(column.filterRender?.props || {})
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
