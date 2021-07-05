import { defineComponent } from 'vue'
import { DatePicker } from 'ant-design-vue'
import { dateToMoment, momentToDate } from '@/src/utils'

const MyDatePicker = defineComponent({
  name: 'MyDatePicker',
  inheritAttrs: false,
  props: {
    value: { type: [Date, String, Number] }
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

    return () => <DatePicker {...newProps} />
  }
})

export default MyDatePicker
