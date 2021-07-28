import { computed, defineComponent, unref, PropType } from 'vue'
import { Modal, Spin } from 'ant-design-vue'

type SpinProps = {
  prefixCls?: string
  spinning?: boolean
  size?: 'default' | 'small' | 'large'
  wrapperClassName?: string
  tip?: string
  delay?: number
  indicator?: any
}

const MyModal = defineComponent({
  name: 'MyModal',
  inheritAttrs: false,
  props: {
    spinProps: { type: [Boolean, Object] as PropType<boolean | SpinProps>, default: false }
  },
  setup(props, ctx) {
    const maskClosable = import.meta.env.MODE === 'development'

    const spinProps = computed(() => {
      return typeof props.spinProps === 'boolean' ? { spinning: props.spinProps } : props.spinProps
    })

    return () => (
      <Modal
        maskClosable={maskClosable}
        {...ctx.attrs}
        footer={ctx.slots?.footer || ctx.attrs?.footer}
        title={ctx.slots?.title || ctx.attrs?.title}
      >
        <Spin {...unref(spinProps)}>{ctx.slots?.default && ctx.slots?.default()}</Spin>
      </Modal>
    )
  }
})

export default MyModal
