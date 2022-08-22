import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: '数据面板', icon: 'dashboard' },
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '数据面板', icon: 'dashboard' }
    }]
  },
  {
    path: '/usermanage',
    component: Layout,
    redirect: '/usermanage/userlist',
    name: 'Usermanage',
    meta: { title: '用户管理', icon: 'el-icon-user-solid' },
    children: [{
      path: 'userlist',
      name: 'Userlist',
      component: () => import('@/views/usermanage/userlist'),
      meta: { title: '用户列表', icon: 'table' }
    },
    {
      path: 'adduser',
      name: 'Adduser',
      component: () => import('@/views/usermanage/adduser'),
      meta: { title: '新增用户', icon: 'form' }
    }]
  },
  {
    path: '/logmanage',
    component: Layout,
    redirect: '/logmanage/operlog',
    name: 'Logmanage',
    meta: { title: '日志展示', icon: 'el-icon-refrigerator' },
    children: [{
      path: 'operlog',
      name: 'Operlog',
      component: () => import('@/views/logmanage/operlog'),
      meta: { title: '操作日志', icon: 'el-icon-lollipop' }
    },
    {
      path: 'syslog',
      name: 'Syslog',
      component: () => import('@/views/logmanage/syslog'),
      meta: { title: '系统日志', icon: 'el-icon-ice-cream-square' }
    }]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://gitee.com/ptonlix/oyster-iot',
        meta: { title: '公司官网', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
