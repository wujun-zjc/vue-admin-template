<!-- TODO发送人员的可编辑表格中有关下拉树问题--> 
<template>
  <div class="app-container">
    <!-- 列表筛选 -->
    <div class="filter-container">
      <el-select
        placeholder="消息类型"
        v-model="listQuery.messageType"
        clearable
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in messageTypes" :key="item.id" :label="item.text" :value="item.id"/>
      </el-select>
      <el-select
        placeholder="基地名称"
        v-model="listQuery.baseName"
        clearable
        style="width: 200px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in baseName" :key="item.id" :label="item.text" :value="item.id"/>
      </el-select>
      <el-input
        placeholder="基地负责人"
        v-model="listQuery.baseManager"
        style="width:200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-input
        placeholder="发送对象"
        v-model="listQuery.alarmUser"
        style="width:200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-button icon="el-icon-search" class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
      <el-button icon="el-icon-refresh" class="filter-item" @click="handleReset">重置</el-button>
    </div>
    <!-- 列表展示 -->
    <div class="table-container">
      <!-- <div class="table-operation">
        <el-button
          class="table-operation-button"
          size="mini"
          icon="el-icon-edit"
          @click="handleCreate"
        >消息发送设置</el-button>
      </div>-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        stripe
        style="width: 100%;"
      >
        <el-table-column type="index" width="50" label="编号" align="center"></el-table-column>
        <el-table-column label="消息类型" prop="messageType" align="center" width="90px"></el-table-column>
        <el-table-column label="基地名称" prop="baseName" align="center" width="140px"></el-table-column>
        <el-table-column label="基地负责人" prop="baseManager" align="center" min-width="100px"></el-table-column>
        <el-table-column label="发送对象" prop="alarmUsers" align="center" min-width="150px"></el-table-column>
        <el-table-column label="未处理间隔时间" prop="frequency" align="center" min-width="150px"></el-table-column>
        <el-table-column label="操作人" prop="updateBy" align="center" width="100px"></el-table-column>
        <el-table-column label="操作时间" prop="updateDate" align="center" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.updateDate | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operate" align="center" width="220px" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wraper">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.current_page"
          :limit.sync="listQuery.page_size"
          @pagination="getList"
        />
      </div>
      <!-- 消息发送设置 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="formData"
          :disabled="dialogFormDisabled"
          label-position="left"
          label-width="90px"
          style="width: 550px; margin-left:40px;"
        >
          <el-form-item label="消息类型" prop="messageType">
            <el-select v-model="formData.messageType" class="filter-item" placeholder>
              <el-option
                v-for="item in messageTypes"
                :key="item.id"
                :label="item.text"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="基地名称" prop="baseName">
            <el-select v-model="formData.baseName" class="filter-item" placeholder>
              <el-option
                v-for="item in baseName"
                :key="item.id"
                :label="item.text"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="负责人" prop="base_head">
            <el-input v-model="formData.base_head"/>
          </el-form-item>
          <el-form-item label="未处理间隔时间" prop="unprocessed_time" class="unprocessed_time">
            <el-input v-model="formData.unprocessed_time"/>
          </el-form-item>
          <el-form-item label="发送人员" prop="sending_objects">
            <el-editable
              ref="editable"
              class="click-table1"
              :data.sync="sending_objects"
              border
              size="mini"
              style="width: 100%"
            >
              <el-editable-column type="index" align="center" label="编号" width="55"></el-editable-column>
              <el-editable-column
                prop="organizational"
                align="center"
                width="140"
                label="所属组织"
                :edit-render="{name: 'ElSelect', options: orgs}"
              >
                <template>
                  <treeselect
                    v-model="formData.superior_id"
                    :multiple="false"
                    :normalizer="normalizer"
                    :options="orgs"
                    placeholder
                  />
                </template>
              </el-editable-column>
              <el-editable-column
                prop="name"
                align="center"
                label="姓名"
                :edit-render="{name: 'ElInput'}"
              ></el-editable-column>
              <el-editable-column
                prop="roles"
                label="角色"
                align="center"
                :edit-render="{name: 'ElInput'}"
              ></el-editable-column>>
              <el-editable-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    circle
                    @click="$refs.editable.insertAt({},1)"
                  ></el-button>
                  <el-button
                    type="info"
                    icon="el-icon-minus"
                    size="mini"
                    circle
                    @click="removeEvent(scope.row)"
                  ></el-button>
                </template>
              </el-editable-column>
            </el-editable>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleComfirm">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import {
  baseName,
  getPageList,
  getTreeData
} from '@/api/systemManagement/messages'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import XEUtils from 'xe-utils'
import VueElementExtends from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'
import Vue from 'vue'
Vue.use(VueElementExtends)
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'messages',
  components: { Pagination, Treeselect },
  data() {
    return {
      listQuery: {
        current_page: 1,
        page_size: 10,
        messageType: '',
        baseManager: '',
        baseName: '',
        alarmUser: ''
      },
      messageTypes: ['type1', 'type2'],
      baseName: ['青岛', '浙江'],
      list: [],
      total: 0,
      listLoading: false,
      textMap: {
        add: '消息发送设置',
        view: '消息发送查看',
        edit: '消息发送编辑'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogFormDisabled: false,
      formData: {
        messageType: '',
        baseManager: '',
        baseName: '',
        unprocessed_time: ''
      },
      sending_objects: [
        {
          organizational: '',
          name: '',
          roles: ''
        }
      ],
      orgs: [], //组织机构
      rules: {
        messageType: [
          { required: true, message: '消息类型是必填项', trigger: 'change' }
        ],
        baseName: [
          { required: true, message: '基地名称是必填项', trigger: 'change' }
        ],
        base_head: [
          { required: true, message: '负责人是必填项', trigger: 'blur' }
        ],
        unprocessed_time: [
          { required: true, message: '未处理间隔时间是必填项', trigger: 'blur' }
        ],
        sending_objects: [
          { required: true, message: '发送人员是必填项', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
    //基地名称
    baseName(this.user.so_id).then(res => {
      this.baseName = res.obj
    }).catch(res => {
          console.log(res)
        })
    //获取组织树
    getTreeData(this.user.so_id).then(res => {
      //console.log(res)
      this.orgs = res.obj
    }).catch(res => {
          console.log(res)
        })
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    //筛选
    handleFilter() {
      this.getList()
    },
    //重置
    handleReset() {
      this.listQuery = {
        current_page: 1,
        page_size: 10,
        messageType: '',
        baseManager: '',
        baseName: '',
        alarmUser: ''
      }
    },
    //数据渲染
    getList() {
      this.listLoading = true
      getPageList(this.listQuery).then(res => {
        this.list = res.obj.result
        this.total = res.obj.total
        this.listLoading = false
      }).catch(res => {
          console.log(res)
        })
    },
    //新增
    // handleCreate() {
    //   this.resetForm();
    //   this.dialogStatus = "add";
    //   this.dialogFormVisible = true;
    //   this.dialogFormDisabled = false;
    //   this.formData.time = new Date();
    //   this.formData.operator = getToken();
    //   this.$nextTick(() => {
    //     this.$refs["dataForm"].clearValidate();
    //   });
    // },
    //编辑
    handleUpdate(row) {
      this.formData = Object.assign({}, row)
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.formData.time = new Date()
      this.formData.operator = getToken()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //查看
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
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
    },
    //删除
    // handleDelete(id) {
    //   this.$confirm("确认要删除此条信息么？", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       delData(id).then(res=>{
    //           console.log(res)
    //           this.getList()
    //       })
    //       this.$notify({
    //         title: "成功",
    //         message: "删除成功",
    //         type: "success",
    //         duration: 2000
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    //   //  const index = this.list.indexOf(row)
    //   // this.list.splice(index, 1)
    // },
    //删除发送对象行
    removeEvent(row) {
      if (row.id) {
        MessageBox.confirm('确定永久删除该数据?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            XEAjax.doDelete(`/api/role/delete/${row.id}`).then(({ data }) => {
              this.findList()
            })
          })
          .catch(e => e)
      } else {
        this.$refs.editable.remove(row)
      }
    },
    //   createData() {
    //   this.$refs["dataForm"].validate(valid => {
    //     if (valid) {
    //       addData(this.formData).then(res=>{
    //           console.log(res)
    //           this.list.unshift(Object.assign({}, this.formData));
    //            this.getList()
    //       })
    //       this.dialogFormVisible = false;
    //       this.$notify({
    //         title: "成功",
    //         message: "创建成功",
    //         type: "success",
    //         duration: 2000
    //       });
    //     }
    //   });
    // },
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
    resetForm() {
      this.formData = {
        message_type: '',
        base_head: '',
        baseName: '',
        unprocessed_time: ''
      }
    }
  }
}
</script>
<style >
.unprocessed_time .el-form-item__label {
  width: 126px !important;
}
.unprocessed_time .el-form-item__content {
  margin-left: 126px !important;
}
</style>


