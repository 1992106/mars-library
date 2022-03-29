<template>
  <vxe-grid
    class="mars-grid"
    ref="gridRef"
    border
    auto-resize
    show-overflow
    keep-source
    resizable
    v-bind="$attrs"
    :stripe="stripe"
    :columns="customColumns"
    :data="data"
    :loading="loading"
    :scroll-x="getScrollX"
    :scroll-y="getScrollY"
    :row-id="rowId"
    :height="height"
    :row-class-name="rowClassName"
    :cell-class-name="cellClassName"
    :row-style="rowStyle"
    :cell-style="cellStyle"
    :seq-config="seqConfig"
    :radio-config="getRadioConfig"
    :checkbox-config="getCheckboxConfig"
    :tooltip-config="tooltipConfig"
    :merge-cells="mergeCells"
    :edit-config="getEditConfig"
    :edit-rules="editRules"
    :filter-config="getFilterConfig"
    :tree-config="getTreeConfig"
    :toolbar-config="{
      zoom: customZoom,
      custom: false,
      refresh: false,
      slots: { buttons: 'toolbar_buttons', tools: 'toolbar_tools' }
    }"
    @edit-closed="handleEditClosed"
    @valid-error="handleValidError"
    @filter-change="handleFilterChange"
    @clear-filter="handleClearFilter"
    @toggle-tree-expand="handleToggleTreeExpand"
    @radio-change="handleRadioChange"
    @checkbox-change="handleCheckboxChange"
    @checkbox-all="handleCheckboxAll"
    @cell-click="handleCellClick"
    @resizable-change="handleResizableChange">
    <template #form>
      <slot name="searchBar"></slot>
    </template>
    <template #toolbar_buttons>
      <div v-if="hasToolBar" class="mars-toolbar">
        <slot name="toolBar"></slot>
      </div>
    </template>
    <template #toolbar_tools>
      <template v-if="customSetting">
        <ColumnSetting
          :columns="customColumns"
          :backupColumns="backupColumns"
          @change="handleSettingChange"></ColumnSetting>
      </template>
    </template>
    <!--slot-->
    <template v-for="slot of getSlots" :key="slot" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <!--分页-->
    <template #pager>
      <slot name="pagination">
        <a-pagination
          v-if="showPagination && columns.length"
          v-bind="getPaginationConfig"
          :current="pagination.page"
          :pageSize="pagination.pageSize"
          :total="total"
          @change="handlePageChange"
          @showSizeChange="handleShowSizeChange" />
      </slot>
    </template>
  </vxe-grid>
</template>
<script>
import { defineComponent, reactive, ref, computed, toRefs, unref, mergeProps, watchEffect } from 'vue'
import { isEmpty, momentToDate } from '@/utils'
import ColumnSetting from './ColumnSetting.vue'
import { columnsToStorage, getField, mergeStorageAndColumns, storageToColumns } from './utils'
import { cloneDeep } from 'lodash-es'

export default defineComponent({
  name: 'MarsGrid',
  inheritAttrs: false,
  props: {
    // 自定义行数据唯一主键的字段名
    rowId: { type: String, default: 'id' },
    // 自定义列
    columns: { type: Array, required: true, default: () => [] },
    // 表格数据
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    total: { type: Number, default: 0 },
    // 页码
    showPagination: { type: Boolean, default: true },
    pagination: { type: Object, default: () => ({ page: 1, pageSize: 20 }) },
    paginationConfig: Object,
    // 高度
    height: [Number, String],
    // 斑马纹
    stripe: { type: Boolean, default: true },
    // 序号配置
    seqConfig: Object,
    // 勾选项
    selectedValue: { type: Array, default: () => [] },
    // 单选框配置
    radioConfig: Object,
    // 复选框配置
    checkboxConfig: Object,
    // 合并单元格 (不能用于展开行，不建议用于固定列、树形结构)
    mergeCells: Array,
    // 编辑配置
    editConfig: Object,
    editRules: Object,
    // 筛选配置
    filterConfig: Object,
    // tooltip 配置项
    tooltipConfig: Object,
    // 树形结构配置项（不支持虚拟滚动）
    treeConfig: { type: Object, default: () => ({ children: 'children' }) },
    // 横向虚拟滚动配置
    scrollX: Object,
    // 纵向虚拟滚动配置
    scrollY: Object,
    // 给行附加 className
    rowClassName: [String, Function],
    // 给单元格附加 className
    cellClassName: [String, Function],
    // 给单元格附加样式
    cellStyle: [Object, Function],
    // 给行附加样式
    rowStyle: [Object, Function],
    // 自定义缩放
    customZoom: { type: Boolean, default: true },
    // 自定义设置
    customSetting: { type: Boolean, default: false },
    // 本地Storage名称（拖拽列和自定义表头时需要本地储存）,
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
  components: {
    ColumnSetting
  },
  setup(props, { emit, slots }) {
    /**
     * 默认值
     */
    const defaultState = {
      defaultPaginationConfig: {
        defaultPageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        pageSizeOptions: ['20', '40', '60', '80', '100']
      },
      defaultRadioConfig: { labelField: '_', highlight: true, checkMethod: () => true },
      defaultCheckboxConfig: { labelField: '_', highlight: true, checkMethod: () => true },
      defaultEditConfig: { trigger: 'click', mode: 'cell', showStatus: true },
      defaultFilterConfig: { remote: true, filterMethod: () => true },
      defaultScrollX: { enabled: false },
      defaultScrollY: { enabled: true, gt: 20 }
    }
    /**
     * data
     */
    const getColumnsFromStorage = () => {
      if (props.storageName) {
        const storageColumns = localStorage.getItem(props.storageName)
        const columns = storageColumns ? JSON.parse(storageColumns || '[]') : []
        if (!isEmpty(columns)) {
          const sourceColumns = props.columns
          const list = mergeStorageAndColumns(columns, sourceColumns) // 对比localStorage和Props（删除移除的，添加新增的）
          return storageToColumns(list, sourceColumns)
        }
      }
    }
    const state = reactive({
      customColumns: getColumnsFromStorage() || props.columns,
      backupColumns: cloneDeep(props.columns)
    })
    /**
     * refs
     */
    const gridRef = ref(null)
    /**
     * 计算属性
     */
    const generateSlots = (columns, slots = []) => {
      columns.forEach(column => {
        slots.push(column)
        column?.children && generateSlots(column?.children, slots)
      })
      return slots
    }
    const getSlots = computed(() => {
      const columns = generateSlots(props.columns)
      return (columns || [])
        .filter(col => col.slots)
        .flatMap(col =>
          ['default', 'header', 'footer', 'edit', 'filter', 'title', 'checkbox', 'radio', 'content']
            .map(val => col.slots[val])
            .filter(Boolean)
        )
    })
    const getPaginationConfig = computed(() => mergeProps(defaultState.defaultPaginationConfig, props.paginationConfig))
    const getRadioConfig = computed(() => mergeProps(defaultState.defaultRadioConfig, props.radioConfig))
    const getCheckboxConfig = computed(() => mergeProps(defaultState.defaultCheckboxConfig, props.checkboxConfig))
    const getEditConfig = computed(() => mergeProps(defaultState.defaultEditConfig, props.editConfig))
    const getFilterConfig = computed(() => mergeProps(defaultState.defaultFilterConfig, props.filterConfig))
    const getScrollX = computed(() => mergeProps(defaultState.defaultScrollX, props.scrollX))
    const getScrollY = computed(() => mergeProps(defaultState.defaultScrollY, props.scrollY))
    const getTreeConfig = computed(() => (props.stripe ? null : props.treeConfig))
    /**
     * methods
     */
    // 页码
    const handlePageChange = (current, pageSize) => {
      const pagination = {
        page: current,
        pageSize
      }
      emit('update:pagination', pagination)
      emit('search')
      // gridRef.value.loadData()
    }
    const handleShowSizeChange = (_, pageSize) => {
      const pagination = {
        page: 1,
        pageSize
      }
      emit('update:pagination', pagination)
      emit('search')
      // gridRef.value.loadData()
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
      const $xGrid = unref(gridRef)
      emit('update:selected-value', $xGrid.getCheckboxRecords())
      emit('checkbox-all', { records, reserves, indeterminates, checked, $event })
      // gridRef.value.reloadData()
    }
    // 监听selectedValue，如果为空，清空勾选
    watchEffect(() => {
      if (isEmpty(props.selectedValue)) {
        const $xGrid = unref(gridRef)
        $xGrid?.clearCheckboxRow() // 清空勾选
        $xGrid?.clearRadioRow() // 清空单选框
      }
    })
    // 单元格点击事件
    const handleCellClick = ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) => {
      emit('cell-click', { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event })
    }
    // 编辑
    const handleEditClosed = ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) => {
      const field = column.property
      // 判断单元格值是否被修改
      const $xGrid = unref(gridRef)
      if ($xGrid.isUpdateByRow(row, field)) {
        emit('edit-closed', { row, field, rowIndex, $rowIndex, column, columnIndex, $columnIndex })
        // $xGrid.reloadRow(row, null, field)
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
        // TODO: filterAlias后面废弃
        const alias = column?.filterRender?.alias || column?.params?.filterAlias || property
        if (column?.filterRender) {
          filters[alias] = momentToDate(datas[0])
        } else {
          filters[alias] = column?.filterMultiple ? values : values.join()
        }
      })
      emit('filter-change', { column, property, values, datas, filterList, $event })
      emit('search', filters)
      // gridRef.value.loadData()
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
    const handleResizableChange = async ({ column }) => {
      // 更新column宽度
      const customColumns = state.customColumns.find(v => getField(column) === getField(v))
      if (customColumns) {
        customColumns.width = column.renderWidth
      }
      setColumnsToStorage()
    }
    // 配置列
    const handleSettingChange = columns => {
      const $xGrid = unref(gridRef)
      state.customColumns = columns
      $xGrid.reloadColumn(columns)
      setColumnsToStorage()
    }

    const setColumnsToStorage = () => {
      if (props.storageName) {
        const storageColumns = columnsToStorage(state.customColumns)
        if (storageColumns) {
          localStorage.setItem(props.storageName, JSON.stringify(storageColumns))
        }
      }
    }

    const hasToolBar = computed(() => !!slots['toolBar'])

    return {
      ...toRefs(state),
      getSlots,
      getPaginationConfig,
      getRadioConfig,
      getCheckboxConfig,
      getEditConfig,
      getFilterConfig,
      getScrollX,
      getScrollY,
      getTreeConfig,
      gridRef,
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
      handleResizableChange,
      handleSettingChange,
      hasToolBar
    }
  }
})
</script>
<style lang="scss" scoped>
.mars-grid {
  :deep(.vxe-toolbar) {
    height: auto;

    .mars-toolbar {
      margin: 10px 0;
    }

    .vxe-tools--wrapper {
      .vxe-button {
        margin: 10px 0 10px 20px;
      }
    }

    .vxe-tools--operate {
      .vxe-button {
        margin: 10px 0 10px 10px;
      }
    }
  }

  :deep(.vxe-table--header) {
    .vxe-cell {
      display: flex;
      align-items: center;

      .vxe-cell--title {
        flex: 1;
      }
    }
  }

  .ant-pagination {
    padding: 10px;
    text-align: right;
    background-color: #fff;
  }
}
</style>
