<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="formData.username"
          placeholder="请输入用户名"
          :maxlength="100"
          clearable
          prefix-icon="el-icon-user-solid"
          :style="{width: '80%'}"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="formData.password"
          placeholder="请输入密码"
          :maxlength="100"
          clearable
          prefix-icon="el-icon-edit"
          show-password
          :style="{width: '80%'}"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="formData.mobile"
          placeholder="手机号"
          :maxlength="11"
          show-word-limit
          clearable
          prefix-icon="el-icon-mobile"
          :style="{width: '80%'}"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="formData.email"
          placeholder="请输入邮箱"
          :maxlength="100"
          clearable
          prefix-icon="el-icon-s-cooperation"
          :style="{width: '80%'}"
        />
      </el-form-item>
      <el-row type="flex" justify="start" align="top">
        <el-col :span="4">
          <el-form-item label="姓氏" prop="first_name">
            <el-input
              v-model="formData.first_name"
              placeholder="请输入姓氏"
              :maxlength="100"
              clearable
              :style="{width: '80%'}"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="名字" prop="last_name">
            <el-input
              v-model="formData.last_name"
              placeholder="请输入名字"
              :maxlength="100"
              clearable
              :style="{width: '80%'}"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="用户类型" prop="is_admin">
        <el-radio-group v-model="formData.is_admin" size="medium">
          <el-radio
            v-for="(item, index) in is_adminOptions"
            :key="index"
            :label="item.value"
            :disabled="item.disabled"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否禁用" prop="enabled">
        <el-radio-group v-model="formData.enabled" size="medium">
          <el-radio
            v-for="(item, index) in enabledOptions"
            :key="index"
            :label="item.value"
            :disabled="item.disabled"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注"
          :maxlength="256"
          :autosize="{minRows: 6, maxRows: 6}"
          :style="{width: '80%'}"
        />
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addUser } from '@/api/user'

export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        username: undefined,
        password: '',
        mobile: undefined,
        email: undefined,
        first_name: undefined,
        last_name: undefined,
        is_admin: true,
        enabled: true,
        remark: undefined
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }, {
          pattern: /^[A-Za-z0-9]{3,100}$/,
          message: '请输入大小写字母和数字组合，长度范围为[3,100]',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '手机号',
          trigger: 'blur'
        }, {
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          message: '请输入正确邮箱',
          trigger: 'blur'
        }],
        first_name: [{
          required: true,
          message: '请输入姓氏',
          trigger: 'blur'
        }],
        last_name: [{
          required: true,
          message: '请输入名字',
          trigger: 'blur'
        }],
        is_admin: [{
          required: true,
          message: '用户类型不能为空',
          trigger: 'change'
        }],
        enabled: [{
          required: true,
          message: '是否禁用不能为空',
          trigger: 'change'
        }],
        remark: []
      },
      is_adminOptions: [{
        'label': '管理员',
        'value': true
      }, {
        'label': '普通用户',
        'value': false
      }],
      enabledOptions: [{
        'label': '启用',
        'value': true
      }, {
        'label': '禁用',
        'value': false
      }]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
        this.addNewUser()
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    async addNewUser() {
      const res = await addUser(this.formData)
      if (res.code !== 200) { return this.$message('添加用户失败') }
      this.$message.success('添加用户成功')
      setTimeout(() => {
        this.$router.push('/usermanage/userlist')
      }, 300)
    }
  }
}

</script>
<style>
</style>
