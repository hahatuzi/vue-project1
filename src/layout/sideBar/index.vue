<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409EFF">
      <template v-for="route in permissionRoutes">
        <el-submenu v-if="!route.hidden" :key="route.path" :index="route.id+''">
          <!-- <template v-if="!route.hidden"> -->
          <template slot="title">
            <i :class="route.classname"></i>
            <span>{{route.name}}</span>
          </template>
          <router-link :to="route.path + '/'+subitem.path" v-for="subitem in route.children"
            :key="subitem.id">
            <el-menu-item :index="'/'+subitem.path"><template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.name}}</span>
              </template></el-menu-item>
          </router-link>
          <!-- </template> -->
        </el-submenu>
      </template>
      <!-- <el-submenu :index="item.id+''" v-for="item in menulist" :key='item.id'>
        <template slot="title">
          <i :class="item.classname"></i>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key='subitem.id'
          @click="active('/'+subitem.path)"><template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{subitem.name}}</span>
          </template></el-menu-item>
      </el-submenu> -->
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      menulist: [
        { id: 1, name: '用户管理', classname: 'el-icon-user-solid', children: [{ id: 1, name: '用户列表', path: 'users' }] },
        { id: 2, name: '权限管理', classname: 'el-icon-key', children: [{ id: 1, name: '角色列表', path: 'roles' }, { id: 2, name: '权限列表', path: 'rights' }] },
        { id: 3, name: '商品管理', classname: 'el-icon-set-up', children: [{ id: 1, name: '商品列表', path: 'goods' }, { id: 2, name: '分类参数', path: 'data' }, { id: 3, name: '商品分类', path: 'list' }] },
        { id: 4, name: '订单管理', classname: 'el-icon-shopping-cart-2' },
        { id: 5, name: '数据统计', classname: 'el-icon-s-data' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'permissionRoutes'
      // 'sidebar'
    ])
    // activeMenu () {
    //   const route = this.$route
    //   const { meta, path } = route
    //   // if set path, the sidebar will highlight the path you set
    //   if (meta.activeMenu) {
    //     return meta.activeMenu
    //   }
    //   return path
    // },
    // showLogo () {
    //   return this.$store.state.settings.sidebarLogo
    // },
    // variables () {
    //   return variables
    // },
    // isCollapse () {
    //   return !this.sidebar.opened
    // }
  },
  created () {
    this.setRoute()
  },
  methods: {
    ...mapMutations(['SET_ROUTES']),
    // ...mapActions(['setRoutes']),
    setRoute () {
      this.SET_ROUTES('')
      // this.SET_ROUTES(this.menulist)
    }
  }
}
</script>

<style>
</style>
