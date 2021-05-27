import router from '@src/router'

export function useGo(_router) {
  const __router = _router || router
  const { push, replace } = __router

  return (options, isReplace = false) => {
    const handler = isReplace ? replace : push
    handler(options).catch((err) => console.log(`hooks->useRouter:go${err}`))
  }
}
