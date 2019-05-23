<template >
  <div class="app-container">
    <!-- 列表展示 -->
    <div class="table-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <div class="table-operation">
          <el-button type="text">系统消息</el-button>
          <el-button type="text" disabled>公告通知</el-button>
          <el-button class="table-operation-button" size="mini" @click="deletes">删除选中项</el-button>
          <el-button class="table-operation-button" size="mini" @click="reads">全部设为已读</el-button>
          <el-button class="table-operation-button" size="mini" @click="readList">已读选中项</el-button>
        </div>
        <el-tab-pane label="未读" name="first"></el-tab-pane>
        <el-tab-pane label="已读" name="second"></el-tab-pane>
        <el-tab-pane label="全部" name="third"></el-tab-pane>
      </el-tabs>
      <el-table
        v-loading="listLoading"
        :data="list"
        stripe
        border
        filter
        highlight-current-row
        style="width: 100%"
        @selection-change="changeFun"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column type="index" label="编号" align="center" width="60"></el-table-column>
        <el-table-column prop="sender" align="center" label="发件人" min-width="180"></el-table-column>
        <el-table-column prop="content" label="消息内容" align="center" min-width="300"></el-table-column>
        <el-table-column label="接收时间" prop="sendTime" align="center" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.sendTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operate" align="center" label="操作" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="formData"
        :disabled="dialogFormDisabled"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="发件人" prop="sender">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="formData.sender" type="text"/>
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="formData.content"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="接收时间" prop="sendTime">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="formData.sendTime" type="text"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <div class="pagination-wraper">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="current_page"
        :limit.sync="page_size"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import {
  getTableData,
  infoDelete,
  deleteList,
  readed,
  readeds,
  readSelect
} from "@/api/notification";
import store from "../../store";
import axios from "axios";
export default {
  components: { Pagination },
  data() {
    return {
      //用于增删改弹框标题
      textMap: {
        add: "新增",
        view: "查看",
        edit: "编辑"
      },
      listLoading: false,
      list: [],
      total: 0,
      current_page: 1,
      page_size: 10,
      activeName: "first",
      multipleSelection: [],
      operation: "0",
      dialogStatus: "",
      //顯示與不顯示彈框
      dialogFormVisible: false,
      dialogFormDisabled: false,
      formData: {
        sender: "",
        content: "",
        sendTime: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //列表展示
    getList() {
      this.listLoading = true;
      getTableData(this.operation, this.current_page, this.page_size)
        .then(response => {
          this.list = response.obj.result;
          this.total = response.obj.total;
          this.listLoading = false;
        })
        .catch(res => console.log(res));
    },
    //标签页
    handleClick(tab, event) {
      this.operation = tab.index;
      this.current_page = 1;
      this.getList()
    },
    changeFun(val) {
      this.multipleSelection = [];
      console.log(val);
      for (var i = 0; i < val.length; i++) {
        var obj = { id: val[i].id };
        this.multipleSelection.push(obj);
      }
    },
    yidu(operation) {
      if (operation == "1") {
        return false;
      } else {
        return true;
      }
    },

    //删除
    handleDelete(id) {
      this.$confirm("确认要删除此条信息么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(response => {
          infoDelete(id)
            .then(response => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              this.getList();
              this.updateLength();
            })
            .catch(res => console.log(res));
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
    deletes() {
      this.$confirm("确认要删除这些信息么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(response => {
          deleteList(this.multipleSelection)
            .then(response => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              this.getList();
            })
            .catch(res => console.log(res));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
      // 已读
      readed(row.id)
        .then(response => {
          console.log(response);
          this.formData.content = response.obj.content;
          this.formData.sendTime = response.obj.sendTime;
          this.updateLength();
          this.getList();
        })
        .catch(() => {});
    },
    //全部已读
    reads() {
      this.$confirm("确认要全部设为已读么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(response => {
          readeds(this.listQuery)
            .then(response => {
              this.$notify({
                title: "成功",
                message: "已读成功",
                type: "success",
                duration: 2000
              });
              this.getList();
              this.updateLength();
            })
            .catch(res => console.log(res));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消已读"
          });
        });
    },
    //已读选中项
    readList() {
      this.$confirm("确认要将这些信息么设为已读？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(response => {
          readSelect(this.multipleSelection)
            .then(response => {
              this.$notify({
                title: "成功",
                message: "设置成功",
                type: "success",
                duration: 2000
              });
              this.getList();
            })
            .catch(res => console.log(res));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消已读"
          });
        });
    },
    updateLength() {
      let that = this;
      axios
        .get(
          "http://223.80.100.88:522/selectUnReadMsg?id=" +
            store.getters.user.su_id
        )
        .then(function(response) {
          let length = JSON.parse(response.data);
          that.$store
            .dispatch("GetRedataLength", length)
            .then(() => {
              console.log(length);
              console.log(that.redataLength);
            })
            .catch(res => {
              console.log(res);
            });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

