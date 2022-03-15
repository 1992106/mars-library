import { defineComponent } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { Layout } from 'ant-design-vue'
import Breadcrumb from '../breadcrumb/index.vue'
import Avatar from '../avatar/index.jsx'
import styles from './index.module.scss'

const AppHeader = defineComponent({
  name: 'AppHeader',
  props: {
    collapsed: {
      type: Boolean
    }
  },
  setup(props, { emit }) {
    return () => (
      <Layout.Header class={styles.appHeader}>
        <div className={styles.breadcrumb}>
          <span onClick={() => emit('update:collapsed', !props.collapsed)} className={styles.collapsed}>
            {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
          <Breadcrumb />
        </div>
        <Avatar />
      </Layout.Header>
    )
  }
})

export default AppHeader
