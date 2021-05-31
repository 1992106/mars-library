import {
  message,
  notification,
  Modal,
  Table,
  Tabs,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Cascader,
  Checkbox,
  Radio,
  Switch,
  DatePicker,
  TimePicker,
  Tree,
  Image,
  Upload,
  Tooltip,
  Popover,
  Popconfirm,
  Spin
} from 'ant-design-vue'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import 'xe-utils'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'
// import MarsLibrary from '../dist/mars-library.es'
import MarsLibrary from '../entry'

// VXETable引入antd组件
VXETable.use(VXETablePluginAntd)

const components = [
  Table,
  Tabs,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Cascader,
  Checkbox,
  Radio,
  Switch,
  DatePicker,
  TimePicker,
  Tree,
  Image,
  Upload,
  Tooltip,
  Popover,
  Popconfirm,
  Spin
]

export function setupPlugins(app) {
  // 注册antd组件
  app.config.globalProperties.$message = message
  app.config.globalProperties.$notification = notification
  app.config.globalProperties.$info = Modal.info
  app.config.globalProperties.$success = Modal.success
  app.config.globalProperties.$error = Modal.error
  app.config.globalProperties.$warning = Modal.warning
  app.config.globalProperties.$confirm = Modal.confirm
  app.config.globalProperties.$destroyAll = Modal.destroyAll
  components.forEach((component) => {
    app.use(component)
  })
  // 注册vxe-table
  app.use(VXETable)
  // 注册mars-library
  app.use(MarsLibrary)
  return app
}
