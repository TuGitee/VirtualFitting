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
      :style="{ fontSize }"
    >
      <span
        class="image-method-box__actions-preview"
        @click.stop="handlePictureCardPreview()"
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
      <span
        class="image-method-box__actions-delete"
        @click="handleJump(index)"
        v-if="url && href"
      >
        <a :href="href" target="_blank" title="点击跳转网购页面">
          <i class="el-icon-link"></i>
        </a>
      </span>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="url" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { dataURLtoBlob } from "@/utils/index.js";
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
    href: {
      type: String,
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
      } else if (this.src.includes("blob")) {
        return this.src;
      } else if (this.src.includes("http")) {
        this.$axios.get(this.src, {
          responseType: "blob",
        }).then((res) => {
          this.$emit('change',this.index,URL.createObjectURL(res.data))
        });
      } else {
        return require("@/assets/" + this.src);
      }
    },
    fontSize() {
      let font = 40;
      for (let i in this.options) {
        if (this.options[i]) {
          font -= 12;
        }
      }
      return font + "px";
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
      a.remove();
    },
    handleRemove(index) {
      this.$emit("handleRemove", index);
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
  height: 100%;
  width: 100%;
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
    color: @white;
    font-size: 20px;
    &-preview {
      margin-right: @margin;
    }
    &-delete {
      margin-right: @margin;
    }
    &-download {
      margin-right: @margin;
    }
    & span:last-child {
      margin-right: 0;
    }
    a {
      color: @white;
    }
  }
  .hover {
    opacity: 1;
  }
}
</style>