import { defineComponent } from 'vue'
import { DatePicker } from 'ant-design-vue'
import { dateToMoment, momentToDate } from '@/src/utils'

const MonthPicker = DatePicker.MonthPicker

const MyMonthPicker = defineComponent({
  name: 'MyMonthPicker',
  inheritAttrs: false,
  props: {
    value: { type: [Date, String, Number] }
  },
  emits: ['update:value'],
  setup(props, { emit, attrs }) {
    const onChange = $event => {
      emit('update:value', momentToDate($event))
    }

    return () => <MonthPicker {...attrs} v-model={[dateToMoment(props.value), 'value']} onChange={onChange} />
  }
})

export default MyMonthPicker
