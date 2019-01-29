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
    <div id="cesiumContainer">
      <sm-viewer
        :animation="animation"
        :camera="camera"
        cesium-path="../../src/assets/Cesium"
        @ready="ready"
      />
    </div>
  </div>
</template>

<script>
import SmViewer from 'vue-cesium-supermap/components/viewer/viewer.vue'

import { mapGetters } from 'vuex'

export default {
  components: {
    SmViewer
  },
  data() {
    return {
      camera: {
        position: {
          longitude: 121.50109,
          latitude: 31.23691,
          height: 20000
        },
        heading: 360,
        pitch: -90,
        roll: 0
      },
      animation: false
    }
  },
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
    },
    ready(param) {
      this.camera.position.longitude = 116.23
      this.camera.position.latitude = 39.54
      this.camera.position.height = 50000
      this.animation = true
      // this.camera.position.longitude = 121.50109
      // this.camera.position.latitude = 31.23691
      // this.camera.position.height = 500
      // this.animation = true
    }
  }
}
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
