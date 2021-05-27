<template>
  <a-table
    ref="xTable"
    border
    :columns="columns"
    :dataSource="dataSource"
    :loading="loading"
    :pagination="false"
    :scroll="scroll"
    :row-selection="getRowSelection"
  />
  <a-pagination
    v-if="showPagination"
    show-size-changer
    v-bind="getPaginationConfig"
    :current="pagination.page"
    :pageSize="pagination.limit"
    :total="total"
    @change="handlePageChange"
    @showSizeChange="handleShowSizeChange"
  />
</template>
<script>
import { computed, defineComponent, mergeProps, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue'
import { Table, Pagination } from 'ant-design-vue'
import { debounce } from 'lodash'
export default defineComponent({
  name: 'MarsTable',
  components: {
    [Table.name]: Table,
    [Pagination.name]: Pagination
  },
  props: {
    // 自定义列
    columns: { type: Array, default: () => [] },
    // 表格数据
    dataSource: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    total: { type: Number, default: 0 },
    // 页码
    pagination: { type: Object, default: () => ({ page: 1, limit: 20 }) },
    paginationConfig: Object,
    // 横向/纵向滚动
    scroll: { type: Object, default: () => ({ x: null, y: null, scrollToFirstRowOnChange: false }) },
    // 选择功能的配置
    rowSelection: Object,
    // 表格除外的高度
    offsetHeight: { type: Number, default: 268 }
  },
  emits: ['search', 'update:pagination', 'update:selected-value'],
  setup(props, { emit }) {
    /**
     * 默认值
     */
    const defaultState = {
      defaultPaginationConfig: { disabled: false, pageSizeOptions: ['20', '30', '60', '100'] },
      defaultRowSelection: { selections: true }
    }
    /**
     * data
     */
    const state = reactive({
      tableHeight: 300,
      filters: {}
    })
    /**
     * refs
     */
    const xTable = ref(null)
    /**
     * 计算属性
     */
    const getPaginationConfig = computed(() => mergeProps(defaultState.defaultPaginationConfig, props.paginationConfig))
    const getRowSelection = computed(() => mergeProps(defaultState.defaultRowSelection, props.rowSelection))
    /**
     * methods
     */
    // 监听视窗大小改变
    const onResize = () => {
      const clientHeight = document.body.clientHeight - props.offsetHeight
      state.tableHeight = clientHeight < 300 ? 300 : clientHeight
    }
    onMounted(() => {
      nextTick(onResize)
      window.addEventListener('resize', debounce(onResize, 200))
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize)
    })
    // 操作项
    const handleCommand = (index, row, command) => {
      return {
        index,
        row,
        command
      }
    }
    // 页码
    const handlePageChange = (current, pageSize) => {
      const pagination = {
        page: current,
        limit: pageSize
      }
      emit('update:pagination', pagination)
      emit('search')
    }
    const handleShowSizeChange = (_, pageSize) => {
      const pagination = {
        page: 1,
        limit: pageSize
      }
      emit('update:pagination', pagination)
      emit('search')
    }
    return {
      ...toRefs(state),
      showPagination: !getPaginationConfig.value.disabled,
      getPaginationConfig,
      getRowSelection,
      xTable,
      handleCommand,
      handlePageChange,
      handleShowSizeChange
    }
  }
})
</script>
