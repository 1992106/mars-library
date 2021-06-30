<template>
  <a-form class="mars-form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <template v-for="column in getColumns" :key="column.field">
      <a-form-item :label="column?.title" v-bind="validateInfos[column.field]">
        <component
          :is="column.type"
          v-bind="column?.props || {}"
          v-model:[column.modelValue]="modelRef[column.field]"
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
import { useForm } from '@ant-design-vue/use'
import { dateToMoment, isEmpty, momentToString } from '@/utils'
import { omit, pick } from 'lodash'
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
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const defaultState = {
      AInput: {
        allowClear: true
      },
      AInputNumber: {},
      AAutoComplete: {
        allowClear: true
      },
      ASelect: {
        allowClear: true,
        showSearch: true
      },
      ACheckboxGroup: {},
      ARadioGroup: {},
      ASwitch: {},
      ASlider: {},
      ATreeSelect: {
        allowClear: true,
        showSearch: true,
        treeCheckable: true,
        maxTagCount: 1
      },
      ACascader: {
        showSearch: true,
        allowClear: true
      },
      ADatePicker: {
        allowClear: true
      },
      AWeekPicker: {
        allowClear: true
      },
      AMonthPicker: {
        allowClear: true
      },
      ARangePicker: {
        allowClear: true,
        format: 'YYYY-MM-DD'
      },
      ATimePicker: {
        allowClear: true
      }
    }
    // 获取v-model绑定名称
    const getModelValue = (type) => (['ASwitch'].includes(type) ? 'checked' : 'value')
    // 获取格式化后的columns
    const getColumns = computed(() => {
      return props.columns.map((column) => {
        const { props = {}, events = {} } = column
        const defaultProps = defaultState[column?.type] || {}
        const otherProps = omit(column, ['type', 'title', 'field', 'rules', 'props', 'events'])
        const allProps = toRaw(mergeProps(defaultProps, otherProps, props))
        const allColumn = pick(column, ['type', 'title', 'field', 'rules'])
        return { ...allColumn, modelValue: getModelValue(column?.type), props: allProps, events: events }
      })
    })
    // 是否是多选框
    const hasMultiple = (column) => {
      return (
        (column?.type === 'ASelect' && ['multiple', 'tags'].includes(column?.props?.mode)) ||
        (column?.type === 'ASlider' && column?.props?.range) ||
        (column?.type === 'ATreeSelect' && column?.props?.multiple) ||
        ['ACheckboxGroup', 'ARangePicker'].includes(column?.type)
      )
    }
    // 是否是日期选择框
    const hasMoment = (column) => {
      return ['ADatePicker', 'AWeekPicker', 'AMonthPicker', 'ARangePicker', 'ATimePicker'].includes(column?.type)
    }
    const getModel = (columns) => {
      const allDefaultValue = ['defaultValue', 'defaultPickerValue']
      return columns.reduce((prev, next) => {
        // 在使用useForm时，allDefaultValue中的默认值不生效；所以手动设置默认值
        let value = allDefaultValue.map((val) => next?.props[val]).find((val) => val != null)
        // 格式化时间
        if (hasMoment(next)) {
          value = dateToMoment(value)
        }
        if (isEmpty(value)) {
          value = hasMultiple(next) ? [] : undefined
        }
        prev[next.field] = value
        return prev
      }, {})
    }
    const getRules = (columns) => {
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
      (columns) => {
        Object.assign(modelRef, getModel(columns.value))
        Object.assign(rulesRef, getRules(columns.value))
      },
      { deep: true, immediate: true }
    )

    const { validate, resetFields, validateInfos } = useForm(modelRef, rulesRef)

    const handleOk = () => {
      validate()
        .then(() => {
          const modelRaw = toRaw(modelRef)
          Object.keys(modelRaw).forEach((item) => {
            let value = modelRaw[item]
            if (typeof value === 'string') {
              value = value.trim()
            }
            modelRaw[item] = momentToString(value)
          })
          emit('ok', modelRaw)
        })
        .catch((err) => {
          console.log('from error', err)
        })
    }

    const handleCancel = () => {
      resetFields()
      emit('cancel')
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
