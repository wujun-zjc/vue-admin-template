<template>
  <div class="app-container">
    <el-card class="box-card tree-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>组织机构</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">新增组织</el-button> -->
      </div>
      <div class="text item">
        <el-input
          clearable
          v-model="filterText"
          placeholder="Filter keyword"
          style="margin-bottom:10px;"
        />

        <el-tree
          ref="tree"
          v-loading="treeLoading"
          :data="treeData"
          :props="defaultProps"
          @node-click="nodeClick"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          class="filter-tree"
          default-expand-all
        />
      </div>
    </el-card>

    <el-card class="box-card table-card" shadow="hover" v-if="tableVisible">
      <div slot="header" class="clearfix">
        <span>组织人员</span>
      </div>
      <div class="text item">
        <div class="filter-container">
          <el-input
            placeholder="姓名"
            v-model="listQuery.name"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-input
            placeholder="职位名称"
            v-model="listQuery.jobName"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-input
            placeholder="手机号码"
            v-model="listQuery.phoneNum"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-select
            placeholder="角色权限"
            v-model="listQuery.rolePermission"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in rolePermissions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- <el-switch v-model="listQuery.accountStatus" active-text="启用" inactive-text="禁用"></el-switch> -->
          <el-radio v-model="listQuery.accountStatus" label="active">启用</el-radio>
          <el-radio v-model="listQuery.accountStatus" label="inactive">禁用</el-radio>
          <!-- <el-switch
            v-model="listQuery.sex"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="男"
            inactive-text="女"
          ></el-switch>-->
          <el-radio v-model="listQuery.sex" label="male">男</el-radio>
          <el-radio v-model="listQuery.sex" label="female">女</el-radio>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </div>

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
            border
            fit
            highlight-current-row
            stripe
            style="width: 100%;"
          >
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column label="工号" prop="id" align="center" width="90px"></el-table-column>
            <el-table-column label="姓名" prop="name" align="center" min-width="100px"></el-table-column>
            <el-table-column label="性别" prop="sex" align="center" min-width="50px"></el-table-column>
            <el-table-column label="手机号码" prop="phoneNum" align="center" width="110px"></el-table-column>
            <el-table-column label="邮箱账号" prop="email" align="center" min-width="150px"></el-table-column>
            <el-table-column label="职位名称" prop="jobName" align="center" min-width="150px"></el-table-column>
            <el-table-column label="所属组织" prop="organization" align="center" min-width="200px"></el-table-column>
            <el-table-column label="账号状态" prop="accountStatus" align="center" width="50px"></el-table-column>
            <el-table-column label="角色权限" prop="rolePermission" align="center" min-width="100px"></el-table-column>
            <el-table-column label="操作人" prop="operator" align="center" width="100px"></el-table-column>
            <el-table-column label="操作时间" prop="time" align="center" width="150px"></el-table-column>
            <el-table-column label="操作" prop="operate" align="center" width="350px" fixed="right">
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
                  v-if="scope.row.operate.indexOf('disable') != -1"
                  size="mini"
                  @click="handleDisable(scope.row.id)"
                >{{scope.row.accountStatus}}</el-button>
                <el-button
                  v-if="scope.row.operate.indexOf('delete') != -1"
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                >删除</el-button>
                <el-button
                  v-if="scope.row.operate.indexOf('resetPassword') != -1"
                  size="mini"
                  @click="handleResetPassword(scope.row.id)"
                >重置密码</el-button>
              </template>
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
    </el-card>

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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="formData.sex"/>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNum">
          <el-input v-model="formData.idNum"/>
        </el-form-item>
        <el-form-item label="工号" prop="id">
          <el-input v-model="formData.id"/>
        </el-form-item>
        <el-form-item label="所属组织" prop="organization">
          <el-select v-model="formData.organization" class="filter-item" placeholder>
            <el-option v-for="item in organizations" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="职位名称" prop="jobName">
          <el-input v-model="formData.jobName"/>
        </el-form-item>
        <el-form-item label="邮箱账号" prop="email">
          <el-input v-model="formData.email"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNum">
          <el-input v-model="formData.phoneNum"/>
        </el-form-item>
        <el-form-item label="角色权限" prop="rolePermission">
          <el-select v-model="formData.rolePermission" class="filter-item" placeholder>
            <el-option
              v-for="item in rolePermissions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态" prop="accountStatus">
          <el-radio v-model="formData.accountStatus" label="active">启用</el-radio>
          <el-radio v-model="formData.accountStatus" label="inactive">禁用</el-radio>
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
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
import { getTreeData, getTableData } from '@/api/systemManagement/peopleManagement'

export default {
  name: 'PeopleManagement',
  components: { Pagination },
  data() {
    return {
      treeLoading: true,
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableVisible: false,
      orgId: '',
      listQuery: {
        page: 1,
        limit: 10,
        name: '',
        jobName: '',
        accountStatus: undefined,
        phoneNum: '',
        rolePermission: '',
        sex: undefined
      },
      rolePermissions: [
        { value: 'admin', label: '系统管理员' },
        { value: 'ricePlantingExpert', label: '水稻种植专家' },
        { value: 'baseManagers', label: '基地管理员' },
        { value: 'seniorLeadership', label: '高级领导' }
      ],
      organizations: [
        'organizations-1',
        'organizations-2',
        'organizations-3',
        'organizations-4',
        'organizations-5'
      ],
      listLoading: false,
      list: [],
      total: 0,
      textMap: {
        add: '新增',
        view: '查看',
        edit: '编辑'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogFormDisabled: false,
      formData: {
        name: '',
        sex: '',
        idNum: '',
        id: '',
        organization: '',
        jobName: '',
        email: '',
        phoneNum: '',
        rolePermission: '',
        accountStatus: ''
      },
      rules: {
        name: [{ required: true, message: '姓名是必填项', trigger: 'blur' }],
        id: [{ required: true, message: '工号是必填项', trigger: 'blur' }],
        organization: [
          { required: true, message: '所属组织是必填项', trigger: 'change' }
        ],
        rolePermission: [
          { required: true, message: '角色权限是必填项', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // getTreeData().then(response => {
    //   this.treeData = response.data.items
    // }).catch({})
    // const loading = this.$loading({
    //   target: 'filter-tree',
    //   // target: this.$refs.tree,
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading'
    //   // background: 'rgba(0, 0, 0, 0.7)'
    // })
    setTimeout(() => {
      this.treeLoading = false
      this.treeData = [
        {
          id: 1,
          label: 'Level one 1',
          children: [
            {
              id: 4,
              label: 'Level two 1-1',
              children: [
                {
                  id: 9,
                  label: 'Level three 1-1-1'
                },
                {
                  id: 10,
                  label: 'Level three 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: 'Level one 2',
          children: [
            {
              id: 5,
              label: 'Level two 2-1'
            },
            {
              id: 6,
              label: 'Level two 2-2'
            }
          ]
        },
        {
          id: 3,
          label: 'Level one 3',
          children: [
            {
              id: 7,
              label: 'Level two 3-1'
            },
            {
              id: 8,
              label: 'Level two 3-2'
            }
          ]
        }
      ]
    }, 1.5 * 1000)
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    //树节点 点击事件
    nodeClick(data) {
      this.tableVisible = true
      this.orgId = data.id
      this.handleReset()
      this.getList()
    },
    getList() {
      // 模拟请求
      this.listLoading = true
      this.$message({
        type: 'info',
        message: `获取组织机构ID为 ${this.orgId} 的数据`
      })

      // getTableData(this.orgId,listQuery).then(response => {
      //   this.listLoading = false
      //   this.total = 2
      //   this.list = response.data.items
      // }).catch({})
      setTimeout(() => {
        this.listLoading = false
        this.total = 2
        this.list = [
          {
            id: 'YC000008',
            name: '张三',
            sex: '男',
            phoneNum: '13965884458',
            email: '5684163@qq.com',
            jobName: '软件部经理',
            organization: '袁隆平院士青岛海水稻研究发展中心-软件研发部',
            accountStatus: '启用',
            rolePermission: '基地管理员',
            operate: ['edit', 'view', 'disable', 'delete', 'resetPassword'],
            operator: '张三',
            time: '2019-2-12 12:00:00'
          },
          {
            id: 'YC000008',
            name: '张三',
            sex: '男',
            phoneNum: '13965884458',
            email: '5684163@qq.com',
            jobName: '软件部经理',
            organization: '袁隆平院士青岛海水稻研究发展中心-软件研发部',
            accountStatus: '禁用',
            rolePermission: '基地管理员',
            operate: ['edit', 'view', 'disable', 'delete', 'resetPassword'],
            operator: '张三',
            time: '2019-2-12 12:00:00'
          }
        ]
      }, 1.5 * 1000)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        name: '',
        jobName: '',
        accountStatus: undefined,
        phoneNum: '',
        rolePermission: '',
        sex: undefined
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.formData.time = new Date()
      this.formData.operator = getToken()
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
      // this.formData.time = new Date()
      // this.formData.operator = getToken()
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
    resetForm() {
      this.formData = {
        name: '',
        sex: '',
        idNum: '',
        id: '',
        organization: '',
        jobName: '',
        email: '',
        phoneNum: '',
        rolePermission: '',
        accountStatus: ''
      }
    },
    handleComfirm() {
      switch (this.dialogStatus) {
        case 'add':
          this.createData()
          break
        case 'edit':
          this.updateData()
          break

        default:
          this.dialogFormVisible = false
          break
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
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
      this.$refs['dataForm'].validate(valid => {
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
    handleDisable(id) {
    },
    handleResetPassword(id) {
    },
    handleDelete(id) {
      this.$confirm('确认要删除此用户吗?', '提示', {
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
      // const index = this.list.indexOf(row)
      // this.list.splice(index, 1)
    }
  }
}
</script>
