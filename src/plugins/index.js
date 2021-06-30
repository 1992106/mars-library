import {
  message,
  notification,
  Affix,
  Anchor,
  AutoComplete,
  Alert,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Collapse,
  Carousel,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  Menu,
  Mentions,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Transfer,
  Tree,
  TreeSelect,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Upload,
  Drawer,
  Skeleton,
  Comment,
  ConfigProvider,
  Empty,
  Result,
  Descriptions,
  PageHeader,
  Space,
  Image,
  Typography
} from 'ant-design-vue'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'
import MarsLibrary from '../entry'

// VXETable引入antd组件
VXETable.use(VXETablePluginAntd)

const components = [
  Affix,
  Anchor,
  AutoComplete,
  Alert,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Collapse,
  Carousel,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  Menu,
  Mentions,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Transfer,
  Tree,
  TreeSelect,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Upload,
  Drawer,
  Skeleton,
  Comment,
  ConfigProvider,
  Empty,
  Result,
  Descriptions,
  PageHeader,
  Space,
  Image,
  Typography
]

export function setupPlugins(app) {
  components.forEach(component => {
    app.use(component)
  })
  // 注册antd组件
  app.config.globalProperties.$message = message
  app.config.globalProperties.$notification = notification
  app.config.globalProperties.$info = Modal.info
  app.config.globalProperties.$success = Modal.success
  app.config.globalProperties.$error = Modal.error
  app.config.globalProperties.$warning = Modal.warning
  app.config.globalProperties.$confirm = Modal.confirm
  app.config.globalProperties.$destroyAll = Modal.destroyAll
  // 注册vxe-table
  app.use(VXETable)
  // 注册mars-library
  app.use(MarsLibrary)
  return app
}
