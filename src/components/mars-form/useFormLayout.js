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
    const index = childNodes.findIndex(node => {
      const { top, left } = node.getBoundingClientRect()
      return top === firstTop && left + node.offsetWidth > lastLeft
    })
    if (index !== -1) {
      const rest = childNodes.slice(index)
      rest.forEach(node => {
        node.classList.add('active')
      })
    } else {
      childNodes.forEach(node => {
        node.classList.remove('active')
      })
    }
    // TODO: 手动触发resize事件，调整表格高度
    dispatchResize()
  }

  const getLastNodeLeft = lastNode => {
    const maxWidth = proxy.$el.offsetWidth
    // 搜索按钮组的宽度
    const width = getLastNodeRealWidth(lastNode)
    return maxWidth - width
  }

  const getLastNodeRealWidth = lastNode => {
    const [searchBtn, extraBtn] = Array.from(lastNode.children)
    return searchBtn.offsetWidth + extraBtn ? getNodeRealWidth(extraBtn) : 0
  }

  const getNodeRealWidth = lastNode => {
    const childNodes = Array.from(lastNode.children)
    return childNodes.reduce((total, node) => {
      return total + node.offsetWidth
    }, 0)
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
