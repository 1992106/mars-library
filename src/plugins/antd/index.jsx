import MyDatePicker from './components/DatePicker.vue'
import MyRangePicker from './components/RangePicker.vue'
import MyInput from './components/Input.vue'
import MySelect from './components/Select.vue'
import MyCascader from './components/Cascader.vue'
import MyTreeSelect from './components/TreeSelect.vue'

const MarsFilter = {
  // 日期选择器
  MyDatePicker: {
    showFilterFooter: false,
    renderFilter(renderOpts, params) {
      return [<MyDatePicker key={params.column.property} params={params} />]
    },
    filterRecoverMethod({ option }) {
      option.data = null
    }
  },
  // 日期范围选择器
  MyRangePicker: {
    showFilterFooter: false,
    renderFilter(renderOpts, params) {
      return [<MyRangePicker key={params.column.property} params={params} />]
    },
    filterRecoverMethod({ option }) {
      option.data = []
    }
  },
  MyInput: {
    showFilterFooter: false,
    renderFilter(renderOpts, params) {
      return [<MyInput key={params.column.property} params={params} />]
    },
    // 重置筛选复原方法（当未点击确认时，该选项将被恢复为默认值）
    filterRecoverMethod({ option }) {
      option.data = ''
    }
  },
  MySelect: {
    showFilterFooter: false,
    renderFilter(renderOpts, params) {
      return [<MySelect key={params.column.property} params={params} />]
    },
    filterRecoverMethod({ option, column }) {
      const { props = {}, name } = column?.filterRender || {}
      const multiple = name === 'MySelect' && ['multiple', 'tags'].includes(props?.mode)
      option.data = multiple ? [] : null
    }
  },
  MyCascader: {
    showFilterFooter: false,
    renderFilter(renderOpts, params) {
      return [<MyCascader key={params.column.property} params={params} />]
    },
    filterRecoverMethod({ option }) {
      option.data = []
    }
  },
  MyTreeSelect: {
    showFilterFooter: false,
    renderFilter(renderOpts, params) {
      return [<MyTreeSelect key={params.column.property} params={params} />]
    },
    filterRecoverMethod({ option, column }) {
      const { props = {}, name } = column?.filterRender || {}
      const multiple = name === 'MyTreeSelect' && props?.multiple
      option.data = multiple ? [] : null
    }
  }
}

export { MarsFilter }
