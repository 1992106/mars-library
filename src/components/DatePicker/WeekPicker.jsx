import { defineComponent } from 'vue'
import { DatePicker } from 'ant-design-vue'
import { dateToMoment, momentToDate } from '@/src/utils'

const WeekPicker = DatePicker.WeekPicker

const MyWeekPicker = defineComponent({
  name: 'MyWeekPicker',
  inheritAttrs: false,
  props: {
    value: { type: [Date, String, Number] }
  },
  emits: ['update:value'],
  setup(props, { emit, attrs }) {
    const onChange = $event => {
      emit('update:value', momentToDate($event))
    }

    return () => <WeekPicker {...attrs} v-model={[dateToMoment(props.value), 'value']} onChange={onChange} />
  }
})

export default MyWeekPicker
