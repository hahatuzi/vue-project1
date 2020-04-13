<template>
  <el-container class="home-container">
    <el-header><div><img src="../assets/logo.png"><span>后台管理系统</span></div><el-button type="primary">退出</el-button></el-header>
    <el-container>
      <el-aside >
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF">
          <el-submenu :index="item.id+''" v-for="item in menulist" :key='item.id'>
            <template slot="title">
              <i :class="item.classname"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key='subitem.id' @click="active('/'+subitem.path)"><template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subitem.name}}</span>
            </template></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>

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
  }
}
</script>

<style>
*{
  padding:0;
  margin:0;
}
.home-container{
  height:100%;
}
.el-header{
    background-color: #666;
    color:white;
    line-height: 60px;
}
.el-header div{
  height:60px;
  width:290px;
  float:left;
}
.el-header img{
  width:60px;
  height:60px;
  vertical-align:top;
}
.el-header div span{
display:inline-block;
  width:210px;
  line-height:60px;
  font-size:25px;
  font-weight:bolder;
  padding-left:20px;
  letter-spacing:2px;
}
.el-button{
  width:50px;
  height:30px;
  float:right;
  position:relative;
}
.el-button span{
  font-size:16px;
  top:7px;
  left:7px;
  position:absolute;
}
.el-aside {
  background-color: #666;
  color: #white;
  text-align: center;
  height:565px;
  line-height: 565px;
}
.toggle-button {
  height:100px;
  background-color:#4a5064;
  font-size:10px;
  text-align:center;
}
.el-menu-item{
  text-align:right;
}
.el-main {
  background-color: #ccc;
  color: #333;
  text-align: center;
  line-height: 525px;
}
</style>
