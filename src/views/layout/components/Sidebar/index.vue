<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <!-- :default-active="$route.path" -->
    <el-menu
      ref="menu"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      unique-opened
      mode="vertical"
      text-color="#bfcbd9"
      background-color="#404b87"
      active-text-color="#409EFF"
    >
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    $route(to) {
      setTimeout(() => {
        this.$refs.menu.activeIndex = to.path
      }, 200)
    }
  }
}
</script>
