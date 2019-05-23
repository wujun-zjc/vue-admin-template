<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>猪况总览</span>
        <el-button
          style="float: right;font-size:50px; padding:0;line-height:0;padding-top:8px;"
          type="text"
        >···</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        stripe
        show-summary
        style="width: 100%;"
      >
        <el-table-column label="猪舍名称" prop="name" align="center" min-width="180px"></el-table-column>
        <el-table-column label="在栏" prop="live" align="center"></el-table-column>
        <el-table-column label="死亡" prop="death" align="center"></el-table-column>
        <el-table-column label="隔离" prop="leave" align="center"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import info from '@/json/home/overview'
export default {
  data() {
    return {
      listLoading: false,
      list: []
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getList();
  },
  methods: {
    //列表获取
    getList() {
      //模拟请求
      this.list=info.result
    }
  }
};
</script>
<style lang="scss" scoped>
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  div span {
    font-size: 16px;
    font-weight: bolder;
    display: inline-block;
    height: 28px;
    line-height: 28px;
  }
}
</style>

