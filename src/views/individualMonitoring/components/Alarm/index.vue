<template>
  <div class="container">
    <table cellpadding="0" cellspacing="0" class="indivdual-alarm">
      <thead>
        <tr>
          <th>报警时间</th>
          <th>报警原因</th>
          <th>处理</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr v-for="(item,index) in list" :key="index">
          <td>{{item.alarm_time}}</td>
          <td>{{item.alarm_reason}}</td>
          <td :class="{alarmDeal:item.operation=='处理'}">{{item.operation}}</td>
        </tr> -->
      
      </tbody>
    </table>
    <div class="content-bottom">
        <vueSeamless :data="list" :class-option="option">
          <p class="li" v-for="(item, index) in list" :key="index">
            <span class="alarm_time">{{item.alarm_time}}</span>
            <span class="alarm_reason">{{item.alarm_reason}}</span>
            <span :class="{alarmDeal:item.operation=='处理'}">{{item.operation}}</span>
          </p>
        </vueSeamless>
      </div>
    <!-- <div class="pagination-wraper">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="current_page"
        :limit.sync="page_size"
        @pagination="getList"
      />
    </div>-->
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination";
import info from "@/json/individualMonitoring/alarm";
import vueSeamless from "vue-seamless-scroll";
export default {
  name: "Alarm",
  components: { Pagination,vueSeamless },
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
      page_size: 10,
      alarmDealtion: false
    };
  },
  computed: {
    ...mapGetters(["user"]),
    alarmDeal() {
      return {};
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //列表获取
    getList() {
      //模拟请求
      //this.listLoading=true
      this.list = info.result;
      this.current_page = info.current_page;
      this.page_size = info.page_size;
      this.total = info.total;
    }
  }
};
</script>
<style>
</style>

<style lang="scss" scoped>
.container {
  padding: 0 2px;
  padding-top: 2px;
}

.indivdual-alarm {
  width: 100%;
  thead {
    width: 100%;
    background: rgba(90, 86, 130, 1);
    box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
    border-radius: 4px;
    height: 20px;
    line-height: 20px;
    text-align: left;
    margin: 0;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    th {
      padding-left:32px;
    }
  }
  // tbody {
  //   background: rgba(241, 241, 241, 1);
  //   box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
  //   tr:first-child td {
  //     padding-top: 10px;
  //     height: 40px;
  //     line-height: 10px;
  //   }
  //   tr:last-child td {
  //     padding-bottom: 10px;
  //     height: 40px;
  //     line-height: 10px;
  //   }
  //   td {
  //     font-size: 12px;
  //     color: #666666;
  //     padding-left: 20px;
  //   }
  //   td:last-child {
  //     height: 25px;
  //     font-size: 12px;
  //     color: green;
  //     font-weight: 200;
  //     padding-left: 25px;
  //     font-family: "微软雅黑";
  //     &.alarmDeal {
  //       color: red;
  //     }
  //   }
  // }
}
.content-bottom {
  width: 100%;
  height: 130px;
  overflow: hidden;
  background: rgba(241, 241, 241, 1);
  box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
  border-radius: 4px;

  .li {
    width: 100%;
    font-weight: 200;
    font-family: MicrosoftYaHei;
    display: inline-block;
    height: 8px;
    margin: 10px 0;;
    line-height: 10px;
    text-align: center;
    .alarm_time {
      width: 30%;
      float: left;
      color: #666666;
      font-size: 13px;
    }
    .alarm_reason {
      width: 40%;
      float: left;
      color: #666666;
      font-size: 13px;
    }
    span:last-child{
      display: block;
      width: 30%;
      float: left;
       color: #666666;
      font-size: 13px;
        &.alarmDeal {
        color: red;
      }

    }
  }
}

@media (min-height: 800px) {
  .container {
    .indivdual-alarm {
      thead {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
      }
    }
    table {
      tbody {
        tr:first-child td {
          height: 40px;
        }
        tr:last-child td {
          height: 40px;
        }
        td:first-child {
          font-size: 14px;
          height: 23px;
        }
        td:last-child {
          height: 23px;
          font-size: 14px;
        }
      }
    }
  }
}
@media (min-height: 900px) {
  .container {
    .indivdual-alarm {
      thead {
        height: 25px;
        line-height: 25px;
        font-size: 15px;
      }
    }
    table {
      tbody {
        tr:first-child td {
          height: 48px;
        }
        tr:last-child td {
          height: 48px;
        }
        td:first-child {
          font-size: 16px;
          height: 30px;
        }
        td:last-child {
          height: 30px;
          font-size: 16px;
        }
      }
    }
  }
}
@media (min-height: 1080px) {
  .container {
    .indivdual-alarm {
      thead {
        height: 40px;
        line-height: 40px;
        font-size: 18px;
      }
    }
    table {
      tbody {
        tr:first-child td {
          height: 55px;
        }
        tr:last-child td {
          height: 55px;
        }
        td:first-child {
          font-size: 18px;
          height: 40px;
        }
        td:last-child {
          height: 40px;
          font-size: 18px;
        }
      }
    }
  }
}
</style>

