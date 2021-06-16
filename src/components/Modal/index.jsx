import { Modal } from 'ant-design-vue'

const MyModal = {
  name: 'MyModal',
  inheritAttrs: false,
  setup(_, ctx) {
    const maskClosable = process.env.NODE_ENV === 'development'
    return () => (
      <Modal
        maskClosable={maskClosable}
        {...ctx.attrs}
        footer={ctx.slots?.footer || ctx.attrs?.footer}
        title={ctx.slots?.title || ctx.attrs?.title}
      >
        {ctx.slots?.default && ctx.slots?.default()}
      </Modal>
    )
  }
}

export default MyModal
