<template>
  <div class="app-container">
    <el-card class="box-card tree-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>组织机构</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleCreate">新增组织</el-button>
      </div>
      <div class="text item">
        <el-input clearable v-model="filterText" placeholder="关键字查询" style="margin-bottom:10px;"/>
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          v-loading="treeLoading"
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
        <span>{{textMap[dialogStatus]}}</span>
        <el-button
          style="float: right; padding: 3px 0; color: red;"
          type="text"
          @click="handleDelete"
        >删除组织</el-button>
      </div>
      <div class="text item">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="formData"
          v-loading="formLoading"
          label-position="left"
          label-width="90px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="组织名称" prop="organization_name">
            <el-input v-model="formData.organization_name"/>
          </el-form-item>
          <el-form-item label="上级组织" prop="superior_id" v-show="org_showing">
            <treeselect
              v-model="formData.superior_id"
              :multiple="false"
              :normalizer="normalizer"
              :options="options"
              placeholder
            />
          </el-form-item>
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="formData.leader"/>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone_number">
            <el-input v-model="formData.phone_number" type="text"/>
          </el-form-item>

          <el-form-item label="机构状态" prop="status">
            <el-radio v-model="formData.status" label="1">启用</el-radio>
            <el-radio v-model="formData.status" label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align:center">
          <el-button type="primary" @click="handleComfirm">确认</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
import {
  getTreeData,
  addData,
  getData,
  modifyData,
  delData
} from '@/api/systemManagement/organizational'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { mapGetters } from 'vuex'
export default {
  name: 'organizational',
  components: { Pagination, Treeselect },
  data() {
    return {
      treeLoading: false,
      formLoading: false,
      org_showing: 'true',
      //用于增删改弹框标题
      textMap: {
        add: '新增组织',
        edit: '查看组织'
      },
      formData: {
        so_id: '',
        organization_name: '', //组织名称
        superior_id: null, //上级组织
        leader: '', //负责人
        phone_number: '', //联系电话
        status: '1' //机构状态
      },
      rules: {
        organization_name: [
          { required: true, message: '组织名称是必填项', trigger: 'blur' }
        ],
        superior_id: [
          { required: true, message: '上级组织是必填项', trigger: 'change' }
        ],
        leader: [
          { required: true, message: '负责人是必填项', trigger: 'blur' }
        ],
        phone_number: [
          { required: true, message: '联系电话是必填项', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '机构状态是必填项', trigger: 'blur' }
        ]
      },
      dialogStatus: '',
      filterText: '',
      orgId: '',
      org_name: null,
      //false是表格不显示
      tableVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      options: []
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    //树结构
    getTree() {
      // this.treeLoading = true
      // getTreeData(this.user.so_id)
      //   .then(res => {
      //     console.log(res)
      //     this.treeData = res.obj
      //     this.options = res.obj
      //     this.treeLoading = false
      //   })
      //   .catch(res => {
      //     console.log(res)
      //   })
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
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树节点 点击事件
    nodeClick(data) {
      // this.orgId = data.id
      // this.formLoading = true
      // getData(this.orgId)
      //   .then(res => {
      //     this.formData = res.obj
      //     this.org_name = res.obj.superior_id
      //     this.formLoading = false
      //   })
      //   .catch(res => {
      //     console.log(res)
      //   })
      this.handleUpdate()
    },
    //重置表单
    resetForm() {
      this.formData = {
        so_id: '',
        organization_name: '', //组织名称
        superior_id: null, //上级组织
        leader: '', //负责人
        phone_number: '', //联系电话
        status: '1' //机构状态
      }
    },
    //新增
    handleCreate() {
      this.resetForm()
      this.getTree()
      //彈框的標題是新增
      this.dialogStatus = 'add'
      this.tableVisible = true
      this.$nextTick(() => {
        if (this.org_name !== null) {
          this.formData.superior_id = this.org_name
        } else {
          this.formData.superior_id = null
        }
        //移除表单项的校验结果
        this.$refs['dataForm'].clearValidate()
      })
    },
    //编辑
    handleUpdate(row) {
      this.org_showing = false
      //可以为已有的对象赋予多个新属性
      this.formData = Object.assign({}, row)
      //彈框的標題是编辑
      this.dialogStatus = 'edit'
      this.tableVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //删除
    handleDelete() {
      this.$confirm('确认要删除此条信息么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // delData(this.orgId)
          //   .then(res => {
          //     this.getTree()
              this.tableVisible = false
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            // })
            // .catch(res => {
            //   console.log(res)
            // })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    //确认提交
    handleComfirm() {
      switch (this.dialogStatus) {
        case 'add':
          this.createData()
          break
        case 'edit':
          this.updateData()
          break
        default:
          this.tableVisible = false
          break
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.formData.so_id = this.orgId
      		this.formLoading = true
          addData(this.formData)
            .then(res => {
              this.treeData.unshift(Object.assign({}, this.formData))
              this.getTree()
              this.tableVisible = false
      				this.formLoading = false
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
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
      		this.formLoading = true
          modifyData(this.formData)
            .then(res => {
              this.getTree()
							this.tableVisible = false
      				this.formLoading = false
							this.$notify({
								title: '成功',
								message: '更新成功',
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
</style>

