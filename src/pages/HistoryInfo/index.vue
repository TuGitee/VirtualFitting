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
            placeholder="请输入日期进行检索"
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
        :key="historyItem.id"
        :name="historyItem.id"
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
          :src="historyItem.url"
          class="el-collapse-item__image"
          @handleRemove="deleteItem"
          :index="index"
          fit="contain"
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
        :data-value="item.id"
        :key="index"
      >
        <img :src="formatUrl(item.url)" />
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
      historyList: JSON.parse(localStorage.getItem("history"))||[],
      swiperOptionThumbs: {
        direction: "vertical",
        mousewheel: true,
        spaceBetween: 10,
        centeredSlides: true,
        observer: true,
        observeParents: true,
        slidesPerView: 4,
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
    formatUrl(url) {
      if (!url) return null;
      else if (url.includes("base64")) {
        return URL.createObjectURL(this.dataURLtoBlob(url));
      } else if (url.includes("http")) {
        return url;
      } else {
        return require("@/assets/" + url);
      }
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
    goUpload() {
      this.$router.push("/virtual-fitting");
    },
    deleteItem(index) {
      this.historyList.splice(index, 1);
      localStorage.setItem("history", JSON.stringify(this.historyList));
    },
    search() {
      this.activeIndex = [];
      if (this.searchText.trim() === "") return;
      this.historyList.filter((item) => {
        if (item.time.includes(this.searchText)) {
          this.activeIndex.push(item.id);
        }
      });
      this.scrollTo();
    },
    scrollTo() {
      this.$nextTick(() => {
        setTimeout(() => {
          document
            .querySelector(
              ".el-collapse-item.is-active:not(.main-history-search)"
            )
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      });
    },
    async focus(e, that) {
      let clickedIndex = that.clickedIndex;
      if (!that.clickedSlide) return;
      if (clickedIndex === undefined) return;
      this.activeIndex=Number(that.clickedSlide.getAttribute("data-value"));
      this.scrollTo();

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
    height: fit-content;
    &-search {
      margin-bottom: @margin;
      .search-input {
        height: 100%;
        /deep/ .el-input__inner {
          background-color: transparent;
          height: 100%;
          border: none;
          color: @white;
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
    /deep/ &.el-collapse {
      width: calc(100% - 220px);
      border: none;
      .el-collapse-item {
        height: fit-content;
        background-color: @background;
        border-radius: 16px;
        overflow: hidden;
        border: none;
        &:not(:last-child) {
          margin-bottom: @margin;
        }
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
          background-color: @background;
          border: none;
          &-title {
            width: 150px;
            margin-left: @margin;
          }
          .el-button.el-button--danger {
            position: absolute;
            right: 10px;
            padding: 10px 20px;
            background-color: @background;
            border-radius: 8px;
            border: none;
            color: @color-light;
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
  }
  &-warning {
    flex: 1;
    height: 50vh;
    color: @white;
    transform: translateY(50%);
    background-color: @background;
    border-radius: @margin;
    position: relative;
    overflow: hidden;
    /deep/ .el-result__title p {
      color: @white;
    }
    /deep/ .el-result__subtitle p {
      color: @white;
    }
    /deep/ .el-result__extra button {
      background-color: @color;
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
      left: -100%;
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

  .swiper {
    width: 200px;
    margin: 0 0 0 @margin !important;
    height: calc(100% - @margin * 2) !important;
    position: fixed;
    right: @margin;
    &.gallery-thumbs {
      margin-top: 10px;
      .swiper-slide {
        height: 100%;
        opacity: 0.4;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: @margin;
        }
        &-active {
          opacity: 1;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    &-history {
      width: 100%;
      &-search {
        .search-input {
          width: 100%;
        }
      }
      /deep/ &.el-collapse {
        width: 100%;
      }
    }
    &-warning {
      width: 80%;
      height: 50%;
      border-radius: @margin;
    }
    & .gallery-thumbs {
      display: none;
    }
  }
}
/deep/ .el-image {
  height: 40vh;
  min-height: 150px;
}
</style>