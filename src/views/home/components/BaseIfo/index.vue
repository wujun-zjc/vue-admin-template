<template>
  <div>
    <el-card class="box-card" :body-style="{ padding: '0px' }" shadow="hover">
      <div slot="header" class="clearfix">
        <span>
          <i></i>养殖场基本信息
        </span>
        <el-button
          style="float:right;font-size:50px; padding:0;line-height:0;padding-top:8px;color:#000"
          type="text"
        >···</el-button>
      </div>
      <div class="info">
        <div class="info-time">
          <ul>
            <li>
              <i class="el-icon-date"></i>
              开始日期：{{base.date}}
            </li>
            <li>
              <i class="el-icon-time"></i>
              系统运行时长：{{base.duration}}
            </li>
          </ul>
        </div>
        <div class="info-process">
          <div class="info-process-left">
            <p>
              过程评价
              <span>{{base.evaluate}}</span>
            </p>
          </div>
          <div class="info-process-right">
            <ul>
              <li>
                <span>死亡率</span>
                <span>报警率</span>
              </li>
              <li>
                <span>{{base.death}}</span>
                <span>{{base.alarm}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="info-detail">
          <ul>
            <li>
              <span>存栏数</span>
              <span>{{base.animals}}</span>
            </li>
            <li>
              <span>猪社数</span>
              <span>{{base.piggery}}</span>
            </li>
            <li>
              <span>已出栏数</span>
              <span>{{base.slaughter}}</span>
            </li>
          </ul>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import info from "@/json/home/baseIfo";
export default {
  name: "BaseIfo",
  data() {
    return {
      base: {
        evaluate: undefined,
        date: undefined, //开始日期
        death: undefined,
        alarm: undefined,
        duration: undefined, //系统运行时长
        animals: undefined, //存栏数
        piggery: undefined, //猪舍数
        slaughter: undefined //已出栏数
      }
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.base.evaluate = info.result.evaluate;
      this.base.date = info.result.date;
      this.base.death = info.result.death;
      this.base.alarm = info.result.alarm;
      this.base.duration = info.result.duration;
      this.base.animals = info.result.animals;
      this.base.piggery = info.result.piggery;
      this.base.slaughter = info.result.slaughter;
    }
  }
};
</script>
<style>
.el-card, .el-message{
  border:none;
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
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  height:354px;
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
  .info {
    margin: 0;
    div {
      float: left;
      width: 100%;
    }
    .info-time{
      height: 45px;
      line-height: 45px;
      background: rgba(247, 248, 249, 1);
      box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
      ul {
        margin: 0;
        li {
          list-style-type: none;
          float: left;
          width: 50%;
          font-size: 12px;
          font-family: MicrosoftYaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          i {
            color: rgba(51, 51, 51, 1);
          }
        }
      }
    }
    .info-process .info-process-left {
      p {
        margin-top: 0;
        margin-bottom: 0;
        height: 100px;
        line-height: 120px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(50, 50, 50, 1);
        margin-left: 23px;
        span {
          height: 33px;
          font-size: 36px;
          font-family: KaiTi;
          font-weight: 400;
          color: rgba(251, 10, 10, 1);
          line-height: 42px;
          margin-left: 23px;
        }
      }
    }
    .info-process .info-process-left,
    .info-process .info-process-right {
      width: 50%;
      float: left;
      ul {
        padding-left: 0;
        li {
          list-style-type: none;
          width: 90%;
          height: 25px;
          background: rgba(90, 86, 130, 1);
          border-radius: 5px;
          text-align: center;
          span {
            width: 80px;
            height: 12px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
          }
        }
        li:nth-child(2) {
          width: 90%;
          height: 48px;
          line-height: 48px;
          background: rgba(241, 241, 241, 1);
          border-radius: 5px;
          span {
            height: 20px;
            font-size: 24px;
            color: rgba(0, 204, 51, 1);
            line-height: 42px;
          }
        }
      }
    }
    .info-detail {
      height: 146px;
      background: linear-gradient(
        -56deg,
        rgba(90, 86, 130, 1),
        rgba(137, 123, 244, 1)
      );
      ul li {
        width: 33%;
        height: 70px;
        line-height: 70px;
        text-align: center;
        float: left;
        margin-top: 20px;
        margin-bottom: 20px;
        list-style-type: none;
        border-right: 1px solid rgba(255, 255, 255, 1);
        span {
          display: block;
          height: 20px;
          font-size: 14px;
          font-family: MicrosoftYaHei-Bold;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
        }
        span:last-child {
          height: 50px;
          line-height: 50px;
          font-size: 36px;
          font-family: MicrosoftYaHei;
          font-weight: 400;
        }
        &:last-child {
          border: none;
        }
      }
    }
  }
}
</style>
<style>
.el-card{
  border-radius: 0
}
</style>
