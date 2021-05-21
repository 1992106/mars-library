<template>
  <vxe-grid
    ref="xGrid"
    auto-resize
    border
    show-overflow
    keep-source
    resizable
    stripe
    :scroll-x="getScrollX"
    :scroll-y="getScrollY"
    :height="tableHeight"
    :columns="columns"
    :data="getData.list"
    :loading="getData.loading"
    :merge-cells="mergeCells"
    :edit-config="getEditConfig"
    :edit-rules="editRules"
    :row-class-name="rowClassName"
    :cell-class-name="cellClassName"
    :row-style="rowStyle"
    :cellStyle="cellStyle"
    :checkbox-config="getCheckboxConfig"
    :tooltip-config="getTooltipConfig"
    @edit-closed="handleEditClosed"
    @checkbox-change="handleCheckboxChange"
    @checkbox-all="handleCheckboxAll"
    @cell-click="handleCellClick"
    @resizable-change="handleResizableChange"
  >
    <template #opts="scope">
      <slot name="opts" v-bind="scope" :command="handleCommand"></slot>
    </template>
  </vxe-grid>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  setup() {
    return {}
  }
})
</script>
