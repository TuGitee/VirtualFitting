<template>
  <div>
    <el-autocomplete
      popper-class="my-autocomplete"
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="搜索你预期的场景"
      @select="handleSelect"
      suffix-icon="el-icon-edit"
      :highlight-first-item="true"
    >
      <template slot-scope="{ item }">
        <h4 class="name" :class="{disabled:item.disabled}">{{ item.value }}</h4>
        <p class="tags">{{ item.tags?.join(' ') }}</p>
      </template>
    </el-autocomplete>
    <el-table :data="data" style="width: 100%" @row-click="select">
      <el-table-column prop="background" label="热门背景">
      </el-table-column>
      <el-table-column prop="usage" label="使用量" sortable :formatter="formatter"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      state: "",
      data: [
        {
          background: "海边沙滩",
          usage: 123912,
        },
        {
          background: "古典建筑",
          usage: 4350,
        },
        {
          background: "繁华都市",
          usage: 764,
        },
        {
          background: "纯色风格",
          usage: 87212
        }
      ],
    };
  },
  methods: {
    querySearch(queryString, cb) {
      let list = this.list;
      let results = queryString
        ? list.filter(this.createFilter(queryString))
        : list;
      if (results.length === 0) {
        results = [{ value: "未匹配到相关场景", disabled: true }];
      }
      cb(results);
    },
    createFilter(queryString) {
      const reg = new RegExp(
          `^.*${queryString
            .split("")
            .map((item) => `(?=.*${item}.*)`)
            .join("")}.*$`
        );
      return (list) => {
        return reg.test(list.value + list.tags.join(' '));
      };
    },
    loadAll() {
      this.$axios.get("http://localhost:34000/list").then((res) => {
        this.list = res.data;
      });
    },
    handleSelect(item) {
      if(item.disabled){
        this.state = '';
        return;
      }
      console.log(item)
      this.$bus.$emit("searchBackground", item);
    },
    formatter(col,row){
      // 格式化数字
      return col.usage.toLocaleString()
    },
    select(col,row){
      this.state=col.background
    }
  },
  mounted() {
    this.backgroundList = this.loadAll();
  },
};
</script>

<style lang="less" scoped>
.my-autocomplete {
  .el-autocomplete-suggestion__wrap {
    padding: 0;
  }
  ul > li {
    padding: 7px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: normal;
      margin: 10px 0;
      color: #333;
      font-weight: normal;
    }
    .tags {
      font-size: 12px;
      color: #b4b4b4;
      line-height: normal;
      margin-bottom: 10px;
    }
    .disabled {
      text-align: center;
      pointer-events: none;
      user-select: none;
      font-style: italic;
      color: #888;
    }
  }
  .highlighted .tags {
    color: #777;
  }
}
</style>