<template>
  <div class="app">
    <div class="box">
      <div class="circle">
        <img src="@/assets/person.png" class="image" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="less" scoped>
@size: 300px;
@ratio: 1.25;
@small: 0.9;

* {
  transition: all 0.3s;
}

.app {
  height: @size;
  width: @size;
  margin: 100px auto;
  border-radius: 50%;
  filter: drop-shadow(0 0 20px @font);
  .box {
    height: calc(@size * @ratio);
    width: @size;
    transform: translateY(calc(@size * (1 - @ratio)));
    overflow: hidden;
    background-color: transparent;
    border-radius: 0 0 calc(@size / 2) calc(@size / 2);
    position: relative;
    pointer-events: none;
    .circle {
      height: @size;
      width: @size;
      position: absolute;
      bottom: 0;
      border-radius: 50%;
      box-sizing: border-box;
      background: radial-gradient(circle at 50% 50%, #fff, @color 100%);
      .image {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
  }

  &:hover {
    transform-origin: bottom center;
    transform: scale(@small);
    .image {
      transform-origin: bottom center;
      transform: scale(@ratio);
      pointer-events: all;
    }
  }
}
</style>