<template>
  <div @mouseenter="enter" @mouseleave="leave" id="root" v-loading="isloading">
    <swiper class="swiper" ref="swiper" :options="options">
      <swiper-slide
        class="swiper-slide"
        v-for="(item, index) in list"
        :key="index"
        :class="{ focus: focusIndex === index }"
      >
        <img :src="require('@/assets/' + item.url)" />
      </swiper-slide>
    </swiper>
    <swiper
      class="swiper gallery-thumbs"
      :options="swiperOptionThumbs"
      ref="swiperThumbs"
    >
      <swiper-slide
        class="swiper-slide"
        v-for="(item, index) in list"
        :key="index"
        :class="{ focus: focusIndex === index }"
      >
        <img :src="require('@/assets/' + item.url)" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
let vm = null;
export default {
  name: "Carousel",
  props: ["list", "type"],
  data() {
    return {
      focusIndex: -1,
      isAbleMove: true,
      isloading: false,
      navShow: false,
      options: {
        slidesPerView: 2,
        grabCursor: true,
        centeredSlides: true,
        observer: true,
        observeParents: true,
        speed: 1000,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        on: {
          slideChange() {},
          tap(e) {
            vm.focus(e, this);
          },
        },
      },
      swiperOptionThumbs: {
        spaceBetween: 10,
        centeredSlides: true,
        observer: true,
        observeParents: true,
        slidesPerView: 6,
        touchRatio: 0.1,
        slideToClickedSlide: true,
        on: {
          tap(e) {
            vm.focus(e, this);
          },
        },
      },
    };
  },
  computed: {
    swiper() {
      return this.$refs.swiper.swiper;
    },
    swiperThumbs() {
      return this.$refs.swiperThumbs.swiper;
    },
  },
  methods: {
    enter() {
      if (this.isAbleMove) this.swiper.autoplay.stop();
      this.navShow = true;
    },
    leave() {
      if (this.isAbleMove) this.swiper.autoplay.start();
      this.navShow = false;
    },
    // h5BlobUrlToBlobObj(url) {
    //   return new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open("GET", url, true);
    //     xhr.responseType = "blob";
    //     xhr.onload = function onload(e) {
    //       if (this.status === 200) {
    //         const Blob = this.response;
    //         resolve(Blob);
    //       } else {
    //         reject(this.status, e);
    //       }
    //     };
    //     xhr.send();
    //   });
    // },
    async focus(e, that) {
      let clickedIndex = that.clickedIndex;
      if (clickedIndex === undefined) return;
      if (vm.focusIndex !== clickedIndex) {
        // let image = new Image();
        // image.src = e.target.currentSrc;
        // if (!image.src) return;
        // this.isloading = true;
        // image.onload = () => {
        //   const xhr = new XMLHttpRequest();
        //   xhr.open("GET", image.src, true);
        //   xhr.responseType = "blob";
        //   xhr.send();
        //   xhr.onload = async (e) => {
        //     if (xhr.status == 200) {
        //       await this.$bus.$emit("uploadPhoto", this.type, {
        //         url: await this.h5BlobUrlToBlobObj(
        //           URL.createObjectURL(xhr.response)
        //         ),
        //         filename: +new Date(),
        //       });
        //       this.isloading = false;
        //     }
        //   };
        // };
        vm.focusIndex = clickedIndex;
        vm.isAbleMove = false;
        vm.swiper.autoplay.stop();
        this.swiper.slideTo(clickedIndex);
      } else {
        vm.isAbleMove = true;
        vm.focusIndex = -1;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      const swiper = this.swiper;
      const swiperThumbs = this.swiperThumbs;
      swiper.controller.control = swiperThumbs;
      swiperThumbs.controller.control = swiper;
    });
  },
  created() {
    vm = this;
  },
};
</script>

<style lang="less" scoped>
#root {
  border-radius: @margin;
  background-color: @background;
  box-shadow: 0 0 20px -10px #1c1f3e;
  padding: 1% 0;
  img {
    border-radius: 10px;
  }
  .swiper {
    height: 78%;
    &-slide {
      width: 100%;
      height: initial !important;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: scale(0.6);
      transition: 0.5s all;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      &-active {
        width: 100%;
        height: 100%;
        transform: scale(1);
      }
    }
    &.gallery-thumbs {
      margin-top: 1%;
      height: 20%;
      .swiper-slide {
        height: 100%;
        opacity: 0.4;
        transform: scale(1);
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        &-active {
          opacity: 1;
        }
      }
    }
  }
}
</style>