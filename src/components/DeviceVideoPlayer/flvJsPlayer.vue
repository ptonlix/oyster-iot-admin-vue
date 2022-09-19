<template>
  <div>
    <!-- 无连接 -->
    <div v-show="stream_url == ''" class="no-video">暂未播放视频</div>
    <!-- 有链接 -->
    <div v-show="stream_url != ''">
      <video style="width: 100%;height: 100%;" :id="'playerIndex' + index" muted></video>
    </div>
  </div>
</template>

<script>
import flvJs from "flv.js";
export default {
  props: {
    stream_url: {
      type: String,
      default: ''
    },
    index: {
      type: [Number,String],
      default: 0
    }
  },
  data() {
    return {
      // 播放器
      player: null
    }
  },
  mounted() {
    this.establishPlayer()
  },
  beforeDestroy() {
    this.emptyPlayer()
  },
  watch: {

  },
  methods: {    
    // 创建播放器
    establishPlayer() {
      this.emptyPlayer()
      console.log('初始化开始 :>> ')

      this.player = flvJs.createPlayer({
        type: "flv",
        url: "http://192.168.1.48:8080/live/99526016551320000123@99526016551320000123.flv"
      })
      this.player.attachMediaElement(document.getElementById("playerIndex" + this.index))
      this.player.load()
      this.player.play()

      console.log('初始化结束 :>> ', this.player)
    },
    // 清空播放器
    emptyPlayer() {
      if (this.player) {
        this.player.destroy()
        this.player = null
      }
    }
  },
};
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
</style>