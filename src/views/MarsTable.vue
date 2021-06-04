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
        limit: 20
      },
      rowSelection
    })

    return {
      xTable,
      tableOptions
    }
  }
})
</script>
