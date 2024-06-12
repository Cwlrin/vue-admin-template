<template>
  <div class="changeSalary">
    <!-- 员工信息区域 -->
    <div class="infoBox">
      <div class="logo"><img alt="" src="@/assets/common/img.jpeg"></div>
      <div class="info">
        <!-- 员工姓名 -->
        <p>
          <span class="name">{{ user.username }}</span>
        </p>
        <!-- 部门和入职时间 -->
        <p>
          <span> 部门：</span>
          {{ user.departmentName }}
        </p>
        <p>
          <span> 入职时间：</span>
          {{ user.timeOfEntry | formatDate }}
        </p>
      </div>
    </div>
    <!-- 工资调整表单 -->
    <div>
      <el-form :model="ruleForm" class="demo-ruleForm" label-width="110px">
        <!-- 调整基本工资项 -->
        <el-form-item label="调整基本工资">
          <el-input v-model="userSalary.currentBasicSalary" :disabled="true" style="width: 220px;" />
          <span class="Label">-></span>
          <el-input
            v-model="ruleForm.currentBasicSalary"
            placeholder="请输入调整后基本工资"
            style="width: 220px;"
            type="number"
          />
        </el-form-item>
        <!-- 调整岗位工资项 -->
        <el-form-item label="调整岗位工资">
          <el-input v-model="userSalary.currentPostWage" :disabled="true" style="width: 220px;" />
          <span class="Label">-></span>
          <el-input
            v-model="ruleForm.currentPostWage"
            placeholder="请输入调整后岗位工资"
            style="width: 220px;"
            type="number"
          />
        </el-form-item>
        <!-- 工资合计项 -->
        <el-form-item label="工资合计">
          <el-input v-model="computeCurrentTotal" :disabled="true" style="width: 220px;" />
          <span class="Label">-></span>
          <el-input v-model="computeChangeTotal" :disabled="true" style="width: 220px;" />
        </el-form-item>
        <!-- 调整幅度项 -->
        <el-form-item label="调整幅度">
          <el-input v-model="computeChangeSize" :disabled="true" style="width: 220px;" />
        </el-form-item>
        <!-- 操作按钮区域 -->
        <div class="buttones" style="text-align: center;margin-top: 40px;">
          <el-form-item>
            <el-button type="primary" @click="onSubmit"> 保存 </el-button>
            <el-button @click="onClose"> 关闭 </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { changeSalary } from '@/api/salary'

export default {
  // 组件名称
  name: 'UsersTableIndex',
  // 接收的 props，包括用户薪资和用户 ID
  props: ['userSalary', 'userId'],

  data() {
    return {
      user: {},
      ruleForm: {}
    }
  },
  computed: {
    /**
     * 计算当前薪资总额
     *
     * 此函数用于汇总用户的当前基本工资和岗位工资，以得到用户的当前总薪资。
     * 它首先检查用户的基本工资和岗位工资是否已提供，如果提供了，则将它们转换为数字，
     * 然后将两者相加。如果任一工资未提供，则相应的加薪将被忽略，只计算提供的工资部分。
     *
     * @returns {number} 返回用户的当前总薪资
     */
    computeCurrentTotal() {
      // 初始化基本工资和岗位工资的总和为 0
      let base = 0
      // 如果当前基本工资存在，则将其转换为数字并赋值给 base
      if (this.userSalary.currentBasicSalary != null) {
        base = Number(this.userSalary.currentBasicSalary)
      }
      // 初始化岗位工资的总和为 0
      let post = 0
      // 如果当前岗位工资存在，则将其转换为数字并赋值给 post
      if (this.userSalary.currentPostWage != null) {
        post = Number(this.userSalary.currentPostWage)
      }
      // 返回基本工资和岗位工资的总和作为当前总薪资
      return base + post
    },
    /**
     * 计算当前基本工资和岗位工资的总和。
     *
     * 该方法用于根据提供的当前基本工资和岗位工资，计算出两者的总和。
     * 如果其中任何一个值为空或未定义，则将其视为 0。
     * 这种计算对于需要基于员工当前薪资进行进一步计算的场景非常有用，比如福利计算或税款预估。
     *
     * @returns {number} 当前基本工资和岗位工资的总和。
     */
    computeChangeTotal() {
      // 初始化基本工资和岗位工资的总和为 0
      let base = 0
      // 如果当前基本工资存在，则将其转换为数字并赋值给 base
      if (this.ruleForm.currentBasicSalary != null) {
        base = Number(this.ruleForm.currentBasicSalary)
      }
      // 初始化岗位工资的总和为 0
      let post = 0
      // 如果当前岗位工资存在，则将其转换为数字并赋值给 post
      if (this.ruleForm.currentPostWage != null) {
        post = Number(this.ruleForm.currentPostWage)
      }
      // 返回基本工资和岗位工资的总和
      return base + post
    },
    /**
     * 计算薪资变化量
     *
     * 本函数用于计算薪资的变动总额。它通过减去当前薪资总额和变动后薪资总额的差值来实现。
     * 这对于理解薪资变动的幅度非常有帮助，特别是在进行薪资调整时。
     *
     * @returns {number} 薪资变化量，表现为计算后薪资总额与当前薪资总额的差值。
     */
    computeChangeSize() {
      // 返回薪资变动总额，即计算后薪资总额减去当前薪资总额。
      return this.computeChangeTotal - this.computeCurrentTotal
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    /**
     * 当用户点击提交按钮时触发的函数。
     * 主要功能是更新用户的薪资信息。
     *
     * @async
     * @returns {void}
     */
    async onSubmit() {
      // 创建一个对象来存储将要发送的数据
      const sendData = this.ruleForm
      // 为发送的数据添加用户 ID，这是更新薪资信息所必需的
      sendData.userId = this.userId
      // 调用更新薪资信息的异步函数，并等待其完成
      await changeSalary(sendData)
      // 使用 Element UI 的 message 组件显示保存成功的消息
      this.$message({ message: '保存成功', type: 'success' })
      // 触发一个自定义事件'success'，通知父组件保存操作已完成
      this.$emit('success')
      // 调用关闭函数，可能是关闭当前的弹出窗口或对话框
      this.onClose()
    },
    /**
     * 当对话框需要关闭时触发的函数。
     * 该函数主要负责重置表单数据，并通知父组件对话框已关闭。
     *
     * 通过重置表单数据，可以确保下一个打开的对话框不会受到之前数据的影响。
     * 同时，通过触发'onDialogCancel'事件，允许父组件根据需要执行相应的操作，如清理状态等。
     */
    onClose() {
      // 重置表单数据为一个空对象，以确保不会泄露之前的数据。
      this.ruleForm = {}
      // 触发一个自定义事件，通知父组件对话框已被取消。
      this.$emit('onDialogCancel')
    },
    /**
     * 根据用户 ID 异步获取用户详细信息
     *
     * 本函数通过调用 getUserDetailById 方法，使用传入的用户 ID 来获取特定用户的详细信息。
     * 使用了 async/await 语法来处理异步操作，确保在获取用户信息期间页面不会卡顿。
     * 获取到的用户信息将赋值给 this.user，供组件内其他地方使用。
     *
     * @returns {void} 本函数无返回值，但会更新 this.user 的值
     */
    async getUserDetailById() {
      this.user = await getUserDetailById(this.userId)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../../styles/variables.scss';

.changeSalary {
  .infoBox {
    display: flex;
    border-bottom: solid 1px #ccc;
    margin-bottom: 20px;
    padding: 10px 0 20px 0;

    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }

    .logo {
      border: solid 1px #ccc;
      width: 102px;
      height: 102px;
      border-radius: 50%;
      margin-right: 20px;
    }

    .info {
      p {
        line-height: 30px;

        .name {
          font-size: 16px;
        }

        span {
          font-weight: bold;
          display: inline-block;
          margin-right: 0px;
          margin-left: 10px;
        }
      }
    }

    .buttones {
      text-align: center;
    }
  }

  .Label {
    margin: 0 20px;
    color: #999;
  }
}
</style>
