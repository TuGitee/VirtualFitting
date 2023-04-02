<template>
  <el-main class="main">
    <router-link to="/virtual-fitting" class="main-title" title="点击进入">虚拟试衣</router-link>
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
  mounted() {
    document.querySelector(".main-title").style.backgroundPositionY = "-300px";
    document.querySelector(".main-title").addEventListener("wheel", (e) => {
      let y = e.target.style.backgroundPositionY
        ? parseInt(e.target.style.backgroundPositionY)
        : 0;
      if (
        (y <= -500 && e.deltaY > 0) ||
        (y >= 0 && e.deltaY < 0) ||
        (y < 0 && y > -500)
      ) {
        e.target.style.backgroundPositionY = y + e.deltaY + "px";
        e.target.style.backgroundPositionX =
          e.deltaY * Math.random() + 70 + "px";
      }
    });
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
    background: url("@/assets/photo.png") no-repeat top left;
    background-clip: text;
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