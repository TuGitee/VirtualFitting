<template>
  <el-main>
    <el-result
      icon="warning"
      title="提示"
      subTitle="暂无历史数据"
      v-if="historyList.length === 0"
    >
      <template slot="extra">
        <el-button type="primary" size="medium" @click="goUpload"
          >上传图片</el-button
        >
      </template>
    </el-result>
    <el-collapse v-else>
      <el-collapse-item
        v-for="(historyItem, index) in historyList"
        :key="index"
      >
        <template slot="title">
          <h4 class="el-collapse-item__header-title">
            {{ historyItem.time }}
          </h4>
          <el-button type="danger" @click.stop="deleteItem(index)"
            >删除</el-button
          >
        </template>
        <ImageWithMethod
          :url="historyItem.url"
          class="el-collapse-item__image"
          :handleRemove="deleteItem"
          :index="index"
        />
      </el-collapse-item>
    </el-collapse>
  </el-main>
</template>

<script>
import ImageWithMethod from "@/components/ImageWithMethod.vue";
export default {
  data() {
    return {
      historyList: JSON.parse(localStorage.getItem("history")) || [],
    };
  },
  components: {
    ImageWithMethod,
  },
  methods: {
    goUpload() {
      this.$router.push("/virtual-fitting");
    },
    deleteItem(index) {
      this.historyList.splice(index, 1);
      localStorage.setItem("history", JSON.stringify(this.historyList));
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
/deep/ .el-image {
  height: 30vh;
  min-height: 150px;
}
/deep/ .el-collapse-item {
  height: fit-content;
  &__image {
    height: 100%;
  }
  &__header {
    text-align: left;
    position: relative;
    &-title {
      width: 150px;
    }
    .el-button.el-button--danger {
      position: absolute;
      right: 40px;
    }
  }
}
</style>