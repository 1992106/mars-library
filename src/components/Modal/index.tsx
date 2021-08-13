import { computed, defineComponent, PropType, ref, toRefs, unref, watchEffect } from 'vue'
import { Modal, Spin } from 'ant-design-vue'
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { useModalDragMove } from './useModalDrag'
import './index.scss'

type SpinProps = {
  prefixCls?: string
  spinning?: boolean
  size?: 'default' | 'small' | 'large'
  wrapperClassName?: string
  tip?: string
  delay?: number
  indicator?: any
}

const ModalProps = {
  visible: Boolean,
  destroyOnClose: Boolean,
  wrapClassName: String
}
const MyModal = defineComponent({
  name: 'MyModal',
  inheritAttrs: false,
  props: {
    ...ModalProps,
    draggable: { type: Boolean, default: true },
    showFullscreen: { type: Boolean, default: true },
    fullscreen: { type: Boolean, default: false },
    spinProps: { type: [Boolean, Object] as PropType<boolean | SpinProps>, default: false }
  },
  setup(props, ctx) {
    const maskClosable = import.meta.env.MODE === 'development'

    // 加载
    const spinProps = computed(() => {
      return typeof props.spinProps === 'boolean' ? { spinning: props.spinProps } : props.spinProps
    })

    // 拖拽
    const { visible, draggable, destroyOnClose } = toRefs(props)
    useModalDragMove({
      visible,
      destroyOnClose,
      draggable
    })

    // 全屏
    const fullScreenRef = ref(false)
    watchEffect(() => {
      fullScreenRef.value = props.fullscreen
    })

    const handleFullScreen = (e: Event) => {
      e?.stopPropagation()
      e?.preventDefault()
      fullScreenRef.value = !unref(fullScreenRef)
    }

    const renderIcon = () => {
      return props?.showFullscreen ? (
        <div class='my-model-close-fullscreen'>
          {props.fullscreen ? (
            <FullscreenExitOutlined onClick={handleFullScreen} />
          ) : (
            <FullscreenOutlined onClick={handleFullScreen} />
          )}
          <CloseOutlined />
        </div>
      ) : (
        <CloseOutlined />
      )
    }

    const wrapClassName = computed(() => `${props.wrapClassName} ${unref(fullScreenRef) ? 'my-model-fullscreen' : ''}`)

    return () => (
      <Modal
        {...props}
        {...ctx.attrs}
        maskClosable={maskClosable}
        wrapClassName={unref(wrapClassName)}
        closeIcon={renderIcon()}
        title={ctx.slots?.title || ctx.attrs?.title}
        footer={ctx.slots?.footer || ctx.attrs?.footer}
      >
        <Spin {...unref(spinProps)}>{ctx.slots?.default && ctx.slots?.default()}</Spin>
      </Modal>
    )
  }
})

export default MyModal
