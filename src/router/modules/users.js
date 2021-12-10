import Layout from '@/layout'

export default [
  {
    path: '/users',
    component: Layout,
    redirect: '/users',
    alwaysShow: true, // will always show the root menu
    // name: 'users',
    name: '用户管理',
    classname: 'el-icon-user-solid',
    meta: {
      title: '用户管理',
      icon: 'radar'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/userManage/list'),
        name: 'list',
        // hidden: true, // 隐藏页面的权限控制请放在父页面的入口
        meta: {
          title: '用户列表'
        }
      }
    ]
  }
]
