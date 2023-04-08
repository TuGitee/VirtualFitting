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
  mounted() {
    this.$ws.onopen = (evt) => {
      console.log("Connection establied!");
      // 发送post请求开始训练模型
      this.$axios.post('')
    };
    this.$ws.onerror = (evt) => {
      this.$message.error("连接失败");
    };
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
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;

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
      background-color: @color;
      border-radius: 10px;
    }
  }

  .el-dialog {
    margin-top: 10vh !important;

    @media screen and (max-width: 768px) {
      width: 80% !important;
    }
  }

  .main {
    position: relative;
    left: calc(@nav-width + @margin);
    width: calc(100% - @nav-width - @margin);
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
}

@media screen and (max-width: 768px) {
  @nav-width: 50px;
  .header-bar {
    width: @nav-width;
  }
  .main {
    left: calc(@nav-width + @margin);
    width: calc(100% - @nav-width - @margin);
  }
  .el-message {
    width: 90%;
    min-width: 0;
  }
  .el-message-box {
    width: 90%;
  }
}
</style>
