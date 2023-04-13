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
          v-for="(item, index) in snapList.slice(now)"
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
      <UploadPhoto type="clothes" :style="snapList.length ? '' : 'flex:1'" />
    </div>
  </el-main>
</template>

<script>
import UploadPhoto from "@/components/UploadPhoto";
import ImageWithMethod from "@/components/ImageWithMethod";
export default {
  name: "VideoFitting",
  data() {
    return {
      canvas: null,
      canvasImage: null,
      video: null,
      timer: null,
      imgHeight: 1024,
      imgWidth: 768,
      preImg: "",
      clothes: {},
      now: 0,
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
  computed: {
    ctx() {
      return this.canvas.getContext("2d");
    },
    ctxImage() {
      return this.canvasImage.getContext("2d");
    },
  },
  methods: {
    snap() {
      if (this.snapList.length) {
        this.now = 1;
      }
      this.preImg = this.canvas.toDataURL("image/png");
      this.localStore({
        url: this.preImg,
        id: +new Date(),
      });
      this.now = 1;
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
    receiveImage(evt) {
      const ctx = this.canvas.getContext("2d");
      const fr = new FileReader();
      fr.readAsDataURL(evt.data);
      fr.onload = (e) => {
        let img = new Image();
        img.src = e.target.result;
        img.onload = (e) => {
          console.log(img);
          ctx.drawImage(img, 0, 0, this.imgWidth, this.imgHeight);
          this.sendVideoImage();
        };
      };
    },
    getUserMedia(constraints, success, error) {
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
    },
    init() {
      this.canvas = document.getElementById("try-on");
      this.canvasImage = document.createElement("canvas");
      this.canvas.height = this.canvasImage.height = this.imgHeight;
      this.canvas.width = this.canvasImage.width = this.imgWidth;
      if (
        navigator.mediaDevices.getUserMedia ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      ) {
        this.getUserMedia(
          { video: { width: "auto", height: "auto" } },
          this.success,
          this.error
        );
      } else {
        this.$message.error("不支持摄像头！");
      }
    },
    success(stream) {
      this.video = document.createElement("video");
      this.video.srcObject = stream;
      this.video.onloadedmetadata = (e) => {
        this.video.play();
        this.sendVideoImage();
      };
    },
    error(error) {
      that.$message.error("访问用户媒体失败");
    },
    sendVideoImage() {
      const width = this.imgWidth;
      const height = this.imgHeight;
      const { videoWidth, videoHeight } = this.video;
      const scale = Math.max(width / videoWidth, height / videoHeight);
      const x = (width - videoWidth * scale) / 2;
      const y = (height - videoHeight * scale) / 2;

      if (this.clothes.file) {
        this.ctxImage.drawImage(
          this.video,
          0,
          0,
          videoWidth,
          videoHeight,
          x,
          y,
          videoWidth * scale,
          videoHeight * scale
        );
        const fr = new FileReader();
        fr.readAsDataURL(this.clothes.file);
        fr.onload = (e) => {
          setTimeout(() => {
            this.$ws.send(
              `0$${this.canvasImage.toDataURL("image/png")}$${e.target.result}`
            );
          }, 1000);
        };
      } else {
        this.ctx.drawImage(
          this.video,
          0,
          0,
          videoWidth,
          videoHeight,
          x,
          y,
          videoWidth * scale,
          videoHeight * scale
        );
        setTimeout(() => {
          this.sendVideoImage();
        }, 1000 / 24);
      }
    },
  },
  components: {
    UploadPhoto,
    ImageWithMethod,
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy() {
    this.video.srcObject?.getTracks()[0].stop();
  },
  created() {
    this.$bus.$on("uploadPhoto", (type, obj) => {
      this.clothes = obj[0];
    });
    this.$ws.addEventListener("message", this.receiveImage);
  },
  beforeDestroy() {
    this.$ws.removeEventListener("message", this.receiveImage);
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
          transform: rotateY(180deg);
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
      height: 500px;
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