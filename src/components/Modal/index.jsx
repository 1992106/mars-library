import { Modal, Spin } from 'ant-design-vue'
import { computed, unref } from 'vue'

const MyModal = {
  name: 'MyModal',
  inheritAttrs: false,
  props: {
    spinProps: { type: [Boolean, Object] }
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
}

export default MyModal
