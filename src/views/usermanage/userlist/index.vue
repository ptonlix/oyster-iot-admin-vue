<template>
  <div class="app">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="创建日期">
              <span>{{ props.row.created_at }}</span>
            </el-form-item>
            <el-form-item label="用户名">
              <span>{{ props.row.username }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="姓氏">
              <span>{{ props.row.first_name }}</span>
            </el-form-item>
            <el-form-item label="名字">
              <span>{{ props.row.last_name }}</span>
            </el-form-item>
            <el-form-item label="账户类型">
              <span>{{ props.row.usertype }}</span>
            </el-form-item>
            <el-form-item label="是否禁用">
              <span>{{ props.row.enabledtype }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建日期" width="200" />
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="mobile" label="电话" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleResetPassword(scope.$index, scope.row)"
          >重置密码</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
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
    <userinfo :dialog-visible.sync="userInfoShow" :user-data="userInfo" />
    <resetpasswd :dialog-visible.sync="passwdShow" :user-id="nowUserId" />
  </div>
</template>
<script>
import Userinfo from './userinfo.vue'
import Resetpasswd from './resetpasswd.vue'
import { listUser, deleteUser } from '@/api/user'
export default {
  components: {
    Userinfo,
    Resetpasswd
  },
  data() {
    return {
      tableData: [{
        created_at: '2022-06-05 21:31:06',
        username: '王小虎',
        mobile: '13510605710',
        email: '260431910@qq.com',
        first_name: '陈',
        last_name: '富东',
        usertype: '管理员',
        is_admin: true,
        enabledtype: '启用',
        enabled: true
      }, {
        created_at: '2022-06-05 21:31:06',
        username: '王小虎',
        mobile: '13510605710',
        email: '260431910@qq.com',
        first_name: '陈',
        last_name: '富东',
        usertype: '管理员',
        is_admin: true,
        enabledtype: '启用',
        enabled: true

      }, {
        created_at: '2022-06-05 21:31:06',
        username: '王小虎',
        mobile: '13510605710',
        email: '260431910@qq.com',
        first_name: '陈',
        last_name: '富东',
        usertype: '管理员',
        is_admin: true,
        enabledtype: '启用',
        enabled: true
      }, {
        created_at: '2022-06-05 21:31:06',
        username: '王小虎',
        mobile: '13510605710',
        email: '260431910@qq.com',
        first_name: '陈',
        last_name: '富东',
        usertype: '管理员',
        is_admin: true,
        enabledtype: '启用',
        enabled: true
      }],
      // 默认显示第一条
      currentPage: 1,
      // 弹窗
      userInfoShow: false,
      userInfo: {},
      passwdShow: false,
      nowUserId: 0,
      // 分页
      sumUserNum: 0,
      pageFrom: {
        pagesize: 10,
        pagenum: 1,
        keyword: ''
      }
    }
  },
  created() {
    this.listUserinfo()
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
      this.userInfoShow = true
      this.userInfo = row
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.deleteUserInfo(row)
    },
    async listUserinfo() {
      const res = await listUser(this.pageFrom)
      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('获取用户列表失败')
      }
      this.tableData = []
      this.sumUserNum = res.data.totalnum
      this.tableData.push(...res.data.list.map(item => {
        const time = new Date(item.created_at)
        item.created_at = this.formatDateTime(time)
        return {
          ...item,
          usertype: item.is_admin ? '管理员' : '普通用户',
          enabledtype: item.enabled ? '启用' : '禁用'
        }
      }))
      this.$message.success('获取用户列表成功')
    },
    async deleteUserInfo(userinfo) {
      const res = await deleteUser({ id: userinfo.id })
      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.listUserinfo()
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
