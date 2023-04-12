<template>
  <div class="upload-demo">
    <el-input
      placeholder="请填入相关图片链接"
      v-model="searchText"
      class="search-input"
      @keyup.enter.native.prevent.stop="search"
    >
      <el-button slot="append" icon="el-icon-search" @click="search" />
    </el-input>
    <el-badge :value="files.length" :hidden="files.length < 2" class="item">
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        drag
        accept="image/*"
        ref="upload"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-error="handleError"
        :class="{ isShow: isUpload }"
        :multiple="multiple"
        :disabled="disabled"
        :style="backgroundStyle"
      >
        <div class="el-upload__text">
          <p>{{ ("上传" + typeName[type]).split("").join(" ") }}</p>
          <p>
            {{
              (multiple ? "(允许上传多张)" : "(仅允许单张)").split("").join(" ")
            }}
          </p>
          <p>请上传与选框比例相近的图片</p>
        </div>

        <div slot="file" slot-scope="{ file }">
          <el-image
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
            fit="cover"
          />
          <span class="el-upload-list__item-actions">
            <article>
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download"></i>
              </span>
            </article>
            <article>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-change el-upload"
                @click="handleRefresh(file)"
              >
                <i class="el-icon-refresh"></i>
              </span>
            </article>
          </span>
        </div>
      </el-upload>
    </el-badge>
    <el-dialog :visible.sync="dialogVisible">
      <el-carousel
        v-if="dialogImageUrl.length !== 1"
        :initial-index="0"
        height="500px"
        width="80%"
      >
        <el-carousel-item v-for="(item, index) in dialogImageUrl" :key="index">
          <el-image :src="item" fit="contain"></el-image>
        </el-carousel-item>
      </el-carousel>
      <el-image
        v-else-if="dialogImageUrl.length === 1"
        :src="dialogImageUrl[0]"
        fit="contain"
      ></el-image>
      <ImageWithMethod
        v-else
        :src="dialogImageUrl"
        :options="{ isDownload: true }"
      />
    </el-dialog>
  </div>
</template>

<script>
import ImageWithMethod from "@/components/ImageWithMethod";
export default {
  data() {
    return {
      disabled: false,
      isUpload: false,
      searchText: "",
      dialogImageUrl: "",
      dialogVisible: false,
      typeName: {
        clothes: "衣服图片",
        person: "人物图片",
      },
      files: [],
    };
  },
  computed: {
    backgroundStyle() {
      const path = require(`@/assets/clothes_${Math.round(Math.random())}.png`)
      return {
        background: `url(${path}) no-repeat center center`,
        backgroundSize: "cover",
      };
    },
  },
  props: {
    type: {
      type: String,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ImageWithMethod,
  },
  methods: {
    handleRemove(file) {
      this.$confirm("确定删除图片吗？").then(() => {
        this.$refs.upload.clearFiles();
        this.files = [];
        this.isUpload = false;
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = this.files.map((item) => item.url);
      this.dialogVisible = true;
    },
    handleDownload(file) {
      let a = document.createElement("a");
      a.href = file.url;
      a.download = +new Date() + ".jpg";
      a.click();
    },
    handleChange() {
      this.files = this.multiple
        ? this.$refs.upload.uploadFiles
        : this.$refs.upload.uploadFiles.slice(0, 1);
      this.$bus.$emit(
        "uploadPhoto",
        this.type,
        this.files.map((item) => {
          return {
            file: item.raw,
            name: new Date().getTime(),
          };
        })
      );
      this.isUpload = true;
    },
    handleSuccess(response) {
      this.$message({
        message: "上传成功",
        type: "success",
      });
    },
    handleError(error) {
      this.$message({
        message: "上传失败",
        type: "error",
      });
    },
    handleRefresh() {
      this.$refs.upload.clearFiles();
      this.files = [];
      this.isUpload = false;
      this.$refs.upload.$refs["upload-inner"].handleClick();
    },
    search() {
      if (!this.searchText.trim() || !/^http/.test(this.searchText.trim())) {
        this.$message({
          message: "链接为空或不合法",
          type: "error",
        });
        return;
      }

      this.$axios
        .get(this.searchText, {
          responseType: "blob",
        })
        .then((res) => {
          if (!res.data.type.includes("image")) {
            throw new Error("图片链接有误，搜索失败");
          }
          const raw = new File([res.data], +new Date(), {
            type: "image/jpeg",
          });
          const obj = {
            raw,
            url: URL.createObjectURL(res.data),
            uid: raw.lastModified,
            name: raw.name,
            status: "ready",
            percentage: 0,
            size: raw.size,
          };
          if (this.multiple) {
            this.$refs.upload.uploadFiles.push(obj);
            this.handleChange();
            return;
          } else this.$refs.upload.uploadFiles = [obj];
          this.handleChange();
        })
        .catch((err) => {
          this.$message({
            message: err.message,
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.isShow {
  /deep/ .el-upload--picture-card {
    display: none;
  }
  /deep/ .el-upload__tip {
    display: none;
  }
}

.upload-demo {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  color: @font;

  .search-input {
    height: 40px;
    background-color: @background;
    border-radius: @margin;
    overflow: hidden;
    margin-bottom: @margin;

    /deep/ .el-input__inner {
      background-color: transparent;
      height: 100%;
      border: none;
      color: @font;
      &::-webkit-input-placeholder {
        color: @font-lightest;
      }
    }
    /deep/ .el-input-group__append {
      background-color: #fff9;
      color: @font;
      border: none;
      border-radius: @margin;
    }
  }

  .el-badge {
    flex: 1;
    display: block;
    height: 100%;
    width: 100%;
    border-radius: @margin;
    overflow: hidden;

    div {
      height: 100%;
      width: 100%;
    }
    /deep/ .el-badge__content {
      height: 30px;
      width: 36px;
      line-height: 30px;
      font-size: 16px;
      transform: translate(0px, 8px);
      background-color: @color-dark;
      background: transparent;
      z-index: 9;
    }
  }

  /deep/ .el-upload--picture-card {
    height: 100%;
    width: 100%;
    border-radius: @margin;
    overflow: hidden;
    border: none;
    background-color: transparent;

    .el-upload-dragger {
      background-color: transparent;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      position: relative;
      border: none;
      i {
        margin: 5px auto;
      }
      .el-upload__text {
        white-space: nowrap;
        line-height: 2rem;
        font-weight: bold;
        color: @white;
        border-radius: @margin @margin 0 0;
        position: absolute;
        height: 120px;
        width: 100%;
        bottom: 0;
        font-size: 26px;
        line-height: 4;
        left: 0;
        background: linear-gradient(rgba(0, 0, 0, 0.193), rgba(0, 0, 0, 0.615));
        filter: drop-shadow(0 0 1 @white);
        transition: all 0.5s;

        p {
          margin-top: 10px;
          transition: all 0.5s;
          &:last-child {
            font-size: 12px;
            color: #ccc;
          }
          &:not(:first-child) {
            opacity: 0;
          }
        }
      }
      &:hover {
        border: none;
        .el-upload__text {
          height: 100%;
          &::after {
            content: "";
            height: 5px;
            width: 40px;
            background-color: @white;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: @margin;
            animation: show 0.5s;
          }
          &::before {
            content: "";
            height: 40px;
            width: 5px;
            background-color: @white;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: @margin;
            animation: show 0.5s;
          }
          p {
            opacity: 1;
            line-height: 1.1;
            font-size: 16px;
            &:not(:first-child) {
              font-size: 12px;
              font-weight: 400;
              margin-top: 5px;
            }
          }
          @keyframes show {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        }
      }
    }
  }
  /deep/ .el-upload-list {
    .el-upload-list__item {
      transition: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      margin: 0;
      border: none;
      border-radius: @margin;
      position: absolute;
      z-index: 1;
      div {
        width: 100%;
        height: 100%;
        .el-upload-list__item-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          font-size: 20px;
          article {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            span {
              margin: 5px 10px;
            }
          }
        }
      }
    }
  }
  /deep/ .el-upload__tip {
    margin-bottom: @margin;
  }
  /deep/ .el-carousel__item {
    overflow-y: overlay;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>