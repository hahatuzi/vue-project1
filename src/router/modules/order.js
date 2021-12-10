// 为了维护方便，路由可以按照大功能模块划分，如支付相关、测试相关、设置权限相关、活动相关等等
// import permission from './permission'
// import kanban from './kanban'
// import utilitytools from './utilitytools'
// import opOfpublicAccount from './opOfpublicAccount'
// import recallSystem from './recallSystem'
// import resource from './resource'
// import media from './media'

// import mcn from './mcn'
// export default [
//   ...mcn,
//   ...kanban,
//   ...resource,
//   ...media,
//   ...utilitytools,
//   ...opOfpublicAccount,
//   ...recallSystem,
//   ...permission,

//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/404', hidden: true }
// ]
import Layout from '@/layout'

export default [
  {
    path: '/order',
    component: Layout,
    redirect: '/order',
    alwaysShow: true, // will always show the root menu
    // name: 'order',
    name: '订单管理',
    classname: 'el-icon-user-solid',
    meta: {
      title: '订单管理',
      icon: 'radar'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/orderManage/list'),
        name: 'list',
        // hidden: true, // 隐藏页面的权限控制请放在父页面的入口
        meta: {
          title: '订单列表'
        }
      }
    ]
  }
]
