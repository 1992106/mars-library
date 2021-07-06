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
    const onInput = $event => {
      emit('update:value', momentToDate($event))
    }

    const newProps = {
      value: dateToMoment(props.value),
      'onUpdate:value': onInput,
      ...attrs
    }

    return () => <RangePicker {...newProps} />
  }
})

export default MyRangePicker
