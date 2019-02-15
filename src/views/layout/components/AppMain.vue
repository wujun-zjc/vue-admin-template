<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <router-view/>
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
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  /* min-height: calc(100vh - 120px); */
  height: calc(100vh - 154px);
  // padding: 20px;
  position: relative;
  overflow: hidden; 
  overflow-y: auto;
  background-color: #e7ecf0;
}
</style>
