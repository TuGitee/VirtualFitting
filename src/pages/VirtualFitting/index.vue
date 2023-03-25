<template>
  <el-main class="virtual-fitting main">
    <Carousel
      :list="list"
      class="virtual-fitting-carousel"
      type="background"
      v-loading="isSearching"
      element-loading-text="处理中..."
    />

    <div class="virtual-fitting-photo">
      <UploadPhoto
        v-for="(type, index) in Object.keys(filelist)"
        :type="type"
        :key="index"
        class="virtual-fitting-photo-upload"
      />
    </div>

    <div class="virtual-fitting-upload">
      <div class="virtual-fitting-upload-progress"></div>
    </div>

    <!-- <div class="virtual-fitting-right">
      <div class="virtual-fitting-right-top">
        <ImageWithMethod
          v-loading="isloading"
          class="virtual-fitting-right-top-image"
          :url="createImage"
        />
      </div>
    </div> -->
  </el-main>
</template>

<script>
import UploadPhoto from "@/components/UploadPhoto.vue";
import SearchBox from "@/components/SearchBox.vue";
import Carousel from "@/components/Carousel.vue";
import ImageWithMethod from "@/components/ImageWithMethod.vue";
import { invoke } from "@tauri-apps/api/tauri";
import axios from "axios";
export default {
  data() {
    return {
      backgroundList: [],
      filelist: {
        person: {},
        clothes: [],
      },
      createImage: "",
      isloading: false,
      isSearching: false,
      // isSave: true,
      // isPay: true,
      // isChange: true,
      list: [
        {
          url: "1.jpg",
          tags: ["海边", "山川"],
        },
        {
          url: "2.jpg",
          tags: ["海边", "礁石", "蓝天"],
        },
        {
          url: "3.jpg",
          tags: ["蓝天", "街道", "现代"],
        },
        {
          url: "4.jpg",
          tags: ["日落", "大海", "夕阳"],
        },
        {
          url: "5.jpg",
          tags: ["蓝天", "白云", "马路"],
        },
        {
          url: "6.jpg",
          tags: ["蓝天", "现代", "车"],
        },
        {
          url: "7.jpg",
          tags: ["石头", "山川"],
        },
        {
          url: "8.jpg",
          tags: ["富士山", "花朵", "纯色"],
        },
        {
          url: "9.jpg",
          tags: ["船舶", "阳光", "海边"],
        },
      ],
    };
  },
  components: {
    UploadPhoto,
    SearchBox,
    Carousel,
    ImageWithMethod,
  },
  methods: {
    handleClick(tab) {
      this.activeItem = tab.name;
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
      console.log(filelist);
      if (!filelist.person.file) {
        this.$message.error("请上传人物图片（仅允许一张）");
        return;
      } else if (!filelist.clothes.length) {
        this.$message.error("请上传至少一张衣服图片");
        return;
      }
      if (this.isPay) this.dialogVisible = true;
      this.isloading = true;
      const formData = new FormData();
      formData.append(
        "personImage",
        filelist.person.file,
        filelist.person.name
      );
      filelist.clothes.forEach((item) => {
        formData.append("clothesImage", item.file, item.name);
      });
      // 打印formData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
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
            if (this.isSave) {
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
      console.log(this.filelist);
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        this.$confirm("确定上传图片吗？").then(() => {
          this.submitUpload();
        });
      }
    });
    // this.$bus.$on("searchBackground", async (item) => {
    //   this.isSearching = true;
    //   await invoke("background", { keywords: item.tags.join("-") })
    //     .then((res) => {
    //       this.backgroundList = JSON.parse(res);
    //     })
    //     .catch((error) => {
    //       if (error.message.includes("timeout"))
    //         this.$message.error("网络较差，搜索超时！");
    //       else if (error.message === "Network Error")
    //         this.$message.error("网络断线！");
    //     });
    //   this.isSearching = false;
    // });
  },
  created() {
    // invoke("background", { keywords: "" }).then((res) => {
    //   this.backgroundList = JSON.parse(res);
    // });
  },
};
</script>

<style lang="less" scoped>
.virtual-fitting {
  max-height: 100%;
  min-height: calc(100vh - 76px);
  padding-top: 0;
  display: flex;
  flex-direction: column;
  overflow: unset;

  &-carousel {
    margin-top: 20px;
  }

  &-photo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  &-upload {
    width: 100%;
    margin-top: 20px;
    height: 26px;
    line-height: 26px;
    border: none;
    background-color: white;
    border-radius: 20px;
    font-weight: 700;
    color: #e4b0f4;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 20px -10px #e4b0f4;
    &::after {
      content: "按回车键上传到服务器";
    }
    &-progress {
      position: absolute;
      top: 0;
      left: -2px;
      width: 200px;
      height: 100%;
      background: linear-gradient(
        90deg,
        #1e9dbdcc,
        #173e96cc,
        #4a249bcc,
        #6d3f9bcc
      );
      border-radius: 20px;
      transition: all 0.3s;
    }
  }
}
</style>