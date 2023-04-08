<template>
  <el-main class="main" @wheel.native="handleWheel">
    <div class="main-title">
      <router-link
        to="/virtual-fitting"
        class="main-title-text"
        title="点击进入"
        :style="backgroundStyle"
      >
        虚拟试衣</router-link
      >
    </div>
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
  data() {
    return {
      x: -50,
      y: -50,
      max: 0,
      min: -100,
      timer: null,
      flag: false,
      speedX: Math.random() - 0.5,
      speedY: Math.random() - 0.5,
    };
  },
  methods: {
    handleWheel(e) {
      if (this.flag) return;
      this.flag = true;
      setTimeout(() => {
        if (
          (this.y <= this.min && e.deltaY > 0) ||
          (this.y >= this.max && e.deltaY < 0) ||
          (this.y < this.max && this.y > this.min)
        ) {
          this.y = this.formatAxias(this.y + (e.deltaY * Math.random()) / 10);
          this.x = this.formatAxias(this.x - (e.deltaY * Math.random()) / 10);
        }
        this.flag = false;
      }, 1000 / 30);
    },
    formatAxias(n) {
      return n < this.max ? (n < this.min ? this.min : n) : this.max;
    },
    animation() {
      if (this.x >= this.max || this.x <= this.min) this.speedX = -this.speedX;
      if (this.y >= this.max || this.y <= this.min) this.speedY = -this.speedY;
      this.y = this.formatAxias(this.y + this.speedY / 10);
      this.x = this.formatAxias(this.x + this.speedX / 10);
    },
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundPosition: `${this.x}vw  ${this.y}vh`,
      };
    },
  },
  created() {
    this.timer = setInterval(() => {
      this.animation();
    }, 1000 / 60);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
.main {
  left: 0;
  width: 100%;
  height: 100vh;

  &-title {
    position: absolute;
    left: 50%;
    top: 50%;
    height: fit-content;
    width: fit-content;
    transition: all 0.5s;
    transform: translate(-50%, -50%);
    filter: drop-shadow(0px 0px 10px #fffa) contrast(100);
    white-space: nowrap;
    animation: contrast 3s forwards;
    @keyframes contrast {
      100% {
        filter: drop-shadow(0px 0px 10px #fffa);
      }
    }

    &-text {
      background: url("@/assets/bg.png") no-repeat -50vw -50vh;
      background-clip: text;
      background-size: 200vw 200vh;
      color: transparent;
      font-size: 200px;
      letter-spacing: 40px;
      font-weight: 900;
      filter: blur(10px);
      animation: hunhe 3s forwards;
      @keyframes hunhe {
        0% {
          filter: blur(10px);
          letter-spacing: -100px;
          font-size: 12px;
        }
        100% {
          filter: blur(0px);
          letter-spacing: 40px;
          font-size: 200px;
        }
      }
    }
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