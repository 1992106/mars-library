# mars-library
vue3 + vxe-table + antd-design-vue

## Install and use

- yarn
```yarn
yarn add mars-library
```

- use
```vue
import MarsLibrary form 'mars-library'

app.use(MarsLibrary)
```
_______________

## components

### mars-gird组件

> [vxe-table](https://xuliangzhan_admin.gitee.io/vxe-table/v4/grid/api)
> 
> [vxe-table-plugin-antd](https://github.com/x-extends/vxe-table-plugin-antd)

#### props

属性|默认值|描述
:---:|:---:|:---:
rowId | 'id' | 自定义行数据唯一主键的字段名
columns | [] | 表格自定义列
data | [] | 表格数据
loading | false | 表格loading
total | 0 | 总数
showPagination | true | 是否显示分页
pagination | { page: 1, pageSize: 20 } | 当前页数、每页条数
paginationConfig | { defaultPageSize: 20, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条`, pageSizeOptions: ['20', '40', '60', '80', '100'] } | [Pagination](https://2x.antdv.com/components/pagination-cn#API)
height | 'auto' | 表格高度
stripe | true | 表格斑马纹
seqConfig | - | 序号配置
selectedValue | [] | 勾选数据
radioConfig | { highlight: true, checkMethod: () => true } | 单选框配置
checkboxConfig | { highlight: true, checkMethod: () => true }) | 复选框配置
mergeCells | - | 合并单元格
editConfig | { trigger: 'click', mode: 'cell', showStatus: true } | 编辑配置
editRules | - | 编辑规则
filterConfig | { remote: true, filterMethod: () => true } | 筛选配置
tooltipConfig | - | tooltip配置
treeConfig | { children: 'children' } | 树形结构配置
scrollX | { enabled: false } | 横向虚拟滚动配置
scrollY | { enabled: false } | 纵向虚拟滚动配置
rowClassName | - | 给行附加className
cellClassName | - | 给单元格附加className
cellStyle | - | 给单元格附加样式
rowStyle | - | 给行附加样式
storageName | - | 本地Storage名称

#### filterRender配置
属性|可选值|描述
:---:|:---:|:---:
name | 'AInput', 'AAutocomplete', 'AInputNumber', 'ASelect', 'ASwitch', 'ARate' | 支持的渲染组件
props | - | 渲染组件附加属性
options | - | 只对 name=ASelect 有效，下拉组件选项列表
optionProps | - |  只对 name=ASelect 有效，下拉组件选项属性参数配置

#### editRender配置

属性|可选值|描述
:---:|:---:|:---:
name | 'AInput', 'AAutocomplete', 'AInputNumber', 'ASelect', 'ACascader', 'ADatePicker', 'AMonthPicker', 'ARangePicker', 'AWeekPicker', 'ATimePicker', 'ATreeSelect', 'ASwitch', 'ARate', 'AButton', 'AButtons' | 支持的渲染组件
props | - | 渲染组件附加属性
options | - | 只对 name=ASelect 有效，下拉组件选项列表
optionProps | - |  只对 name=ASelect 有效，下拉组件选项属性参数配置

#### emits
```markdown
emits [
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
]
```

#### slots

```markdown
<slot name="searchBar"></slot>
<slot name="toolBar"></slot>
```

### mars-table组件

> [antd-design-vue](https://2x.antdv.com/components/table-cn#API)

#### props

属性|默认值|描述
:---:|:---:|:---:
rowKey | 'id' | 表格行 key 的取值
columns | [] | 表格自定义列
data | [] | 表格数据
loading | false | 表格loading
total | 0 | 总数
showPagination | true | 是否显示分页
pagination | { page: 1, pageSize: 20 } | 当前页数、每页条数
paginationConfig | { defaultPageSize: 20, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条`, pageSizeOptions: ['20', '40', '60', '80', '100']  | [Pagination](https://2x.antdv.com/components/pagination-cn#API)
scroll | { scrollToFirstRowOnChange: true } | 横向/纵向滚动
rowSelection | - | 选择功能的配置
rowClassName | - | 行的类名（默认内置table-striped）
childrenColumnName | ['children'] | 指定树形结构的列名
indentSize | 15 | 展示树形数据时，每层缩进的宽度，以 px 为单位
size | 'default' | 表格大小
locale | { filterConfirm: '筛选', filterReset: '重置', emptyText: '暂无数据' } | 默认文案设置，目前包括排序、过滤、空数据文案

#### emits

```markdown
emits: ['search', 'update:pagination', 'change']
```

#### slots

```markdown
<slot name="searchBar"></slot>
<slot name="toolBar"></slot>
```

### mars-form组件

[Form](https://2x.antdv.com/components/form-cn#API)

#### props

属性|默认值|描述
:---:|:---:|:---:
columns | [] | 表单自定义字段
layout | 'inline' |  表单布局
labelCol | {} | 标签布局
wrapperCol | {} | 控件布局
scrollToFirstError | true | 提交失败自动滚动到第一个错误字段
reverse | false | ok和cancel按钮位置是否互换
showOk | true | 是否显示ok按钮
okText | '确认' | ok按钮文本
showCancel | true | 是否显示cancel按钮
cancelText | '取消' | cancel按钮文本

#### columns

属性|可选值|描述
:---:|:---:|:---:
type | 'AInput' 'AInputNumber' 'AAutoComplete' 'ASelect' 'ACheckboxGroup' 'ARadioGroup' 'ASwitch' 'ASlider' 'ADatePicker' 'ATreeSelect' 'ACascader' 'ADatePicker' 'AWeekPicker' 'AMonthPicker' 'ARangePicker' 'ATimePicker' | 支持的渲染组件
title | - | 字段文本
field | - | 字段名称
rules | - | 字段校验规则
props |  | 渲染组件附加属性
event | - | 渲染组件附加事件

#### emits

```markdown
emits: ['ok', 'cancel']
```

### mars-search组件

#### props

> 同mars-form组件一样

#### emits

```markdown
emits: ['search']
```
#### slots
```markdown
<slot name="extra"></slot> slot中的内容默认向右对齐
```

### mars-export组件

#### props

> 同mars-form组件一样，额外扩展了一些

属性|默认值|描述
:---:|:---:|:---:
title | '导出数据' | 标题
width | 720 | 宽度
zIndex | 10000 | zIndex

#### emits

```markdown
emits: ['export']
```
