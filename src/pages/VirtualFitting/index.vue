<template>
  <el-main class="virtual-fitting main">
    <Carousel
      :list="backgroundList"
      class="virtual-fitting-carousel"
      type="background"
    />

    <div class="virtual-fitting-photo">
      <UploadPhoto
        v-for="(type, index) in Object.keys(filelist)"
        :type="type"
        :key="index"
        :multiple="type === 'clothes'"
        class="virtual-fitting-photo-upload"
      />
    </div>

    <div class="virtual-fitting-upload">
      <el-progress
        class="virtual-fitting-upload-progress"
        ref="progress"
        :text-inside="true"
        :stroke-width="26"
        :percentage="progress"
        :format="formatPercent"
        @click.native="Upload"
        @tap.native="Upload"
      ></el-progress>
    </div>

    <el-dialog :visible.sync="dialogVisible" @close="isBarrage = false">
      <el-carousel
        v-if="typeof createImage !== 'string' && createImage.length !== 1"
        :initial-index="0"
        height="500px"
        width="80%"
      >
        <el-carousel-item v-for="(item, index) in createImage" :key="index">
          <ImageWithMethod
            :src="item"
            :options="{ isDownload: true }"
          ></ImageWithMethod>
        </el-carousel-item>
      </el-carousel>
      <ImageWithMethod
        v-else-if="typeof createImage !== 'string' && createImage.length === 1"
        :src="createImage[0]"
        :options="{ isDownload: true }"
      ></ImageWithMethod>
      <ImageWithMethod
        v-else
        :src="createImage"
        :options="{ isDownload: true }"
      />
      <div class="barrage" v-if="isBarrage" v-html="text"></div>
      <el-button @click="getBarrage" v-if="!isBarrage">生成评价</el-button>
    </el-dialog>
  </el-main>
</template>

<script>
import UploadPhoto from "@/components/UploadPhoto.vue";
import Carousel from "@/components/Carousel.vue";
import axios from "axios";
import ImageWithMethod from "@/components/ImageWithMethod.vue";
export default {
  data() {
    return {
      ws: new WebSocket("ws://192.168.1.115:8000/ws"),
      filelist: {
        person: {},
        clothes: [],
      },
      dialogVisible: false,
      index: 1,
      text: "",
      createImage: "",
      isBarrage: false,
      isloading: false,
      isUpload: false,
      progress: 0,
      timer: null,
      backgroundList: [
        {
          url: "home/1.jpg",
        },
        {
          url: "home/2.jpg",
        },
        {
          url: "home/3.jpg",
        },
        {
          url: "home/4.jpg",
        },
        {
          url: "home/5.jpg",
        },
        {
          url: "home/6.jpg",
        },
        {
          url: "home/7.jpg",
        },
        {
          url: "home/8.jpg",
        },
        {
          url: "home/9.jpg",
        },
        {
          url: "home/10.jpg",
        },
        {
          url: "home/11.jpg",
        },
        {
          url: "home/12.jpg",
        },
        {
          url: "home/13.jpg",
        },
        {
          url: "home/14.jpg",
        },
        {
          url: "home/15.jpg",
        },
      ],
      supportWord: [
        "你的穿搭真的太有创意了！这件衣服非常适合你的身材，让你看起来更加苗条和自信。我喜欢这件衣服的细节，尤其是它的纹理和材质。你穿这件衣服的时候，真的很出众！",
        "你的造型真的太赞了！这件衣服的风格非常适合你的气质和风格。我喜欢它的设计和剪裁，真的很时尚！你穿这件衣服的时候，真的很吸引人！",
        "这件衣服真的让你更加出彩！它的颜色和剪裁真的很适合你的气质和身形。你穿这件衣服的时候，真的很美丽！我也喜欢你搭配的配饰，它们让整个造型更加完美。",
        "你的穿搭真的太有品味了！这件衣服的风格和颜色真的很适合你，让你看起来更加自信和时尚。我也很喜欢你的鞋子和包包，它们和这件衣服很搭配。你真的很有眼光！",
        "你穿这件衣服真的很好看！这种颜色和剪裁真的很适合你的气质。每次看到你穿这件衣服，我都会惊叹于它的美丽。你真的很会搭配，让这件衣服更加出彩！",
        "这件衣服非常适合你的气质和个性，让你看起来更加自信和魅力十足！我喜欢它的颜色和剪裁，非常时尚。你穿这件衣服的时候，真的很出众！",
        "这件衣服的设计非常特别，非常适合你的气质和风格。你穿这件衣服的时候，真的很美丽！我喜欢它的剪裁和纹理，非常精致。你的搭配也很出色，让整个造型更加完美！",
        "这件衣服真的很适合你，让你看起来更加自信和优雅！我喜欢它的颜色和材质，非常优美。你穿这件衣服的时候，真的很有气质！你的搭配也很好，让整个造型更加完美。",
        "你穿这件衣服真的太漂亮了！它的颜色和剪裁非常适合你的身材和气质。每次看到你穿这件衣服，我都会惊叹于它的美丽。你真的很有眼光，让这件衣服更加出彩！",
        "这件衣服真的很适合你的气质和风格，让你看起来更加自信和时尚！我喜欢它的颜色和剪裁，非常精致。你穿这件衣服的时候，真的很出众！",
        "这件衣服真的很美丽，而且非常适合你的身材和气质！它的颜色和剪裁真的很优美，让你看起来更加自信和魅力十足。你的搭配也非常出色，让整个造型更加完美。",
        "你的穿搭真的太有创意了！这件衣服非常适合你的气质和风格，让你看起来更加自信和时尚。我喜欢它的细节和材质，非常精致。你真的很会搭配，让整个造型更加出彩！",
        "这件衣服真的很适合你的身材和气质，让你看起来更加自信和优美！我喜欢它的颜色和剪裁，非常时尚。你穿这件衣服的时候，真的很出众！你的搭配也很出色，让整个造型更加完美。",
        "你穿这件衣服真的太美了！它的颜色和剪裁非常适合你的气质和风格。每次看到你穿这件衣服，我都会被它的美丽所吸引。你真的很有眼光，让这件衣服更加出彩！",
        "这件衣服真的很适合你，让你看起来更加自信和魅力十足！我喜欢它的设计和剪裁，非常精致。你穿这件衣服的时候，真的很美丽！你的搭配也很出色，让整个造型更加完美。",
        "这件衣服真的很美丽，非常适合你的气质和个性！它的颜色和剪裁非常时尚，让你看起来更加自信和出众。你的穿搭非常有品味，让整个造型更加完美。我真的很喜欢你穿这件衣服的样子！",
        "你穿这件衣服真的很漂亮！它的颜色和剪裁非常适合你的身材和气质。你的穿搭非常出色，让整个造型更加时尚。每次看到你穿这件衣服，我都会被它的美丽所吸引！",
        "这件衣服真的很适合你的气质和风格，让你看起来更加自信和美丽！我喜欢它的颜色和剪裁，非常优美。你的搭配也很出色，让整个造型更加完美。你穿这件衣服的时候真的很出众！",
        "你穿这件衣服真的很美！它的颜色和剪裁非常适合你的身材和气质，让你看起来更加自信和魅力十足。你的搭配也很出色，让整个造型更加完美。我真的很喜欢你穿这件衣服的样子！",
        "这件衣服真的很美丽，而且非常适合你的气质和个性！它的颜色和剪裁非常时尚，让你看起来更加自信和出众。你的穿搭非常有品味，让整个造型更加完美。每次看到你穿这件衣服，我都会为它而惊叹！",
        "这件衣服真的很适合你的身材和气质，让你看起来更加自信和美丽！它的颜色和剪裁非常优美，非常适合你的风格。你的穿搭也很出色，让整个造型更加完美。我喜欢你穿这件衣服的样子！",
        "你穿这件衣服真的太漂亮了！它的颜色和剪裁非常适合你的身材和气质，让你看起来更加自信和时尚。你的穿搭非常有品味，让整个造型更加完美。每次看到你穿这件衣服，我都会被它的美丽所吸引！",
        "这件衣服真的很适合你的气质和风格，让你看起来更加自信和美丽！它的颜色和剪裁都非常出色，让整个造型更加时尚。你的穿搭也很有品味，让你看起来更加出众。每次看到你穿这件衣服，我都觉得你很美丽！",
        "你穿这件衣服真的很漂亮！它的颜色和剪裁非常适合你的身材和气质，让你看起来更加自信和出众。你的穿搭也很出色，让整个造型更加完美。我真的很喜欢你穿这件衣服的样子！",
        "这件衣服真的很适合你的气质和风格，让你看起来更加自信和美丽！它的颜色和剪裁非常时尚，非常适合你的身材和气质。你的穿搭也很有品味，让整个造型更加完美。每次看到你穿这件衣服，我都会被它的美丽所吸引！",
        "你穿这件衣服真的很美！它的颜色和剪裁非常适合你的身材和气质，让你看起来更加自信和魅力十足。你的穿搭非常有品味，让整个造型更加完美。我真的很喜欢你穿这件衣服的样子！",
        "这件衣服真的很美丽，而且非常适合你的气质和个性！它的颜色和剪裁非常时尚，让你看起来更加自信和出众。你的穿搭也很出色，让整个造型更加完美。每次看到你穿这件衣服，我都会为它而惊叹！",
        "你穿这件衣服真的很美丽！它的颜色和剪裁非常适合你的身材和气质，让你看起来更加自信和时尚。你的穿搭非常有品味，让整个造型更加完美。每次看到你穿这件衣服，我都觉得你非常漂亮！",
        "这件衣服真的很适合你的气质和风格，让你看起来更加自信和美丽！它的颜色和剪裁非常出色，让整个造型更加时尚。你的穿搭也很出色，让你看起来更加出众。每次看到你穿这件衣服，我都会被它所吸引！",
      ],
    };
  },
  components: {
    ImageWithMethod,
    UploadPhoto,
    Carousel,
  },
  methods: {
    getBarrage() {
      this.isBarrage = true;
      let index = Math.floor(Math.random() * this.supportWord.length);
      this.writeText(index);
    },
    writeText(index) {
      if (this.index > this.supportWord[index].length) {
        this.text = this.supportWord[index];
        this.index = 0;
        return;
      } else {
        let span = document.createElement("span");
        span.className = "white-space";
        this.text =
          this.supportWord[index].slice(0, this.index) + span.outerHTML;
        this.index++;
        setTimeout(() => {
          this.writeText(index);
        }, 100);
      }
    },
    formatPercent(val) {
      return `${val.toFixed(2)}%`;
    },
    Upload() {
      this.isUpload = true;
      this.$confirm("确定上传图片吗？")
        .then(() => {
          this.submitUpload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消上传",
          });
        })
        .finally(() => {
          this.isUpload = false;
        });
    },
    formatTime() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    async submitUpload() {
      const { filelist } = this;
      const ws = this.ws;
      if (!filelist.person.file) {
        this.$message.error("请上传人物图片（仅允许一张）");
        return;
      } else if (!filelist.clothes.length) {
        this.$message.error("请上传至少一张衣服图片");
        return;
      }

      let payload = `${filelist.person.file.name}|`;
      let tmp = [];
      for (let clo of filelist.clothes) {
        tmp.push(clo.file.name);
      }
      payload += tmp.join(",");
      console.log(payload);
      if (this.isloading) return;
      this.isloading = true;
      this.createImage = [];
      ws.send(payload);
      this.timer = setInterval(() => {
        this.progress +=
          Math.random() > 0.5 ? Math.random() / filelist.clothes.length : 0;
        if (this.progress >= 98 + Math.random()) {
          clearInterval(this.timer);
        }
      }, 1000 / 60);
    },
    localStore(
      msg = { url: this.createImage, time: this.formatTime(), id: +new Date() }
    ) {
      let length = JSON.stringify(msg).length;
      try {
        if (!localStorage.getItem("history")) {
          localStorage.setItem("history", JSON.stringify([msg]));
        } else {
          localStorage.setItem(
            "history",
            JSON.stringify([
              msg,
              ...JSON.parse(localStorage.getItem("history")),
            ])
          );
        }
      } catch (err) {
        this.$message.warning("历史记录达到上限！已替换距今最早的图片！");
        let history = JSON.parse(localStorage.getItem("history"));
        let item = history.pop();
        while (JSON.stringify(item).length < length) {
          length -= JSON.stringify(item).length;
          item = history.pop();
        }
        history.unshift(msg);
        localStorage.setItem("history", JSON.stringify(history));
      }
    },
  },
  mounted() {
    this.$bus.$on("uploadPhoto", (type, obj) => {
      if (!type) return;
      if (type === "person") this.filelist.person = obj[0];
      else this.filelist[type] = obj;
    });
  },
  created() {
    let ws = this.ws;
    ws.onopen = (evt) => {
      console.log("Connection establied!");
    };

    ws.onerror = (evt) => {
      this.$message.error("上传失败！");
      this.isloading = false;
      setTimeout(() => {
        this.progress = 0;
      }, 1000);
    };

    ws.onmessage = (evt) => {
      let data = evt.data;
      let fileReader = new FileReader();
      clearInterval(this.timer);
      fileReader.onload = (e) => {
        this.progress = 100;
        this.dialogVisible = true;
        this.createImage.push(e.target.result);
        this.localStore({
          url: e.target.result,
          time: this.formatTime(),
          id: +new Date(),
        });
        this.dialogVisible = true;
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      };

      fileReader.readAsDataURL(data);
      this.isloading = false;
    };
  },
};
</script>

<style lang="less" scoped>
.virtual-fitting {
  padding: @margin;
  display: flex;
  flex-direction: column;
  height: 100vh;

  &-carousel {
    flex: 1;
    margin-bottom: @margin;
    overflow: hidden;
  }

  &-photo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40%;
    margin-bottom: @margin;

    &-upload {
      &:last-child:not(:first-child) {
        margin-left: @margin;
      }
    }
  }

  &-upload {
    width: 100%;
    height: 26px;
    line-height: 26px;
    border: none;
    background-color: @background;
    border-radius: @margin;
    font-weight: 700;
    color: #e4b0f4;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 20px -10px #e4b0f4;

    &::after {
      content: "点击此处上传到服务器";
    }
    &-progress {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      border: none;
      border-radius: @margin;
      transition: all 0.3s;
      /deep/ .el-progress-bar__outer {
        background: transparent !important;
      }
      /deep/ .el-progress-bar__inner {
        background: linear-gradient(90deg, #ffffff00, #4a249bff);
        &Text {
          color: @white !important;
        }
      }
    }
  }

  .barrage {
    position: absolute;
    bottom: 30px;
    left: 20px;
    width: calc(100% - 40px);
    height: auto;
    background: linear-gradient(0deg, #0004, #000a);
    border-radius: @margin @margin 10px 10px;
    overflow: hidden;
    z-index: 99;
    color: white;
    font-size: 20px;
    line-height: 1.5;
    text-indent: 2em;
    padding: 25px;
    text-align: left;
  }

  /deep/ .el-carousel__container {
    height: 700px !important;
  }

  /deep/ .white-space {
    display: inline-block;
    width: 10px;
    margin-left: 5px;
    height: 20px;
    background-color: #fffa;
    position: absolute;
    bottom: 30px;
  }

  .el-dialog .el-button {
    margin-top: 20px;
  }

  @media screen and (max-width: 768px) {
    height: initial;
    &-photo {
      height: 628px;
      &-upload {
        &:last-child:not(:first-child) {
          margin-top: @margin;
          margin-left: 0;
        }
      }

      flex-direction: column;
    }
  }
}
</style>