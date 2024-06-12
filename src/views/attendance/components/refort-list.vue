<template>
  <div class="boxInfo">
    <!-- 数据表格区域 -->
    <div class="fr clearfix searchInfo">
      <!-- 搜索输入框，目前未使用 -->
      <!-- <div class="serachInput">
        <el-input
          v-model="requestParameters.keyword"
          placeholder="搜索"
          clearable
          @keyup.enter.native="dataSearch(itemes,index)"
        />
      </div> -->
      <!-- 导出按钮，点击触发导出数据操作 -->
      <a class="el-button fr el-button--primary el-button--mini" title="导出" @click="handelFileDownload"> 导出 </a>
    </div>
    <!-- 数据表格，展示员工考勤详细信息 -->
    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="dataList"
      border
      element-loading-text="给我一点时间"
      fit
      highlight-current-row
      style="width: 100%; margin-top:10px;"
    >
      <!-- 表格列定义，依次为姓名、工号、手机号、部门等考勤相关信息 -->
      <el-table-column label="姓名" prop="name" width="120" />
      <el-table-column label="工号" prop="workNumber" width="100" />
      <el-table-column label="手机号" prop="mobile" width="200" />
      <el-table-column label="部门" prop="department" width="200" />
      <el-table-column label="事假" prop="leaveDays" width="100" />
      <el-table-column label="调休" prop="dayOffLeaveDays" width="100" />
      <el-table-column label="正常" prop="normalDays" width="100" />
      <el-table-column label="迟到次数" prop="laterTimes" width="100" />
      <el-table-column label="早退次数" prop="earlyTimes" width="100" />
      <el-table-column label="日均时长" prop="averageDailyNaturalDays" width="150" />
      <el-table-column label="旷工天数" prop="absenceDays" width="100" />
      <el-table-column label="是否全勤" prop="whetherItIsFullOfWork" width="100" />
      <el-table-column label="实际出勤天数" prop="actualAttendanceDaysAreOfficial" width="180" />
      <el-table-column label="应出勤工作日" prop="attendanceDay" width="120" />
      <el-table-column label="计薪标准" prop="salaryStandard" width="100" />
      <el-table-column label="计薪天数" prop="officialSalaryDays" width="150" />
    </el-table>
    <!-- 分页组件，用于分页浏览数据 -->
    <div class="pagination">
      <el-pagination
        :page-size="requestParameters.pagesize"
        :total="Number(counts)"
        layout="total, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 操作按钮区域，包括归档和新建报表按钮 -->
    <div class="butList">
      <el-tooltip
        class="item"
        content="将当前报表存放至归档，归档可以多次，但只保留最后一次"
        effect="dark"
        placement="top-start"
      >
        <el-button size="small" type="primary" @click="archivingReportForm">归档 {{ month }} 月份报表</el-button>
      </el-tooltip>
      <el-tooltip class="item" content="开始做下月考勤" effect="dark" placement="top-start">
        <el-button size="small" type="primary" @click="createReportForm"> 新建报表 </el-button>
      </el-tooltip>
      <!-- <el-button @click="handleRest"> 取消 </el-button> -->
    </div>
  </div>
</template>

<script>
import { archives, newReports, reportFormList } from '@/api/attendance'

export default {
  name: 'RefortList',
  data() {
    return {
      dataList: [],
      seleList: [],
      text: '', // 新增、编辑文本
      tableKey: 0,
      counts: '',
      barSearch: {
        alertText: ''
      },
      requestParameters: {
        atteDate: ''
      },
      isArchived: '',
      loading: false,
      centerDialogVisible: false,
      infoTip: '',
      month: this.$route.params.month
    }
  },
  computed: {
    /**
     * 根据关键字模糊搜索列表数据。
     *
     * 此方法用于对当前的数据列表进行模糊搜索，根据提供的关键字过滤出匹配的数据。
     * 如果没有提供关键字，则返回完整的数据列表。
     * 搜索是大小写不敏感的，并且会在数据对象的所有键值中搜索匹配。
     *
     * @returns {Array} 返回过滤后的数据列表。
     */
    list() {
      // 获取请求参数中的关键字
      const search = this.requestParameters.keyword
      // 如果存在关键字
      if (search) {
        // 过滤数据列表，返回所有包含关键字的项
        return this.dataList.filter(data => {
          // 检查数据对象的每个键值是否包含关键字
          return Object.keys(data).some(key => {
            // 关键字匹配的条件，忽略大小写
            return (
              String(data[key])
                .toLowerCase()
                .indexOf(search) > -1
            )
          })
        })
      }
      // 如果没有关键字，返回完整的数据列表
      return this.dataList
    }
  },
  // 创建完毕状态
  created() {
    this.requestParameters.atteDate = this.yearMonth
    this.reportFormList()
  },
  // 组件更新
  methods: {
    /**
     * 异步获取报告表格列表数据。
     *
     * 此方法用于发起一个异步请求，以获取报告表格的列表数据。它首先设置加载状态为 true，然后等待数据请求完成，
     * 接着更新数据列表并关闭加载状态。这个方法是 async 声明的，允许它使用 await 关键字来等待异步操作的完成。
     *
     * @param {Object} params - 请求的参数对象。这是传递给后台请求的参数，用于过滤或排序等操作。
     * @returns {Promise<Array>} 返回一个 Promise，解析为一个数组，包含报告表格的列表数据。
     */
    async reportFormList(params) {
      // 开始加载，显示加载中的状态
      this.loading = true
      // 等待后台数据请求完成，并更新数据列表
      this.dataList = await reportFormList(this.requestParameters)
      // 加载完成，隐藏加载中的状态
      this.loading = false
    },
    /**
     * 弹窗确认归档当前月份的报告。
     * 此函数用于在用户尝试归档已归档过的月份报告时，弹出确认框。如果用户确认，
     * 则会调用归档函数再次归档报告。此操作会覆盖之前的归档数据，因此需要用户确认。
     *
     * @returns {void}
     */
    archivingReportForm() {
      // 获取请求参数中的部门 ID
      var departmentId = this.requestParameters.departmentId
      // 构建归档日期对象，包含部门 ID 和归档月份
      var atteDate = {
        departmentId: departmentId,
        atteDate: this.month
      }
      // 弹出确认框，提示用户该月份的报告已归档，再次归档将覆盖原有数据
      this.$confirm(
        '该月报表已归档过，重新归档将覆盖上一份报表，您确认要再次归档吗？',
        '归档' + this.month + '报表'
      )
        .then(async() => {
          // 如果用户确认，调用归档函数进行归档
          await archives(atteDate)
          // 归档成功后，显示成功提示消息
          this.$message.success('归档成功')
        })
    },
    /**
     * 创建下一个月的考勤报表。
     * 此函数用于在用户确认后创建一个新的考勤报表。它首先通过警告对话框确认用户是否愿意创建新报表，
     * 因为这将导致当前月份的报表变为只读，并且自上一次归档以来的所有修改都将被丢弃。
     * 如果用户确认，它将构造新月份的日期字符串，并使用这个字符串来请求生成新的考勤报表。
     * 最后，它会通知用户报表创建成功，并导航到考勤页面。
     */
    createReportForm() {
      // 确认创建下个月报表，提示用户当前月份报表将不能修改，且归档后修改内容将不被保存
      this.$confirm(
        '新建报表会使得' +
        this.month +
        '月报表不能修改，且您上一次归档之后的修改将不会被保存。您确定现在就开始做下月考勤吗？',
        '新建' + parseInt(Number(this.month) + Number(1)) + '报表'
      )
        .then(async() => {
          // 构造当前月份的日期字符串，并转换为下一个月
          var atteTime = this.month.substring(0, 4) + '-' + this.month.substring(4)
          atteTime = this.getNextMonth(atteTime).datas.replace('-', '')
          // 设置请求参数，用于生成新报表
          this.requestParameters.yearMonth = atteTime
          // 发起请求生成新的考勤报表
          await newReports(this.requestParameters)
          // 提示用户报表创建成功，并跳转到考勤页面
          this.$message.success('新建报表成功！')
          this.$router.push('/attendances')
        })
    },
    /**
     * 获取给定日期的下一个月的日期字符串。
     *
     * @param {string} date - 以"年-月"格式表示的日期字符串。
     * @returns {Object} 返回一个对象，包含下一个月的日期字符串和月份数字。
     */
    getNextMonth: function(date) {
      // 将日期字符串按 "-" 分割成年和月
      var arr = date.split('-')
      // 提取年份
      var year = arr[0]
      // 提取月份
      var month = arr[1]
      // 初始化下一个月的年份为当前年份
      var year2 = year
      // 计算下一个月的月份，如果等于 13，则年份加 1，月份重置为 1
      var month2 = parseInt(month) + 1
      if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      // 如果下一个月的月份小于 10，则在其前添加"0"，以保持日期字符串的两位数月份格式
      if (month2 < 10) {
        month2 = '0' + month2
      }
      // 构造下一个月的日期字符串
      var datas = year2 + '-' + month2
      // 保存下一个月的月份数字
      var months = month2
      // 返回包含下一个月日期字符串和月份数字的对象
      return {
        datas: datas,
        months: months
      }
    },
    /**
     * 处理分页大小变化的事件。
     * 当用户更改了分页大小时，此方法用于更新请求参数并重新加载数据。
     * 如果当前页码是第一页，为了确保数据刷新，会直接调用加载数据的函数。
     * 这样做是因为，如果已经在第一页，更改页码没有意义，只需要更新每页显示的项数即可。
     *
     * @param {number} pageSize 用户选择的新分页大小。
     */
    handleSizeChange(pageSize) {
      // 更新请求参数中的 pageSize，以适应用户的新选择
      this.requestParameters.pagesize = pageSize
      // 检查当前是否在第一页，是的话则重新加载数据
      if (this.requestParameters.page === 1) {
        // 调用加载数据的函数，传入更新后的请求参数
        this.reportFormList(this.requestParameters)
      }
    },
    /**
     * 处理当前页码的变化
     *
     * 当用户通过分页控件改变当前页码时，此函数被调用。它的目的是更新请求的页码参数，并重新触发查询报告列表的操作。
     * 这样做是为了确保应用程序可以根据用户的导航行为动态更新显示的数据，保持数据的实时性和用户界面的响应性。
     *
     * @param {number} val 用户选择的当前页码值
     */
    handleCurrentChange(val) {
      // 更新请求参数中的页码为新选择的页码
      this.requestParameters.page = val
      // 触发重新获取报告列表的函数，以更新显示的数据
      this.reportFormList()
    },
    // 下载文件，导出考勤数据到 Excel
    handelFileDownload() {
      try {
        // import('@/vendor/Export2Excel').then(excel => {
        //   const tHeader = ['姓名', '工号', '手机号', '部门', '事假', '调休', '正常', '迟到次数', '早退次数', '日均时长', '旷工天数', '是否全勤', '实际出勤天数', '应出勤工作日', '计薪标准', '计薪天数'] // 表头 必填

        //   const filterVal = ['name', 'workNumber', 'mobile', 'department', 'leaveDays', 'dayOffLeaveDays', 'normalDays', 'laterTimes', 'earlyTimes', 'averageDailyNaturalDays', 'absenceDays', 'whetherItIsFullOfWork', 'actualAttendanceDaysAreOfficial', 'attendanceDay', 'salaryStandard', 'officialSalaryDays']
        //   const data = this.formatJson(filterVal, this.dataList)
        //   excel.export_json_to_excel({
        //     header: tHeader,
        //     data: data,
        //     filename: '人事报表',
        //     autoWidth: true,
        //     bookType: 'xlsx'
        //   })
        //   this.$message.success('导出报表成功！')
        // })
      } catch (error) {
        this.$message.error(error)
      }
    },
    /**
     * 格式化 JSON 数据。
     * 此函数接受两个数组作为参数，通过对第二个数组的每个元素应用第一个数组中的键，来提取出一个新的二维数组。
     * 这种方法适用于当你需要根据一组固定的键从多个对象中提取数据时。
     *
     * @param {Array} filterVal - 包含用于提取数据的键的数组。
     * @param {Array} jsonData - 包含要处理的对象的数组。
     * @returns {Array} - 返回一个新的二维数组，其中每个子数组包含根据 filterVal 中的键从对应 jsonData 对象中提取的数据。
     */
    formatJson(filterVal, jsonData) {
      // 使用 map 方法遍历 jsonData 数组。
      return jsonData.map(v => filterVal.map(j => {
        // 对于每个对象 v，使用 filterVal 中的键 j 来提取数据，并返回这个值。
        return v[j]
      }))
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.el-message-box--center .el-message-box__content p {
  text-align: left;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../../styles/variables.scss';

.butList {
  margin-top: 15px;
  text-align: center;
  background: #fff;

  span {
    display: inline-block;
    background: $green;
    color: #fff;
    padding: 8px 20px;
    border-radius: 3px;
    margin: 10px;
    cursor: pointer;
  }

  .cancel {
    background: #ccc;
    color: #666;
  }
}
</style>
