<template>
  <div class="mars-export">
    <a-button type="primary" @click="handleShow">
      <ExportOutlined />
      导出
    </a-button>
    <a-drawer
      :title="title"
      :width="width"
      :zIndex="zIndex"
      v-model:visible="drawerVisible"
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
        <div v-if="columns?.length"><strong>导出字段选择</strong></div>
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
    columns: { type: Array, required: true, default: () => [] },
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
    const drawerVisible = ref(false)
    const handleShow = () => {
      drawerVisible.value = true
    }
    const handleClose = () => {
      resetFields()
      drawerVisible.value = false
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
      drawerVisible,
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
      height: calc(100% - 63px);
      padding-bottom: 63px;
      overflow: auto;
    }
  }
  .mars-form {
    margin-bottom: 63px;
    &-buttons {
      position: absolute;
      right: 0;
      bottom: 0;
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
