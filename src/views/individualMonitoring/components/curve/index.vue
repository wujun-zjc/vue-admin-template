<template>
  <div class="container">
    <p class="head">生长曲线</p>
    <div id="Chart"></div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import echarts from "echarts";
import resize from "@/utils/resize";
import info from "@/json/individualMonitoring/curve";
export default {
  name: "Curve",
  mixins: [resize],
  data() {
    return {
      chart: undefined, //生长曲线
      xData: [], //x轴
      series: [], //数据显示
      lengend: [], //图例
      data1: [],
      data2: []
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
    //定义生长曲线
    initChart() {
      this.chart = echarts.init(document.getElementById("Chart"));
      this.getChartData();
      this.upChartData();
      this.__resizeHandler(); //echarts如表自适应大小
    },
    //生长曲线
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
      this.xData = [
        nowDate5,
        nowDate4,
        nowDate3,
        nowDate2,
        nowDate1,
        time(nowDate)
      ];
      this.lengend = ["预测生长曲线", "实际生长曲线"];
      this.data1 = info.data1;
      this.data2 = info.data2;
      this.series = [
        {
          type: "line",
          name: "预测生长曲线",
          smooth: true,
          lineStyle: {
            width: 1
          },
          data: this.data1
        },
        {
          type: "line",
          name: "实际生长曲线",
          smooth: true,
          lineStyle: {
            width: 1
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#E71B2F" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#eee" // 100% 处的颜色
                }
              ]
            }
          },
          data: this.data2
        }
      ];
      this.upChartData();
    },
    //更新echarts
    upChartData() {
      let option = {
        legend: {
          data: this.lengend,
          bottom: 10,
          itemWidth: 10,
          itemHeight: 4,
          textStyle: {
            fontSize: 10
          }
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: 18,
          left: 40
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xData,
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
        color: ["#56A9F9", "#E71B2F"],
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
    border-radius: 4px;
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
#Chart {
  background: rgba(241, 241, 241, 1);
  box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
  border-radius: 5px;
  width: 100%;
  height: 165px;
}
@media (min-height: 800px) {
  .container {
    .head {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
    #Chart {
      height: 165px;
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
    #Chart {
      height: 215px;
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
    #Chart {
      height: 260px;
    }
  }
}
</style>


