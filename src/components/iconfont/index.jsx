import { defineComponent, unref, computed } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { isString } from '@utils/is'

let MyIconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2381444_haah5fbnt3f.js'
})

const IconFont = defineComponent({
  name: 'icon-font',
  props: {
    type: { type: String, default: '' },
    color: { type: String, default: 'unset' },
    size: { type: [Number, String], default: 14 },
    scriptUrl: { type: String, default: '' }
  },
  setup(props, { attrs }) {
    // 如果外部传进来字体图标路径，则覆盖默认的
    if (props.scriptUrl) {
      MyIconFont = createFromIconfontCN({
        scriptUrl: props.scriptUrl
      })
    }

    const wrapStyleRef = computed(() => {
      const { color, size } = props

      const fs = isString(size) ? parseFloat(size) : size

      return {
        color,
        fontSize: `${fs}px`
      }
    })

    return () => <MyIconFont type={props.type || ' '} {...attrs} style={unref(wrapStyleRef)} />
  }
})

export default IconFont
