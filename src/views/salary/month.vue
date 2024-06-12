<template>
  <!-- 月度工资报表容器 -->
  <div class="monthStatementBox">
    <!-- 报表头部 -->
    <div class="monthStatementTop">
      <div class="title">
        <span> 工资报表 </span>
      </div>
    </div>
    <!-- 工资数据加载中提示 -->
    <div v-loading="loading" class="monthStatementTable">
      <!-- 下拉筛选区域 -->
      <div class="itemDropDown">
        <!-- 筛选按钮和导出按钮 -->
        <div class="topLab">
          <div />
          <div class="rightLabBox">
            <a
              class="el-button fr el-button--primary el-button--mini"
              title="导出"
              @click="handleExport()"
            > 导出 </a>
          </div>
        </div>
        <!-- 数据表格，展示工资详细信息 -->
        <el-table id="item" :data="contentData" border style="width: 100%;text-align: center">
          <!-- 表格列定义 -->
          <el-table-column center label="序号" type="index" width="50" />
          <el-table-column label="姓名" prop="username" width="150px" />
          <el-table-column label="手机号" prop="mobile" width="150px" />
          <el-table-column label="工号" prop="workNumber" width="150px" />
          <el-table-column label="部门名称" prop="departmentName" width="150px" />
          <el-table-column :formatter="inService" label="在职状态" prop="inServiceStatus" width="150px" />
          <el-table-column label="公积金个人" prop="providentFundIndividual" width="150px" />
          <el-table-column label="社保个人" prop="socialSecurityIndividual" width="150px" />
          <el-table-column label="社保企业" prop="socialSecurityEnterprise" width="150px" />
          <el-table-column label="公积金企业" prop="providentFundEnterprises" width="150px" />
          <el-table-column label="公积金社保企业" prop="socialSecurityProvidentFundEnterprises" width="150px" />
          <el-table-column label="基本工资" prop="currentBaseSalary" width="150px" />
          <el-table-column label="岗位工资" prop="currentBaseSalary" width="150px" />
          <el-table-column label="福利津贴" prop="salaryChangeAmount" width="150px" />
          <el-table-column label="考勤扣款" prop="attendanceDeductionMonthly" width="150px" />
          <el-table-column label="税前工资合计" prop="currentSalaryTotalBase" width="150px" />
          <el-table-column label="应纳税工资" prop="salaryByTax" width="150px" />
          <el-table-column label="应扣税" prop="tax" width="150px" />
          <el-table-column label="实发工资" prop="payment" width="150px" />
        </el-table>
      </div>
    </div>
    <!-- 操作按钮行，包括归档、新建和取消按钮 -->
    <el-row align="middle" justify="center" style="height:60px" type="flex">
      <el-col :span="12">
        <el-button size="small" type="primary" @click="archivingReportForm"> 归档 {{
          yearMonth ? yearMonth.substr(4) : ''
        }} 报表
        </el-button>
        <el-button size="small" type="primary" @click="createReportForm"> 新建报表 </el-button>
        <el-button size="small" @click="$router.back()"> 取消 </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getArchivingCont,
  newReport
} from '@/api/salary'

export default {
  name: 'HistoricalArchiving', // 组件名称
  data() {
    return {
      loading: false, // 控制加载状态
      num: 0, // 用于记录或展示的数字
      contentData: [], // 存储归档内容数据
      yearMonth: this.$route.query.yearMonth // 从路由中获取年月信息
    }
  },
  created() {
    this.getArchivingCont() // 组件创建时获取归档内容
  },
  methods: {
    /**
     * 根据员工状态判断其是否在职。
     * @param {Object} data - 员工数据对象。
     * @param {string} data.inServiceStatus - 员工的服务状态代码。
     * @returns {string} 返回员工的在职状态文本。
     *
     * 此函数用于解析员工数据中的服务状态代码，
     * 并根据代码值返回相应的在职或离职状态文本。
     * 代码值'1'表示员工在职，其他值表示离职。
     */
    inService(data) {
      // 判断员工状态
      return data.inServiceStatus === '1' ? '在职' : '离职'
    },
    /**
     * 异步获取归档内容。
     *
     * 此方法用于从服务器异步请求指定年份和月份的归档内容。它首先设置加载状态为 true，然后构造请求参数，
     * 发起请求后等待响应，一旦获取到数据，便更新归档内容，并关闭加载状态。
     *
     * @returns {void} 无返回值，但更新了组件内的状态。
     */
    async getArchivingCont() {
      // 设置加载状态为 true，显示加载中的指示器
      // 加载归档内容
      this.loading = true
      // 提取年份和月份作为请求参数
      const yearMonth = this.yearMonth
      // 发起异步请求获取归档内容，请求参数包括年份和月份
      this.contentData = await getArchivingCont({ yearMonth, opType: 1 })
      // 请求完成后，关闭加载状态
      this.loading = false
    },
    /**
     * 点击取消按钮时的处理函数。
     *
     * 该函数通过调用 Vue Router 的 back 方法，使浏览器返回上一页。使用负数作为参数，back 方法会向前返回多个页面，
     * 在这里设置为 -1，意味着返回上一个访问的页面。
     *
     * @see this.$router.back
     */
    clickCancel() {
      // 返回上一页
      this.$router.back(-1)
    },
    /**
     * 异步归档当前月份的报告。
     *
     * 此方法在用户确认归档当前月份的报告后触发。它首先通过弹出对话框确认操作，然后模拟归档过程，
     * 最后显示归档成功的消息。这个方法主要用于演示如何处理异步操作和用户确认。
     *
     * @remarks
     *   注意，这个方法中的实际归档逻辑是模拟的，并没有实现真正的数据归档功能。
     */
    async archivingReport() {
      // 显示确认对话框，提示用户归档将覆盖之前的记录且无法恢复
      const msg = '您确认归档当月报表吗？(报表归档将覆盖上一次归档记录，无法恢复)'
      this.$confirm(msg, '归档' + this.yearMonth + '报表')
        .then(() => {
          // 用户确认归档后，显示归档成功的消息
          this.$message.success('success')
        })
    },
    /**
     * 弹窗确认归档当前月份的报表。
     *
     * 此函数通过弹出一个确认对话框，询问用户是否确认归档当前月份的报表。
     * 如果用户确认，将发送归档请求，并在成功归档后显示成功消息。
     * 主要用于在进行不可逆操作前增加用户的确认步骤，避免误操作。
     */
    archivingReportForm() {
      this.$confirm('您确认归档当月报表吗？')
        .then(async() => {
          // 此处注释说明了原本应进行的操作，即发送归档请求，但实际代码中被注释掉了。
          // await getArchivingArchive({yearMonth: this.yearMonth})
          this.$message.success('归档成功')
        })
    },
    /**
     * 创建报表的函数。
     * 该函数首先计算下一个月的年月字符串，然后通过对话框确认创建当前年月的报表。
     * 如果用户确认，它将设置年月信息，调用创建新报表的函数，并显示成功消息。
     */
    createReportForm() {
      // 获取下一个月的年月字符串
      const yearMonth = this.getNextMonth()
      // 提取年份和月份
      const year = yearMonth.substring(0, 4)
      const month = yearMonth.substring(4)
      // 显示确认对话框，询问用户是否创建当前年月的报表
      this.$confirm(
        '您将创建 《 ' + year + '年' + month + '月 》 报表').then(() => {
        // 设置年月信息，用于后续的报表创建
        this.yearMonth = yearMonth
        // 调用创建新报表的函数
        this.createNewReport(this.yearMonth)
        // 显示成功消息，告知用户报表创建成功
        this.$message.success('新建报表成功')
        // 加载归档内容，以便用户可以查看已创建的报表
        this.getArchivingCont()
      })
    },
    /**
     * 异步创建新的报告。
     *
     * 此函数用于根据指定的年份和月份异步创建一个新的报告。它利用了 `newReport` 异步操作，
     * 对外暴露了一个简洁的接口，以供其他部分的代码调用，无需关心报告的具体创建细节。
     *
     * @param {string} yearMonth - 以"年份-月份"格式表示的日期。
     * @async
     */
    async createNewReport(yearMonth) {
      // 创建新报表
      await newReport({ yearMonth })
    },
    /**
     * 获取当前年月的下一个月的年月字符串。
     *
     * 本函数用于根据当前选定的年月，计算并返回下一个月的年月字符串。
     * 年月字符串的格式为 YYYYMM，其中 MM 为两位数的月份。
     * 如果当前月份是 12 月，则下一个月为次年的 1 月，年份相应加 1。
     *
     * @returns {string} 返回下一个月的年月字符串，格式为 YYYYMM。
     */
    getNextMonth() {
      // 从年月字符串中提取年份和月份
      // 计算下一个月的年月
      const year = this.yearMonth.substring(0, 4)
      const month = this.yearMonth.slice(4)

      // 初始化下一个月的年份和月份
      let year2 = year
      let month2 = parseInt(month) + 1

      // 如果下一个月是 13 月，则重置为次年的 1 月
      if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }

      // 如果下一个月的月份小于 10，则在前面补 0
      if (month2 < 10) {
        month2 = '0' + month2
      }

      // 组合下一个月的年月字符串
      const t2 = year2 + month2

      // 返回下一个月的年月字符串
      return t2
    },
    handleExport() {
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./../../styles/variables.scss";

.monthStatementBox {
  padding: 20px;

  .monthStatementTop {
    position: relative;
    background: #fff;
    padding: 10px 15px 0 15px;
    border-bottom: solid 1px #f4f4f4;

    .title {
      color: $blue;
      line-height: 40px;
      border-bottom: solid 2px $blue;
      font-size: 18px;
      font-weight: bold;
      display: inline-block;
      padding: 0 25px;

      .yearChange {
        position: absolute;
        top: 5px;
        right: 10px;
      }
    }
  }

  .monthStatementTable {
    background: #fff;

    .itemTopLab {
      border-top: solid 1px #f0f0f0;
      border-bottom: solid 3px #ccc;
      padding: 15px;

      div {
        display: inline-block;
        padding: 0 50px;
        border-right: solid 1px #ccc;
      }

      div:last-child,
      div:first-child {
        border: none;
      }

      .lab {
        position: relative;
        top: -15px;
        padding-right: 0;
        padding-left: 15px;
      }

      .labTit {
        cursor: pointer;
      }

      .title {
        font-size: 16px;
        margin: 10px 0;

        span {
          position: relative;
          bottom: -2px;
          font-size: 13px;
          color: #999;
          margin-left: 5px;
        }
      }

      .itemTit {
        color: #999;
        margin: 8px 0;
        font-size: 13px;
      }

      .itemNum {
        font-size: 20px;
        margin: 0;
      }
    }

    .itemDropDown {
      background: #fff;

      .topLab {
        position: relative;
        padding: 15px;

        div {
          display: inline-block;
          margin: 0 10px;

          span {
            display: inline-block;
            position: relative;
            top: 2px;
            margin-right: 5px;
            width: 15px;
            height: 15px;
            background: $cl-1;
          }
        }

        .rightLabBox {
          position: absolute;
          right: -10px;
          top: 10px;

          div {
            border: solid 1px $green;
            color: $green;
            border-radius: 3px;
            padding: 4px 10px;
            font-size: 14px;
          }
        }
      }

      .act {
        border-bottom: solid 3px $panGreen;

        .lab {
          color: $panGreen;
        }

        .labTit {
          color: $panGreen;
        }
      }
    }

    .itemes:hover {
      background: #fafbff;
    }

    .itemes .lab:hover {
      cursor: pointer;
    }
  }

  .butList {
    border-top: solid 1px #f4f4f4;
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
}
</style>
