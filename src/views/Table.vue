<template>
  <mars-table ref="xTable" v-bind="tableOptions" v-model:pagination="tableOptions.pagination">
    <template #operate="{ record }">
      <a-button type="primary" shape="circle">
        <template #icon><FormOutlined /></template>
      </a-button>
    </template>
    <template #name="{ text, record }">{{ text }}-{{ record }}</template>
  </mars-table>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
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
    const xTable = ref({})

    const data = []
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`
      })
    }

    const tableOptions = reactive({
      columns: [
        {
          title: '操作',
          key: 'operate',
          slots: { customRender: 'operate' }
        },
        {
          title: 'Full Name',
          dataIndex: 'name',
          key: 'name',
          slots: { customRender: 'name' }
        },
        {
          title: 'Age',
          width: 100,
          dataIndex: 'age',
          key: 'age'
        },
        {
          title: 'Column 1',
          dataIndex: 'address',
          key: '1',
          width: 150
        },
        {
          title: 'Column 2',
          dataIndex: 'address',
          key: '2',
          width: 150
        },
        {
          title: 'Column 3',
          dataIndex: 'address',
          key: '3',
          width: 150
        },
        {
          title: 'Column 4',
          dataIndex: 'address',
          key: '4',
          width: 150
        },
        {
          title: 'Column 5',
          dataIndex: 'address',
          key: '5',
          width: 150
        },
        {
          title: 'Column 6',
          dataIndex: 'address',
          key: '6',
          width: 150
        },
        {
          title: 'Column 7',
          dataIndex: 'address',
          key: '7',
          width: 150
        },
        {
          title: 'Column 8',
          dataIndex: 'address',
          key: '8'
        },
        {
          title: 'Action',
          key: 'operation',
          fixed: 'right',
          width: 100,
          slots: {
            customRender: 'action'
          }
        }
      ],
      dataSource: data,
      loading: false,
      total: data.length,
      pagination: {
        page: 1,
        limit: 5
      }
    })

    return {
      xTable,
      tableOptions
    }
  }
})
</script>
