import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/* Router Modules */
// 系统管理
import systemManagement from './systemManagement/systemManagement'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    cache: true                  if true, the page will be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () =>
        import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () =>
      import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: '/',
      component: () =>
        // import('@/views/three/index'),
        import('@/views/home/index'),
      meta: {
        title: 'Dashboard',
        icon: 'dashboard',
        breadcrumb: false
      }
    }]
  },
  {
    path: '/notification',
    hidden: true,
    component: Layout,
    children: [{
      path: 'index',
      name: 'Notification',
      component: () =>
        import('@/views/notification/index'),
      meta: {
        title: 'Notification',
        icon: 'notification'
      }
    }]
  },

  {
    path: '/home',
    component: Layout,
    children: [{
      path: 'index',
      name: 'home',
      component: () =>
        import('@/views/home/index'),
      meta: {
        title: 'Home',
        icon: 'home'
      }
    }]
  },
  {
    path: '/individualMonitoring',
    component: Layout,
    children: [{
      path: 'index',
      name: 'individualMonitoring',
      component: () =>
        import('@/views/individualMonitoring/index'),
      meta: {
        title: 'IndividualMonitoring',
        icon: 'individualMonitoring',
        cache: true
      }
    }]
  },
  {
    path: '/sendMsg',
    component: Layout,
    hidden: true,
    children: [{
      path: 'index',
      name: 'sendMsg',
      component: () =>
        import('@/views/sendMsg/index'),
      meta: {
        title: 'SendMsg',
        icon: 'notification'
      }
    }]
  },

  {
    path: '/404',
    component: () =>
      import('@/views/404'),
    hidden: true
  }

]

export const asyncRouterMap = [
  /** When your routing table is too long, you can split it into small modules **/
  systemManagement,
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
