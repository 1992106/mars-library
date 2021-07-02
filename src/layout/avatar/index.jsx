import { defineComponent, ref, computed } from 'vue'
import { Menu, Dropdown, Avatar, Modal, notification } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import setting from '@/src/config'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import styles from './index.module.scss'

const { title } = setting

const MyAvatar = defineComponent({
  name: 'MyAvatar',
  setup() {
    const visible = ref(false)
    const store = useStore()
    const router = useRouter()

    const userInfo = computed(() => store.state.user.userInfo)

    const handleMenuClick = () => {
      visible.value = true
    }

    const handleLogout = () => {
      store.dispatch('user/logout')
      notification.success({
        message: '提示',
        description: `已成功退出${title}！`
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
        <Dropdown overlay={menu} class={styles.myAvatar}>
          <div>
            <Avatar
              size={28}
              src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?1621910757234'
            />
            <span className={styles.name}>{userInfo?.value?.nickname}</span>
            <DownOutlined class={styles.icon} />
          </div>
        </Dropdown>
        <Modal title='提示' visible={visible.value} onOk={handleLogout} onCancel={() => (visible.value = false)}>
          <p>{`您确定要退出${title}吗？`}</p>
        </Modal>
      </>
    )
  }
})

export default MyAvatar
