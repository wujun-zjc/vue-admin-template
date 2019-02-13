<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="基地编号" v-model="listQuery.id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="基地名称" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="基地地址" v-model="listQuery.adress" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="基地描述" v-model="listQuery.description" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select placeholder="所属组织" v-model="listQuery.organization" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in organizations" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select placeholder="负责人" v-model="listQuery.charge" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in charges" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset">重置</el-button>
    </div>

    <div class="table-container">
      <div class="table-operation">
        <el-button class="table-operation-button" size="mini" icon="el-icon-edit" @click="handleCreate">新增</el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%;">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column label="基地编号" prop="id" align="center" width="90px"></el-table-column>
        <el-table-column label="基地名称" prop="name" align="center" min-width="100px"></el-table-column>
        <el-table-column label="基地地址" prop="adress" align="center" min-width="150px"></el-table-column>
        <el-table-column label="所属组织" prop="organization" align="center" min-width="150px"></el-table-column>
        <el-table-column label="负责人" prop="charge" align="center" width="100px"></el-table-column>
        <el-table-column label="基地描述" prop="description" align="center" min-width="150px"></el-table-column>
        <el-table-column label="基地照片" align="center" width="150px">
          <template slot-scope="scope">
            <img :src="scope.row.src" alt="" style="width: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="operator" align="center" width="100px"></el-table-column>
        <el-table-column label="操作时间" prop="time" align="center" width="150px">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="操作" prop="operate" align="center" width="220px" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.operate.indexOf('edit') != -1" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.operate.indexOf('view') != -1" size="mini" @click="handleView(scope.row)">查看</el-button>
            <el-button v-if="scope.row.operate.indexOf('delete') != -1" size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-wraper">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="formData" :disabled="dialogFormDisabled" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="基地编号" prop="id">
          <el-input v-model="formData.id"/>
        </el-form-item>
        <el-form-item label="基地名称" prop="name">
          <el-input v-model="formData.name"/>
        </el-form-item>
        <el-form-item label="基地地址" prop="adress">
          <el-input v-model="formData.adress"/>
        </el-form-item>
        <el-form-item label="所属组织" prop="organization">
          <el-select v-model="formData.organization" class="filter-item" placeholder="">
            <el-option v-for="item in organizations" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="charge">
          <el-select v-model="formData.charge" class="filter-item" placeholder="">
            <el-option v-for="item in charges" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="基地描述" prop="description">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="formData.description" type="textarea"/>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-select v-model="formData.operator" class="filter-item" placeholder="">
            <el-option v-for="item in operators" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间" prop="time">
          <el-date-picker v-model="formData.time" type="datetime"/>
        </el-form-item>
        <el-form-item label="基地照片">
          <el-upload drag action="" :multiple="false" class="upload-demo">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleComfirm">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'BaseManagement',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        id: '',
        name: undefined,
        adress: undefined,
        description: undefined,
        organization: undefined,
        charge: undefined,
      },
      organizations: [
        'organizations-1',
        'organizations-2',
        'organizations-3',
        'organizations-4',
        'organizations-5',
      ],
      charges: [
        'charges-1',
        'charges-2',
        'charges-3',
        'charges-4',
        'charges-5',
      ],
      list: [],
      total: 0,
      listLoading: false,
      textMap: {
        add: '新增',
        view: '查看',
        edit: '编辑'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogFormDisabled: false,
      formData: {
        id: '',
        name: '',
        adress: '',
        organization: '',
        charge: '',
        description: '',
        src: '',
        operator: '',
        time: ''
      },
      rules: {
        id: [{ required: true, message: '基地编号是必填项', trigger: 'blur' }],
        name: [{ required: true, message: '基地名称是必填项', trigger: 'blur' }],
        adress: [{ required: true, message: '基地地址是必填项', trigger: 'blur' }],
        organization: [{ required: true, message: '所属组织是必填项', trigger: 'change' }],
        charge: [{ required: true, message: '负责人是必填项', trigger: 'change' }],
        description: [{ required: true, message: '基地描述是必填项', trigger: 'blur' }],
        operator: [{ required: true, message: '操作人是必填项', trigger: 'change' }]
      },
      operators: [
        'operator-1',
        'operator-2',
        'operator-3',
        'operator-4',
        'operator-5',
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // this.listLoading = true
      // fetchList(this.listQuery).then(response => {
        //   this.list = response.data.items
      //   this.total = response.data.total

      //   setTimeout(() => {
        //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })

      // 模拟请求
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
        this.total= 2
        if (this.listQuery.page == 1) {
          this.list = [
            {id: 'GD0001',name: '城阳上马',adress:'山东省青岛市城阳区',organization:'organization-1',charge:'charge-1',description:'hhhhhhhhhhhhhhhhhhhhhhhhh',src:'http://223.80.100.88:454/showFourPage/images/shuifeiyitihua_pool.png',operator:'张三',time:'2019-2-12 12:00:00',operate:['edit','view','delete']},
            {id: 'GD0002',name: '阿斯蒂芬阿斯蒂芬',adress:'啊手动阀手动阀',organization:'organization-2',charge:'charge-2',description:'红红火火恍恍惚惚红红火火',src:'http://223.80.100.88:454/showFourPage/images/bainingdi.png',operator:'阿斯蒂',time:'2019-2-12 12:00:00',operate:['edit','view']},
            // {id: 'GD0003',name: '城阳上马',adress:'山东省青岛市城阳区',organization:'organization-3',charge:'charge-3',description:'hhhhhhhhhhhhhhhhhhhhhhhhh',src:'http://223.80.100.88:454/showFourPage/images/shuifeiyitihua_pool.png',operator:'张三',time:'2019-2-12 12:00:00',operate:['view']},
            // {id: 'GD0004',name: '城阳上马',adress:'山东省青岛市城阳区',organization:'organization-4',charge:'charge-4',description:'红红火火恍恍惚惚红红火火',src:'http://223.80.100.88:454/showFourPage/images/shuifeiyitihua_pool.png',operator:'张三',time:'2019-2-12 12:00:00',operate:['edit','view','delete']},
            // {id: 'GD0005',name: '城阳上马',adress:'山东省青岛市城阳区',organization:'organization-5',charge:'charge-5',description:'hhhhhhhhhhhhhhhhhhhhhhhhh',src:'http://223.80.100.88:454/showFourPage/images/shuifeiyitihua_pool.png',operator:'张三',time:'2019-2-12 12:00:00',operate:['edit','view','delete']},
            // {id: 'GD0006',name: '城阳上马',adress:'山东省青岛市城阳区',organization:'organization-1',charge:'charge-1',description:'hhhhhhhhhhhhhhhhhhhhhhhhh',src:'http://223.80.100.88:454/showFourPage/images/shuifeiyitihua_pool.png',operator:'张三',time:'2019-2-12 12:00:00',operate:['edit','view','delete']},
            // {id: 'GD0001',name: '城阳上马',adress:'山东省青岛市城阳区',organization:'organization-1',charge:'charge-1',description:'hhhhhhhhhhhhhhhhhhhhhhhhh',src:'http://223.80.100.88:454/showFourPage/images/shuifeiyitihua_pool.png',operator:'张三',time:'2019-2-12 12:00:00',operate:['edit','view','delete']},
            // {id: 'GD0001',name: '城阳上马',adress:'山东省青岛市城阳区',organization:'organization-1',charge:'charge-1',description:'hhhhhhhhhhhhhhhhhhhhhhhhh',src:'http://223.80.100.88:454/showFourPage/images/shuifeiyitihua_pool.png',operator:'张三',time:'2019-2-12 12:00:00',operate:['edit','view','delete']},
            // {id: 'GD0001',name: '城阳上马',adress:'山东省青岛市城阳区',organization:'organization-1',charge:'charge-1',description:'hhhhhhhhhhhhhhhhhhhhhhhhh',src:'http://223.80.100.88:454/showFourPage/images/shuifeiyitihua_pool.png',operator:'张三',time:'2019-2-12 12:00:00',operate:['edit','view','delete']},
            // {id: 'GD0001',name: '城阳上马',adress:'山东省青岛市城阳区',organization:'organization-1',charge:'charge-1',description:'hhhhhhhhhhhhhhhhhhhhhhhhh',src:'http://223.80.100.88:454/showFourPage/images/shuifeiyitihua_pool.png',operator:'张三',time:'2019-2-12 12:00:00',operate:['edit','view','delete']}
          ]
        }
        if (this.listQuery.page == 2) {
          this.list = [
            {id: 'GD0001',name: '城阳上马',adress:'山东省青岛市城阳区',organization:'organization-1',charge:'charge-1',description:'hhhhhhhhhhhhhhhhhhhhhhhhh',src:'http://223.80.100.88:454/showFourPage/images/bainingdi.png',operator:'张三',time:'2019-2-12 12:00:00',operate:['edit','view','delete']}
          ]
        }
      }, 1.5 * 1000)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.formData = Object.assign({}, row)
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleView(row) {
      this.formData = Object.assign({}, row)
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.dialogFormDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        id: '',
        name: undefined,
        adress: undefined,
        description: undefined,
        organization: undefined,
        charge: undefined,
      }
    },
    handleComfirm() {
      switch (this.dialogStatus) {
        case 'add':
          this.createData()
          break;
        case 'edit':
          this.updateData()
          break;
      
        default:
          this.dialogFormVisible = false
          break;
      }
    },
    resetForm() {
      this.formData = {
        id: '',
        name: '',
        adress: '',
        organization: '',
        charge: '',
        description: '',
        src: '',
        operator: '',
        time: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
            //     title: '成功',
          //     message: '创建成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          // updateArticle(tempData).then(() => {
          //   for (const v of this.list) {
          //     if (v.id === this.temp.id) {
          //       const index = this.list.indexOf(v)
          //       this.list.splice(index, 1, this.temp)
          //       break
          //     }
          //   }
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确认要删除此基地信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      // const index = this.list.indexOf(row)
      // this.list.splice(index, 1)
    }
  }
}
</script>
