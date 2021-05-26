<template>
  <vxe-grid v-bind="gridOptions" @page-change="test">
    <template #toolbar_buttons>
      <vxe-button @click="gridOptions.align = 'left'">居左</vxe-button>
      <vxe-button @click="gridOptions.align = 'center'">居中</vxe-button>
      <vxe-button @click="gridOptions.align = 'right'">居右</vxe-button>
    </template>
  </vxe-grid>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { VXETable } from 'vxe-table'

export default defineComponent({
  setup() {
    const xGrid = ref({})

    const gridOptions = reactive({
      border: true,
      resizable: true,
      keepSource: true,
      id: 'toolbar_demo_1',
      editConfig: {
        trigger: 'click',
        mode: 'row',
        showStatus: true
      },
      pagerConfig: {
        pageSize: 10,
        pagerCount: 3,
        total: 11
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
      data: [
        { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: 'Shenzhen' },
        { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
        { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
        { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: 'Women', age: 23, address: 'Shenzhen' },
        { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: 'Women', age: 30, address: 'Shanghai' },
        { id: 10006, name: 'Test6', nickname: 'T6', role: 'Designer', sex: 'Women', age: 21, address: 'Shenzhen' },
        { id: 10007, name: 'Test7', nickname: 'T7', role: 'Test', sex: 'Man', age: 29, address: 'Shenzhen' },
        { id: 10008, name: 'Test8', nickname: 'T8', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' },
        { id: 10009, name: 'Test6', nickname: 'T6', role: 'Designer', sex: 'Women', age: 21, address: 'Shenzhen' },
        { id: 10010, name: 'Test7', nickname: 'T7', role: 'Test', sex: 'Man', age: 29, address: 'Shenzhen' },
        { id: 10011, name: 'Test8', nickname: 'T8', role: 'Develop', sex: 'Man', age: 35, address: 'Shenzhen' }
      ]
    })

    const toolbarButtonClickEvent = ({ code }) => {
      const $grid = xGrid.value
      switch (code) {
        case 'myInsert': {
          $grid.insert({
            name: 'xxx'
          })
          break
        }
        case 'mySave': {
          const { insertRecords, removeRecords, updateRecords } = $grid.getRecordset()
          VXETable.modal.message({
            content: `新增 ${insertRecords.length} 条，删除 ${removeRecords.length} 条，更新 ${updateRecords.length} 条`,
            status: 'success'
          })
          break
        }
        case 'myExport': {
          $grid.exportData({
            type: 'csv'
          })
          break
        }
      }
    }

    const test = ({ type, currentPage, pageSize, $event }) => {
      console.log(type, currentPage, pageSize, $event)
      console.log(gridOptions.pagerConfig, 'gridOptions')
    }

    return {
      xGrid,
      gridOptions,
      toolbarButtonClickEvent,
      test
    }
  }
})
</script>
