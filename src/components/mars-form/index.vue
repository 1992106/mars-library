<template>
  <a-form class="mars-form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <template v-for="column in getColumns" :key="column.field">
      <a-form-item :label="column?.title" v-bind="validateInfos[column.field]">
        <component
          :is="column.type"
          v-model:[column.modelValue]="modelRef[column.field]"
          v-bind="column?.props || {}"
          v-on="column?.events || {}"
        ></component>
      </a-form-item>
    </template>
    <a-space class="mars-form-buttons">
      <template v-for="btn in reverses" :key="btn">
        <template v-if="btn === 'ok'">
          <a-button type="primary" @click.prevent="handleOk">{{ okText }}</a-button>
        </template>
        <template v-else>
          <a-button @click="handleCancel">{{ cancelText }}</a-button>
        </template>
      </template>
      <!--只看我的-->
      <slot name="only"></slot>
    </a-space>
    <slot></slot>
  </a-form>
</template>
<script>
import { computed, defineComponent, mergeProps, reactive, ref, toRaw, watch } from 'vue'
import { Form } from 'ant-design-vue'
import { dateToMoment, isEmpty, momentToDate } from '@/utils/index'
import { omit, pick } from 'lodash-es'
export default defineComponent({
  name: 'MarsForm',
  props: {
    // model: { type: Object, default: () => ({}) },
    // rules: { type: Object, default: () => ({}) },
    // 自定义字段
    columns: { type: Array, required: true, default: () => [] },
    // 表单布局
    layout: {
      validator(value) {
        return ['horizontal', 'vertical', 'inline'].includes(value)
      },
      default: 'inline'
    },
    // 标签布局
    labelCol: { type: Object, default: () => ({}) },
    // 控件布局
    wrapperCol: { type: Object, default: () => ({}) },
    scrollToFirstError: { type: Boolean, default: true },
    // 按钮
    reverse: { type: Boolean, default: false },
    showOk: { type: Boolean, default: true },
    okText: { type: String, default: '确定' },
    showCancel: { type: Boolean, default: true },
    cancelText: { type: String, default: '取消' }
  },
  emits: ['ok', 'cancel', 'clear'],
  setup(props, { emit }) {
    const defaultState = {
      AInput: {
        props: {
          allowClear: true
        },
        events: ['change', 'pressEnter']
      },
      AInputNumber: {
        events: ['pressEnter']
      },
      AAutoComplete: {
        props: {
          allowClear: true
        },
        events: ['change']
      },
      ASelect: {
        props: {
          allowClear: true,
          showSearch: true,
          optionFilterProp: 'label'
        },
        events: ['clear']
      },
      ACheckboxGroup: {},
      ARadioGroup: {},
      ASwitch: {},
      ASlider: {},
      ATreeSelect: {
        props: {
          allowClear: true,
          showSearch: true,
          treeCheckable: true,
          maxTagCount: 1
        },
        events: ['change']
      },
      ACascader: {
        props: {
          allowClear: true,
          showSearch: true,
          placeholder: ''
        },
        events: ['change']
      },
      ADatePicker: {
        props: {
          allowClear: true,
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD'
        },
        events: ['change']
      },
      AWeekPicker: {
        props: {
          allowClear: true,
          format: 'YYYY-wo',
          valueFormat: 'YYYY-MM-DD'
        },
        events: ['change']
      },
      AMonthPicker: {
        props: {
          allowClear: true,
          format: 'YYYY-MM',
          valueFormat: 'YYYY-MM-DD'
        },
        events: ['change']
      },
      ARangePicker: {
        props: {
          allowClear: true,
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD'
        },
        events: ['change']
      },
      ATimePicker: {
        props: {
          allowClear: true
        },
        events: ['change']
      }
    }
    // 获取v-model绑定名称
    const getModelValue = type => (['ASwitch'].includes(type) ? 'checked' : 'value')
    // 合并事件
    const defaultEventsMap = {
      // 组件不支持clear，使用change模拟clear
      change: $event => {
        // Input或Cascader/DatePicker/TreeSelect
        if (($event?.type === 'click' && !$event.target.value) || isEmpty($event)) {
          emit('clear', emitData())
        }
      },
      // Select
      clear: () => emit('clear', emitData()),
      // Input/InputNumber
      pressEnter: () => emit('ok', emitData())
    }
    const mergeEvents = (defaultEvents = [], events = {}) => {
      const newEvents = defaultEvents.reduce((prev, name) => {
        const defaultEvent = defaultEventsMap[name] || Function.prototype
        const event = events[name]
        prev[name] = event
          ? $event => {
              event($event)
              defaultEvent($event)
            }
          : defaultEvent
        return prev
      }, {})
      return { ...events, ...newEvents }
    }
    // 获取格式化后的columns
    const getColumns = computed(() => {
      return props.columns.map(column => {
        const { props = {}, events = {} } = column
        const defaultAllState = defaultState[column?.type] || {}
        // props
        const defaultProps = defaultAllState.props || {}
        const otherProps = omit(column, ['type', 'title', 'field', 'rules', 'props', 'events'])
        const allProps = toRaw(mergeProps(defaultProps, otherProps, props))
        const allColumn = pick(column, ['type', 'title', 'field', 'rules'])
        // events
        let defaultEvents = defaultAllState.events || []
        if (!allProps.allowClear) {
          defaultEvents = defaultEvents.filter(val => !['change', 'clear'].includes(val))
        }
        const allEvents = mergeEvents(defaultEvents, events)
        return { ...allColumn, modelValue: getModelValue(column?.type), props: allProps, events: allEvents }
      })
    })
    // 是否是多选框
    const hasMultiple = column => {
      return (
        (column?.type === 'ASelect' && ['multiple', 'tags'].includes(column?.props?.mode)) ||
        (column?.type === 'ASlider' && column?.props?.range) ||
        (column?.type === 'ATreeSelect' && column?.props?.multiple) ||
        ['ACheckboxGroup', 'ACascader', 'ARangePicker'].includes(column?.type)
      )
    }
    // 是否是日期选择框
    const hasMoment = column => {
      return ['ADatePicker', 'AWeekPicker', 'AMonthPicker', 'ARangePicker', 'ATimePicker'].includes(column?.type)
    }
    const getModel = columns => {
      const allDefaultValue = ['defaultValue', 'defaultPickerValue']
      return columns.reduce((prev, next) => {
        // 在使用useForm时，需要手动设置默认值
        let value = allDefaultValue.map(val => next?.props[val]).find(val => val != null)
        // 格式化时间（antd不支持new Date()）
        if (hasMoment(next)) {
          value = dateToMoment(value, next?.props?.valueFormat)
        }
        if (isEmpty(value)) {
          value = hasMultiple(next) ? [] : undefined
        }
        prev[next.field] = value
        return prev
      }, {})
    }
    const getRules = columns => {
      return columns.reduce((prev, next) => {
        if (!isEmpty(next?.rules)) {
          prev[next.field] = next?.rules
        }
        return prev
      }, {})
    }
    const modelRef = reactive({})
    const rulesRef = reactive({})
    watch(
      () => getColumns,
      columns => {
        Object.assign(modelRef, getModel(columns.value))
        Object.assign(rulesRef, getRules(columns.value))
      },
      { deep: true, immediate: true }
    )

    const { validate, resetFields, validateInfos } = Form.useForm(modelRef, rulesRef)
    // 获取组件名
    const getTypeByField = field => {
      return getColumns.value.find(val => val?.field === field).type
    }
    // TODO: 实现内置修饰符（trim）效果
    watch(
      () => modelRef,
      values => {
        Object.keys(values).forEach(field => {
          const value = values[field]
          const type = getTypeByField(field)
          if (['AInput'].includes(type) && typeof value === 'string') {
            modelRef[field] = value.trim()
          }
        })
      },
      { deep: true }
    )

    const emitData = () => {
      return getColumns.value.reduce((prev, column) => {
        const value = modelRef[column.field]
        prev[column.field] = hasMoment(column) ? momentToDate(value, column?.props?.valueFormat) : value
        return prev
      }, {})
    }

    const handleOk = () => {
      validate()
        .then(() => {
          emit('ok', emitData())
        })
        .catch(err => {
          console.log('from error', err)
        })
    }

    const handleCancel = () => {
      resetFields()
      emit('cancel', emitData())
    }

    const reverses = ref(['ok', 'cancel'])
    watch(
      () => [props.reverse, props.showOk, props.showCancel],
      ([reverse, showOK, showCancel]) => {
        if (showOK === false) {
          reverses.value.shift()
        }
        if (showCancel === false) {
          reverses.value.pop()
        }
        if (reverse === true) {
          reverses.value.reverse()
        }
      },
      { immediate: true }
    )
    return {
      getModelValue,
      getColumns,
      modelRef,
      validateInfos,
      reverses,
      handleOk,
      handleCancel
    }
  }
})
</script>
<style lang="less" scoped>
.mars-form {
  .ant-form-item {
    line-height: 40px;
  }
}
</style>
