import { MarsFilter } from './antd'

// VXETable渲染器
export const VXETablePluginMars = {
  install(vxetablecore) {
    const { renderer } = vxetablecore

    renderer.mixin(MarsFilter)
  }
}
