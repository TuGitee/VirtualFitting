<template>
  <!-- <el-header class="header" height="auto">
    <el-menu
      mode="horizontal"
      router
      :default-active="$route.path"
    >
      <el-menu-item v-for="(item,index) in navList" :key="index" :index="item.path">
        {{item.name}}
      </el-menu-item>
    </el-menu>
  </el-header> -->

  <div>
    <el-menu
      :default-active="$route.path"
      router
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >
      <el-menu-item
        v-for="(item, index) in navList"
        :key="index"
        :index="item.path"
      >
        <i :class="item.meta.icon"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>
      <div class="give-me-money" @click="dialogVisible = true">
        <i class="el-icon-goods"></i>赞赏我们吧！
      </div>
    </el-menu>
    <el-dialog
      title="赞赏码"
      :visible.sync="dialogVisible"
      width="25%"
      center
      class="el-menu-pay"
    >
      <el-tabs
        v-model="activeItem"
        type="card"
        @tab-click="handleClick"
        stretch
      >
        <el-tab-pane label="支付宝" name="Alipay">
          <el-image
            :src="require('@/assets/images/Alipay.png')"
            draggable="false"
            ><div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i></div
          ></el-image>
        </el-tab-pane>
        <el-tab-pane label="微信" name="WeChat Pay">
          <el-image
            :src="require('@/assets/images/WeChatPay.png')"
            draggable="false"
            ><div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i></div
          ></el-image>
        </el-tab-pane>
      </el-tabs>
      <p class="el-menu-pay-title">您的赞赏是对我们最大的支持！</p>
    </el-dialog>
  </div>
</template>

<script>
import routes from "@/router/routes";
export default {
  data() {
    return {
      navList: routes.filter((item) => item.meta.isShow),
      isCollapse: false,
      dialogVisible: false,
      activeItem: "Alipay",
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClick(tab) {
      this.activeItem = tab.name;
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  color: #333;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: #fff;
  width: 200px;
  min-height: 400px;
  height: calc(100% - 40px);
  background-color: #fff5;
  color: white;
  border-radius: 20px;
  box-shadow: 0 0 20px -10px rgba(0, 0, 0, 0.2);
  margin: 20px;
  border: none;

  .give-me-money {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-top: 1px solid #ebeef5;
    cursor: pointer;
    &:hover {
      color: #b480c3;
    }
    i {
      margin-right: 10px;
    }
  }

  /deep/ .el-menu.el-menu--horizontal {
    border-bottom: none;
    display: flex;
  }

  /deep/ .el-submenu {
    color: white;
    color: white;
    i {
      color: white;
    }
    &__title {
      text-align: left;
      margin-left: 10px;
      color: white;
      &:hover {
        background-color: transparent;
      }
    }
  }
  /deep/ .el-menu-item {
    text-align: left;
    margin-left: 10px;
    color: white;
    i {
      color: white;
    }

    &:hover {
      background-color: transparent;
    }

    &:focus {
      background-color: transparent;
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

  .is-active {
    color: #efb6ff;
    font-weight: 700;
    i {
      color: #efb6ff;
      font-weight: 700;
    }
  }
}
</style>