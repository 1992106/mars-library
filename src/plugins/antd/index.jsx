import MyDatePicker from './components/DatePicker.vue'
import MyRangePicker from './components/RangePicker.vue'
import MySelect from './components/Select.vue'
import MyCascader from './components/Cascader.vue'
import MyTreeSelect from './components/TreeSelect.vue'

// VXETable渲染器
export const VXETablePluginMars = {
  install(vxetablecore) {
    const { renderer } = vxetablecore

    renderer.mixin({
      // 日期选择器
      MyDatePicker: {
        renderFilter(renderOpts, params) {
          return [<MyDatePicker key={params.column} params={params} />]
        }
      },
      // 日期范围选择器
      MyRangePicker: {
        renderFilter(renderOpts, params) {
          return [<MyRangePicker key={params.column} params={params} />]
        }
      },
      MySelect: {
        renderFilter(renderOpts, params) {
          return [<MySelect key={params.column} params={params} />]
        }
      },
      MyCascader: {
        renderFilter(renderOpts, params) {
          return [<MyCascader key={params.column} params={params} />]
        }
      },
      MyTreeSelect: {
        renderFilter(renderOpts, params) {
          return [<MyTreeSelect key={params.column} params={params} />]
        }
      }
    })
  }
}
