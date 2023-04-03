<template>
  <el-main class="main">
    <router-link
      to="/virtual-fitting"
      class="main-title"
      title="点击进入"
      @wheel.native="handleWheel"
    >
      虚拟试衣</router-link
    >
    <div class="loader">
      <div>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
export default {
  methods: {
    handleWheel(e) {
      let y = e.target.style.backgroundPositionY
        ? parseInt(e.target.style.backgroundPositionY)
        : -50;
      let x = e.target.style.backgroundPositionX
        ? parseInt(e.target.style.backgroundPositionX)
        : -50;
      if (
        (y <= -100 && e.deltaY > 0) ||
        (y >= 0 && e.deltaY < 0) ||
        (y < 0 && y > -100)
      ) {
        y = y + (e.deltaY * Math.random()) / 10;
        e.target.style.backgroundPositionY =
          (y < 0 ? (y < -100 ? -100 : y) : 0) + "vh";
        x = x - (e.deltaY * Math.random()) / 10;
        e.target.style.backgroundPositionX =
          (x < 0 ? (x < -100 ? -100 : x) : 0) + "vw";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  left: 0;
  width: 100%;
  height: 100vh;

  &-title {
    transition: all 0.5s;
    position: absolute;
    line-height: 1;
    width: 100%;
    left: 50%;
    top: 50%;
    filter: drop-shadow(0px 0px 10px #fffa);
    background: url("@/assets/photo.png") no-repeat -50vw -50vh;
    background-clip: text;
    background-size: 200vw 200vh;
    white-space: nowrap;
    color: transparent;
    transform: translate(-50%, -50%);
    font-size: 200px;
    letter-spacing: 40px;
    font-weight: 900;
  }

  .loader {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 400px;
    height: 400px;
    display: block;
    z-index: -1;
    overflow: hidden;
    border-radius: 50%;
    padding: 8px;
    border: 2px solid transparent;
    animation: rotate linear 3.5s infinite;
    border-top-color: #fff5;
    border-bottom-color: @color;
    div {
      height: 100%;
      border-radius: 50%;
      padding: 8px;
      border: 2px solid transparent;
      animation: rotate linear 3.5s infinite;
      border-top-color: #fff5;
      border-bottom-color: @color;
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>