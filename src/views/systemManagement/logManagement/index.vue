<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        placeholder="操作人"
        clearable
        v-model="listQuery.operator"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        placeholder="操作模块"
        clearable
        v-model="listQuery.interface_id"
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in models" :key="item.id" :label="item.text" :value="item.id"/>
      </el-select>
      <el-select
        clearable
        placeholder="操作类型"
        v-model="listQuery.method_id"
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in modelMethods" :key="item.id" :label="item.text" :value="item.id"/>
      </el-select>
      <el-date-picker
        v-model="dateRate"
        type="datetimerange"
        range-separator="至"
        align="right"
        start-placeholder="操作开始日期"
        end-placeholder="操作结束日期"
        :default-time="['00:00:00', '00:00:00']"
        style="width: 404px"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset">重置</el-button>
    </div>
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
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column label="操作模块" prop="model_name" align="center"></el-table-column>
        <el-table-column label="操作类型" prop="method_name" align="center" min-width="200px"></el-table-column>
        <el-table-column label="操作人" prop="operator" align="center"></el-table-column>
        <el-table-column label="操作时间" prop="operation_time" align="center" width="180px"></el-table-column>
        <el-table-column label="操作" prop="operate" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wraper">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current_page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
import {
  getModelList,
  getMethodList,
  getLogPageList,
  del
} from '@/api/systemManagement/logManagement'
export default {
  name: 'LogManagement',
  components: { Pagination },
  data() {
    return {
      dateRate: [],
      listQuery: {
        current_page: 1,
        page_size: 10,
        operator: undefined,
        interface_id: undefined,
        method_id: undefined,
        date_start: undefined,
        date_end: undefined
      },
      models: [],
      modelMethods: [],
      // pickerOptions2: {
      //   shortcuts: [{
      //     text: '最近一周',
      //     onClick(picker) {
      //       const end = new Date();
      //       const start = new Date();
      //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      //       picker.$emit('pick', [start, end]);
      //     }
      //   }, {
      //     text: '最近一个月',
      //     onClick(picker) {
      //       const end = new Date();
      //       const start = new Date();
      //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      //       picker.$emit('pick', [start, end]);
      //     }
      //   }, {
      //     text: '最近三个月',
      //     onClick(picker) {
      //       const end = new Date();
      //       const start = new Date();
      //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      //       picker.$emit('pick', [start, end]);
      //     }
      //   }]
      // },
      list: [],
      total: 0,
      listLoading: false
    }
  },
  created() {
    this.getList()
    this.getModel()
  },
  watch: {
    dateRate(val) {
      this.listQuery.date_start = val.length ? parseTime(val[0]) : undefined
      this.listQuery.date_end = val.length ? parseTime(val[1]) : undefined
      this.handleFilter()
    },
    'listQuery.interface_id'(val) {
      if (val) {
        this.getMethod()
      } else {
        this.modelMethods = []
        this.listQuery.method_id = undefined
      }
    }
  },
  methods: {
    getList() {
      // 模拟请求
      this.listLoading = true
      // .then => success 成功回调  .catch => fail 失败
      getLogPageList(this.listQuery)
        .then(response => {
          this.listLoading = false
          this.list = response.obj.result
          //console.log(this.list);
          this.total = response.obj.total
          this.listQuery.current_page = response.obj.current_page
          this.listQuery.page_size = response.obj.page_size
        })
        .catch(res => {
          console.log(res)
        })
    },
    getModel() {
      getModelList()
        .then(response => {
          this.models = response.obj
          console.log(response)
        })
        .catch(res => {
          console.log(res)
        })
    },
    getMethod() {
      getMethodList({ interface_id: this.listQuery.interface_id })
        .then(response => {
          this.modelMethods = response.obj
          //console.log(response)
        })
        .catch(res => {
          console.log(res)
        })
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.dateRate = []
      this.listQuery = {
        page_size: 10,
        current_page: 1,
        operator: undefined,
        interface_id: undefined,
        method_id: undefined,
        date_start: undefined,
        date_end: undefined
      }
    },
    handleDelete(id) {
      this.$confirm('确认要删除此基地信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del({ id: id })
            .then(response => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.handleFilter()
            })
            .catch(res => {
              console.log(res)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
