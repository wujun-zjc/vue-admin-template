<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-location-outline" circle @click="gisVisible=true"></el-button>
      </el-col>
      <el-col :span="9">
        <el-input v-model="lng" clearable placeholder="经度"/>
      </el-col>
      <el-col :span="9">
        <el-input v-model="lat" clearable placeholder="纬度"/>
      </el-col>
    </el-row>
    <el-dialog
      class="gis-dialog"
      title="坐标拾取"
      :visible="gisVisible"
      @open="init"
      @opened="opened"
      @close="close"
      @closed="closed"
      width="80%"
      :modal="false"
    >
      <div id="cesiumContainer">
        <div id="trackPopUp" style="display: none">
          <div id="trackPopUpContent" class="popup" style="z-index:10;">
            <!-- <a class="popup-close-button" href="#">×</a> -->
            <div class="popup-content-wrapper">
              <div id="trackPopUpLink" class="popup-content"></div>
            </div>
            <div class="popup-tip-container">
              <div class="popup-tip"></div>
            </div>
          </div>
        </div>
        <div class="base-info" v-show="baseVisible">
          <div class="base-name">
            <span class="base-title-icon">
              <img src="@/assets/images/base-title-icon.png" alt width="22px" height="25px">
            </span>
            {{base.base_name}}
          </div>
          <div class="base-body">
            <div class="base-img">
              <img :src="base.base_imgSrc" alt style="width: 200px;">
            </div>
            <div class="base-address">{{base.base_address}}</div>
            <div class="base-organization">{{base.organization}}</div>
            <div class="base-charge">{{base.charge}}</div>
            <div class="base-description">{{base.base_description}}</div>
          </div>
          <!-- <div class="base-timestamp">{{base.base_timestamp}}</div> -->
        </div>
        <div class="base-name-left" v-show="nameVisible">{{base_name}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import baseImg from '@/icons/svg/base.svg'
import baseImg from '@/assets/images/base_icon3.png'

import jidiImg from '@/assets/images/jidi.png'
import iconCamera from '@/assets/images/iconCamera.png'
import iconWaterFertilizerIntegration from '@/assets/images/iconWaterFertilizerIntegration.png'
import iconDiseasePest from '@/assets/images/iconDiseasePest.png'
import iconGreenhose from '@/assets/images/iconGreenhose.png'
import iconMeteorological from '@/assets/images/iconMeteorological.png'
import iconWater from '@/assets/images/iconWater.png'

import { PopUp } from '@/assets/js/PopUp.js'
import '@/assets/css/popup.scss'

import { getRoles, getDevices } from '@/api/intelligentMonitoring/gis'
import { mapGetters } from 'vuex'

export default {
  name: 'GisGetPosition',
  props: {
    lng: '',
    lat: ''
  },
  data() {
    return {
      // lng: undefined,
      // lat: undefined,
      gisVisible: false,
      viewer: undefined,
      scene: undefined,
      widget: undefined,
      promise: undefined,
      soil_layer: undefined,
      TIMER: undefined,
      deviceTimer: undefined,
      hoverHandler: undefined,
      hoverId: undefined,
      tableVisible: false,
      baseVisible: false,
      landVisible: false,
      nameVisible: false,
      land: {},
      base_data: [],
      base: {},
      base_name: '',
      plot_data: [],
      device_data: [],
      device: {},
      data: {},
      height: 9000000
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    init() {},
    close() {
      if (document.getElementsByClassName('cesium-viewer').length) {
        document
          .getElementsByClassName('cesium-viewer')[0]
          .parentNode.removeChild(
            document.getElementsByClassName('cesium-viewer')[0]
          )
      }
      this.gisVisible = false
    },
    closed() {},
    opened() {
      this.initViewer()
    },
    initViewer() {
      // 初始化地图场景(地球)
      let that = this
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        sceneMode: 3,
        // 切换3D和2D
        // sceneModePicker: true,
        // 关闭地球的2D，就是只用3D
        // scene3DOnly: true,
        // 全屏
        // fullscreenButton: true,
        // 去除点选设备时候的绿色框
        selectionIndicator: false,
        // 去除默认的弹窗
        infoBox: false,
        // 去除导航罗盘控件
        navigation: false,
        // 去除天空背景
        skyAtmosphere: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        allowDataSourcesToSuspendAnimation: false,
        // 超图demo   地图粗糙  白泥地都在海里了
        // imageryProvider: new Cesium.SuperMapImageryProvider({
        //   url:
        //     'http://www.supermapol.com/realspace/services/map-China400/rest/maps/China400'
        // })
        // 天地图   没有鸡公图轮廓  不好看  有一点偏移
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url:
            'http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=2c5639930edd03d1cc9084df2e7654df',
          layer: 'tdtVecBasicLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
          show: false
          // 地图细节等级
          // minimumLevel: 4,
          // maximumLevel: 1
        })
        // 高德街道底图  好看,但图层有偏移
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //   url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        //   layer: "tdtVecBasicLayer",
        //   style: "default",
        //   format: "image/png",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        //   show: false
        // })
        // ArcGIS街道图层 地图粗糙 丑
        // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        //   url : 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        // }),
        // ArcGIS卫星图层 与天地图同坐标系 无偏移 数据落后 不要卫星图
        // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        //   url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        // }),
        // google卫星图层 无偏移 数据新 但是不要卫星图
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //   url:"http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
        // })
        // cesium黑色炫酷地图 没有什么卵用
        // imageryProvider: new Cesium.createTileMapServiceImageryProvider({
        //   url : 'https://cesiumjs.org/blackmarble',
        //   credit : 'Black Marble imagery courtesy NASA Earth Observatory',
        //   flipXY : true
        // })
      })
      this.scene = this.viewer.scene
      this.widget = this.viewer.cesiumWidget
      // 添加天地图矢量标记为背景
      this.viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url:
            'http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=2c5639930edd03d1cc9084df2e7654df',
          layer: 'tdtAnnoLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible'
        })
      )
      // 设置相机高度限制
      this.scene.screenSpaceCameraController.maximumZoomDistance = 18000000
      this.scene.screenSpaceCameraController.minimumZoomDistance = 100
      // this.scene.screenSpaceCameraController._minimumZoomRate = 30000; // 设置相机缩小时的速率
      // this.scene.screenSpaceCameraController._maximumZoomRate = 5906376272000    //设置相机放大时的速率
      // 去除logo图片
      // this.viewer._cesiumWidget._creditContainer.style.display = 'none'
      let credit = this.viewer.scene.frameState.creditDisplay
      credit.container.removeChild(credit._imageContainer)

      this.promise = this.scene.open(
        // 'http://support.supermap.com.cn:8090/iserver/services/3D‐CBD/rest/realspace'
        // 'http://223.80.100.88:487/iserver/services/3D-shangmaqingdao/rest/realspace'
        'http://223.80.100.88:487/iserver/services/3D-jidifenbutu3/rest/realspace'
        // 'http://223.80.100.88:487/iserver/services/3D-jidifenbu/rest/realspace'
        // 'http://localhost:8090/iserver/services/3D-jidifenbutu11/rest/realspace'
        // 'http://localhost:8090/iserver/services/3D-jidifenbutu/rest/realspace'
        // 'http://localhost:8090/iserver/services/3D-jidifenbutu2/rest/realspace'
        // 'http://localhost:8090/iserver/services/3D-jidifenbu/rest/realspace'
      )
      // this.viewer.flyTo(this.promise)
      Cesium.when(this.promise, function(layer) {
        that.popup = new PopUp(that.viewer)
        // 改变canvas属性,解决图标锯齿化
        document
          .getElementById('cesiumContainer')
          .getElementsByTagName('canvas')[0].style = {
          'image-rendering': 'auto'
        }
        // 获取盐碱地图层 可以控制显示隐藏
        that.soil_layer = that.scene.layers.find('Saline_Alkali_Soil@qingdao')
        // 通过用户权限判断初始化显示界面
        getRoles(that.user.su_id).then(res => {
          if (res.success === false) {
            that.$message({
              type: 'error',
              message: res.msg
            })
            return
          }
          that.base_data = res.obj
          // 经纬度既是标记位置,也是相机位置.
          // 管理员可以查看所有基地,初始化界面展示全国
          if (that.lng && that.lat) {
            
          } else {
            if (that.base_data.length > 1) {
              // 中国区域的经度、纬度、高度
              that.flytoChina()
            } else if (that.base_data.length === 1) {
              // 基地人员初始界面为对应基地
              that.flytoBase(
                that.base_data[0].base_lng,
                that.base_data[0].base_lat,
                that.base_data[0].base_id,
                that.base_data[0].base_name
              )
            }
          }
        })
      })

      // 点击事件的响应
      const clickHandler = new Cesium.ScreenSpaceEventHandler(
        that.viewer.scene.canvas
      )
      clickHandler.setInputAction(function(movement) {
        that.clickMap(movement)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // 滚轮事件
      clickHandler.setInputAction(function(movement) {
        // if (that.base_data.length === 1) {
        //   that.flytoBase(
        //     that.base_data[0].base_lng,
        //     that.base_data[0].base_lat,
        //     that.base_data[0].base_id,
        //     that.base_data[0].base_name
        //   )
        //   // } else if (that.base_data.length > 1) {
        // } else {
        // console.log(that.height, that.scene.camera._positionCartographic.height)
        if (
          that.height < 60000 &&
          that.scene.camera._positionCartographic.height >= 60000
        ) {
          that.height = 9000000
          that.flytoChina()
        } else {
          that.height = that.scene.camera._positionCartographic.height
        }

        // }
      }, Cesium.ScreenSpaceEventType.WHEEL)

      // hover事件的响应
      that.hoverHandler = this.viewer.screenSpaceEventHandler
      that.hoverHandler.setInputAction(function(e) {
        that.hoverEntity(e)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      // 注销调相机场景的跟踪模式，取消鼠标左键双击，则会追踪到该位置
      this.widget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      )
    },
    // 点击
    clickMap(movement) {
      let that = this
      this.baseVisible = false
      this.nameVisible = false
      clearTimeout(that.deviceTimer)
      const pick = this.viewer.scene.pick(movement.position)
      // 随便点击某处后，飞到中国区域去
      if (!pick || !pick.id) {
        // if (this.data.role === 'admin') {
        // if (that.base_data.length === 1) {
        //   that.flytoBase(
        //     that.base_data[0].base_lng,
        //     that.base_data[0].base_lat,
        //     that.base_data[0].base_id,
        //     that.base_data[0].base_name
        //   )
        //   // } else if (that.base_data.length > 1) {
        // } else {
        //   this.flytoChina()
        // }

        //1、屏幕坐标转世界坐标     2D无效
        let viewer = that.viewer
        let world = viewer.scene.globe.pick(
          viewer.camera.getPickRay(movement.position),
          viewer.scene
        )
        // 点地球之外,world会是undefined
        if (world) {
          // console.log('世界坐标',world)
          // //2、世界坐标转屏幕坐标
          // let screen = Cesium.SceneTransforms.wgs84ToWindowCoordinates( viewer.scene, world);
          // console.log('屏幕坐标',screen)
          //3、世界坐标转地理坐标(经纬度)
          let Geography = viewer.scene.globe.ellipsoid.cartesianToCartographic(
            world
          )
          Geography = [
            Cesium.Math.toDegrees(Geography.longitude),
            Cesium.Math.toDegrees(Geography.latitude)
          ]
          console.log('地理坐标', Geography)
          // that.lng = Geography[0]
          // that.lat = Geography[1]
          that.$emit('changePosition', Geography)
          that.gisVisible = false
          // //4、地理坐标(经纬度)转世界坐标
          // world = Cesium.Cartesian3.fromDegrees(Geography[0], Geography[1]);
          // console.log('世界坐标',world);
        }
      } else {
        if (pick.id._id.indexOf('base') > -1) {
          // 如果点中的是基地的话，就飞向上马基地的范围
          // entities.removeAll() 移除之前的标记(基地),会使pick.id变为undefined,所以id需要存起来
          const id = pick.id
          this.viewer.entities.removeAll()
          // 先去掉弹窗,避免飞行过程中弹窗一直都在
          $('#trackPopUp').hide()
          // 需要先通过id获取基地位置
          that.flytoBase(
            that.base.base_lng,
            that.base.base_lat,
            that.base.zoom,
            that.base.base_id,
            that.base.base_name
          )
        } else if (pick.id._id.indexOf('device') > -1) {
          // 点击设备,跳转设备详情页
          // 视频设备
          if (pick.id._id.split('device-')[0] === '1') {
            this.$router.push({
              name: 'Video',
              params: {
                id: pick.id._id.split('-')[1]
              },
              path: '/video/index'
            })
            // 水肥一体机
          } else if (pick.id._id.split('device-')[0] === '2') {
            // 检测设备
            this.$router.push({
              name: 'WaterFertilizerIntegration',
              params: {
                // 设备编号
                id: pick.id._id.split('device-')[1],
                // 设备类型
                type: pick.id._id.split('device-')[0]
              },
              path: '/waterFertilizerIntegration/index'
            })
          } else {
            this.$router.push({
              name: 'EquipmentTest',
              params: {
                // 设备编号
                id: pick.id._id.split('device-')[1],
                // 设备类型
                type: pick.id._id.split('device-')[0]
              },
              path: '/equipmentTest/index'
            })
          }
        }
      }
    },
    // hover
    hoverEntity(e) {
      let that = this
      const pick = this.viewer.scene.pick(e.endPosition)
      if (pick && pick.id && pick.id._id) {
        // hover图标后,不再触发同一图标hover事件
        if (that.hoverId === pick.id._id) return
        // 换了图标才进行的操作
        that.hoverId = pick.id._id
        that.baseVisible = false
        clearTimeout(that.deviceTimer)
        let htmlStr = ''
        // 通过id判断是基地还是设备 展示不同弹窗
        if (pick.id._id.indexOf('base') > -1) {
          // 基地 基地信息不会更新,所以一开始便请求全部,hover时直接显示缓存的
          that.base = that.base_data.find(base => {
            if (pick.id._id.indexOf(base.base_id) > -1) return base
          })
          // 基地右侧弹窗
          this.baseVisible = true
          // 基地上方弹窗
          // htmlStr = `<p>${that.base.base_id}</p><p>${that.base.base_name}</p>`
          htmlStr = `<p class='base-title'>${that.base.base_name}</p>`
          that.popup.closePopUp()
          that.popup.showHtml(htmlStr)
          // 将笛卡尔坐标转化为经纬度坐标
          const position_value = pick.id._position._value
          const cartographic = Cesium.Cartographic.fromCartesian(position_value)
          const longitude = Cesium.Math.toDegrees(cartographic.longitude)
          const latitude = Cesium.Math.toDegrees(cartographic.latitude)
          const height = cartographic.height
          // 给获取的位置点添加偏移量，根据sqlquery方法里面设置的entity的样式
          const bubbleposition = new Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            0
          )
          that.popup.showPopUp(bubbleposition)
        } else if (pick.id._id.indexOf('device') > -1) {
          that.popup.closePopUp()
          // 将笛卡尔坐标转化为经纬度坐标
          const position_value = pick.id._position._value
          const cartographic = Cesium.Cartographic.fromCartesian(position_value)
          const longitude = Cesium.Math.toDegrees(cartographic.longitude)
          const latitude = Cesium.Math.toDegrees(cartographic.latitude)
          const height = cartographic.height
          // 给获取的位置点添加偏移量，根据sqlquery方法里面设置的entity的样式
          const bubbleposition = new Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            0
          )
          // if (pick.id._id.split('device-')[0] === '1') {
          //   that.popup.showHtml(`<p class='special-device-title'>视频设备</p>`)
          // } else if (pick.id._id.split('device-')[0] === '2') {
          //   that.popup.showHtml(
          //     `<p class='special-device-title'>水肥一体机</p>`
          //   )
          // } else {
          //   // 设备实时数据请求需要时间,先打开弹窗展示loading
          //   that.popup.showHtml(
          //     `<i class="el-icon-loading" style="padding: 20px"></i>`
          //   )
          //   // that.getDeviceData(pick)
          // }
          // that.popup.showPopUp(bubbleposition)
          switch (pick.id._id.split('device-')[0]) {
            case '1':
              that.popup.showHtml(
                `<p class='special-device-title'>视频设备</p>`
              )
              break
            case '2':
              that.popup.showHtml(
                `<p class='special-device-title'>水肥一体机</p>`
              )
              break
            case '3':
              that.popup.showHtml(`<p class='special-device-title'>气象</p>`)
              break
            case '4':
              that.popup.showHtml(
                `<p class='special-device-title'>土壤</p>`
              )
              break
            case '4028e425696fdc4701696fddbf280000':
              that.popup.showHtml(`<p class='special-device-title'>病虫害</p>`)
              break
            case '4028e4256979dc02016979dfdefe0000':
              that.popup.showHtml(`<p class='special-device-title'>温室</p>`)
              break
            case '4028e4256979dc02016979e03b670002':
              that.popup.showHtml(`<p class='special-device-title'>水层</p>`)
              break

            default:
              break
          }
          that.popup.showPopUp(bubbleposition)
        }
      } else {
        // 鼠标离开图标后
        that.hoverId = undefined
        that.baseVisible = false
        clearTimeout(that.deviceTimer)
        that.deviceTimer = null
        $('#trackPopUp').hide()
      }
    },
    // 飞向中国区域的场景
    flytoChina() {
      let that = this
      this.nameVisible = false
      clearInterval(that.TIMER)
      this.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          104.29412847500009,
          30,
          9000000
          // 19000000
        ),
        //设置飞行的时间
        duration: 1,
        //飞行完毕后执行的动作
        complete: function() {
          //关闭计时器
          // clearInterval(that.TIMER)
          // iserver 数据服务请求基地信息
          // that.doSqlQuery('SMID>0')
          // 根据后台接口已返回数据生成基地
          that.addBases()
          // 飞向中国,飞完再显示盐碱地图层,避免飞行过程遮住
          that.soil_layer.visible = true
        }
      })
    },
    // 飞向基地
    flytoBase(lng, lat, height, id, name) {
      let that = this
      // 飞的同时请求设备信息
      that.addDevices(id)
      // 右上角显示基地名
      that.base_name = name
      that.nameVisible = true
      // 飞向基地,直接隐藏盐碱地图层,避免飞行过程遮住
      that.soil_layer.visible = false
      this.scene.camera.flyTo({
        // destination: Cesium.Cartesian3.fromDegrees(
        //   120.199366530169,
        //   36.31656297279485,
        //   200000
        // ),
        destination: Cesium.Cartesian3.fromDegrees(
          Number(lng),
          Number(lat),
          Number(height)
        ),
        // 设置飞行的时间
        duration: 1,
        // 飞行结束再添加设备,避免途中弹窗闪烁
        complete: function() {
          // 通过pick.id._id确定基地,来获取并生成生成对应的设备
          // that.addDevices(id)
        }
      })
    },
    addBases() {
      this.viewer.entities.removeAll()
      this.base_data.forEach(base => {
        const entity = {
          // id加上字符串  以便触发鼠标事件时区分基地和设备
          id: 'base-' + base.base_id,
          position: Cesium.Cartesian3.fromDegrees(
            parseFloat(base.base_lng),
            parseFloat(base.base_lat),
            parseFloat(0)
          ),
          billboard: {
            // image: base.base_imgSrc,
            image: baseImg,
            width: 30,
            height: 40,
            // color: statuscolor,
            // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1, 8.0e6, 0.0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            // disableDepthTestDistance: 10,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            // get和set远近广告牌的半透明属性根据广告牌的距离相机。
            // translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.0),
          },
          name: base.base_name,
          description: base.base_description
        }
        this.viewer.entities.add(entity)
      })
    },
    addDevices(id) {
      let that = this
      this.viewer.entities.removeAll()

      getDevices(id).then(res => {
        // console.log(res)
        let plot_data = [
          {
            plot_id: '',
            plot_name: '',
            devices: [
              {
                device_id: 'device_01',
                device_name: '摄像头',
                device_icon: 'iconCamera',
                device_lng: '120.196381223842',
                device_lat: '36.3170743447118',
                device_description: '病虫害',
                device_type_name: '视频设备'
              }
            ]
          },
          {
            plot_id: '',
            plot_name: '',
            devices: [
              {
                device_id: 'device_02',
                device_name: '水层',
                device_icon: 'iconWater',
                device_lng: '120.194874749817',
                device_lat: '36.3162450929545',
                device_description: '水层',
                device_type_name: '水层'
              }
            ]
          },
          {
            plot_id: '',
            plot_name: '',
            devices: [
              {
                device_id: 'device_03',
                device_name: '气象',
                device_icon: 'iconMeteorological',
                device_lng: '120.195994239689',
                device_lat: '36.3159686757021',
                device_description: '气象',
                device_type_name: '气象'
              }
            ]
          },
          {
            plot_id: '',
            plot_name: '',
            devices: [
              {
                device_id: 'device_04',
                device_name: '温室',
                device_icon: 'iconGreenhose',
                device_lng: '120.194805645504',
                device_lat: '36.3148906484176',
                device_description: '温室',
                device_type_name: '温室'
              }
            ]
          },
          {
            plot_id: '',
            plot_name: '',
            devices: [
              {
                device_id: 'device_05',
                device_name: '病虫害',
                device_icon: 'iconDiseasePest',
                device_lng: '120.197555997165',
                device_lat: '36.3149597527307',
                device_description: '病虫害',
                device_type_name: '病虫害'
              }
            ]
          }
        ]
        that.plot = res.obj ? res.obj : []
        // that.plot = plot_data
        let devicesList = []
        that.plot.forEach(plot => {
          if (plot.devices) {
            plot.devices.forEach(device => {
              // 去重
              if (devicesList.indexOf(device.device_id) !== -1) return
              devicesList.push(device.device_id)
              const equipment_position = Cesium.Cartesian3.fromDegrees(
                parseFloat(device.device_lng),
                parseFloat(device.device_lat),
                // 高度可变
                parseFloat(30)
              )
              let device_icon = null
              switch (device.device_type_name) {
                case '视频设备':
                  device_icon = iconCamera
                  break
                case '水肥一体机':
                  device_icon = iconWaterFertilizerIntegration
                  break
                case '病虫害':
                  device_icon = iconDiseasePest
                  break
                case '温室':
                  device_icon = iconGreenhose
                  break
                case '气象':
                  device_icon = iconMeteorological
                  break
                case '水层':
                  device_icon = iconWater
                  break

                default:
                  break
              }
              const entity = {
                // id加上字符串  以便触发鼠标事件时区分基地和设备
                // device_type_id 跳转时的参数
                id: device.device_type_id + 'device-' + device.device_id,
                position: equipment_position,
                billboard: {
                  image: device_icon,
                  // image: 'http://223.80.100.88:454/showFourPage/images/bozhongqi.png',
                  width: 30,
                  height: 40,
                  scaleByDistance: new Cesium.NearFarScalar(
                    1.5e2,
                    1,
                    8.0e6,
                    0.0
                  ),
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
                name: device.device_name,
                description: device.device_description
              }
              that.viewer.entities.add(entity)
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" >
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
  .land-info,
  .base-name-left {
    // max-width: 30%;
    position: absolute;
    border: 1px solid #d4d4d4;
    // border-radius: 5px;
    // background: transparent;
    background: rgba(255, 255, 255, 0.4);
    z-index: 1;
  }
  .base-info {
    position: absolute;
    width: 250px;
    // max-width: 30%;
    top: 30px;
    right: 30px;
    border-radius: 5px;
    z-index: 1;
    .base-name {
      // margin: 5px;
      padding: 0 25px;
      height: 55px;
      line-height: 55px;
      color: #235ca3;
      font-size: 15px;
      font-weight: bold;
      background-color: #fff;
      border-bottom: 1px solid #e2e2e2;
      .base-title-icon {
        display: inline-block;
        img {
          vertical-align: text-bottom;
          margin-right: 5px;
        }
      }
    }
    .base-body {
      font-size: 13px;
      padding: 10px 25px;
      background-color: #fdf9ea;
      .base-img {
        text-align: center;
      }
      .base-address {
        height: 40px;
        line-height: 40px;
        font-weight: bold;
      }
      .base-organization,
      .base-charge {
        height: 30px;
        line-height: 30px;
      }
      .base-description {
        line-height: 30px;
      }
    }
  }
  .land-info {
    top: 10px;
    left: 10px;
  }
  .base-name-left {
    height: 45px;
    line-height: 45px;
    top: 10px;
    left: 10px;
    padding: 0 60px 0 75px;
    font-size: 15px;
    color: #333;
    background: url('/static/images/base-name-icon.png') no-repeat 0 0;
    background-color: rgba(255, 255, 255, 0.5);
    background-size: 45px;
    // font-weight: bold;
  }
}
</style>
