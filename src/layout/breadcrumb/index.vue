<template>
  <Breadcrumb :routes="routes" separator=">">
    <template #itemRender="{ route, routes, paths }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{ route.meta.title }}
      </span>
      <router-link v-else :to="route.path">
        {{ print(route, routes, paths) }}
        {{ route.meta.title }}-----{{ paths }}
      </router-link>
    </template>
  </Breadcrumb>
</template>
<script>
import { defineComponent, watch, ref } from 'vue'
import { Breadcrumb } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MyBreadcrumb',
  components: { Breadcrumb },
  setup() {
    const router = useRouter()
    const routes = ref([])

    watch(
      () => router.currentRoute.value.fullPath,
      () => {
        if (['Redirect', '404'].includes(router.currentRoute.value.name)) return
        routes.value = router.currentRoute.value.matched
      },
      { immediate: true }
    )

    const print = (route) => {
      console.log(route.path, 888)
    }

    return {
      routes,
      print
    }
  }
})
</script>

<style lang="scss" scoped></style>
