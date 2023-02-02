<template>
  <div @mouseenter="enter" @mouseleave="leave" id="root" v-loading="isloading">
    <swiper class="swiper" ref="swiper" :options="options">
      <swiper-slide
        class="swiper-slide"
        v-for="(item, index) in list"
        :key="index"
        :class="{ focus: focusIndex === index }"
      >
        <img :src="require('@/assets/images/background/' + item.url)" />
      </swiper-slide>
      <!-- 如果需要导航按钮 -->
      <div
        class="swiper-button-prev"
        slot="button-prev"
        v-show="list.length > 1"
      ></div>
      <div
        class="swiper-button-next"
        slot="button-next"
        v-show="list.length > 1"
      ></div>
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
        <img :src="require('@/assets/images/background/' + item.url)" />
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
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
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
    },
    leave() {
      if (this.isAbleMove) this.swiper.autoplay.start();
    },
    h5BlobUrlToBlobObj(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function onload(e) {
        if (this.status === 200) {
          const Blob = this.response;
          resolve(Blob);
        } else {
          reject(this.status, e);
        }
      };
      xhr.send();
    })
    },
    async focus(e, that) {
      let clickedIndex = that.clickedIndex;
      if (clickedIndex === undefined) return;
      if (vm.focusIndex !== clickedIndex) {
        let image = new Image();
        image.src = e.target.currentSrc;
        if (!image.src) return;
        this.isloading = true;
        image.onload = () => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", image.src, true);
          xhr.responseType = "blob";
          xhr.send();
          xhr.onload = async (e) => {
            if (xhr.status == 200) {
              await this.$bus.$emit("uploadPhoto", this.type, {
                url: await this.h5BlobUrlToBlobObj(URL.createObjectURL(xhr.response)),
                filename: +new Date()
              });
              this.isloading = false;
            }
          };
          // const percentage = 2;
          // const canvas = document.createElement("canvas");
          // const ctx = canvas.getContext("2d");
          // canvas.height = image.height / percentage;
          // canvas.width = image.width / percentage;
          // ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          // const base64 = canvas.toDataURL("image/png");
          // let arr = base64.split(','),mime=arr[0].match(/:(.*?);/)[1],bstr=atob(arr[1]),n=bstr.length,u8arr=new Uint8Array(n)
          // while(n--) u8arr[n]=bstr.charCodeAt(n)
          // let blob = new Blob([u8arr],{type:mime})
          // this.$bus.$emit("uploadPhoto", this.type, base64);
        };
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
  beforeUpdate() {
    this.swiper.params.loopedSlide = this.list.length === 1 ? 1 : 2;
    this.swiperThumbs.params.loopedSlide = Math.min(this.list.length, 6);
    this.swiper.params.slidesPerView = this.list.length === 1 ? 1 : 2;
    this.swiperThumbs.params.slidesPerView = Math.min(this.list.length, 6);
  },
};
</script>

<style lang="less" scoped>
@theme-color: #fff;
#root {
  border: 2px dashed #2d8cf0;
  border-radius: 4px;
  padding: 10px;
  .swiper {
    height: 220px;
    max-width: 700px;
    background-color: @theme-color;
    &-slide {
      width: 100%;
      height: 100%;
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
      margin-top: 10px;
      height: 60px;
      .swiper-slide {
        width: 16%;
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
  .focus {
    padding: 10px;
    border: 2px dashed orange;
    border-radius: 10px;
  }
}
</style>