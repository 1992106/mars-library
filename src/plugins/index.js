import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// import Antd from './registerAntd'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'
// vxe-table自定义功能
import './vxe-table/filter'
import './vxe-table/formats'
// 引入Mars组件
import MarsLibrary from '../entry'

import MyModal from '@/components/Modal'
import MyIcon from '@/components/Iconfont'

// 本地全局组件
const localComponents = [MyIcon, MyModal]

// VXETable引入antd组件
VXETable.use(VXETablePluginAntd)

export function setupPlugins(app) {
  // 注册本地全局组件
  localComponents.forEach(component => {
    app.component(component.name, component)
  })
  // 注册ant-design-vue
  app.use(Antd)
  // 注册vxe-table
  app.use(VXETable)
  // 注册mars-library
  app.use(MarsLibrary)
  return app
}
