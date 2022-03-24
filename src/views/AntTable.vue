<template>
  <div class="page-content">
    <a-table :data-source="data" :columns="columns" @change="handleChange">
      <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)">
            <template #icon><SearchOutlined /></template>
            Search
          </a-button>
          <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">Reset</a-button>
        </div>
      </template>
      <template #filterIcon="filtered">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template #customRender="{ text, column }">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))">
            <mark v-if="fragment.toLowerCase() === searchText.toLowerCase()" class="highlight" :key="i">
              {{ fragment }}
            </mark>
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>
  </div>
</template>
<script>
import { SearchOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref } from 'vue'
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park'
  }
]
export default defineComponent({
  name: 'AntTable',
  components: {
    SearchOutlined
  },
  setup() {
    const state = reactive({
      searchText: '',
      searchedColumn: ''
    })
    const searchInput = ref()
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender'
        },
        onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            }, 0)
          }
        }
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender'
        },
        onFilter: (value, record) => record.age.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            })
          }
        }
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender'
        },
        onFilter: (value, record) => record.address.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus()
            })
          }
        }
      }
    ]

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm()
      state.searchText = selectedKeys[0]
      state.searchedColumn = dataIndex
    }

    const handleReset = clearFilters => {
      clearFilters()
      state.searchText = ''
    }

    // 分页、排序、筛选变化时触发
    const handleChange = (pagination, filters, sorter, { currentDataSource }) => {
      console.log(pagination, filters, filters.name, sorter, { currentDataSource }, 111)
    }

    return {
      data,
      columns,
      handleSearch,
      handleReset,
      searchText: '',
      searchInput,
      searchedColumn: '',
      handleChange
    }
  }
})
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0;
}
</style>
