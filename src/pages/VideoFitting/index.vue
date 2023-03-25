<template>
  <el-main class="video-fitting main">
    <canvas id="try-on"></canvas>
  </el-main>
</template>

<script>
export default {
  name: "VideoFitting",
  data() {
    return {
      timer: null,
    };
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

    let video = document.createElement("video");
    let canvas = document.getElementById("try-on");
    let ctx = canvas.getContext("2d");
    canvas.width = document.querySelector(".video-fitting").offsetWidth;
    canvas.height = document.querySelector(".video-fitting").offsetHeight;

    //成功回调
    function success(stream) {
      video.srcObject = stream;
      video.play();
      this.timer = setInterval(() => {
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
    clearInterval(this.timer);
    this.timer = null;
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

  #try-on {
    width: 80%;
    min-width: 300px;
    height: 100%;
    border-radius: 20px;
    background-color: #fff5;
    transform: rotateY(180deg);
  }
}
</style>