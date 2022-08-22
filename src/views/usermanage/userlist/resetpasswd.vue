<template>
  <div>
    <el-dialog :visible="dialogVisible" v-bind="$attrs" title="编辑用户信息" v-on="$listeners" @open="onOpen" @close="onClose">
      <el-form ref="elForm" :model="info" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="新密码" label-width="150px" prop="password">
          <el-input v-model="info.password" :placeholder="info.password" style="width: 500px" />
        </el-form-item>
        <el-form-item label="确认密码" label-width="150px" prop="repassword" style="margin-top: 35px;">
          <el-input v-model="info.repassword" :placeholder="info.repassword" style="width: 500px" />
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
import { resetPassword } from '@/api/user'

export default {
  name: 'Resetpasswd',
  components: {},
  inheritAttrs: false,
  props: { userId: {
    type: Number,
    required: true
  }, dialogVisible: {
    type: Boolean,
    default: false
  }},
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.info.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      info: {
        id: this.userId,
        password: '',
        repassword: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/, message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位，密码不能包含 用户名，公司名称(lidian), 公司域名(rekoon) （判断的时候不区分大小写)' }
        ],
        repassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  watch: {
    userId(newvalue, oldvalue) {
      this.info.id = newvalue
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['elForm'].resetFields()
      this.$emit('update:dialog-visible', false)
    },
    close() {
      this.$emit('update:dialog-visible', false)
    },
    handelConfirm() {
      console.log(this.info)
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.resetUserPassword(this.info)
        setTimeout(() => {
          this.close()
        }, 300)
      })
    },
    async resetUserPassword(data) {
      const res = await resetPassword(data)
      if (res.code !== 200) {
        // 获取用户列表
        return this.$message('重置用户密码失败')
      }
      this.$message.success('重置用户密码成功')
    }
  }
}

</script>
<style>
</style>
