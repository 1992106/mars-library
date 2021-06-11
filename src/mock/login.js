import { resultError, resultSuccess } from '@src/mock/_util'

export default [
  {
    url: '/mock/login',
    timeout: 200,
    method: 'post',
    statusCode: 200,
    response: ({ body }) => {
      const { username, password } = body
      if (!username || !password || (username !== 'admin' && password === '123456')) {
        return resultError('用户名或密码错误')
      }
      return resultSuccess({
        token:
          '1yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9vYy5kZXYucGF0cGF0LnZpcFwvZXJwXC9hdXRoXC9sb2dpbiIsImlhdCI6MTYyMTg0MzMwNiwiZXhwIjoxNjIyNDQ4MTA2LCJuYmYiOjE2MjE4NDMzMDYsImp0aSI6IldrYWxjNnF1MkN6WXczTGciLCJzdWIiOjEzNiwicHJ2IjoiYzVkN2QyMDg5YzA4YTRiZDEwMGM3MDExZTk3YmRhYzNlMWY5YTUwZiJ9.6XvmOvPsmZnj1GTxIdk2SGdL_R1h44HViB7XzauQ05c',
        userInfo: {
          userId: '1',
          username: 'Admin',
          realName: 'mars library',
          password: '123456'
        }
      })
    }
  }
]
