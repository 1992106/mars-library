<template>
  <div class="page-content">
    <mars-grid ref="xGrid" v-bind="gridOptions" v-model:pagination="gridOptions.pagination" @search="handleSearch">
      <template #searchBar>
        <mars-search v-bind="searchOptions" @search="handleSearch">
          <template #extra>
            <mars-export v-bind="searchOptions" @export="handleExport"></mars-export>
          </template>
        </mars-search>
      </template>
      <template #operate="{ row }">
        <vxe-button icon="vxe-icon--edit-outline" title="编辑" circle></vxe-button>
      </template>
    </mars-grid>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  setup() {
    const xGrid = ref({})
    const data = []
    for (let i = 0; i < 100; i++) {
      const random = (len) => Math.floor(Math.random() * len)
      data.push({
        id: i,
        name: `Text${i}`,
        nickname: `T${i}`,
        role: ['Develop', 'Test', 'PM', 'Designer'][random(4)],
        sex: ['Man', 'Woman'][random(2)],
        age: [22, 24, 25, 28, 32][random(5)],
        address: ['Shenzhen', 'Guangzhou', 'Shanghai', 'Beijing'][random(4)]
      })
    }
    const gridOptions = reactive({
      columns: [
        { type: 'checkbox', title: '全选', width: 80 },
        { title: '操作', width: 100, slots: { default: 'operate' } },
        { type: 'seq', width: 60 },
        { field: 'name', title: 'Name', editRender: { name: 'input' } },
        {
          title: '基础信息',
          children: [
            { field: 'nickname', title: 'Nickname', editRender: { name: 'input' } },
            {
              field: 'sex',
              title: 'Sex',
              headerAlign: 'center',
              align: 'center',
              editRender: {
                name: 'ASelect',
                options: [
                  { label: 'Man', value: '1' },
                  { label: 'Woman', value: '0' }
                ],
                props: {
                  filterOption: true
                }
              },
              filters: [{ data: [] }],
              filterRender: {
                name: 'ASelect',
                options: [
                  { label: 'Man', value: '1' },
                  { label: 'Woman', value: '0' }
                ],
                props: {
                  mode: 'multiple'
                }
              }
            },
            { field: 'age', title: 'Age', editRender: { name: 'input' } },
            {
              field: 'role',
              title: 'Role',
              editRender: {
                name: '$select',
                options: [
                  { label: 'Develop', value: 'Develop' },
                  { label: 'Test', value: 'Test' },
                  { label: 'PM', value: 'PM' },
                  { label: 'Designer', value: 'Designer' }
                ]
              },
              filters: [{ data: [] }],
              filterRender: {
                name: '$select',
                options: [
                  { label: 'Develop', value: 'Develop' },
                  { label: 'Test', value: 'Test' },
                  { label: 'PM', value: 'PM' },
                  { label: 'Designer', value: 'Designer' }
                ],
                props: {
                  multiple: true
                }
              }
            }
          ]
        },
        { field: 'address', title: 'Address', showOverflow: true, editRender: { name: 'input' } }
      ],
      loading: false,
      data: data,
      total: data.length,
      pagination: {
        page: 1,
        limit: 20
      }
    })

    const searchOptions = reactive({
      columns: [
        { type: 'input', title: '输入框', field: 'name', rules: [], defaultValue: '123', placeholder: '请输入' },
        {
          type: 'select',
          title: '下拉框',
          field: 'sex',
          rules: [],
          options: [
            { value: '1', label: '男' },
            { value: '2', label: '女' }
          ],
          placeholder: '请选择',
          props: {
            mode: 'multiple'
          }
        },
        { type: 'datePicker', title: '日期框', field: 'time', rules: [], placeholder: ['开始日期', '结束日期'] },
        { type: 'checkbox', title: '多选勾选框', field: 'check', rules: [], options: ['Apple', 'Orange'] },
        {
          type: 'cascader',
          title: '级联框',
          field: 'city',
          rules: [],
          options: [
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
                  children: [
                    {
                      value: 'xihu',
                      label: 'West Lake'
                    }
                  ]
                }
              ]
            },
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [
                {
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: 'Zhong Hua Men'
                    }
                  ]
                }
              ]
            }
          ],
          placeholder: '请选择'
        },
        {
          type: 'treeSelect',
          title: '树选择框',
          field: 'node',
          rules: [],
          options: [
            {
              title: 'Node1',
              value: '0-0',
              key: '0-0',
              children: [
                {
                  title: 'Child Node1',
                  value: '0-0-0',
                  key: '0-0-0'
                }
              ]
            },
            {
              title: 'Node2',
              value: '0-1',
              key: '0-1',
              children: [
                {
                  title: 'Child Node3',
                  value: '0-1-0',
                  key: '0-1-0',
                  disabled: true
                },
                {
                  title: 'Child Node4',
                  value: '0-1-1',
                  key: '0-1-1'
                },
                {
                  title: 'Child Node5',
                  value: '0-1-2',
                  key: '0-1-2'
                }
              ]
            }
          ],
          placeholder: '请选择'
        }
      ]
    })

    const handleSearch = ($event) => {
      console.log($event, 'search')
    }

    const handleExport = ($event) => {
      console.log($event, 'export')
    }

    return {
      xGrid,
      gridOptions,
      searchOptions,
      handleSearch,
      handleExport
    }
  }
})
</script>
