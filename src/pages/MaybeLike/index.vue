<template>
  <el-main class="main maybe-like">
    <ImageWithMethod
      :src="item.src"
      class="maybe-like-image"
      fit="cover"
      v-for="(item, index) in sortedList"
      :key="index"
      :href="item.href"
      :index="index"
      :options="{ isPreview: true,isDownload:true }"
      @change="handleChange"
    />
  </el-main>
</template>

<script>
import ImageWithMethod from "../../components/ImageWithMethod";
export default {
  data() {
    return {
      list: [
        {
          src: "https://img14.360buyimg.com/n0/jfs/t1/73729/22/19594/86063/63a55da8Eff2883ff/be79926923634e87.jpg",
          href: "https://item.jd.com/10067467499788.html",
        },
        {
          src: "https://img12.360buyimg.com/n1/jfs/t1/66215/7/18290/209291/628f2b9bE8e2b795b/5ea91b7d9e10fb83.jpg",
          href: "https://item.jd.com/10053067569807.html",
        },
        {
          src: "https://img14.360buyimg.com/n1/s350x467_jfs/t1/181269/30/22219/675081/62446e92Ea5363a36/b046cab492dc601d.jpg!cc_350x467",
          href: "https://item.jd.com/10047920397224.html",
        },
        {
          src: "https://img14.360buyimg.com/n1/s350x467_jfs/t1/210042/27/30962/91789/6408405bFd9653f63/9e66a00b1276ad60.jpg!cc_350x467",
          href: "https://item.jd.com/10070388456384.html",
        },
        {
          src: "https://img11.360buyimg.com/n1/s350x467_jfs/t1/133194/19/33537/68656/63ec4fd2F62615df0/05aa471a901f26b4.jpg!cc_350x467",
          href: "https://item.jd.com/10068913840006.html",
        },
        {
          src: "https://img14.360buyimg.com/n1/s350x467_jfs/t1/138856/27/33462/66252/63e33f27F95647c2b/24437fa8642c794f.jpg!cc_350x467",
          href: "https://item.jd.com/10068479942124.html",
        },
        {
          src: "https://img10.360buyimg.com/n1/jfs/t1/111747/30/21308/470142/620a0ba8E87678e9c/7b6e063b786e6cfd.jpg",
          href: "https://item.jd.com/100032738680.html",
        },
        {
          src: "https://img13.360buyimg.com/n1/s350x467_jfs/t1/203454/12/27338/168896/63b65e69Fd7f0baad/a8bcb3eb9967f41b.jpg!cc_350x467",
          href: "https://item.jd.com/10027977631568.html",
        },
        {
          src: "https://img10.360buyimg.com/n1/s350x467_jfs/t1/223375/33/23308/313833/63d9c7d3Fa2e82520/97297caa3dcc8648.jpg!cc_350x467",
          href: "https://item.jd.com/100033958645.html",
        },
        {
          src: "https://img14.360buyimg.com/n0/jfs/t1/9531/12/20877/160556/63f45c06F2f29127c/d1fd97f267da0f01.jpg",
          href: "https://item.jd.com/10068104698157.html",
        },
        {
          src: "https://img13.360buyimg.com/n1/jfs/t1/145678/34/31492/99436/638570a0Edf7de3f5/03c2c438667dd88a.jpg",
          href: "https://item.jd.com/100049635473.html",
        },
        {
          src: "https://img14.360buyimg.com/n0/jfs/t1/105748/32/10007/164872/5e15b133E2f3d0c89/42d3470379514a69.jpg",
          href: "https://item.jd.com/65195881953.html",
        },
        {
          src: "https://img14.360buyimg.com/n1/jfs/t1/83787/17/20920/86702/64264ab5Fb5eaa922/eb3df0fe6801c4a8.jpg",
          href: "https://item.jd.com/100030254469.html",
        },
        {
          src: "https://img14.360buyimg.com/n0/jfs/t1/184764/17/32072/45848/63dcc669Fb6d2b921/c34ba8d53c8d72f6.jpg",
          href: "https://item.jd.com/10068048278868.html",
        },
        {
          src: "https://img11.360buyimg.com/n1/s350x467_jfs/t1/1757/25/21155/24799/63c7bbfdF3c4f6bd7/e5ac88060d649b58.png!cc_350x467",
          href: "https://item.jd.com/10067991861991.html",
        },
        {
          src: "https://img13.360buyimg.com/n1/s350x467_jfs/t1/31246/8/16749/429026/62d576f4E7a728a86/7837962659907a64.jpg!cc_350x467",
          href: "https://item.jd.com/10056356888463.html",
        },
        {
          src: "https://img14.360buyimg.com/n0/jfs/t1/213206/29/23647/79195/6371a50aEc0caa62b/37eaddd7c5e91b0a.jpg",
          href: "https://item.jd.com/10049619594471.html",
        },
        {
          src: "https://img10.360buyimg.com/n1/s350x467_jfs/t1/88554/39/23640/30805/642c5bb5Ff313a98a/117b9a1709d8c502.jpg!cc_350x467",
          href: "https://item.jd.com/10068933878835.html",
        },
      ],
    };
  },
  computed: {
    sortedList() {
      return this.list.sort(() => Math.random() - 0.5);
    },
  },
  components: {
    ImageWithMethod,
  },
  methods:{
    handleChange(index,url){
      this.list[index].src=url
    }
  }
};
</script>

<style lang="less" scoped>
.maybe-like {
  box-sizing: border-box;
  display: grid;
  gap: @margin;
  grid-template-columns: repeat(6, 1fr);
  &-image {
    aspect-ratio: 1/1;
    min-height: 10vh;

    &:first-child {
      grid-area: 1/3/3/6;
    }
    &:last-child {
      grid-area: 3/1/6/4;
    }
    &:nth-child(2) {
      grid-area: 2/1/3/3;
    }
    &:nth-child(3) {
      grid-area: 6/1/8/3;
    }
    &:nth-last-child(3) {
      grid-area: 5/4/7/6;
    }
    &:nth-last-child(2) {
      grid-area: 3/5/5/7;
    }
  }

  @media screen and(max-width:768px) {
    grid-template-columns: repeat(3, 1fr);
    &-image {
      &:first-child {
        grid-area: 1/1/4/3;
      }
      &:last-child {
        grid-area: 7/1/9/3;
      }
      &:nth-child(2) {
        grid-area: 4/2/7/4;
      }
      &:nth-child(3) {
        grid-area: 10/1/14/2;
      }
      &:nth-last-child(3) {
        grid-area: 9/2/13/4;
      }
      &:nth-last-child(2) {
        grid-area: auto;
      }
    }
  }
}
</style>