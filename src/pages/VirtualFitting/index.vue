<template>
  <el-main class="virtual-fitting main">
    <div class="virtual-fitting-left">
      <UploadPhoto
        v-for="(type, index) in types"
        :type="type"
        :key="index"
        class="virtual-fitting-left-upload"
      />
      <el-button @click="submitUpload" type="danger">上传到服务器</el-button>
    </div>
    <div class="virtual-fitting-right">
      <div class="virtual-fitting-right-top">
        <div class="virtual-fitting-right-top-choices">
          <el-switch v-model="isSave" active-text="保存至历史记录"> </el-switch>
          <el-switch v-model="isPay" active-text="每次上传展示赞赏码">
          </el-switch>
          <el-switch v-model="isChange" active-text="历史记录自动替换">
          </el-switch>
          <el-button @click="dialogVisible = true">赞赏码</el-button>
        </div>
        <ImageWithMethod
          v-loading="isloading"
          class="virtual-fitting-right-top-image"
          :url="createImage"
        />
      </div>
      <div class="virtual-fitting-right-background">
        <SearchBox class="virtual-fitting-right-background-search" />
        <Carousel
          :list="backgroundList"
          class="virtual-fitting-right-background-carousel"
          type="background"
          v-loading="isSearching"
          element-loading-text="处理中..."
          v-if="backgroundList.length"
        />
      </div>
    </div>
    <el-dialog
      title="赞赏码"
      :visible.sync="dialogVisible"
      width="25%"
      center
      class="virtual-fitting-pay"
    >
      <el-tabs
        v-model="activeItem"
        type="card"
        @tab-click="handleClick"
        stretch
      >
        <el-tab-pane label="支付宝" name="Alipay">
          <el-image :src="require('./images/Alipay.png')" draggable="false"
            ><div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i></div
          ></el-image>
        </el-tab-pane>
        <el-tab-pane label="微信" name="WeChat Pay">
          <el-image :src="require('./images/WeChatPay.png')" draggable="false"
            ><div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i></div
          ></el-image>
        </el-tab-pane>
      </el-tabs>
      <p class="virtual-fitting-pay-title">您的赞赏是对我们最大的支持！</p>
    </el-dialog>
  </el-main>
</template>

<script>
import UploadPhoto from "@/components/UploadPhoto.vue";
import SearchBox from "@/components/SearchBox.vue";
import Carousel from "@/components/Carousel.vue";
import ImageWithMethod from "@/components/ImageWithMethod.vue";
export default {
  data() {
    return {
      types: ["person", "clothes"],
      backgroundList: [],
      person: {},
      clothes: {},
      background: {},
      createImage: "",
      isloading: false,
      isSearching: false,
      dialogVisible: false,
      activeItem: "Alipay",
      isSave: true,
      isPay: true,
      isChange: true,
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
      const { person, clothes, background } = this;
      if (!person) {
        this.$message.error("请上传人物图片");
        return;
      } else if (!clothes) {
        this.$message.error("请上传衣服图片");
        return;
      } else if (!background) {
        this.$message.error("请选择背景图片");
        return;
      }
      if (this.isPay) this.dialogVisible = true;
      this.isloading = true;
      const formData = new FormData();
      formData.append("personImage", person.url, person.filename);
      formData.append("clothesImage", clothes.url, clothes.filename);
      formData.append("backgroundImage", background.url, background.filename);
      await this.$axios
        .post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 3000,
        })
        .then((res) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.src = res.data.url;
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
      this[type] = obj;
    });
    this.$bus.$on("searchBackground", async (item) => {
      this.isSearching = true;
      await this.$axios
        .get(`/background?keyword=${item.tags.join("-")}`, { timeout: 5000 })
        .then((res) => {
          this.backgroundList = res.data;
        })
        .catch((error) => {
          if (error.message.includes("timeout"))
            this.$message.error("网络较差，搜索超时！");
          else if (error.message === "Network Error")
            this.$message.error("网络断线！");
        });
      this.isSearching = false;
    });
  },
  created() {
    this.$axios.get("/background").then((res) => {
      this.backgroundList = res.data;
    });
  },
};
</script>

<style lang="less" scoped>
.virtual-fitting {
  max-height: 100%;
  min-height: calc(100vh - 76px);
  padding-top: 0;
  margin-bottom: 10px;
  display: flex;
  overflow: unset;

  &-left {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    &-upload {
      border-bottom: 1px solid #ccc;
    }
    .el-button {
      margin-top: 10px;
    }
  }
  &-right {
    margin-left: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    &-top {
      flex: 1;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      margin: 20px auto 0px;
      &-choices {
        width: 200px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }
      &-image {
        height: 100%;
        max-width: 500px;
        max-height: 280px;
      }
    }

    &-background {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      width: 100%;
      margin: 20px;
      &-carousel {
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;
        align-items: center;
      }
    }
  }

  &-pay {
    user-select: none;
    &-title {
      margin-top: 10px;
      text-align: center;
    }
    /deep/ .el-dialog {
      min-width: 350px;
    }
  }
}
</style>