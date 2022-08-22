<template>
  <div class="dashboard-container">
    <el-row :gutter="40" style="margin-bottom:30px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
        <el-card shadow="hover">
          <h3 style="font-weight:bold">资产业务统计</h3>
          <el-row :gutter="40" class="panel-group">
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-deivce">
                  <svg-icon icon-class="device" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    设备总数
                  </div>
                  <count-to :start-val="0" :end-val="devsnum.all_num" :duration="3000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-deivce">
                  <svg-icon icon-class="device" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    温度设备
                  </div>
                  <count-to :start-val="0" :end-val="devsnum.temp_num" :duration="3000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-deivce">
                  <svg-icon icon-class="device" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    盐度设备
                  </div>
                  <count-to :start-val="0" :end-val="devsnum.salinity_num" :duration="3000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-business">
                  <svg-icon icon-class="shopping" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    业务总数
                  </div>
                  <count-to :start-val="0" :end-val="busnum" :duration="3000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="40" style="margin-bottom:30px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
        <el-card shadow="hover">
          <h3 style="font-weight:bold">Mqtt 统计指标</h3>
          <el-row :gutter="40" class="panel-group">
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-message">
                  <svg-icon icon-class="guide" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    发送字节
                  </div>
                  <count-to :start-val="0" :end-val="mqttinfo.nodes_metrics_bytes_sent" :duration="3000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-shopping">
                  <svg-icon icon-class="receiver" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    接收字节
                  </div>
                  <count-to :start-val="0" :end-val="mqttinfo.nodes_metrics_bytes_received" :duration="3000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-message">
                  <svg-icon icon-class="authenticate" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    认证次数
                  </div>
                  <count-to :start-val="0" :end-val="mqttinfo.nodes_metrics_client_authenticate" :duration="1000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-shopping">
                  <svg-icon icon-class="connect" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    连接次数
                  </div>
                  <count-to :start-val="0" :end-val="mqttinfo.nodes_metrics_client_connect" :duration="1000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-message">
                  <svg-icon icon-class="subscribe1" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    订阅次数
                  </div>
                  <count-to :start-val="0" :end-val="mqttinfo.nodes_metrics_client_subscribe" :duration="2000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-shopping">
                  <svg-icon icon-class="message" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    接收消息
                  </div>
                  <count-to :start-val="0" :end-val="mqttinfo.nodes_metrics_messages_received" :duration="2000" class="card-panel-num" />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
        <el-card shadow="hover">
          <div ref="statsChart" style="height:296px;" />
        </el-card>
      </el-col>
    </el-row>
    <div style="margin-bottom:30px;">
      <h2><i class="el-icon-s-data"> 服务器状态</i></h2>
      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
          <el-card style="margin:-10px;height:218px;margin-bottom:30px;" shadow="hover">
            <el-descriptions :column="1">
              <el-descriptions-item label="服务器名称" label-style="font-weight:bold">{{ sysinfo.hostname }}</el-descriptions-item>
              <el-descriptions-item label="服务器运行时间" label-style="font-weight:bold">{{ sysinfo.uptime }}</el-descriptions-item>
              <el-descriptions-item label="操作系统" label-style="font-weight:bold">{{ sysinfo.os }}</el-descriptions-item>
              <el-descriptions-item label="系统架构" label-style="font-weight:bold">{{ sysinfo.arch }}</el-descriptions-item>
              <el-descriptions-item label="CPU核心" label-style="font-weight:bold">{{ sysinfo.cpu_count }}</el-descriptions-item>
              <el-descriptions-item label="总内存" label-style="font-weight:bold">{{ sysinfo.mem_total }}G</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4">
          <el-card style="margin:-10px;height:218px;margin-bottom:30px;" shadow="hover">
            <div ref="pieCpu" style="height:200px;margin-bottom:-20px;" />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4">
          <el-card style="margin:-10px;height:218px;margin-bottom:30px;" shadow="hover">
            <div ref="pieMemery" style="height:200px;margin-bottom:-20px;" />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4">
          <el-card style="margin:-10px;height:218px;margin-bottom:30px;" shadow="hover">
            <div ref="pieDisk" style="height:200px;margin-bottom:-20px;" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import CountTo from 'vue-count-to'
import { getSysinfo, getEmqmetrisc } from '@/api/sys'
import { listForAllNum as devlistForAllNum } from '@/api/device'
import { listForAllNum as buslistForAllNum } from '@/api/business'

export default {
  name: 'Dashboard',
  data() {
    return {
      sysinfo: {
        cpuper: 60.84,
        cpu_count: 2,
        memper: 78.37,
        mem_total: 8,
        diskper: 88.26,
        disk_total: 233,
        hostname: 'fd',
        uptime: '12天1小时4分钟10秒',
        os: 'darwin',
        arch: 'x86_64'
      },
      mqttinfo: {},
      devsnum: {},
      busnum: 0
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  // eslint-disable-next-line vue/order-in-components
  components: {
    CountTo
  },
  created() {
    this.getSystemInfo()
    this.getMQTTInfo()
    this.getBusinessNum()
    this.getDevicesNum()
  },
  mounted() {
  },
  methods: {
    async getBusinessNum() {
      const res = await buslistForAllNum()
      if (res.code !== 200) {
        return this.$message('获取业务数量失败')
      }
      this.busnum = res.data
      this.$message.success('获取业务数量成功')
    },
    async getDevicesNum() {
      const res = await devlistForAllNum()
      if (res.code !== 200) {
        return this.$message('获取设备数量失败')
      }
      this.devsnum = { ...res.data }
      this.$message.success('获取设备数量成功')
    },
    async getSystemInfo() {
      const res = await getSysinfo()
      if (res.code !== 200) {
        return this.$message('获取系统信息失败')
      }
      this.sysinfo = {}
      this.sysinfo = { ...res.data }
      this.drawPieCpu(this.sysinfo)
      this.drawPieMemery(this.sysinfo)
      this.drawPieDisk(this.sysinfo)
      this.$message.success('获取系统信息成功')
    },
    async getMQTTInfo() {
      const res = await getEmqmetrisc()
      if (res.code !== 200) {
        return this.$message('获MQTT信息失败')
      }
      this.mqttinfo = { ...res.data }
      this.drawStats(this.mqttinfo)
      this.$message.success('获取MQTT信息成功')
    },
    /** EMQX状态统计 */
    drawStats(info) {
    // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.statsChart)
      var option

      option = {
        title: {
          text: 'Mqtt 状态数据'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            fontSize: 14
          },
          data: ['连接数量', '会话数量', '主题数量', '订阅数量', '路由数量', '保留消息']
        },
        series: [{
          name: '历史最大数',
          type: 'bar',
          data: [info['nodes_stats_retained_max'], info['nodes_stats_routes_max'], info['nodes_stats_suboptions_max'], info['nodes_stats_topics_max'], info['nodes_stats_sessions_max'], info['nodes_stats_connections_max']],
          itemStyle: {
            color: '#409EFF'
          }
        },
        {
          name: '当前数量',
          type: 'bar',
          data: [info['nodes_stats_retained_count'], info['nodes_stats_routes_count'], info['nodes_stats_suboptions_count'], info['nodes_stats_topics_count'], info['nodes_stats_sessions_count'], info['nodes_stats_connections_count']],
          itemStyle: {
            color: '#67C23A'
          }
        }
        ]
      }

      option && myChart.setOption(option)
    },
    drawPieCpu(info) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.pieCpu)
      var option
      option = {
        title: {
          text: 'CPU使用率 %',
          left: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        color: ['#E6A23C', '#F56C6C', '#DDD'],
        series: [{
          name: 'CPU使用率 %',
          type: 'pie',
          radius: '55%',
          label: {
            show: false
          },
          labelLine: {
            normal: {
              position: 'inner',
              show: false
            }
          },
          data: [{
            value: (info.cpuper).toFixed(2),
            name: '使用'
          },
          {
            value: (100 - info.cpuper).toFixed(2),
            name: '空闲'
          }
          ]
        }]
      }
      option && myChart.setOption(option)
    },
    drawPieMemery(info) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.pieMemery)
      var option
      option = {
        title: {
          text: '内存使用 ' + info.mem_total + 'G',
          left: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        color: ['#F56C6C', '#DDD'],
        series: [{
          name: '内存使用率 G',
          type: 'pie',
          radius: '55%',
          label: {
            show: false
          },
          labelLine: {
            normal: {
              position: 'inner',
              show: false
            }
          },
          data: [{
            value: (info.mem_total * (info.memper / 100)).toFixed(2),
            name: '已用'
          },
          {
            value: (info.mem_total * ((100 - info.memper) / 100)).toFixed(2),
            name: '剩余'
          }
          ]
        }]
      }
      option && myChart.setOption(option)
    },
    drawPieDisk(info) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.pieDisk)
      var option
      option = {
        title: {
          text: '磁盘状态' + info.disk_total + 'G',
          left: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        color: ['#F56C6C', '#DDD'],
        series: [{
          name: '磁盘状态 G',
          type: 'pie',
          radius: '55%',
          label: {
            show: false
          },
          labelLine: {
            normal: {
              position: 'inner',
              show: false
            }
          },
          data: [{
            value: (info.disk_total * (info.diskper / 100)).toFixed(2),
            name: '已用'
          },
          {
            value: (info.disk_total * ((100 - info.diskper) / 100)).toFixed(2),
            name: '可用'
          }
          ]
        }]
      }
      option && myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
    .card-panel-col {
        margin-bottom: 10px;
    }

    .card-panel {
        height: 68px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        color: #666;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, .1);

        &:hover {
            .card-panel-icon-wrapper {
                color: #fff;
            }

            .icon-message {
                background: #36a3f7;
            }

            .icon-shopping {
                background: #34bfa3
            }
        }

        .icon-message {
            color: #36a3f7;
        }

        .icon-shopping {
            color: #34bfa3
        }

        .icon-deivce {
            color: #e4a30c
        }

        .icon-business {
            color: #e45f0c
        }

        .card-panel-icon-wrapper {
            float: left;
            margin: 10px;
            padding: 10px;
            transition: all 0.38s ease-out;
            border-radius: 6px;
        }

        .card-panel-icon {
            float: left;
            font-size: 32px;
        }

        .card-panel-description {
            float: right;
            font-weight: bold;
            margin: 15px;
            margin-left: 0px;

            .card-panel-text {
                line-height: 14px;
                color: rgba(0, 0, 0, 0.45);
                font-size: 14px;
                margin-bottom: 12px;
                text-align: right;
            }

            .card-panel-num {
                font-size: 18px;
            }
        }
    }
}
</style>
