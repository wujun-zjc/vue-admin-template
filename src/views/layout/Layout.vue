<template>
  <div :class="classObj" class="app-wrapper">
    <div class="app-header">
      <router-link class="logo-wraper" to="/">
        <div class="logo-name">
          <div class="logo-box">
            <svg-icon icon-class="cloud"/>
          </div>
          <div class="name-box">
            <span class="name">{{ $t('header.platformName') }}</span>
          </div>
        </div>
      </router-link>

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <svg-icon icon-class="user"/>
          <span class="user-name">{{ $t('header.userName') }}</span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="lang-select-wraper">
        <lang-select class="international right-menu-item"/>
      </div>

      <div class="sub-system-nav">
        <router-link
          v-for="subSystem in subSystemList"
          :key="subSystem.title"
          class="sub-system"
          to="subSystem.path"
        >
          <span class="name">{{ subSystem.title }}</span>
        </router-link>
      </div>
    </div>
    <div class="app-body">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
      <sidebar class="sidebar-container"/>
      <div class="main-container">
        <navbar/>
        <tags-view/>
        <app-main/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import LangSelect from '@/components/LangSelect'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    LangSelect
  },
  mixins: [ResizeMixin],
  data() {
    return {
      subSystemList: []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'language']),
    lang() {
      return this.$store.state.app.language
    },
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    lang() {
      this.setSubSystemList()
    }
  },
  mounted() {
    this.setSubSystemList()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    setSubSystemList() {
      this.subSystemList = [
        { title: this.$t('subSystem.home'), path: '/' },
        { title: this.$t('subSystem.intelligentmonitoring'), path: '/' },
        { title: this.$t('subSystem.algorithmmodel'), path: '/' },
        { title: this.$t('subSystem.precisionplanting'), path: '/' },
        { title: this.$t('subSystem.expertplatform'), path: '/' },
        { title: this.$t('subSystem.traceabilitymanagement'), path: '/' },
        { title: this.$t('subSystem.organizationalmanagemen'), path: '/' },
        { title: this.$t('subSystem.systemsetting'), path: '/' }
      ]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  .app-header {
    width: 100%;
    height: 70px;
    line-height: 70px;
    padding: 0 20px;
    background-color: #245ca2;
    color: #fff;
    overflow: hidden;
    .logo-wraper {
      // min-width: 160px;
      // margin-right: 10%;
      margin-right: 50px;
      float: left;
      .logo-name {
        overflow: hidden;
        .logo-box,
        .name-box {
          // display: inline-block;
          float: left;
          height: 70px;
          line-height: 70px;
        }
        .logo-box {
          .svg-icon {
            font-size: 70px;
            margin-top: -5px;
          }
        }
        .name-box {
          .name {
            font-size: 22px;
          }
        }
      }
    }
    .sub-system-nav {
      float: left;
      height: 70px;
      line-height: 70px;
      a {
        padding: 0 10px;
        border-right: 1px solid #fff;
        display: inline-block;
        max-width: 100px;
        height: 20px;
        line-height: 20px;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        //  overflow-wrap: break-word;
        span {
          padding: 0 10px;
          font-size: 14px;
        }
      }
      a:last-child {
        border: 0;
      }
      a:hover {
        max-width: 300px;
        span {
          background-color: #3170bf;
          font-size: 16px;
        }
      }
    }
    .lang-select-wraper {
      float: right;
      margin-right: 20px;
    }
    .avatar-container {
      float: right;
      .avatar-wrapper {
        cursor: pointer;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: middle;
        }
        .svg-icon {
          font-size: 30px;
          margin-top: -5px;
        }
        .user-name {
          color: #fff;
        }
        .el-icon-caret-bottom {
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
