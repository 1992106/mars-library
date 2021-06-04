<template>
  <vxe-grid
    class="mars-grid"
    ref="xGrid"
    border
    auto-resize
    show-overflow
    keep-source
    resizable
    v-bind="$attrs"
    :stripe="getStripe"
    :columns="columns"
    :data="data"
    :loading="loading"
    :scroll-x="getScrollX"
    :scroll-y="getScrollY"
    :column-key="columnKey"
    :row-key="rowKey"
    :height="tableHeight"
    :row-class-name="rowClassName"
    :cell-class-name="cellClassName"
    :row-style="rowStyle"
    :cell-style="cellStyle"
    :seq-config="seqConfig"
    :radio-config="getRadioConfig"
    :checkbox-config="getCheckboxConfig"
    :tooltip-config="getTooltipConfig"
    :merge-cells="mergeCells"
    :edit-config="getEditConfig"
    :edit-rules="editRules"
    :filter-config="getFilterConfig"
    :tree-config="treeConfig"
    @edit-closed="handleEditClosed"
    @valid-error="handleValidError"
    @filter-change="handleFilterChange"
    @clear-filter="handleClearFilter"
    @toggle-tree-expand="handleToggleTreeExpand"
    @radio-change="handleRadioChange"
    @checkbox-change="handleCheckboxChange"
    @checkbox-all="handleCheckboxAll"
    @cell-click="handleCellClick"
    @resizable-change="handleResizableChange"
  >
    <!--slot-->
    <template v-for="slot of getSlots" :key="slot" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <!--分页-->
    <template #pager>
      <a-pagination
        v-if="showPagination"
        v-bind="getPaginationConfig"
        :current="pagination.page"
        :pageSize="pagination.limit"
        :total="total"
        @change="handlePageChange"
        @showSizeChange="handleShowSizeChange"
      />
    </template>
  </vxe-grid>
</template>
<script>
import {
  defineComponent,
  reactive,
  ref,
  computed,
  toRefs,
  nextTick,
  onMounted,
  onBeforeUnmount,
  unref,
  mergeProps
} from 'vue'
import { debounce, isEmpty } from 'lodash'

export default defineComponent({
  name: 'MarsGrid',
  inheritAttrs: false,
  props: {
    // 自定义列
    columns: { type: Array, default: () => [] },
    // 表格数据
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    total: { type: Number, default: 0 },
    // 页码
    showPagination: { type: Boolean, default: true },
    pagination: { type: Object, default: () => ({ page: 1, limit: 20 }) },
    paginationConfig: Object,
    // 序号配置项
    seqConfig: Object,
    // 勾选项
    selectedValue: { type: Array, default: () => [] },
    // 单选框配置项
    radioConfig: Object,
    // 复选框配置项
    checkboxConfig: Object,
    // 合并单元格
    mergeCells: { type: Array, default: () => [] },
    // 编辑配置
    editConfig: Object,
    editRules: { type: Object, default: () => ({}) },
    // 筛选配置
    filterConfig: Object,
    // 树形结构配置项（不支持虚拟滚动）
    treeConfig: Object,
    // 横向虚拟滚动配置
    scrollX: Object,
    // 纵向虚拟滚动配置
    scrollY: Object,
    // 是否需要为每一列的 VNode 设置 key 属性
    columnKey: { type: Boolean, default: false },
    // 是否需要为每一行的 VNode 设置 key 属性
    rowKey: { type: Boolean, default: false },
    // tooltip 配置项
    tooltipConfig: Object,
    // 给行附加 className
    rowClassName: [String, Function],
    // 给单元格附加 className
    cellClassName: [String, Function],
    // 给单元格附加样式
    cellStyle: [Object, Function],
    // 给行附加样式
    rowStyle: [Object, Function],
    // 表格除外的高度
    offsetHeight: { type: Number, default: 112 },
    // 本地Storage名称（拖拽列时需要本地储存）
    storageName: String
  },
  emits: [
    'search',
    'update:pagination',
    'page-change',
    'update:selected-value',
    'radio-change',
    'checkbox-change',
    'checkbox-all',
    'cell-click',
    'edit-closed',
    'valid-error',
    'filter-change',
    'clear-filter'
  ],
  setup(props, { emit }) {
    /**
     * 默认值
     */
    const defaultState = {
      defaultScrollX: { enabled: false },
      defaultScrollY: { enabled: false },
      defaultPaginationConfig: {
        defaultPageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: ['20', '30', '60', '100']
      },
      defaultEditConfig: { trigger: 'click', mode: 'cell', showIcon: true, showStatus: true },
      defaultFilterConfig: { remote: true, showIcon: true, filterMethod: () => true },
      defaultRadioConfig: { labelField: '_', highlight: true, checkMethod: () => true },
      defaultCheckboxConfig: { labelField: '_', highlight: true, checkMethod: () => true },
      defaultTooltipConfig: { showAll: true }
    }
    /**
     * data
     */
    const state = reactive({
      tableHeight: 300
    })
    /**
     * refs
     */
    const xGrid = ref(null)
    /**
     * 计算属性
     */
    const getSlots = computed(() => {
      return props.columns
        .filter((col) => col.slots)
        .flatMap((col) =>
          ['default', 'header', 'footer', 'edit', 'filter', 'title', 'checkbox', 'radio', 'content']
            .map((val) => typeof val === 'string' && col.slots[val])
            .filter(Boolean)
        )
    })
    const getStripe = computed(() => isEmpty(props.treeConfig))
    const getScrollX = computed(() => mergeProps(defaultState.defaultScrollX, props.scrollX))
    const getScrollY = computed(() => mergeProps(defaultState.defaultScrollY, props.scrollY))
    const getPaginationConfig = computed(() => mergeProps(defaultState.defaultPaginationConfig, props.paginationConfig))
    const getEditConfig = computed(() => mergeProps(defaultState.defaultEditConfig, props.editConfig))
    const getFilterConfig = computed(() => mergeProps(defaultState.defaultFilterConfig, props.filterConfig))
    const getRadioConfig = computed(() => mergeProps(defaultState.defaultRadioConfig, props.radioConfig))
    const getCheckboxConfig = computed(() => mergeProps(defaultState.defaultCheckboxConfig, props.checkboxConfig))
    const getTooltipConfig = computed(() => mergeProps(defaultState.defaultTooltipConfig, props.tooltipConfig))
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
    // 单选
    const handleRadioChange = ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) => {
      emit('update:selected-value', [row])
      emit('radio-change', { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event })
    }
    // 勾选
    const handleCheckboxChange = ({
      records,
      reserves,
      indeterminates,
      checked,
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      $event
    }) => {
      emit('update:selected-value', records)
      emit('checkbox-change', {
        records,
        reserves,
        indeterminates,
        checked,
        row,
        rowIndex,
        $rowIndex,
        column,
        columnIndex,
        $columnIndex,
        $event
      })
    }
    // 全选
    const handleCheckboxAll = ({ records, reserves, indeterminates, checked, $event }) => {
      const $xGrid = unref(xGrid)
      emit('update:selected-value', $xGrid.getCheckboxRecords())
      emit('checkbox-all', { records, reserves, indeterminates, checked, $event })
    }
    // 单元格点击事件
    const handleCellClick = ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) => {
      emit('cell-click', { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event })
    }
    // 编辑
    const handleEditClosed = ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) => {
      const field = column.property
      // 判断单元格值是否被修改
      const $xGrid = unref(xGrid)
      if ($xGrid.isUpdateByRow(row, field)) {
        emit('edit-closed', { row, field, rowIndex, $rowIndex, column, columnIndex, $columnIndex })
      }
    }
    // 编辑校验
    const handleValidError = ({ rule, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) => {
      emit('valid-error', { rule, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex })
    }
    // 筛选
    const handleFilterChange = ({ column, property, values, datas, filterList, $event }) => {
      const filters = {}
      filterList.forEach(({ column, property, values, datas }) => {
        // TODO:
        if (column.filterRender) {
          const isMultiple = column.filterRender.props.multiple || column.filterRender.props.mode === 'multiple'
          filters[property] = isMultiple ? datas[0] : datas[0].join()
        } else {
          filters[property] = column.filterMultiple ? values : values.join()
        }
      })
      emit('filter-change', { column, property, values, datas, filterList, $event })
      emit('search', filters)
    }
    // 清除所有筛选条件
    const handleClearFilter = ({ filterList, $event }) => {
      emit('clear-filter', { filterList, $event })
      emit('search', {})
    }
    // 当树节点展开或收起时会触发该事件
    const handleToggleTreeExpand = ({ expanded, row, column, columnIndex, $columnIndex, $event }) => {
      emit('toggle-tree-expand', { expanded, row, column, columnIndex, $columnIndex, $event })
    }
    // 拖拽列
    const handleResizableChange = ({ column }) => {
      if (props.storageName && xGrid) {
        const $xGrid = unref(xGrid)
        column.width = column.renderWidth
        column.resizeWidth = 0 // 拖拽后要清理  这个字段优先级高于renderWidth
        $xGrid.refreshColumn()
        localStorage.setItem(props.storageName, JSON.stringify($xGrid.getColumns()))
      }
    }
    return {
      ...toRefs(state),
      defaultPickerOptions: defaultState.defaultPickerOptions,
      getSlots,
      getStripe,
      getScrollX,
      getScrollY,
      getPaginationConfig,
      getEditConfig,
      getFilterConfig,
      getRadioConfig,
      getCheckboxConfig,
      getTooltipConfig,
      xGrid,
      handlePageChange,
      handleShowSizeChange,
      handleRadioChange,
      handleCheckboxChange,
      handleCheckboxAll,
      handleCellClick,
      handleEditClosed,
      handleValidError,
      handleFilterChange,
      handleClearFilter,
      handleToggleTreeExpand,
      handleResizableChange
    }
  }
})
</script>
<style lang="scss" scoped>
.mars-grid {
  ::v-deep(.vxe-cell) {
    display: flex;
    align-items: center;
    .vxe-cell--title {
      flex: 1;
    }
  }
  .ant-pagination {
    padding: 10px;
    text-align: right;
    background-color: #fff;
  }
}
</style>
