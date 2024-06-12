<template>
  <el-card class="settingContent">
    <!-- 使用 el-tabs 组件实现选项卡功能，用于切换不同的配置项 -->
    <el-tabs v-model="activeName">
      <!-- 计薪设置选项卡 -->
      <el-tab-pane label="计薪设置" name="first">
        <!-- 使用 el-form 组件创建表单，用于配置计薪相关的设置 -->
        <el-form :label-position="labelPosition" :model="sendForm" label-width="140px">
          <!-- 对应社保自然月的选择，可选当月或次月 -->
          <el-form-item label="对应社保自然月">
            <el-select v-model="sendForm.socialSecurityType" style="width: 280px;">
              <el-option :value="1" label="当月" />
              <el-option :value="2" label="次月" />
            </el-select>
            <!-- 使用 el-tooltip 组件提供对应选项的说明 -->
            <el-tooltip
              content="如果201606月工资中扣除2016年6月自然月的社保公积金，请选择当月；如果扣除2016年7月自然月的社保公积金，请选择次月。"
              placement="top"
            >
              <i
                class="el-icon-bell"
              />
            </el-tooltip>
          </el-form-item>
          <!-- 社保数据来源的显示，此处为固定值，不可修改 -->
          <el-form-item label="社保数据来源" style="width: 450px;">
            <el-input :disabled="true" placeholder="社保模块" style="width: 280px;" />
            <el-tooltip
              content="计算工资时的五险一金金额将取自社保报表"
              placement="top"
            >
              <i
                class="el-icon-bell"
              />
            </el-tooltip>
          </el-form-item>
          <!-- 考勤数据来源的显示，此处为固定值，不可修改 -->
          <el-form-item label="考勤数据来源" style="width: 450px;">
            <el-input :disabled="true" placeholder="考勤模块" style="width: 280px;" />
            <el-tooltip
              content="计算工资时的考勤数据将取自考勤统计表"
              placement="top"
            >
              <i
                class="el-icon-bell"
              />
            </el-tooltip>
          </el-form-item>
          <!-- 提交和重置按钮，用于提交表单或重置表单数据 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm()"> 提交 </el-button>
            <el-button @click="resetForm()"> 重置 </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 津贴设置选项卡 -->
      <el-tab-pane label="津贴设置" name="second">
        <!-- 使用 el-form 组件创建表单，用于配置津贴相关的设置 -->
        <el-form ref="sendForm" :model="sendForm" class="demo-ruleForm" label-width="100px" status-icon>
          <!-- 通用方案的选择，用于选择适用的津贴方案 -->
          <el-form-item label="通用方案" prop="pass">
            <el-input v-model="sendForm.subsidyName" autocomplete="off" style="width: 400px;" />
          </el-form-item>
          <!-- 备注信息的输入，用于输入对津贴方案的额外说明 -->
          <el-form-item label="备注" prop="checkPass">
            <el-input v-model="sendForm.subsidyRemark" autocomplete="off" style="width: 400px;" value="适用于全体" />
          </el-form-item>
          <!-- 津贴名称的输入和选择，包括交通补贴、通讯补贴、午餐补贴和住房补助 -->
          <el-form-item class="nameList" label="津贴名称" prop="age">
            <p>
              <el-input placeholder="交通补贴" style="width: 200px;" />
              <el-select v-model="sendForm.transportationSubsidyScheme" placeholder="请选择">
                <el-option v-for="item in subsidySchemes" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-tooltip
                :content="text"
                placement="top"
              >
                <i
                  class="el-icon-bell"
                />
              </el-tooltip>
              <el-input v-model="sendForm.transportationSubsidyAmount" placeholder="请输入内容" style="width: 200px;" />
            </p>
            <p>
              <el-input placeholder="通讯补贴" style="width: 200px;" />
              <el-select v-model="sendForm.communicationSubsidyScheme" placeholder="请选择">
                <el-option v-for="item in subsidySchemes" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-tooltip
                :content="text"
                placement="top"
              >
                <i
                  class="el-icon-bell"
                />
              </el-tooltip>
              <el-input v-model="sendForm.communicationSubsidyAmount" placeholder="请输入内容" style="width: 200px;" />
            </p>
            <p>
              <el-input :disabled="true" placeholder="午餐补贴" style="width: 200px;" />
              <el-select v-model="sendForm.lunchAllowanceScheme" placeholder="请选择">
                <el-option v-for="item in subsidySchemes" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-tooltip
                :content="text"
                placement="top"
              >
                <i
                  class="el-icon-bell"
                />
              </el-tooltip>
              <el-input v-model="sendForm.lunchAllowanceAmount" placeholder="请输入内容" style="width: 200px;" />
            </p>
            <p>
              <el-input :disabled="true" placeholder="住房补助" style="width: 200px;" />
              <el-select v-model="sendForm.housingSubsidyScheme" placeholder="请选择">
                <el-option v-for="item in subsidySchemes" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-tooltip
                :content="text"
                placement="top"
              >
                <i
                  class="el-icon-bell"
                />
              </el-tooltip>
              <el-input v-model="sendForm.housingSubsidyAmount" placeholder="请输入内容" style="width: 200px;" />
            </p>
          </el-form-item>
          <!-- 适用计税方式的选择，可选税前或税后 -->
          <el-form-item label="适用计税方式" prop="age">
            <template>
              <el-radio v-model="sendForm.taxCalculationType" label="1"> 税前 </el-radio>
              <el-radio v-model="sendForm.taxCalculationType" label="2"> 税后 </el-radio>
            </template>
          </el-form-item>
          <!-- 提交和重置按钮，用于提交表单或重置表单数据 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm"> 提交 </el-button>
            <el-button @click="resetForm"> 重置 </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getSettings, saveSettings } from '@/api/salary'

export default {
  name: 'UsersTableIndex',
  data() {
    return {
      // 标签位置设置
      labelPosition: 'left',
      // 说明文字，解释不同补贴计算方式
      text: '每出勤日：金额*实际出勤天数； 每计薪日：金额*计薪天数； 每月固定：固定金额； 每月（按出勤日）：金额*实际出勤天数/应出勤工作日； 每月（按计薪日）：金额*计薪天数/计薪标准（如21.75）；',
      // 表单标签对齐方式的配置
      formLabelAlign: {
        name: '当月',
        region: '社保模块',
        type: '考勤模块'
      },
      // 当前激活的标签名称
      activeName: 'first',
      // 补贴方案列表
      subsidySchemes: [
        { 'id': 1, 'name': '每出勤日' },
        { 'id': 3, 'name': '每月固定' }
      ],
      // 补贴设置表单数据
      sendForm: {
        socialSecurityType: 1,
        transportationSubsidyScheme: 1,
        communicationSubsidyScheme: 1,
        lunchAllowanceScheme: 1,
        housingSubsidyScheme: 1,
        taxCalculationType: '1',
        transportationSubsidyAmount: 2.1,
        communicationSubsidyAmount: 1.2,
        lunchAllowanceAmount: 1.3,
        housingSubsidyAmount: 1.5
      }
    }
  },
  mounted() {
    // 页面加载时获取设置
    this.getSettings()
  },
  methods: {
    /**
     * 获取用户设置并更新发送表单的配置
     *
     * 本函数通过调用 getSettings 接口来获取用户的设置信息。
     * 获取到设置后，会将这些设置信息赋值给 sendForm，用于更新表单的配置。
     * 这样做的目的是确保表单的配置与用户的最新设置保持一致。
     *
     * @returns {void} 本函数无返回值，但会更新 sendForm 的数据源。
     */
    getSettings() {
      // 发起获取设置的请求
      getSettings()
        .then(res => {
          // 更新 sendForm 的数据源为获取到的设置
          this.sendForm = res
        })
    },
    /**
     * 切换标签页
     *
     * 此函数用于切换当前显示的标签页。它通过接收一个对象参数来更新当前激活的标签页状态。
     * 参数 obj 代表了待切换到的标签页的信息，这个信息足以标识不同的标签页。
     *
     * @param {Object} obj - 标签页对象，包含切换所需的信息。
     */
    tabSwitch(obj) {
      this.tabLab = obj
    },
    /**
     * 异步提交表单数据。
     * 此函数封装了表单提交的逻辑，首先调用 saveSettings 函数保存配置信息，
     * 然后使用 this.$message 提示用户保存成功。
     *
     * @async
     * @returns {Promise<void>} 无返回值
     */
    async submitForm() {
      // 调用 saveSettings 函数保存表单数据
      await saveSettings(this.sendForm)
      // 使用 this.$message 提示用户保存成功
      this.$message({
        message: '保存成功',
        type: 'success'
      })
    },
    /**
     * 重置表单并获取设置
     *
     * 该方法用于在用户进行某些操作后重置发送表单的状态，使其恢复到初始状态。
     * 这包括清空表单字段的值和校验状态。在重置表单后，它会调用 `getSettings` 方法来获取最新的设置，
     * 以便用户可以基于新的设置继续操作。
     *
     * @returns {void} 该方法没有返回值
     */
    resetForm() {
      // 重置表单字段的值和校验状态
      this.$refs.sendForm.resetFields()
      // 获取最新的设置信息
      this.getSettings()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.settingContent {
  padding: 20px;

}
</style>
