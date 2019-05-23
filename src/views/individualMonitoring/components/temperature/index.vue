<template>
  <div class="container">
    <p class="head">体温变化趋势</p>
    <div id="chart"></div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import echarts from "echarts";
import resize from "@/utils/resize";
import info from "@/json/individualMonitoring/temperature";
export default {
  name: "Temperature",
  mixins: [resize],
  data() {
    return {
      chart: undefined, //温度曲线
      xData: [], //x轴
      series: [],
      data: []
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {},
  mounted() {
    this.initChart();
  },
  methods: {
    //定义温度曲线
    initChart() {
      this.chart = echarts.init(document.getElementById("chart"));
      this.getChartData();
      this.upChartData();
      this.__resizeHandler(); //echarts如表自适应大小
    },
    //获取曲线数据
    getChartData() {
      function time(timeStape) {
        const date = new Date(timeStape);
        const y = date.getFullYear() + "/";
        const m =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "/";
        const d = date.getDate() + "";
        return y + m + d;
      }
      const nowDate = new Date().getTime();
      const nowDate1 = time(nowDate - 24 * 60 * 60 * 1000);
      const nowDate2 = time(nowDate - 24 * 60 * 60 * 1000 * 2);
      const nowDate3 = time(nowDate - 24 * 60 * 60 * 1000 * 3);
      const nowDate4 = time(nowDate - 24 * 60 * 60 * 1000 * 4);
      const nowDate5 = time(nowDate - 24 * 60 * 60 * 1000 * 5);

      this.data = info.data;
      this.xData = [
        nowDate5,
        nowDate4,
        nowDate3,
        nowDate2,
        nowDate1,
        time(nowDate)
      ];
      this.series = [
        {
          type: "line",
          smooth: true,
          lineStyle: {
            width: 1
          },
          data: this.data
        }
      ];
      this.upChartData();
    },
    //更新数据
    upChartData() {
      let option = {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: 18,
          left: 40,
          bottom: 30
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#A1A1A1"
            }
          },
          axisLabel: {
            fontSize: 10
          },
          axisTick: {
            show: false
          },
          data: this.xData
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: "#A1A1A1"
            }
          },
          axisLabel: {
            fontSize: 10
          },
          axisTick: {
            show: false
          }
        },
        color: ["#56A9F9"],
        series: this.series
      };
      this.chart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 0 2px;
  padding-top: 2px;
  .head {
    background: rgba(90, 86, 130, 1);
    box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
    border-radius: 5px;
    height: 15px;
    line-height: 15px;
    text-align: left;
    text-align: center;
    margin: 0;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
}
#chart {
  background: rgba(241, 241, 241, 1);
  box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
  border-radius: 5px;
  width: 100%;
  height: 115px;
}
@media (min-height: 800px) {
  .container {
    .head {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
    #chart {
      height: 140px;
    }
  }
}
@media (min-height: 900px) {
  .container {
    .head {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
    }
    #chart {
      height: 165px;
    }
  }
}
@media (min-height: 1080px) {
  .container {
    .head {
      height: 40px;
      line-height: 40px;
      font-size: 18px;
    }
    #chart {
      height: 215px;
    }
  }
}
</style>
