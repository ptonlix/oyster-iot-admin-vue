<template>
  <div class="header-box">
    <div class="logo">
      <span class="title">Oyster智能物联管理平台</span>
    </div>
    <!-- 欢迎语 -->
    <div class="text">欢迎访问Oyster智能物联管理平台！</div>

    <!-- 账号选项 -->
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../assets/tx.png">
          <span>{{ username }}</span>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu>
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sessionCache from '@/utils/session-cache'

export default {
  name: 'HeaderBox',
  props: {},
  data() {
    return {
      username: '',
      communityShow: false
    }
  },
  created() {
    this.username = sessionCache.getItem('tenant').first_name + sessionCache.getItem('tenant').last_name
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters(['sidebar', 'avatar'])
  },
  // eslint-disable-next-line vue/order-in-components
  watch: {},
  methods: {
    /* 账号退出 */
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.header-box {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1002;
  background-color: $headerBg;
  color: $headerText;
  padding: 0 20px;

  .logo {
    // width: 132px;
    // height: 30px;
    margin-right: auto;

    img {
      width: 100%;
      height: 100%;
    }

    .title {
      margin-left: 10px;
      font-size: 24px;
      letter-spacing: 3px;
    }
  }

  /* 小区切换 */
  .community-change {
    margin-left: auto;
    position: relative;

    .name {
      height: 50px;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0 10px;
      color: $headerText;
      font-size: 14px;

      i {
        font-size: 12px;
      }
    }

    .list {
      position: absolute;
      right: -6px;
      background-color: #262e3e;
      width: -webkit-max-content;
      box-shadow: 0 1px 4px rgba(55, 55, 55, 0.5);

      .item {
        font-size: 14px;
        line-height: 60px;
        padding: 0 20px;
        color: $headerText;
        cursor: pointer;
      }

      .item:hover,
      .more:hover {
        background-color: #344258;
      }

      .on {
        background-color: #344258;
      }

      .more {
        font-size: 14px;
        line-height: 50px;
        padding: 0 32px;
        color: $headerText;
        cursor: pointer;
        text-align: center;
      }
    }
  }

  .text {
    margin: 0 40px 0 20px;
    font-size: 12px;
    color: $headerText;
  }

  /* 账号设置 */
  .right-menu {
    height: 50px;
    display: flex;
    align-items: center;

    .avatar-container {
      cursor: pointer;

      span {
        margin-right: 4px;
      }

      i {
        font-size: 12px;
      }

      .avatar-wrapper {
        display: flex;
        align-items: center;
        position: relative;
        color: $headerText;

        img {
          width: 24px;
          height: 24px;
          border-radius: 50px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
