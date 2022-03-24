<template>
  <div class="my-logo">
    <img src="../../assets/logo.png" alt="" />
    <h2 v-show="!collapsed" class="title">Mars-SCM</h2>
  </div>
</template>

<script>
export default {
  name: 'MyLogo',
  props: {
    collapsed: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
.my-logo {
  @include flexRCC();
  height: $header-height;
  line-height: $header-height;
  background: $bg-color;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  z-index: 3;

  img {
    height: 32px;
  }

  .title {
    margin-bottom: 0;
  }
}
</style>
