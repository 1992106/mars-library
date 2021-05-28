<template>
  <vxe-grid
    ref="xGrid"
    border
    auto-resize
    show-overflow
    keep-source
    resizable
    stripe
    :columns="columns"
    :data="data"
    :loading="loading"
    :scroll-x="getScrollX"
    :scroll-y="getScrollY"
    :height="tableHeight"
    :row-class-name="rowClassName"
    :cell-class-name="cellClassName"
    :row-style="rowStyle"
    :cellStyle="cellStyle"
    :seq-config="seqConfig"
    :radio-config="getRadioConfig"
    :checkbox-config="getCheckboxConfig"
    :tooltip-config="getTooltipConfig"
    :merge-cells="mergeCells"
    :edit-config="getEditConfig"
    :edit-rules="editRules"
    @edit-closed="handleEditClosed"
    @checkbox-change="handleCheckboxChange"
    @checkbox-all="handleCheckboxAll"
    @cell-click="handleCellClick"
    @resizable-change="handleResizableChange"
  >
    <template v-for="slot of getSlots" :key="slot" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <!--分页-->
    <template #pager>
      <vxe-pager
        v-bind="getPagerConfig"
        :current-page="pagination.page"
        :page-size="pagination.limit"
        :total="total"
        @page-change="handlePageChange"
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
import { debounce } from 'lodash'

export default defineComponent({
  name: 'MarsGrid',
  displayName: 'MarsGrid',
  props: {
    // 自定义列
    columns: { type: Array, default: () => [] },
    // 表格数据
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    total: { type: Number, default: 0 },
    // 页码
    pagination: { type: Object, default: () => ({ page: 1, limit: 20 }) },
    pagerConfig: Object,
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
    // 横向虚拟滚动配置
    scrollX: Object,
    // 纵向虚拟滚动配置
    scrollY: Object,
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
    offsetHeight: { type: Number, default: 268 },
    // 本地Storage名称（拖拽列时需要本地储存）
    storageName: String
  },
  emits: [
    'search',
    'update:pagination',
    'page-change',
    'update:selected-value',
    'checkbox-change',
    'checkbox-all',
    'cell-click',
    'edit-closed'
  ],
  setup(props, { emit }) {
    /**
     * 默认值
     */
    const defaultState = {
      defaultScrollX: { enabled: false },
      defaultScrollY: { enabled: false },
      defaultPagerConfig: { enabled: true, pageSizes: [20, 30, 60, 100] },
      defaultEditConfig: { trigger: 'click', mode: 'cell', showStatus: true, icon: 'el-icon-edit' },
      defaultRadioConfig: { highlight: true, checkMethod: () => true },
      defaultCheckboxConfig: { highlight: true, checkMethod: () => true },
      defaultTooltipConfig: { showAll: true },
      defaultPickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
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
    const xGrid = ref(null)
    /**
     * 计算属性
     */
    const getSlots = computed(() =>
      props.columns
        .filter((col) => col.slots)
        .flatMap((col) => ['default', 'edit', 'header', 'footer'].map((val) => col.slots[val]).filter(Boolean))
    )
    const getScrollX = computed(() => mergeProps(defaultState.defaultScrollX, props.scrollX))
    const getScrollY = computed(() => mergeProps(defaultState.defaultScrollY, props.scrollY))
    const getPagerConfig = computed(() => mergeProps(defaultState.defaultPagerConfig, props.pagerConfig))
    const getEditConfig = computed(() => mergeProps(defaultState.defaultEditConfig, props.editConfig))
    const getRadioConfig = computed(() => mergeProps(defaultState.defaultRadioConfig, props.radioConfig))
    const getCheckboxConfig = computed(() => mergeProps(defaultState.defaultCheckboxConfig, props.checkboxConfig))
    const getTooltipConfig = computed(() => mergeProps(defaultState.defaultTooltipConfig, props.tooltipConfig))
    const isQICon = computed(
      () => (editRender, children) =>
        (editRender && editRender.enabled) ||
        (children && children.length && children[0].editRender && children[0].editRender.enabled)
    )
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
    const handlePageChange = ({ type, currentPage, pageSize, $event }) => {
      const pagination = {
        page: type === 'size' ? 1 : currentPage,
        limit: pageSize
      }
      emit('update:pagination', pagination)
      emit('page-change', { type, currentPage, pageSize, $event })
      emit('search')
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
      getScrollX,
      getScrollY,
      getPagerConfig,
      getEditConfig,
      getRadioConfig,
      getCheckboxConfig,
      getTooltipConfig,
      isQICon,
      xGrid,
      handlePageChange,
      handleCheckboxChange,
      handleCheckboxAll,
      handleCellClick,
      handleEditClosed,
      handleResizableChange
    }
  }
})
</script>
