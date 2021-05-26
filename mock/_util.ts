export function resultSuccess(result = {}, { msg = 'ok' } = {}) {
  return {
    status: 200,
    data: result,
    msg,
    type: 'success'
  }
}

export function resultPageSuccess(page: number, pageSize: number, list: [], { msg = 'ok' } = {}) {
  const pageData = pagination(page, pageSize, list)

  return {
    ...resultSuccess({
      items: pageData,
      total: list.length
    }),
    msg
  }
}

export function resultError(msg = 'Request failed', { status = -1, result = null } = {}) {
  return {
    status,
    content: result,
    msg,
    error: true
  }
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize)
  return offset + Number(pageSize) >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + Number(pageSize))
}

export function getRandomAvatar(username: string) {
  console.log(60)
  return fetch(`https://api.multiavatar.com/${username}.jpg`)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}
