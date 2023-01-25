<template>
  <el-header class="header" height="auto">
    <el-menu
      mode="horizontal"
      router
      :default-active="$route.path"
    >
      <el-menu-item v-for="(item,index) in navList" :key="index" :index="item.path">
        {{item.name}}
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
import routes from '@/router/routes'
export default {
  data(){
    return {
      navList: routes.filter(item => !item.redirect)
    }
  },
};
</script>

<style lang="less" scoped>
.header {
  color: #333;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  min-width: fit-content;
  /deep/ .el-menu.el-menu--horizontal{
    border-bottom: none;
    display: flex;
  }
}
</style>