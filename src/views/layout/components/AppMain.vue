<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <keep-alive :include="cachedViews">
      <!-- <keep-alive> -->
        <router-view :key="key"/>
        <!-- <router-view/> -->
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 120px); */
  height: calc(100vh - 144px);
  // padding: 20px;
  position: relative;
  overflow: hidden; 
  overflow-y: auto;
  background-color: #e7ecf0;
}
</style>
