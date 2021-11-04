import { isEmpty } from '@/utils'
import { omit } from 'lodash-es'

const typeMap = {
  seq: '序号',
  checkbox: '复选框',
  radio: '单选框',
  expand: '展开行'
}

export const generateLeaf = (columns, list = []) => {
  columns.forEach(column => {
    if (column?.children) {
      generateLeaf(column?.children, list)
    } else {
      list.push(column)
    }
  })
  return list
}

export const columnsToStorage = columns => {
  return (columns || []).map(val => {
    let title = val?.title
    let field = val?.field || val?.slots?.default
    if (val?.type) {
      title = typeMap[val?.type]
      field = val?.type
    }
    const width = val?.width || val?.minWidth
    return {
      field,
      title,
      ...(val?.fixed ? { fixed: val?.fixed } : {}),
      ...(width ? { width } : {}),
      visible: isEmpty(val?.visible) ? true : val?.visible
    }
  })
}

export const storageToColumns = (storageColumns, columns) => {
  return (storageColumns || []).map(val => {
    const column = (columns || []).find(v => {
      const field = v?.field || v?.slots?.default || v?.type
      return field === val?.field
    })
    const restColumn = omit(column, ['fixed', 'width', 'visible'])
    return {
      ...(restColumn ? restColumn : {}),
      ...(val?.fixed ? { fixed: val?.fixed } : {}),
      ...(val?.width ? { width: val?.width } : {}),
      visible: val?.visible
    }
  })
}
