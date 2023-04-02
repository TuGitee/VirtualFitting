<template>
  <el-main class="video-fitting main">
    <div class="video-fitting-video">
      <div class="video-fitting-video-canvas">
        <canvas id="try-on"></canvas>
      </div>
      <el-button @click="snap" class="video-fitting-video-button">
        <i class="el-icon-camera-solid"></i>
      </el-button>
    </div>

    <div class="video-fitting-side">
      <ImageWithMethod :src="preImg" :options="{ isDownload: true }" />
      <b>上一次拍摄的图片</b>
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
    };
  },
  methods: {
    snap() {
      let canvas = document.getElementById("try-on");
      this.preImg = canvas.toDataURL("image/png");
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
      const width = box.offsetWidth;
      const height = box.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      if (
        navigator.mediaDevices.getUserMedia ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      ) {
        getUserMedia({ video: { width, height } }, success, error);
      } else {
        alert("不支持");
      }
    }

    init();

    function success(stream) {
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {
        video.play();
        timer = setInterval(() => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (!that.clothes.file) return;
          canvas.toBlob((blob) => {
            const file = new File([blob], +new Date(), {
              type: "image/png",
            });
            // 发送请求
            const formData = new FormData();
            formData.append("personImage", file);
            formData.append("clothesImage", that.clothes);
          });
        }, 1000 / 60);
      };
    }

    function error(error) {
      console.log("访问用户媒体失败");
    }
  },
  beforeDestroy() {
    clearInterval(timer);
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
  height: 100vh;

  &-video {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    min-width: 200px;
    &-canvas {
      flex: 1;
      overflow: hidden;
      border-radius: @margin;
      height: 100%;
      width: 100%;
      #try-on {
        background-color: @background;
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
    margin-left: @margin;
    padding-bottom: 60px;
    width: 500px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
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

    /deep/ & > .image-method-box {
      height: 340px;
      width: 340px;
      .normal img {
        object-fit: cover !important;
        transform: rotateY(180deg);
      }
    }

    /deep/ .image-method-box__actions {
      font-size: 40px;
    }

    b {
      color: @white;
      margin: @margin;
    }
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    height: initial;
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