<template>
  <div class="app-container">
    <!-- 条件筛选 -->
    <div class="filter-container">
      <el-select
        placeholder="作物种类"
        v-model="listQuery.type"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in type" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select
        placeholder="品种型号"
        v-model="listQuery.cropType"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in cropType" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-input
        placeholder="来源"
        v-model="listQuery.source"
        style="width:200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-input
        placeholder="品种描述"
        v-model="listQuery.description"
        style="width:200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
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
        <el-table-column prop="cropType" align="center" label="品种型号" width="140"></el-table-column>
        <el-table-column prop="souce" align="center" label="来源" width="140"></el-table-column>
        <el-table-column prop="description" label="描述" align="center" width="280"></el-table-column>
        <el-table-column prop="Operator" label="操作人" align="center" width="140"></el-table-column>
        <el-table-column label="操作时间" prop="OperatorDate" align="center" width="140px">
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
    <!-- 新增页面 -->
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
        <el-form-item label="作物种类" prop="type">
          <el-select
            :disabled="true"
            style="width: 400px;"
            v-model="listQuery.type"
            class="filter-item"
            placeholder="请选择作物种类"
          >
            <el-option v-for="item in type" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="品种型号" prop="cropType">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="formData.cropType"
            type="text"
            style="width: 400px;"
            placeholder="请输入品种类型名称"
          />
        </el-form-item>
        <el-form-item label="来源" prop="souce">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="formData.souce"
            type="text"
            style="width: 400px;"
            placeholder="请输入来源地"
          />
        </el-form-item>
        <el-form-item label="品种描述" prop="description" style="width:550px">
          <el-input
            style="width: 400px;"
            :autosize="{ minRows: 8, maxRows: 18}"
            v-model="formData.description"
            type="textarea"
            placeholder="请输入品种描述"
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
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
export default {
  name: "pinManagement",
  components: { Pagination },
  data() {
    return {
      //用于增删改弹框标题
      textMap: {
        add: "新增品种型号",
        view: "查看品种型号",
        edit: "编辑品种型号"
      },
      formData: {
        // type: "",
        cropType: "",
        souce: "",
        description: ""
      },
      dialogStatus: "",
      dialogFormVisible: false,
      dialogFormDisabled: false,
      listLoading: false,
      total: 0,
      list: [],
      listQuery: {
        page: 1,
        limit: 10,
        type: "",
        cropType: undefined,
        source: undefined,
        description: undefined
      },
      type: ["小麦", "水稻", "玉米"],
      cropType: ["type-1", "type-2", "type-3", "type-4", "type-5"],
      rules: {
        cropType: [
          { required: true, message: "品种型号是必填项", trigger: "blur" }
        ],
        type: [{ required: true, message: "作物种类是必填项", trigger: "blur" }]
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
      //   this.getList();
    },
    //重置
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        cropType: undefined,
        source: undefined,
        description: undefined
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
              cropType: "SB0001",
              souce: "王小虎",
              description: "2016-05-02",
              Operator: "张三",
              OperatorDate: "2016-05-02",
              operate: ["edit", "view", "delete"]
            },
            {
              cropType: "SB0001",
              souce: "王小虎",
              description: "2016-05-02",
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
        type: "",
        cropType: "",
        souce: "",
        description: ""
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
<style scoped>
</style>

