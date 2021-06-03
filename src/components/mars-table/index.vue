<template>
  <div class="mars-table" :style="{ height: `${tableHeight}px` }">
    <a-table
      ref="xTable"
      border
      :rowKey="rowKey"
      :columns="getColumns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
      :scroll="scroll"
      :size="size"
      :locale="locale"
      :row-selection="getRowSelection"
      :rowClassName="handleRowClassName"
    >
      <template v-for="slot of getSlots" :key="slot" #[slot]="scope">
        <slot :name="slot" v-bind="scope"></slot>
      </template>
    </a-table>
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
  </div>
</template>
<script>
import { defineComponent, computed, mergeProps, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue'
import { debounce } from 'lodash'
export default defineComponent({
  name: 'MarsTable',
  props: {
    // 表格行 key 的取值
    rowKey: { type: [String, Function], default: 'key' },
    // 自定义列
    columns: { type: Array, default: () => [] },
    // 表格数据
    dataSource: { type: Array, default: () => [] },
    loading: { type: [Boolean, Object], default: false },
    total: { type: Number, default: 0 },
    // 页码
    pagination: { type: Object, default: () => ({ page: 1, limit: 20 }) },
    paginationConfig: Object,
    // 横向/纵向滚动
    scroll: { type: Object, default: () => ({ x: null, y: null, scrollToFirstRowOnChange: false }) },
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
    locale: Object,
    // 表格除外的高度
    offsetHeight: { type: Number, default: 240 }
  },
  emits: ['search', 'update:pagination', 'update:selected-value'],
  setup(props, { emit }) {
    /**
     * 默认值
     */
    const defaultState = {
      defaultColumn: { ellipsis: true },
      defaultPaginationConfig: { disabled: false, pageSizeOptions: ['20', '30', '60', '100'] },
      defaultRowSelection: {
        type: 'checkbox',
        selectedRowKeys: [],
        hideDefaultSelections: false,
        selections: true
      }
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
     * computed
     */
    const getColumns = computed(() => props.columns.map((column) => mergeProps(defaultState.defaultColumn, column)))
    const getSlots = computed(() => props.columns.filter((val) => val.slots).map((val) => val.slots.customRender))
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
    // 行的类名（默认设置斑马纹）
    const handleRowClassName = (record, index) => {
      const result = props.rowClassName ? props.rowClassName(record, index) : null
      return [index % 2 === 1 ? 'table-striped' : null, result].filter(Boolean)
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
      getColumns,
      getSlots,
      showPagination: !getPaginationConfig.value.disabled,
      getPaginationConfig,
      getRowSelection,
      xTable,
      handleRowClassName,
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
  .ant-pagination {
    padding: 10px;
    text-align: right;
  }
  ::v-deep(.table-striped) {
    background-color: #fafafa;
  }
}
</style>
