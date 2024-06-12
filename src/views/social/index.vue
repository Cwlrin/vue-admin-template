<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏组件，用于展示页面操作按钮和本月统计信息 -->
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <template v-slot:before>
          本月 {{ tips.dateRange }}：社保在缴 {{ tips.socialSecurityCount }} 公积金在缴 {{ tips.providentFundCount }} 增员
          {{ tips.newsCount }} 减员 {{ tips.reducesCount }} 入职 {{ tips.worksCount }} 离职 {{ tips.leavesCount }}
        </template>
        <template>
          <!-- 历史归档按钮，点击跳转到历史归档页面 -->
          <el-button size="mini" type="danger" @click="$router.push('/social_securitys/historicalArchiving')"> 历史归档
          </el-button>
          <!-- 报表按钮，点击跳转到相应月份的报表页面 -->
          <el-button
            size="mini"
            type="primary"
            @click="$router.push(`/social_securitys/monthStatement?yearMonth=${yearMonth}`)"
          >{{ yearMonth }} 报表
          </el-button>
        </template>
      </page-tools>
      <!-- 筛选组件，用于筛选人员和部门等信息 -->
      <!-- 筛选组件 -->
      <social-tool />
      <el-card class="hr-block">
        <!-- 社保公积金数据表格，展示人员的详细信息和缴纳情况 -->
        <el-table :data="list" :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%">
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="姓名" prop="username" sortable />
          <el-table-column label="手机" prop="mobile" sortable />
          <el-table-column label="工号" prop="workNumber" sortable />
          <el-table-column label="部门" prop="departmentName" sortable width="180" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable />
          <el-table-column label="离职时间" prop="leaveTime" sortable />
          <el-table-column :formatter="getCity" label="社保城市" prop="participatingInTheCity" width="180" />
          <el-table-column :formatter="getCity" label="公积金城市" prop="providentFundCity" width="180" />
          <el-table-column :formatter="getBase" label="社保基数" prop="socialSecurityBase" />
          <el-table-column :formatter="getBase" label="公积金基数" prop="providentFundBase" />
          <!-- <el-table-column label="操作">
            <template v-slot:default="obj">
              <el-button type="text" size="mini" @click="$router.push(`/social_securitys/detail/${obj.row.id}`)"> 查看详情 </el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- 分页组件，用于分页展示数据 -->
        <el-row align="middle" justify="center" style="height: 60px" type="flex">
          <el-pagination
            :current-page="page.page"
            :page-size="page.pageSize"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>

    </div>
  </div>
</template>

<script>
import { getSettings } from '@/api/social'
import { getEmployeeList } from '@/api/salary'
import SocialTool from './components/social-tool'
import pageTools from './components/page-tools.vue'

export default {
  name: 'SocialTableIndex',
  components: { SocialTool, pageTools },
  data() {
    return {
      list: [], // 社保信息列表
      yearMonth: '', // 年月，用于显示社保的所属时期
      page: {
        page: 1, // 当前页码
        pageSize: 10, // 每页显示数量
        total: 0 // 总记录数
      },
      selectParams: {}, // 查询筛选参数
      tips: {}, // 提示信息
      loading: false // 加载状态
    }
  },
  created() {
    // 初始化时获取社保列表和设置信息
    // 获取社保列表
    this.getSocialList() // 获取列表数据
    this.getSettings()
  },
  methods: {
    /**
     * 随机获取一个基础工资值。
     *
     * 本函数用于生成一个随机的基础工资，为员工薪资系统提供初始值。
     * 它返回一个预定义数组中的随机元素，数组包含了一系列可能的基础工资值。
     * 这样做的目的是为了在系统初始化或模拟数据时，能够快速地生成合理的工资数据。
     *
     * @returns {number} 随机选取的基础工资值。
     */
    getBase() {
      // 随机获取一个基础工资值
      return [3000, 5000, 6000, 8000, 10000, 12000, 15000, 16000][Math.floor(Math.random() * 8)]
    },
    /**
     * 随机获取一个城市名称
     *
     * 该函数用于从预定义的城市列表中随机选择一个城市名称返回。
     * 列表中包含中国的一些主要城市，旨在为应用程序提供一种简单的方法来获取随机的城市名，
     * 例如，用于用户注册时的默认所在地选择，或者在测试数据生成中使用。
     *
     * @returns {string} 随机选择的城市名称
     */
    getCity() {
      // 随机获取一个城市名称
      return ['北京', '上海', '深圳', '天津', '重庆', '珠海', '广州', '西安'][Math.floor(Math.random() * 8)]
    },
    /**
     * 异步获取当前的社保设置信息。
     *
     * 本函数通过调用 getSettings 接口来获取最新的社保设置数据，
     * 并将其中的数据 Month 部分赋值给组件内的 yearMonth 属性，
     * 以更新界面显示的社保年月信息。
     *
     * @async
     * @returns {void}
     */
    async getSettings() {
      // 获取最新的社保设置信息
      const { dataMonth } = await getSettings()
      this.yearMonth = dataMonth
    },
    /**
     * 跳转到详情页面
     *
     * 当用户点击表格中的某一行时，此函数被调用。它负责导航到一个详细的视图，
     * 通常用于显示所选行的详细信息。此函数不接受任何参数，因为它依赖于
     * 组件的上下文来执行导航。
     *
     * @param {Object} row - 表格行的数据。此参数未在函数中使用，但保留以匹配事件处理程序的常见签名。
     * @param {Event} event - 触发导航的事件。此参数未在函数中使用，但保留以匹配事件处理程序的常见签名。
     * @param {Object} column - 表格列的配置。此参数未在函数中使用，但保留以匹配事件处理程序的常见签名。
     */
    goDetail(row, event, column) {
      // 跳转到详情页面
      this.$router.push({ path: 'detail' })
    },
    /**
     * 异步获取员工的社会保险信息列表。
     *
     * 此方法通过调用 getEmployeeList 接口，传入分页信息和选择的参数，
     * 来获取员工的社会保险列表数据。获取到的数据将用于填充列表展示，
     * 并更新分页组件的总条目数。
     *
     * @returns {void}
     */
    async getSocialList() {
      // 发起请求获取员工列表数据
      // 加载社保列表数据
      try {
        // 解构响应数据中的列表项 (rows) 和总条目数(total)
        const { rows, total } = await getEmployeeList({ ...this.page, ...this.selectParams })
        // 更新列表数据和总条目数
        this.list = rows // 列表数据
        this.page.total = total // 总数
      } catch (error) {
        // 捕获并记录请求过程中发生的错误
        console.log(error)
      } finally {
        // 无论请求成功或失败，都设置加载状态为 false
        this.loading = false
      }
    },
    /**
     * 当选择参数变化时，更新查询条件并重新获取列表数据。
     * 这个方法主要用于处理前端页面上选择参数变化的逻辑，通过更新查询参数和重置分页信息，
     * 来确保用户在更改选择参数后能够看到最新的数据列表。
     *
     * @param {Object} selectParams - 包含已选中参数的对象。
     *   - departmentChecks: 已选中的部门检查参数。
     *   - providentFundChecks: 已选中的公积金检查参数。
     *   - socialSecurityChecks: 已选中的社保检查参数。
     *
     * 注意：这里不直接使用 this.selectParams = selectParams 进行赋值，是为了更细粒度地控制哪些参数需要被更新，
     * 以及重置分页信息，确保列表数据能够根据新的选择参数正确刷新。
     */
    changeSelectParams(selectParams) {
      // 更新选择参数中的部门检查、公积金检查、社保检查状态
      // 更新查询参数
      this.selectParams.departmentChecks = selectParams.departmentChecks
      this.selectParams.providentFundChecks = selectParams.providentFundChecks
      this.selectParams.socialSecurityChecks = selectParams.socialSecurityChecks
      // 重置分页信息，回到第一页
      this.page.page = 1
      // 根据更新后的参数重新获取列表数据
      this.getSocialList()
    },
    /**
     * 当分页改变时触发的事件处理函数。
     * 主要用于更新当前的分页状态并重新获取对应页码的社交列表数据。
     *
     * @param {number} page - 新的分页页码。
     */
    pageChange(page) {
      // 更新当前的分页状态
      this.page.page = page // 当前
      // 调用方法获取新的分页数据
      this.getSocialList() // 获取列表数据
    },
    // 导出功能的处理，目前尚未实现
    handleExport() {
      // GaolyQQ 待实现
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.cont-bod-box {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  margin-top: 15px;
  margin-bottom: 15px;
  border: 1px solid #ebeef5;
}

</style>
