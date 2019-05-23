<template>
  <div class="alarm">
    <el-card class="box-card" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span>
          <i></i>报警栏
        </span>
        <el-button
          style="float: right;font-size:50px; padding:0;line-height:0;padding-top:8px; color:#000;" type="text"
        >···</el-button>
      </div>
      <div class="alarm-header">
        <span>日期</span>
        <span>警告内容</span>
      </div>

      <div class="content-bottom">
        <vueSeamless :data="list" :class-option="option">
          <p class="li" v-for="(item, index) in list" :key="index">
            <span class="alarm_time">{{item.alarm_time}}</span>
            <span class="alarm_reason">{{item.alarm_reason}}</span>
          </p>
        </vueSeamless>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import info from '@/json/home/alarm'
import vueSeamless from 'vue-seamless-scroll'
export default {
  name: 'Alarm',
  components: { Pagination, vueSeamless },
  data() {
    return {
      option: {
        step: 1,
        limitMoveNum: 1,
        openTouch: false,
        waitTime: 2000,
        direction: 1,
        singleHeight: 35
      },
      listLoading: false,
      list: [],
      total: 0,
      current_page: 1,
      page_size: 10
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.getList()
  },
  methods: {
    //列表获取
    getList() {
      //模拟请求
      this.list = info.result
      this.current_page = info.current_page
      this.page_size = info.page_size
      this.total = info.total
    }
  }
}
</script>

<style>
.el-table td,
.el-table th.is-leaf {
  border: none;
}
.alarm .el-table th {
  background: #f9f9f9;
}
</style>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.box-card {
  //height: 355px;
  margin-bottom: 10px;
  margin-left: 0px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
  div span {
    font-size: 16px;
    font-weight: bolder;
    font-family: MicrosoftYaHei;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    color: rgba(51, 51, 51, 1);
    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      background: #001ae6;
      margin-right: 10px;
    }
  }
}
.alarm-header {
  box-shadow: none;
  span {
    display: inline-block;
    &:first-child {
      padding-left: 60px;
      height: 50px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 50px;
    }
    &:last-child {
      padding-left: 120px;
      height: 50x;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 50px;
    }
  }
}
.content-bottom {
  width: 100%;
  height: 260px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  .li {
    width: 100%;
    font-weight: 200;
    font-family: MicrosoftYaHei;
    display: inline-block;
    height: 10px;
    line-height: 10px;
    color: rgba(51, 51, 51, 1);
    .alarm_time {
      color: #333333;
      font-size: 13px;
      padding-left: 80px;
    }
    .alarm_reason {
      color: #333333;
      font-size: 13px;
      padding-left: 140px;
    }
  }
}
</style>

