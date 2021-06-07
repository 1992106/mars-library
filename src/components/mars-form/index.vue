<template>
  <a-form class="mars-form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <template v-for="column in columns" :key="column.field">
      <template v-if="column?.type === 'select'">
        <a-form-item :label="column?.title" v-bind="validateInfos.region">
          <a-select
            showSearch
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :options="column.options"
            :placeholder="column?.placeholder || `请选择${column?.title || ''}`"
            allowClear
          />
        </a-form-item>
      </template>
      <template v-else-if="column?.type === 'treeSelect'">
        <a-tree-select
          showSearch
          treeCheckable
          v-bind="column?.props || {}"
          v-model:value="modelRef[column.field]"
          :tree-data="column.options"
          :search-placeholder="column?.placeholder || `请选择${column?.title || ''}`"
          allowClear
        />
      </template>
      <template v-else-if="column?.type === 'cascader'">
        <a-form-item :label="column?.title" v-bind="validateInfos.region">
          <a-cascader
            :show-search="true"
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :options="column.options"
            :placeholder="column?.placeholder || `请选择${column?.title || ''}`"
            allowClear
          />
        </a-form-item>
      </template>
      <template v-else>
        <a-form-item :label="column?.title" v-bind="validateInfos.region">
          <a-input
            v-model:value="modelRef[column.field]"
            :placeholder="column?.placeholder || `请输入${column?.title || ''}`"
            allowClear
            v-bind="column?.props || {}"
          />
        </a-form-item>
      </template>
    </template>
    <a-form-item class="mars-form-footer">
      <template v-for="btn in reverses" :key="btn">
        <template v-if="btn === 'ok'">
          <span>
            <slot name="ok">
              <a-button type="primary" @click.prevent="handleOk">{{ okText }}</a-button>
            </slot>
          </span>
        </template>
        <template v-else>
          <span>
            <slot name="cancel">
              <a-button @click="handleCancel">{{ cancelText }}</a-button>
            </slot>
          </span>
        </template>
      </template>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, reactive, ref, toRaw, watch } from 'vue'
import { useForm } from '@ant-design-vue/use'
export default defineComponent({
  name: 'MarsForm',
  inheritAttrs: false,
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
    scrollToFirstError: { type: Boolean, default: true },
    reverse: { type: Boolean, default: false },
    okText: { type: String, default: '搜索' },
    cancelText: { type: String, default: '重置' }
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const hasMultiple = (column) => {
      return (
        (column?.type === 'select' && ['multiple'].includes(column?.props?.mode)) ||
        (column?.type === 'treeSelect' && column?.props?.multiple)
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
          console.log(toRaw(modelRef))
          emit('ok', toRaw(modelRef))
        })
        .catch((err) => {
          console.log('error', err)
        })
    }
    const handleCancel = () => {
      resetFields()
      emit('cancel')
    }

    const reverses = ref(['ok', 'cancel'])
    watch(
      () => props.reverse,
      (value) => {
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
