import { asyncRoutes, constantRoutes, Testroutes } from '@/router'
import { deepClone } from '@/utils'
import { generateRoutesByTree, isSuperAdmin, getFlatRoutes } from '@/utils/permission'
const state = {
  routes: [],
  flatRoutes: [] // 降级后的菜单
}
const mutations = {
  SET_ROUTES (state, routes) {
    console.log(state, routes, constantRoutes, 'ok')
    state.routes = constantRoutes.concat(Testroutes).concat(routes)
  },
  SET_FLAT_ROUTES: (state, flatRoutes) => {
    state.flatRoutes = flatRoutes
  }
}
const actions = {
  setRoutes ({ commit }, data) {
    commit('SET_ROUTES', data)
  },
  // 生成该用户的动态路由表
  generateRoutes ({ commit }, { permissionRouter: treePaths }) {
    return new Promise(resolve => {
      let accessRoutes
      if (isSuperAdmin()) {
        // 在超级管理员组则拥有所有才菜单权限，但是也使用该方法过滤一下主体相关的菜单
        accessRoutes = generateRoutesByTree(deepClone(asyncRoutes, ['component'])) || []
      } else {
        const cloneTreePaths = deepClone(treePaths)
        // 动态添加至最后，404页面
        cloneTreePaths.push('/*')
        accessRoutes = generateRoutesByTree(deepClone(asyncRoutes, ['component']), '/', cloneTreePaths)
      }
      commit('SET_ROUTES', accessRoutes)
      // 二级以上菜单全部转换成二级菜单，和菜单显示的路由分离（解决二级以上次菜单keep-alive缓存问题）
      const flatRoutes = getFlatRoutes(deepClone(accessRoutes, ['component']))
      commit('SET_FLAT_ROUTES', flatRoutes)
      resolve({ accessRoutes, flatRoutes })
    })
  }
}
export default {
  state,
  mutations,
  actions
}
