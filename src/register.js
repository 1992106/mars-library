import { message, notification, Table } from 'ant-design-vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'

VXETable.use(VXETablePluginAntd)

const components = [Table]

export function registerComponents(app) {
  app.config.globalProperties.$message = message
  app.config.globalProperties.$notification = notification
  components.forEach((component) => {
    app.component(component?.name || component?.displayName, component)
  })
  app.use(VXETable)
}
