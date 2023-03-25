<template>
  <el-main class="main">
    <el-result
      icon="warning"
      title="提示"
      subTitle="暂无历史数据"
      v-if="historyList.length === 0"
      class="main-warning"
    >
      <template slot="extra">
        <el-button type="primary" size="medium" @click="goUpload"
          >上传图片</el-button
        >
      </template>
    </el-result>
    <el-collapse v-else class="main-history" v-model="activeIndex">
      <el-collapse-item class="main-history-search">
        <template slot="title">
          <el-input
            placeholder="请输入搜索内容"
            v-model="searchText"
            class="search-input"
            @keyup.enter.native="search"
          >
            <el-button slot="append" icon="el-icon-search" @click="search" />
          </el-input>
        </template>
      </el-collapse-item>

      <el-collapse-item
        v-for="(historyItem, index) in historyList"
        :key="index"
        :name="historyItem.time"
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

    <swiper
      class="swiper gallery-thumbs"
      :options="swiperOptionThumbs"
      ref="swiperThumbs"
    >
      <swiper-slide
        class="swiper-slide"
        v-for="(item, index) in historyList"
        :data-value="item.time"
        :key="index"
      >
        <img :src="require('@/assets/' + item.url)" />
      </swiper-slide>
    </swiper>
  </el-main>
</template>

<script>
let vm;
import ImageWithMethod from "@/components/ImageWithMethod.vue";
export default {
  data() {
    return {
      searchText: "",
      activeIndex: [],
      historyList: JSON.parse(localStorage.getItem("history")) || [
        { time: "2022-9-3", url: "images/1.png" },
        { time: "2022-9-23", url: "images/2.png" },
        { time: "2022-10-3", url: "images/3.png" },
        { time: "2022-12-3", url: "images/4.png" },
        { time: "2023-1-1", url: "images/5.png" },
        { time: "2023-1-3", url: "images/6.png" },
        { time: "2023-2-2", url: "images/7.png" },
      ],
      swiperOptionThumbs: {
        direction: "vertical",
        mousewheel: true,
        spaceBetween: 10,
        centeredSlides: true,
        observer: true,
        observeParents: true,
        slidesPerView: 5,
        touchRatio: 0.1,
        slideToClickedSlide: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        on: {
          tap(e) {
            vm.focus(e, this);
          },
        },
      },
    };
  },
  computed: {
    swiperThumbs() {
      return this.$refs.swiperThumbs.swiper;
    },
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
    search() {
      this.activeIndex = [];
      this.historyList.filter((item) => {
        if (item.time.includes(this.searchText)) {
          this.activeIndex.push(item.time);
        }
      });
      console.log(this.activeIndex);
    },
    async focus(e, that) {
      let clickedIndex = that.clickedIndex;
      if (!that.clickedSlide) return;
      if (clickedIndex === undefined) return;
      this.activeIndex = that.clickedSlide?.getAttribute("data-value");

      if (vm.focusIndex !== clickedIndex) {
        vm.focusIndex = clickedIndex;
        vm.isAbleMove = false;
        this.swiperThumbs.slideTo(clickedIndex);
      } else {
        vm.isAbleMove = true;
        vm.focusIndex = -1;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      const swiperThumbs = this.swiperThumbs;
    });
  },
  created() {
    vm = this;
  },
};
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  &-history {
    &-search {
      margin-bottom: 20px;
      .search-input {
        height: 100%;
        /deep/ .el-input__inner {
          background-color: transparent;
          height: 100%;
          border: none;
        }
        /deep/ .el-input-group__append {
          background-color: #fff9;
          border: none;
        }
      }
      /deep/ .el-collapse-item__arrow {
        display: none;
      }
    }
  }
  &-warning {
    flex: 1;
    height: 50vh;
    color: white;
    transform: translateY(50%);
    background-color: #fff5;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    /deep/ .el-result__title p {
      color: white;
    }
    /deep/ .el-result__subtitle p {
      color: white;
    }
    /deep/ .el-result__extra button {
      background-color: #efb6ff;
      border: none;
    }
    &:hover {
      box-shadow: 0px 0px 30px -10px #0003;
      &::after {
        left: 150%;
      }
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: -50%;
      width: 200px;
      transform: skew(-20deg);
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      z-index: 1;
      transition: all 0.7s;
    }
  }
  /deep/ .el-collapse {
    width: calc(100% - 220px);
    border: none;
    .el-collapse-item {
      height: fit-content;
      background-color: #fff5;
      border-radius: 16px;
      overflow: hidden;
      border: none;
      margin-bottom: 20px;
      &__wrap {
        background: transparent;
        border-bottom: none;
      }
      &__image {
        height: 100%;
      }
      &__header {
        text-align: left;
        position: relative;
        background-color: #fff5;
        border: none;
        &-title {
          width: 150px;
          margin-left: 20px;
        }
        .el-button.el-button--danger {
          position: absolute;
          right: 10px;
          padding: 10px 20px;
          background-color: #fff5;
          border-radius: 8px;
          border: none;
          color: #f4defa;
        }
        .el-collapse-item__arrow {
          margin-right: 90px;
        }
      }
      &__content {
        padding-bottom: 0;
      }
    }
  }

  .swiper {
    width: 200px;
    margin: 0 0 0 20px !important;
    height: calc(100% - 40px) !important;
    position: fixed;
    right: 20px;
    &.gallery-thumbs {
      margin-top: 10px;
      .swiper-slide {
        height: 100%;
        opacity: 0.4;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
        }
        &-active {
          opacity: 1;
        }
      }
    }
  }
}
/deep/ .el-image {
  height: 40vh;
  min-height: 150px;
}
</style>