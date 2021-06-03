import { defineComponent, unref, computed } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import setting from '@src/config'

const IconFont = defineComponent({
  name: 'icon-font',
  props: {
    type: { type: String, default: '' },
    color: { type: String, default: 'unset' },
    size: { type: [Number, String], default: 14 },
    scriptUrl: { type: String, default: setting.iconfont_url }
  },
  setup(props, { attrs }) {
    const MyIconFont = createFromIconfontCN({
      scriptUrl: props.scriptUrl
    })

    const wrapStyleRef = computed(() => {
      const { color, size } = props

      const fs = parseFloat(size)

      return {
        color,
        fontSize: `${fs}px`
      }
    })

    return () => <MyIconFont type={props.type || ' '} {...attrs} style={unref(wrapStyleRef)} />
  }
})

export default IconFont
