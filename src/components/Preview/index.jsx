import { ref, defineComponent, computed, reactive, watch } from 'vue'
import Preview from 'ant-design-vue/es/vc-image/src/Preview'
import { context } from 'ant-design-vue/es/vc-image/src/PreviewGroup'

const Group = defineComponent({
  name: 'PreviewGroup',
  inheritAttrs: false,
  props: {
    visible: { type: Boolean, required: true },
    urls: { type: Array, required: true },
    current: { type: Number, default: 0 }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const previewUrls = reactive({})
    const current = ref(0)
    const isPreviewGroup = ref(false)
    const isShowPreview = computed({
      get: () => props.visible,
      set: val => {
        emit('update:visible', val)
      }
    })

    const setCurrent = val => {
      current.value = val
    }

    watch(
      () => props.current,
      val => setCurrent(val),
      { immediate: true }
    )

    watch(
      () => props.visible,
      val => {
        if (val) {
          props.urls.forEach((item, idx) => {
            previewUrls[idx] = item
          })
          isPreviewGroup.value = props.urls.length > 1
          if (props.urls.length <= 1) {
            current.value = 0
          }
        }
      }
    )

    const onPreviewClose = e => {
      e?.stopPropagation()
      isShowPreview.value = false
      emit('update:visible', false)
      Object.keys(previewUrls).forEach(key => {
        delete previewUrls[key]
      })
      current.value = props.current
    }

    context.provide({
      isPreviewGroup,
      previewUrls,
      current,
      setCurrent
    })

    return () => (
      <Preview
        ria-hidden={!isShowPreview.value}
        visible={isShowPreview.value}
        prefixCls='ant-image-preview'
        onClose={onPreviewClose}
        src={previewUrls[current.value]}
      />
    )
  }
})

export default Group
