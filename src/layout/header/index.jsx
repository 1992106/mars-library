import { defineComponent } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { Layout } from 'ant-design-vue'
import styles from './index.module.scss'

const PageHeader = defineComponent({
  name: 'page-header',
  props: {
    collapsed: {
      type: Boolean
    }
  },
  setup(props, { emit }) {
    return () => (
      <Layout.Header class={styles.layoutHeader}>
        <div className={styles.leftOptions}>
          <span onClick={() => emit('update:collapsed', !props.collapsed)} className={styles.menuFold}>
            {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
          {/* <Breadcrumb /> */}
        </div>
      </Layout.Header>
    )
  }
})

export default PageHeader
