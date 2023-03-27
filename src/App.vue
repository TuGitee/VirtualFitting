<template>
  <el-container id="app" direction="vertical">
    <HeaderBar class="header-bar" v-if="$router.currentRoute.meta.isShow" />
    <router-view />
  </el-container>
</template>

<script>
import HeaderBar from "./components/HeaderBar.vue";
export default {
  name: "App",
  components: {
    HeaderBar,
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
  user-select: none;

  a {
    text-decoration: none;
  }

  img[src=""],
  img:not([src]) {
    opacity: 0;
    user-select: none;
    -webkit-user-drag: none;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    &-track {
      background-color: transparent;
    }
    &-thumb {
      background-color: #efb6ff;
      border-radius: 10px;
    }
  }

  .el-dialog {
    margin-top: 10vh !important;
  }

  .main {
    position: relative;
    left: 220px;
    width: calc(100% - 220px);
    height: 100%;
    overflow: overlay;
    &::after {
      content: "";
      height: 100vh;
      width: 100vw;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -99999;
      background: url("@/assets/photo.png") no-repeat center center;
      background-size: cover;
      filter: blur(1rem);
      transform: scale(1.05);
    }
  }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  @media screen and (max-width: 768px) {
    .header-bar {
      width: 50px;
    }
    .main {
      left: 70px;
      width: calc(100% - 70px);
    }
  }
}
</style>
