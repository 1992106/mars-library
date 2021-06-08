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
    :stripe="stripe"
    :columns="columns"
    :data="data"
    :loading="loading"
    :scroll-x="scrollX"
    :scroll-y="scrollY"
    :row-id="rowId"
    :height="height"
    :row-class-name="rowClassName"
    :cell-class-name="cellClassName"
    :row-style="rowStyle"
    :cell-style="cellStyle"
    :seq-config="seqConfig"
    :radio-config="radioConfig"
    :checkbox-config="checkboxConfig"
    :tooltip-config="tooltipConfig"
    :merge-cells="mergeCells"
    :edit-config="editConfig"
    :edit-rules="editRules"
    :filter-config="filterConfig"
    :tree-config="getTreeConfig"
    :toolbar-config="{ slots: { buttons: 'toolbar_buttons' } }"
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
    <template #toolbar_buttons>
      <slot name="searchBar"></slot>
    </template>
    <!--slot-->
    <template v-for="slot of getSlots" :key="slot" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <!--分页-->
    <template #pager>
      <slot name="pagination">
        <a-pagination
          v-if="showPagination"
          v-bind="getPaginationConfig"
          :current="pagination.page"
          :pageSize="pagination.limit"
          :total="total"
          @change="handlePageChange"
          @showSizeChange="handleShowSizeChange"
        />
      </slot>
    </template>
  </vxe-grid>
</template>
<script>
import { defineComponent, reactive, ref, computed, toRefs, unref, mergeProps } from 'vue'

export default defineComponent({
  name: 'MarsGrid',
  inheritAttrs: false,
  props: {
    // 自定义行数据唯一主键的字段名
    rowId: { type: String, default: 'id' },
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
    // 高度
    height: { type: [Number, String], default: 'auto' },
    // 斑马纹
    stripe: { type: Boolean, default: true },
    // 序号配置项
    seqConfig: Object,
    // 勾选项
    selectedValue: { type: Array, default: () => [] },
    // 单选框配置项
    radioConfig: { type: Object, default: () => ({ labelField: '_', highlight: true, checkMethod: () => true }) },
    // 复选框配置项
    checkboxConfig: { type: Object, default: () => ({ labelField: '_', highlight: true, checkMethod: () => true }) },
    // 合并单元格 (不能用于展开行，不建议用于固定列、树形结构)
    mergeCells: Array,
    // 编辑配置
    editConfig: { type: Object, default: () => ({ trigger: 'click', mode: 'cell', showStatus: true }) },
    editRules: { type: Object, default: () => ({}) },
    // 筛选配置
    filterConfig: { type: Object, default: () => ({ remote: true, filterMethod: () => true }) },
    // tooltip 配置项
    tooltipConfig: { type: Object, default: () => ({ showAll: false }) },
    // 树形结构配置项（不支持虚拟滚动）
    treeConfig: { type: Object, default: () => ({ children: 'children' }) },
    // 横向虚拟滚动配置
    scrollX: { type: Object, default: () => ({ enabled: false }) },
    // 纵向虚拟滚动配置
    scrollY: { type: Object, default: () => ({ enabled: false }) },
    // 给行附加 className
    rowClassName: [String, Function],
    // 给单元格附加 className
    cellClassName: [String, Function],
    // 给单元格附加样式
    cellStyle: [Object, Function],
    // 给行附加样式
    rowStyle: [Object, Function],
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
    'clear-filter',
    'toggle-tree-expand'
  ],
  setup(props, { emit }) {
    /**
     * 默认值
     */
    const defaultState = {
      defaultPaginationConfig: {
        defaultPageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: ['20', '30', '60', '100']
      }
    }
    /**
     * data
     */
    const state = reactive({})
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
    const getPaginationConfig = computed(() => mergeProps(defaultState.defaultPaginationConfig, props.paginationConfig))
    const getTreeConfig = computed(() => (props.stripe ? null : props.treeConfig))
    /**
     * methods
     */
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
    // const hasMultiple = (column) => {
    //   return (
    //     (column?.filterRender?.name === 'ASelect' && ['multiple'].includes(column.filterRender?.props?.mode)) ||
    //     (column?.filterRender?.name === '$select' && column.filterRender?.props?.multiple)
    //   )
    // }
    // 筛选
    const handleFilterChange = ({ column, property, values, datas, filterList, $event }) => {
      const filters = {}
      filterList.forEach(({ column, property, values, datas }) => {
        // TODO:
        if (column?.filterRender) {
          filters[property] = datas[0]
        } else {
          filters[property] = column?.filterMultiple ? values : values.join()
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
      getPaginationConfig,
      getTreeConfig,
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
  ::v-deep(.vxe-toolbar) {
    height: auto;
  }
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
