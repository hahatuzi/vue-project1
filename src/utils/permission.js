import path from 'path'
import { deepClone } from '@/utils'
import store from '@/store'
import _ from 'lodash'

// 判断是都当前主体的菜单项
const isCurrentTenant = (route) => {
  const adminInfo = store.getters.adminInfo || {}
  const tenant = route?.meta?.tenant
  if (!_.isEmpty(tenant) && !tenant.includes(adminInfo.tenant_id)) return false
  return true
}

// 是否超级管理员
export const isSuperAdmin = (adminInfo) => {
  const _info = adminInfo || store.getters.adminInfo
  return !!_info.is_administrator
}

// 根据树形组件的treePaths对比所有异步路由得到当前用户有权限的路由
export const generateRoutesByTree = (routes, basePath = '/', treePaths) => {
  const res = []

  for (const route of routes) {
    if (!isCurrentTenant(route)) continue

    const routePath = path.resolve(basePath, route.path)
    const tempChildren = route.children

    if (route.children) {
      route.children = generateRoutesByTree(route.children, routePath, treePaths)
    }
    if ((isSuperAdmin() || treePaths.includes(routePath)) || (route.children && route.children.length >= 1)) {
      res.push(route)
      // 关联当前route的非菜单页面（一般一些比较大的数据新增、修改页面），权限路由的一些关联路由
      if ((treePaths && treePaths.includes(routePath)) && tempChildren && tempChildren.length > 0) {
        route.children = tempChildren
      }
    }
  }
  return res
}

// 是否只有一个子路由:没children返回false,2个以上children返回false,只有一个非隐藏children返回这个children用于提升级别到上级
const hasOneShowingChild = (children = [], parent) => {
  let onlyOneChild = null
  const showingChildren = children.filter(item => !item.hidden)

  if (showingChildren.length === 1) {
    onlyOneChild = { ...showingChildren[0] }
    // 直接使用 path.resolve 会将地址变成绝对地址
    const getPath = path.isAbsolute(onlyOneChild.path) ? path.resolve : path.join
    onlyOneChild.path = getPath(parent.path, onlyOneChild.path)
    return onlyOneChild
  }
  return false
}

// 根据路由生成tree组件的data数据,包含按钮项
export const generateTreeDataByRoutes = (routes, permissionUrl, basePath = '/') => {
  const res = []

  for (let route of routes) {
    if (route.hidden) { continue }

    const onlyOneShowingChild = hasOneShowingChild(route.children, route)
    // 是否唯一子路由 && 子路由不存在下级子路由 && 路由未设置一直显示： 将当前路由设置为唯一子路由，即路由提升
    if (route.children && onlyOneShowingChild && !onlyOneShowingChild.children && !route.alwaysShow) {
      route = onlyOneShowingChild
    }
    const routePath = path.resolve(basePath, route.path)

    // 页面路由项
    const data = {
      path: routePath,
      id: routePath,
      label: route.meta && route.meta.title
    }

    // children按钮添加:此处将非菜单页面按钮权限放到了父级页面选择
    if (route.apis) {
      const permissionApis = route.apis.filter(item => permissionUrl.includes(item.path))
      data.children = permissionApis.map(api => {
        return {
          path: api.path,
          id: api.path,
          label: api.name,
          type: 'button',
          // 添加父级页面路由path以便选中按钮后传递权限路由信息
          parentPath: data.path
        }
      })
      data.children.unshift({
        path: data.path,
        id: data.id,
        label: '页面'
      })
    } else if (route.children) {
      data.children = generateTreeDataByRoutes(route.children, permissionUrl, data.path)
      // // 非页面非按钮禁用权限选择
      // if (data.children && data.children[0].type !== 'button') {
      //   data.disabled = true
      // }
    }
    res.push(data)
  }
  return res
}

// 根据选中的按钮权限得到选中后的tree
export const filterTree = (treeData, treePaths) => {
  const res = []
  const cloneTree = deepClone(treeData)
  for (const tree of cloneTree) {
    if (tree.children) {
      tree.children = filterTree(tree.children, treePaths)
    }
    if (treePaths.includes(tree.path) || (tree.children && tree.children.length >= 1)) {
      res.push(tree)
    }
  }
  return res
}

// 多级菜单降级
const formatRouter = (routes, basePath = '/', list = [], parent) => {
  routes.map(item => {
    item.path = path.resolve(basePath, item.path)
    const meta = item.meta || {}
    if (!meta.parent && parent) {
      meta.parent = parent.path
      item.meta = meta
    }
    if (item.redirect) item.redirect = path.resolve(basePath, item.redirect)
    if (item.children && item.children.length > 0) {
      const arr = formatRouter(item.children, item.path, list, item)
      delete item.children
      list.concat(arr)
    }
    list.push(item)
  })
  return list
}

// 二级以上的菜单降级转换成二级菜单
export const getFlatRoutes = (routes) => {
  return routes.map((child) => {
    if (child.children && child.children.length > 0) {
      child.children = formatRouter(child.children, child.path, [], child)
    }
    return child
  })
}
