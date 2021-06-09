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
      wrap-class-name="mars-export-wrap"
      @close="handleClose"
    >
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="创建日期" v-bind="validateInfos.date">
          <a-range-picker v-model:value="modelRef.date" format="YYYY-MM-DD" :ranges="ranges" />
        </a-form-item>
      </a-form>
      <div>
        <div><strong>导出字段选择</strong></div>
        <mars-form
          layout="horizontal"
          :reverse="true"
          v-bind="$attrs"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :columns="columns"
          @ok="handleExport"
          @cancel="handleClose"
        ></mars-form>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { ExportOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, toRaw } from 'vue'
import { useForm } from '@ant-design-vue/use'
import moment from 'moment'
import { momentToString } from '@utils/fn'
export default defineComponent({
  name: 'MarsExport',
  props: {
    // 自定义列
    columns: { type: Array, default: () => [] },
    labelCol: { type: Object, default: () => ({ span: 6 }) },
    wrapperCol: { type: Object, default: () => ({ span: 12 }) },
    // drawer配置
    title: { type: String, default: '导出数据' },
    width: { type: [String, Number], default: 720 },
    zIndex: { type: Number, default: 1000 }
  },
  emits: ['export'],
  components: {
    ExportOutlined
  },

  setup(_, { emit }) {
    const visible = ref(false)
    const handleShow = () => {
      visible.value = true
    }
    const handleClose = () => {
      resetFields()
      visible.value = false
    }

    const modelRef = reactive({
      date: [] // 创建日期
    })
    const rulesRef = reactive({
      date: [
        {
          required: true,
          message: '请选择创建日期',
          type: 'array'
        }
      ]
    })
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef)

    // 导出
    const handleExport = ($event = {}) => {
      validate()
        .then(() => {
          let dateRaw = toRaw(modelRef).date
          const exportData = { ...$event, date: momentToString(dateRaw) }
          emit('export', exportData)
        })
        .catch((err) => {
          console.log('export error', err)
        })
    }

    return {
      validateInfos,
      modelRef,
      ranges: {
        // eslint-disable-next-line prettier/prettier
        '今天': [moment(), moment()],
        // eslint-disable-next-line prettier/prettier
        '本周': [moment().startOf('week'), moment().endOf('week')],
        // eslint-disable-next-line prettier/prettier
        '本月': [moment().startOf('month'), moment().endOf('month')],
        // eslint-disable-next-line prettier/prettier
        '三个月': [moment(new Date()).subtract(2, 'months').startOf('month'), moment().endOf('month')]
      },
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
  .ant-drawer-wrapper-body {
    overflow: hidden;
    .ant-drawer-body {
      height: calc(100% - 62px);
      padding-bottom: 62px;
      overflow: auto;
    }
  }
  .mars-form {
    &-buttons {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #e9e9e9;
      padding: 10px 16px;
      background: #fff;
      z-index: 1;
      justify-content: flex-end;
    }
  }
}
</style>
