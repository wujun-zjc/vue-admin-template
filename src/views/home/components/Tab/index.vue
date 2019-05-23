<template>
  <div class="container">
    <div class="container-right">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item,index) in header">
          <el-tab-pane :label="item.lable" :name="item.name" :key="index">
            <div class="content">
              <div class="content-left">
                <div class="content-name">
                  <p>[{{bg_show}}]</p>
                </div>
                <div class="content-detail">
                  <ul>
                    <li>
                      <p>
                        <span>在栏数</span>
                        <span>报警数</span>
                        <span>隔离数</span>
                        <span>报警率</span>
                      </p>
                      <p>
                        <span>{{parameter.live}}</span>
                        <span>{{parameter.police}}</span>
                        <span>{{parameter.quarantine}}</span>
                        <span>{{parameter.rate}}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>温度(℃)</span>
                        <span>湿度(%)</span>
                        <span>CO2(mg/m³)</span>
                      </p>
                      <p>
                        <span>{{climate.temperature}}</span>
                        <span>{{climate.wet}}</span>
                        <span>{{climate.CO2}}</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="content-right">
                <div class="content-right-top">
                  <el-button type="primary" @click="alarmHandle">告警</el-button>
                  <el-button @click="alarmAll">全部</el-button>
                </div>
                <div class="content-right-bottom">
                  <table cellpadding="0" cellspacing="0" class="police">
                    <thead>
                      <tr>
                        <th>编号</th>
                        <th>体温℃</th>
                        <th>心率(BPM)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,index) in police" :key="index">
                        <td>{{item.number}}</td>
                        <td :class="temperatureLimit(item.tem)">{{item.tem}}</td>
                        <td :class="rateLimit(item.rate)">{{item.rate}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="alarm">
      <el-card class="box-card" :body-style="{ padding: '0px' }">
        <div slot="header" class="clearfix">
          <span>
            <i></i>报警栏
          </span>
          <el-button
            style="float: right;font-size:50px; padding:0;line-height:0;padding-top:8px; color:#000;"
            type="text"
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
    <div class="video-monitor">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>
            <i></i>视频
          </span>
          <el-button
            style="float: right;font-size:50px; padding:0;line-height:0;padding-top:8px;color:#000;"
            type="text"
          >···</el-button>
        </div>
        <div class="video-detail">
          <div class="video-detail-header">
            <ul>
              <li>
                <span>摄像头总数</span>
                <span>在线视频</span>
              </li>
              <li>
                <span>{{sum}}</span>
                <span>{{online}}</span>
              </li>
            </ul>
            <div class="btn">
              <el-button type="primary" round @click="detail">进入监控</el-button>
            </div>
          </div>
          <div class="video-detail-info">
            <div class="video">
              <img :src="image" alt>
              <!-- <video-player
              class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              :options="playerOptions"
              v-loading="videoLoading"
              ></video-player>-->
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import vueSeamless from "vue-seamless-scroll";
import info from "@/json/home/tab";
import alarm from "@/json/home/alarm";
import video from "@/json/home/video";
export default {
  components: {
    vueSeamless
  },
  data() {
    return {
      activeName: "first",
      header: [],
      parameter: undefined,
      element: undefined,
      bg_show: "",
      climate: undefined,
      police: undefined,
      option: {
        step: 1,
        limitMoveNum: 1,
        openTouch: false,
        waitTime: 2000,
        direction: 1,
        singleHeight: 38
      },
      listLoading: false,
      list: [],
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getList();
  },
  methods: {
    
    //加載數據
    getList() {
      this.header = info.header;
      this.parameter = info.header[0].parameter;
      this.element = info.header[0].element;
      this.bg_show = info.header[0].bg_show;
      this.climate = info.header[0].climate;
      this.police = info.header[0].policeAll;
      //報警蘭
      //模拟请求
      this.list = alarm.result[0];
      //视频监控
      this.sum = video.result[0].sum;
      this.online = video.result[0].online;
      this.image = video.result[0].image;
    },

    handleClick(tab, event) {
      this.parameter = info.header[tab.index].parameter;
      this.element = info.header[tab.index].element;
      this.bg_show = info.header[tab.index].bg_show;
      this.climate = info.header[tab.index].climate;
      this.sum = video.result[tab.index].sum;
      this.online = video.result[tab.index].online;
      this.image = video.result[tab.index].image;
      this.police = info.header[tab.index].policeAll;
      this.list = alarm.result[tab.index];
    },
    //点击全部按钮

    //点击告警按钮
    alarmAll() {
      this.police = info.header[0].police;
    },
    alarmHandle() {
      this.police = info.header[0].policeAll;
    },
    //點擊進入監控
    detail() {},
    //体温上下限设置
    temperatureLimit(item) {
      if (item > 40 && item < 43) {
        return "standardOrange";
      } else if (item > 43 || item < 36) {
        return "standardRed";
      }
    },
    //心率上下限设置
    rateLimit(item) {
      if (item > 130 && item < 150) {
        return "standardOrange";
      } else if (item > 150 || item < 70) {
        return "standardRed";
      }
    },
  }
};
</script>
<style>
.container .el-tabs__nav-wrap::after {
  height: 0;
}
.container .el-tabs__nav {
  margin-left: 20px;
}
.container .el-tabs__active-bar {
  background-color: #c804da;
  height: 3px;
}
.container .el-tabs__item.is-active {
  color: #c804da;
}
.el-table td,
.el-table th.is-leaf {
  border: none;
}
.alarm .el-table th {
  background: #f9f9f9;
}
</style>
<style lang="scss" scoped>
.container {
  padding: 0;
  .container-right {
    background: #ffffff;
  }
  .content {
    background: #ffffff;
    height: 300px;
    background: url("/static/images/tab_bg.png") no-repeat;
    background-size: cover;
    .content-left {
      width: 50%;
      float: left;
    }
    .content-right {
      width: 45%;
      float: right;
      padding-right: 40px;
      margin-top: 55px;
      .content-right-top {
        .el-button {
          width: 50%;
          height: 40px;
          float: left;
          background: rgba(66, 198, 56, 1);
          border-radius: 5px;
          font-size: 16px;
          font-family: MicrosoftYaHei-Bold;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          &:last-child {
            background: rgba(255, 255, 255, 1);
            font-size: 16px;
            font-family: MicrosoftYaHei-Bold;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            margin: 0;
          }
        }
      }
      .content-right-bottom {
        display: inline-block;
        height: 154px;
        overflow: hidden;
        width: 100%;
        table {
          width: 100%;
          height: 154px;

          thead {
            tr {
              font-size: 12px;
              font-family: SourceHanSansCN-Regular;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              height: 25px;
              line-height: 20px;
              background: rgba(90, 86, 130, 1);
              width: 100%;
              th:first-child {
                width: 40%;
              }
              th:nth-child(2) {
                width: 20%;
              }
              th:nth-child(3) {
                width: 40%;
              }
            }
          }
          tbody {
            background: rgba(211, 212, 214, 1);
            font-size: 12px;
            text-align: center;
            tr {
              font-size: 16px;
              font-family: SourceHanSansCN-Regular;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);

              td:first-child {
                width: 40%;
              }
              td:nth-child(2) {
                width: 20%;
              }
              td:nth-child(3) {
                width: 40%;
              }
              .standardOrange {
                background: #fecb31;
              }
              .standardRed {
                background: #f97272;
              }
            }
          }
        }
      }
    }
  }
  .content-name {
    height: 80px;
    line-height: 140px;
    width: 100%;
    float: left;
    p {
      width: 173px;
      height: 35px;
      font-size: 30px;
      font-family: MicrosoftYaHeiLight;
      font-weight: 300;
      color: rgba(255, 255, 255, 1);
      margin: 0 auto;
    }
  }
  .content-detail {
    width: 100%;
    float: left;
    line-height: 300px;
    ul li {
      list-style-type: none;
      p {
        width: 100%;
        height: 12px;
        font-size: 14px;
        font-family: MicrosoftYaHei-Bold;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 42px;
        text-align: center;
        span {
          display: inline-block;
          width: 24%;
        }
      }
      p:last-child {
        width: 100%;
        height: 40px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 60px;
        span {
          font-size: 36px;
        }
      }
    }
    ul li:nth-child(2) {
      p:first-child {
        width: 100%;
        height: 25px;
        background: rgba(90, 86, 130, 1);
        margin: 0;
        line-height: 25px;
        text-align: center;
        span {
          width: 30%;
        }
      }
      p:last-child {
        width: 100%;
        height: 48px;
        line-height: 48px;
        background: rgba(241, 241, 241, 0.45);
        margin: 0;
        text-align: center;
        span {
          width: 30%;
          font-size: 18px;
          font-family: SourceHanSansCN-Regular;
          font-weight: 400;
          color: white;
          z-index: 99999999;
        }
      }
    }
  }
}
//報警蘭
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
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
.alarm {
  float: left;
  width: 50%;
  margin-top: 13px;
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
    margin: 0;
    color: rgba(51, 51, 51, 1);
    .alarm_time {
      color: #333333;
      font-size: 13px;
      padding-left: 60px;
      height: 38px;
      line-height: 38px;
    }
    .alarm_reason {
      color: #333333;
      font-size: 13px;
      padding-left: 80px;
      height: 38px;
      line-height: 38px;
    }
  }
}
//视频监控
.video-monitor {
  float: right;
  width: 50%;
  margin-top: 13px;
  .text {
    font-size: 14px;
  }
  .box-card {
    height: 375px;
    margin-bottom: 10px;
    margin-left: 10px;
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
    .video-detail {
      .video-detail-header {
        width: 100%;
        height: 60px;
        float: left;
        padding: 0;
        ul {
          margin: 0;
          padding: 0;
          height: 60px;
          width: 60%;
          float: left;
        }
        ul li {
          width: 100%;
          float: left;
          height: 24px;
          text-align: center;
          line-height: 24px;
          list-style-type: none;
          span {
            width: 35%;
            height: 12px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 42px;
          }
        }
        ul li:last-child {
          span {
            height: 20px;
            font-size: 24px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color: rgba(2, 2, 2, 1);
            line-height: 42px;
          }
        }
        .btn {
          width: 40%;
          height: 70px;
          line-height: 70px;
          float: left;
          .el-button {
            width: 120px;
            font-size: 14px;
            border-radius: 8px;
          }
        }
      }
      .video-detail-info {
        width: 100%;
        float: left;
        text-align: center;
        .video {
          width: 100%;
          height: 100%;
          margin: auto;
          margin-top: 10px;
          img {
            width: 360px;
            height: 200px;
          }
        }
      }
    }
  }
}
</style>

