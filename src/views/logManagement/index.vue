<template>
  <div class="app-container">
      <div class="filter-container">
        <el-input placeholder="操作人" v-model="listQuery.operator" style="width: 200px;" class="filter-item"  @keyup.enter.native="handleFilter"/>
        <el-select placeholder="操作模块" v-model="listQuery.operateModule" clearable style="width: 200px" class="filter-item">
          <el-option v-for="item in operateModules" :key="item" :label="item" :value="item"/>
        </el-select>
        <el-select placeholder="操作类型" v-model="listQuery.operateType" clearable style="width: 200px" class="filter-item">
          <el-option v-for="item in operateTypes" :key="item" :label="item" :value="item"/>
        </el-select>
        <el-date-picker v-model="listQuery.operateTime"  type="datetimerange" :picker-options="pickerOptions2" range-separator="至" align="right" start-placeholder="操作开始日期" end-placeholder="操作结束日期" :default-time="['00:00:00', '00:00:00']">
        </el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search"  @click="handleFilter">查询</el-button>
        <el-button class="filter-item" icon="el-icon-refresh"  @click="handleReset">重置</el-button>
      </div>
      <div class="table-container">
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%;">
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column label="操作模块" prop="module" align="center" width="90px"></el-table-column>
          <el-table-column label="操作类型" prop="type" align="center" min-width="100px"></el-table-column>
          <el-table-column label="操作人" prop="operator" align="center" width="100px"></el-table-column>
          <el-table-column label="操作时间" prop="time" align="center" width="150px">
          </el-table-column>
          <el-table-column label="操作" prop="operate" align="center" width="220px" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.operate.indexOf('delete') != -1" size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wraper">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      </div>
   
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  name: 'LogManagement',
  components: { Pagination },
  data() {
    return {
      listQuery:{
        page: 1,
        limit: 10,
        operator: undefined,
        operateModule: undefined,
        operateType: undefined,
        operateTime: undefined
      },
      operateModules:[
        "operateModules-1",
        "operateModules-2",
        "operateModules-3"
      ],
      operateTypes:[
        "operateTypes-1",
        "operateTypes-2",
        "operateTypes-3"
      ],
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      list: [],
      total: 0,
      listLoading: false,
      formData: {
        module: '',
        type: '',
        operator: '',
        time: ''
      },
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
      // 模拟请求
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false;
        this.total= 3;
        this.list = [
          {module: '登录',type: '登录',operator:'张三',time:'2019-2-12 12:00:00',operate:['delete']},
          {module: '登录',type: '修改密码',operator:'张三',time:'2019-2-12 13:00:00',operate:['delete']},
          {module: '设备管理',type: '新增',operator:'张三',time:'2019-2-12 14:00:00',operate:['delete']},
        ]
      }, 1.5 * 1000)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList();
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        operator: undefined,
        operateModule: undefined,
        operateType: undefined,
        operateTime: undefined
      }
    },
    handleDelete(id) {
      this.$confirm('确认要删除此日志信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify({
          title: '成功',
          messhandleDeleteage: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
  
}
</script>
