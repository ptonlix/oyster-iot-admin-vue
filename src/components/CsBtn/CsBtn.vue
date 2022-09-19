<template>
  <el-button
    class="cs-btn"
    :class="[
      btnType,
      largeBtnWidth ? 'largeBtnWidth' : '',
      largeMarginRight ? 'largeMarginRight' : '',
    ]"
    :loading="buttonStatus"
  >
    {{ btnText }}
  </el-button>
</template>

<script>
// import { Loading } from 'element-ui'

export default {
  props: {
    type: {
      type: String,
      default: 'default'
    },
    btnText: {
      type: String,
      require: true
    },
    buttonStatus: {
      type: Boolean,
      default: false
    },
    largeBtnWidth: {
      type: Boolean,
      default: false
    },
    largeMarginRight: {
      type: Boolean,
      default: false
    }
  },
 
  computed: {
    btnType() {
      if (this.type === 'primary' && this.buttonStatus === true) {
        return 'primary_loading'
      } else if (this.type === 'default' && this.buttonStatus === true) {
        return 'default notAllowClick'
      } else if (this.type === 'search' && this.buttonStatus === true) {
        return 'search notAllowClick'
      } else if (this.type === 'primary') {
        return 'primary'
      } else if (this.type === 'default') {
        return 'default'
      } else if (this.type === 'search') {
        return 'search'
      } else {
        return ''
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
.cs-btn {
  height: 32px;
  border: none;
  font-size: 14px;
  box-sizing: border-box;
  margin-right: 18px;
  padding: 6px 22px;
  border-radius: 2px;
}

.largeBtnWidth {
  width: 134px;
  // 134px -- 6.97917vw
}

.largeMarginRight {
  margin-right: 140px;
}

.el-button + .el-button {
  margin-left: 0;
}

.loadingSection {
  display: inline-block;
  width: 20px;
}

::v-deep .el-icon-loading {
  color: #dddddd;
}

.primary {
  background-color: #006eff;
  color: #fff;
}

.default {
  background-color: #fff;
  color: #006eff;
  border: 1px solid #dddddd;
}

.search {
  color: #006eff;
  background: #ffffff;
  border: 1px solid #006eff;
}

.primary_loading {
  background-color: #006eff !important;
  color: #fff !important;
  cursor: not-allowed;
}

.notAllowClick {
  cursor: not-allowed;
}

.primary:focus,
.primary:hover {
  color: #fff;
  background: #59a1ff;
}

.default:focus,
.default:hover {
  color: #409eff;
  background: #ecf5ff;
  border-color: #c6e2ff;
}

.search:focus,
.search:hover {
  color: #409eff;
  background: #ecf5ff;
  border-color: #c6e2ff;
}
</style>
