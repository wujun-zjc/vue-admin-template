<template>
  <div class="app-container">
    <el-card class="box-card tree-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>组织机构</span>
      </div>
      <div class="text item">
        <el-input clearable v-model="filterText" placeholder="关键字查询" style="margin-bottom:10px;"/>
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
            v-model="listQuery.su_name"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
            clearable
          />
          <el-input
            placeholder="职位名称"
            v-model="listQuery.job_title"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
            clearable
          />
          <el-input
            placeholder="手机号码"
            v-model="listQuery.phone_number"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
            clearable
          />
          <el-select
            placeholder="角色权限"
            clearable
            v-model="listQuery.role_id"
            style="width: 200px"
            class="filter-item"
            @change="handleFilter"
          >
            <el-option
              v-for="item in rolePermissions"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            />
          </el-select>
          <el-radio v-model="listQuery.su_status" label="1">启用</el-radio>
          <el-radio v-model="listQuery.su_status" label="0">禁用</el-radio>
          <el-radio v-model="listQuery.su_sex" label="1">男</el-radio>
          <el-radio v-model="listQuery.su_sex" label="2">女</el-radio>
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
            <el-table-column label="工号" prop="job_number" align="center" width="90px"></el-table-column>
            <el-table-column label="姓名" prop="su_name" align="center" min-width="100px"></el-table-column>
            <el-table-column label="性别" prop="su_sex" align="center" min-width="50px"></el-table-column>
            <el-table-column label="手机号码" prop="phone_number" align="center" width="110px"></el-table-column>
            <el-table-column label="邮箱账号" prop="email" align="center" min-width="150px"></el-table-column>
            <el-table-column label="职位名称" prop="job_title" align="center" min-width="150px"></el-table-column>
            <el-table-column label="所属组织" prop="so_name" align="center" min-width="200px"></el-table-column>
            <el-table-column label="账号状态" prop="su_status" align="center" width="80px"></el-table-column>
            <el-table-column label="角色权限" prop="roles" align="center" min-width="100px"></el-table-column>
            <el-table-column label="操作人" prop="operator" align="center" width="100px"></el-table-column>
            <el-table-column label="操作时间" prop="operation_time" align="center" width="160px"></el-table-column>
            <el-table-column label="操作" prop="operate" align="center" width="350px" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
                <el-button size="mini" @click="handleDisable(scope.row)">{{scope.row.su_status}}</el-button>
                <el-button size="mini" @click="handleResetPassword(scope.row)">重置密码</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
    </el-card>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="formData"
        :disabled="dialogFormDisabled"
        label-position="left"
        label-width="90px"
      >
        <!-- <el-upload
        class="avatar-uploader"
        action="http://223.80.100.88:486/rest/accountInterfaceService/getUser"
        :before-upload="beforeUpload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        >
        <img v-if="this.formData.head_portrait" :src="this.formData.head_portrait" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>-->
        <el-form-item label="姓名" prop="su_name">
          <el-input v-model="formData.su_name" clearable/>
        </el-form-item>
        <el-form-item label="性别" prop="su_sex">
          <el-radio v-model="formData.su_sex" label="1">男</el-radio>
          <el-radio v-model="formData.su_sex" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="身份证号" prop="identity_card">
          <el-input v-model="formData.identity_card" clearable/>
        </el-form-item>
        <el-form-item label="工号" prop="job_number">
          <el-input v-model="formData.job_number" clearable/>
        </el-form-item>
        <el-form-item label="所属组织" prop="so_id">
          <treeselect
            v-model="formData.so_id"
            :multiple="false"
            :normalizer="normalizer"
            :options="options"
            placeholder
            clearable
          />
        </el-form-item>
        <el-form-item label="职位名称" prop="job_title">
          <el-input v-model="formData.job_title" clearable/>
        </el-form-item>
        <el-form-item label="邮箱账号" prop="su_email">
          <el-input v-model="formData.su_email" clearable/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone_number">
          <el-input v-model="formData.phone_number" clearable/>
        </el-form-item>
        <el-form-item label="角色权限" prop="roles">
          <el-select v-model="formData.roles" class="filter-item" placeholder clearable>
            <el-option
              v-for="item in rolePermissions"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态" prop="su_status">
          <el-radio v-model="formData.su_status" label="1">启用</el-radio>
          <el-radio v-model="formData.su_status" label="0">禁用</el-radio>
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
import {
  getTreeData,
  addData,
  getTableData,
  delData,
  getData,
  modifyData,
  getRoles,
  resetPassword,
  Disable
} from '@/api/systemManagement/peopleManagement'
import { validatePhone, validateEmail, validateId } from '@/utils/validate'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { mapGetters } from 'vuex'
export default {
  name: 'PeopleManagement',
  components: { Pagination, Treeselect },
  data() {
    //手机号验证
    const ValidatePhone = (rule, value, callback) => {
      if (!validatePhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    //邮箱验证
    const ValidateEmail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }
    //身份证验证
    const ValidateId = (rule, value, callback) => {
      if (!validateId(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }
    return {
      options: [],
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
        current_page: 1,
        page_size: 10,
        so_id: '',
        su_name: '',
        job_title: '',
        su_status: undefined,
        phone_number: '',
        role_id: '',
        su_sex: undefined
      },
      rolePermissions: [],
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
        su_id: '',
        su_name: '',
        su_sex: '',
        identity_card: '',
        job_number: '',
        job_title: '',
        su_email: '',
        phone_number: '',
        roles: '',
        su_status: '',
        so_id: null,
        //头像
        head_portrait: ''
      },
      rules: {
        su_name: [{ required: true, message: '姓名是必填项', trigger: 'blur' }],
        job_number: [
          { required: true, message: '工号是必填项', trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '角色权限是必填项', trigger: 'change' }
        ],
        phone_number: [
          { required: true, trigger: 'blur', validator: ValidatePhone }
        ],
        su_email: [
          { required: true, trigger: 'blur', validator: ValidateEmail }
        ],
        identity_card: [
          { required: true, trigger: 'blur', validator: ValidateId }
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
    //树结构
  //   getTreeData().then(res => {
  //     this.treeData = res.obj
  //     this.options = res.obj
  //     this.treeLoading = false
  //   }).catch(res => {
  //         console.log(res)
  // })
  this.treeLoading = false
  const obj=[
        {
         id:'0',
         label:'猪健康物联网平台',
         children:[
           {
             id:'11',
             label:"山东青岛崂山养殖场"
           },
           {
             id:'3',
             label:"湖北武汉华山春和养殖场"
           }
         ]
        }
      ]
      this.treeData=obj
      this.options=obj
  },
  computed: {
    ...mapGetters(['user'])
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
      this.getRoles()
    },
    //获取
    getRoles() {
      const so_id = this.user.so_id
      getRoles(so_id).then(res => {
        // console.log(res.obj)
        this.rolePermissions = res.obj
      }).catch(res => {
          console.log(res)
        })
    },
    getList() {
      // 模拟请求
      // this.listLoading = true
      this.listQuery.so_id = this.orgId
      // this.listQuery.orgin=this.orgId
      //console.log( this.listQuery.orgin)
      // getTableData(this.listQuery).then(response => {
      //   this.listLoading = false
      //   this.total = response.obj.total
      //   this.list = response.obj.result
      // }).catch(res => {
      //     console.log(res)
      //   })
      this.list=[
        {
          job_number:"20190501",
          su_name:'张三',
          su_sex:"男",
          su_status:"启用",
          phone_number:'13361487852',
          email:"123456@qq.com",
          so_name:"山东青岛崂山养殖场",
          job_title:"饲养员",
          roles:'管理员',
          operator:"admin",
          operation_time:"2019-05-01"
        }
      ]
    },
    handleFilter() {
      this.listQuery.current_page = 1
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        current_page: 1,
        page_size: 10,
        su_name: '',
        job_title: '',
        su_status: undefined,
        phone_number: '',
        role_id: '',
        su_sex: undefined
      }
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
    //编辑
    handleUpdate(row) {
      // getData(row.su_id).then(res => {
      //   //console.log(res);
      //   this.formData = res.obj
      // }).catch(res => {
      //     console.log(res)
      //   })
      //console.log(this.formData);
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleView(row) {
      getData(row.su_id).then(res => {
        this.formData = res.obj
      }).catch(res => {
          console.log(res)
        })
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.dialogFormDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetForm() {
      this.formData = {
        su_id: '',
        su_name: '',
        su_sex: '',
        identity_card: '',
        job_number: '',
        job_title: '',
        su_email: '',
        phone_number: '',
        roles: '',
        su_status: '',
        so_id: null,
        //头像
        head_portrait: ''
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
          addData(this.formData).then(res => {
            this.list.unshift(Object.assign({}, this.formData))
            this.getList()
          }).catch(res => {
          console.log(res)
        })
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
    //更新
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          modifyData(this.formData).then(res => {
            this.getList()
          }).catch(res => {
          console.log(res)
        })
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
    //启用与禁用切换
    handleDisable(row) {
      if (this.formData.su_status == 0) {
        row.su_status = '启用'
        this.formData.su_status = 1
      } else {
        row.su_status = '禁用'
        this.formData.su_status = 0
      }
      Disable(this.formData.su_status, row.su_id).then(res => {})
    },
    //重置密码
    handleResetPassword(row) {
      resetPassword(row.su_id).then(res => {
        this.$message({
          message: '该用户的密码已初始化为123456',
          type: 'success'
        })
      }).catch(res => {
          console.log(res)
        })
    },
    //删除
    handleDelete(row) {
      this.$confirm('确认要删除此用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
        //   delData(row.su_id).then(res => {
        //     this.getList()
        //   }).catch(res => {
        //   console.log(res)
        // })

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
    },

    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
    }

    // beforeUpload(file) {},
    // handleAvatarSuccess(res, file) {
    //   this.formData.head_portrait = URL.createObjectURL(file.raw);
    // }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

