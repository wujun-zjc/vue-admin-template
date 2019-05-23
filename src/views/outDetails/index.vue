<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <div class="filter-container">
      <el-input
        placeholder="物资编码"
        v-model="listQuery.code"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        placeholder="物资名称"
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        placeholder="物资分类"
        v-model="listQuery.classification"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in classifications" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select
        placeholder="种类细分"
        v-model="listQuery.type"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in types" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select
        placeholder="仓库编号"
        v-model="listQuery.houseId"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in houseIds" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-input
        placeholder="生产厂家"
        v-model="listQuery.address"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        placeholder="供应商"
        v-model="listQuery.suppliers"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 404px"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset">重置</el-button>
    </div>
    <!-- 列表展示 -->
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        stripe
        style="width: 100%;"
      >
        <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>

        <el-table-column label="仓库编号" prop="houseId" align="center" width="90px"></el-table-column>

        <el-table-column label="物资编码" prop="code" align="center" width="90px"></el-table-column>

        <el-table-column label="物资名称" prop="name" align="center" min-width="100px"></el-table-column>

        <el-table-column label="物资分类" prop="classification" align="center" min-width="150px"></el-table-column>

        <el-table-column label="种类细分" prop="type" align="center" min-width="150px"></el-table-column>

        <el-table-column label="原始库存量" prop="origNum" align="center" min-width="150px"></el-table-column>
        <el-table-column label="出库量" prop="outNum" align="center" min-width="150px"></el-table-column>
        <el-table-column label="现有库存量" prop="nowNum" align="center" min-width="150px"></el-table-column>
        <el-table-column label="单位" prop="unit" align="center" min-width="150px"></el-table-column>
        <el-table-column label="生产厂家" prop="address" align="center" min-width="150px"></el-table-column>
        <el-table-column label="用途" prop="use" align="center" min-width="150px"></el-table-column>
        <el-table-column label="供应商" prop="suppliers" align="center" min-width="150px"></el-table-column>
        <el-table-column label="操作人" prop="operator" align="center" width="100px"></el-table-column>
        <el-table-column label="操作时间" prop="time" align="center" width="150px">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.time | parseTime }}</span>
          </template>-->
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wraper">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import { getToken } from "@/utils/auth";
import { getTableData } from "@/api/outDetails/outDetails";
export default {
  name: "outDetails",
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        code: "",
        name: undefined,
        address: undefined,
        houseId: undefined,
        classification: undefined,
        type: undefined,
        suppliers: undefined,
        date: undefined
      },
      classifications: [
        {id: "0", name: "肥料"},
        {id: "1", name: "农药"}
      ],
      types: ["charges-1", "charges-2", "charges-3", "charges-4", "charges-5"],
      houseIds: ["ck-1", "charges-2", "charges-3", "charges-4", "charges-5"]
    };
  },
  created() {
    this.getList();
  },

  methods: {
    getList() {
      this.listLoading = true;

      // .then => success 成功回调  .catch => fail 失败
      getTableData(this.listQuery)
        .then(response => {
          this.listLoading = false;
          this.list = response.obj.result;
          this.total = response.obj.total;
        })
        .catch(res => {
          console.log(res);
        });

    },
    //搜索
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    //重置
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        code: "",
        name: undefined,
        address: undefined,
        houseId: undefined,
        classification: undefined,
        type: undefined,
        suppliers: undefined,
        date: undefined
      };
    }
  }
};
</script>
