<template>
  <div class="mars-export">
    <a-button type="primary" @click="handleShow">
      <ExportOutlined />
      导出
    </a-button>
    <a-drawer
      :title="title"
      :width="width"
      :visible="visible"
      :zIndex="zIndex"
      :destroyOnClose="true"
      :body-style="{ paddingBottom: '80px' }"
      wrap-class-name="mars-export-wrap"
      @close="handleClose"
    >
      <slot>
        <mars-form
          layout="vertical"
          :columns="columns"
          :reverse="true"
          okText="导出"
          @ok="handleExport"
          cancelText="取消"
          @cancel="handleClose"
        ></mars-form>
      </slot>
    </a-drawer>
  </div>
</template>
<script>
import { ExportOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref } from 'vue'
export default defineComponent({
  name: 'MarsExport',
  props: {
    // 自定义列
    columns: { type: Array, default: () => [] },
    labelCol: { type: Object, default: () => ({}) },
    wrapperCol: { type: Object, default: () => ({}) },
    scrollToFirstError: { type: Boolean, default: true },
    // drawer配置
    title: { type: String, default: '导出数据' },
    width: { type: [String, Number], default: 720 },
    zIndex: { type: Number, default: 1000 }
  },
  emits: ['export'],
  components: {
    ExportOutlined
  },

  setup() {
    const form = reactive({
      name: '',
      url: '',
      owner: '',
      type: '',
      approver: '',
      dateTime: '',
      description: ''
    })
    const rules = {
      name: [
        {
          required: true,
          message: 'Please enter user name'
        }
      ],
      url: [
        {
          required: true,
          message: 'please enter url'
        }
      ],
      owner: [
        {
          required: true,
          message: 'Please select an owner'
        }
      ],
      type: [
        {
          required: true,
          message: 'Please choose the type'
        }
      ],
      approver: [
        {
          required: true,
          message: 'Please choose the approver'
        }
      ],
      dateTime: [
        {
          required: true,
          message: 'Please choose the dateTime',
          type: 'object'
        }
      ],
      description: [
        {
          required: true,
          message: 'Please enter url description'
        }
      ]
    }
    const visible = ref(false)

    const handleShow = () => {
      visible.value = true
    }

    const handleClose = () => {
      visible.value = false
    }

    const handleExport = () => {}

    return {
      form,
      rules,
      visible,
      handleShow,
      handleClose,
      handleExport
    }
  }
})
</script>
<style lang="scss">
.mars-export-wrap {
  .mars-form {
    &-footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #e9e9e9;
      padding: 10px 16px;
      background: #fff;
      text-align: right;
      z-index: 1;
      margin-bottom: 0;
    }
  }
}
</style>
