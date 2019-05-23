<template>
  <div class="app-container">
    <el-card class="box-card tree-card" style="width:40%;" shadow="hover">
      <div slot="header" class="clearfix">
        <span>角色列表</span>
        <div class="header_btn">
          <el-button
            class="filter-item"
            size="mini"
            icon="el-icon-refresh"
            @click="handleRefresh"
          >刷新</el-button>
          <el-button class="filter-item" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
        </div>
      </div>
      <div class="text item">
        <!-- 表格 -->
        <div class="table-container">
          <el-table
            ref="table"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            stripe
            style="width: 100%;"
            @cell-click="detail"
          >
            <el-table-column label="角色编码" prop="code" align="center" width="60px"></el-table-column>
            <el-table-column label="角色名称" prop="name" align="center"></el-table-column>
            <el-table-column label="操作" prop="operate" align="center" fixed="right" width="150px">
              <template slot-scope="scope">
                <el-button size="mini" @click.stop="handleUpdate(scope.row)">修改</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination-wraper">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.current_page"
            :limit.sync="listQuery.page_size"
            @pagination="getList"
            layout="total, prev, pager, next"
          />
        </div>
      </div>
    </el-card>
    <el-card v-show="menu" class="box-card table-card" style="width:55%;" shadow="hover">
      <div slot="header" class="clearfix">
        <span>{{textMap[dialogStatus]}}</span>
      </div>
      <div class="text item">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="formData"
          :disabled="dialogFormDisabled"
          v-loading="formLoading"
          label-position="left"
          label-width="90px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="所属组织" prop="so_id" v-if="showing">
            <treeselect
              v-model="formData.so_id"
              :multiple="false"
              :normalizer="normalizer"
              :options="options"
              placeholder
            />
          </el-form-item>
          <el-form-item label="角色编码" prop="sr_code">
            <el-input v-model="formData.sr_code"/>
          </el-form-item>
          <el-form-item label="角色名称" prop="sr_name">
            <el-input v-model="formData.sr_name"/>
          </el-form-item>
          <!-- default-expand-all -->
          <el-tree
            ref="operation_tree"
            :data="data5"
            show-checkbox
            node-key="name"
            :expand-on-click-node="false"
          ></el-tree>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <!-- <el-button @click="dialogFormVisible = false">取消</el-button> -->
          <el-button type="primary" @click="handleComfirm" v-show="dialogStatus!=='view'">确认</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  getTreeData,
  getRoleList,
  getRole,
  saveRole,
  modifyRole,
  deleteRole
} from '@/api/systemManagement/rolesList'
let id = 1000
export default {
  name: 'rolesList',
  components: { Pagination, Treeselect },
  data() {
    const data = [
      {
        name: 'IntelligentMonitoring',
        label:'猪健康物联网平台',
        children: [
          {
            name: 'Gis',
            label: 'GIS'
          },
          {
            name: 'Video',
            label: '视频监控'
          },
          {
            name: 'Alarm',
            label: '报警记录'
          },
           {
        name: 'SystemManagement',
        label: '系统管理',
        children: [
          {
            name: 'Organizational',
            label: '组织机构管理'
          },
          {
            name: 'PeopleManagement',
            label: '人员管理'
          },
          {
            name: 'RolesList',
            label: '角色管理'
          },
          {
            name: 'LogManagement',
            label: '日志管理'
          }
        ]
      }
        ]
      }
     
    ]
    return {
      listQuery: {
        so_id: '',
        current_page: 1,
        page_size: 10
      },
      showing: true,
      listLoading: false,
      options: [],
      list: [],
      total: 0,
      //菜单树
      menu: false,
      textMap: {
        add: '添加角色',
        edit: '修改角色',
        view: '查看角色'
      },
      rolePermissions: [],
      dialogStatus: '',
      dialogFormVisible: false,
      dialogFormDisabled: false,
      formLoading: false,
      formData: {
        sr_id: '',
        //所属组织
        so_id: null,
        //角色编号
        sr_code: '',
        //角色名称
        sr_name: '',
        ///* 是否为管理角色（1：是；0：否） */
        sr_admin: 0,
        //半选中状态父节点
        parent_menus: [],
        //全选中状态子节点
        child_menus: []
      },
      rules: {
        so_id: [
          { required: true, message: '所属组织是必填项', trigger: 'change' }
        ],
        sr_code: [
          { required: true, message: '角色编码是必填项', trigger: 'blur' }
        ],
        sr_name: [
          { required: true, message: '角色名称是必填项', trigger: 'change' }
        ]
      },
      data5: JSON.parse(JSON.stringify(data))
    }
  },
  created() {
    this.getList()
    //所属组织树结构
    // getTreeData()
    //   .then(res => {
    //     this.options = res.obj
    //   })
    //   .catch(res => {
    //     console.log(res)
    //   })
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
      this.options=obj
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    //加载表格
    getList() {
      // this.listLoading = true
      // this.listQuery.so_id = this.user.so_id
      // getRoleList(this.listQuery)
      //   .then(res => {
      //     this.list = res.obj.result
      //     this.total = res.obj.total
      //     this.listLoading = false
      //     //默认显示第一行
      //     //this.$refs.table.setCurrentRow(this.list[0])
      //   })
      //   .catch(res => {
      //     console.log(res)
      //     this.listLoading = false
      //   })
      this.list=[
        {
          code:"1",
          name:"饲养员",
        },
        {
          code:"2",
          name:'管理员',
        },
        {
          code:"3",
          name:'检查员',
        }
      ]
    },
    //刷新
    handleRefresh() {
      this.getList()
    },
    //添加
    handleCreate() {
      this.menu = true
      this.showing = true
      this.resetForm()
      this.dialogStatus = 'add'
      this.dialogFormDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.operation_tree.setCheckedKeys([])
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const parent = this.$refs.operation_tree.getHalfCheckedKeys()
          const child = this.$refs.operation_tree.getCheckedKeys()
          this.formData.parent_menus = parent.join(',')
          this.formData.child_menus = child.join(',')
          this.formLoading = true
          saveRole(this.formData)
            .then(res => {
              this.formLoading = false
              this.list.unshift(Object.assign({}, this.formData))
              this.getList()
              this.dialogFormVisible = false
              this.menu = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch(res => {
              console.log(res)
            })
        }
      })
    },
    //修改
    handleUpdate(row) {
      this.menu = true
      this.showing = false
      this.dialogStatus = 'edit'
      this.dialogFormDisabled = false
      // this.formLoading = true
      // getRole(row.id)
      //   .then(res => {
      //     this.formData = res.obj
      //     this.$refs.operation_tree.setCheckedKeys(this.formData.child_menus)
      //     this.formLoading = false
      //   })
      //   .catch(res => {
      //     console.log(res)
      //     this.formLoading = false
      //   })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //更新
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const parent = this.$refs.operation_tree.getHalfCheckedKeys()
          const child = this.$refs.operation_tree.getCheckedKeys()
          this.formData.parent_menus = parent.join(',')
          this.formData.child_menus = child.join(',')
          //this.formLoading = true
          // modifyRole(this.formData, this.sr_id)
          //   .then(res => {
          //     this.formLoading = false
          //     this.getList()
          //     this.$refs.operation_tree.setCheckedKeys(
          //       this.formData.child_menus
          //     )
          //     this.dialogFormVisible = false
          //     this.menu = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
           // })
            // .catch(res => {
            //   console.log(res)
            // })
        }
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
          console.log(row)
          deleteRole(row.id)
            .then(res => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
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
    },
    //提交
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
    //表格点击單元格事件
    detail(row) {
      this.dialogStatus = 'view'
      //查看时，组织机构不改动
      this.showing = false
      this.menu = true
      this.dialogFormDisabled = true
      // this.formLoading = true
      // getRole(row.id)
      //   .then(res => {
      //     this.formData = res.obj
      //     this.$refs.operation_tree.setCheckedKeys(this.formData.child_menus)
      //     this.formLoading = false
      //   })
      //   .catch(res => {
      //     console.log(res)
      //     this.formLoading = false
      //   })
    },
    //重置表单
    resetForm() {
      this.formData = {
        //所属组织
        so_id: null,
        //角色编号
        sr_code: '',
        //角色名称
        sr_name: '',
        ///* 是否为管理角色（1：是；0：否） */
        sr_admin: 0,
        //半选中状态父节点
        parent_menus: [],
        //全选中状态子节点
        child_menus: []
      }
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
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.header_btn {
  float: right;
}
</style>

