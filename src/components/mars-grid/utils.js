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

export const getField = column => {
  return column?.field || column?.slots?.default || column?.type || column?.title
}

const getPrevious = (column, columns) => {
  const index = columns.findIndex(val => getField(val) === getField(column))
  return columns[index - 1]
}

const hasPrevious = (column, columns) => {
  return columns.map(val => getField(val)).includes(getField(column))
}

export const mergeStorageAndColumns = (oldColumns, newColumns) => {
  const listFieldMap = oldColumns.map(val => val?.field)
  const columnsFieldMap = newColumns.map(val => getField(val))
  // 删除没有的
  const restColumns = oldColumns.filter(item => columnsFieldMap.includes(item?.field))
  // 找到新增的
  const otherColumns = newColumns.filter(item => !listFieldMap.includes(getField(item)))
  otherColumns.forEach(item => {
    const newPrevious = getPrevious(item, newColumns)
    const isPrevious = hasPrevious(newPrevious, restColumns)
    let newIndex
    if (isPrevious) {
      newIndex = restColumns.findIndex(val => val?.field === getField(newPrevious)) + 1
    } else {
      newIndex = restColumns.findIndex(val => !val?.fixed)
    }
    const columns = columnsToStorage([item])
    restColumns.splice(newIndex, 0, columns[0])
  })
  return restColumns
}

export const columnsToStorage = columns => {
  return (columns || []).map(val => {
    let title = val?.title
    if (!title && val?.type) {
      title = typeMap[val?.type]
    }
    return {
      title,
      field: getField(val),
      ...(val?.fixed ? { fixed: val?.fixed } : {}),
      ...(val?.width ? { width: val?.width } : {}),
      ...(val?.minWidth ? { minWidth: val?.minWidth } : {}),
      visible: isEmpty(val?.visible) ? true : val?.visible
    }
  })
}

export const storageToColumns = (storageColumns, columns) => {
  return (storageColumns || []).map(val => {
    const column = (columns || []).find(v => val?.field === getField(v))
    const omitList = ['fixed', 'width', 'minWidth']
    if (column?.field === column?.title) {
      omitList.push('field')
    }
    const restColumn = omit(column || {}, omitList)
    return {
      ...(restColumn ? restColumn : {}),
      ...(val?.fixed ? { fixed: val?.fixed } : {}),
      ...(val?.width ? { width: val?.width } : {}),
      ...(val?.minWidth ? { minWidth: val?.minWidth } : {}),
      visible: val?.visible
    }
  })
}
