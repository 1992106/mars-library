<template>
  <mars-search v-bind="searchOptions"></mars-search>
  <mars-grid ref="xGrid" v-bind="gridOptions" v-model:pagination="gridOptions.pagination" @search="search">
    <template #operate="{ row }">
      <vxe-button icon="vxe-icon--edit-outline" title="编辑" circle></vxe-button>
    </template>
  </mars-grid>
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
        { type: 'select', title: '下拉框', field: 'sex', rules: [], options: [], placeholder: '请选择' }
      ]
    })
    const search = ($event) => {
      console.log($event, 'search')
    }

    return {
      xGrid,
      gridOptions,
      searchOptions,
      search
    }
  }
})
</script>
