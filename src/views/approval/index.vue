<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏组件，用于展示页面操作按钮和相关信息 -->
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <!-- 前面内容插槽，用于自定义展示内容 -->
        <template v-slot:before> 当前审批中 0 本月审批通过 1 本月审批驳回 0</template>
        <!-- 操作按钮插槽，用于放置可自定义的操作按钮 -->
        <template>
          <el-button size="mini" type="primary" @click="$router.push('/approvals/securitySetting')"> 流程设置 </el-button>
        </template>
      </page-tools>
      <!-- 审批流程卡片，用于展示审批列表 -->
      <el-card class="hr-block">
        <!-- 审批列表表格，用于展示审批详情 -->
        <el-table :data="list" :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%">
          <!-- 选择列 -->
          <el-table-column type="selection" width="30" />
          <!-- 序号列 -->
          <el-table-column label="序号" type="index" width="80" />
          <!-- 审批类型列 -->
          <el-table-column label="审批类型" prop="processName" sortable />
          <!-- 申请人列 -->
          <el-table-column label="申请人" prop="username" sortable />
          <!-- 当前审批人列 -->
          <el-table-column label="当前审批人" prop="procCurrNodeUserName" sortable />
          <!-- 审批发起时间列 -->
          <el-table-column label="审批发起时间" sortable>
            <template>
              <span>{{ new Date().toLocaleString() }}</span>
            </template>
          </el-table-column>
          <!-- 审批状态列 -->
          <el-table-column label="审批状态" prop="process_state" sortable>
            <template slot-scope="scope">
              <!-- 根据审批状态显示不同图标和文字 -->
              <span v-if="scope.row.processState==='0'" class="rovalsState">
                <em class="sub" /> 已提交
              </span>
              <span v-if="scope.row.processState==='1'" class="rovalsState">
                <em class="stay" /> 审批中
              </span>
              <span v-if="scope.row.processState==='2'" class="rovalsState">
                <em class="adopt" /> 审批通过
              </span>
              <span v-if="scope.row.processState==='3'" class="rovalsState">
                <em class="reject" /> 审批不通过
              </span>
              <span v-if="scope.row.processState==='4'" class="rovalsState">
                <em class="revoke" /> 撤销
              </span>
            </template>
          </el-table-column>
          <!-- 操作列，目前未使用 -->
          <!-- <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="toDetail(scope.row)">
                查看
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- 分页组件，用于分页显示审批列表 -->
        <!-- 分页组件 -->
        <el-row align="middle" justify="center" style="height: 60px" type="flex">
          <el-pagination
            :page-size="page.pagesize"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getApprovalList } from '@/api/approval'
// import ApprovalPageTool from './components/approval-tool'
import pageTools from './components/page-tools.vue'

export default {
  name: 'SocialTableIndex',
  components: { pageTools },
  data() {
    return {
      list: [], // 审批列表数据
      loading: false, // 加载状态
      page: { // 分页信息
        page: 1, // 当前页码
        total: 0, // 总条数
        pageSize: 10 // 每页条数
      }
    }
  },
  created() {
    // 页面创建时获取审批列表数据
    this.getApprovalList()
  },
  methods: {
    /**
     * 获取审批列表数据
     *
     * 此函数用于异步获取指定年份（默认为 2018 年）的审批列表数据，并根据返回的数据更新页面的分页信息和列表内容。
     * 它首先设置加载状态为 true，然后调用后端接口获取数据，之后更新页面的总记录数和列表数据，并最后关闭加载状态。
     *
     * @returns {void}
     */
    async getApprovalList() {
      // 设置加载状态为 true，显示加载中的提示
      this.loading = true
      // 调用后端接口获取审批列表数据，传入年份和分页信息作为参数
      const { rows, total } = await getApprovalList({ year: 2018, ...this.page })
      // 更新分页信息中的总记录数
      this.page.total = total
      // 更新列表数据
      this.list = rows
      // 设置加载状态为 false，隐藏加载中的提示
      this.loading = false
    },
    /**
     * 跳转到审批详情页面
     * @param {Object} obj 审批项对象
     */
    toDetail(obj) {
      var name = obj.processName
      switch (name) {
        case '工资':
          this.$router.push({ path: '/approvals/salaryApproval/' + obj.processId })
          break
        case '入职':
          this.$router.push({ path: '/approvals/enterApproval/' + obj.processId })
          break
        case '请假':
          this.$router.push({ path: '/approvals/leaveApproval/' + obj.processId })
          break
        case '离职':
          this.$router.push({ path: '/approvals/quitApproval/' + obj.processId })
          break
        case '加班':
          this.$router.push({ path: '/approvals/overtimeApproval/' + obj.processId })
      }
    },
    /**
     * 分页改变时的处理函数
     * @param {number} newPage 新的页码
     */
    changePage(newPage) {
      this.page.newPage = newPage
      this.getApprovalList()
    }
  }
}
</script>
