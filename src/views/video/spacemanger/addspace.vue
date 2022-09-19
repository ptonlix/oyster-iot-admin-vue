<template>
  <div>
    <el-dialog :visible="dialogVisible" v-bind="$attrs" title="新增视频空间" v-on="$listeners" @open="onOpen" @close="onClose">
      <el-form ref="elForm" :model="spaceUserInfo" size="medium" label-width="100px">
        <el-form-item label="视频服务平台" prop="platform">
          <el-select v-model="spaceUserInfo.platform" placeholder="视频服务平台">
            <el-option label="七牛云" value="QINIU" />
            <el-option label="腾讯云(暂不支持)" value="TENCENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="视频空间ID" prop="username">
          <el-input
            v-model="spaceUserInfo.ns_id"
            placeholder="请输入视频空间ID"
            :maxlength="100"
            clearable
            prefix-icon="el-icon-camera-solid"
            :style="{width: '34%'}"
          />
        </el-form-item>
        <el-form-item label="关联用户">
          <el-select
            v-model="value"
            clearable
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            placeholder="请选择关联用户"
            @change="handleUser"
          >
            <el-option
              v-for="(item, index) in tableData"
              :key="item.id"
              :label="item.username"
              :value="index"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { addSpace } from '@/api/oystervideo'
import { listUser } from '@/api/user'
export default {
  name: 'Addspace',
  components: {},
  inheritAttrs: false,
  props: { dialogVisible: {
    type: Boolean,
    default: false
  }},
  data() {
    return {
      spaceUserInfo: {},
      pageFrom: {
        pagesize: 255,
        pagenum: 1,
        keyword: ''
      },
      loading: false,
      tableData: [],
      value: ''
    }
  },
  computed: {
  },
  mounted() {
    this.listUserinfo()
  },
  created() {
  },
  methods: {
    onOpen() {},
    onClose() {
      this.$emit('update:dialog-visible', false)
    },
    close() {
      this.$emit('update:dialog-visible', false)
    },
    handleUser(index) {
      this.spaceUserInfo.userid = this.tableData[index].id
      this.spaceUserInfo.username = this.tableData[index].username
    },
    handelConfirm() {
      this.addSpaceInfo()
    },
    async addSpaceInfo() {
      console.log(this.spaceUserInfo)
      const res = await addSpace(this.spaceUserInfo)
      if (res.code !== 200) { return this.$message('新增监控视频空间信息失败') }
      setTimeout(() => {
        this.close()
        this.$emit('reload')
      }, 300)
      this.$message.success('新增监控视频空间信息成功')
    },
    async listUserinfo() {
      const res = await listUser(this.pageFrom)
      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('获取用户列表失败')
      }
      this.tableData = []
      this.tableData.push(...res.data.list)
      this.$message.success('获取用户列表成功')
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        this.pageFrom.keyword = query
        this.listUserinfo()
        setTimeout(() => {
          this.loading = false
        }, 300)
      } else {
        this.options = []
      }
    }
  }
}

</script>
<style>
</style>
