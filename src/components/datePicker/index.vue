<template>
  <section class="wh_container">
    <div class="wh_content_all">
      <!-- 年 -->
      <div class="wh_top_changge">
        <li @click="PreMonth(myDate, false)">
          <div class="wh_jiantou1" />
        </li>
        <li class="wh_content_li">{{ dateTop }}</li>
        <li @click="NextMonth(myDate, false)">
          <div class="wh_jiantou2" />
        </li>
      </div>
      <!-- 周 -->
      <div class="wh_content">
        <div
          v-for="(tag, index) in textTop"
          :key="index"
          class="wh_content_item"
        >
          <div class="wh_top_tag">{{ tag }}</div>
        </div>
      </div>
      <!-- 日 -->
      <div class="wh_content">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="wh_content_item"
          @click="clickDay(item, index)"
        >
          <div
            :id="item.date"
            class="wh_item_date"
            :class="[
              { wh_isMark: item.isMark },
              { wh_other_dayhide: item.otherMonth !== 'nowMonth' },
              { wh_want_dayhide: item.dayHide },
              { wh_isToday: item.isToday },
              { wh_chose_day: item.chooseDay },
              setClass(item)
            ]"
            @click="deliveryYear(item)"
          >
            {{ item.id }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import timeUtil from './index.js'
import { getRecordList } from '@/api/oystervideo.js'
import { Loading } from 'element-ui'
export default {
  props: {
    markDate: {
      type: Array,
      default: () => []
    },
    markDateMore: {
      type: Array,
      default: () => []
    },
    textTop: {
      type: Array,
      default: () => ['一', '二', '三', '四', '五', '六', '日']
    },
    sundayStart: {
      type: Boolean,
      default: () => false
    },
    agoDayHide: {
      type: String,
      default: `0`
    },
    futureDayHide: {
      type: String,
      default: `2554387200`
    },
    recordCalendarList: { // 存在录制计划的数组
      type: Array,
      default: {}
    }
  },
  data() {
    return {
      myDate: [],
      list: [],
      historyChose: [],
      dateTop: '',
      // -------------------------
      frontcircle: '',
      Ifcircle: false
    }
  },
  watch: {
    recordCalendarList: {
      handler(val, oldVal) {
        this.showMark(val)
      },
      deep: true
    },
    markDate: {
      handler(val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    markDateMore: {
      handler(val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    agoDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    futureDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    sundayStart: {
      handler(val, oldVal) {
        this.intStart()
        this.getList(this.myDate)
      },
      deep: true
    }
  },
  created() {
    this.intStart()
    this.myDate = new Date()
  },
  mounted() {
    this.getList(this.myDate)
  },
  methods: {
    deliveryYear(item) {
      console.log(this.list)
      if (this.$parent.HISparams !== '') {
        var d1 = new Date(item.date.replace(/\//g, '-'))
        var ye1 = d1.getFullYear()
        var mo1 = (d1.getMonth() + 1).toString().padStart(2, '0')
        var da1 = d1.getDate().toString().padStart(2, '0')
        var dateTime1 = ye1 + '-' + mo1 + '-' + da1
        var d2 = new Date()
        var ye2 = d2.getFullYear()
        var mo2 = (d2.getMonth() + 1).toString().padStart(2, '0')
        var da2 = d2.getDate().toString().padStart(2, '0')
        var dateTime2 = ye2 + '-' + mo2 + '-' + da2

        if (new Date(dateTime1) > new Date(dateTime2)) {
          this.$notify({
            message: '该日期未有录像',
            type: 'warning',
            duration: 4000
          })
        } else {
          if (item.otherMonth === 'nextMonth' || item.otherMonth === 'preMonth') {
          } else {
            const circle = document.getElementById(item.date)
            if (circle.style.backgroundColor === 'rgb(172, 176, 184)') {
              circle.style = ''
              this.$pArent.videoList = []
              this.Ifcircle = false
            } else {
              if (this.Ifcircle) {
                const circle = document.getElementById(this.frontcircle)
                circle.style = ''
              }
              this.frontcircle = item.date
              circle.style =
                'background-color: rgb(172, 176, 184);border-radius: 50%;'
              this.Ifcircle = true
              this.$emit('dletbeforeIndex')
              // 处理时间的参数
              var d = new Date(item.date.replace(/\//g, '-'))
              var ye = d.getFullYear()
              var mo = (d.getMonth() + 1).toString().padStart(2, '0')
              var da = d.getDate().toString().padStart(2, '0')
              var startDateTime = ye + '-' + mo + '-' + da + ' 00:00:00'
              var endDateTime = ye + '-' + mo + '-' + da + ' 23:59:59'
              startDateTime = new Date(startDateTime).getTime().toString()
              endDateTime = new Date(endDateTime).getTime().toString()
              startDateTime = startDateTime.substring(
                0,
                startDateTime.length - 3
              )
              endDateTime = endDateTime.substring(0, endDateTime.length - 3)

              const loadingInstance = Loading.service({ target: '.wh_container', spinner: 'el-icon-loading', text: '正在获取设备视频回放文件' })
              // 发起获取历史回放的请求
              getRecordList({
                ns_id: this.$parent.HISparams.ns_id,
                stream_id: this.$parent.HISparams.stream_id,
                start: startDateTime,
                end: endDateTime,
                line: 50
              })
                .then((res) => {
                  loadingInstance.close()
                  this.$parent.piecewiseVideoList = res.data.list
                  const resultListTemp = res.data.list
                  if (resultListTemp.length === 0) {
                    // 返回空数组
                    this.$parent.videoList = []
                    this.$parent.$refs['videoPlayer' + 0][0].videoSrc = ''
                    this.$message.error('当前时间段内没有视频回放文件')
                    return false
                  }
                  this.$parent.videoList = resultListTemp

                  this.$parent.videoList.map((item) => {
                    const startSec = item.start - startDateTime
                    const endSec = item.end - startDateTime
                    item.left = startSec / 864
                    item.width = (endSec - startSec) / 864
                  })
                })
                .catch((res) => {
                  loadingInstance.close()
                  this.$message({
                    message: '网络错误',
                    type: 'error'
                  })
                })
            }
          }
        }
      } else {
        this.$notify({
          message: '请先选择摄像头',
          type: 'warning',
          duration: 4000
        })
      }
    },
    // 日期高亮初始化
    highlight() {
      console.log('调用了吗 :>> ')
      if (this.frontcircle) {
        const eliminate = document.getElementById(this.frontcircle)
        eliminate.style = ''
        this.frontcircle = ''
        this.Ifcircle = false
      }
    },
    intStart() {
      timeUtil.sundayStart = this.sundayStart
    },
    setClass(data) {
      const obj = {}
      obj[data.markClassName] = data.markClassName
      return obj
    },
    clickDay: function(item, index) {
      const [markDate, markDateMore] = this.forMatArgs()
      const isMark = markDate.indexOf(item.date) > -1
      if (!isMark) return
      if (item.otherMonth === 'nowMonth' && !item.dayHide) {
        this.getList(this.myDate, item.date)
      }
      // if (item.otherMonth !== "nowMonth") {
      //   item.otherMonth === "preMonth"
      //     ? this.PreMonth(item.date)
      //     : this.NextMonth(item.date);
      // }
    },
    ChoseMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date)
      this.myDate = new Date(date)
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate))
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay)
      } else {
        this.getList(this.myDate)
      }
    },
    PreMonth: function(date, isChosedDay = false) {
      if (this.frontcircle) {
        const eliminate = document.getElementById(this.frontcircle)
        eliminate.style = ''
        this.frontcircle = ''
        this.Ifcircle = false
        this.$parent.videoList = []
        this.$emit('dletvideoSrc')
      }
      date = timeUtil.dateFormat(date)
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'preMonth')
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate))
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay)
      } else {
        this.getList(this.myDate)
      }
    },
    NextMonth: function(date, isChosedDay = false) {
      if (this.frontcircle) {
        const eliminate = document.getElementById(this.frontcircle)
        eliminate.style = ''
        this.frontcircle = ''
        this.Ifcircle = false
        this.$parent.videoList = []
        this.$emit('dletvideoSrc')
      }
      const month = new Date(date).getMonth()
      const year = new Date(date).getFullYear()
      const nowDate = new Date()
      const nowMonth = nowDate.getMonth()
      const nowYear = nowDate.getFullYear()
      if (year >= nowYear && month >= nowMonth) {
        this.nextMonthDis = true
      }
      date = timeUtil.dateFormat(date)
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'nextMonth')
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate))
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay)
      } else {
        this.getList(this.myDate)
      }
    },
    forMatArgs: function() {
      let markDate = this.markDate
      let markDateMore = this.markDateMore
      markDate = markDate.map((k) => {
        return timeUtil.dateFormat(k)
      })
      markDateMore = markDateMore.map((k) => {
        k.date = timeUtil.dateFormat(k.date)
        return k
      })
      return [markDate, markDateMore]
    },
    getList: function(date, chooseDay, isChosedDay = false) {
      const [markDate, markDateMore] = this.forMatArgs()
      this.dateTop = `${date.getFullYear()}年${date.getMonth() + 1}月`
      const arr = timeUtil.getMonthList(this.myDate)
      for (let i = 0; i < arr.length; i++) {
        let markClassName = ''
        const k = arr[i]
        k.chooseDay = false
        const nowTime = k.date
        const t = new Date(nowTime).getTime() / 1000
        // 看每一天的class
        for (const c of markDateMore) {
          if (c.date === nowTime) {
            markClassName = c.className || ''
          }
        }
        // 标记选中某些天 设置class
        k.markClassName = markClassName
        k.isMark = markDate.indexOf(nowTime) > -1
        // 无法选中某天
        k.dayHide = t < this.agoDayHide || t > this.futureDayHide
        if (k.isToday) {
          this.$emit('isToday', nowTime)
        }
        const flag = !k.dayHide && k.otherMonth === 'nowMonth'
        if (chooseDay && chooseDay === nowTime && flag) {
          if (k.isMark) {
            this.$emit('choseDay', nowTime)
            this.historyChose.push(nowTime)
            k.chooseDay = true
          }
        } else if (
          this.historyChose[this.historyChose.length - 1] === nowTime &&
          !chooseDay &&
          flag &&
          markDate.length
        ) {
          k.chooseDay = true
          this.$emit('choseDay', nowTime)
        }
      }
      this.list = arr
      const obj = {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
      this.$emit('getYearMonth', obj)
    },
    showMark(val) {
      const list = this.list
      for (const item in list) {
        for (const itemVal in val) {
          if (list[item].date === val[itemVal].date) {
            list[item].isMark = val[itemVal].show
            this.$set(this.list, item, list[item])
          }
        }
      }
    }
  }
}
</script>

<style scoped>
/* @media screen and (min-width: 460px) {
  .wh_item_date:hover {
    background: #71c7a5;
    cursor: pointer;
  }
} */
* {
  margin: 0;
  padding: 0;
}

.wh_container {
  max-width: 410px;
  margin: auto;
}

li {
  list-style-type: none;
}

.wh_top_changge {
  display: flex;
}

.wh_top_changge li {
  cursor: pointer;
  display: flex;
  color: rgb(0, 0, 0);
  font-size: 18px;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 47px;
}

.wh_top_changge .wh_content_li {
  cursor: auto;
  flex: 2.5;
}

.wh_content_all {
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC',
    'Helvetica Neue', STHeiti, 'Microsoft Yahei', Tahoma, Simsun, sans-serif;
  /* background-color: #0fc37c; */
  width: 100%;
  overflow: hidden;
  padding-bottom: 8px;
}

.wh_content {
  display: flex;
  flex-wrap: wrap;
  padding: 0 3% 0 3%;
  width: 100%;
}

.wh_content:first-child .wh_content_item_tag,
.wh_content:first-child .wh_content_item {
  color: #ddd;
  font-size: 16px;
}

.wh_content_item,
wh_content_item_tag {
  font-size: 15px;
  width: 13.4%;
  text-align: center;
  color: rgb(0, 0, 0);
  position: relative;
}

.wh_content_item {
  height: 40px;
}

.wh_top_tag {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wh_item_date {
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
  /* ----------------------------------------- */
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wh_item_date:hover {
  cursor: pointer;
}

.wh_other_dayhide:hover {
  cursor: no-drop;
}

.wh_jiantou1 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #000000;
  border-left: 2px solid #000000;
  transform: rotate(-45deg);
}

.wh_jiantou1:active,
.wh_jiantou2:active {
  border-color: #ddd;
}

.wh_jiantou2 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #000000;
  border-right: 2px solid #000000;
  transform: rotate(45deg);
}

.wh_content_item > .wh_isMark {
  margin: auto;
  border-radius: 100px;
  background: #4777e8;
  z-index: 2;
}

.wh_content_item .wh_other_dayhide {
  color: #bfbfbf;
}

.wh_content_item .wh_want_dayhide {
  color: #bfbfbf;
}

.wh_content_item .wh_isToday {
  /* background: yellow; */
  /* border-radius: 100px; */
}

.wh_content_item .wh_chose_day {
  background: green;
  border-radius: 100px;
}
</style>
