import { markRaw } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BaseLayout, EmptyLayout } from '@layout'

export const routes = [
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue'),
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

export default router
