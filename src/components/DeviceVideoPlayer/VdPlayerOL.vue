// video.js 播放器
<template>
  <div v-visibility-change="change" class="video-box">
    <div v-show="stream_url == ''" class="no-video">暂未播放视频</div>
    <!-- 播放的视频 -->
    <div
      v-show="stream_url != ''"
      :id="'playerIndex' + index"
      class="player-container"
    >
      <video
        oncontextmenu="return false;"
        style="width: 100%; height: 100%; object-fit: fill; border-radius: 0"
        ref="liveVideo"
        :id="'liveVideo' + index"
        class="video-js vjs-default-skin vjs-big-play-centered"
        :options="options"
        preload="auto"
        width="100%"
        height="100%"
        @click="propagationPrevent"
      ></video>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-flash'
import 'videojs-contrib-hls'

export default {
  name: 'VdPlayer',
  props: {
    stream_url: {
      type: String,
      default: ''
    },
    index: {
      type: [Number, String],
      default: 0
    },
    options: {
      type: Object,
      default: {}
    },
    device_id: {
      type: [Number, String],
      default: ''
    },
    channel_id: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      player: '',
      cvsData: null,
      img_url: '',
      checked: true
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  beforeDestroy() {
    //离开当前路由销毁播放器组件
    if (this.player) {
      this.dispose() //销毁播放器
    }
  },
  watch: {
    stream_url(new_val, old) {
      this.play(new_val)
    }
  },
  methods: {
    // man======================================
    checkBox() {
      this.$emit('change-check', this.checked)
    },
    // man======================================
    propagationPrevent() {
      // 防止点击暂停
      // this.play(this.stream_url)
    },
    // 浏览器在页面之间的切换
    change(event, hidden) {
      this.$emit('change', event, hidden)
    },
    // 初始化
    init() {
      //页面初始化加载完毕自动播放视频
      this.player = videojs(
        this.$refs.liveVideo,
        this.options,
        function onPlayerReady() {}
      )
      console.log('this.player',this.player)
      let index = this.index
      let that = this
      // ----------------------------------------------------------------------------------
      this.player.on('error', (return_info) => {
        that.$emit('loadstart', index, return_info)
        console.log('加载错误 :>> ')
      })
      // --------------------------------------------------------------------------------------
      this.player.on('loadstart', (return_info) => {
        // (1) 开始请求数据
        that.$emit('loadstart', index, return_info)
      })
      this.player.on('progress', (return_info) => {
        // (2) 正在请求数据
        that.$emit('progress', index, return_info)
      })
      this.player.on('loadedmetadata', (return_info) => {
        // (3) 获取资源长度完成
        that.$emit('loadedmetadata', index, return_info)
      })
      this.player.on('canplaythrough', (return_info) => {
        // (4) 视频源数据加载完成
        that.$emit('canplaythrough', index, return_info)
      })
      this.player.on('waiting', (return_info) => {
        // (5) 等待数据
        that.$emit('waiting', index, return_info)
      })
      this.player.on('play', (return_info) => {
        // (6) 视频开始播放
        that.$emit('play', index, return_info)
      })
      this.player.on('playing', (return_info) => {
        // (7) 视频播放中, 开始回放???
        that.$emit('playing', index, return_info)
        // console.log('视屏开始播放 :>> ')
      })
      this.player.on('pause', (return_info) => {
        // (8) 视频暂停播放
        that.$emit('pause', index, return_info)
      })
      this.player.on('ended', (return_info) => {
        // (9) 视频播放结束
        that.$emit('ended', index, return_info)
      })
      this.player.on('error', (return_info) => {
        // (10) 加载错误
        that.$emit('error', index, return_info)
      })
      this.player.on('seeking', (return_info) => {
        // (11) 视频跳转中
        that.$emit('seeking', index, return_info)
      })
      this.player.on('seeked', (return_info) => {
        // (12) 视频跳转完毕
        that.$emit('seeked', index, return_info)
      })
      this.player.on('ratechange', (return_info) => {
        // (13) 播放速率改变
        that.$emit('ratechange', index, return_info)
      })
      this.player.on('timeupdate', (return_info) => {
        // (14) 播放时间改变
        that.$emit('timeupdate', index, return_info)
      })
      this.player.on('volumechange', (return_info) => {
        // (15) 音量改变
        that.$emit('volumechange', index, return_info)
      })
      this.player.on('stalled', (return_info) => {
        // (16) 网速异常
        that.$emit('stalled', index, return_info)
      })
      this.player.on('suspend', (return_info) => {
        // (17) 延迟下载
        that.$emit('suspend', index, return_info)
      })
      this.player.on('abort', (return_info) => {
        // (18) 客户端终止下载
        that.$emit('abort', index, return_info)
      })
      this.player.on('loadeddata', (return_info) => {
        // (19) 渲染播放画面
        that.$emit('loadeddata', index, return_info)
      })
      this.player.on('canplay', (return_info) => {
        // (20) 可以播放但中途可能因为加载而暂停
        that.$emit('canplay', index, return_info)
      })
      this.player.on('durationchange', (return_info) => {
        // (21) 资源长度改变
        that.$emit('durationchange', index, return_info)
      })
    },
    play(new_url) {
      this.player.src([
        {
          type: 'application/x-mpegURL',
          src: new_url
        }
      ])
      this.player.play()
    },
    pause() {
      this.player.pause() // 暂停
    },
    dispose() {
      console.log('销毁了吗 :>> ')
      this.player.dispose() // 销毁
      this.player = null //重新加载video播放器标签，防止第二次进入页面时加载失败
    }
  }
}
</script>

<style scoped>
.video-box {
  padding: 0 !important;
  height: 100%;
  width: 100%;
  position: relative;
}
.player-container {
  height: 100%;
  width: 100%;
}
.no-video {
  background: #000;
  color: #fff;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.player-container {
  /* background-color: aqua; */
}
.capture {
  color: #ffffff;
  margin-left: 5px;
}
.drawingBoard {
  z-index: 2;
  /* height: 100%;
    width: 100%; */
}
</style>
