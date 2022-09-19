// web-rtc播放器
<template>
  <div v-visibility-change="change" class="video-box">
    <div v-show="stream_url == '' " class="no-video">暂未播放视频</div>
    <div v-show="stream_url != ''" :id="'playerIndex'+index" class="player-container"></div>
  </div>
</template>

<script>
import {QNRTPlayer} from "qn-rtplayer-web"

export default {
  name: 'XgPlayerHls',
  props: {
    stream_url: {
      type: String,
      default: ''
    },
    index: {
      type: [Number,String],
      default: 0
    },
    options: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      player: '',
    }
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (this.player) {
      this.release()
    }
  },
  watch: {
    stream_url(new_val, old) {
      
      if(new_val==''){
        if(this.player!=null){ this.stop() }
      }
      else {
        let container = document.getElementById(`playerIndex${this.index}`)
        let temparr = new_val.split(':1240')
        if(new_val) this.play("webrtc://qvs-live-hls.newlyai.com"+":447"+temparr[1], container)
        // if(new_val) this.play("rtmp://49.4.12.100:1931/live/MTY3OTU5MDVfMTYyNjgzNjk5M18xNTFfMTYyNjgzNjk5Mw==", container)
        // if(new_val) this.play('webrtc://qvs-live-hls.newlyai.com:447/3nm4x17yx3bop/31011500991180002925_31011500991320000002', container)
      }

    }
  },
  methods: {
    // 浏览器在页面之间的切换
    change(event, hidden) {
      this.$emit('change',event, hidden)
    },
    // 初始化
    init() {
      let container = document.getElementById(`playerIndex${this.index}`)
      this.player = new QNRTPlayer();
      this.player.init(this.options)   // 初始化播放器
      // this.player.play('webrtc://14.29.108.154:1240/2xenzwf38ciaf/31011500991320002519',container)
      // this.player.play(this.stream_url, container)

      let index = this.index;
      let that = this;
      this.player.on('log', (log_info) => {   // 监听日志事件
        that.$emit('log',index, log_info);
      });
      this.player.on('stats', (stats_report) => {   // 可以获得当前媒体流的状态数据
        that.$emit('stats',index, stats_report);
      });
      this.player.on('error', (sdk_error) => {   // 获取错误信息
        that.$emit('error',index, sdk_error);
      });
    },
    setConfig(config) {
      // let merge_options= Object.assign(this.options, config)
      // this.player.setConfig(merge_options)
      this.player.setConfig(config)   // 修改配置
    },
    getConfig() {
      this.player.getConfig()   // 获取当前播放器配置信息
    },
    play(url, dom) {
      this.player.play(url,dom)
    },
    pause() {
      this.player.pause()   // 暂停
    },
    resume() {
      this.player.resume()   // 恢复播放
    },
    hasAudio() {
      this.player.hasAudio()   // 是否存在音频流
    },
    hasVideo() {
      this.player.hasVideo()   // 是否存在视频流
    },
    setAudioVolume(num) {
      this.player.setAudioVolume(num)   // 设置音量
    },
    getAudioVolume() {
      this.player.getAudioVolume()   // 获取当前音量
    },
    muteAudio() {
      this.player.muteAudio()   // 静音音频
    },
    unmuteAudio() {
      this.player.unmuteAudio()   // 取消静音
    },
    muteVideo() {
      this.player.muteVideo()   // 不播视频
    },
    unmuteVideo() {
      this.player.unmuteVideo()   // 取消视频mute状态
    },
    isPlaying() {
      this.player.isPlaying()   // 当前是否处于播放状态
    },
    stop() {
      this.player.stop()   // 停止播放
    },
    release() {
      this.player.release()   // 释放状态,  SDK 会清空所有状态，如果想要再次播放，需要重新调用 init 方法
      this.player = null
    },
    getPlayerSupport() {
      this.player.getPlayerSupport()   // 获取支持信息
    },
    version() {
      this.player.version()   // 获取版本号
    },
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
</style>