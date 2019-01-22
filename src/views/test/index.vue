<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="testData"/>
      </el-form-item>
      <el-form-item style="width:100px;height:100px">
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  // data() {
  //   return {
  //     name: ''
  //   }
  // },
  computed: {
    ...mapGetters(['testData'])
  },
  methods: {
    onSubmit() {
      this.loading = true
      this.$store
        .dispatch('Test', this.testData)
        .then(() => {
          this.loading = false
          this.$message({
            message: 'test',
            type: 'success'
          })
        })
        .catch(() => {
          this.loading = false
          this.$message({
            message: 'test',
            type: 'error'
          })
        })
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
