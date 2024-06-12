<template>
  <div class="cont-top-box">
    <!-- 弹窗，用于导出审批数据 -->
    <el-dialog :visible.sync="exportData" title="导出" width="500px">
      <div class="exportTit"> 如果导出每月数据过多，请使用筛选功能后导出</div>
      <div class="exportCont">
        审批发起月份：
        <el-date-picker v-model="value" placeholder="选择日期" type="date" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportData = false">取 消</el-button>
        <el-button type="primary" @click="exportDataAct()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 动态组件，根据不同的审批流程渲染不同的组件 -->
    <component :is="process" ref="set" @handleCloseModal="handleCloseModal" />
  </div>
</template>

<script>
import { exportApprovals } from '@/api/approvals'
import process from './process'

export default {
  name: 'ApprovalPageTool',
  components: {
    process
  },
  data() {
    return {
      process: 'process', // 审批流程组件名称
      exportData: false, // 导出对话框的可见性
      searchKey: '', // 搜索关键字
      value: '', // 选择的导出月份
      dataes: '' // 数据列表
    }
  },
  methods: {
    // 导出审批数据
    exportDataAct() {
      if (!this.value) {
        this.$message.success('请选择导出时间！')
      } else {
        exportApprovals({ month: this.value }).then(res => {
          this.$message.success('导出成功！')
        })
      }
    },
    // 处理流程设置
    handlSet() {
      this.$refs.set.dialogFormV()
    },
    // 关闭弹框
    handleCloseModal() {
      this.$refs.addUser.dialogFormH()
      this.$refs.positive.dialogFormH()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.cont-top-box {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.top-lable {
  position: relative;
  line-height: 2;

  a {
    display: inline-block;
    padding: 0 10px;
  }

  .careful-lab {
    i {
      margin-right: 5px;
      color: #409eff;
    }

    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }

  .lable-tit {
    position: absolute;
    right: 0;
    top: 0px;
  }
}

.exportTit {
  line-height: 50px;
}
</style>
