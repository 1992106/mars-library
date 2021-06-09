<template>
  <a-form class="mars-form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <template v-for="column in columns" :key="column.field">
      <a-form-item :label="column?.title" v-bind="validateInfos.region">
        <template v-if="column?.type === 'ASelect'">
          <a-select
            showSearch
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :options="column.options"
            :placeholder="column?.placeholder"
            allowClear
          />
        </template>
        <template v-else-if="column?.type === 'ATreeSelect'">
          <a-tree-select
            class="tree-select"
            showSearch
            treeCheckable
            :max-tag-count="1"
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :tree-data="column.options"
            :placeholder="column?.placeholder"
            allowClear
          />
        </template>
        <template v-else-if="column?.type === 'ACascader'">
          <a-cascader
            :show-search="true"
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :options="column.options"
            :placeholder="column?.placeholder"
            allowClear
          />
        </template>
        <template v-else-if="column?.type === 'ADatePicker'">
          <a-range-picker
            format="YYYY-MM-DD"
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :placeholder="column?.placeholder || ['开始日期', '结束日期']"
            allowClear
          />
        </template>
        <template v-else-if="column?.type === 'ACheckboxGroup'">
          <a-checkbox-group
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :options="column.options"
          />
        </template>
        <template v-else-if="column?.type === 'ARadioGroup'">
          <a-radio-group
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :options="column.options"
          />
        </template>
        <template v-else-if="column?.type === 'AInputNumber'">
          <a-input-number v-bind="column?.props || {}" v-model:value="modelRef[column.field]" />
        </template>
        <template v-else>
          <a-input
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :placeholder="column?.placeholder"
            allowClear
          />
        </template>
      </a-form-item>
    </template>
    <a-form-item class="mars-form-footer">
      <template v-for="btn in reverses" :key="btn">
        <template v-if="btn === 'ok'">
          <a-button type="primary" @click.prevent="handleOk">{{ okText }}</a-button>
        </template>
        <template v-else>
          <a-button @click="handleCancel">{{ cancelText }}</a-button>
        </template>
      </template>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, reactive, ref, toRaw, watch } from 'vue'
import { useForm } from '@ant-design-vue/use'
import { momentToString } from '@utils/fn'
export default defineComponent({
  name: 'MarsForm',
  props: {
    // model: { type: Object, default: () => ({}) },
    // rules: { type: Object, default: () => ({}) },
    // 自定义字段
    columns: { type: Array, default: () => [] },
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
    okText: { type: String, default: '确认' },
    showCancel: { type: Boolean, default: true },
    cancelText: { type: String, default: '取消' }
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const hasMultiple = (column) => {
      return (
        (column?.type === 'ASelect' && ['multiple'].includes(column?.props?.mode)) ||
        (column?.type === 'ATreeSelect' && column?.props?.multiple) ||
        ['ACheckboxGroup', 'ADatePicker'].includes(column?.type)
      )
    }
    const getModel = (columns) => {
      return columns.reduce((prev, next) => {
        prev[next.field] = next?.defaultValue || (hasMultiple(next) ? [] : null)
        return prev
      }, {})
    }
    const getRules = (columns) => {
      return columns.reduce((prev, next) => {
        prev[next.field] = next?.rules
        return prev
      }, {})
    }
    let modelRef = reactive({})
    let rulesRef = reactive({})
    watch(
      () => props.columns,
      (value) => {
        modelRef = reactive(getModel(value))
        rulesRef = reactive(getRules(value))
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
      ([value, showOK, showCancel]) => {
        if (showOK === false) {
          reverses.value.shift()
        }
        if (showCancel === false) {
          reverses.value.pop()
        }
        if (value === true) {
          reverses.value.reverse()
        }
      },
      { immediate: true }
    )
    return {
      reverses,
      validateInfos,
      handleOk,
      handleCancel,
      modelRef
    }
  }
})
</script>
<style lang="scss" scoped>
.mars-form {
  &-footer {
    .ant-btn {
      margin-right: 10px;
    }
  }
}
</style>
