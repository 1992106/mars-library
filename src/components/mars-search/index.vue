<template>
  <div class="mars-search">
    <a-form :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
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
      <a-form-item>
        <slot name="search">
          <a-button type="primary" @click.prevent="onSubmit">搜索</a-button>
        </slot>
        <slot name="reset">
          <a-button style="margin-left: 10px" @click="resetFields">重置</a-button>
        </slot>
      </a-form-item>
    </a-form>
    <div class="extra-btn">
      <slot name="extra"></slot>
    </div>
  </div>
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
<style lang="scss" scoped>
.mars-search {
  display: flex;
  .ant-form-item {
    .ant-input-affix-wrapper,
    .ant-select {
      width: 130px;
    }
  }
  .extra-btn {
    flex: 1;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
