<template>
  <div class="page-content">
    <mars-table ref="xTable" v-bind="tableOptions" v-model:pagination="tableOptions.pagination" @search="handleSearch">
      <template #searchBar>
        <mars-search v-bind="searchOptions" @search="handleSearch">
          <template #extra>
            <mars-export v-bind="exportOptions" @export="handleExport"></mars-export>
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

    const inputChange = ($event) => {
      console.log($event, 'inputChange')
    }

    const searchOptions = reactive({
      columns: [
        {
          type: 'AInput',
          title: '输入框',
          field: 'input',
          rules: [],
          props: { defaultValue: '123', placeholder: '请输入' },
          events: { change: inputChange }
        },
        { type: 'AInputNumber', title: '数字输入框', field: 'inputNumber', rules: [] },
        { type: 'AAutoComplete', title: '自动完成', field: 'autoComplete', rules: [] },
        {
          type: 'ASelect',
          title: '下拉框',
          field: 'select',
          rules: [],
          props: {
            mode: 'multiple',
            options: [
              { value: '1', label: '男' },
              { value: '2', label: '女' }
            ],
            placeholder: '请选择'
          }
        },
        {
          type: 'ACheckboxGroup',
          title: '多选勾选框',
          field: 'checkGroup',
          rules: [],
          props: { options: ['Apple', 'Orange'] }
        },
        {
          type: 'ARadioGroup',
          title: '单选勾选框',
          field: 'radioGroup',
          rules: [],
          props: { options: ['Apple', 'Orange'] }
        },
        { type: 'ASwitch', title: '开关', field: 'switch', rules: [] },
        {
          type: 'ACascader',
          title: '级联框',
          field: 'city',
          rules: [],
          props: {
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
          }
        },
        {
          type: 'ATreeSelect',
          title: '树选择框',
          field: 'node',
          rules: [],
          props: {
            treeData: [
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
        },
        { type: 'ASlider', title: '滑动输入条', field: 'slider', rules: [] },
        {
          type: 'ADatePicker',
          title: '日期选择框',
          field: 'date',
          rules: [],
          props: {
            defaultPickerValue: new Date()
          }
        },
        {
          type: 'AWeekPicker',
          title: '日期选择框(周)',
          field: 'week',
          rules: [],
          props: {
            defaultPickerValue: new Date()
          }
        },
        {
          type: 'AMonthPicker',
          title: '日期选择框(月)',
          field: 'month',
          rules: [],
          props: {
            defaultPickerValue: new Date()
          }
        },
        {
          type: 'ARangePicker',
          title: '日期选择框(范围)',
          field: 'range',
          rules: [],
          props: {
            placeholder: ['开始日期', '结束日期'],
            defaultPickerValue: [new Date(), new Date()]
          }
        },
        {
          type: 'ATimePicker',
          title: '时间选择框',
          field: 'time',
          rules: [],
          props: {
            defaultPickerValue: new Date()
          }
        }
      ]
    })

    const handleSearch = ($event) => {
      console.log($event, 'search')
    }

    const exportOptions = reactive({
      columns: [
        { title: 'Test1', field: 'a', defaultValue: true, rule: [] },
        { title: 'Test2', field: 'b', defaultValue: true, rule: [] },
        { title: 'Test3', field: 'c', defaultValue: true, rule: [] },
        { title: 'Test4', field: 'd', defaultValue: true, rule: [] },
        { title: 'Test5', field: 'e', defaultValue: true, rule: [] },
        { title: 'Test6', field: 'f', defaultValue: true, rule: [] }
      ]
    })

    const handleExport = ($event) => {
      console.log($event, 'export')
    }

    return {
      xTable,
      tableOptions,
      searchOptions,
      handleSearch,
      exportOptions,
      handleExport
    }
  }
})
</script>
