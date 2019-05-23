<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>猪舍环境状况总览</span>
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
        style="width: 100%;"
      >
        <el-table-column label="猪舍名称" prop="name" align="center" min-width="180px"></el-table-column>
        <el-table-column label="温度" prop="temperature" align="center"></el-table-column>
        <el-table-column label="湿度" prop="wet" align="center"></el-table-column>
        <el-table-column label="CO2(mg/m³)" prop="CO" align="center" min-width="120px"></el-table-column>
        <el-table-column label="NH3(mg/m³)" prop="NH" align="center" min-width="120px"></el-table-column>
      </el-table>
      <div class="pagination-wraper">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="current_page"
          :limit.sync="page_size"
          @pagination="getList"
        />
      </div>
    </el-card>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination";
import info from '@/json/home/environment'
export default {
  name: "Environment",
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      total: 0,
      current_page: 1,
      page_size: 10,
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
    getList() {
      //模拟请求
      this.list=info.result;
      this.total=info.total;
      this.current_page=info.current_page;
      this.page_size=info.page_size;
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
