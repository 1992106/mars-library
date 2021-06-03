<template>
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
      editConfig: {
        trigger: 'click',
        mode: 'row',
        showStatus: true
      },
      pagerConfig: {
        pageSizes: [5, 10, 15, 20, 50]
      },
      columns: [
        { type: 'checkbox', title: '全选', width: 50 },
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
        limit: 5
      }
    })

    const search = ($event) => {
      console.log($event, 'search')
    }

    return {
      xGrid,
      gridOptions,
      search
    }
  }
})
</script>
