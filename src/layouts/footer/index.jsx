import { defineComponent } from 'vue'
import { CopyrightOutlined } from '@ant-design/icons-vue'
import setting from '@/src/config'
import styles from './index.module.scss'

const { title } = setting
const version = '1.0.0'

const AppFooter = defineComponent({
  name: 'AppFooter',
  setup() {
    return () => (
      <footer className={styles.appFooter}>
        <div className='copyright'>
          Copyright
          <CopyrightOutlined />
          {title} {new Date().getFullYear()}
          <span className='version'>{version}</span>
        </div>
      </footer>
    )
  }
})

export default AppFooter
