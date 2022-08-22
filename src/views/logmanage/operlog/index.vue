<template>
  <div class="app">
    <div>
      <el-row style="margin-bottom: 20px;">
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <el-date-picker
            v-model="objSearch.searchDate"
            type="datetimerange"
            :picker-options="optionsList"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width: 100%"
          />
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
          <el-select
            v-model="objSearch.searchReportType"
            class="com com-margin"
            filterable
            placeholder="请选择搜索条目"
            style="width: 100%"
            @change="selectType"
          >
            <el-option
              v-for="item in objSearch.searchReportTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <el-input
            v-show="searchInputFlag"
            v-model="objSearch.searchImei"
            class="com"
            placeholder="请输入搜索值"
          />
          <el-select
            v-show="!searchInputFlag"
            v-model="objSearch.searchImei"
            class="com com-margin"
            filterable
            placeholder="请选择结果"
          >
            <el-option
              v-for="item in optionsResultList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><el-button
          type="primary"
          icon="el-icon-search"
          @click="search"
        >搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData" style="width: 100%" :height="tableHeight">
      <el-table-column prop="created_at" label="操作时间" />
      <el-table-column prop="ip" label="IP地址" />
      <!-- <el-table-column prop="address" label="地理位置" /> -->
      <el-table-column prop="operuser" label="用户" />
      <el-table-column prop="operuser_type_name" label="用户类型" />
      <el-table-column prop="os_info" label="操作系统" />
      <el-table-column prop="browser_info" label="浏览器信息" />
      <el-table-column prop="url" label="操作URL" />
      <el-table-column prop="opertype" label="操作类型" />
      <el-table-column label="操作结果">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.result === 'success'" type="success">成功</el-tag>
          <el-tag v-if="scope.row.result === 'failed'" type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="request_body" label="请求内容" /> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageFrom.pagenum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageFrom.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="sumUserNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getOperloglist, searchOperlog, deleteOperlog } from '@/api/log'
export default {
  components: {
  },
  data() {
    return {
      tableHeight: window.innerHeight - 200, // 表格动态高度
      screenHeight: window.innerHeight, // 内容区域高度
      tableData: [{
        created_at: '2022-06-05 21:31:06',
        ip: '192.168.1.0',
        address: '-',
        operuser: '王小虎',
        operuser_type_name: 'PC管理端',
        operuser_type: 'system',
        os_info: 'Mac OS X 10_15_7',
        browser_info: 'Chrome/102.0.0.0',
        opertype: '登录',
        url: '/api/auth/loginmanage',
        result: 'success',
        request_body: '{"username":"admin","passwd":"oyster2022"}'
      }, {
        created_at: '2022-06-05 21:31:06',
        ip: '192.168.1.0',
        address: '-',
        operuser: '王小虎',
        operuser_type_name: 'PC管理端',
        operuser_type: 'system',
        os_info: 'Mac OS X 10_15_7',
        browser_info: 'Chrome/102.0.0.0',
        opertype: '登录',
        url: '/api/auth/loginmanage',
        result: 'failed',
        request_body: '{"username":"admin","passwd":"oyster2022"}'
      }],
      // 默认显示第一条
      currentPage: 1,
      // 搜索
      optionsList: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      objSearch: {
        searchDate: '',
        searchReportTypeOptions: [
          { label: '空', value: '' },
          { label: 'IP地址', value: 'ip' },
          { label: '用户', value: 'operuser' },
          { label: '操作系统', value: 'os_info' },
          { label: '浏览器信息', value: 'browser_info' },
          { label: '操作类型', value: 'opertype' },
          { label: '操作结果', value: 'result' }
        ],
        searchReportType: '',
        searchImei: ''
      },
      searchInputFlag: true,
      optionsResultList: [
        { label: '成功', value: 'success' },
        { label: '失败', value: 'failed' }
      ],
      // 分页
      sumUserNum: 0,
      pageFrom: {
        pagesize: 10,
        pagenum: 1,
        keyword: ''
      }
    }
  },
  watch: {
    // 监听screenHeight从而改变table的高度
    screenHeight(val) {
      this.screenHeight = val
      this.tableHeight = this.screenHeight - 260
    }
  },
  mounted: function() {
    // window.onresize:浏览器尺寸变化响应事件
    window.onresize = () => {
      return (() => {
        // window.innerHeight:浏览器的可用高度
        window.screenHeight = window.innerHeight
        this.screenHeight = window.screenHeight
      })()
    }
  },
  created() {
    this.searchOperlogInfo()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageFrom.pagesize = val
      this.searchOperlogInfo()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageFrom.pagenum = val
      this.searchOperlogInfo()
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.deleteOperlog(row)
    },
    selectType(value) {
      console.log(value)
      if (value === 'result') {
        this.searchInputFlag = false
      } else {
        this.searchInputFlag = true
      }
    },
    search() {
      this.searchOperlogInfo()
    },
    async searchOperlogInfo() {
      const data = {
        pagesize: this.pageFrom.pagesize,
        pagenum: this.pageFrom.pagenum,
        imei: this.objSearch.searchReportType,
        context: this.objSearch.searchImei,
        starttime: this.formatDateTime(this.objSearch.searchDate[0]),
        endtime: this.formatDateTime(this.objSearch.searchDate[1])
      }
      const res = await searchOperlog(data)

      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('获取操作日志列表失败')
      }
      this.tableData = []
      this.sumUserNum = res.data.totalnum
      this.tableData.push(...res.data.list.map(item => {
        const time = new Date(item.created_at)
        item.created_at = this.formatDateTime(time)
        let typeName
        if (item.operuser_type === 'system') {
          typeName = '-'
        } else {
          typeName = item.operuser_type === 'manage' ? 'PC管理端' : '小程序'
        }
        return {
          ...item,
          operuser_type_name: typeName
        }
      }))
      this.$message.success('获取操作日志列表成功')
    },
    async listOperloginfo() {
      const res = await getOperloglist(this.pageFrom)
      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('获取操作日志列表失败')
      }
      this.tableData = []
      this.sumUserNum = res.data.totalnum
      this.tableData.push(...res.data.list.map(item => {
        const time = new Date(item.created_at)
        item.created_at = this.formatDateTime(time)
        return {
          ...item,
          operuser_type_name: item.operuser_type === 'system' ? 'PC管理端' : '小程序'
        }
      }))
      this.$message.success('获取操作日志列表成功')
    },
    async deleteOperlog(loginfo) {
      const res = await deleteOperlog({ id: loginfo.id })
      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('删除操作日志失败')
      }
      this.$message.success('删除操作日志成功')
      this.searchOperlogInfo()
    },
    // 5.日期对象转时间字符串：2020-03-01 00:00:00
    formatDateTime(date) {
      if (!date) {
        return ''
      }
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      var second = date.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    }
  }

}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
