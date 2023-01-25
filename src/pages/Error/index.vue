<template>
  <el-empty :description="msg"> </el-empty>
</template>

<script>
export default {
  data() {
    return {
      msg: `Error! Can't find the page of ${this.$route.path} !`,
    };
  },
};
</script>

<style>
</style>