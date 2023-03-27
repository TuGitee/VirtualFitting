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
      :fit="fit"
      v-if="!url"
    />
    <el-image
      class="image-method-box__image normal"
      alt=""
      :fit="fit"
      v-else
      :src="url"
    />

    <div
      class="image-method-box__actions"
      :class="{ hover: !disabled && url }"
      v-if="!disabled && url"
    >
      <span
        class="image-method-box__actions-preview"
        @click="handlePictureCardPreview()"
        v-if="url && options.isPreview"
      >
        <i class="el-icon-zoom-in"></i>
      </span>
      <span
        class="image-method-box__actions-download"
        @click="handleDownload()"
        v-if="url && options.isDownload"
      >
        <i class="el-icon-download"></i>
      </span>
      <span
        class="image-method-box__actions-delete"
        @click="handleRemove(index)"
        v-if="url && options.isDelete"
      >
        <i class="el-icon-delete"></i>
      </span>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="url" alt="" />
    </el-dialog>
  </div>
</template>

<script>
let vm = null;
export default {
  name: "ImageWithMethod",
  props: {
    index: {
      type: Number,
    },
    src: {
      type: String,
      default: "",
    },
    options: {
      type: Object,
      default: () => {
        return {
          isPreview: true,
          isDownload: true,
          isDelete: true,
        };
      },
    },
    fit: {
      type: String,
      default: "cover",
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
  computed: {
    url() {
      if (!this.src) return null;
      else if (this.src.includes("base64")) {
        return URL.createObjectURL(this.dataURLtoBlob(this.src));
      } else if (this.src.includes("http")) {
        return this.src;
      } else {
        return require("@/assets/" + this.src);
      }
    },
  },
  methods: {
    handlePictureCardPreview() {
      this.dialogImageUrl = this.url;
      this.dialogVisible = true;
    },
    handleDownload() {
      if (!this.url && !this.src) return;
      let a = document.createElement("a");
      a.href = this.url;
      a.download = +new Date() + "_图片.jpg";
      a.click();
    },
    handleHover() {
      this.disabled = !this.disabled;
    },
    dataURLtoBlob(dataurl) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
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