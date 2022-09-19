<template>
  <div class="gw-home">
    <el-card>
      <!-- 0左侧 -->
      <div class="home-part left-home-part">
        <div class="home-left">
          <!-- 一. 左侧的设备列表整体区域 -->
          <div class="panel-container source-list">
            <!-- 1 播放树的搜索区域 -->
            <div class="device-tree-title">
              <div class="title">设备列表</div>
            </div>
            <!-- 2 存放播放树的 容器 -->
            <div class="tree-container">
              <device-tree
                ref="qnDeviceTree"
                class="addr-tree"
                :grid_len="grid_len"
                :grid_select="grid_select"
                @node-click="clickTree"
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 右侧-->
    <el-card style="width: 100%">
      <div class="home-part right-home-part">
        <div class="panel-container home-right">
          <div class="panel-title2">
            <span>监控视频</span>
            <div class="operator">
              <el-tooltip effect="dark" content="网页全屏" placement="top">
                <i class="iconfont iconquanping" @click="webFS()" />
              </el-tooltip>
              <el-tooltip effect="dark" content="单个视频" placement="top">
                <i
                  class="iconfont icon-quanping5"
                  :class="{ active: grid_len === 1 }"
                  @click="changeTab(1)"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="四格视频" placement="top">
                <i
                  class="iconfont icon-ic_mode_block"
                  :class="{ active: grid_len === 4 }"
                  @click="changeTab(4)"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="九宫格视频" placement="top">
                <i
                  class="iconfont icon-nine-squares"
                  :class="{ active: grid_len === 9 }"
                  @click="changeTab(9)"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="十二格视频" placement="top">
                <i
                  class="iconfont icon-jiugongge-line-"
                  @click="changeTab(12, 1, 1)"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="十六格视频" placement="top">
                <i
                  class="iconfont icon-wanggeshitu"
                  :class="{ active: grid_len === 16 }"
                  @click="changeTab(16)"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="二十四格视频" placement="top">
                <i
                  class="iconfont icon-louceng"
                  :class="{ active: grid_len === 24 }"
                  @click="changeTab(24)"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="二十五格视频" placement="top">
                <i
                  class="iconfont icon-louceng"
                  :class="{ active: grid_len === 25 }"
                  @click="changeTab(25)"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="监控区全屏" placement="top">
                <i
                  ref="fullBtn"
                  class="iconfont icon-ico_quanping"
                  @click="changeFullScreen"
                />
              </el-tooltip>
            </div>
          </div>
          <!-- 播放器区域 -->
          <div id="gwh" class="panel-content">
            <div
              v-if="tabActive12_3"
              ref="videoArea"
              class="video-content"
              :class="'video-item-' + grid_len"
            >
              <div v-for="i in grid_len" :key="i" class="video-item">
                <!-- 播放器 -->
                <PlayerBoxOL
                  :ref="'videoPlayer' + (i - 1)"
                  :stream_type="videoStream"
                  :player_index="i - 1"
                  :is_active="grid_select == i - 1 && has_active"
                  :grid_list="ipcArrs"
                  @handleitem="handleGrid(arguments)"
                />
              </div>
            </div>
            <div
              v-if="tabActive12_2"
              ref="videoArea"
              class="video-content"
              :class="'video-item-' + grid_len"
            >
              <div v-for="i in grid_len" :key="i" class="video-item12_2">
                <!-- 播放器 -->
                <PlayerBoxOL
                  :ref="'videoPlayer' + (i - 1)"
                  :stream_type="videoStream"
                  :player_index="i - 1"
                  :is_active="grid_select == i - 1 && has_active"
                  :grid_list="ipcArrs"
                  @handleitem="handleGrid(arguments)"
                />
              </div>
            </div>
            <div
              v-if="tabActive12_2_old"
              ref="videoArea"
              class="video-content"
              :class="'video-item-' + grid_len"
            >
              <div v-for="i in grid_len" :key="i" class="video-item12_2">
                <!-- 播放器 -->
                <PlayerBoxOL
                  :ref="'videoPlayer' + (i - 1)"
                  :stream_type="videoStream"
                  :player_index="i - 1"
                  :is_active="grid_select == i - 1 && has_active"
                  @handleitem="handleGrid(arguments)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getVideoPlayURL } from '@/api/oystervideo' // 获取设备列表
import DeviceTree from '@/components/DeviceTree/DeviceTree'
import PlayerBoxOL from '@/components/DeviceVideoPlayer/PlayerBox'
// 退出全屏
var exitWebFS = (that) => {
  return function(e) {
    if (e.key === 'Escape' && !e.repeat) {
      if (document.body.classList.contains('web-fullscreen-fix')) {
        document.body.classList.remove('web-fullscreen-fix')
        if (that.videoStream === 'HLS') return
        that.getHW()
      }
    }
  }
}
export default {
  name: 'VideoMonitor',
  components: {
    DeviceTree,
    PlayerBoxOL
  },
  data() {
    return {
      ultiGraph: '',
      has_active: false,
      grid_select: -1,
      grid_len: 1,
      // 保存当前活跃宫格中 播放器的播放参数-----------------------
      rtmpSrc: '', // 操作云台的地址
      // deviceIndex: -1, // 播放的设备是第几个
      deviceId: '',
      gatewayId: '',
      channelNum: '',
      // ----------------------------------------
      playerWidth: '',
      playerHeight: '',
      videoStream: 'HLS',
      // stream_type: 'xFLV',
      videoStreamId: '',
      routeList: [],
      coverPlatform: false,
      filterText: '',
      tabActive12_2: false,
      tabActive12_3: true,
      tabActive12_2_old: false,
      ipcArrs: [],
      gongGeArr: [
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' },
        { pointName: '', deviceId: '', channelId: '' }
      ]
    }
  },
  watch: {
    playerWidth() {
      this.rotate()
    },
    playerHeight() {
      if (this.tabActive12_2 == true) {
        this.rotate2()
      } else if (this.tabActive12_2_old == true) {
        this.rotate()
      } else {
        this.rotate()
      }
    }
  },
  beforeDestroy() {
    window.onresize = null
    document.removeEventListener('keydown', exitWebFS(this))
  },
  methods: {
    // 网页全屏
    webFS() {
      document.body.classList.add('web-fullscreen-fix')
      if (this.videoStream === 'HLS') return
      this.$nextTick(() => {
        this.getHW()
      })
    },
    // 视频缩放调整
    getHW() {
      if (this.tabActive12_2 == true || this.tabActive12_2_old == true) {
        this.playerWidth = $('.video-item12_2').width()
        this.playerHeight = $('.video-item12_2').height()
      } else {
        this.playerWidth = $('.video-item').width()
        this.playerHeight = $('.video-item').height()
      }
    },
    rotate() {
      const h = $('.video-scale .video-js').innerHeight()
      const seita = this.playerHeight / h
      const deg = parseFloat(((Math.acos(seita) * 180) / Math.PI).toFixed(2))
      const top = (this.playerHeight - h) / 2
      $('.video-js').css('transform', `rotateX(${deg}deg)`)
      $('.video-js').css('top', `${top}px`)
    },
    rotate2() {
      const h = $('.video-scale .video-js').innerHeight()
      const seita = this.playerHeight / h
      const deg = parseFloat(((Math.acos(seita) * 180) / Math.PI).toFixed(2))
      const top = (this.playerHeight - h) / 2
      if (window.innerHeight > 1200) {
        $('.video-js').css('transform', `scaleY(2.4)`)
      } else if (window.innerHeight >= 1100 && window.innerHeight <= 1200) {
        $('.video-js').css('transform', `scaleY(2.25)`)
      } else if (window.innerHeight > 1080 && window.innerHeight < 1100) {
        $('.video-js').css('transform', `scaleY(2.15)`)
      } else if (window.innerHeight >= 1050 && window.innerHeight <= 1080) {
        $('.video-js').css('transform', `scaleY(2.1)`)
      } else if (window.innerHeight >= 1000 && window.innerHeight < 1050) {
        $('.video-js').css('transform', `scaleY(2.05)`)
      } else if (window.innerHeight >= 950 && window.innerHeight < 1000) {
        $('.video-js').css('transform', `scaleY(1.9)`)
      } else if (window.innerHeight >= 850 && window.innerHeight < 900) {
        $('.video-js').css('transform', `scaleY(1.8)`)
      } else if (window.innerHeight >= 750 && window.innerHeight < 800) {
        $('.video-js').css('transform', `scaleY(1.7)`)
      } else if (window.innerHeight >= 725 && window.innerHeight < 750) {
        $('.video-js').css('transform', `scaleY(1.6)`)
      } else if (window.innerHeight >= 700 && window.innerHeight < 725) {
        $('.video-js').css('transform', `scaleY(1.5)`)
      } else if (window.innerHeight >= 650 && window.innerHeight < 700) {
        $('.video-js').css('transform', `scaleY(1.4)`)
      } else if (window.innerHeight > 625 && window.innerHeight < 650) {
        $('.video-js').css('transform', `scaleY(1.3)`)
      } else if (window.innerHeight > 600 && window.innerHeight < 625) {
        $('.video-js').css('transform', `scaleY(1.2)`)
      } else if (window.innerHeight <= 600) {
        $('.video-js').css('transform', `rotateX(${deg}deg)`)
        $('.video-js').css('top', `${top}px`)
      }
    },
    // 切换全屏
    changeFullScreen() {
      const el = this.$refs.videoArea
      const rfs =
          el.requestFullScreen ||
          el.webkitRequestFullScreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullScreen
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el)
        return
      }
      if (typeof window.ActiveXObject !== 'undefined') {
        const wscript = new ActiveXObject('WScript.Shell')
        if (wscript) {
          wscript.SendKeys('{F11}')
        }
      }
    },
    // 播放树: 某一项被点击, 开始播放视频
    clickTree(data, checked, position, node) {
      console.log('data', data, position)

      this.gongGeArr[position].pointName = data.name
      this.gongGeArr[position].deviceId = data.outerGbId
      this.gongGeArr[position].channelId = data.gbId
      if (checked) {
        var ipcArrs = this.ipcArrs
        ipcArrs['pos_' + position] = {
          data,
          checked,
          position,
          node
        }
        this.ipcArrs = ipcArrs
        var params = {}
        if (node.parent.data.type === 1) {
          params.ns_id = node.parent.data.ns_id
          params.stream_id = data.gb_id
        } else if (node.parent.data.type === 2) {
          params.ns_id = node.parent.data.ns_id
          params.stream_id = node.parent.data.gb_id + '_' + data.gb_id
        }
        getVideoPlayURL(params)
          .then((res) => {
            console.log(res)
            if (res.code === 200) {
              // code=0 打开视频成功
              const tmpurl = res.data.hls
              this.getChildVal(position, checked, this, 0, tmpurl, data, node)
            } else {
              // code!=0 打开失败
              this.$message.error('请求失败')
            }
          })
          .catch((err) => {
            this.$message.error('视频打开失败!', err)
          })
      } else {
        // 关闭视频
        this.ipcArrs['pos_' + position].checked = false
        this.getChildVal(position, checked, this, 1)
      }
    },
    // 宫格数量: 被切换
    changeTab(tab, value, way) {
      this.rtmpSrc = ''
      this.deviceId = ''
      this.gatewayId = ''
      this.channelNum = ''
      this.has_active = false

      this.$nextTick(() => {
        this.grid_select = -1
        if (tab === 1) {
          this.grid_select = 0
        } else if (tab === 12 && way == 3) {
          this.tabActive12_2 = false
          this.tabActive12_3 = false
          this.tabActive12_2_old = true
        } else if (tab === 12 && way == 2) {
          this.tabActive12_2 = true
          this.tabActive12_3 = false
          this.tabActive12_2_old = false
        } else {
          this.tabActive12_2 = false
          this.tabActive12_3 = true
          this.tabActive12_2_old = false
        }

        this.grid_len = tab
      })
    },
    // 通过ref,拿到子组件. 操作子组件
    getChildVal(
      position,
      checked,
      that,
      empty,
      tmpurl = '',
      data = {},
      node = {}
    ) {
      // 各参数: (位置, 打开视频?,this, 清空, url, data)
      // console.log('依次点击调用的事件的参数1 :>> ', position)
      // console.log('依次点击调用的事件的参数2 :>> ', checked)
      // console.log('依次点击调用的事件的参数3 :>> ', that)
      // console.log('依次点击调用的事件的参数4 :>> ', empty)
      // console.log('依次点击调用的事件的参数5 :>> ', tmpurl)
      // console.log('依次点击调用的事件的参数6 :>> ', data)
      // console.log('依次点击调用的事件的参数7 :>> ', node)
      if (empty == 1) {
        // 清空子组件 如下属性值
        that.$refs['videoPlayer' + position][0].videoSrc = ''
        that.$refs['videoPlayer' + position][0].device_id = ''
        that.$refs['videoPlayer' + position][0].channel_id = ''
      } else if (empty == 0) {
        that.$refs['videoPlayer' + position][0].videoSrc = tmpurl
        that.$refs['videoPlayer' + position][0].device_id = data.outerGbId
        that.$refs['videoPlayer' + position][0].channel_id = data.gbId
      }
    },
    // 宫格: 某一项被点击
    handleGrid(argu) {
      console.log('点击了 :>> ', argu)
      this.index = argu[0]
      const position = argu[0]
      const is_active = argu[1]

      if (!this.has_active && !is_active) {
        // 没有被选中的宫格, 则让当前被点击的宫格处于活跃
        this.has_active = true
        this.grid_select = position
        console.log('上这个是 :>> ', position)
      } else if (this.has_active && is_active) {
        // 有被选中的宫格, 活跃的再次接受点击,则取消活跃
        this.has_active = false
        this.grid_select = -1
        console.log('中这个是 :>> ', this.grid_select)
      } else if (this.has_active && !is_active) {
        // 有被选中的宫格, 非活跃的被点击,则切换活跃宫格
        this.has_active = true
        this.grid_select = position
        console.log('下这个是 :>> ', position)
      }
      this.getChildVal(position, !is_active, this, -1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.MultiGraphPage {
  position: absolute;
  width: 500px;
  height: 500px;
  background-color: #ffffff;
  top: 28%;
  left: 33%;
}

.device-tree-title {
  font-family: Microsoft YaHei;
  font-weight: 400;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f6f6f6;
  padding: 0 10px;

  .title {
    font-size: 18px;
    color: #333;
  }

  .tree-search {
    width: 60%;

    .el-input__suffix {
      width: 32px;
      height: 32px;
      background: #fff;
      border-radius: 0px 4px 4px 0px;
      border: 1px solid #dcdfe6;
      top: 0px;
      right: 0px;
      box-sizing: border-box;
    }

    .search-icon {
      color: #aaa;
      cursor: pointer;
      font-size: 16px;
      height: 32px;
    }
  }
}

.gw-home {
  padding: 25px;
  height: 100%;
  display: flex;

  .el-card:nth-child(1) {
    margin-right: 12px;
    width: 340px;
  }

  .home-part {
    height: 100%;

    .panel-container {
      background: #fff;
      overflow: hidden;

      .panel-title {
        position: relative;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 60px;
        color: #333;
        padding-left: 30px;
      }

      .panel-title2 {
        background-color: #f6f6f6;
        position: relative;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 60px;
        color: #333;
        padding: 0 30px;
        display: flex;
        justify-content: space-between;
      }

      .panel-title-grey {
        background: #f8f8f8;
      }
    }

    .home-left {
      display: flex;
      flex-direction: column;
      height: 100%;

      .source-list {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;

        .tree-container {
          flex: 1;
          padding-top: 20px;
          overflow: hidden;
        }

      }

      .camera-platform {
        flex: 0 0 310px;
        display: flex;
        flex-direction: column;

        .camera-directive {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          .not-allowed {
            pointer-events: none;
          }

          .directive-container {
            width: 164px;
            height: 160px;
            background: #fff;
            border: 1px solid rgba(200, 200, 200, 1);
            border-radius: 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            // padding: 26px 40px;
            padding: 20px 16px 16px;

            p {
              width: 100%;
              display: flex;
              justify-content: space-between;
            }

            i {
              box-sizing: border-box;
              width: 34px;
              height: 34px;
              font-size: 14px;
              color: $text_light;
              cursor: pointer;
              position: relative;
              border: 2px solid #a0a4ba;
              border-radius: 6px;
              display: flex;
              justify-content: center;
              align-items: center;

              &:before {
              }

              &:hover {
                color: $my-primary;
                border-color: $my-primary;
              }

              &.is-disabled {
                pointer-events: none;
                opacity: 0.5;
                cursor: not-allowed !important;
              }
            }

            .icon1:before {
              transform: rotateZ(-45deg);
            }
            .icon3:before {
              transform: rotateZ(45deg);
            }

            .icon4:before {
              transform: rotateZ(-90deg);
            }

            .icon5 {
              font-size: 20px;
            }

            .icon6:before {
              transform: rotateZ(90deg);
            }

            .icon7:before {
              transform: rotateZ(-135deg);
            }

            .icon8:before {
              transform: rotateZ(180deg);
            }

            .icon9:before {
              transform: rotateZ(135deg);
            }
          }

          .float-layer {
            position: absolute;
            z-index: 10;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: not-allowed !important;
          }
        }
      }
    }

    .home-right {
      height: calc(100vh - 60px);
      display: flex;
      flex-direction: column;

      .operator {
        .workorder-btn {
          color: var(--app_primary);
          font-size: 12px;
          display: inline-flex;
          margin-right: 40px;
          justify-content: space-between;

          .btn-item {
            width: 80px;
            line-height: 30px;
            border: 1px solid var(--app_primary);
            border-radius: 3px;
            text-align: center;
            margin-right: 12px;
            cursor: pointer;
          }
        }

        i {
          font-style: normal;
          font-size: 20px;
          cursor: pointer;
          color: #bbb;

          &:not(:last-child) {
            margin-right: 20px;
          }

          &.active {
            color: $my-primary;
          }

          &:hover {
            color: $my-primary;
          }

          &.disabled {
            cursor: not-allowed;
          }

          &.disabled:hover {
            color: #dddddd;
          }
        }

        .iconfont12 {
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
        }
      }

      .panel-content {
        height: 100%;
        width: 100%;
        flex: 1;
        padding: 10px 0px;
        overflow: hidden;

        .video-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          background-color: #fff;

          .video-item {
            margin-bottom: 1px;
            display: inline-block;
            overflow: hidden;
          }

          &.video-item-25 .video-item {
            width: 19.9%;
            height: 19.8%;
          }

          &.video-item-24 .video-item {
            width: 16.62%;
            height: 24.867%;

            &:nth-child(1) {
              order: 1;
            }

            &:nth-child(2) {
              order: 2;
            }

            &:nth-child(3) {
              order: 7;
            }

            &:nth-child(4) {
              order: 8;
            }

            &:nth-child(5) {
              order: 3;
            }

            &:nth-child(6) {
              order: 4;
            }

            &:nth-child(7) {
              order: 9;
            }

            &:nth-child(8) {
              order: 10;
            }

            &:nth-child(9) {
              order: 5;
            }

            &:nth-child(10) {
              order: 6;
            }

            &:nth-child(11) {
              order: 11;
            }

            &:nth-child(12) {
              order: 12;
            }

            &:nth-child(13) {
              order: 13;
            }

            &:nth-child(14) {
              order: 14;
            }

            &:nth-child(15) {
              order: 19;
            }

            &:nth-child(16) {
              order: 20;
            }

            &:nth-child(17) {
              order: 15;
            }

            &:nth-child(18) {
              order: 16;
            }

            &:nth-child(19) {
              order: 21;
            }

            &:nth-child(20) {
              order: 22;
            }

            &:nth-child(21) {
              order: 17;
            }

            &:nth-child(22) {
              order: 18;
            }

            &:nth-child(23) {
              order: 23;
            }

            &:nth-child(24) {
              order: 24;
            }
          }

          &.video-item-16 .video-item {
            width: 24.9%;
            height: 24.8%;
          }

          &.video-item-12 .video-item {
            width: 24.9%;
            height: 33.1%;
          }

          &.video-item-12 .video-item12_2 {
            width: 16.55%;
            height: 49.8%;
          }

          &.video-item-9 .video-item {
            width: 33.25%;
            height: 33.1%;
          }

          &.video-item-4 .video-item {
            width: 49.97%;
            height: 49.85%;
          }

          &.video-item-1 .video-item {
            width: 100%;
            height: 100%;
          }
        }

        .device-list {
          position: absolute;
          top: 10px;
          right: 0;
          width: 345px;
          height: calc(100% - 20px);
          padding-right: 14px;

          .device-item {
            width: 100%;
            padding: 10px;
            border: 1px solid $border-light;
            margin-top: 20px;
            cursor: pointer;

            &:first-child {
              margin-top: 0;
            }

            &.active {
              border: 2px solid #ff941d;
            }

            .device-title {
              position: relative;
              margin-bottom: 6px;

              i {
                position: absolute;
                display: inline-block;
                top: 6px;
                left: 0;
                width: 8px;
                height: 8px;
                border-radius: 50%;

                &.device-offline {
                  background: $my-danger;
                }

                &.device-online {
                  background: $my-success;
                }
              }

              span {
                display: block;
                font-size: 14px;
                color: $text_dark;
                padding-left: 15px;
              }
            }

            .device-img {
              display: inline-block;
              width: 100%;
            }
          }
        }
      }
    }
  }

  .left-home-part {
    overflow: hidden;
    // margin-right: 12px;
  }

  .right-home-part {
    flex: 1;
  }

  .el-dialog {
    .img-container {
      height: 60vh;
      min-height: 380px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      align-items: center;

      .img-item {
        &.w99 {
          width: 99%;
          height: 99%;
        }

        &.w49 {
          width: 49%;
          height: 49%;
        }

        &.w32 {
          width: 32%;
          height: 32%;
        }

        &.w24 {
          width: 24%;
          height: 24%;
        }

        &.w16 {
          width: 16%;
          height: 16%;
        }

        &.w19 {
          width: 19%;
          height: 19%;
        }
      }
    }

    .wk-container {
      height: 60vh;
      min-height: 400px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .wk-container-item {
        flex: 1;
        height: 100%;
      }

      .wk-img {
        flex: 1;

        .el-image {
          width: 100%;
          height: 100%;
        }

        .edit-img {
          cursor: pointer;
          color: var(--app_primary);
          text-align: right;
          font-size: 12px;
          padding-right: 5px;
        }
      }

      .wk-info {
        flex: 1;
        background-color: rgb(255, 255, 255);
      }
    }
  }
}
</style>
