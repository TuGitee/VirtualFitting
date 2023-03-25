<template>
  <el-main class="video-fitting main">
    <div class="video-fitting-video">
      <canvas id="try-on"></canvas>
      <el-button @click="snap" class="video-fitting-video-button">
        <i class="el-icon-camera-solid"></i>
      </el-button>
    </div>

    <div class="video-fitting-side">
      <ImageWithMethod :src="preImg" />
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
    window.addEventListener("resize", () => {
      canvas.width = document.querySelector(".video-fitting").offsetWidth;
      canvas.height = document.querySelector(".video-fitting").offsetHeight;
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

    let canvas = document.getElementById("try-on");
    let ctx = canvas.getContext("2d");
    canvas.width = document.querySelector(".video-fitting").offsetWidth;
    canvas.height = document.querySelector(".video-fitting").offsetHeight;

    //成功回调
    function success(stream) {
      video.srcObject = stream;
      video.onloadedmetadata = function (e) {
        video.play();
        timer = setInterval(() => {
          // 图像按照比例缩放，不要变形
          let scale = Math.max(
            canvas.width / video.videoWidth,
            canvas.height / video.videoHeight
          );
          let width = video.videoWidth * scale;
          let height = video.videoHeight * scale;
          // 计算图片绘制到画布上的位置
          let x = (canvas.width - width) / 2;
          let y = (canvas.height - height) / 2;
          ctx.drawImage(video, x, y, width, height);
        }, 1000 / 60);
      };
    }
    //失败回调
    function error(error) {
      console.log("访问用户媒体失败");
    }
    //开启摄像头
    if (
      navigator.mediaDevices.getUserMedia ||
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    ) {
      getUserMedia({ video: { width: 500, height: 500 } }, success, error);
    } else {
      alert("不支持");
    }
  },
  beforeDestroy() {
    clearInterval(timer);
  },
};
</script>

<style lang="less" scoped>
.video-fitting {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  min-width: 340px;

  &-video {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    #try-on {
      flex: 1;
      width: 100%;
      min-width: 300px;
      height: 100%;
      border-radius: 20px;
      background-color: #fff5;
      transform: rotateY(180deg);
    }
    &-button {
      margin-top: 20px;
      height: 40px;
      padding: 0 20px;
      /deep/ .el-icon-camera-solid {
        font-size: 20px;
      }
    }
  }

  &-side {
    margin-left: 20px;
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
      height: 240px;
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
      color: white;
    }
  }
}
</style>