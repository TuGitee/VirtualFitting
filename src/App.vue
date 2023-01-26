<template>
  <el-container id="app" direction="vertical">
    <HeaderBar />
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

  a {
    text-decoration: none;
  }

  img[src=""],
  img:not([src]) {
    opacity: 0;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    &-track {
      background-color: #eee;
    }
    &-thumb {
      background-color: #ccc;
      border-radius: 10px;
    }
  }

  .main {
    position: relative;
    top: 60px;
  }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
