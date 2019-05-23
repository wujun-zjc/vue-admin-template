<template>
  <div class="app-container">
    <div class="filter-container">
      <el-radio v-model="listType" label="onlyAlarm">只看报警</el-radio>
      <el-radio v-model="listType" label="all">全部</el-radio>
      <el-select
        placeholder="猪舍"
        clearable
        v-model="pigHouse"
        style="width: 200px"
        class="filter-item"
        @change="changePigHouse"
      >
        <el-option
          v-for="pigHouse in pigHouses"
          :key="pigHouse.value"
          :label="pigHouse.label"
          :value="pigHouse.value"
        />
      </el-select>

      <el-select
        clearable
        placeholder="猪编号"
        v-model="pig_id"
        style="width: 200px"
        class="filter-item"
        @change="status($event)"
      >
        <el-option
          v-for="item in pigs"
          :key="item.equipmentId"
          :label="item.equipmentName"
          :value="item.equipmentId"
        />
      </el-select>
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">选择</el-button> -->
    </div>

    <el-dialog title="猪个体监控" :visible.sync="dialogFormVisible">
      <el-radio v-model="listType" label="onlyAlarm">只看报警</el-radio>
      <el-radio v-model="listType" label="all">全部</el-radio>

      <el-select
        placeholder="猪舍"
        clearable
        v-model="pigHouse"
        style="width: 200px"
        class="filter-item"
        @change="changePigHouse"
      >
        <el-option
          v-for="pigHouse in pigHouses"
          :key="pigHouse.id"
          :label="pigHouse.text"
          :value="pigHouse.id"
        />
      </el-select>

      <el-select
        clearable
        filterable
        placeholder="猪编号"
        v-model="pig_id"
        style="width: 200px"
        class="filter-item"
      >
        <el-option
          v-for="item in pigs"
          :key="item.equipmentId"
          :label="item.equipmentName"
          :value="item.equipmentId"
        />
      </el-select>
    </el-dialog>

    <div id="scene-container" v-loading="canvasLoading">
      <!-- <div class="info" v-show="infoVisiable">info</div> -->
      <!-- <canvas id="canvas"></canvas> -->
      <div class="monitor-nature">
        <div class="monitor-nature-base">
          <!-- <Basic :baseList="baseList"/> -->
          <img src="/static/images/basic.png" alt>
        </div>
        <div class="monitor-nature-growth">
          <img src="/static/images/growth.png">
        </div>
        <div class="monitor-nature-alarm">
          <!-- <Alarm/> -->
          <img src="/static/images/alarm.png" alt>
        </div>
      </div>
      <div
        :id="card.id"
        class="info-card"
        v-for="(card, index) in info"
        :key="index"
        v-show="labelVisible"
      >
        <div
          class="card-item"
          v-show="card.value"
          :class="[card.status === 'warn'? 'card-item-warn' : '' , card.status === 'danger' ? 'card-item-danger' : '']"
        >
          <div class="card-title">{{card.title}}</div>
          <div class="card-value">{{card.value}}</div>
        </div>
        <!-- <i class="el-icon-loading" v-show="!card.value"></i> -->
      </div>
      <div class="monitor-line">
        <div class="monitor-line-content">

          <!-- <div class="monitor-line-grow"> -->
          <!-- <Curve/> -->
          <!-- <img src="/static/images/curve.png" alt=""> -->
          <!-- </div>
          <div class="monitor-line-temperature">-->
          <!-- <Temperature/> -->
          <!-- <img src="/static/images/temperature.png" alt="">
          </div>
          <div class="monitor-line-rate">-->
          <!-- <Rate/> -->
          <!-- <img src="/static/images/wet.png" alt="">
          </div>-->
          <img src="/static/images/trend.png" alt>
          <span class="needle" @click="tubeOne"></span>
          <span class="needles" @click="tubeTwo"></span>
        </div>
      </div>
    </div>
    <el-dialog title="用药记录" :visible.sync="dialogTableVisible" width="40%">
      <el-table border :data="drugData">
        <el-table-column property="date" label="用药时间"  align="center"></el-table-column>
        <el-table-column property="name" label="药品名称/剂量" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.timeout = 30000
import * as THREE from 'three'
// 控制器和加载器需另外引入
let OrbitControls = require('three-orbit-controls')(THREE)
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
// 参数设置组件
import dat from 'dat.gui'
// 渲染器
import { CSS2DRenderer, CSS2DObject } from 'three-css2drender'
import Basic from './components/Basic/index'
import Growth from './components/Growth/index'
import Curve from './components/curve/index'
import Alarm from './components/Alarm/index'
import Temperature from './components/temperature/index'
import Rate from './components/rate/index'
import baseData from '@/json/individualMonitoring/basic'
export default {
  name: 'individualMonitoring',
  components: { Basic, Growth, Curve, Alarm, Temperature, Rate },
  data() {
    return {
      // 100260004E
      dialogTableVisible: false,
      listType: 'all',
      pig_id: '',
      pigs: [],
      pigHouse: '1',
      drugData: [
        {
          date: '2019-04-18',
          name: '磷酸替米考星/1.5g'
        }
      ],
      pigHouses: [
        { label: '1号测定舍', value: '1' },
        { label: '2号测定舍', value: '2' },
        { label: '3号测定舍', value: '3' }
      ],
      baseList: [], //基本属性数据
      infoVisiable: false,
      labelVisible: false,
      canvasLoading: false,
      dialogFormVisible: false,
      timer: null,
      during: 100000,
      // frequency: 1000,
      frequency: 30000,
      baseUrl: 'http://equipment.htaiot.com:543',
      // baseUrl: 'http://223.80.100.88:543',
      // 所有的信息栏属性:id-对应元素id , title-字段名 , value-值 , modelPosition-在模型上的位置 , labelPosition-信息栏的位置
      info: [
        // {
        //   id: 'blood',
        //   title: '血氧饱和度',
        //   value: '',
        //   modelPosition: {
        //     x: -0.7914780403099244,
        //     y: 0.7927470196239419,
        //     z: -3.0037291985151824
        //   },
        //   labelPosition: {
        //     x: -2,
        //     y: 3,
        //     z: -5
        //   }
        // },
        {
          id: 'heartRate',
          title: '心率',
          value: '',
          modelPosition: {
            x: 0.924454576430195,
            y: -0.25751510303983327,
            z: 1.1404348229702865
          },
          labelPosition: {
            x: 3,
            y: 3,
            z: 3
          }
        },
        {
          id: 'pigTemp',
          title: '体温',
          value: '',
          modelPosition: {
            x: -0.6910149831704895,
            y: 1.1157037965149659,
            z: 0.4930937019775907
          },
          labelPosition: {
            x: -3,
            y: 3.5,
            z: 1.5
          }
        },
        {
          id: 'weight',
          title: '体重',
          value: '',
          modelPosition: {
            x: -0.8335454315532191,
            y: 0.16624401954311097,
            z: -1.3000869324756552
          },
          labelPosition: {
            x: -3,
            y: 3,
            z: -2.5
          }
        },
        {
          id: 'oestrus',
          title: '发情',
          value: '',
          modelPosition: {
            x: 0.8984078949780105,
            y: 0.8687924106938478,
            z: -3.0637236311433504
          },
          labelPosition: {
            x: 3,
            y: 3.5,
            z: -3.8
          }
        },
        {
          id: 'walkNum',
          title: '步数',
          value: '',
          modelPosition: {
            x: 0.3953992440196048,
            y: -1.9366287284075474,
            z: 1.561339482738596
          },
          labelPosition: {
            x: 2,
            y: 0,
            z: 1
          }
        },
        {
          id: 'cough',
          title: '咳嗽',
          value: '',
          modelPosition: {
            x: -0.7042769892775826,
            y: -0.40558245827485706,
            z: 1.85857942900596
          },
          labelPosition: {
            x: -2,
            y: 2,
            z: 5
          }
        },
        {
          id: 'pregnant',
          title: '怀孕',
          value: '',
          modelPosition: {
            x: 0.18641668786641574,
            y: -0.6934605242247462,
            z: -0.9997402437508337
          },
          labelPosition: {
            x: 3,
            y: 2,
            z: -1.5
          }
        }
      ]
    }
  },
  created() {
    this.canvasLoading = true
    axios
      .post('http://223.80.100.88:606/pig/information/list', {})
      // axios.post('http://10.3.22.134:8088/pig/information/list', {})
      .then(res => {
        this.pigs = res.data.obj
        this.pig_id = this.pigs[0].equipmentId
        // this.getData()
      })
      .catch(res => {
        console.log(res)
        this.$message({
          type: 'error',
          message: '猪信息列表获取失败! 原因: ' + res.message,
          duration: 0
        })
      })
    //基本属性数据加载
    this.baseList = baseData.baseIfo[0]
  },
  mounted() {
    // setTimeout(()=>{
    //   if (this.canvasLoading) {
    //     this.$message({
    //       type: 'error',
    //       message: '请求超时,请刷新重试!',
    //       duration: 0
    //     })
    //   }
    // },10000)

    let that = this
    let scene, camera, renderer, labelRenderer, controls, axes, raycaster, mouse
    let pig, material
    // 场景
    initScene()
    function initScene() {
      scene = new THREE.Scene()
      // 模型有高度,旋转缩放等操作会围绕模型底下的原点,模型不能居中.直接改模型的位置,label和line的位置需要换算,所以在此直接设置scene的位置,一劳永逸
      scene.position.y = -2
    }

    // 相机
    initCamera()
    function initCamera() {
      camera = new THREE.PerspectiveCamera(
        45,
        document.getElementById('scene-container').offsetWidth /
          document.getElementById('scene-container').offsetHeight,
        1,
        1000
      )
      // 摄像机初始位置及角度
      camera.position.x = 10.531330350373244
      camera.position.y = 8.8711704383424
      camera.position.z = -0.07634316766530282
      camera.lookAt(scene.position)
    }

    // 渲染器
    initRenderer()
    function initRenderer() {
      // 3D渲染器
      renderer = new THREE.WebGLRenderer()
      // 渲染器主色调
      // renderer.setClearColor(0x150c1d)
      renderer.setClearColor(0x181468)
      // 渲染阴影
      renderer.shadowMapEnabled = true
      renderer.shadowMap.enabled = true
      // 渲染器大小,根据容器设置
      renderer.setSize(
        document.getElementById('scene-container').offsetWidth,
        document.getElementById('scene-container').offsetHeight
      )
      // 实例化渲染器时未指定canvas元素,则自动生成,需要放进容器
      document
        .getElementById('scene-container')
        .appendChild(renderer.domElement)

      // label渲染器 信息框
      labelRenderer = new THREE.CSS2DRenderer()
      labelRenderer.setSize(
        document.getElementById('scene-container').offsetWidth,
        document.getElementById('scene-container').offsetHeight
      )
      // 两个渲染器重叠,需要定位
      labelRenderer.domElement.style.position = 'absolute'
      labelRenderer.domElement.style.top = 0
      document
        .getElementById('scene-container')
        .appendChild(labelRenderer.domElement)
    }

    // 控制器
    initControls()
    function initControls() {
      // let controls = new OrbitControls(camera) // 绑定全局google会报错
      controls = new OrbitControls(camera, labelRenderer.domElement)
    }

    // 坐标轴
    // initAxes()
    function initAxes() {
      // 参数为轴长
      axes = new THREE.AxesHelper(5)
      scene.add(axes)
    }

    // 地面
    // initPlane()
    function initPlane() {
      let planeGeometry = new THREE.PlaneGeometry(10, 10)
      // let planeMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
      let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }) // 转换对光源有渲染的材质
      let plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotation.x = -0.5 * Math.PI
      plane.position.x = 0
      plane.position.y = -1
      plane.receiveShadow = true
      scene.add(plane)
    }

    // 灯光
    initLight()
    function initLight() {
      // 自然光
      // let light = new THREE.AmbientLight(0xeeeeee) // soft white light
      let light = new THREE.AmbientLight(0xeeeeee) // soft white light
      scene.add(light)

      // 点光源   与材质同色 不会反光
      let spotLight = new THREE.PointLight(0x6495ed)
      spotLight.position.set(0, 20, 0)
      spotLight.castShadow = false
      spotLight.shadow.camera.near = 1
      spotLight.shadow.camera.far = 3
      spotLight.shadow.camera.visible = true
      spotLight.shadow.mapSize.width = 1024
      spotLight.shadow.mapSize.height = 1024
      scene.add(spotLight)

      // 点光源显示器
      // let lightHelper = new THREE.SpotLightHelper(spotLight)
      // scene.add(lightHelper)
    }

    // 渲染
    render()
    function render() {
      // 浏览器下一次重绘(自动)之前更新动画帧所调用的函数
      requestAnimationFrame(render)
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
      // console.log(camera.position)
    }

    // 加载器
    initLoader()
    function initLoader() {
      // 模型/材质/贴图 加载器
      let objLoader = new THREE.OBJLoader()
      let mtlLoader = new THREE.MTLLoader()
      var textureLoader = new THREE.TextureLoader()

      loadModel()

      // 加载模型
      function loadModel(params) {
        // textureLoader.load(
        //   'static/model/tietu.jpg',
        //   // 'static/model/pig.mtl',
        //   function(texture) {
        //     // materials.preload()
        //     // 加载材质，也可自定义
        //     // objLoader.setMaterials(material)
        //     material = new THREE.MeshBasicMaterial({
        //       map: texture
        //     })
        objLoader.load(
          '/static/model/zhu.obj',
          // '/static/model/pig.obj',
          function(object) {
            // 显示出模型的骨骼的代码,不需要可删去
            // let helper = new THREE.SkeletonHelper(object)
            // helper.material.linewidth = 3
            // scene.add(helper)

            pig = object
            // pig.children[0].geometry.center();
            // pig.computeVertexNormals();

            // 加上材质贴图
            // pig.children[0].material = material
            // let meshMaterial = new THREE.MeshPhongMaterial({
            //   ambient: 0xff5533,
            //   color: 0x63b8ff,
            //   specular: 0x111111,
            //   shininess: 0
            // })
            // var material = new THREE.LineBasicMaterial({
            //   color: 0xffffff,
            //   linewidth: 1,
            //   linecap: 'round', //ignored by WebGLRenderer
            //   linejoin: 'round' //ignored by WebGLRenderer
            // })
            // let meshMaterial = new THREE.MeshLambertMaterial({color: 0x63b8ff})
            // pig.children[0].material = material

            // 线框
            var wireframe = new THREE.WireframeGeometry(
              pig.children[0].geometry
            )

            var line = new THREE.LineSegments(wireframe)
            // line.material.color.set(0x63b8ff)
            line.material.color.set(0x689ef8)
            line.material.depthTest = false
            line.material.opacity = 0.3
            line.material.transparent = true

            pig.add(line)

            // 透明 颜色
            // pig.children[0].visible = false
            pig.children[0].material.transparent = true
            pig.children[0].material.opacity = 0.1
            // pig.children[0].material.color.set(0x63b8ff)
            pig.children[0].material.color.set(0x689ef8)
            // pig.drawMode = THREE.TriangleFanDrawMode;
            scene.add(pig)

            // let bboxHelper = new THREE.BoxHelper();
            // bboxHelper.visible = true;

            // mainModel.material.transparent = true
            // mainModel.material.opacity = 0.3
            // mainModel.material.color.set(0x63b8ff)
            // scene.add(mainModel)
            // bboxHelper.update(mainModel);
            // bboxHelper.geometry.computeBoundingBox();
            // scene.add(bboxHelper);

            // 添加信息卡片 和 线
            that.info.forEach(item => {
              let label = new THREE.CSS2DObject(
                document.getElementById(item.id)
              )
              label.position.set(
                item.labelPosition.x,
                item.labelPosition.y,
                item.labelPosition.z
              )
              pig.add(label)
              that.labelVisible = true

              let geometry = new THREE.Geometry()
              geometry.vertices.push(
                new THREE.Vector3(
                  item.modelPosition.x,
                  item.modelPosition.y + 2,
                  item.modelPosition.z
                ),
                // 折线
                new THREE.Vector3(
                  item.modelPosition.x +
                    (item.labelPosition.x - item.modelPosition.x) / 2,
                  item.labelPosition.y,
                  // item.labelPosition.y - 0.2,
                  item.modelPosition.z +
                    (item.labelPosition.z - item.modelPosition.z) / 2
                ),
                new THREE.Vector3(
                  item.labelPosition.x,
                  item.labelPosition.y,
                  // 往下偏移一点
                  // item.labelPosition.y - 0.2,
                  item.labelPosition.z
                )
              )
              let material = new THREE.LineBasicMaterial({
                color: 0xcae1ff
              })
              scene.add(new THREE.Line(geometry, material))
            })

            // 光线投射
            raycaster = new THREE.Raycaster()
            // 二维向量
            mouse = new THREE.Vector2()

            labelRenderer.domElement.addEventListener(
              'mousemove',
              onMouseMove,
              // 事件是否在捕获或冒泡阶段执行
              true
            )
          },
          function(res) {
            console.log((res.loaded / res.total) * 100 + '% loaded')
          },
          function(error) {
            console.log('An error happened')
          }
        )
        //   }
        // )
      }
    }

    function onMouseMove(event) {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      mouse.x =
        ((event.clientX - renderer.domElement.getBoundingClientRect().left) /
          renderer.domElement.scrollWidth) *
          2 -
        1
      mouse.y =
        -(
          (event.clientY - renderer.domElement.getBoundingClientRect().top) /
          renderer.domElement.scrollHeight
        ) *
          2 +
        1

      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, camera)

      // pig.children.forEach(item => {
      //   if (item.name) {
      //     item.material.opacity = 1
      //     item.material.color.set(0xffffff)
      //     // item.visible = false
      //     // pig.remove(item)
      //   }
      // })
      // that.infoVisiable = false

      // 计算物体和射线的焦点
      let intersects = raycaster.intersectObjects(pig.children)

      // for (var i = 0; i < intersects.length; i++) {
      //   intersects[i].object.material.color.set(0xff0000)
      //   // intersects[i].object.visible = true
      //   that.infoVisiable = true
      // }
      if (intersects.length) {
        // intersects[0].object.material.opacity = 1
        // intersects[0].object.material.color.set(0xff0000)
        // intersects[0].object.material.color.set(0x6495ED)
        // that.infoVisiable = true
        // console.log(
        //   intersects[0].point
        // )
      }
    }

    function onWindowResize() {
      if (!document.getElementById('scene-container')) return

      camera.aspect =
        document.getElementById('scene-container').offsetWidth /
        document.getElementById('scene-container').offsetHeight
      camera.updateProjectionMatrix()
      renderer.setSize(
        document.getElementById('scene-container').offsetWidth,
        document.getElementById('scene-container').offsetHeight
      )
      labelRenderer.setSize(
        document.getElementById('scene-container').offsetWidth,
        document.getElementById('scene-container').offsetHeight
      )
    }
    // window.addEventListener('resize', onWindowResize)
    window.onresize = onWindowResize

    let MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver
    this.observer = new MutationObserver(function(mutations) {
      mutations.map(function(mutation) {
        console.log('mutation: ', mutation)
      })
    })

    this.observer.observe(document.getElementById('scene-container'), {
      attributes: true,
      attributeOldValue: true,
      // characterData: false,
      // childList: false,
      // subtree: false,
      // characterDataOldValue: false,
      // attributeFilter: ['width', 'height']
      attributeFilter: ['style']
    })
  },
  watch: {
    pig_id(val) {
      clearTimeout(this.timer)
      this.timer = null
      if (val) this.getData()
    },
    listType(val) {
      if (val === 'all' && this.pigHouse === '1') {
        this.pig_id = this.pigs[0].equipmentId
        return
      }
      this.pig_id = undefined
    },
    pigHouse(val) {
      if (val === '1' && this.listType === 'all') {
        this.pig_id = this.pigs[0].equipmentId
        return
      }
      this.pig_id = undefined
    },
    //猪舍切换
    status(event) {
      this.baseList = baseData.baseIfo[event - 1]
    }
  },
  methods: {
    tubeOne() {
      this.dialogTableVisible = true
    },
    tubeTwo() {
      this.dialogTableVisible = true
    },
    getData() {
      let that = this

      // 假数据
      const defaultData = {
        success: true,
        obj: [
          {
            id: 'blood',
            value: '97%'
          },
          {
            id: 'heart',
            value: '59BPM'
          },
          {
            id: 'temperature',
            value: '41.5℃'
          },
          {
            id: 'weight',
            value: '59KG'
          },
          {
            id: 'oestrus',
            value: '无'
          },
          {
            id: 'step',
            value: '39005'
          },
          {
            id: 'cough',
            value: '无'
          },
          {
            id: 'pregnant',
            value: '无'
          }
        ]
      }

      // axios
      //   .post('http://10.3.22.134:8088/equipment/equipData/pigHistroyDetail', {})
      //   .then(res => {
      //     const obj = res.data.obj[res.data.obj.length - 1]
      //     this.info.map(item => {
      //       defaultData.obj.forEach(result => {
      //         if (item.id === result.id) {
      //           item.value = result.value
      //         }
      //       })

      //       if (obj[item.id]) {
      //         item.value = obj[item.id]
      //       }
      //     })

      //     that.timer = setTimeout(() => {
      //       console.log('update')
      //       that.getData()
      //     }, that.frequency)
      //   })
      //   .catch(res => {
      //     console.log(res)
      //   })

      // 直接调物联网平台
      const startTime = new Date().getTime() - 60000 * that.during
      const endTime = new Date().getTime()
      axios({
        method: 'post',
        url: that.baseUrl + '/login?username=smith&&password=smith123',
        data: {
          username: 'smith',
          password: 'smith123'
        }
      })
        .then(res => {
          axios({
            method: 'get',
            // url: baseUrl + '/api/equipment/list/' + '100260004E' + '/' + startTime + '/' + endTime,
            url:
              that.baseUrl +
              '/api/equipment/list/' +
              that.pig_id +
              '/' +
              startTime +
              '/' +
              endTime,
            headers: {
              Authorization: res.data.data
            }
          })
            .then(result => {
              if (that._isDestroyed) return
              if (result.data.data.length) {
                const obj = result.data.data[result.data.data.length - 1]
                this.info.map(item => {
                  // 不是返回的数据 赋予默认值
                  defaultData.obj.forEach(result => {
                    if (item.id === result.id) {
                      item.value = result.value
                    }
                  })
                  // 赋予返回值 加上单位
                  let value = obj[item.id]
                  if (value) {
                    switch (item.id) {
                      case 'heartRate':
                        // value = 140
                        if (130 < value && value < 150) {
                          item.status = 'warn'
                        } else if (150 < value || 70 > value) {
                          item.status = 'danger'
                        }
                        item.value = value + 'BPM'
                        break
                      case 'pigTemp':
                        if (40 < value && value < 43) {
                          item.status = 'warn'
                        } else if (43 < value || 36 > value) {
                          item.status = 'danger'
                        }
                        item.value = value + '℃'
                        break

                      default:
                        item.value = value
                        break
                    }
                  }
                })
              }
              that.canvasLoading = false
              // 重新请求 刷新数据
              that.timer = setTimeout(() => {
                console.log('update')
                that.getData()
              }, that.frequency)
            })
            .catch(result => {
              console.log(result)
              this.$message({
                type: 'error',
                message: '猪实时信息失败! 原因: ' + result.message,
                duration: 0
              })
            })
        })
        .catch(res => {
          console.log(res)
          this.$message({
            type: 'error',
            message: 'token获取失败! 原因: ' + res.message,
            duration: 0
          })
        })
    },
    handleFilter() {
      this.dialogFormVisible = true
    },
    changePigHouse() {}
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.timer = null
    if (this.observer) {
      this.observer.disconnect()
      this.observer.takeRecords()
      this.observer = null
    }
  }
}
</script>

<style lang="scss" scoped>
#scene-container {
  width: 100%;
  height: calc(100vh - 184px);
  overflow: hidden;
  position: relative;
  .info {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    background: rgba(255, 255, 255, 0.5);
  }
  .info-card {
    .card-item {
      height: 30px;
      line-height: 30px;
      color: #fff;
      background: url(/static/images/card-background.png) no-repeat;
      background-size: 160px 30px;
      .card-title {
        width: 80px;
        text-align: center;
        float: left;
      }
      .card-value {
        width: 80px;
        float: right;
        // color: lime;
        text-align: center;
      }
    }
    .card-item-warn {
      background: url(/static/images/card-background-warn.png) no-repeat;
      background-size: 160px 30px;
    }
    .card-item-danger {
      background: url(/static/images/card-background-danger.png) no-repeat;
      background-size: 160px 30px;
    }
  }
}
</style>
<style lang="scss">
.label {
  padding: 10px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.5);
}
.info-card {
  font-size: 12px;
  color: #cae1ff;
  font-weight: bold;
}
.monitor-nature {
  width: 22%;
  // height: 100%;
  position: absolute;
  left: 0;
  img{
    width: 100%;
    height: auto;
  }
}
.monitor-line {
  width: 25%;
  position: absolute;
  right: 0;
  margin: 0;
  .monitor-line-content{
    position: relative;
    img {
      // width: 350px;
      // height: 450px;
      width: 100%;
      height: auto;
    }
    .needle {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 54%;
      bottom: 8%;
      z-index: 100;
      cursor: pointer;
    }
    .needles {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 46%;
      bottom: 8%;
      z-index: 100;
      cursor: pointer;
    }
  }
}

</style>
