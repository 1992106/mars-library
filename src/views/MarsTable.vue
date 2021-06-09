<template>
  <div class="page-content">
    <mars-table ref="xTable" v-bind="tableOptions" v-model:pagination="tableOptions.pagination" @search="handleSearch">
      <template #searchBar>
        <mars-search v-bind="searchOptions" @search="handleSearch">
          <template #extra>
            <mars-export v-bind="searchOptions" @export="handleExport"></mars-export>
          </template>
        </mars-search>
      </template>
      <template #toolBar><div>toolBar</div></template>
      <template #operate="{ record }">
        <a-button type="primary" shape="circle">
          <template #icon><FormOutlined /></template>
        </a-button>
      </template>
      <template #name="{ text, record }">{{ text }}-{{ record }}</template>
    </mars-table>
  </div>
</template>
<script>
import { computed, defineComponent, reactive, ref, unref } from 'vue'
import { Table, Button } from 'ant-design-vue'
import { DownOutlined, FormOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    [Table.name]: Table,
    [Button.name]: Button,
    DownOutlined,
    FormOutlined
  },
  setup() {
    const selectedRowKeys = ref([]) // Check here to configure the default column

    const onSelectChange = (changableRowKeys) => {
      console.log('selectedRowKeys changed: ', changableRowKeys)
      selectedRowKeys.value = changableRowKeys
    }

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange
      }
    })

    const xTable = ref({})

    const data = []
    for (let i = 0; i < 40; i++) {
      data.push({
        id: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`
      })
    }

    const tableOptions = reactive({
      columns: [
        { title: '操作', id: 'operate', fixed: 'left', slots: { customRender: 'operate' } },
        { title: 'Full Name', dataIndex: 'name', id: 'name', slots: { customRender: 'name' } },
        { title: 'Age', width: 100, dataIndex: 'age', id: 'age' },
        { title: 'Column 1', dataIndex: 'address', id: '1', width: 150 },
        { title: 'Column 2', dataIndex: 'address', id: '2', width: 150 },
        { title: 'Column 3', dataIndex: 'address', id: '3', width: 150 },
        { title: 'Column 4', dataIndex: 'address', id: '4', width: 150 },
        { title: 'Column 5', dataIndex: 'address', id: '5', width: 150 },
        { title: 'Column 6', dataIndex: 'address', id: '6', width: 150 },
        { title: 'Column 7', dataIndex: 'address', id: '7', width: 150 },
        { title: 'Column 8', dataIndex: 'address', id: '8' },
        { title: 'Action', id: 'operation', fixed: 'right', slots: { customRender: 'action' } }
      ],
      dataSource: data,
      loading: false,
      total: data.length,
      pagination: {
        page: 1,
        pageSize: 15
      },
      paginationConfig: {
        pageSizeOptions: ['15', '20', '30', '40']
      },
      rowSelection
    })

    const searchOptions = reactive({
      columns: [
        { type: 'AInput', title: '输入框', field: 'name', rules: [], defaultValue: '123', placeholder: '请输入' },
        { type: 'AInputNumber', title: '数字输入框', field: 'number', rules: [] },
        {
          type: 'ASelect',
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
        { type: 'ADatePicker', title: '日期框', field: 'time', rules: [], placeholder: ['开始日期', '结束日期'] },
        { type: 'ACheckboxGroup', title: '多选勾选框', field: 'check', rules: [], options: ['Apple', 'Orange'] },
        { type: 'ARadioGroup', title: '单选勾选框', field: 'radio', rules: [], options: ['Apple', 'Orange'] },
        {
          type: 'ACascader',
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
          type: 'ATreeSelect',
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
      xTable,
      tableOptions,
      searchOptions,
      handleSearch,
      handleExport
    }
  }
})
</script>
