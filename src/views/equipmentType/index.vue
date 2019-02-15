<template>
  <div class="app-container">
    <!-- 条件筛选 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.number"
        style="width:200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        placeholder="设备类型编号"
      ></el-input>
      <el-input
        placeholder="设备类型"
        v-model="listQuery.type"
        style="width:200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-input
        placeholder="备注"
        v-model="listQuery.remarks"
        style="width:200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-button icon="el-icon-search" class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
      <el-button icon="el-icon-refresh" class="filter-item" type="danger" @click="handleReset">重置</el-button>
    </div>
    <!-- 表格展示 -->
    <div class="table-container">
      <div class="table-operation">
        <el-button
          class="table-operation-button"
          size="mini"
          icon="el-icon-edit"
          @click="handleCreate"
        >新增</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        stripe
        border
        filter
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="number" label="编号" align="center" width="60"></el-table-column>
        <el-table-column prop="equipmentNumber" label="设备类型编号" align="center" width="120"></el-table-column>
        <el-table-column prop="equipmentType" align="center" label="设备类型" width="140"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center" width="200"></el-table-column>
        <el-table-column prop="Operator" label="操作人" align="center" width="140"></el-table-column>
        <el-table-column label="操作时间" prop="OperatorDate" align="center" width="150px">
          <!-- <template slot-scope="scope">
                  <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="operate" align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.operate.indexOf('edit') != -1"
              size="mini"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.operate.indexOf('view') != -1"
              size="mini"
              @click="handleView(scope.row)"
            >查看</el-button>
            <el-button
              v-if="scope.row.operate.indexOf('delete') != -1"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-wraper">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <!-- 编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="formData"
        :disabled="dialogFormDisabled"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="设备类型" prop="equipmentType">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="formData.equipmentType"
            type="text"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            :autosize="{ minRows: 8, maxRows: 16}"
            v-model="formData.remarks"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleComfirm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'EquipmentType',
  components: { Pagination },
  data() {
    return {
      total: 0,
      listLoading: false,
      dialogStatus: '',
      dialogFormVisible: false, //顯示與不顯示彈框
      dialogFormDisabled: false,
      textMap: {
        add: '新增',
        view: '查看',
        edit: '编辑'
      },
      listQuery: {
        page: 1,
        limit: 10, //每页的数量
        number: undefined, //设备编号
        type: undefined, //设备类型
        remarks: undefined //备注
      },
      list: [],
      formData: {
        equipmentType: '',
        remarks: ''
      },
      rules: {
        //规则
        equipmentType: [
          { required: true, message: '设备类型是必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //列表展示
    getList() {
      // this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
      //模拟请求
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
        this.total = 2
        if (this.listQuery.page == 1) {
          this.list = [
            {
              number: 1,
              equipmentNumber: 'SB0001',
              equipmentType: '王小虎',
              remarks: '2016-05-02',
              Operator: '张三',
              OperatorDate: '2016-05-02',
              operate: ['edit', 'view', 'delete']
            },
            {
              number: 2,
              equipmentNumber: 'SB0001',
              equipmentType: '王小虎',
              remarks: '2016-05-02',
              Operator: '张三',
              OperatorDate: '2016-05-02',
              operate: ['edit', 'view', 'delete']
            }
          ]
        }
      }, 1.5 * 1000)
    },
    //搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    //新增
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'add' //彈框的標題是新增
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.$nextTick(() => {
        //在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
        this.$refs['dataForm'].clearValidate() //移除表单项的校验结果
      })
    },
    //编辑
    handleUpdate(row) {
      this.formData = Object.assign({}, row) //可以为已有的对象赋予多个新属性
      this.dialogStatus = 'edit' //彈框的標題是编辑
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //查看
    handleView(row) {
      this.formData = Object.assign({}, row)
      this.dialogStatus = 'view' //彈框的標題是查看
      this.dialogFormVisible = true
      this.dialogFormDisabled = true //不可修改狀態
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //删除
    handleDelete(id) {
      this.$confirm('确认要删除此条信息么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      //  const index = this.list.indexOf(row)
      // this.list.splice(index, 1)
    },
    //重置
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        number: undefined, //设备编号
        type: undefined, //设备类型
        remarks: undefined //备注
      }
    },
    //确认提交
    handleComfirm() {
      switch (this.dialogStatus) {
        case 'add': //添加
          this.createData()
          break
        case 'edit': //编辑
          this.updateData()
          break
        default:
          this.dialogFormVisible = false
          break
      }
    },
    //重置表单
    resetForm() {
      this.formData = {
        type: '',
        description: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        //validate()对整个表单进行校验
        if (valid) {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        //validate()对整个表单进行校验
        if (valid) {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
<style scoped>
</style>


