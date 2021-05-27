import { defineComponent, ref, computed } from 'vue'
import { Menu, Dropdown, Avatar, Modal, notification } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import setting from '@src/config'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import styles from './index.module.scss'

const PageHeader = defineComponent({
  name: 'header-avatar',
  setup() {
    const visible = ref(false)
    const store = useStore()
    const router = useRouter()

    const userInfo = computed(() => store.state.user.userInfo)

    const handleMenuClick = (e) => {
      if (e.key === 'logout') {
        visible.value = true
      }
    }

    const handleLogout = () => {
      store.dispatch('user/logout')
      notification.success({
        message: '提示',
        description: `已成功退出${setting.title}！`
      })
      router.push('/login')
    }

    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key='logout'>退出登录</Menu.Item>
      </Menu>
    )

    return () => (
      <>
        <Dropdown overlay={menu} class={styles.userDropdown}>
          <div>
            <Avatar
              size={28}
              src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?1621910757234'
            />
            <span className={styles.username}>{userInfo?.value?.nickname}</span>
            <DownOutlined class={styles.icon} />
          </div>
        </Dropdown>
        <Modal title='提示' visible={visible.value} onOk={handleLogout} onCancel={() => (visible.value = false)}>
          <p>{`您确定要退出${setting.title}吗？`}</p>
        </Modal>
      </>
    )
  }
})

export default PageHeader
