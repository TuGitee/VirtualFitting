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
        :disabled="isloading"
      />
      <div class="virtual-fitting-photo-choose">
        <h3>身高</h3>
        <el-input-number
          v-model="height"
          @change="handleChange"
          :min="0"
          label="height"
          :disabled="!filelist.person.file"
        ></el-input-number>
        <h3>体重</h3>
        <el-input-number
          v-model="weight"
          @change="handleChange"
          :min="0"
          label="weight"
          :disabled="!filelist.person.file"
        ></el-input-number>
        <h3>试穿尺码</h3>
        <el-select
          placeholder="请选择您要试穿的尺码数"
          v-model="sizeVal"
          :disabled="!filelist.person.file"
        >
          <el-option
            v-for="item in size"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <el-progress
        class="virtual-fitting-photo-progress"
        ref="progress"
        :stroke-width="24"
        :percentage="progress"
        :format="formatPercent"
        :color="colors"
        @click.native="Upload"
        @tap.native="Upload"
        type="circle"
        define-back-color="#fff"
        :width="200"
        :status="progressStatus"
      ></el-progress>
    </div>

    <el-dialog :visible.sync="dialogVisible" @close="isBarrage = false">
      <template
        #title
        v-if="typeof createImage !== 'string' && createImage.length !== 1"
      >
        <el-button @click.once="downloadAll" type="primary"
          >批量 <i class="el-icon-download"></i
        ></el-button>
      </template>
      <el-carousel
        v-if="typeof createImage !== 'string' && createImage.length !== 1"
        :initial-index="0"
        height="600px"
        width="80%"
      >
        <el-carousel-item v-for="(item, index) in createImage" :key="index">
          <ImageWithMethod
            :src="item"
            :index="index"
            :options="{ isDownload: true }"
            @change="handleChange"
          ></ImageWithMethod>
        </el-carousel-item>
      </el-carousel>
      <ImageWithMethod
        v-else-if="typeof createImage !== 'string' && createImage.length === 1"
        :src="createImage[0]"
        :options="{ isDownload: true }"
        @change="handleChangeSingle"
      ></ImageWithMethod>
      <ImageWithMethod
        v-else
        :src="createImage"
        :options="{ isDownload: true }"
        @change="handleChangeSingle"
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
import JSZip from "jszip";
import { dataURLtoBlob } from "@/utils/index.js";

export default {
  data() {
    return {
      filelist: {
        person: {},
        clothes: [],
      },
      dialogVisible: false,
      index: 1,
      height: 0,
      weight: 0,
      size: ["S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"],
      sizeVal: "",
      text: "",
      createImage: "",
      isBarrage: false,
      isloading: false,
      isUpload: false,
      progress: 0,
      progressStatus: "",
      colors: [
        { color: "#93aec1", percentage: 20 },
        { color: "#9dbdba", percentage: 40 },
        { color: "#f8b042", percentage: 60 },
        { color: "#ec6a52", percentage: 80 },
        { color: "#f3b7ad", percentage: 100 },
      ],
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
    handleChange(index, url) {
      this.createImage[index] = url;
    },
    handleChangeSingle(index, url) {
      this.createImage[0] = url;
    },
    async downloadAll() {
      var zip = new JSZip();
      for (let url of this.createImage) {
        if (url.includes("base64"))
          zip.file(+new Date() + ".jpg", dataURLtoBlob(url));
        else {
          let res = await fetch(url);
          let blob = await res.blob();
          zip.file(+new Date() + ".jpg", blob);
        }
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        let url = URL.createObjectURL(content);
        let a = document.createElement("a");
        a.href = url;
        a.download = +new Date() + ".zip";
        a.click();
      });
    },
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
        }, 500 * Math.random());
      }
    },
    formatPercent(val) {
      return `${val.toFixed(2)}%`;
    },
    Upload() {
      if (this.isUpload)
        return this.$notify.error({ title: "正在上传中，请稍后" });
      if (this.isloading)
        return this.$notify.error({ title: "正在生成中，请稍后" });
      this.isUpload = true;
      this.$confirm("确定上传图片吗？")
        .then(() => {
          this.submitUpload();
        })
        .catch(() => {
          this.$notify.info({
            title: "已取消上传",
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
      if (!filelist.person.file) {
        this.$notify.error({
          title: "人物图片缺失",
          message: "请上传人物图片（仅允许一张）",
        });
        return;
      } else if (!filelist.clothes.length) {
        this.$notify.error({
          title: "衣服图片缺失",
          title: "请上传至少一张衣服图片",
        });
        return;
      }

      const fileReader = new FileReader();
      const files = [
        filelist.person.file,
        ...filelist.clothes.map((item) => item.file),
      ];

      for (let key in files) {
        let res = await new Promise((resolve) => {
          fileReader.readAsDataURL(files[key]);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
        });
        files[key] = res;
      }
      console.log(files);

      if (this.isloading) return;
      this.isloading = true;
      this.createImage = [];
      this.$ws.send("1$" + files.join("$"));
      this.timer = setInterval(() => {
        this.progress += Math.random()*2 ;
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
        this.$notify.warning({
          title: "历史记录达到上限",
          message: "已替换最远的记录",
        });
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
    receiveImage(evt) {
      const baseURL = "http://192.168.1.115:8000/static/";
      let data = evt.data;
      let url = baseURL + data;
      clearInterval(this.timer);
      this.progress = 100;
      this.dialogVisible = true;
      this.createImage.push(url);
      this.localStore({
        url,
        time: this.formatTime(),
        id: +new Date(),
      });
      setTimeout(() => {
        this.progress = 0;
      }, 1000);
      this.isloading = false;
    },
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
  },
  mounted() {
    this.$bus.$on("uploadPhoto", (type, obj) => {
      if (!type) return;
      if (type === "person") {
        this.filelist.person = obj[0];
        this.height = this.getRandom(158, 180);
        this.weight = this.getRandom(80, 120);
        let index = Math.round(
          (this.height - 165) / 5 + (this.weight - 100) / 20
        );
        this.sizeVal = this.size[index];
      } else {
        this.filelist[type] = obj;
      }
    });
  },
  created() {
    this.$ws.addEventListener("message", this.receiveImage);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.$ws.removeEventListener("message", this.receiveImage);
  },
};
</script>

<style lang="less" scoped>
.virtual-fitting {
  padding: @margin;
  display: flex;
  flex-direction: column;

  &-carousel {
    height: 600px;
    margin-bottom: @margin;
    overflow: hidden;
  }

  &-photo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 300px;
    gap: @margin;

    & > div {
      box-shadow: @box-shadow;
      background-color: @background;
      width: 100%;
      height: 100%;
      border-radius: @margin;
      padding: @margin;
    }

    &-upload {
      &:last-child:not(:first-child) {
        margin-left: @margin;
      }
    }
    &-choose {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      text-align: center;
    }
    &-progress {
      cursor: pointer;
      border: none;
      transition: all 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;

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
    height: 70vh !important;
  }

  /deep/ .white-space {
    display: inline-block;
    width: 10px;
    margin-left: 5px;
    height: 20px;
    background-color: #fff;
    position: absolute;
    bottom: 30px;
    animation: opacity 1s infinite;
  }

  @keyframes opacity {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .el-dialog .el-dialog__body .el-button {
    margin-top: 20px;
  }

  @media screen and (max-width: 768px) {
    height: initial;
    &-photo {
      height: 1440px;
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