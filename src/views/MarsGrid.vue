<template>
  <div class="page-content">
    <mars-grid ref="xGrid" v-bind="gridOptions" v-model:pagination="gridOptions.pagination" @search="handleFilter">
      <template #searchBar>
        <mars-search v-bind="searchOptions" @search="handleSearch">
          <template #extra>
            <a-button @click="visible = true">添加modal弹窗</a-button>
          </template>
        </mars-search>
      </template>
      <template #toolBar><div>toolBar</div></template>
      <template #operate="{ row }">
        <vxe-button icon="vxe-icon--edit-outline" title="编辑" circle @click="handleEdit(row)"></vxe-button>
      </template>
    </mars-grid>
    <mars-modal v-bind="modalOptions" v-model:visible="visible" @ok="handleModal"></mars-modal>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useSearch } from '@/hooks/useSearch'

export default defineComponent({
  setup() {
    const xGrid = ref({})
    const data = []
    const random = len => Math.floor(Math.random() * len)
    for (let i = 0; i < 100; i++) {
      let sex_id = ['0', '1'][random(2)]
      data.push({
        id: i,
        name: `Text${i}`,
        nickname: `T${i}`,
        role: ['Develop', 'Test', 'PM', 'Designer'][random(4)],
        sex_ids: ['0', '1'],
        sex: ['Man', 'Woman'][sex_id],
        sex_id: sex_id,
        age: [22, 24, 25, 28, 32][random(5)],
        date: new Date(),
        address: ['Shenzhen', 'Guangzhou', 'Shanghai', 'Beijing'][random(4)]
      })
    }
    const gridOptions = reactive({
      height: 'auto',
      columns: [
        { type: 'checkbox', title: '全选', width: 80 },
        { title: '操作', width: 100, slots: { default: 'operate' } },
        { type: 'seq', width: 60 },
        { field: 'name', title: 'Name', editRender: { name: 'input' } },
        {
          title: '基础信息',
          children: [
            {
              field: 'nickname',
              title: 'Nickname',
              editRender: { name: 'input' },
              filters: [{ data: null }],
              filterRender: { name: 'FilterInput' }
            },
            {
              field: 'sex_ids',
              title: 'Sexs',
              headerAlign: 'center',
              align: 'center',
              editRender: {
                name: 'ASelect',
                options: [
                  { label: 'Man', value: '0' },
                  { label: 'Woman', value: '1' }
                ],
                props: {
                  mode: 'multiple'
                }
              },
              filters: [{ data: [] }],
              filterRender: {
                name: 'ASelect',
                props: {
                  mode: 'multiple',
                  options: [
                    { label: 'Man', value: '0', disabled: true },
                    { label: 'Woman', value: '1' }
                  ]
                }
              }
            },
            {
              field: 'sex',
              title: 'Sex',
              headerAlign: 'center',
              align: 'center',
              params: {
                filterAlias: 'sex_id'
              },
              filters: [{ data: null }],
              filterRender: {
                name: 'MySelect',
                props: {
                  options: [
                    { label: 'Man', value: '0', disabled: true },
                    { label: 'Woman', value: '1' }
                  ]
                }
              }
            },
            {
              field: 'age',
              title: 'Age',
              editRender: { name: 'input' },
              filters: [{ data: '' }],
              filterRender: { name: 'MyInput' }
            },
            {
              field: 'date',
              title: 'Date'
              // editRender: { name: 'ADatePicker' }
            },
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
        pageSize: 20
      },
      checkboxConfig: {
        checkMethod: () => false
      }
    })

    const handleEdit = row => {
      console.log(row, 'table edit')
    }

    const store = useStore()
    store.dispatch('dict/getEnumerator')
    const enumerator = computed(() => store.getters['dict/enumerator'])

    const inputChange = $event => {
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
        // { type: 'AAutoComplete', title: '自动完成', field: 'autoComplete', rules: [] },
        {
          type: 'ASelect',
          title: '下拉框',
          field: 'select',
          rules: [],
          props: {
            mode: 'multiple',
            options: [
              { value: '1', label: '男', disabled: true },
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
            options: enumerator,
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

    const getList = () => {
      console.log(paramsRef.value, 'search')
    }

    const { paramsRef, handleSearch, handleFilter } = useSearch(getList)

    const visible = ref(false)

    const modalOptions = reactive({
      title: '添加Modal',
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

    const handleModal = $event => {
      console.log($event, 'modal')
    }

    return {
      xGrid,
      gridOptions,
      handleEdit,
      searchOptions,
      handleSearch,
      handleFilter,
      visible,
      modalOptions,
      handleModal
    }
  }
})
</script>
