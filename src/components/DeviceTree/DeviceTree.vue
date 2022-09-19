<!-- 设备播放树 -->
<template>
  <div class="addr-container">
    <el-select
      v-model="checkSpace"
      clearable
      filterable
      placeholder="选择空间"
      class="group-select"
      @change="handleSpace"
    >
      <el-option
        v-for="item in listSpace"
        :key="item.created_at"
        :label="item.space_name"
        :value="item"
      />
    </el-select>
    <div class="space-user">
      <span>空间所属用户: {{ checkSpace.usernames }}</span>
    </div>
    <div style="display: flex; margin-bottom: 10px">
      <cs-btn btn-text="重置" @click.native="resetlistDevices()" />
      <cs-btn
        type="primary"
        btn-text="确定"
        @click.native="listDevices()"
      />
    </div>
    <!-- 设备列表 -->
    <div class="device-tree-container">
      <div
        v-if="listDevice.length > 0"
        class="scroll-content"
      >
        <el-tree
          :data="listDevice"
          :props="props"
          node-key="gb_id"
          highlight-current
          @node-click="handleNodeClick"
        >
          <div slot-scope="{ node, data }">
            <span
              v-if="model == 0"
              class="custom-tree-node"
              :class="
                onlineStatus(data, node) ? 'node-text' : 'device__disabled'
              "
              :title="onlineStatus(data, node) ? '' : '离线'"
            >
              <i
                v-if="node.level == 1"
                :class="
                  onlineStatus(data, node)
                    ? 'iconfont icon-host icon-left'
                    : 'iconfont icon-host icon-color'
                "
              />
              <!-- 设备icon "摄像头" -->
              <template v-else>
                <i
                  :class="iconDevice(data.state)"
                  class="iconfont icon-shipin2"
                />
                <i
                  v-if="node.checked"
                  class="iconfont icon-shipin8 play-video"
                />
              </template>
              <span>{{ node.label }}</span>
            </span>
            <!-- (2) 历史回放视频 -->
            <span v-else-if="model == 1" class="custom-tree-node node-text">
              <i v-if="!node.data.gb_id" class="iconfont icon-ditu10" />
              <template v-else>
                <i
                  :class="iconDevice(data.state)"
                  class="iconfont icon-shipin"
                />
                <i v-if="node.checked" class="play-video" />
              </template>
              <span>{{ node.label }}</span>
            </span>
          </div>
        </el-tree>
      </div>
      <Empty v-else-if="listDevice.length == 0" />
    </div>
  </div>
</template>

<script>
import { listSpaceAndUsers, listVideoDevices, queryRecordCalendar } from '@/api/oystervideo' // 获取设备列表
import Empty from '@/components/Empty/index.vue'
import CsBtn from '@/components/CsBtn/CsBtn.vue'
import { Loading } from 'element-ui'

export default {
  name: 'DeviceTree',
  components: { Empty, CsBtn },
  props: {
    showCheckbox: {
      type: Boolean,
      default: false
    },
    model: {
      // 0直播视频,  1历史视频, 2下载中心
      type: [String, Number],
      default: 0
    },
    grid_len: {
      // 宫格数量, 可播放视频数量的上限
      type: [String, Number],
      default: 1
    },
    grid_select: {
      // 当前被选择中的 宫格位置序号
      type: [String, Number],
      default: -1
    }
  },
  data() {
    return {
      checkSpace: '', // 已选择的空间
      username: 'test', // 空间对应的用户
      listSpace: [{
        space_name: '测试',
        usernames: 123
      }], // 空间列表
      pageFrom: {
        ns_id: '',
        offset: 0,
        line: 100
      },
      listDevice: [], // 设备列表
      props: {
        label: 'name',
        children: 'items'
      },
      new_grid_select: -1, // 当前被选择中的 宫格位置序号
      checkedNodes: new Array(1), // 选中的node集合 ###
      replaceNum: 0 // 替换的视频 宫格位置号 ###
    }
  },
  computed: {
    onlineStatus() {
      return (data, node) => {
        console.log(data, node)
        if (data.state === 'online' || node.level === 1) { return true } else return false
      }
    },
    iconDevice() {
      // 摄像头icon
      return (online) => {
        let result = ''
        if (online !== 'online') {
          result += ' icon-shipin__disabled'
        }
        return result
      }
    }
  },
  watch: {
    grid_len(newVal, oldVal) {
      // 监听宫格数量的变化 1, 4, 9, 12, 16, 24
      let remindval = newVal < oldVal ? newVal : oldVal // 所要保留视频数量的上限
      var resultArr = []
      console.log('this.new_grid_select', this.new_grid_select)
      if (this.new_grid_select !== -1) {
        // 当前有被选中的宫格
        resultArr.push(this.checkedNodes[this.new_grid_select])
        remindval = remindval - 1
      }

      if (newVal > oldVal) {
        // 如果宫格数变大
        for (let i = 0; i < oldVal; i++) {
          if (
            this.checkedNodes[i] &&
            this.checkedNodes[i].checked &&
            i !== this.new_grid_select
          ) {
            resultArr.push(this.checkedNodes[i])
          }
        }
      } else {
        // 宫格数变小
        let count = 0
        for (let i = 0; i < oldVal; i++) {
          if (
            this.checkedNodes[i] &&
            this.checkedNodes[i].checked &&
            i !== this.new_grid_select &&
            count < remindval
          ) {
            resultArr.push(this.checkedNodes[i])
            count++
          } else if (
            this.checkedNodes[i] &&
            this.checkedNodes[i].checked &&
            i !== this.new_grid_select
          ) {
            this.checkedNodes[i].checked = false // 关闭其余视频??? ###
          }
        }
      }

      this.checkedNodes = new Array(newVal) // 根据宫格数, 更改数组长度

      this.replaceNum = 0

      this.new_grid_select = -1

      for (let i = 0; i < resultArr.length; i++) {
        this.$set(this.checkedNodes, i, resultArr[i])

        if (resultArr[i]) {
          this.$emit(
            'node-click',
            resultArr[i].data,
            resultArr[i].checked,
            i,
            resultArr[i]
          ) // 打开视频 ??? ###
        }
      }
    },
    grid_select(newVal, oldVal) {
      this.new_grid_select = newVal
    }
  },
  created() {
    // 获取空间信息
    this.listSpaces()
  },
  methods: {
    // 获取多选设备列表数组
    passDeviceList() {
      console.log('触发')
      const deviceArray = this.$refs.device_tree.getCheckedNodes(true)
      this.$emit('check', deviceArray)
    },
    handleSpace(val) {
      // 获取设备信息
      this.pageFrom.ns_id = val.space_id
    },
    // 点击某个设备
    handleNodeClick(data, node, page) {
      console.log(data, node, page)
      if (node.level === 1) return
      else if (node.level === 2) {
        // model==1历史模式----------------------------------------
        if (this.model === 1) {
          if (data) {
            // 有设备id 并且状态值不为 0   (可以将data.deviceId 换成 node.level)
            if (node.checked && page !== 'change') {
              // 被点击的摄像头 正在播放,  则去关闭视频
              this.toggleVideo(0, node, data, false) // 关闭当前视频
            } else {
              if (this.checkedNodes[0] && page !== 'change') {
                this.toggleVideo(0, this.checkedNodes[0], this.checkedNodes[0].data, false) // 关闭原来视频
              }
              this.toggleVideo(0, node, data, true) // 打开当前视频
              this.getRecordCalendar(data, node) // 获取视频回放日历
            }
          }
        } else if (this.model === 0) { // 直播模式
          if (data.state === 'online') {
            if (node.checked) {
            // 被点击的摄像头 正在播放,  则去关闭视频
              console.log('被点击的摄像头, 正在播放')
              const position = this.getNodePositionByKey(data.id) // 通过摄像头id 获取到播放该视频的 宫格位置号
              this.toggleVideo(position, node, data, false) // 关闭当前视频
            } else if (this.new_grid_select === -1) {
            // 未处于播放状态,并且无活跃宫格, 找一个位置去播放视频
              console.log('被点击的摄像头, 未处于播放状态, 无活跃宫格')
              const position = this.getInsertPosition()
              this.toggleVideo(position, node, data, true) // 打开当前视频
            } else {
            // 未处于播放状态, 在活跃的宫格中 打开视频
              console.log('被点击的摄像头, 未处于播放播放, 有活跃宫格')
              if (this.checkedNodes[this.new_grid_select] !== undefined) {
              // 活跃的宫格里边有视频, 先关闭原来的
                this.toggleVideo(
                  this.new_grid_select,
                  this.checkedNodes[this.new_grid_select],
                  this.checkedNodes[this.grid_select].data,
                  false
                ) // 关闭原来视频
              }
              this.toggleVideo(this.new_grid_select, node, data, true) // 打开视频
            }
          } else {
            this.$message({
              message: '设备不在线',
              type: 'warning',
              duration: 4000
            })
          }
        }
      }
    },
    async listSpaces() {
      const res = await listSpaceAndUsers()
      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('获取视频空间列表失败')
      }
      this.listSpace = []
      this.listSpace.push(...res.data)
      this.$message.success('获取视频空间列表成功')
    },
    async listDevices() {
      console.log(this.pageFrom)
      const res = await listVideoDevices(this.pageFrom)
      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('获取监控设备列表失败')
      }
      this.listDevice = []
      this.listDevice.push(...res.data.list.map(item => {
        var items = []
        if (item.type === 1) {
          items.push({ gb_id: item.gb_id, state: item.state, name: item.name })
        } else if (item.type === 2) {
          const len = item.channel_info.items ? item.channel_info.items.length : 0
          for (let i = 0; i < len; i++) {
            items.push({ gb_id: item.channel_info.items[i].gbId, state: item.channel_info.items[i].state, name: item.channel_info.items[i].name })
          }
        }
        return {
          ns_id: this.pageFrom.ns_id,
          gb_id: item.gb_id,
          state: item.state,
          name: item.name,
          type: item.type,
          items
        }
      }))
      console.log(this.listDevice)
      this.$message.success('获取监控设备列表成功')
    },
    resetlistDevices() {
      this.listDevice = []
    },
    // 通过摄像头id 获到播放该视频的宫格位置号
    getNodePositionByKey(key) {
      let position = -1
      for (let i = 0; i < this.grid_len; i++) {
        if (this.checkedNodes[i] && this.checkedNodes[i].data.id === key) {
          position = i
          break
        }
      }
      return position
    },
    // 关闭\打开 视频
    toggleVideo(position, node, data, toggle) {
      this.$emit('node-click', data, toggle, position, node)
      node.checked = toggle
      if (toggle) this.$set(this.checkedNodes, position, node)
      else {
        this.$set(this.checkedNodes, position, undefined)
      } // ### 关闭视频
    },
    // 获得一个宫格位置, 用来播放摄像头
    getInsertPosition() {
      let position = -1
      for (let i = 0; i < this.grid_len; i++) {
        // 如果有空位置，返回第一个空位置作为插入点
        if (position === -1 && this.checkedNodes[i] === undefined) {
          position = i
          break
        }
      }
      if (position === -1) {
        // 没有空位置了，按照replaceNum替换视频
        position = this.replaceNum % this.grid_len
        this.replaceNum++
        // 需要将替换  让原来的视频取消播放
        this.toggleVideo(
          position,
          this.checkedNodes[position],
          this.checkedNodes[position].data,
          false
        ) // 关闭原来视频
      }
      return position
    },
    // 获取存在录制计划
    async getRecordCalendar(data, node) {
      const loadingInstance = Loading.service({ target: '.addr-container', spinner: 'el-icon-loading', text: '正在获取设备视频回放数据' })
      var params = {}
      if (node.parent.data.type === 1) {
        params.ns_id = node.parent.data.ns_id
        params.stream_id = data.gb_id
      } else if (node.parent.data.type === 2) {
        params.ns_id = node.parent.data.ns_id
        params.stream_id = node.parent.data.gb_id + '_' + data.gb_id
      }
      console.log(this.$parent.$parent.calendarParam)
      params.year = this.$parent.$parent.calendarParam.year
      params.month = this.$parent.$parent.calendarParam.month

      const res = await queryRecordCalendar(params)
      if (res.code !== 200) {
        setTimeout(() => {
          loadingInstance.close()
        }, 100)
        return this.$message.error(res.msg)
      }
      const retdata = res.data
      this.$emit('recordCalendar', retdata)
      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        loadingInstance.close()
      })
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';

.space-user {
  margin-top: 10px;
  margin-bottom: 10px;
}

.device-tree-container {
  .el-tree-node {
    width: 100% !important;
    &.is-expanded {
      .el-tree-node__expand-icon {
        color: $my-primary;
      }
      .custom-tree-node {
        .icon-left {
          color: $my-primary;
        }
        .icon-color {
          color: #bbbbbb;
          cursor: default;
        }
        .pNode {
          color: $my-primary;
        }
      }
    }
  }
  .el-tree-node__content {
    width: 100%;
    padding-right: 10px;
  }
  .el-tree-node__expand-icon {
    font-family: 'iconfont' !important;
    font-size: 12px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &.el-icon-caret-right:before {
      content: '\e693';
    }
    &.is-leaf {
      color: transparent !important;
    }
  }
  .el-icon-caret-right {
    color: $text_dark;
    padding-left: 0;
  }
  .custom-tree-node {
    // background-color: aqua;
    .point-red {
      margin-left: 5px;
      width: 6px;
      height: 6px;
      cursor: pointer;
      display: inline-block;
      background-color: #f33;
      border-radius: 50%;
      transform: translateY(-3px);
    }
    position: relative;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    .icon-left {
      color: $text_dark;
      margin-right: 3px;
    }
    .icon-shipin {
      color: $text_dark;
      margin-right: 2px;
    }
    .play-video {
      color: $my-primary;
      font-weight: 700;
      font-size: 12px;
      position: absolute;
      left: 8px;
      top: 6px;
      display: inline-block;
    }
    &.node-text {
      color: $text_dark;
    }
    &.device__disabled {
      cursor: default;
      color: #bbbbbb !important;
      // cursor: not-allowed;
      .icon-shipin__disabled {
        color: rgb(134, 134, 134);
      }
    }
  }
  .notOnline {
    color: gold;
  }
}
</style>
