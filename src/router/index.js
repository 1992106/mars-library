import { markRaw } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BaseLayout, EmptyLayout } from '@layout'

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
    component: () => import('../views/404.vue'),
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
        component: () => import('../views/Redirect.vue'),
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
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/About.vue'),
        meta: {
          title: '关于我们',
          icon: 'icon-user',
          ignoreKeepAlive: true
        }
      },
      {
        path: 'grid',
        name: 'Grid',
        component: () => import('@views/Grid.vue'),
        meta: {
          title: 'GRID',
          icon: 'icon-user',
          ignoreKeepAlive: true
        }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@views/Table.vue'),
        meta: {
          title: 'TABLE',
          icon: 'icon-user',
          ignoreKeepAlive: true
        }
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    component: markRaw(BaseLayout),
    redirect: '/test/home',
    meta: {
      title: '测试',
      icon: 'icon-test'
    },
    children: [
      {
        path: 'home',
        name: 'testHome',
        component: () => import('../views/testGroup/Home/index.jsx'),
        meta: {
          title: '测试首页'
        }
      },
      {
        path: 'list',
        name: 'testList',
        component: markRaw(EmptyLayout),
        redirect: '/test/list/list1',
        meta: {
          title: '列表'
        },
        children: [
          {
            path: 'level3',
            name: 'level3',
            component: markRaw(EmptyLayout),
            redirect: '/test/list/level3/level4',
            meta: {
              title: '3级目录'
            },
            children: [
              {
                path: 'level4',
                name: 'level4',
                component: () => import('../views/testGroup/List/List1/index.jsx'),
                meta: {
                  title: '列表'
                }
              }
            ]
          },
          {
            path: 'list1',
            name: 'list1',
            component: () => import('../views/testGroup/List/List1/index.jsx'),
            meta: {
              title: '列表1'
            }
          },
          {
            path: 'list2',
            name: 'list2',
            component: () => import('../views/testGroup/List/List2/index.jsx'),
            meta: {
              title: '列表2'
            }
          }
        ]
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
