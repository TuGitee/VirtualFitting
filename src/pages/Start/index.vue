<template>
  <el-main class="main" @wheel.native="handleWheel">
    <div class="main-title">
      <router-link
        to="/virtual-fitting"
        class="main-title-text"
        title="点击进入"
        :style="backgroundStyle"
        data-text="虚拟试衣"
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
      position: relative;
      transition: all .5s;
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

      &:hover::before {
        transition: all .5s;
        content: attr(data-text);
        position: absolute;
        left: -2px;
        top: 2px;
        color: transparent;
        width: 100%;
        height: 100%;
        font-size: 200px;
        background: url("@/assets/bg.png") #f00;
        background-blend-mode: darken;
        background-clip: text;
        letter-spacing: 40px;
        font-weight: 900;
        filter: contrast(20);
        animation: animation-before 3s forwards infinite;
      }
      &:hover::after {
        transition: all .5s;
        content: attr(data-text);
        position: absolute;
        left: 2px;
        top: -2px;
        width: 100%;
        height: 100%;
        background: url("@/assets/bg.png") #0ff;
        background-blend-mode: lighten;
        background-clip: text;
        filter: contrast(20);
        color: transparent;
        font-size: 200px;
        letter-spacing: 40px;
        font-weight: 900;
        animation: animation-after 3s forwards infinite;
      }

      @keyframes animation-before {
        0% {
          left: 2px;
          clip-path: inset(0 0 0 0);
        }

        5% {
          clip-path: inset(0.8em 0 0.4em 0);
        }

        10% {
          clip-path: inset(0.4em 0 0.8em 0);
        }

        15% {
          clip-path: inset(0.1em 0 1em 0);
        }

        20% {
          clip-path: inset(0.3em 0 0.6em 0);
        }

        25% {
          left: -4px;
          clip-path: inset(0.6em 0 0.3em 0);
        }

        30% {
          clip-path: inset(0.8em 0 0.5em 0);
        }

        35% {
          clip-path: inset(1em 0 0.1em 0);
        }

        40% {
          clip-path: inset(0.7em 0 0.35em 0);
        }

        45% {
          clip-path: inset(0.5em 0 0.2em 0);
        }

        50% {
          left: 6px;
          clip-path: inset(0.2em 0 0.5em 0);
        }

        55% {
          clip-path: inset(0.35em 0 0.7em 0);
        }

        60% {
          clip-path: inset(0.1em 0 0.9em 0);
        }

        65% {
          clip-path: inset(0.8em 0 0.46em 0);
        }

        70% {
          clip-path: inset(0.66em 0 0.33em 0);
        }

        75% {
          left: 4px;
          clip-path: inset(0.48em 0 0.23em 0);
        }

        80% {
          clip-path: inset(0.23em 0 0.48em 0);
        }

        85% {
          clip-path: inset(0.39em 0 0.79em 0);
        }

        90% {
          clip-path: inset(0.33em 0 0.66em 0);
        }

        95% {
          clip-path: inset(1em 0 0.3em 0);
        }

        100% {
          left: -2px;
          clip-path: inset(0.62em 0 0.29em 0);
        }
      }
      @keyframes animation-after {
        0% {
          left: -2px;
          clip-path: inset(0 0 0 0);
        }

        5% {
          clip-path: inset(0.4em 0 0.8em 0);
        }

        10% {
          clip-path: inset(0.8em 0 0.4em 0);
        }

        15% {
          clip-path: inset(1em 0 0.1em 0);
        }

        20% {
          clip-path: inset(0.6em 0 0.3em 0);
        }

        25% {
          left: 4px;
          clip-path: inset(0.3em 0 0.6em 0);
        }

        30% {
          clip-path: inset(0.5em 0 0.8em 0);
        }

        35% {
          clip-path: inset(0.1em 0 1em 0);
        }

        40% {
          clip-path: inset(0.35em 0 0.7em 0);
        }

        45% {
          clip-path: inset(0.2em 0 0.5em 0);
        }

        50% {
          left: -6px;
          clip-path: inset(0.5em 0 0.2em 0);
        }

        55% {
          clip-path: inset(0.7em 0 0.35em 0);
        }

        60% {
          clip-path: inset(0.9em 0 0.1em 0);
        }

        65% {
          clip-path: inset(0.46em 0 0.8em 0);
        }

        70% {
          clip-path: inset(0.3em 0 0.66em 0);
        }

        75% {
          left: 4px;
          clip-path: inset(0.23em 0 0.48em 0);
        }

        80% {
          clip-path: inset(0.48em 0 0.23em 0);
        }

        85% {
          clip-path: inset(0.79em 0 0.39em 0);
        }

        90% {
          clip-path: inset(0.66em 0 0.33em 0);
        }

        95% {
          clip-path: inset(0.3em 0 1em 0);
        }

        100% {
          left: -2px;
          clip-path: inset(0.29em 0 0.62em 0);
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