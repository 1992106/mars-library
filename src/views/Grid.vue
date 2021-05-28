<template>
  <mars-grid ref="xGrid" v-bind="gridOptions" v-model:pagination="gridOptions.pagination">
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
        { title: '操作', width: 100, slots: { default: 'operate' } },
        { type: 'checkbox', width: 50 },
        { type: 'seq', width: 60 },
        { field: 'name', title: 'Name', editRender: { name: 'input' } },
        {
          title: '信息',
          children: [
            { field: 'nickname', title: 'Nickname', editRender: { name: 'input' } },
            { field: 'sex', title: 'Sex', editRender: { name: 'input' } },
            { field: 'age', title: 'Age', editRender: { name: 'input' } },
            { field: 'role', title: 'Role', editRender: { name: 'input' } }
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

    return {
      xGrid,
      gridOptions
    }
  }
})
</script>
