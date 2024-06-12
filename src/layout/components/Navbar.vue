<template>
  <div class="navbar">
    <!-- 控制侧边栏的显示状态，并在点击时触发切换事件 -->
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- 面包屑导航，用于显示当前页面的层级路径 -->
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <!-- 用户菜单下拉框，点击头像或设置图标触发下拉菜单显示 -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 显示用户头像，如果没有头像则显示用户名的首字母 -->
          <!-- 头像 -->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <!-- 用户名称 -->
          <span class="name">{{ name }}</span>
          <!-- 设置图标 -->
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- 首页链接 -->
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <!-- 项目地址链接，跳转到 GitHub 页面 -->
          <a href="https://github.com/PanJiaChen/vue-admin-template/" target="_blank">
            <el-dropdown-item> 项目地址 </el-dropdown-item>
          </a>
          <!-- 修改密码操作，点击后触发修改密码的逻辑 -->
          <!-- prevent 阻止默认事件 -->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item> 修改密码 </el-dropdown-item>
          </a>
          <!-- 登出操作，点击后触发登出的逻辑 -->
          <!-- native 事件修饰符 -->
          <!-- 注册组件的根元素的原生事件 -->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;"> 登出 </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码对话框，控制其显示状态，并在关闭时触发相应逻辑 -->
    <!-- 放置 dialog -->
    <!-- sync- 可以接收子组件传过来的事件和值 -->
    <el-dialog :visible.sync="showDialog" title="修改密码" width="500px" @close="btnCancel">
      <!-- 表单用于输入旧密码、新密码和确认新密码，绑定表单验证规则 -->
      <!-- 放置表单 -->
      <el-form ref="passForm" :model="passForm" :rules="rules" label-width="120px">
        <!-- 输入旧密码 -->
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <!-- 输入新密码 -->
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <!-- 输入确认新密码 -->
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small" />
        </el-form-item>
        <!-- 确认修改和取消按钮，点击分别触发相应的逻辑 -->
        <el-form-item>
          <el-button size="mini" type="primary" @click="btnOK"> 确认修改 </el-button>
          <el-button size="mini" @click="btnCancel"> 取消 </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      // 控制密码修改对话框的显示状态
      showDialog: false,
      // 密码修改表单数据
      passForm: {
        oldPassword: '', // 旧密码
        newPassword: '', // 新密码
        confirmPassword: '' // 确认密码字段
      },
      // 密码修改表单验证规则
      rules: {
        oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }], // 旧密码
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          min: 6,
          max: 16,
          message: '新密码的长度为6-16位之间'
        }], // 新密码
        confirmPassword: [{ required: true, message: '重复密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          validator: (rule, value, callback) => {
            // value
            if (this.passForm.newPassword === value) {
              callback()
            } else {
              callback(new Error('重复密码和新密码输入不一致'))
            }
          }
        }] // 确认密码字段
      }
    }
  },
  computed: {
    // 引入 vuex 中的 getter，用于获取 sidebar、avatar 和 name 的状态或数据
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    /**
     * 打开修改密码的对话框。
     *
     * 本函数用于触发修改密码的操作流程，它通过设置 showDialog 属性为 true 来显示对话框，
     * 提示用户输入新的密码。此操作对于确保用户账户的安全性至关重要，因为定期更改密码
     * 可以增强账户的防护能力。
     */
    // 打开修改密码对话框
    updatePassword() {
      // 弹出层
      this.showDialog = true // 显示弹层
    },
    /**
     * 切换侧边栏的展开状态
     *
     * 本函数用于触发侧边栏的展开或收起动作，它通过调用 Vuex 中的 `toggleSideBar` 动作来实现。
     * 这是对用户界面交互的直接响应，旨在提供更灵活的布局选项，以适应不同用户的需求和屏幕尺寸。
     *
     * @returns {void} 本函数没有返回值
     */
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    /**
     * 异步退出登录操作。
     *
     * 该方法首先触发 Vuex 中的用户登出动作（user/logout），以处理登出相关的逻辑，
     * 如清除用户信息、令牌等。随后，它将路由重定向到登录页面，以确保用户界面正确更新，
     * 并且用户无法访问需要登录才能访问的页面。
     *
     * @returns {void} 无返回值。
     */
    // 退出登录
    async logout() {
      // 调用退出登录的 action
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    /**
     * 点击确认按钮时触发的函数，用于验证并修改密码。
     * 首先，它验证表单数据是否符合要求，如果验证通过，
     * 则调用 `updatePassword` 函数尝试修改密码。
     * 如果密码修改成功，它会显示一条成功消息，并关闭当前对话框。
     */
    // 确认修改密码，执行表单验证并调用接口更新密码
    btnOK() {
      this.$refs.passForm.validate(async isOK => {
        if (isOK) {
          // 调用接口
          await updatePassword(this.passForm)
          this.$message.success('修改密码成功')
          this.btnCancel()
        }
      })
    },
    /**
     * 取消修改密码操作。
     *
     * 该方法用于用户点击取消按钮时，重置密码修改表单并关闭对话框。它首先通过调用表单的 resetFields 方法来重置所有表单字段的值，
     * 然后将显示对话框的标志设置为 false，从而关闭修改密码的对话框。这样可以方便用户再次打开对话框进行密码修改操作，
     * 而不需要重新填写已经输入的信息。
     *
     * @returns {void} 该方法没有返回值。
     */
    // 取消修改密码，重置表单并关闭对话框
    btnCancel() {
      this.$refs.passForm.resetFields() // 重置表单
      // 关闭弹层
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .name {
          //  用户名称距离右侧距离
          margin-right: 10px;
          font-size: 16px;
        }

        .username {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background: #04c9be;
          color: #fff;
          margin-right: 4px;
        }

        .el-icon-setting {
          font-size: 20px;
        }

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
