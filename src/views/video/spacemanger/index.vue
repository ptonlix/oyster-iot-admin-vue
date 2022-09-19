<template>
  <div class="app">
    <el-button class="addspace" plain size="small" icon="el-icon-plus" type="primary" @click="addVideoSpace">新增空间</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="创建日期">
              <span>{{ props.row.created_at }}</span>
            </el-form-item>
            <el-form-item label="平台">
              <span>{{ props.row.platform }}</span>
            </el-form-item>
            <el-form-item label="空间ID">
              <span>{{ props.row.space_id }}</span>
            </el-form-item>
            <el-form-item label="空间名称">
              <span>{{ props.row.space_name }}</span>
            </el-form-item>
            <el-form-item label="关联用户">
              <span>{{ props.row.username }}</span>
            </el-form-item>
            <el-form-item label="接入类型">
              <span>{{ props.row.access_type }}</span>
            </el-form-item>
            <el-form-item label="设备数量">
              <span>{{ props.row.devices_count }}</span>
            </el-form-item>
            <el-form-item label="流数量">
              <span>{{ props.row.stream_count }}</span>
            </el-form-item>
            <el-form-item label="在线流数量">
              <span>{{ props.row.online_stream_count }}</span>
            </el-form-item>
            <el-form-item label="禁用流数量">
              <span>{{ props.row.disabled_stream_count }}</span>
            </el-form-item>
            <el-form-item label="按需拉流">
              <span>{{ props.row.on_demand_pull ? "开" : "关" }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="space_id" label="空间ID" />
      <el-table-column prop="space_name" label="空间名称" />
      <el-table-column prop="platform" label="平台" />
      <el-table-column prop="username" label="关联用户" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-popconfirm
            class="deletebutton"
            title="您确定删除该监控视频空间吗？"
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="danger"
            >删除</el-button>
          </el-popconfirm>
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
    <spaceinfo :dialog-visible.sync="spaceInfoShow" :space-data="spaceInfo" @reload="reload" />
    <addspace v-if="addSpaceShow" :dialog-visible.sync="addSpaceShow" @reload="reload" />
  </div>
</template>

<script>
import { listSpace, deleteSpace } from '@/api/oystervideo'
import Spaceinfo from './spaceinfo.vue'
import Addspace from './addspace.vue'
export default {
  components: {
    Spaceinfo,
    Addspace
  },
  data() {
    return {
      tableData: [{
        created_at: '2022-06-05 21:31:06',
        username: '王小虎',
        platform: 'QINIU',
        space_id: '3nm4x17o751vq',
        space_name: 'newly_namespace_test001',
        access_type: 'gb28181',
        devices_count: 11,
        stream_count: 11,
        online_stream_count: 1,
        disabled_stream_count: 2,
        on_demand_pull: true
      }],
      // 默认显示第一条
      currentPage: 1,
      // 弹窗
      spaceInfoShow: false,
      spaceInfo: {},
      addSpaceShow: false,
      nowUserId: 0,
      // 分页
      sumUserNum: 0,
      pageFrom: {
        pagesize: 10,
        pagenum: 1,
        keyword: ''
      },
      update: true
    }
  },
  mounted() {
  },
  created() {
    this.listSpaceinfo()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageFrom.pagesize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageFrom.pagenum = val
    },
    handleResetPassword(index, row) {
      console.log(index, row)
      this.passwdShow = true
      this.nowUserId = row.id
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.spaceInfoShow = true
      this.spaceInfo.id = row.id
      this.spaceInfo.userid = row.user_id
      this.spaceInfo.username = row.username
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.deleteUserInfo(row)
    },
    async listSpaceinfo() {
      const res = await listSpace(this.pageFrom)
      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('获取监控视频空间列表失败')
      }
      this.tableData = []
      this.sumUserNum = res.data.totalnum
      this.tableData.push(...res.data.list.map(item => {
        const time = new Date(item.created_at)
        item.created_at = this.formatDateTime(time)
        return {
          ...item
        }
      }))
      this.$message.success('获取监控视频空间列表成功')
    },
    async deleteUserInfo(spaceinfo) {
      const res = await deleteSpace({ id: spaceinfo.id })
      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('删除监控视频空间失败')
      }
      this.$message.success('删除监控视频空间成功')
      this.listSpaceinfo()
    },
    // 5.日期对象转时间字符串：2020-03-01 00:00:00
    formatDateTime(date) {
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
    },
    reload() {
      this.listSpaceinfo()
    },
    addVideoSpace() {
      this.addSpaceShow = true
    }
  }

}
</script>

<style>
  .addspace {
    margin-left: 20px;
  }
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
  .deletebutton {
    margin-left: 10px;
  }
</style>
