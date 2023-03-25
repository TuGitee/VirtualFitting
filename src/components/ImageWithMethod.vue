<template>
  <div
    class="image-method-box"
    @mouseenter="handleHover"
    @mouseleave="handleHover"
  >
    <el-image
      class="image-method-box__image default"
      src="/logo.png"
      alt=""
      fit="contain"
      v-if="!url && !src"
    />
    <el-image
      class="image-method-box__image normal"
      alt=""
      fit="contain"
      v-else
      :src="url ? require('@/assets/' + url) : src"
    />
    <div
      class="image-method-box__actions"
      :class="{ hover: !disabled && (url || src) }"
      v-if="!disabled && (url || src)"
    >
      <span
        class="image-method-box__actions-preview"
        @click="handlePictureCardPreview()"
        v-if="url"
      >
        <i class="el-icon-zoom-in"></i>
      </span>
      <span
        class="image-method-box__actions-download"
        @click="handleDownload()"
        v-if="src || url"
      >
        <i class="el-icon-download"></i>
      </span>
      <span
        class="image-method-box__actions-delete"
        @click="handleRemove(index)"
        v-if="url"
      >
        <i class="el-icon-delete"></i>
      </span>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="url ? require('@/assets/' + url) : src" alt="" />
    </el-dialog>
  </div>
</template>

<script>
let vm = null;
export default {
  name: "ImageWithMethod",
  props: {
    url: {
      type: String,
      default: "",
    },
    index: {
      type: Number,
    },
    src: {
      type: String,
      default: "",
    },
    handleRemove: {
      type: Function,
      default: () => {
        vm.$confirm("该操作不可逆，请谨慎选择！", "删除图片提示")
          .then(() => {
            vm.url = "";
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
  },
  data() {
    return {
      disabled: true,
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    handlePictureCardPreview() {
      this.dialogImageUrl = this.url;
      this.dialogVisible = true;
    },
    handleDownload() {
      if (!this.url && !this.src) return;
      let a = document.createElement("a");
      // this.url是文件路径，src是文件的base64编码，a.href是url文件的下载地址
      a.href = this.url ? require("@/assets/" + this.url) : this.src;
      a.download = this.url? require("@/assets/" + this.url): this.src.split("/").pop();
      a.click();
    },
    handleHover() {
      this.disabled = !this.disabled;
    },
  },
  created() {
    vm = this;
  },
};
</script>

<style lang="less" scoped>
.image-method-box {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s;
  &__image {
    height: 100%;
    width: 100%;
    /deep/ .el-image__error,
    .el-image__placeholder {
      background-color: transparent;
    }
  }
  &__actions {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    font-size: 20px;
    &-preview {
      margin-right: 20px;
    }
    &-delete {
      margin-right: 20px;
    }
    &-download {
      margin-right: 20px;
    }
    & span:last-child {
      margin-right: 0;
    }
  }
  .hover {
    opacity: 1;
  }
}
</style>