import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'
import MyLogo from '../logo/index.vue'
import MyMenu from '../menu/index.vue'

export default defineComponent({
  name: 'AppSider',
  props: {
    collapsed: { type: Boolean, require: true }
  },
  setup(props) {
    return () => (
      <Layout.Sider
        theme='light'
        trigger={null}
        collapsible
        collapsed={props.collapsed}
        collapsedWidth={48}
        width={200}
      >
        <MyLogo collapsed={props.collapsed} />
        <MyMenu collapsed={props.collapsed} />
      </Layout.Sider>
    )
  }
})
