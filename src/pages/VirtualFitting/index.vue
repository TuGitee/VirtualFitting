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
        :text-inside="true"
        :stroke-width="26"
        :percentage="progress"
        :format="formatPercent"
        @click.native="Upload"
        @tap.native="Upload"
      ></el-progress>
    </div>

      <el-dialog :visible.sync="dialogVisible">
          <el-carousel
                  v-if="createImage.length !== 1"
                  :initial-index="0"
                  height="500px"
                  width="80%"
          >
              <el-carousel-item v-for="(item, index) in createImage" :key="index">
                  <ImageWithMethod :src="item" :options="{ isDownload: true }"></ImageWithMethod>
              </el-carousel-item>
          </el-carousel>
          <ImageWithMethod
                  v-else-if="createImage.length === 1"
                  :src="createImage[0]"
                  :options="{ isDownload: true }"
          ></ImageWithMethod>
          <ImageWithMethod
                  v-else
                  :src="createImage"
                  :options="{ isDownload: true }"
          />
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
      createImage: "",
      isloading: false,
      isUpload: false,
      progress: 0,
      backgroundList: [
        {
          url: "background/1.jpg",
          tags: ["海边", "山川"],
        },
        {
          url: "background/2.jpg",
          tags: ["海边", "礁石", "蓝天"],
        },
        {
          url: "background/3.jpg",
          tags: ["蓝天", "街道", "现代"],
        },
        {
          url: "background/4.jpg",
          tags: ["日落", "大海", "夕阳"],
        },
        {
          url: "background/5.jpg",
          tags: ["蓝天", "白云", "马路"],
        },
        {
          url: "background/6.jpg",
          tags: ["蓝天", "现代", "车"],
        },
        {
          url: "background/7.jpg",
          tags: ["石头", "山川"],
        },
        {
          url: "background/8.jpg",
          tags: ["富士山", "花朵", "纯色"],
        },
        {
          url: "background/9.jpg",
          tags: ["船舶", "阳光", "海边"],
        },
      ],
    };
  },
  components: {
      ImageWithMethod,
    UploadPhoto,
    Carousel,
  },
  methods: {
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
      console.log(filelist);
      if (!filelist.person.file) {
        this.$message.error("请上传人物图片（仅允许一张）");
        return;
      } else if (!filelist.clothes.length) {
        this.$message.error("请上传至少一张衣服图片");
        return;
      }
      if (this.isPay) this.dialogVisible = true;

      let payload = `${filelist.person.file.name}|${filelist.clothes[0].file.name}`
      if (this.isloading) return;
      this.isloading = true;
      ws.send(payload)
      return;
      const formData = new FormData();
      formData.append(
        "personImage",
        filelist.person.file,
        filelist.person.name
      );
      filelist.clothes.forEach((item) => {
        formData.append("clothesImage", item.file, item.name);
      });
      await axios
        .post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.src = JSON.parse(res).url;
          const percentage = 2;
          img.onload = () => {
            canvas.width = img.width / percentage;
            canvas.height = img.height / percentage;
            ctx.drawImage(
              img,
              0,
              0,
              img.width / percentage,
              img.height / percentage
            );
            this.createImage = canvas.toDataURL("image/png");

            let msg = { url: this.createImage, time: this.formatTime() };
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
              if (this.isChange) {
                this.$message.warning(
                  "历史记录达到上限！已替换距今最早的图片！"
                );
                let history = JSON.parse(localStorage.getItem("history"));
                let item = history.pop();
                while (JSON.stringify(item).length < length) {
                  length -= JSON.stringify(item).length;
                  item = history.pop();
                }
                history.unshift(msg);
                localStorage.setItem("history", JSON.stringify(history));
              } else
                this.$message.warning(
                  "历史记录达到上限！如需添加，请删除部分图片！"
                );
            }
          };
          this.$message.success("上传成功");
        })
        // eslint-disable-next-line no-unused-vars
        .catch((err) => {
          this.createImage = "";
          this.$message.error("上传失败");
        })
        .finally(() => {
          this.isloading = false;
        });
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
    let timer = setInterval(() => {
      this.progress += 0.1;
      if (this.progress >= 100) {
        clearInterval(timer);
        this.progress = 100;
      }
    }, 1000 / 120);
    // invoke("background", { keywords: "" }).then((res) => {
    //   this.backgroundList = JSON.parse(res);
    // });
    let ws = this.ws
    ws.onopen = evt => {
      console.log("Connection establied!");
    }

    ws.onmessage = evt => {
      let data = evt.data;
      console.log(data)
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
          this.createImage = [e.target.result]
          this.dialogVisible=true;
        }

      fileReader.readAsDataURL(data)
      this.isloading = false;
    }
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
    margin-top: 20px;
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