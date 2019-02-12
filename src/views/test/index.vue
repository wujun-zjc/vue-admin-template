<template>
  <div class="app-container">
    <!-- <el-form label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="testData"/>
      </el-form-item>
      <el-form-item style="width:100px;height:100px">
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>-->
    <!-- <svg-icon icon-class="password"/> -->
    <div id="cesiumContainer">
      <sm-viewer
        @ready="ready"
        cesium-path="/static/Cesium"
        :selectionIndicator="false"
        :infoBox="false"
        :navigation="false"
        skyAtmosphere.show="false"
        :scene3DOnly="true"
        :baseLayerPicker="false"
        :sceneModePicker="false"
        :navigationHelpButton="false"
        :animation="false"
        :timeline="false"
        :allowDataSourcesToSuspendAnimation="false"
      />
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import PopUp from '@/assets/js/Popup.js'
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
    ready(cesiumInstance) {
      // this.camera.position.longitude = 121.50109
      // this.camera.position.latitude = 31.23691
      // this.camera.position.height = 500
      // this.animation = true
      let Cesium = cesiumInstance.Cesium
      let viewer = cesiumInstance.viewer
      var popup1, pickPosition, DATA_SOURCE, TIMER
      var pinBuilder,
        cameraPosition = 0
      var scene = viewer.scene
      var widget = viewer.cesiumWidget
      var boll = scene.globe
      //去除logo图片
      // viewer._cesiumWidget._creditContainer.style.display="none";
      var credit = viewer.scene.frameState.creditDisplay
      credit.container.removeChild(credit._imageContainer)
      var entities
      // $('#loadingbar').remove()
      //打开所发布三维服务下的所有图层
      var promise = scene.open(
        'http://223.80.100.88:487/iserver/services/3D-shangmaqingdao/rest/realspace'
        // 'http://localhost:8090/iserver/services/3D-shangmaqingdao/rest/realspace'
      )
      Cesium.when.all(promise, function(layers) {
        //设置图层的阴影模式
        scene.camera.setView(
          {
            //将中国区域的经度、纬度、高度的坐标转换为笛卡尔坐标
            destination: new Cesium.Cartesian3.fromDegrees(
              104.29412847500009,
              29.941657399448363,
              28000000
            )
            /*  orientation : {
                            heading : 4.844795866469065,
                            pitch : -0.58125995096984,
                            roll :1.2504663970958063e-11
                        } */
            // }
          },
          function(e) {
            if (widget._showRenderLoopErrors) {
              var title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？'
              widget.showErrorPanel(title, undefined, e)
            }
          }
        )
        //地球自转，x为初始的经度，通过定时器去旋转球
        var x = 0
        TIMER = setInterval(function() {
          x = x + 0.1
          viewer.scene.camera.setView({
            destination: new Cesium.Cartesian3.fromDegrees(x, 30, 23000000)
          })
        }, 8)
      })
      /********************************添加天地图矢量底图为背景 ***********************************/

      viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url:
            'http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=249553704f8b43ae43b0bec52248fc93',
          layer: 'tdtVecBasicLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
          show: false
        })
      )
      /********************************添加天地图矢量标记为背景 ***********************************/

      viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url:
            'http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=249553704f8b43ae43b0bec52248fc93',
          layer: 'tdtAnnoLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible'
        })
      )
      /**************************************点击事件的响应 *************************************/

      var handler0 = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler0.setInputAction(function(movement) {
        var pick = viewer.scene.pick(movement.position)
        // debugger
        //随便点击某处后，飞到中国区域去
        if (pick == undefined) {
          flytoScene()
        } else {
          //如果点中的是基地的话，就飞向上马基地的范围
          scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              120.199366530169,
              36.31656297279485,
              2000
            ),
            duration: 3 //设置飞行的时间
          })
          viewer.entities.removeAll()

          addDevices()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      //注销调相机场景的跟踪模式，取消鼠标左键双击，则会追踪到该位置
      widget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      )

      function addDevices() {
        viewer.entities.removeAll()
        //摄像头、水层,气象，温室，病虫害，
        var devices = []
        devices[0] = [120.196381223842, 36.3170743447118, '摄像头']
        devices[1] = [120.194874749817, 36.3162450929545, '水层']
        devices[2] = [120.195994239689, 36.3159686757021, '气象']
        devices[3] = [120.194805645504, 36.3148906484176, '温室']
        devices[4] = [120.197555997165, 36.3149597527307, '病虫害']
        for (var i = 0; i < devices.length; i++) {
          var des1 = ''
          var entity = null,
            statuscolor,
            shebei_image = null,
            shebi_height = null
          //根据设备类型，设置不同的图标
          // var numType = fieldNames.indexOf('TYPE');
          // var type = selectedFeatures[i].fieldValues[numType];
          switch (i) {
            case 0:
              shebei_image = './images/青岛摄像头.png'
              shebi_height = 30
              break
            case 1:
              shebei_image = './images/青岛水层.png'
              shebi_height = 30
              break
            case 2:
              shebei_image = './images/青岛气象.png'
              shebi_height = 10
              break
            case 3:
              shebei_image = './images/青岛温室.png'
              shebi_height = 30
              break
            case 4:
              shebei_image = './images/青岛病虫害.png'
              shebi_height = 30
              break
            default:
              break
          }
          console.log('设备信息:::' + devices[i][0])
          var equipment_position = Cesium.Cartesian3.fromDegrees(
            parseFloat(devices[i][0]),
            parseFloat(devices[i][1]),
            parseFloat(shebi_height)
          )
          //添加设备到场景中
          popup1.closePopUp()
          // debugger
          var entity = {
            id: 'qingdao' + i,
            position: equipment_position,
            billboard: {
              image: shebei_image,
              width: 30,
              height: 40,
              scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1, 8.0e6, 0.0),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              //disableDepthTestDistance: 10,
              horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              //get和set远近广告牌的半透明属性根据广告牌的距离相机。
              translucencyByDistance: new Cesium.NearFarScalar(
                1.5e2,
                1.0,
                8.0e6,
                0.0
              )
            },
            name: devices[i][2],
            description: ''
          }
          viewer.entities.add(entity)
        }
      }

      //=====================鼠标移动到图标上后，弹出介绍信息========================================
      popup1 = new PopUp(viewer)
      var hoverHandler = viewer.screenSpaceEventHandler
      hoverHandler.setInputAction(function(e) {
        var pick = viewer.scene.pick(e.endPosition)
        let pickedEntity = Cesium.defined(pick) ? pick.id : undefined
        if (pick && pick.id) {
          //选中某模型
          // if (Cesium.defined(previousPickedEntity) && Cesium.defined(previousPickedEntity.model)) {
          // previousPickedEntity.model.scale = 0.002;
          var position_value = pick.id._position._value
          //可以通过id查询业务库
          var des = pick.id._description._value
          //将笛卡尔坐标转化为经纬度坐标
          var cartographic = Cesium.Cartographic.fromCartesian(position_value)
          var longitude = Cesium.Math.toDegrees(cartographic.longitude)
          var latitude = Cesium.Math.toDegrees(cartographic.latitude)
          var height = cartographic.height
          //给获取的位置点添加偏移量，根据sqlquery方法里面设置的entity的样式
          var bubbleposition = new Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            0
          )

          if (des == null) {
            popup1.showPopUp(bubbleposition)
            popup1.showHtml('<p>' + '</p>')
          } else {
            // debugger
            var htmlStr = ''
            if (!des) {
              $('#trackPopUpLink').css({
                height: '450px',
                width: '800px'
              })
              htmlStr =
                '<iframe src="static_info.html"   scrolling="no" frameborder="0" width="100%"; height="450px"></iframe>'
            } else {
              $('#trackPopUpLink').css({
                height: '300px',
                width: '620px'
              })
              htmlStr =
                '<iframe src="area_about.html"   scrolling="no" frameborder="0" width="100%"; height="300px"></iframe>'
            }

            popup1.closePopUp()
            popup1.showPopUp(bubbleposition)
            popup1.showHtml(htmlStr)
          }
        } else {
          popup1.closePopUp() /*  $('#trackPopUp').hide(); */
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      //=====================SQL查询的函数，从数据服务中查询基地的位置信息===================
      function doSqlQuery(SQL) {
        var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams
        getFeatureParam = new SuperMap.REST.FilterParameter({
          attributeFilter: SQL
        })
        getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
          queryParameter: getFeatureParam,
          toIndex: -1,
          datasetNames: ['qingdao:' + 'jidi']
        })
        var url =
          'http://223.80.100.88:487/iserver/services/data-shangmaqingdao/rest/data'
        // 'http://localhost:8090/iserver/services/data-shangmaqingdao/rest/data'
        getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
          url,
          {
            eventListeners: {
              processCompleted: onQueryComplete,
              processFailed: processFailed
            }
          }
        )
        getFeatureBySQLService.processAsync(getFeatureBySQLParams)
      }

      function processFailed(queryEventArgs) {
        alert('查询失败！')
      }
      //SQL查询成功调用的事件
      function onQueryComplete(queryEventArgs) {
        pinBuilder = new Cesium.PinBuilder()
        var selectedFeatures = queryEventArgs.originResult.features
        viewer.entities.removeAll()

        for (var i = 0; i < selectedFeatures.length; i++) {
          // var value = selectedFeatures[i].fieldValues["0"];
          var feature = selectedFeatures[i]
          var fieldNames = feature.fieldNames
          var fieldValues = feature.fieldValues

          var numDevname = fieldNames.indexOf('NAME')
          var devname = selectedFeatures[i].fieldValues[numDevname]
          var des1 = devname
          var equipment_position = Cesium.Cartesian3.fromDegrees(
            parseFloat(selectedFeatures[i].fieldValues['1']),
            parseFloat(selectedFeatures[i].fieldValues['2']),
            parseFloat(30)
          )
          //添加设备到场景中
          var entity = {
            id: selectedFeatures[i].fieldValues['0'],
            position: equipment_position,
            billboard: {
              image: './images/jidi.png',
              width: 30,
              height: 40,
              // color: statuscolor,
              // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1, 8.0e6, 0.0),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              disableDepthTestDistance: 10,
              horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM
              //get和set远近广告牌的半透明属性根据广告牌的距离相机。
              // translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.0),
            },
            name: devname,
            description: des1
          }
          viewer.entities.add(entity)
        }
      }

      //飞向中国区域的场景
      function flytoScene() {
        //打开场景之前去除添加的行政面数据
        scene.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            104.29412847500009,
            30,
            19000000
          ),
          //设置飞行的时间
          duration: 4,
          complete: function() //飞行完毕后执行的动作
          {
            //关闭计时器
            clearInterval(TIMER)
            //先加载流动的道路，3s后加载设备图标
            // doSqlQuery('SMID>0')
          }
        })
      }

      //获取场景当前的相机参数
      $('#getcarmea').click(function() {
        console.log('direction:' + scene.camera.direction)
        console.log('heading:' + scene.camera.heading)
        console.log('pitch :' + scene.camera.pitch)
        console.log('roll:' + scene.camera.roll)
        console.log('position:' + scene.camera.position)
      })

      function openScene() {
        //打开场景
        var promise1 = scene.open(URL_Config.tongzou)
      }

      //给地图添加点右击事件,点击任意位置   吧中国地图显示到屏幕正中间
      var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
      handler.setInputAction(function(e) {
        clearInterval(TIMER) //清除定时器

        flytoScene(DATA_SOURCE)
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
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
