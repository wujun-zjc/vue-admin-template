<template>
  <div class="dashboard-container">
    <div class="dashboard-text">su_id : {{ user.su_id }}</div>
    <div class="dashboard-text">so_id : {{ user.so_id }}</div>
    <div class="dashboard-text">su_code : {{ user.su_code }}</div>
    <div class="dashboard-text">su_name : {{ user.su_name }}</div>
    <div class="dashboard-text">token : {{ token }}</div>
    <div class="dashboard-text">name : {{ name }}</div>
    <div class="dashboard-text">roles : <span v-for="role in roles" :key="role">{{ role }} </span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'user',
      'token',
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
