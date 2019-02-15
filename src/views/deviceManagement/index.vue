<template>
  <div class="app-container">
    <!-- 条件筛选 -->
    <div class="filter-container">
      <el-input
        placeholder="设备类型编号"
        v-model="listQuery.number"
        style="width:200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      ></el-input>
      <el-select
        placeholder="设备类型"
        v-model="listQuery.type"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in type" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select
        placeholder="基地名称"
        v-model="listQuery.name"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in name" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select
        placeholder="地快编号"
        v-model="listQuery.numbers"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in numbers" :key="item" :label="item" :value="item"/>
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
        <el-table-column prop="number" label="设备类型编号" align="center" width="120"></el-table-column>
        <el-table-column prop="type" align="center" label="设备类型" width="140"></el-table-column>
        <el-table-column prop="name" align="center" label="基地名称" width="140"></el-table-column>
        <el-table-column prop="numbers" align="center" label="地块编号" width="140"></el-table-column>
        <el-table-column prop="parameters" align="center" label="传感器参数" width="140"></el-table-column>
        <el-table-column prop="acquisition" align="center" label="采集频率" width="80"></el-table-column>
        <el-table-column prop="manufacturer" align="center" label="设备厂家" width="160"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center" width="200"></el-table-column>
        <el-table-column prop="Operator" label="操作人" align="center" width="140"></el-table-column>
        <el-table-column label="操作时间" prop="OperatorDate" align="center" width="150px">
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
    <!-- 新增 -->
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
        <el-form-item label="设备类型" prop="type">
          <el-select
            style="width: 500px;"
            v-model="formData.type"
            class="filter-item"
            placeholder="请选择设备类型"
          >
            <el-option v-for="item in type" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备厂家" prop="manufacturer">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="formData.manufacturer"
            type="text"
            style="width: 500px;"
          />
        </el-form-item>
        <el-form-item label="基地名称" prop="name">
          <el-select
            style="width: 500px;"
            v-model="formData.name"
            class="filter-item"
            placeholder="请选择基地"
          >
            <el-option v-for="item in name" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="地块编号" prop="numbers">
          <el-select
            style="width: 500px;"
            v-model="formData.numbers"
            class="filter-item"
            placeholder="请选择地块编号"
          >
            <el-option v-for="item in numbers" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="采集频率" prop="acquisition" style="width:550px">
          <el-input
            style="width:200px"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="formData.acquisition"
            type="text"
          />
          <el-radio style="width:50px" v-model="radio" label="1">秒/次</el-radio>
          <el-radio tyle="width:50px" v-model="radio" label="2">分钟/次</el-radio>
          <el-radio tyle="width:50px" v-model="radio" label="3">时/次</el-radio>
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
  name: "EquipmentManagement",
  components: { Pagination },
  data() {
    return {
      radio: "",
      //用于增删改弹框标题
      textMap: {
        add: "新增设备",
        view: "查看",
        edit: "编辑设备"
      },
      dialogStatus: "",
      dialogFormVisible: false,
      dialogFormDisabled: false,
      listLoading: false,
      formData: {
        type: "",
        manufacturer: "",
        name: "",
        numbers: "",
        acquisition: ""
      },
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        //设备类型编号
        number: undefined,
        //地块编号
        numbers: undefined,
        name: undefined,
        type: undefined
      },
      type: ["type-1", "type-2", "type-3", "type-4", "type-5"],
      name: ["name-1", "name-2", "name-3", "name-4", "name-5"],
      numbers: ["number-1", "number-2", "number-3", "number-4", "number-5"],
      rules: {
        type: [
          { required: true, message: "设备类型是必填项", trigger: "blur" }
        ],
        manufacturer: [
          { required: true, message: "设备厂家是必填项", trigger: "blur" }
        ]
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
        number: undefined,
        numbers: undefined,
        name: undefined,
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
              number: "SB0001",
              type: "王小虎",
              name: "2016-05-02",
              numbers: "张三",
              parameters: "SB0001",
              acquisition: "王小虎",
              manufacturer: "2016-05-02",
              remarks: "张三",
              Operator: "张三",
              OperatorDate: "2016-05-02",
              operate: ["edit", "view", "delete"]
            },
            {
              number: "SB0001",
              type: "王小虎",
              name: "2016-05-02",
              numbers: "张三",
              parameters: "SB0001",
              acquisition: "王小虎",
              manufacturer: "2016-05-02",
              remarks: "张三",
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
<style scoped>
</style>

