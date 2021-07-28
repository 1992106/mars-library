import { defineComponent } from 'vue'
import { DatePicker } from 'ant-design-vue'
import { dateToMoment, momentToDate } from '@/src/utils'

const RangePicker = DatePicker.RangePicker

const MyRangePicker = defineComponent({
  name: 'MyRangePicker',
  inheritAttrs: false,
  props: {
    value: { type: Array }
  },
  emits: ['update:value'],
  setup(props, { emit, attrs }) {
    const onChange = $event => {
      emit('update:value', momentToDate($event))
    }

    return () => <RangePicker {...attrs} v-model={[dateToMoment(props.value), 'value']} onChange={onChange} />
  }
})

export default MyRangePicker
