<template>
  <el-container id="app" direction="vertical">
    <canvas id="stars">版本浏览器过低，请使用chrome浏览器！</canvas>
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
      this.$axios.post("");
    };
    this.$ws.onerror = (evt) => {
      this.$message.error("连接失败");
    };

    

    function straightLine(ctx, fromX, fromY, toX, toY, color, width) {
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.closePath();
    }
    const stars = document.querySelector("#stars");
    const ctxStars = stars.getContext("2d");
    stars.width = window.innerWidth - 1;
    stars.height = window.innerHeight - 1;
    window.addEventListener("resize", () => {
      this.$nextTick(() => {
        stars.width = window.innerWidth - 1;
        stars.height = window.innerHeight - 1;
      });
    });
    let height = stars.height;
    let width = stars.width;
    let star = 100;
    let starList = [];
    function newStar(fromX, fromY) {
      let x = fromX || Math.random() * width;
      let y = fromY || Math.random() * height;
      let move = Math.random() / 10;
      let starItem = { x, y, move };
      return starItem;
    }
    for (let i = 0; i < star; i++) {
      starList[i] = newStar();
    }
    setInterval(() => {
      ctxStars.clearRect(0, 0, width, height);
      for (let i = 0; i < starList.length; i++) {
        starList[i].x -= starList[i].move;
        ctxStars.beginPath();
        ctxStars.arc(starList[i].x, starList[i].y, 1, 0, 2 * Math.PI);
        ctxStars.fillStyle = "white";
        ctxStars.fill();
        ctxStars.closePath();
        if (starList[i].x <= 0) {
          starList[i] = newStar(width);
        }
      }
    }, 15);
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
    height: 0;
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
  #stars {
    position: absolute;
    display: block;
  }
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
