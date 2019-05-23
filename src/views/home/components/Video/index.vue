<template>
  <div>
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
            <img src="/static/images/video.png" alt>
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
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
require("video.js/dist/video-js.css");
require("vue-video-player/src/custom-theme.css");
import "videojs-contrib-hls";
import info from "@/json/home/video";
export default {
  name: "Video",
  components: { videoPlayer },
  data() {
    return {
      sum: undefined,
      online: undefined,
      videoLoading: false,
      playerOptions: {
        // 如果true,浏览器准备好时开始回放。
        autoplay: true,
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频(如果浏览器支持)
        preload: "auto",
        language: "zh-CN",
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字(例如"16:9"或"4:3")
        aspectRatio: "16:9",
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [{ src: undefined }],
        // width: document.documentElement.clientWidth,
        // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      }
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getLsit();
  },
  methods: {
    //加载数据
    getLsit() {
      this.sum = info.result.sum;
      this.online = info.result.online;
    },

    //进入监控
    detail() {}
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
  margin-left: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 5px 0px rgba(2, 2, 2, 0.1);
  div span {
    font-size: 16px;
    font-weight: bolder;
    font-family: MicrosoftYaHei;
    display: inline-block;
    height: 20px;
    line-height: 20px;
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
        margin-top: 20px;
        img {
          width: 100%;
          height: 100%;
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
