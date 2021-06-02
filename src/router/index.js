import { markRaw } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BaseLayout } from '@layout'

export const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorPage',
    redirect: () => ({ name: '404' }),
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@views/system/404.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/system/login/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    name: 'Redirect',
    component: markRaw(BaseLayout),
    meta: {
      title: 'Redirect',
      hidden: true
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@views/system/Redirect.vue'),
        meta: {
          title: 'Redirect',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/',
    component: markRaw(BaseLayout),
    redirect: '/index',
    name: 'index',
    children: [
      {
        path: 'index',
        name: 'Dashboard',
        component: () => import('../views/Home.vue'),
        meta: {
          title: '仪表盘',
          icon: 'icon-Dashboard'
        }
      }
    ]
  },
  {
    path: '/list',
    name: 'list',
    component: markRaw(BaseLayout),
    meta: {
      title: '列表',
      icon: 'icon-pingtai'
    },
    children: [
      {
        path: 'vxe',
        name: 'VxeTable',
        component: () => import('@views/VxeTable.vue'),
        meta: {
          title: 'VxeTable'
        }
      },
      {
        path: 'marsGrid',
        name: 'MarsGrid',
        component: () => import('@views/MarsGrid.vue'),
        meta: {
          title: 'MarsGrid'
        }
      },
      {
        path: 'marsTable',
        name: 'MarsTable',
        component: () => import('@views/MarsTable.vue'),
        meta: {
          title: 'MarsTable'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export const resetRouter = () => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !['ErrorPage', 'Login', 'Redirect'].includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router