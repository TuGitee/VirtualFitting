<template>
  <el-main class="video-fitting main">
    <div class="video-fitting-pre">
      <ImageWithMethod :src="preImg" :options="{ isDownload: true }" />
      <b>上一次拍摄的图片</b>
    </div>

    <div class="video-fitting-video">
      <div class="video-fitting-video-canvas">
        <canvas id="try-on"></canvas>
      </div>
      <el-button @click="snap" class="video-fitting-video-button">
        <i class="el-icon-camera-solid"></i>
      </el-button>
    </div>

    <div class="video-fitting-side">
      <swiper
        class="swiper gallery-thumbs"
        :options="swiperOptionThumbs"
        ref="swiperThumbs"
        v-if="snapList.length"
      >
        <swiper-slide
          class="swiper-slide"
          v-for="(item, index) in snapList"
          :data-value="item.id"
          :key="index"
        >
          <ImageWithMethod
            :src="item.url"
            :options="{ isDownload: true, isDelete: true }"
            :index="index"
            @handleRemove="deleteItem"
          />
        </swiper-slide>
      </swiper>
      <UploadPhoto type="clothes" />
    </div>
  </el-main>
</template>

<script>
let timer = null;
let video = document.createElement("video");
import UploadPhoto from "@/components/UploadPhoto";
import ImageWithMethod from "@/components/ImageWithMethod";
export default {
  name: "VideoFitting",
  data() {
    return {
      preImg: "",
      clothes: {},
      snapList: JSON.parse(localStorage.getItem("snap")) || [],
      swiperOptionThumbs: {
        direction: "horizontal",
        mousewheel: true,
        spaceBetween: 20,
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        touchRatio: 0.1,
        slideToClickedSlide: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      },
    };
  },
  methods: {
    snap() {
      let canvas = document.getElementById("try-on");
      this.preImg = canvas.toDataURL("image/png");
      this.localStore({
        url: this.preImg,
        id: +new Date(),
      });
    },
    deleteItem(index) {
      this.snapList.splice(index, 1);
      localStorage.setItem("snap", JSON.stringify(this.snapList));
    },
    localStore(msg = { url: this.createImage, id: +new Date() }) {
      let length = JSON.stringify(msg).length;
      try {
        if (!localStorage.getItem("snap")) {
          localStorage.setItem("snap", JSON.stringify([msg]));
        } else {
          localStorage.setItem(
            "snap",
            JSON.stringify([msg, ...JSON.parse(localStorage.getItem("snap"))])
          );
        }
      } catch (err) {
        this.$message.warning("历史记录达到上限！已替换距今最早的图片！");
        let snap = JSON.parse(localStorage.getItem("snap"));
        let item = snap.pop();
        while (JSON.stringify(item).length < length) {
          length -= JSON.stringify(item).length;
          item = snap.pop();
        }
        snap.unshift(msg);
        localStorage.setItem("snap", JSON.stringify(snap));
      }
      this.snapList = JSON.parse(localStorage.getItem("snap"));
    },
  },
  components: {
    UploadPhoto,
    ImageWithMethod,
  },
  mounted() {
    const that = this;
    const canvas = document.getElementById("try-on");
    const ctx = canvas.getContext("2d");
    const box = document.querySelector(".video-fitting-video-canvas");

    window.addEventListener("resize", () => {
      init();
    });

    function getUserMedia(constraints, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(success)
          .catch(error);
      } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia(constraints, success, error);
      } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia(constraints, success, error);
      } else if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, success, error);
      }
    }

    function init() {
      const width = 768;
      const height = 1024;
      canvas.width = width;
      canvas.height = height;
      if (
        navigator.mediaDevices.getUserMedia ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      ) {
        getUserMedia(
          { video: { width: "auto", height: "auto" } },
          success,
          error
        );
      } else {
        that.$message.error("不支持摄像头！");
      }
    }

    init();

    function success(stream) {
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {
        video.play();
        timer = setInterval(() => {
          const width = canvas.width;
          const height = canvas.height;
          const { videoWidth, videoHeight } = video;
          const scale = Math.max(width / videoWidth, height / videoHeight);
          const x = (width - videoWidth * scale) / 2;
          const y = (height - videoHeight * scale) / 2;
          ctx.drawImage(
            video,
            0,
            0,
            videoWidth,
            videoHeight,
            x,
            y,
            videoWidth * scale,
            videoHeight * scale
          );
        }, 1000 / 60);
      };
    }

    function error(error) {
      that.$message.error("访问用户媒体失败");
    }
  },
  beforeDestroy() {
    clearInterval(timer);
    video.srcObject?.getTracks()[0].stop();
  },
  created() {
    this.$bus.$on("uploadPhoto", (type, obj) => {
      this.clothes = obj[0];
    });
  },
};
</script>

<style lang="less" scoped>
.video-fitting {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: @margin;
  height: calc(100vh - @margin * 2 - @nav-height);
  width: calc(100% - @margin * 2);
  padding: @margin;
  background-color: @background;
  border-radius: @margin;
  box-shadow: @box-shadow;
  gap: @margin;

  &::after {
    content: "";
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -99999;
    background: url("@/assets/bg_1.png") no-repeat center center;
    background-size: cover;
  }
  &-pre {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    /deep/ & > .image-method-box {
      
      box-shadow: @box-shadow-light;
      .normal img {
        object-fit: cover !important;
        transform: rotateY(180deg);
      }
    }

    b {
      display: block;
      color: @font;
      margin: @margin;
    }
  }

  &-video {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: fit-content;
    min-width: 200px;
    border-radius: @margin;
    &-canvas {
      flex: 1;
      overflow: hidden;
      border-radius: @margin;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      #try-on {
        background-color: @background;
        border-radius: @margin;
        transform: rotateY(180deg);
      }
    }

    &-button {
      margin-top: @margin;
      height: 40px;
      padding: 0 @margin;
      /deep/ .el-icon-camera-solid {
        font-size: 20px;
      }
    }
  }

  &-side {
    padding-bottom: 60px;
    width: 400px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;

    .swiper {
      margin: 0 0 @margin 0 !important;
      height: 100%;
      width: 100%;
      box-shadow: @box-shadow-light;
      &.gallery-thumbs {
        padding: @margin;
        background-color: @background;
        border-radius: @margin;
        .swiper-slide {
          height: 100%;
          width: 100%;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: @margin;
          }
          &-active {
            opacity: 1;
          }
        }
      }
    }

    /deep/ .upload-demo {
      width: 100%;
      height: 360px;
      .item {
        height: 100%;
        div {
          height: 100%;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    height: initial;
    .swiper {
      display: none;
    }
    &-video {
      height: 500px;
    }
    &-side {
      margin-left: 0;
      margin-top: @margin;
      padding-bottom: 0;
      width: 100%;
      flex-direction: column-reverse;
      /deep/ & > .image-method-box {
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>