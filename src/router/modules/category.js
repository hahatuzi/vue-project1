import Layout from '@/layout'

export default [
  {
    path: '/category',
    component: Layout,
    redirect: '/category',
    alwaysShow: true, // will always show the root menu
    // name: 'category',
    name: '用户管理',
    classname: 'el-icon-user-solid',
    meta: {
      title: '商品分类',
      icon: 'radar'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/categoryManage/list'),
        name: 'list',
        // hidden: true, // 隐藏页面的权限控制请放在父页面的入口
        meta: {
          title: '商品列表'
        }
      },
      {
        path: 'list',
        component: () => import('@/views/categoryManage/list'),
        name: 'list',
        // hidden: true, // 隐藏页面的权限控制请放在父页面的入口
        meta: {
          title: '分类参数'
        }
      },
      {
        path: 'list',
        component: () => import('@/views/categoryManage/list'),
        name: 'list',
        // hidden: true, // 隐藏页面的权限控制请放在父页面的入口
        meta: {
          title: '商品分类'
        }
      }
    ]
  }
]
