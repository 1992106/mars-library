<template>
  <a-form class="mars-form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <template v-for="column in columns" :key="column.field">
      <a-form-item :label="column?.title" v-bind="validateInfos.region">
        <template v-if="column?.type === 'select'">
          <a-select
            showSearch
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :options="column.options"
            :placeholder="column?.placeholder || `请选择${column?.title || ''}`"
            allowClear
          />
        </template>
        <template v-else-if="column?.type === 'treeSelect'">
          <a-tree-select
            class="tree-select"
            showSearch
            treeCheckable
            :max-tag-count="1"
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :tree-data="column.options"
            :placeholder="column?.placeholder || `请选择${column?.title || ''}`"
            allowClear
          />
        </template>
        <template v-else-if="column?.type === 'cascader'">
          <a-cascader
            :show-search="true"
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :options="column.options"
            :placeholder="column?.placeholder || `请选择${column?.title || ''}`"
            allowClear
          />
        </template>
        <template v-else-if="column?.type === 'datePicker'">
          <a-range-picker
            format="YYYY-MM-DD"
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :placeholder="column?.placeholder || ['开始日期', '结束日期']"
            allowClear
          />
        </template>
        <template v-else-if="column?.type === 'checkbox'">
          <a-checkbox-group
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :options="column.options"
          />
        </template>
        <template v-else-if="column?.type === 'inputNumber'">
          <a-input-number v-bind="column?.props || {}" v-model:value="modelRef[column.field]" />
        </template>
        <template v-else>
          <a-input
            v-bind="column?.props || {}"
            v-model:value="modelRef[column.field]"
            :placeholder="column?.placeholder || `请输入${column?.title || ''}`"
            allowClear
          />
        </template>
      </a-form-item>
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
import { momentToString } from '@utils/fn'
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
        (column?.type === 'treeSelect' && column?.props?.multiple) ||
        ['checkbox', 'datePicker'].includes(column?.type)
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
