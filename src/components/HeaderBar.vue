<template>
  <div class="root">
    <el-menu :default-active="$route.path" router class="el-menu">
      <div class="el-menu-left">
        <el-menu-item class="el-menu-left-title">
          <router-link to="/">
            <img src="@/assets/logo.png" alt="虚拟试衣logo" />
          </router-link>
        </el-menu-item>
        <el-menu-item
          v-for="(item, index) in navList"
          :key="index"
          :index="item.path"
        >
          <i :class="item.meta.icon"></i>
          <span slot="title">{{ item.meta.title }}</span>
        </el-menu-item>
      </div>
      <div class="el-menu-right">
        <el-menu-item class="give-me-money" @click="dialogVisible = true">
          <i class="el-icon-goods"></i
          ><span slot="title" class="give-me-money-word">赞赏我们吧！</span>
        </el-menu-item>
      </div>
    </el-menu>

    <el-dialog
      title="赞赏码"
      :visible.sync="dialogVisible"
      width="25%"
      center
      class="el-menu-pay"
      :append-to-body="true"
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
      <template #footer class="el-menu-pay-title"
        >您的赞赏是对我们最大的支持！</template
      >
    </el-dialog>
  </div>
</template>

<script>
import routes from "@/router/routes";
export default {
  data() {
    return {
      navList: routes.filter((item) => item.meta.icon),
      dialogVisible: false,
      activeItem: "Alipay",
    };
  },
  methods: {
    handleClick(tab) {
      this.activeItem = tab.name;
    },
    handleScroll(e) {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop >= 0) {
        this.$el.style.backgroundColor = `rgba(255,255,255,${
          scrollTop / 100 > 1 ? 1 : scrollTop / 100
        })`;
      } else {
        this.$el.style.backgroundColor = "transparent";
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="less" scoped>
.root {
  position: sticky;
  top: 0;
  width: 100%;
  height: calc(@nav-height - @margin / 2);
  z-index: 999;
  border-radius: 0 0 @margin @margin;
  overflow: hidden;
  box-shadow: @box-shadow-light;

  &::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    filter: blur(5px);
    transform: scale(1.1);
    z-index: -99999;
    // background: url("@/assets/bg_2.png") no-repeat left top;
    background-color: @background;
  }

  .el-menu {
    color: @black;
    display: flex;
    gap: calc(@margin / 2);
    text-align: center;
    justify-content: space-between;
    top: 0;
    left: 0;
    background-color: transparent;
    color: @font-lightest;
    border-radius: @margin;
    border: none;
    transition: all 0.3s ease-in-out;

    &-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      width: 100%;
      gap: calc(@margin / 2);

      &-title {
        width: 100px;
        border: none !important;
        img {
          height: calc(100% - @margin);
        }
      }
    }

    &-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
      width: 100%;
      .give-me-money {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        cursor: pointer;
        transition: none;

        i {
          margin-right: 10px;
        }

        &:hover {
          color: @font;
          i {
            color: @font;
          }
        }
      }
    }

    /deep/ .el-menu.el-menu--horizontal {
      border-bottom: none;
      display: flex;
    }

    /deep/ .el-submenu {
      color: @font;
      i {
        color: @font;
      }
      &__title {
        text-align: left;
        margin-left: 10px;
        color: @font;
        &:hover {
          background-color: transparent;
        }
      }
    }
    /deep/ .el-menu-item {
      text-align: center;
      width: fit-content;
      height: @item-height;
      line-height: @item-height;
      color: @font-lightest;
      margin: 10px 0;
      border-radius: @margin;
      padding: 0 10px !important;

      i {
        color: @font-lightest;
      }

      &:hover {
        background-color: transparent;
      }

      &:hover:not(:first-child) {
        background-color: @white;
      }

      &:focus {
        background-color: transparent;
      }
    }

    .is-active {
      color: @font;
      font-weight: 700;
      position: relative;
      i {
        color: @font;
        font-weight: 700;
      }
    }
    @media screen and (max-width: 768px) {
      &-item {
        i {
          margin: 0;
        }
        span {
          display: none;
        }
      }
      .give-me-money {
        display: flex;
        justify-content: center;
        align-items: center;
        &-word {
          display: none;
        }
        i {
          margin: 0;
        }
      }
    }
  }
}
</style>