import { getCurrentInstance } from 'vue'

export function useFormLayout() {
  const { proxy } = getCurrentInstance()

  const updateLayout = () => {
    const childNodes = Array.from(proxy.$el.children)
    if (childNodes < 2) return
    const lastNode = childNodes.pop() // 删除最后一个（搜索按钮组）
    const firstNode = childNodes[0]
    const { top: firstTop } = firstNode.getBoundingClientRect()
    const lastLeft = getLastNodeLeft(lastNode) // 搜索按钮组left
    const paddingRight = hasClass(proxy.$el, 'ant-form-inline') ? 16 : 0 // padding-right: 16px
    const index = childNodes.findIndex(node => {
      const { top, left, width } = node.getBoundingClientRect()
      return top === firstTop && left + width + paddingRight > lastLeft
    })
    if (index !== -1) {
      const rest = childNodes.slice(index)
      rest.forEach(node => {
        node.classList.add('hidden')
      })
    } else {
      childNodes.forEach(node => {
        node.classList.remove('hidden')
      })
    }
    // TODO: 手动触发resize事件，调整表格高度
    setTimeout(() => {
      dispatchResize()
    }, 1000)
  }

  const getLastNodeLeft = lastNode => {
    const maxRight = proxy.$el.getBoundingClientRect().right
    // 搜索按钮组的宽度
    const width = getLastNodeRealWidth(lastNode)
    return maxRight - width
  }

  const getLastNodeRealWidth = lastNode => {
    const [searchBtn, extraBtn] = Array.from(lastNode.children)
    return searchBtn.offsetWidth + (extraBtn ? extraBtn.offsetWidth : 0)
  }

  const hasClass = (el, className) => {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  }

  const dispatchResize = () => {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, true)
    window.dispatchEvent(event)
  }

  const hasExpand = () => {
    const maxHeight = proxy.$el.clientHeight
    const childNodes = Array.from(proxy.$el.children)
    const firstNode = childNodes[0]
    return firstNode && maxHeight > firstNode.clientHeight
  }

  return {
    updateLayout,
    hasExpand
  }
}
