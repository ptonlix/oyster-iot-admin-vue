<template>
  <!-- 0.  webrtc播放器 -->
  <div v-if="stream_type == 'WEBRTC' " class="container" :class="{ select: is_active }" @click="selectVideo">
    <qn-rtplayer
      ref="rtplay"
      :stream_url="videoSrc"
      :index="player_index"
      :options="rt_options"
      @error="reconnet"
      @change="change"
    />
  </div>

  <!-- 1. videojs新版本播放器  -->
  <div v-else-if="stream_type == 'HLS' " class="container" :class="{ select: is_active }" @click="selectVideo">
    <VdPlayerHP
      :device_id="device_id"
      :channel_id="channel_id"
      :stream_url="videoSrc"
      :index="player_index"
      ref="vdplay"
      :options="vd_options"
      @timeChange="timeChange"
      @passID="chuanId"
      @error="reconnet"
      @change="change"
      @change-check="getChecked"
    />
  </div>
  <!-- 2. 西瓜播放器hls  -->
  <div v-else-if="stream_type == 'xHLS' " class="container" :class="{ select: is_active }" @click="selectVideo">
    <xghls-player
      ref="vdplay"
      :stream_url="videoSrc"
      :index="player_index"
      :options="xghls_options"
      @error="reconnet"
      @change="change"
    />
  </div>
  <!-- 3. 西瓜播放器flv  -->
  <div v-else-if="stream_type == 'xFLV' " class="container" :class="{ select: is_active }" @click="selectVideo">
    <xgflv-player
      ref="vdplay"
      :stream_url="videoSrc"
      :index="player_index"
      :options="xgflv_options"
      @error="reconnet"
      @change="change"
    />
  </div>
  <!-- flv.js播放器 -->
  <div v-else-if="stream_type == 'flvJs' " class="container" :class="{ select: is_active }" @click="selectVideo">
    <flvJsPlayer
      ref="vdplay"
      :stream_url="videoSrc"
      :index="player_index"
    />
  </div>
</template>

<script>
// import { getVideourl } from '@/api/video.js'

import QnRtplayer from './QnRtplayer' // qn-rt(webrtc) 播放器
import VdPlayerHP from './VdPlayerHP' // 基于video.JS封装的播放器
import XghlsPlayer from './XgPlayerHls' // 西瓜 hls播放器
import XgflvPlayer from './XgPlayerFlv' // 西瓜 flv播放器

import flvJsPlayer from './flvJsPlayer.vue'

import 'videojs-flash'
import 'videojs-contrib-hls'
import video_zhCN from 'video.js/dist/lang/zh-CN.json'

export default {
  name: 'PlayerBox',
  components: {
    QnRtplayer, // 自己封装的 qn-rtplay播放器
    VdPlayerHP, // 自己基于video.JS 封装的播放器
    XghlsPlayer,
    XgflvPlayer,
    flvJsPlayer
  },
  props: {
    player_index: { // 播放器的位置号
      type: [Number],
      require: true
    },
    is_active: { // 当前宫格是否处于 被选中的状态
      type: [Boolean],
      default: false
    },
    stream_type: {
      type: String,
      default: 'HLS'
    }
  },
  data() {
    return {
      videoPlayTimer: null,
      videoSrc: '', // 视频链接地址
      device_id: '', // 设备id
      channel_id: '', // 通道id
      siteId: '',

      // webrtc格式的配置项------------------------------------------------
      rt_options: {
        className: 'qn-rtplayer-media', // 配置到媒体元素上的class值
        width: '100%',
        height: '100%',
        objectFit: 'fill', // 合法的CSS字符串值
        volumn: 0.6, // 音量 范围0---1
        controls: false, // 是否开启video媒体元素控制
        playsinline: true //
      },

      // videojs播放hls格式的配置项------------------------------------------
      vd_options: {
        crossOrigin: 'anonymous', // anonymous，，，use-credentials
        controls: true, // 是否显示底部控制栏
        preload: 'auto', // 加载<video>标签后是否加载视频
        autoplay: true,
        playbackRates: [0.5, 1, 1.5, 2], // 倍速播放
        flash: { // 支持rtpm播放
          hls: { withCredentials: false },
          swf: '../static/video-js.swf'// rtmp falsh播放时需要  ？？？
        },
        languages: { 'zh-cn': video_zhCN }, // 播放器中文语言
        muted: true, // 默认情况下将会消除任何音频
        loop: false, // 导致视频一结束就重新开始。
        // language: "zh-CN",
        // aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        // width: document.documentElement.clientWidth,   // 播放器 宽度
        // width: "394",
        // height: "238",
        fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        hls: true,
        poster: 'poster.jpg', // 你的封面图片地址

        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        sources: [{
          // hls协议type为application/x-mpegURL     //rtmp协议的type为rtmp/flv
          type: 'application/x-mpegURL',
          src: 'test.m3u8' // test.m3u8  // "http://cctvalih5ca.v.myalicdn.com/live/cctv1_2/index.m3u8"
        }],
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, // 全屏按钮
          // 自定义按钮的位置
          children: [
            {
              name: 'playToggle'
            },
            {
              name: 'progressControl'
            },
            {
              name: 'currentTimeDisplay'
            },
            {
              name: 'timeDivider'// 时间进度条
            },
            {
              name: 'durationDisplay'
            },
            {
              name: 'volumePanel', // 音量调整方式横线条变为竖线条
              inline: false
            },
            {
              name: 'pictureInPictureToggle' // 画中画播放模式
            },
            {
              name: 'fullscreenToggle'
            }
          ]
        }
      },

      // 西瓜播放flv的配置项---------------------------------------------------
      xgflv_options: {
        el: '',
        url: '',
        width: '100%',
        height: '100%',
        volume: 0.6, // 初始音量
        autoplay: true, // 自动播放
        playsinline: true, //
        isLive: true, //
        cors: true //

      },
      // 西瓜播放hls的配置项---------------------------------------------------
      xghls_options: {
        el: '',
        url: '',
        width: '100%',
        height: '100%',
        volume: 0.6, // 初始音量
        autoplay: true, // 自动播放
        playsinline: true, //
        isLive: true, //
        cors: true //
      },
      network: true // 电脑是否断网
    }
  },
  watch: {
    distinguish() {
      console.log('变化了 :>> ')
    }
  },
  watch: {
    // videoSrc: {
    //   immediate: true,   // 当这个值是true会立即执行handler
    //   handler(val) {
    //     this.vd_options.sources[0].src = val
    //     this.changeVideo(val)
    //   }
    // },
    videoSrc(val) { // 监听视频地址的变化
    // console.log(val);
    // this.$refs.wsplay.wmplayer();

      if (val && this.stream_type == 'HLS') {
        this.vd_options.sources[0].src = val
        // https://qvs-live-hls.newlyai.com:443/3nm4x17yx3bop/31011500991320006763.m3u8
      }
    },
    network(new_val, old) {
      if (new_val) { // 网络连接后的重连
        this.onlineReconnet()
      }
    }
  },
  beforeDestroy() {
    window.clearInterval(this.videoPlayTimer)
  },
  mounted() {
    // 检测断网
    window.addEventListener('offline', () => {
      this.$message({
        message: '电脑网络已断开',
        type: 'error',
        duration: 15000
      })
      window.localStorage.setItem('network_pc', false)
      this.network = false
    })

    window.addEventListener('online', () => {
      console.log('网络已连接')
      this.$message({
        message: '电脑网络已重连',
        type: 'success',
        duration: 5000
      })
      window.localStorage.setItem('network_pc', true)
      this.network = true
    })
  },
  methods: {
    // 传递变化时间
    timeChange(time) {
      this.$emit('timeChange', time)
    },
    // man-------------------------------------------------
    getChecked(checked) {
      // console.log('选择框索引',this.player_index)
      // console.log('选择框状态', this.device_id)
      // console.log('选择框状态', this.channel_id)
      // console.log('选择框状态',checked)
      this.$emit('change-check', this.player_index, this.device_id, this.channel_id, this.siteId, checked)
    },
    // man=================================================
    chuanId(id, device_id, channel_id, imgTime) {
      // console.log('创建时间 :>> ', imgTime);
      this.$emit('passID2', id, device_id, channel_id, imgTime)
    },
    selectVideo() { // 点击其中一个播放  组件向外出发一个函数,并把位置传出去
      this.$emit('handleitem', this.player_index, this.is_active)
      // console.log('传送什么 :>> ', this.player_index, this.is_active);
    },

    // 断网重连
    onlineReconnet() {
      const that = this
      const player_index = this.player_index
      setTimeout(() => {
        that.reconnet(player_index) // 重连
      }, (player_index + 1) * 1 * 1000)
    },

    // 页面前后台切换
    change(event, hidden) { // hidden为false，表示从别的页面切换回当前页面.  hidden为true时 表示切换到别的页面
      // console.log("切换到当前");
      // let that = this
      // if (hidden === false) {
      //   let player_index = this.player_index;
      //   // var leaveTime = sessionStorage.getItem("leaveTime");
      //   // var nowTime = new Date().getTime();
      //   setTimeout(() => {
      //     that.reconnet(player_index);   // 重连
      //   }, (player_index + 1) * 6 * 1000);
      // }
      // else {
      //   // console.log("离开当前页了！");
      // }
    },

    // 请求视频的连接
    reconnet(position, error_info) {
      // console.log(position, error_info)
      var ipcArrs = JSON.parse(sessionStorage.getItem('ipcArrs'))
      if (ipcArrs !== null && ipcArrs['pos_' + position] !== null && typeof ipcArrs['pos_' + position] !== 'undefined' && ipcArrs['pos_' + position].checked) {
        var data = ipcArrs['pos_' + position].data
        var gatewayIndex = ipcArrs['pos_' + position].gatewayIndex
        // end触发重连，将本地存储的视频设备信息取出
        this.videoSrc = ''
        // console.log(ipcArrs["pos_" + position])
        const that = this
        console.log('发起重连')
        setTimeout(() => {
          networkReconnet()
        }, 300)
        function networkReconnet() { // 重连的网络请求

        }
      }
    },
    heartBeat() { // 每个一段时间执行一次 心跳接口
      window.clearInterval(this.videoPlayTimer)
      this.videoPlayTimer = window.setInterval(() => {
        console.log(new Date())
        getHeartBeat()
      }, 180000)
    }

  }
}
</script>

<style lang="scss" scoped>
// 基础颜色
$color-primary: #2E89FF; // 系统主色
$color-success: #0EC00F; // 成功
$color-warning: #FF941D; // 警告
$color-danger: #FF6565;  // 错误
$color-info: #BBBBBB;    // 信息
// 背景颜色
$header-background: #2E89FF; // 头部背景色
$app-background: #E9E9F0; // 全局背景色
$page-background: #E9E9F0; // 页面背景色
$page-background-light: #F7F7F9; // 布局背景色
// 字体颜色
$font-primary: #333;    // 字体正文颜色(黑色)
$font-result: #666;     // 字体提示颜色(灰色)
$font-info: #999;       // 字体提示颜色(灰色)
$font-pop: #646464;     // pop弹框字体颜色

$hover-backgoround: #DEE7F9; // 列表hover背景颜色
$border-color: #E1E1E1; // 线的颜色
$border-color-search: #BBBBBB; // 搜索框border颜色
$tr-light-background: #E7EDF8;
$tr-background: #F7F7F9;
$th-background: #DEE7F9;

// scrollbar
$scrollbar-width:           6px;
$scrollbar-height:          6px;
$scrollbar-track-color:     transparent;
$scrollbar-thumb-color:     #bbb;
//===========================================
// .video-box .vjs-slider-vertical .vjs-volume-level:before {
//   left: -0.5em
// }
  .video-box {
    padding: 2px;
    height: 100%;
    width: 100%;
  }

  .container {
    // min-height: 100%;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    cursor: pointer;
    background-color: #000;
    &.select {
      border: 2px solid $color-danger;
    }
    .no-video {
      background: #000;
      color: #fff;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
