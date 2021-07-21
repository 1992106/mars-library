import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// import Antd from './registerAntDesign'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'
import MarsLibrary from '../entry'

// VXETable引入antd组件
VXETable.use(VXETablePluginAntd)

export function setupPlugins(app) {
  // 注册ant-design-vue
  app.use(Antd)
  // 注册vxe-table
  app.use(VXETable)
  // 注册mars-library
  app.use(MarsLibrary)
  return app
}
