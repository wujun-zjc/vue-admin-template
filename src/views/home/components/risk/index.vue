<template>
  <div>
    <el-card class="box-card" :body-style="{ padding: '0px' }" shadow="hover">
      <div slot="header" class="clearfix">
        <span>
          <i></i>风险管理
        </span>
        <el-button
          style="float: right;font-size:50px; padding:0;line-height:0;padding-top:8px;color:#000"
          type="text"
        >···</el-button>
      </div>
      <div class="info">
        <div class="info_left">
          <ul>
            <li>
              <span>风险警示</span>
              <span>风险预警</span>
            </li>
            <li>
              <span>{{caution}} &nbsp;&nbsp;&nbsp;<img src="/static/images/up.png"/></span>
              <span>{{warn}} &nbsp;&nbsp;&nbsp;<img src="/static/images/down.png"/></span>
            </li>
          </ul>
        </div>
        <div class="info_right">
          <div id="Chart" :style="{width:'100%',height:'200px'}"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import echarts from "echarts";
import resize from "@/utils/resize";
import info from "@/json/home/risk";
export default {
  name: "risk",
  mixins: [resize],
  data() {
    return {
      legendDate: [], //图例
      caution: undefined,
      warn: undefined,
      data: [],
      chart: undefined
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getList();
  },
  mounted() {
    this.initChart();
  },
  methods: {
    getList() {
      this.caution = info.caution;
      this.warn = info.warn;
    },
    //定义图标
    initChart() {
      this.chart = echarts.init(document.getElementById("Chart"));
      this.getChartData();
      this.upChartData();
      //this.__resizeHandler(); //echarts如表自适应大小
    },
    getChartData() {
      let legend = [];
      //this.legendDate = ["进行中", "已整改", "未整改"];
      info.result.forEach(function(item, index) {
        legend.push(item.name);
      });
      this.legendDate = legend;
      this.data = info.result;
    },
    //更新echart数据
    upChartData() {
      let option = {
        title: {},
        tooltip: {
          trigger: "item",
          formatter: "{b} :{c}({d}%)"
        },
        legend: {
          top: "40%",
          orient: "vertical",
          left: "right",
          data: this.legendDate
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["40%", "50%"],
            itemStyle: {
              normal: {
                label: {
                  show: false //隐藏标示文字
                },
                labelLine: {
                  show: false //隐藏标示线
                }
              }
            },
            data: this.data
          }
        ],
        color: ["#32A1C5", "#32C562", "#C30165"]
      };
      this.chart.setOption(option);
    }
  }
};
</script>
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
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  height: 375px;
  margin-bottom: 10px;
  margin-top: 2px;
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
}
.info {
  .info_left {
    ul {
      li {
        list-style-type: none;
        width: 90%;
        height: 25px;
        background: rgba(90, 86, 130, 1);
        border-radius: 5px;
        padding: 0;
        text-align: center;
        span {
          width: 40%;
          height: 12px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 25px;
        }
      }
      li:last-child {
        height: 48px;
        background: rgba(241, 241, 241, 1);
        border-radius: 5px;
        span {
          height: 20px;
          font-size: 24px;
          font-family: MicrosoftYaHei;
          font-weight: 400;
          color: rgba(195, 1, 101, 1);
          line-height: 50px;
        }
      }
    }
  }
  .info_right {
    float: left;
    width: 70%;
  }
}
</style>
<style scoped>
</style>


