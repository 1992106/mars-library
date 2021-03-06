# mars-library

vue3 + vxe-table + antd-design-vue

## Install and use

- yarn

```yarn
yarn add mars-library
```

- use

```vue
import MarsLibrary form 'mars-library' app.use(MarsLibrary)
```

---

## components

### mars-gird 组件

> [vxe-table](https://xuliangzhan_admin.gitee.io/vxe-table/v4/grid/api)
>
> [vxe-table-plugin-antd](https://github.com/x-extends/vxe-table-plugin-antd)

#### props

|       属性       |                                                                             默认值                                                                              |                              描述                               |
| :--------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------: |
|      rowId       |                                                                              'id'                                                                               |                  自定义行数据唯一主键的字段名                   |
|     columns      |                                                                               []                                                                                |                          表格自定义列                           |
|       data       |                                                                               []                                                                                |                            表格数据                             |
|     loading      |                                                                              false                                                                              |                          表格 loading                           |
|      total       |                                                                                0                                                                                |                              总数                               |
|  showPagination  |                                                                              true                                                                               |                          是否显示分页                           |
|    pagination    |                                                                    { page: 1, pageSize: 20 }                                                                    |                       当前页数、每页条数                        |
| paginationConfig | { defaultPageSize: 20, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条`, pageSizeOptions: ['20', '40', '60', '80', '100'] } | [Pagination](https://2x.antdv.com/components/pagination-cn#API) |
|      height      |                                                                                -                                                                                |                            表格高度                             |
|      stripe      |                                                                              true                                                                               |                           表格斑马纹                            |
|    seqConfig     |                                                                                -                                                                                |                            序号配置                             |
|  selectedValue   |                                                                               []                                                                                |                            勾选数据                             |
|   radioConfig    |                                                          { highlight: true, checkMethod: () => true }                                                           |                           单选框配置                            |
|  checkboxConfig  |                                                          { highlight: true, checkMethod: () => true })                                                          |                           复选框配置                            |
|    mergeCells    |                                                                                -                                                                                |                           合并单元格                            |
|    editConfig    |                                                      { trigger: 'click', mode: 'cell', showStatus: true }                                                       |                            编辑配置                             |
|    editRules     |                                                                                -                                                                                |                            编辑规则                             |
|   filterConfig   |                                                           { remote: true, filterMethod: () => true }                                                            |                            筛选配置                             |
|  tooltipConfig   |                                                                                -                                                                                |                          tooltip 配置                           |
|    treeConfig    |                                                                    { children: 'children' }                                                                     |                          树形结构配置                           |
|     scrollX      |                                                                       { enabled: false }                                                                        |                        横向虚拟滚动配置                         |
|     scrollY      |                                                                       { enabled: false }                                                                        |                        纵向虚拟滚动配置                         |
|   rowClassName   |                                                                                -                                                                                |                       给行附加 className                        |
|  cellClassName   |                                                                                -                                                                                |                     给单元格附加 className                      |
|    cellStyle     |                                                                                -                                                                                |                        给单元格附加样式                         |
|     rowStyle     |                                                                                -                                                                                |                          给行附加样式                           |
|   storageName    |                                                                                -                                                                                |                        本地 Storage 名称                        |

#### filterRender 配置

|    属性     |                                                                             可选值                                                                             |                       描述                       |
| :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------: |
|    name     | 'AInput', 'AAutocomplete', 'AInputNumber', 'ASelect', 'ASwitch', 'ARate', 'MyDatePicker', 'MyRangePicker', 'MyCascader', 'MyInput', 'MySelect', 'MyTreeSelect' |                  支持的渲染组件                  |
|    props    |                                                                               -                                                                                |                 渲染组件附加属性                 |
|   options   |                                                                               -                                                                                |     只对 name=ASelect 有效，下拉组件选项列表     |
| optionProps |                                                                               -                                                                                | 只对 name=ASelect 有效，下拉组件选项属性参数配置 |

#### editRender 配置

|    属性     |                                                                                                  可选值                                                                                                  |                       描述                       |
| :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------: |
|    name     | 'AInput', 'AAutocomplete', 'AInputNumber', 'ASelect', 'ACascader', 'ADatePicker', 'AMonthPicker', 'ARangePicker', 'AWeekPicker', 'ATimePicker', 'ATreeSelect', 'ASwitch', 'ARate', 'AButton', 'AButtons' |                  支持的渲染组件                  |
|    props    |                                                                                                    -                                                                                                     |                 渲染组件附加属性                 |
|   options   |                                                                                                    -                                                                                                     |     只对 name=ASelect 有效，下拉组件选项列表     |
| optionProps |                                                                                                    -                                                                                                     | 只对 name=ASelect 有效，下拉组件选项属性参数配置 |

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

### mars-table 组件

> [antd-design-vue](https://2x.antdv.com/components/table-cn#API)

#### props

|        属性        |                                                                            默认值                                                                             |                              描述                               |
| :----------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------: |
|       rowKey       |                                                                             'id'                                                                              |                        表格行 key 的取值                        |
|      columns       |                                                                              []                                                                               |                          表格自定义列                           |
|        data        |                                                                              []                                                                               |                            表格数据                             |
|      loading       |                                                                             false                                                                             |                          表格 loading                           |
|       total        |                                                                               0                                                                               |                              总数                               |
|   showPagination   |                                                                             true                                                                              |                          是否显示分页                           |
|     pagination     |                                                                   { page: 1, pageSize: 20 }                                                                   |                       当前页数、每页条数                        |
|  paginationConfig  | { defaultPageSize: 20, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条`, pageSizeOptions: ['20', '40', '60', '80', '100'] | [Pagination](https://2x.antdv.com/components/pagination-cn#API) |
|       resize       |                                                                             false                                                                             |                          自动设置高度                           |
|       scroll       |                                                              { scrollToFirstRowOnChange: true }                                                               |                          横向/纵向滚动                          |
|    rowSelection    |                                                                               -                                                                               |                         选择功能的配置                          |
|    rowClassName    |                                                                               -                                                                               |               行的类名（默认内置 table-striped）                |
| childrenColumnName |                                                                         ['children']                                                                          |                       指定树形结构的列名                        |
|     indentSize     |                                                                              15                                                                               |          展示树形数据时，每层缩进的宽度，以 px 为单位           |
|        size        |                                                                           'default'                                                                           |                            表格大小                             |
|       locale       |                                             { filterConfirm: '筛选', filterReset: '重置', emptyText: '暂无数据' }                                             |          默认文案设置，目前包括排序、过滤、空数据文案           |

#### emits

```markdown
emits: ['search', 'update:pagination', 'change']
```

#### slots

```markdown
<slot name="searchBar"></slot>
<slot name="toolBar"></slot>
```

### mars-form 组件

[Form](https://2x.antdv.com/components/form-cn#API)

#### props

|        属性        |  默认值  |               描述               |
| :----------------: | :------: | :------------------------------: |
|      columns       |    []    |          表单自定义字段          |
|       layout       | 'inline' |             表单布局             |
|      labelCol      |    {}    |             标签布局             |
|     wrapperCol     |    {}    |             控件布局             |
| scrollToFirstError |   true   | 提交失败自动滚动到第一个错误字段 |
|      reverse       |  false   |  ok 和 cancel 按钮位置是否互换   |
|       showOk       |   true   |         是否显示 ok 按钮         |
|       okText       |  '确认'  |           ok 按钮文本            |
|     showCancel     |   true   |       是否显示 cancel 按钮       |
|     cancelText     |  '取消'  |         cancel 按钮文本          |

#### columns

| 属性  |                                                                                                        可选值                                                                                                        |       描述       |
| :---: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------: |
| type  | 'AInput' 'AInputNumber' 'AAutoComplete' 'ASelect' 'ACheckboxGroup' 'ARadioGroup' 'ASwitch' 'ASlider' 'ADatePicker' 'ATreeSelect' 'ACascader' 'ADatePicker' 'AWeekPicker' 'AMonthPicker' 'ARangePicker' 'ATimePicker' |  支持的渲染组件  |
| title |                                                                                                          -                                                                                                           |     字段文本     |
| field |                                                                                                          -                                                                                                           |     字段名称     |
| rules |                                                                                                          -                                                                                                           |   字段校验规则   |
| props |                                                                                                                                                                                                                      | 渲染组件附加属性 |
| event |                                                                                                          -                                                                                                           | 渲染组件附加事件 |

#### emits

```markdown
emits: ['ok', 'cancel', 'clear']
```

### mars-search 组件

#### props

> 同 mars-form 组件一样，额外拓展了以下 props

|    属性     |  默认值   |       描述       |
| :---------: | :-------: | :--------------: |
| clearSearch |   false   |     清空搜索     |
| resetSearch |   true    |     重置搜索     |
|  showOnly   |   true    | 是否显示只看我的 |
|  onlyField  | 'is_mine' |    自定义名称    |
|    only     |   false   |     只看我的     |

#### emits

```markdown
emits: ['search', 'reset', 'clear']
```

#### slots

```markdown
<slot name="extra"></slot> slot 中的内容默认向右对齐
```

### mars-modal 组件

#### props

> 同 mars-form 组件一样，额外拓展了以下 props

|  属性   | 默认值 |   描述   |
| :-----: | :----: | :------: |
| visible | false  | 是否显示 |
|  title  |   -    |   标题   |
|  width  |  840   |   宽度   |
| zIndex  | 10000  |  zIndex  |

#### emits

```markdown
emits: ['update:visible', 'ok', 'cancel']
```

### mars-export 组件

#### props

|    属性    |   默认值   |      描述      |
| :--------: | :--------: | :------------: |
|  columns   |     []     | 导出自定义字段 |
|  labelCol  |     6      |    标签布局    |
| wrapperCol |     12     |    控件布局    |
|   title    | '导出数据' |      标题      |
|   width    |    460     |      宽度      |
|   zIndex   |   10000    |     zIndex     |

#### columns

|     属性     | 可选值 |     描述     |
| :----------: | :----: | :----------: |
|    title     |   -    |   字段文本   |
|    field     |   -    |   字段名称   |
| defaultValue |  true  |    默认值    |
|    rules     |   -    | 字段校验规则 |

#### emits

```markdown
emits: ['export', 'cancel']
```
