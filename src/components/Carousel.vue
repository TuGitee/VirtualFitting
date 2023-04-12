<template>
  <div @mouseenter="enter" @mouseleave="leave" id="root" v-loading="isloading">
    <swiper class="swiper" ref="swiper" :options="options">
      <swiper-slide
        class="swiper-slide"
        v-for="(item, index) in list"
        :key="index"
        :class="{ focus: focusIndex === index }"
      >
        <img :src="require('@/assets/images/' + item.url)" />
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
        <img :src="require('@/assets/images/' + item.url)" />
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
        slidesPerView: 4,
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
        slidesPerView: 8,
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
    async focus(e, that) {
      let clickedIndex = that.clickedIndex;
      if (clickedIndex === undefined) return;
      if (vm.focusIndex !== clickedIndex) {
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
    if (window.innerWidth < 768) {
      this.options.slidesPerView = 1.2;
      this.swiperOptionThumbs.slidesPerView = 3;
    }
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
  box-shadow: @box-shadow;
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
      transform: scale(0.8);
      opacity: 0.5;
      transition: 0.5s all;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: @margin;
      }
      &-active {
        width: 100%;
        height: 100%;
        transform: scale(1);
        opacity: 1;
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