<template>
  <div class="vxe-table--filter-antd-wrapper">
    <Select v-bind="selectProps" :options="options" v-model:value="option.data" @change="onChange"></Select>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { Select } from 'ant-design-vue'
import { omit } from 'lodash-es'
import { isEmpty } from '@/src/utils'
import useFilter from './hooks'

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
        const selectProps = column.filterRender?.props || {}
        const options = column.filterRender?.options || selectProps?.options || []
        state.options = options.map(val => omit(val, ['disabled']))
        state.selectProps = {
          allowClear: true,
          showSearch: true,
          optionFilterProp: 'label',
          ...selectProps
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

    // const hasMultiple = (column = {}) => {
    //   const { props = {} } = column?.filterRender || {}
    //   return ['multiple', 'tags'].includes(props?.mode)
    // }

    init()

    const { onFilter } = useFilter(props.params, state)

    return {
      ...toRefs(state),
      onChange
    }
  }
})
</script>
