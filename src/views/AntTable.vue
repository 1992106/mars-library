<template>
  <a-table :row-selection="rowSelection" :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }" />
</template>
<script>
import { defineComponent, computed, ref, unref } from 'vue'
const columns = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address'
  }
]
const data = []

for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`
  })
}

export default defineComponent({
  setup() {
    const selectedRowKeys = ref([]) // Check here to configure the default column

    const onSelectChange = (changableRowKeys) => {
      console.log('selectedRowKeys changed: ', changableRowKeys)
      selectedRowKeys.value = changableRowKeys
    }

    const rowSelection = computed(() => {
      return {
        type: 'checkbox',
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        hideDefaultSelections: false,
        selections: true
        // selections: [
        //   {
        //     key: 'all-data',
        //     text: 'Select All Data',
        //     onSelect: () => {
        //       selectedRowKeys.value = [...Array(46).keys()] // 0...45
        //     }
        //   },
        //   {
        //     key: 'odd',
        //     text: 'Select Odd Row',
        //     onSelect: (changableRowKeys) => {
        //       let newSelectedRowKeys = []
        //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
        //         if (index % 2 !== 0) {
        //           return false
        //         }
        //
        //         return true
        //       })
        //       selectedRowKeys.value = newSelectedRowKeys
        //     }
        //   },
        //   {
        //     key: 'even',
        //     text: 'Select Even Row',
        //     onSelect: (changableRowKeys) => {
        //       let newSelectedRowKeys = []
        //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
        //         if (index % 2 !== 0) {
        //           return true
        //         }
        //
        //         return false
        //       })
        //       selectedRowKeys.value = newSelectedRowKeys
        //     }
        //   }
        // ]
      }
    })
    return {
      data,
      columns,
      rowSelection
    }
  }
})
</script>
