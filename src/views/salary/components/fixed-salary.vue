<template>
  <div class="fixedDalary">
    <!-- 使用 Element UI 的表单组件进行工资调整信息的输入和展示 -->
    <el-form :label-position="labelPosition" :model="formLabelAlign" label-width="120px">
      <!-- 输入当前基本工资，为数字类型，用于后续计算 -->
      <el-form-item label="当前基本工资">
        <el-input
          v-model="formLabelAlign.currentBasicSalary"
          placeholder="当前基本工资"
          style="width: 60%"
          type="number"
        />
      </el-form-item>
      <!-- 输入当前岗位工资，为数字类型，用于后续计算 -->
      <el-form-item label="当前岗位工资">
        <el-input v-model="formLabelAlign.currentPostWage" placeholder="当前岗位工资" style="width: 60%" type="number" />
      </el-form-item>
      <!-- 显示当前工资合计，由当前基本工资和当前岗位工资自动计算得到，不可修改 -->
      <el-form-item label="当前工资合计">
        <el-input
          v-model="computeCurrentTotal"
          :disabled="true"
          placeholder="当前工资合计, 自动计算"
          style="width: 60%"
        />
      </el-form-item>
      <!-- 输入转正后的基本工资，为数字类型，用于后续计算 -->
      <el-form-item label="转正基本工资">
        <el-input
          v-model="formLabelAlign.correctionOfBasicWages"
          placeholder="转正基本工资"
          style="width: 60%"
          type="number"
        />
      </el-form-item>
      <!-- 输入转正后的岗位工资，为数字类型，用于后续计算 -->
      <el-form-item label="转正岗位工资">
        <el-input v-model="formLabelAlign.turnToPostWages" placeholder="转正岗位工资" style="width: 60%" type="number" />
      </el-form-item>
      <!-- 显示转正后的工资合计，由转正后的基本工资和岗位工资自动计算得到，不可修改 -->
      <el-form-item label="转正工资合计">
        <el-input v-model="computeTurnTotal" :disabled="true" placeholder="当前基本工资, 自动计算" style="width: 60%" />
      </el-form-item>
      <!-- 提交和关闭按钮，用于确认或取消工资调整操作 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
        <el-button @click="onClose"> 关闭 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { initSalary } from '@/api/salary'

export default {
  // 组件名称
  name: 'UsersTableIndex',
  // 接收的 props，用于从父组件传递用户 ID
  props: [
    'userId'
  ],
  data() {
    return {
      // 标签位置
      labelPosition: 'left',
      // 表单标签对齐方式的对象，初始为空
      formLabelAlign: {},
      // 转岗总工资的初始值
      turnTotal: 0
    }
  },
  computed: {
    /**
     * 计算当前工资总额。
     * 这个方法用于汇总当前的基本工资和岗位工资，以得到当前的工资总额。
     * 它不接受任何参数，并返回计算得到的工资总额。
     *
     * @returns {number} 当前工资总额，由基本工资和岗位工资相加得到。
     */
    computeCurrentTotal() {
      // 初始化基本工资和岗位工资的累计值为 0
      let base = 0
      // 如果当前基本工资存在，则将其转换为数字并累加
      if (this.formLabelAlign.currentBasicSalary != null) {
        base = Number(this.formLabelAlign.currentBasicSalary)
      }
      // 初始化岗位工资的累计值为 0
      let post = 0
      // 如果当前岗位工资存在，则将其转换为数字并累加
      if (this.formLabelAlign.currentPostWage != null) {
        post = Number(this.formLabelAlign.currentPostWage)
      }
      // 返回基本工资和岗位工资的总和
      return base + post
    },
    /**
     * 计算转岗后的总工资。
     * 这个方法用于根据员工的基本工资调整和岗位工资调整，计算转岗后的总工资。
     * 它不接受任何参数，返回一个数字，表示转岗后的总工资。
     *
     * @returns {number} 转岗后的总工资，由基本工资调整和岗位工资调整相加得到。
     */
    // 计算转岗后的总工资
    computeTurnTotal() {
      // 初始化基本工资调整的总和为 0
      let base = 0
      // 如果基本工资调整存在，则将其转换为数字并累加到 base
      if (this.formLabelAlign.correctionOfBasicWages != null) {
        base = Number(this.formLabelAlign.correctionOfBasicWages)
      }
      // 初始化岗位工资调整的总和为 0
      let post = 0
      // 如果岗位工资调整存在，则将其转换为数字并累加到 post
      if (this.formLabelAlign.turnToPostWages != null) {
        post = Number(this.formLabelAlign.turnToPostWages)
      }
      // 返回基本工资调整和岗位工资调整的总和，即转岗后的总工资
      return base + post
    }
  },
  methods: {
    /**
     * 提交表单，初始化薪资
     * @async
     */
    async onSubmit() {
      // 将用户 ID 赋值给表单数据
      this.formLabelAlign.userId = this.userId
      // 创建发送的数据对象
      const sendData = this.formLabelAlign
      // 调用初始化薪资的 API
      await initSalary(sendData)
      // 提交成功后的提示
      this.$message.success('定薪成功')
      // 触发成功事件
      this.$emit('success')
      // 关闭对话框
      this.onClose()
    },
    /**
     * 关闭对话框，并重置表单数据
     */
    onClose() {
      // 重置表单数据
      this.formLabelAlign = {}
      // 触发对话框取消事件
      this.$emit('onDialogCancel')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../../styles/variables";

.fixedDalary {
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
