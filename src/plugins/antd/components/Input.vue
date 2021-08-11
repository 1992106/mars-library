<template>
  <div class="vxe-table--filter-antd-wrapper">
    <Input v-bind="inputProps" v-model:value="option.data" @change="onChange" @pressEnter="onEnter"></Input>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { Input } from 'ant-design-vue'
import useFilter from './hooks'

export default defineComponent({
  name: 'MyInput',
  components: {
    Input
  },
  props: {
    params: { type: Object }
  },
  setup(props) {
    const state = reactive({
      option: null,
      inputProps: {}
    })

    const init = () => {
      const { params } = props
      if (params) {
        const { column } = params
        state.option = column.filters[0]
        const inputProps = column.filterRender?.props || {}
        state.inputProps = {
          allowClear: true,
          ...inputProps
        }
      }
    }

    const onChange = $event => {
      const { params } = props
      const { option } = state
      if (params && option) {
        const { $panel } = params
        const checked = !!option.data
        $panel.changeOption(null, checked, option)
        // 清空
        if ($event?.type === 'click' && !option.data) {
          onFilter()
        }
      }
    }

    init()

    const { onFilter, onEnter } = useFilter(props.params, state)

    return {
      ...toRefs(state),
      onChange,
      onEnter
    }
  }
})
</script>
