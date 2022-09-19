// 西瓜flv 播放器
<template>
  <div v-visibility-change="change" class="video-box">
    <div v-show="stream_url == '' " class="no-video">暂未播放视频</div>
    <div v-show="stream_url != ''" :id="'playerIndex'+index" class="player-container"></div>
  </div>
</template>

<script>
import FlvJsPlayer from "xgplayer-flv.js"

export default {
  name: 'XgPlayerFlv',
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
      default: () => { return {}}
    }
  },
  data() {
    return {
      player: null,
      component_options: null
    }
  },
  created() {},
  mounted() {
    this.init();   // 初始化
  },
  beforeDestroy() {
    if (this.player) {
      this.destroy()
    }
  },
  watch: {
    stream_url(new_val, old) {
      
      if(new_val==''){
        if(this.player!=null){ this.pause() }
      }
      else {
        console.log(this.stream_url)
        console.log(this.player)
        this.play(this.stream_url)
        // let container = document.getElementById(`playerIndex${this.index}`)
        // let temparr = new_val.split(':1240')
        // if(new_val) this.play("webrtc://qvs-live-hls.newlyai.com"+":447"+temparr[1], container)
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
      this.component_options = Object.assign({}, this.options);   // 克隆一个对象
      this.component_options.url = this.stream_url
      let container = document.getElementById(`playerIndex${this.index}`)
      // this.component_options.el = container
      this.component_options.id = `playerIndex${this.index}`
      this.player = new FlvJsPlayer(this.component_options)

      let index = this.index;
      let that = this;

      this.player.on('play', () => {
        that.$emit('play')
      })
      this.player.on('playing', () => {
        that.$emit('playing')
      })
      this.player.on('pause', () => {
        that.$emit('pause')
      })
      this.player.on('ended', () => {
        that.$emit('ended')
      })
      this.player.on('error', () => {
        that.$emit('error')
      })
      this.player.on('seeking', () => {
        that.$emit('seeking')
      })
      // ........还有好多事件, 请参考官网
    },
    
    play(url) {
      this.changeUrl(url)
      this.player.play()
    },
    pause() {
      this.player.pause()   // 暂停
    },
    reload() {
      this.player.reload()   // 重新加载视频
    },
    destroy() {
      this.player.destroy()   // 播放器销毁
    },
    canPlayType() {
      this.player.canPlayType()   // 检测您的浏览器是否能播放不同类型的视频
    },
    getBufferedRange() {
      this.player.getBufferedRange()   // 返回当前的缓冲片段时间范围，start表示缓冲起始时间，end表示缓存截止时间 [s,e]
    },
    getFullscreen() {
      this.player.getFullscreen()   // 播放器进入全屏
    },
    exitFullscreen() {
      this.player.exitFullscreen()   // 播放器退出全屏
    },
    getCssFullscreen() {
      this.player.getCssFullscreen()   // 播放器进入样式全屏
    },
    exitCssFullscreen() {
      this.player.exitCssFullscreen()   // 播放器退出样式全屏
    },
    getMiniplayer() {
      this.player.getMiniplayer()   // 播放器进入迷你播放器模式
    },
    exitMiniplayer() {
      this.player.exitMiniplayer()   // 播放器退出迷你播放器模式
    },
    rotate() {
      this.player.rotate()   // 播放器旋转
    },
    start() {
      this.player.start()   // 启动播放器，start一般都是播放器内部隐式调用，主要功能是将video添加到DOM
    },
    replay() {
      this.player.replay()   // 播放器重播，重播的组件就调用了这个方法。
    },
    changeUrl(url) {
      this.player.src = url
    },
    changePoster(poster_url) {
      this.player.poster = poster_url
    },
    // 静态方法 Player.install('play', () => {})
    
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