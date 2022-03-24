<template>
  <my-modal
    v-bind="$attrs"
    :title="title"
    :width="width"
    :zIndex="zIndex"
    v-model:visible="modalVisible"
    :destroyOnClose="true"
    wrap-class-name="mars-modal-wrap"
    :footer="null">
    <mars-form
      layout="horizontal"
      :reverse="true"
      :showExpand="false"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :columns="columns"
      @ok="handleOk"
      @cancel="handleCancel"></mars-form>
  </my-modal>
</template>
<script>
import { defineComponent, computed } from 'vue'
import MyModal from '../Modal'
export default defineComponent({
  name: 'MarsModal',
  inheritAttrs: false,
  props: {
    // 自定义字段
    columns: { type: Array, required: true, default: () => [] },
    labelCol: { type: Object, default: () => ({ span: 6 }) },
    wrapperCol: { type: Object, default: () => ({ span: 12 }) },
    // modal配置
    visible: { type: Boolean, required: true, default: false },
    title: { type: String },
    width: { type: [String, Number], default: 840 },
    zIndex: { type: Number, default: 1000 }
  },
  emits: ['update:visible', 'ok', 'cancel'],
  components: {
    MyModal
  },
  setup(props, { emit }) {
    const modalVisible = computed({
      get: () => {
        return props.visible
      },
      set: value => {
        emit('update:visible', value)
      }
    })

    const handleOk = $event => {
      emit('ok', $event)
      modalVisible.value = false
    }

    const handleCancel = () => {
      emit('cancel')
      modalVisible.value = false
    }

    return {
      modalVisible,
      handleOk,
      handleCancel
    }
  }
})
</script>
<style lang="scss">
.mars-modal-wrap {
  .mars-form {
    margin-bottom: 63px;

    &-buttons {
      position: absolute;
      right: 0;
      //bottom: 0;
      width: 100%;
      border-top: 1px solid #f0f0f0;
      border-radius: 0 0 2px 2px;
      padding: 10px 16px;
      background: #fff;
      z-index: 1;
      justify-content: flex-end;
    }
  }
}
</style>
