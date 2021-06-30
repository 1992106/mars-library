import request from '@/utils/fetch'
const dict = {
  state: {
    //枚举类型
    enumerator: []
  },
  getters: {
    enumerator: state => state.enumerator
  },
  mutations: {
    setEnumerator(state, data) {
      let array = data.map(item => {
        return {
          value: item.id,
          label: item.enumerator_value,
          disabeld: !item.status,
          children: formatField(item.enumerator_item_archives, 'enumerator_item_value')
        }
      })
      state.enumerator = Object.freeze(array)
    }
  },
  actions: {
    async getEnumerator({ commit }) {
      const res = await request.get('/archive/enumerator/index')
      commit('setEnumerator', res.data || [])
    }
  }
}

const formatField = (data, label, value = 'id', status = 'status') => {
  if (Array.isArray(data)) {
    return data.map(item => {
      return {
        label: item[label],
        value: item[value],
        disabled: !item[status]
      }
    })
  }
  return []
}

export default dict
