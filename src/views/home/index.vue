<template>
  <div class="app-container">
    <div class="clear"></div>
    <div class="content">
      <div class="home-left">
        <div class="home-farm">
          <BaseIfo/>
        </div>
        <div class="home-risk">
          <risk/>
        </div>
      </div>
      <div class="home-right">
        <div class="home-measure">
          <Tab/>
        </div>
        <!-- <div class="home-right-bottom">
          <div class="home-alarm">
            <Alarm/>
          </div>
          <div class="home-video">
            <Video/>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import BaseIfo from "./components/BaseIfo/index";
import Overview from "./components/Overview/index";
import Alarm from "./components/Alarm/index";
import risk from "./components/risk/index";
import Environment from "./components/Environment/index";
import Video from "./components/Video/index";
import Tab from "./components/Tab/index";
export default {
  components: { BaseIfo, Overview, Alarm, risk, Environment, Video, Tab },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {}
};
</script>
<style>
/* .app-main[data-v-6beed8bc] {
  overflow: auto;
} */
</style>
<style lang="scss" scoped>
.content {
  display: inline-block;
  width: 100%;
}
.home-left {
  width: 35%;
  float: left;
  div {
    height: 50%;
  }
}
.home-right {
  width: 64%;
  float: left;
  margin-left: 10px;
  .home-measure {
    width: 100%;
  }
  .home-right-bottom {
    float: left;
    width: 100%;
    .home-alarm {
      float: left;
      margin-top: 12px;
      width: 50%;
    }
    .home-video {
      width: 50%;
      float: left;
      margin-top: 12px;
    }
  }
}
.clear {
  clear: both;
}
</style>


