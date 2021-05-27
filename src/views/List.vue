<template>
  <mars-grid v-bind="gridOptions" v-model:pagination="gridOptions.pagination"></mars-grid>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  setup() {
    const xGrid = ref({})

    const gridOptions = reactive({
      editConfig: {
        trigger: 'click',
        mode: 'row',
        showStatus: true
      },
      pagination: {
        page: 1,
        limit: 5
      },
      pagerConfig: {
        pageSizes: [5, 10, 15, 20, 50]
      },
      columns: [
        { type: 'checkbox', width: 50 },
        { type: 'seq', width: 60 },
        { field: 'name', title: 'Name', editRender: { name: 'input' } },
        {
          title: '分类',
          children: [
            { field: 'nickname', title: 'Nickname', editRender: { name: 'input' } },
            { field: 'role', title: 'Role', editRender: { name: 'input' } }
          ]
        },
        { field: 'address', title: 'Address', showOverflow: true, editRender: { name: 'input' } }
      ],
      loading: false,
      data: [
        { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: 'Shenzhen' },
        { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
        { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
        { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: 'Women', age: 23, address: 'Shenzhen' },
        { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: 'Women', age: 30, address: 'Shanghai' },
        { id: 10006, name: 'Test6', nickname: 'T6', role: 'Designer', sex: 'Women', age: 21, address: 'Shenzhen' },
        { id: 10007, name: 'Test7', nickname: 'T7', role: 'Test', sex: 'Man', age: 29, address: 'Shenzhen' },
        { id: 10008, name: 'Test8', nickname: 'T8', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' },
        { id: 10009, name: 'Test9', nickname: 'T9', role: 'Designer', sex: 'Women', age: 21, address: 'Shenzhen' },
        { id: 10010, name: 'Test10', nickname: 'T10', role: 'Test', sex: 'Man', age: 29, address: 'Shenzhen' },
        { id: 10011, name: 'Test11', nickname: 'T11', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' },
        { id: 10012, name: 'Test12', nickname: 'T12', role: 'Test', sex: 'Man', age: 29, address: 'Shenzhen' },
        { id: 10013, name: 'Test13', nickname: 'T13', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' }
      ],
      total: 11
    })

    return {
      xGrid,
      gridOptions
    }
  }
})
</script>
