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
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="创建日期">
          <a-range-picker v-model:value="formState.date" format="YYYY-MM-DD" :ranges="ranges" />
        </a-form-item>
      </a-form>
      <div>
        <mars-form
          layout="horizontal"
          :columns="columns"
          :reverse="true"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          okText="导出"
          @ok="handleExport"
          cancelText="取消"
          @cancel="handleClose"
        ></mars-form>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { ExportOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, toRaw } from 'vue'
import moment from 'moment'
import { momentToString } from '@utils/fn'
export default defineComponent({
  name: 'MarsExport',
  props: {
    // 自定义列
    columns: { type: Array, default: () => [] },
    labelCol: { type: Object, default: () => ({ span: 6 }) },
    wrapperCol: { type: Object, default: () => ({ span: 12 }) },
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

  setup(_, { emit }) {
    const visible = ref(false)

    const handleShow = () => {
      visible.value = true
    }

    const handleClose = () => {
      visible.value = false
    }

    const formState = reactive({
      date: [] // 创建日期
    })

    const handleExport = ($event = {}) => {
      let dateRaw = toRaw(formState).date
      const exportData = { ...$event, date: momentToString(dateRaw) }
      emit('export', exportData)
    }

    return {
      formState,
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
  .mars-form {
    &-footer {
      display: block;
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
      .ant-form-item-control-wrapper {
        flex: none;
        max-width: initial;
      }
    }
  }
}
</style>
