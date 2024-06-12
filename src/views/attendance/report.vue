<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!-- 显示当前月份的人事报表标题 -->
        <h2 class="centInfo">{{ this.$route.params.month }} 月人事报表 </h2>
        <el-tabs v-model="activeName" class="infoPosin">
          <!-- 出勤统计标签页 -->
          <el-tab-pane name="first">
            <span slot="label"> 考勤统计 </span>
            <!-- 根据情况加载对应的报表组件 -->
            <component
              :is="allList"
              :month="this.$route.params.month"
              :show-height="showHeight"
              @archivingReportForm="archivingReportForm"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { fileUpdate } from '@/api/attendance'
import allList from './components/refort-list'

export default {
  name: 'RefortList',
  components: { allList },
  data() {
    return {
      // 定义当前使用的报表组件名称
      allList: 'allList',
      // 初始化激活的标签页名为 'first'
      activeName: 'first',
      // 设置显示区域的高度
      showHeight: 40
    }
  },

  methods: {
    /**
     * 异步函数：执行报表归档操作。
     *
     * 此函数首先通过 $confirm 对话框提示用户归档操作的不可逆性，以确保用户了解操作后果。
     * 用户确认后，调用 fileUpdate 函数进行归档操作，并在成功归档后显示成功消息。
     *
     * 使用了 Vue 的 $confirm 和 $message 方法，以及后台提供的 fileUpdate 接口。
     */
    async archivingReportForm() {
      // 使用确认对话框提示用户归档操作的不可逆性
      await this.$confirm(
        '报表归档将覆盖上一次归档记录，无法恢复。',
        '归档确认'
      )
        .then(async() => {
          await fileUpdate({ month: this.$route.params.month })
          this.$message.success('归档报表成功')
        })
    }
    // 界面交互逻辑等可后续扩展
  }
}
</script>
