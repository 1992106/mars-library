<template>
  <div class="logo">
    <img src="../../assets/logo.png" alt="" />
    <h2 v-show="!collapsed" class="title">Mars-SCM</h2>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    collapsed: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  height: $header-height;
  overflow: hidden;
  line-height: $header-height;
  white-space: nowrap;
  background: #fff;
  img {
    height: 32px;
  }

  .title {
    margin-bottom: 0;
  }
}
</style>
