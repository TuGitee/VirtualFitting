<template>
  <el-main class="main">
    <div class="main-title">
      <div class="main-title-text">
        <h4 class="main-title-text-en">Virtual Fitting.</h4>
        <h1 class="main-title-text-cn">云裳</h1>
        <h6 class="main-title-text-subtitle">
          ——基于计算机视觉的多功能虚拟试衣
        </h6>
        <p class="main-title-text-note">
          虚拟试衣应用是一种基于计算机视觉技术的应用程序，通过使用摄像头或上传照片的方式，让用户可以在线上试穿服装。用户可以选择上传自己的不同姿态的照片以及不同的衣服款式、颜色和尺码，在应用程序中查看自己穿上衣服的效果。
        </p>
        <button class="main-title-text-button" @click="start">START</button>
      </div>
    </div>
  </el-main>
</template>

<script>
export default {
  methods: {
    start() {
      this.$router.push("/virtual-fitting");
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: calc(100vh - @nav-height);
  overflow: hidden;
  position: relative;
  display: flex;

  &::after {
    content: "";
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -99999;
    background: url("@/assets/bg_3.png") no-repeat center center;
    background-size: cover;
  }

  &-title {
    margin: @margin calc(@margin * 3);
    text-align: left;
    height: fit-content;
    width: fit-content;
    max-width: 50vw;
    transition: all 0.5s;
    filter: contrast(10);
    white-space: nowrap;
    animation: contrast 2s forwards;
    @keyframes contrast {
      100% {
        filter: none;
      }
    }

    &-text {
      position: relative;

      &-cn {
        letter-spacing: 40px;
        font-weight: 900;
        color: @white;
        animation: hunhe 2s forwards;
        text-shadow: 1px 0.5px 0px #0220c700, 2px 1px 0px #0220c711,
          3px 1.5px 0px #0220c722, 4px 2px 0px #0220c733,
          5px 2.5px 0px #0220c744, 6px 3px 0px #0220c755,
          7px 3.5px 0px #0220c766, 8px 4px 0px #0220c777,
          9px 4.5px 0px #0220c788, 10px 5px 0px #0220c799,
          11px 5.5px 0px #0220c7a0, 12px 6px 0px #0220c7a1,
          13px 6.5px 0px #0220c7a2, 14px 7px 0px #0220c7a3,
          15px 7.5px 0px #0220c7a4, 16px 8px 0px #0220c7a5,
          17px 8.5px 0px #0220c7a6, 18px 9px 0px #0220c7a7,
          19px 9.5px 0px #0220c7a8, 20px 10px 0px #0220c7a9,
          21px 10.5px 0px #0220c7aa, 22px 11px 0px #0220c7ab,
          23px 11.5px 0px #0220c7ac, 24px 12px 0px #0220c7ad,
          25px 12.5px 0px #0220c7ae, 26px 13px 0px #0220c7af;
        font-size: 200px;
        margin-top: @margin;
        line-height: 1;
      }

      &-en {
        letter-spacing: 5px;
        font-weight: 900;
        background-clip: text;
        background-size: 200vw 200vh;
        text-shadow: 0.5px 0.5px 0px #0220c700, 1px 1px 0px #0220c722,
          1.5px 1.5px 0px #0220c744, 2px 2px 0px #0220c766,
          2.5px 2.5px 0px #0220c788, 3px 3px 0px #0220c7a0,
          3.5px 3.5px 0px #0220c7b2, 4px 4px 0px #0220c7c3,
          4.5px 4.5px 0px #0220c7d4, 5px 5px 0px #0220c7e5;
        color: @white;
        font-size: 50px;
      }

      &-subtitle {
        margin-top: calc(@margin * 2);
        text-indent: 2em;
        font-weight: 700;
        text-align: right;
         letter-spacing: 5px;
         color: @white;
         text-shadow: 0.5px 0.5px 0px #0220c700, 1px 1px 0px #0220c722,
          1.5px 1.5px 0px #0220c744, 2px 2px 0px #0220c766,
          2.5px 2.5px 0px #0220c788, 3px 3px 0px #0220c7a0,
          3.5px 3.5px 0px #0220c7b2, 4px 4px 0px #0220c7c3,
          4.5px 4.5px 0px #0220c7d4, 5px 5px 0px #0220c7e5;
          font-size: 30px;
      }

      &-note {
        margin-top: calc(@margin * 2);
        text-indent: 2em;
        white-space: break-spaces;
        color: grey;
        font-size: 16px;
        position: relative;
      }

      &-button {
        letter-spacing: 5px;
        font-weight: 900;
        text-shadow: 5px 5px 0px #0220c7;
        color: @white;
        font-size: 20px;
        border: none;
        outline: none;
        background: @black;
        cursor: pointer;
        line-height: 1;
        padding: @margin;
        border-radius: 999px;
        margin-top: 20px;
        transition: all 0.5s;
        &:hover {
          box-shadow: @box-shadow;
        }
      }

      @keyframes hunhe {
        0% {
          filter: blur(10px);
          letter-spacing: -100px;
          font-size: 12px;
        }
        100% {
          filter: blur(0px);
        }
      }
    }
  }
}
</style>