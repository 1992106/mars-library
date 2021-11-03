<template>
  <a-tooltip color="#fff" trigger="click" placement="bottomRight" v-model:visible="visible">
    <button class="vxe-button type--button is--circle" type="button" title="列设置" @click="handleClick">
      <my-icon type="icon-setting" size="18"></my-icon>
    </button>
    <template #title>
      <div class="mars-grid-setting">
        <div class="setting-head">
          <a-checkbox v-model:checked="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
            列展示
          </a-checkbox>
          <a-button size="small" type="link" @click="handleReset">重置</a-button>
        </div>
        <div class="setting-body">
          <div class="box" v-if="leftFixed.length">
            <div class="title">固定在左侧</div>
            <draggable :list="leftFixed">
              <div class="group" v-for="item in leftFixed" :key="item.field">
                <a-checkbox v-model:checked="item.visible">{{ item.title }}</a-checkbox>
                <a-space :size="2">
                  <my-icon
                    type="icon-to-bottom"
                    size="18"
                    title="固定在列尾"
                    @click="handleClickRight('left', item)"
                  ></my-icon>
                  <my-icon
                    type="icon-to-middle"
                    size="18"
                    title="不固定"
                    @click="handleClickMiddle('left', item)"
                  ></my-icon>
                </a-space>
              </div>
            </draggable>
          </div>
          <div class="box" v-if="middleList.length">
            <div class="title">不固定</div>
            <draggable :list="middleList">
              <div class="group" v-for="item in middleList" :key="item.field">
                <a-checkbox v-model:checked="item.visible">{{ item.title }}</a-checkbox>
                <a-space :size="2">
                  <my-icon
                    type="icon-to-top"
                    size="18"
                    title="固定在列头"
                    @click="handleClickLeft('middle', item)"
                  ></my-icon>
                  <my-icon
                    type="icon-to-bottom"
                    size="18"
                    title="固定在列尾"
                    @click="handleClickRight('middle', item)"
                  ></my-icon>
                </a-space>
              </div>
            </draggable>
          </div>
          <div class="box" v-if="rightFixed.length">
            <div class="title">固定在右侧</div>
            <draggable :list="rightFixed">
              <div class="group" v-for="item in rightFixed" :key="item.field">
                <a-checkbox v-model:checked="item.visible">{{ item.title }}</a-checkbox>
                <a-space :size="2">
                  <my-icon
                    type="icon-to-top"
                    size="18"
                    title="固定在列头"
                    @click="handleClickLeft('right', item)"
                  ></my-icon>
                  <my-icon
                    type="icon-to-middle"
                    size="18"
                    title="不固定"
                    @click="handleClickMiddle('right', item)"
                  ></my-icon>
                </a-space>
              </div>
            </draggable>
          </div>
        </div>
        <div class="setting-foot">
          <a-space>
            <a-button size="small" @click="handleCancel">取消</a-button>
            <a-button type="primary" size="small" @click="handleOk">确定</a-button>
          </a-space>
        </div>
      </div>
    </template>
  </a-tooltip>
</template>
<script>
import { computed, defineComponent, reactive, toRefs, unref, watch } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { cloneDeep } from 'lodash-es'
import { columnsToStorage, storageToColumns } from './utils'

export default defineComponent({
  name: 'ColumnSetting',
  components: {
    draggable: VueDraggableNext
  },
  props: {
    // 自定义列
    columns: { type: Array, required: true, default: () => [] }
  },
  emits: ['change'],
  setup: function (props, { emit }) {
    const state = reactive({
      sourceColumns: [],
      backupColumns: [], // 备份配置
      visible: false,
      indeterminate: false,
      checkAll: false,
      // 固定左侧
      leftFixed: [],
      // 不固定
      middleList: [],
      // 固定右侧
      rightFixed: []
    })

    const getColumns = computed(() => {
      return columnsToStorage(props.columns)
    })

    const handleClick = () => {
      state.visible = !state.visible
      if (state.visible) {
        state.sourceColumns = cloneDeep(props.columns)
        state.backupColumns = cloneDeep(unref(getColumns))
        state.leftFixed = unref(getColumns).filter(val => val?.fixed === 'left')
        state.middleList = unref(getColumns).filter(val => !val?.fixed)
        state.rightFixed = unref(getColumns).filter(val => val?.fixed === 'right')
      }
    }

    // 全选
    const handleCheckAll = () => {
      state.indeterminate = false
    }

    watch(
      () => [state.leftFixed, state.middleList, state.rightFixed],
      ([leftFixed, middleList, rightFixed]) => {
        const list = [...leftFixed, ...middleList, ...rightFixed]
        state.checkAll = list.every(val => val.visible)
        state.indeterminate = list.some(val => !val.visible)
      },
      { deep: true }
    )

    const removeLeftFixed = column => {
      const index = state.leftFixed.findIndex(val => val.field === column.field)
      state.leftFixed.splice(index, 1)
    }

    const removeMiddleList = column => {
      const index = state.middleList.findIndex(val => val.field === column.field)
      state.middleList.splice(index, 1)
    }

    const removeRightFixed = column => {
      const index = state.rightFixed.findIndex(val => val.field === column.field)
      state.rightFixed.splice(index, 1)
    }

    // 固定在列头
    const handleClickLeft = (key, $event) => {
      if (key === 'right') {
        removeRightFixed($event)
      } else if (key === 'middle') {
        removeMiddleList($event)
      }
      state.leftFixed.push($event)
    }

    // 不固定
    const handleClickMiddle = (key, $event) => {
      if (key === 'left') {
        removeLeftFixed($event)
        state.middleList.unshift($event)
      } else if (key === 'right') {
        removeRightFixed($event)
        state.middleList.push($event)
      }
    }

    // 固定在列尾
    const handleClickRight = (key, $event) => {
      if (key === 'left') {
        removeLeftFixed($event)
      } else if (key === 'middle') {
        removeMiddleList($event)
      }
      state.rightFixed.unshift($event)
    }

    // 重置
    const handleReset = () => {
      const backupColumns = cloneDeep(state.backupColumns)
      state.leftFixed = backupColumns.filter(val => val?.fixed === 'left')
      state.middleList = backupColumns.filter(val => !val?.fixed)
      state.rightFixed = backupColumns.filter(val => val?.fixed === 'right')
    }

    // 取消
    const handleCancel = () => {
      state.visible = false
    }

    // 确定
    const handleOk = () => {
      const list = [
        ...state.leftFixed.map(val => ({ ...val, fixed: 'left' })),
        ...state.middleList,
        ...state.rightFixed.map(val => ({ ...val, fixed: 'right' }))
      ]
      const sourceColumns = cloneDeep(state.sourceColumns)
      emit('change', storageToColumns(list, sourceColumns))
      handleCancel()
    }

    return {
      ...toRefs(state),
      handleClick,
      handleReset,
      handleOk,
      handleCancel,
      handleCheckAll,
      handleClickLeft,
      handleClickMiddle,
      handleClickRight
    }
  }
})
</script>
<style lang="scss" scoped>
.mars-grid-setting {
  margin: -6px -8px;
  color: $text-color;
  width: 180px;
  .setting-head {
    padding: 6px 12px;
    @include flexRAC;
    justify-content: space-between;
    border-bottom: 1px solid $border-color-grey;
  }
  .setting-body {
    padding: 6px 10px 6px 20px;
    .box {
      margin-bottom: 6px;
      &:last-child {
        margin-bottom: 0;
      }
      .title {
        color: $text-color-grey;
      }
      .group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .ant-space {
          display: none;
        }
        &:hover > .ant-space {
          display: inline-flex;
          .anticon {
            color: $color-base;
          }
        }
      }
    }
  }
  .setting-foot {
    padding: 6px 12px;
    @include flexRAC;
    justify-content: flex-end;
    border-top: 1px solid $border-color-grey;
  }
}
</style>
