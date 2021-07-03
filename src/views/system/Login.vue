<template>
  <div class="main">
    <Form ref="formRef" :model="form" :rules="rules" class="form" @keypress.enter="handleSubmit">
      <Item name="username">
        <Input v-model:value="form.username" placeholder="请输入用户名">
          <template #prefix>
            <UserOutlined />
          </template>
        </Input>
      </Item>
      <Item name="password">
        <InputPassword v-model:value="form.password" visibilityToggle placeholder="请输入密码">
          <template #prefix>
            <LockOutlined />
          </template>
        </InputPassword>
      </Item>
      <Item :wrapperCol="{ span: 24 }">
        <Button type="primary" size="large" block @click.prevent="handleSubmit" :loading="loading">登录</Button>
      </Item>
    </Form>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { Form, Input, Alert, Button, notification } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import setting from '@/src/config'

export default defineComponent({
  name: 'Login',
  components: {
    Form,
    Item: Form.Item,
    Input,
    Alert,
    Button,
    InputPassword: Input.Password,
    UserOutlined,
    LockOutlined
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const formRef = ref()
    const form = reactive({
      username: 'admin',
      password: '123456'
    })
    const loading = ref(false)

    const rules = {
      username: [{ required: true, message: '请输入用户名！', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码！', trigger: 'blur' }]
    }

    const timeTxt = () => {
      const hour = new Date().getHours()
      let str
      if (hour < 8) {
        str = '早上好'
      } else if (hour <= 11) {
        str = '上午好'
      } else if (hour <= 13) {
        str = '中午好'
      } else if (hour <= 18) {
        str = '下午好'
      } else {
        str = '晚上好'
      }
      return str
    }

    const handleSubmit = async () => {
      try {
        loading.value = true
        const value = await formRef.value.validate()
        const res = await store.dispatch('user/login', value)
        loading.value = false
        if (res) {
          notification.success({ message: timeTxt(), description: `欢迎登录${setting.title}` })
          router.push('/index')
        }
      } catch (error) {
        // console.log(error)
      }
    }

    return {
      form,
      loading,
      rules,
      formRef,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
  .form {
    display: flex;
    flex-direction: column;
    flex: 0 0 300px;
    :deep(.ant-form-item) {
      width: 100%;
      display: block;
    }
  }
}
</style>
