<template>
  <div class="mars-table">
    <div class="mars-table-header">
      <slot name="searchBar"></slot>
      <slot name="toolBar"></slot>
    </div>
    <a-table
      ref="tableRef"
      border
      v-bind="$attrs"
      :rowKey="rowKey"
      :columns="getColumns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
      :scroll="getScroll"
      :size="size"
      :locale="locale"
      :row-selection="rowSelection"
      :rowClassName="handleRowClassName"
      @change="handleChange"
      :customRow="customRow"
      :customHeaderRow="customHeaderRow"
      :customCell="customCell"
      :customHeaderCell="customHeaderCell"
    >
      <template v-for="slot of getSlots" :key="slot" #[slot]="scope">
        <slot :name="slot" v-bind="scope"></slot>
      </template>
    </a-table>
    <a-pagination
      v-if="showPagination && getColumns.length"
      v-bind="getPaginationConfig"
      :current="pagination.page"
      :pageSize="pagination.pageSize"
      :total="total"
      @change="handlePageChange"
      @showSizeChange="handleShowSizeChange"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  mergeProps,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref
} from 'vue'
import { debounce } from 'lodash'
export default defineComponent({
  name: 'MarsTable',
  inheritAttrs: false,
  props: {
    // 表格行 key 的取值
    rowKey: { type: [String, Function], default: 'id' },
    // 自定义列
    columns: { type: Array, required: true, default: () => [] },
    // 表格数据
    dataSource: { type: Array, default: () => [] },
    loading: { type: [Boolean, Object], default: false },
    total: { type: Number, default: 0 },
    // 页码
    showPagination: { type: Boolean, default: true },
    pagination: { type: Object, default: () => ({ page: 1, pageSize: 20 }) },
    paginationConfig: Object,
    // 自动计算高度
    resize: { type: Boolean, default: false },
    // 横向/纵向滚动
    scroll: { type: Object, default: () => ({ scrollToFirstRowOnChange: true }) },
    // 选择功能的配置
    rowSelection: Object,
    // 行的类名
    rowClassName: Function,
    // 指定树形结构的列名
    childrenColumnName: { type: Array, default: () => ['children'] },
    // 展示树形数据时，每层缩进的宽度，以 px 为单位
    indentSize: { type: Number, default: 15 },
    // 表格大小 default | middle | small
    size: {
      validator(value) {
        return ['default', 'middle', 'small'].includes(value)
      },
      default: 'default'
    },
    // 默认文案设置，目前包括排序、过滤、空数据文案
    locale: { type: Object, default: () => ({ filterConfirm: '筛选', filterReset: '重置', emptyText: '暂无数据' }) },
    customRow: Function,
    customHeaderRow: Function,
    customCell: Function,
    customHeaderCell: Function
  },
  emits: ['search', 'update:pagination', 'change'],
  setup(props, { emit }) {
    /**
     * 默认值
     */
    const defaultState = {
      defaultColumn: { ellipsis: true },
      defaultPaginationConfig: {
        defaultPageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        pageSizeOptions: ['20', '40', '60', '80', '100']
      }
    }
    /**
     * data
     */
    const state = reactive({
      scroll: {}
    })
    /**
     * refs
     */
    const tableRef = ref(null)
    /**
     * computed
     */
    const getColumns = computed(() => props.columns.map(column => mergeProps(defaultState.defaultColumn, column)))
    const getSlots = computed(() =>
      props.columns
        .filter(val => val.slots)
        .flatMap(col => ['customRender', 'filterDropdown', 'filterIcon'].map(val => col.slots[val]).filter(Boolean))
    )
    const getScroll = computed(() => mergeProps(state.scroll, props.scroll))
    const getPaginationConfig = computed(() => mergeProps(defaultState.defaultPaginationConfig, props.paginationConfig))
    /**
     * methods
     */
    // 监听视窗大小改变
    const onResize = () => {
      nextTick(() => {
        // TODO: 待优化
        const $xTable = unref(tableRef)
        const $xTableHeader = $xTable?.$el?.querySelector('.ant-table-header> table')
        const tableHeaderHeight = $xTableHeader?.offsetHeight || 0
        const pageHeight = $xTable?.$el?.parentNode?.offsetHeight || 0
        const HeaderHeight = $xTable?.$el?.previousElementSibling?.offsetHeight || 0
        const paginationHeight = $xTable?.$el?.nextElementSibling?.offsetHeight || 0
        const height = pageHeight - HeaderHeight - paginationHeight - tableHeaderHeight
        if (Number.isFinite(height) && height > 0) {
          state.scroll['y'] = height
        }
      })
    }
    onMounted(() => {
      if (props.resize && unref(tableRef)) {
        setTimeout(onResize, 200)
        window.addEventListener('resize', debounce(onResize, 200))
      }
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize)
    })
    // 行的类名（默认设置斑马纹）
    const handleRowClassName = (record, index) => {
      const result = props.rowClassName ? props.rowClassName(record, index) : null
      return [index % 2 === 1 ? 'table-striped' : null, result].filter(Boolean)
    }
    // 排序、筛选变化时触发
    const handleChange = (_, filters, sorter, { currentDataSource }) => {
      // TODO:
      emit('change', filters, sorter, { currentDataSource })
    }
    // 页码
    const handlePageChange = (current, pageSize) => {
      const pagination = {
        page: current,
        pageSize
      }
      emit('update:pagination', pagination)
      emit('search')
    }
    const handleShowSizeChange = (_, pageSize) => {
      const pagination = {
        page: 1,
        pageSize
      }
      emit('update:pagination', pagination)
      emit('search')
    }
    return {
      ...toRefs(state),
      getScroll,
      getColumns,
      getSlots,
      getPaginationConfig,
      tableRef,
      handleRowClassName,
      handleChange,
      handlePageChange,
      handleShowSizeChange
    }
  }
})
</script>
<style lang="scss" scoped>
.mars-table {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100%;
  .ant-pagination {
    padding: 10px;
    text-align: right;
  }
  :deep(.table-striped) {
    background-color: #fafafa;
  }
}
</style>
