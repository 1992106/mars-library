import { MockMethod } from 'vite-plugin-mock'
import { resultError, resultSuccess } from './_util'

const userList = [
  {
    userId: 1,
    username: 'cmax',
    nickname: 'xxx',
    password: '123456',
    token: 'cmaxToken'
  }
]

export default [
  {
    url: '/login',
    timeout: 200,
    method: 'post',
    response: ({ body = {} }) => {
      const { username, password } = body as any
      const target = userList.find((item) => item.username === username && item.password === password)
      if (!target) {
        return resultError('无效的用户名或密码！')
      }

      // fetch('https://api.multiavatar.com/Binx')
      //   .then((res) => {
      //     console.log(res, 123)
      //     return res.text()
      //   })
      //   .then((svg) => console.log(svg))

      return resultSuccess({
        user: target,
        token:
          '1yJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9vYy5kZXYucGF0cGF0LnZpcFwvZXJwXC9hdXRoXC9sb2dpbiIsImlhdCI6MTYyMTg0MzMwNiwiZXhwIjoxNjIyNDQ4MTA2LCJuYmYiOjE2MjE4NDMzMDYsImp0aSI6IldrYWxjNnF1MkN6WXczTGciLCJzdWIiOjEzNiwicHJ2IjoiYzVkN2QyMDg5YzA4YTRiZDEwMGM3MDExZTk3YmRhYzNlMWY5YTUwZiJ9.6XvmOvPsmZnj1GTxIdk2SGdL_R1h44HViB7XzauQ05c'
      })
      // getRandomAvatar(target.username)
      //   .then((res) => {
      //     return resultSuccess({
      //       user: { ...target, avatar: res },
      //       token: target.username + target.nickname + target.userId
      //     })
      //   })
      //   .catch(() => {
      //     return resultError('无效的用户名或密码！')
      //   })
    }
  }
] as MockMethod[]
