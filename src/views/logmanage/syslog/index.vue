<template>
  <div>
    <el-select
      v-model="objFileList.searchFileName"
      class="com com-margin"
      filterable
      placeholder="请选择搜索条目"
      @change="selectFile"
    >
      <el-option
        v-for="item in objFileList.fileListOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p id="pcontext" class="pcontextsty" />
  </div>
</template>

<script>
import { getSyslogFileList, getSyslogFileContext } from '@/api/log'

export default {

  data() {
    return {
      context: '',
      objFileList: {
        fileListOptions: [
          { label: '空', value: '' },
          { label: 'IP地址', value: 'ip' },
          { label: '用户', value: 'operuser' },
          { label: '操作系统', value: 'os_info' },
          { label: '浏览器信息', value: 'browser_info' },
          { label: '操作类型', value: 'opertype' },
          { label: '操作结果', value: 'result' }
        ],
        searchFileName: ''
      }
    }
  },
  created() {
    this.getSyslogFileList()
  },
  mounted: function() {
    // window.onresize:浏览器尺寸变化响应事件
    window.document.getElementById('pcontext').innerHTML = this.context
  },
  methods: {
    selectFile(value) {
      this.getSyslogFileContext(value)
    },
    async getSyslogFileList() {
      const res = await getSyslogFileList()

      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('获取系统日志文件列表失败')
      }
      this.objFileList.fileListOptions = []
      this.objFileList.fileListOptions.push(...res.data.map(item => {
        return {
          label: item,
          value: item
        }
      }))

      this.$message.success('获取系统日志文件列表成功')
    },
    async getSyslogFileContext(fileName) {
      const param = { 'filename': fileName }
      const res = await getSyslogFileContext(param)

      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('获取系统日志文件内容成功')
      }
      // 替换所有的换行符
      let data = res.data
      data = data.replace(/\r\n/g, '<br>')
      data = data.replace(/\n/g, '<br>')

      // 替换所有的空格（中文空格、英文空格都会被替换）
      data = data.replace(/\s/g, '&nbsp;')
      this.context = data
      window.document.getElementById('pcontext').innerHTML = this.context
      this.$message.success('获取系统日志文件内容成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.pcontextsty {
    width: 100%;
    height: auto;
    word-wrap:break-word;
    word-break:break-all;
    overflow: hidden;
    margin-bottom: 100px;
    text-align: justify;
    line-height:200%;
    }

</style>
