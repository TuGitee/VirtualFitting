<template>
  <div
    class="image-method-box"
    @mouseenter="handleHover"
    @mouseleave="handleHover"
  >
    <el-image
      class="image-method-box__image"
      src="/logo.png"
      alt=""
      fit="contain"
      v-if="!url"
    />
    <el-image
      class="image-method-box__image"
      alt=""
      fit="contain"
      v-else
      :src="url"
    />
    <div class="image-method-box__actions" :class="{ hover: !disabled && url }">
      <span
        class="image-method-box__actions-preview"
        @click="handlePictureCardPreview()"
      >
        <i class="el-icon-zoom-in"></i>
      </span>
      <span
        class="image-method-box__actions-download"
        @click="handleDownload()"
      >
        <i class="el-icon-download"></i>
      </span>
      <span
        class="image-method-box__actions-delete"
        @click="handleRemove(index)"
      >
        <i class="el-icon-delete"></i>
      </span>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
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
    handleRemove: {
      type: Function,
      default: () => {
        vm.$confirm("该操作不可逆，请谨慎选择！", "删除图片提示").then(() => {
          vm.url = "";
        }).catch((err)=>{
          console.log(err)
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
      if (!this.url) return;
      let a = document.createElement("a");
      a.href = this.url;
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
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  &__image {
    height: 100%;
    width: 100%;
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
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    transition: all 0.3s;
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
    & span:last-child{
      margin-right: 0;
    }
  }
  .hover {
    opacity: 1;
  }
}
</style>