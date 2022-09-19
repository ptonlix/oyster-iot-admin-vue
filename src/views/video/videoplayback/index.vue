<template>
  <div class="app-container gw-home" style="box-shadow: none">
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
                :model="1"
                @node-click="clickTree"
                @recordCalendar="recordCalendar"
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 1右侧 -->
    <div class="card-box">
      <div class="home-part right-home-part">
        <div class="panel-container home-right" style="position: relative">
          <!-- 日历组件 -->
          <div class="calendar">
            <Calendar
              ref="calendar"
              :record-calendar-list="recordCalendarList"
              @dletbeforeIndex="dletbeforeIndex"
              @dletvideoSrc="dletvideoSrc"
              @getYearMonth="getYearMonth"
            />
            <!-- 下方的视屏列表 -->
            <div v-show="videoList.length != '0'" class="videoList">
              <div class="videoListHead">
                回放视频列表({{ videoList.length }}段)
              </div>
              <div v-for="(item, index) in videoList" :key="index">
                <div
                  :id="index + 1"
                  :style="{
                    background: beforeIndex === index ? 'rgb(208,208,208)' : ''
                  }"
                  class="quantityList"
                  @click="choiceList(item, index)"
                >
                  <div>开始时间：<br>{{ timeFormate(item.start) }}</div>
                  <div>结束时间：<br>{{ timeFormate(item.end) }}</div>
                  <div>播放时长：{{ timeLength(item.start, item.end) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-title2">
            <span>历史回放</span>
          </div>
          <!-- 播放器区域 -->
          <div id="gwh" class="panel-content">
            <div
              v-if="tabActive12_3"
              ref="videoArea"
              style="width: 75%; height: 75%"
              class="video-content"
              :class="'video-item-' + grid_len"
            >
              <!-- 播放器 -->
              <div v-for="i in grid_len" :key="i" class="video-item">
                <PlayerBoxHP
                  :ref="'videoPlayer' + (i - 1)"
                  style="border: 0px !important"
                  :stream_type="videoStream"
                  :player_index="i - 1"
                  :is_active="grid_select == i - 1 && has_active"
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
                <PlayerBoxPH
                  :ref="'videoPlayer' + (i - 1)"
                  :stream_type="videoStream"
                  :player_index="i - 1"
                  :is_active="grid_select == i - 1 && has_active"
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
                <PlayerBoxHP
                  :ref="'videoPlayer' + (i - 1)"
                  :stream_type="videoStream"
                  :player_index="i - 1"
                  :is_active="grid_select == i - 1 && has_active"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DeviceTree from '@/components/DeviceTree/DeviceTree'
import PlayerBoxHP from '@/components/DeviceVideoPlayer/PlayerBoxHP'
import Calendar from '@/components/datePicker/index.vue'

export default {
  name: 'VideoPlayback',
  components: {
    DeviceTree,
    PlayerBoxHP,
    Calendar
  },
  data() {
    return {
      has_active: false,
      grid_select: -1,
      grid_len: 1,

      // 保存当前活跃宫格中 播放器的播放参数-----------------------
      // deviceIndex: -1, // 播放的设备是第几个
      deviceId: '',
      gatewayId: '',
      channelNum: '',
      // ----------------------------------------
      playerWidth: '',
      playerHeight: '',
      videoStream: 'HLS',
      videoStreamId: '',
      routeList: [],
      coverPlatform: false,
      filterText: '',
      tabActive12_2: false,
      tabActive12_3: true,
      tabActive12_2_old: false,
      ipcArrs: {},

      gongGeArr: [
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        },
        {
          pointName: '',
          pointId: '',
          deviceId: '',
          channelId: ''
        }
      ],
      // ---------------------------------------------------------------------------------
      hours: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
      // 时间轴数据
      resultList: [],
      showBar: false,
      // 存放打开的摄像头通道id和设备id
      HISparams: '',
      // HISdeviceId: '',
      cehsifskaf: '',
      // 视屏列表
      videoList: [],
      // 分段视频列表
      piecewiseVideoList: [],
      // 前一个高亮吗
      beforeIndex: '',
      // 存放的时间
      clickTime: '',
      // 录制日历参数
      calendarParam: {
        year: '2022',
        month: '7'
      },
      recordCalendarList: [] // 获取设备存在录制的数组
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    // 点击视屏列表
    choiceList(item, index) {
      this.dlettimeChange()
      console.log('item', item, index)
      if (this.beforeIndex === index) {
        this.beforeIndex = ''
        this.resultList = []
        this.$refs['videoPlayer' + 0][0].videoSrc = ''
        return
      } else {
        this.beforeIndex = index
      }
      this.resultList = []
      this.resultList.push(item)
      this.piecewiseVideoList.forEach((piecewiseItem) => {
        if (item.start === piecewiseItem.start) {
          this.$refs['videoPlayer' + 0][0].videoSrc = piecewiseItem.url
        }
      })
    },
    // 切换上面时间时清空高亮和播放
    dletbeforeIndex() {
      if (this.beforeIndex !== '') {
        const beforevidlist = document.getElementById(this.beforeIndex)
        beforevidlist.style = ''
        this.beforeIndex = ''
        this.$refs['videoPlayer' + 0][0].videoSrc = ''
        // 顺便加上清空点击时间
        this.dlettimeChange()
      }
    },
    // 切换上面时间时清空高亮和播放
    dletvideoSrc() {
      this.$refs['videoPlayer' + 0][0].videoSrc = ''
      // 顺便加上清空点击时间
      this.dlettimeChange()
    },
    // 清空点击时间
    dlettimeChange() {
      this.clickTime = ''
    },
    // 鼠标在播放器的横向进度条 上移动触发
    historyMove(e) {
      let offset = ''
      if (e.target.className === '') {
        offset = e.target.parentElement.offsetLeft + e.offsetX
      } else if (e.target.className === 'item') {
        offset = e.target.offsetLeft + e.offsetX
      }
      const historyList = document.getElementsByClassName('history-list')[0]
      const sec = parseInt((offset / historyList.clientWidth) * 86400)
      const getTime = (val) => {
        if (val <= 0) {
          return '00:00:00'
        } else {
          let hour = parseInt(val / 3600)
          if (hour <= 9) hour = '0' + hour
          let min = parseInt(val / 60) % 60
          if (min <= 9) min = '0' + min
          let sec = val % 60
          if (sec <= 9) sec = '0' + sec
          return hour + ':' + min + ':' + sec
        }
      }
      const time = getTime(sec)
      if (!this.showBar) this.showBar = true
      const timeBar = document.getElementsByClassName('time-bar')[0]
      timeBar.getElementsByTagName('span')[0].innerText = time
      timeBar.style.left = offset + 'px'
    },
    // 点击视屏进度
    playVideoTime(i, index, event) {
      const timeStamp = document.getElementById('timeStamp').innerHTML
      console.log('timeStamp', timeStamp)
      this.piecewiseVideoList.forEach((item) => {
        if (i.start === item.start) {
          this.$refs['videoPlayer' + 0][0].videoSrc = item.url
        }
      })
    },
    // 播放树: 某一项被点击, 开始播放视频
    clickTree(data, checked, position, node) {
      var playbackParams = {}
      if (node.parent.data.type === 1) {
        playbackParams.ns_id = node.parent.data.ns_id
        playbackParams.stream_id = data.gb_id
      } else if (node.parent.data.type === 2) {
        playbackParams.ns_id = node.parent.data.ns_id
        playbackParams.stream_id = node.parent.data.gb_id + '_' + data.gb_id
      }
      if (checked) {
        this.HISparams = playbackParams
      } else {
        this.HISparams = ''
        // 清空右侧高亮和播放状态
        this.$refs['videoPlayer' + 0][0].videoSrc = ''

        if (this.beforeIndex) {
          const beforevidlist = document.getElementById(this.beforeIndex)
          beforevidlist.style = ''
          this.beforeIndex = ''
        }
        this.clickTime = ''
        this.videoList = []
        this.$refs['calendar'].highlight()
      }
    },
    // 处理时间一位数
    oneToTwo(val) {
      if (val > 9) return val
      return '0' + val
    },
    // 时间格式化为年月日
    timeFormate(unixTimeStamp) {
      const date = new Date(unixTimeStamp * 1000)
      const [year, month, day] = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      ]
      const [hour, min, sec] = [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ]
      return (
        year +
        '-' +
        this.oneToTwo(month) +
        '-' +
        this.oneToTwo(day) +
        ' ' +
        this.oneToTwo(hour) +
        ':' +
        this.oneToTwo(min) +
        ':' +
        this.oneToTwo(sec)
      )
    },
    // 时间长度返回时分秒
    timeLength(unixStartStamp, unixEndStamp) {
      if (unixEndStamp < unixStartStamp) {
        const flag = unixEndStamp
        unixEndStamp = unixStartStamp
        unixStartStamp = flag
      }
      const length = unixEndStamp - unixStartStamp
      let hour = parseInt(length / 3600)
      if (hour < 9) hour = '0' + hour
      let min = parseInt(length / 60) % 60
      if (min < 9) min = '0' + min
      let sec = length % 60
      if (sec < 9) sec = '0' + sec
      return hour + ':' + min + ':' + sec
    },
    // 获取当前日历的年月
    getYearMonth(val) {
      console.log('val', val)
      Object.assign(this.calendarParam, val)
      if (this.$refs.qnDeviceTree.listDevice.length !== 0) {
        this.$refs.qnDeviceTree.getRecordCalendar()
      }
    },
    // 获取设备存在录像的时间
    recordCalendar(val) {
      this.formatRecordCalendar(val)
    },
    // 将录像的时间转换成数组形式
    formatRecordCalendar(val) {
      const year = this.calendarParam.year
      const month = this.calendarParam.month
      const Array = []
      for (const key in val) {
        const obj = {
          date: '',
          show: false
        }
        obj.date = `${year}/${month}/${key}`
        obj.show = val[key]
        Array.push(obj)
      }
      this.recordCalendarList = Array
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';

.el-dialog {
  .el-dialog__header {
    background-color: #f5f7f5 !important;
  }

  .el-carousel__container {
    position: relative;
    height: 100%;
  }
}
</style>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

// 游标进度
.cursorProgress {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  pointer-events: none;

  // 游标的内层
  .cursorInnerLayer {
    background-color: pink;
    position: absolute;
    height: 50%;
  }
}

.calendar {
  width: 25%;
  height: 100%;
  position: absolute;
  z-index: 2;
  top: 70px;
  right: 0px;
  overflow: scroll;
}

// 模拟进度条
.time-scroll {
  width: 100%;
  height: 55px;
  margin-bottom: 10px;
  position: relative;

  .time-s-box {
    width: 100%;
    height: 55px;
    position: relative;
    background: #fff;
  }

  .hours {
    width: 100%;
    position: absolute;
    bottom: 0px;
    display: flex;

    .item {
      flex: 1;
      height: 8px;
      border-right: 1px solid #b6b6b6;
      position: relative;
      border-radius: 1px;

      span {
        position: absolute;
        top: 10px;
        left: -30px;
        font-size: 12px;
        font-family: SimSun;
        font-weight: 400;
        color: #9298a7;
        width: 60px;
        text-align: center;
      }

      &:first-child {
        span {
          left: 0px;
          text-align: left;
        }
      }

      &:last-child {
        flex: 0;
        width: 0;
        border: 0;

        span {
          left: -3.6rem;
          text-align: right;
        }
      }
    }
  }

  .history-list {
    width: 100%;
    height: 22px;
    position: absolute;
    background: #efeff1;
    bottom: 14px;
    left: 0;

    .item {
      position: absolute;
      height: 55px;
      bottom: -16px;

      div {
        position: absolute;
        width: 100%;
        height: 22px;
        bottom: 16px;
        background: #108cfd;
      }
    }
  }

  .time-bar {
    position: absolute;
    bottom: -16px;
    height: 36px;
    border-left: 3px solid #ff7275;
    span {
      position: absolute;
      left: -34px;
      top: -20px;
      font-size: 14px;
      font-family: SimSun;
      font-weight: bold;
      color: #ff7275;
    }
  }
}

// 视屏列表
.videoList {
  width: 100%;
  padding-bottom: 50px;

  .videoListHead {
    width: 100%;
    background-color: #f6f6f6;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0;
  }

  .quantityList {
    border: 1px solid;
    border-color: #5a9bd8;
    border-radius: 3px;
    margin: 10px;
    padding: 10px;
    font-size: 18px;
    word-break: break-all;
    /* 禁止选中 */
    -moz-user-select: none;
    /*火狐*/
    -webkit-user-select: none;
    /*webkit浏览器*/
    -ms-user-select: none;
    /*IE10*/
    -khtml-user-select: none;
    /*早期浏览器*/
    user-select: none;
    font-size:14px;
  }

  .quantityList:hover {
    cursor: pointer;
  }
}
// --------------------------------------------------------------------------

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
  background: #f8f8f8;
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
  height: 100%;
  display: flex;
  .el-card:nth-child(1) {
    margin-right: 12px;
    width: 260px;
  }
  .el-card:nth-child(2) {
    width: 100%;
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

        .coverPlatform {
          cursor: pointer;
          line-height: 30px;
          width: 100%;
          text-align: center;

          i {
            color: #b1beff;
          }
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
        padding: 10px 0;
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

  .card-box {
    padding: 16px;
    background: #fff;
    width: 100%;
    box-shadow: 0 0.11429vw 0.68571vw 0 rgb(0 0 0 / 10%);
  }
}
</style>
