import { Modal, Spin } from 'ant-design-vue'

const MyModal = {
  name: 'MyModal',
  inheritAttrs: false,
  props: {
    spinProps: { type: Object }
  },
  setup(props, ctx) {
    const maskClosable = import.meta.env.MODE === 'development'
    return () => (
      <Modal
        maskClosable={maskClosable}
        {...ctx.attrs}
        footer={ctx.slots?.footer || ctx.attrs?.footer}
        title={ctx.slots?.title || ctx.attrs?.title}
      >
        <Spin {...props.spinProps}>{ctx.slots?.default && ctx.slots?.default()}</Spin>
      </Modal>
    )
  }
}

export default MyModal
