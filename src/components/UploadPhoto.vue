<template>
  <div class="upload-demo">
    <el-badge :value="files.length" :hidden="(files.length < 2)" class="item">
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
      >
        <div class="el-upload__text">
          上传{{ typeName[type] }}<br />
          {{ multiple ? "(允许上传多张)" : "(仅允许单张)" }}
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
      <!-- 一组可以预览的图片，左右滑动可以切换图片 -->
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
      <ImageWithMethod
        v-if="dialogImageUrl.length === 1"
        :src="dialogImageUrl[0]"
      />
    </el-dialog>
  </div>
</template>

<script>
import ImageWithMethod from '@/components/ImageWithMethod';
export default {
  data() {
    return {
      disabled: false,
      isUpload: false,
      dialogImageUrl: "",
      dialogVisible: false,
      typeName: {
        clothes: "衣服",
        person: "人物",
      },
      files: [],
    };
  },
  props: {
    type: {
      type: String,
    },
    multiple: {
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
      a.download = file.name;
      a.click();
    },
    async handleChange() {
      this.files =
        this.type === "clothes"
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
/deep/ .el-dialog {
  width: 80% !important;
}

.upload-demo {
  width: 49%;
  height: 240px;
  position: relative;

  .el-badge {
    display: block;
    /deep/ .el-badge__content {
      height: 30px;
      width: 36px;
      line-height: 30px;
      font-size: 16px;
      transform: translate(0px, 8px);
      background-color: #b381c2;
      z-index: 9;
    }
  }

  /deep/ .el-upload--picture-card {
    height: 100%;
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    border: 2px solid #335aa7;

    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 240px;
      position: relative;
      border: none;
      background: url("@/assets/clothes.png") no-repeat center center;
      background-size: cover;
      i {
        margin: 5px auto;
      }
      .el-upload__text {
        line-height: 2rem;
        color: white;
        border-radius: 20px 20px 0 0;
        position: absolute;
        height: 120px;
        width: 100%;
        bottom: 0;
        font-size: 26px;
        letter-spacing: 0.5em;
        line-height: 4;
        left: 0;
        background: linear-gradient(#0006, #000d);
        filter: drop-shadow(0 0 1 #fff);
        transition: all 0.5s;
      }
      &:hover {
        border: none;
        .el-upload__text {
          height: 100%;
          font-size: 16px;
          line-height: 2;
          &::after {
            content: "";
            height: 5px;
            width: 40px;
            background-color: white;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 20px;
            animation: show 0.5s;
          }
          &::before {
            content: "";
            height: 40px;
            width: 5px;
            background-color: white;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 20px;
            animation: show 0.5s;
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
      height: 240px;
      margin: 0;
      border: none;
      border-radius: 20px;
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
    margin-bottom: 20px;
  }
}
</style>