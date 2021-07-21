<template>
  <div class="mars-export">
    <a-button type="primary" @click="drawerVisible = true">
      <ExportOutlined />
      导出
    </a-button>
    <a-drawer
      v-bind="$attrs"
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
          <a-range-picker
            v-model:value="modelRef.date"
            format="YYYY-MM-DD"
            :ranges="ranges"
            :disabledDate="disabledDate"
            @openChange="handleOpenChange"
            @calendarChange="handleCalendarChange"
          />
        </a-form-item>
        <template v-if="columns.length">
          <div><strong>导出字段选择</strong></div>
          <template v-for="column in columns" :key="column.field">
            <a-form-item :label="column?.title" v-bind="validateInfos[column.field]">
              <component
                :is="'ASwitch'"
                checked-children="开"
                un-checked-children="关"
                v-model:checked="modelRef[column.field]"
              ></component>
            </a-form-item>
          </template>
        </template>
      </a-form>
      <div class="mars-export-buttons">
        <a-space>
          <a-button @click="handleClose">取消</a-button>
          <a-button type="primary" @click.prevent="handleExport">确定</a-button>
        </a-space>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRaw, watch } from 'vue'
import { Form } from 'ant-design-vue'
import { ExportOutlined } from '@ant-design/icons-vue'
import moment from 'moment'
import { isEmpty, momentToDate } from '@/utils/index'
export default defineComponent({
  name: 'MarsExport',
  props: {
    // 自定义列
    columns: { type: Array, required: true, default: () => [] },
    labelCol: { type: Object, default: () => ({ span: 8 }) },
    wrapperCol: { type: Object, default: () => ({ span: 12 }) },
    // drawer配置
    title: { type: String, default: '导出数据' },
    width: { type: [String, Number], default: 460 },
    zIndex: { type: Number, default: 1000 }
  },
  emits: ['export', 'cancel'],
  components: {
    ExportOutlined
  },

  setup(props, { emit }) {
    const drawerVisible = ref(false)

    const dates = ref([])
    const disabledDate = current => {
      if (!dates.value || dates.value.length === 0) {
        return false
      }
      const diffDate = current.diff(dates.value[0], 'days')
      return Math.abs(diffDate) > 90
    }
    const handleOpenChange = open => {
      if (open) {
        dates.value = []
      }
    }
    const handleCalendarChange = val => {
      dates.value = val
    }

    const modelRef = reactive({})
    const rulesRef = reactive({})
    watch(
      () => props.columns,
      columns => {
        Object.assign(
          modelRef,
          reactive({
            date: [],
            ...columns.reduce((prev, next) => {
              prev[next.field] = isEmpty(next?.defaultValue) ? true : next?.defaultValue
              return prev
            }, {})
          })
        )
        Object.assign(
          rulesRef,
          reactive({
            date: [{ required: true, message: '请选择创建日期', type: 'array' }],
            ...columns.reduce((prev, next) => {
              if (!isEmpty(next?.rules)) {
                prev[next.field] = next?.rules
              }
              return prev
            }, {})
          })
        )
      },
      { deep: true, immediate: true }
    )
    const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef)

    // 导出
    const handleExport = () => {
      validate()
        .then(() => {
          const dateRaw = toRaw(modelRef)
          const exportData = { ...dateRaw, date: momentToDate(dateRaw.date) }
          emit('export', exportData)
        })
        .catch(err => {
          console.log('export error', err)
        })
    }

    const handleClose = () => {
      resetFields()
      drawerVisible.value = false
      emit('cancel')
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
      disabledDate,
      handleOpenChange,
      handleCalendarChange,
      drawerVisible,
      handleExport,
      handleClose
    }
  }
})
</script>
<style lang="scss">
.mars-export {
  &-wrap {
    .ant-drawer-wrapper-body {
      overflow: hidden;
      .ant-drawer-body {
        height: calc(100% - 53px - 55px);
        overflow: auto;
      }
    }
    .ant-form {
      .ant-form-item ~ .ant-form-item {
        margin-bottom: 0;
      }
    }
  }
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
    text-align: right;
  }
}
</style>
