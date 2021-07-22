import { defineComponent, unref, computed } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import setting from '@/src/config'

let IconFont = createFromIconfontCN({
  scriptUrl: setting.iconfont_url
})

const MyIcon = defineComponent({
  name: 'MyIcon',
  props: {
    type: { type: String, require: true },
    size: { type: [Number, String], default: 14 },
    color: { type: String, default: 'unset' },
    spin: { type: Boolean },
    rotate: { type: Number },
    class: { type: String },
    style: { type: Object, default: () => ({}) },
    scriptUrl: { type: String }
  },
  setup(props, { attrs }) {
    if (props.scriptUrl) {
      IconFont = createFromIconfontCN({
        scriptUrl: props.scriptUrl
      })
    }

    const wrapStyleRef = computed(() => {
      const { color, size, rotate } = props

      const fs = parseFloat(size)

      return {
        color,
        fontSize: `${fs}px`,
        ...(rotate ? { transform: `rotate(${rotate}deg)` } : {}),
        ...props.style
      }
    })

    return () => (
      <IconFont
        type={props.type}
        {...attrs}
        class={`'my-icon' ${props.class} ${props.spin && 'anticon-spin'}`}
        style={unref(wrapStyleRef)}
      />
    )
  }
})

export default MyIcon
