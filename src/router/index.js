import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
// import asyncRoutes from './modules/order'
import Layout from '@/layout'
// import digitalLargeScreenRoutes from './modules/digitalLargeScreen'
Vue.use(VueRouter)
// 路由的设计包括路由导航守卫，及登陆判断，管理系统的权限判断。
let routerList = []
const installRouter = function () {
  const list = require.context('./modules', true, /\.js$/)
  list.keys().forEach(item => {
    routerList = routerList.concat(list(item).default)
  })
}
installRouter()
const Testroutes = [
  ...routerList
]

// const router = new VueRouter({
//   ...routes
// })
// export default router
console.log(Testroutes, routerList)
// 不需要校验权限的路由
const constantRoutes = [
  // ...digitalLargeScreenRoutes,
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]
const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
const resetRouter = () => {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export {
  constantRoutes,
  Testroutes,
  // asyncRoutes,
  resetRouter
}
export default router
// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   },
//   {
//     path: '/',
//     name: 'Layout',
//     component: Layout
//   }
// ]
// const router = new VueRouter({
//   routes
// })

// export default router
