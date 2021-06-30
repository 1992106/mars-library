<template>
  <router-view #default="{ Component, route }">
    <!--<transition mode="out-in" name="fade-slide" appear>-->
    <keep-alive :include="cachedTabList">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
    <!--</transition>-->
  </router-view>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const cachedTabList = computed(() => store.state.router.cachedTabList.map(item => item.name))

    return {
      cachedTabList
    }
  }
})
</script>
