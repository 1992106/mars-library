<template>
  <div class="vxe-table--filter-antd-wrapper">
    <Input
      v-bind="inputProps"
      v-model:value="option.data"
      @change="onChange"
      @pressEnter="onEnter"
      @blur="onBlur"
    ></Input>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import { Input } from 'ant-design-vue'

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
      inputProps: {},
      isEnter: false
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

    const onEnter = $event => {
      if (state.option.data && $event.keyCode === 13) {
        onFilter()
        state.isEnter = true
      }
    }

    const onBlur = () => {
      if (state.option.data && !state.isEnter) {
        onFilter()
      }
      state.isEnter = false
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
      onEnter,
      onBlur
    }
  }
})
</script>
