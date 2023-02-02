<template>
  <div class="upload-demo">
    <el-tag>{{ typeName[type] }}</el-tag>
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
    >
      <i slot="default" class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过500kb
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
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
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
        background: "背景",
      },
    };
  },
  props: {
    type: {
      type: String,
    },
  },
  methods: {
    handleRemove(file) {
      this.$confirm("确定删除该图片吗？").then(() => {
        this.$refs.upload.clearFiles();
        this.isUpload = false;
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      let a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      a.click();
    },
    async handleChange() {
      if (this.$refs.upload.uploadFiles.length > 0) {
        this.$bus.$emit("uploadPhoto", this.type, {
          url: await this.h5BlobUrlToBlobObj(this.$refs.upload.uploadFiles[0].url),
          filename: +new Date(),
        });
        this.isUpload = true;
      } else {
        this.isUpload = false;
      }
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
      this.isUpload = false;
      this.$refs.upload.$refs["upload-inner"].handleClick();
    },
    toBase64(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        return e.target.result;
      };
      reader.readAsDataURL(file);
    },
    h5BlobUrlToBlobObj(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function onload(e) {
          if (this.status === 200) {
            const Blob = this.response;
            resolve(Blob);
          } else {
            reject(this.status, e);
          }
        };
        xhr.send();
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
  width: 360px;
  /deep/ .el-tag {
    margin: 10px;
  }
  /deep/ .el-upload--picture-card {
    height: auto;
    width: auto;
    border: none;
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      i {
        margin: 5px auto;
      }
      .el-upload__text {
        line-height: 2rem;
      }
    }
  }
  /deep/ .el-upload-list {
    display: inline-block;
    .el-upload-list__item {
      transition: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 360px;
      height: 200px;
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