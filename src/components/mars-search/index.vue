<template>
  <a-form :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <template v-for="column in columns" :key="column.field">
      <template v-if="column?.type === 'input'">
        <a-form-item :label="column.title" v-bind="validateInfos[column.field]">
          <a-input v-model:value="modelRef[column.field]" :placeholder="column.placeholder" />
        </a-form-item>
      </template>
      <template v-else>
        <a-form-item :label="column.title" v-bind="validateInfos.region">
          <a-select v-model:value="modelRef[column.field]" :placeholder="column.placeholder">
            <template v-for="option in column?.options || []" :key="option.value">
              <a-select-option :value="option.value">{{ option.label }}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
      </template>
    </template>
    <a-form-item>
      <a-button type="primary" @click.prevent="onSubmit">搜索</a-button>
      <a-button style="margin-left: 10px" @click="resetFields">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, reactive, toRaw, watch } from 'vue'
import { useForm } from '@ant-design-vue/use'
export default defineComponent({
  name: 'MarsSearch',
  props: {
    // model: { type: Object, default: () => ({}) },
    // rules: { type: Object, default: () => ({}) },
    // 自定义列
    columns: { type: Array, default: () => [] },
    layout: {
      validator(value) {
        return ['horizontal', 'vertical', 'inline'].includes(value)
      },
      default: 'inline'
    },
    labelCol: { type: Object, default: () => ({}) },
    wrapperCol: { type: Object, default: () => ({}) },
    scrollToFirstError: { type: Boolean, default: true }
  },
  emits: ['search'],
  setup(props, { emit }) {
    const getModel = (columns) => {
      return columns.reduce((prev, next) => {
        prev[next.field] = next?.defaultValue
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
    const onSubmit = () => {
      validate()
        .then(() => {
          emit('search', toRaw(modelRef))
        })
        .catch((err) => {
          console.log('error', err)
        })
    }
    return {
      validateInfos,
      resetFields,
      onSubmit,
      modelRef
    }
  }
})
</script>
