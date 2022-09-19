<template>
  <div>
    <el-dialog :visible="dialogVisible" v-bind="$attrs" title="编辑空间信息" v-on="$listeners" @open="onOpen" @close="onClose">
      <el-form ref="elForm" :model="spaceUserInfo" size="medium" label-width="100px">
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
import { editSpace } from '@/api/oystervideo'
import { listUser } from '@/api/user'
export default {
  name: 'Spaceinfo',
  components: {},
  inheritAttrs: false,
  props: { spaceData: {
    type: Object,
    // 对象或数组默认值必须从一个工厂函数获取
    default: function() {
      return {
        id: undefined,
        userid: undefined,
        username: undefined }
    }
  }, dialogVisible: {
    type: Boolean,
    default: false
  }},
  data() {
    return {
      spaceUserInfo: this.spaceData,
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
  watch: {
    spaceData(newvalue, oldvalue) {
      this.spaceUserInfo = JSON.parse(JSON.stringify(newvalue))
    }
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
      this.$forceUpdate()
    },
    handelConfirm() {
      this.editSpaceInfo()
    },
    async editSpaceInfo() {
      console.log(this.spaceUserInfo)
      const res = await editSpace(this.spaceUserInfo)
      if (res.code !== 200) { 
        return this.$message('编辑监控视频空间信息失败') 
      }
      setTimeout(() => {
        this.close()
        this.$emit('reload')
      }, 300)
      this.$message.success('编辑监控视频空间信息成功')
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
