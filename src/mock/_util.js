export function resultSuccess(result, { code = 1, error = null } = {}) {
  return {
    code,
    result,
    error,
    type: 'success'
  }
}

export function resultError(error = 'Request failed', { code = -1, result = null } = {}) {
  return {
    code,
    result,
    error,
    type: 'error'
  }
}

export function resultPageSuccess(page, pageSize, list, { message = 'ok' } = {}) {
  const pageData = pagination(page, pageSize, list)

  return {
    ...resultSuccess({
      items: pageData,
      total: list.length
    }),
    message
  }
}

export function pagination(page, pageSize, array) {
  const offset = (page - 1) * Number(pageSize)
  return offset + Number(pageSize) >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + Number(pageSize))
}
