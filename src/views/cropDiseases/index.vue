<template>
  <div class="app-container">
    <!-- 条件筛选 -->
    <div class="filter-container">
      <el-input
        placeholder="病害名称"
        v-model="listQuery.diseaseName"
        style="width:200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-select
        placeholder="操作人"
        v-model="listQuery.name"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in name" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-button icon="el-icon-search" class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
      <el-button icon="el-icon-refresh" class="filter-item" @click="handleReset">重置</el-button>
    </div>
    <!-- 列表展示 -->
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
        <el-table-column type="index" label="编号" align="center" width="60"></el-table-column>
        <el-table-column prop="diseaseName" align="center" label="病害名称" width="180"></el-table-column>
        <el-table-column prop="Operator" label="操作人" align="center" width="180"></el-table-column>
        <el-table-column label="操作时间" prop="OperatorDate" align="center" width="300px">
          <!-- <template slot-scope="scope">
                 <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="operate" align="center" label="操作" min-width="220px" fixed="right">
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
    <div class="pagination-wraper">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <!-- 新增作物病害 -->
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
        <el-form-item label="病害名称" prop="type">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="formData.diseaseName" type="text"/>
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
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
export default {
  data() {
    return {
      //用于增删改弹框标题
      textMap: {
        add: "新增作物病害",
        view: "查看作物病害",
        edit: "编辑作物病害"
      },
      dialogStatus: "",
      dialogFormVisible: false,
      dialogFormDisabled: false,
      listLoading: false,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        //操作人
        name: undefined,
        //病害名称
        diseaseName: undefined
      },
      formData: {
        diseaseName: ""
      },
      name: ["name-1", "name-2", "name-3", "name-4", "name-5"],
      rules: {
        diseaseName: [{ required: true, message: "病害名称是必填项", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //筛选
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    //重置
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        //操作人
        name: undefined,
        //农业种类
        type: undefined
      };
    },
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
      this.listLoading = true;
      setTimeout(() => {
        this.listLoading = false;
        this.total = 2;
        if (this.listQuery.page == 1) {
          this.list = [
            {
              diseaseName: "SB0001",
              Operator: "张三",
              OperatorDate: "2016-05-02",
              operate: ["edit", "view", "delete"]
            },
            {
              diseaseName: "SB0001",
              Operator: "张三",
              OperatorDate: "2016-05-02",
              operate: ["edit", "view", "delete"]
            }
          ];
        }
      }, 1.5 * 1000);
    },
    //新增
    handleCreate() {
      this.resetForm();
      //彈框的標題是新增
      this.dialogStatus = "add";
      this.dialogFormVisible = true;
      this.dialogFormDisabled = false;
      //在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
      this.$nextTick(() => {
        //移除表单项的校验结果
        this.$refs["dataForm"].clearValidate();
      });
    },
    //重置表单
    resetForm() {
      this.formData = {
        equipmentType: "",
        source: "",
        names: "",
        baseNumbers: "",
        frequency: ""
      };
    },
    //编辑
    handleUpdate(row) {
      //可以为已有的对象赋予多个新属性
      this.formData = Object.assign({}, row);
      //彈框的標題是编辑
      this.dialogStatus = "edit";
      this.dialogFormVisible = true;
      this.dialogFormDisabled = false;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //查看
    handleView(row) {
      this.formData = Object.assign({}, row);
      //彈框的標題是查看
      this.dialogStatus = "view";
      this.dialogFormVisible = true;
      //不可修改狀態
      this.dialogFormDisabled = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //删除
    handleDelete(id) {
      this.$confirm("确认要删除此条信息么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      //  const index = this.list.indexOf(row)
      // this.list.splice(index, 1)
    },
    //确认提交
    handleComfirm() {
      switch (this.dialogStatus) {
        case "add":
          this.createData();
          break;
        case "edit":
          this.updateData();
          break;
        default:
          this.dialogFormVisible = false;
          break;
      }
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
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
          this.dialogFormVisible = false;
          this.$notify({
            title: "成功",
            message: "创建成功",
            type: "success",
            duration: 2000
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
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
          this.dialogFormVisible = false;
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        }
      });
    }
  }
};
</script>

