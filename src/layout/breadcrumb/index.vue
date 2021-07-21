<template>
  <a-breadcrumb :routes="routes" separator=">">
    <template #itemRender="{ route, routes, paths }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{ route.meta.title }}
      </span>
      <router-link v-else :to="handlePath(route, paths)">
        {{ route.meta.title }}
      </router-link>
    </template>
  </a-breadcrumb>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MyBreadcrumb',
  setup() {
    const router = useRouter()
    const routes = ref([])

    const handlePath = (route, paths) => {
      return route.children ? route.redirect || `/${paths.slice(-1)}` : `/${paths.slice(-2).join('/')}`
    }

    watch(
      () => router.currentRoute.value.fullPath,
      () => {
        if (['ErrorPage', 'Login', 'Redirect'].includes(router.currentRoute.value.name)) return
        routes.value = router.currentRoute.value.matched.filter(item => item.path !== '/')
      },
      { immediate: true }
    )

    return {
      handlePath,
      routes
    }
  }
})
</script>

<style lang="scss" scoped></style>
