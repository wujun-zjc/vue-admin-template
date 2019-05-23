<template>
  <div class="app-container">
    <el-form class="form" ref="form" :model="form" label-width="100px">
      <el-form-item label="消息内容">
        <el-input type="textarea" v-model="form.msgContent" :rows="8"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">发送</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "sendMsg",
  data() {
    return {
      form: {
        msgContent: undefined
      }
    };
  },
  methods: {
    submitForm() {
      if (!this.form.msgContent) {
        this.$message({
          type: "error",
          message: '请输入消息内容！'
        })
        return
      }
      axios
        .post("http://10.3.22.134:8088/message/push/pushAll", {
          msgContent: this.form.msgContent
        })
        .then(response => {
          this.$notify({
            title: "成功",
            message: "发送成功",
            type: "success",
            duration: 2000
          });
          this.resetForm();
        })
        .catch(res => {
          console.log(res);
        });
    },
    //重置
    resetForm() {
      this.form.msgContent = undefined;
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
}
</style>


