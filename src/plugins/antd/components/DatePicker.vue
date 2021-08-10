<template>
  <div class="vxe-table--filter-antd-wrapper">
    <DatePicker
      v-bind="dateProps"
      v-model:value="option.data"
      @change="onChange"
      @openChange="onOpenChange"
    ></DatePicker>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { DatePicker } from 'ant-design-vue'
import { isEmpty } from '@/src/utils'

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
        state.dateProps = {
          allowClear: true,
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
        const checked = !isEmpty(option.data)
        $panel.changeOption(null, checked, option)
        // 清空
        if (isEmpty(option.data)) {
          onFilter()
        }
      }
    }

    const onOpenChange = () => {
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
      onOpenChange
    }
  }
})
</script>
