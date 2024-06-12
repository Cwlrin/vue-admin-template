<template>
  <!-- 员工详情和薪酬信息容器 -->
  <div class="detailsContainer">
    <!-- 左侧内容区域 -->
    <div class="contLeft">
      <!-- 员工基本信息区块 -->
      <div class="topTit">
        <!-- 员工头像 -->
        <img alt="" src="@/assets/common/img.jpeg">
        <!-- 员工信息 -->
        <div class="info">
          <!-- 姓名和职位状态 -->
          <p class="name"><strong> {{ user.username }} </strong><span :class="dutyStatus">{{ dutyStatusTxt }}</span></p>
          <!-- 入职时间和最新工资 -->
          <p class="time"> 入职时间: {{ user.timeOfEntry | formatDate }} 最新工资：
            {{ formLabelAlign.currentPostWage + formLabelAlign.currentBasicSalary }}
            <!-- 工资详情说明 -->
            <ul><span class="more">?</span>
              <li> 员工所有调薪后的基本工资、岗位工资合计 </li>
            </ul>
          </p>
          <!-- 当月基本工资和岗位工资 -->
          <p> 当月基本工资 / 当月岗位工资: {{ formLabelAlign.currentBasicSalary }} / {{
            formLabelAlign.currentPostWage
          }}</p>
        </div>
      </div>
      <!-- 津贴、社保公积金和考勤信息区块 -->
      <div>
        <!-- 津贴区块 -->
        <div class="social">
          <div class="title"><strong> 津贴 </strong></div>
          <!-- 津贴表格 -->
          <div class="table">
            <div class="tabTit">
              <!-- 表头 -->
              <div> 津贴类型 </div>
              <div> 补贴金额 </div>
              <div> 津贴类型 </div>
              <div> 补贴金额 </div>
            </div>
            <!-- 津贴项 -->
            <div class="tabRow">
              <div> 交通补助 </div>
              <div> {{ paymentData.p2 }}</div>
              <div> 通讯补助 </div>
              <div> {{ paymentData.p3 }}</div>
            </div>
            <div class="tabRow">
              <div> 午餐补助 </div>
              <div> {{ paymentData.p4 }}</div>
              <div> 住房补助 </div>
              <div> {{ paymentData.p1 }}</div>
            </div>
          </div>
        </div>
        <!-- 社保公积金区块 -->
        <div class="fund">
          <div class="title"><strong> 社保公积金 </strong>
            <!-- 社保公积金总额 -->
            <span> 企业 {{ socialData.socialSecurityEnterprise + socialData.providentFundEnterprises }}</span> <span> 个人 {{
              socialData.socialSecurityIndividual + socialData.providentFundIndividual
            }}</span></div>
          <!-- 社保公积金表格 -->
          <div class="table">
            <div class="tabTit">
              <!-- 表头 -->
              <div> 缴费项目 </div>
              <div> 基数 </div>
              <div> 企业缴纳 </div>
              <div> 个人缴纳 </div>
            </div>
            <!-- 社保和公积金项 -->
            <div class="tabRow">
              <div> 社保 </div>
              <div> {{ socialData.socialSecurityBase }}</div>
              <div>{{ socialData.socialSecurityEnterprise }}</div>
              <div> {{ socialData.socialSecurityIndividual }}</div>
            </div>
            <div class="tabRow">
              <div> 公积金 </div>
              <div> {{ socialData.providentFundBase }}</div>
              <div>{{ socialData.providentFundEnterprises }}</div>
              <div> {{ socialData.providentFundIndividual }}</div>
            </div>
            <!-- 合计 -->
            <div class="tabRow">
              <div> 缴费合计 </div>
              <div />
              <div>{{ socialData.socialSecurityEnterprise + socialData.providentFundEnterprises }}</div>
              <div> {{ socialData.socialSecurityIndividual + socialData.providentFundIndividual }}</div>
            </div>
          </div>
        </div>
        <!-- 考勤信息区块 -->
        <div class="formTable">
          <!-- 考勤表格 -->
          <el-form :label-position="'left'" :model="formLabelAlign" label-width="180px">
            <!-- 实际出勤天数和计薪天数 -->
            <el-form-item label="实际出勤天数（正式）：" style="width: 50%;">
              <el-input v-model="atteData.actualAtteOfficialDays" :disabled="true" placeholder="0" />
            </el-form-item>
            <el-form-item label="计薪天数（正式）：" style="width: 50%;">
              <el-input v-model="atteData.workingDays" :disabled="true" placeholder="0" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 右侧内容区域：招聘日程 -->
    <div class="contRit">
      <div class="topTit"><strong> 招聘日程 </strong></div>
      <!-- 招聘日程列表 -->
      <div class="Items">
        <li>
          <!-- 招聘详情 -->
          <div class="name"><p>HR 专员 </p>
            <p>2018-12-3 3:30</p></div>
          <!-- 操作：放弃 -->
          <div class="act"><strong> 放弃 </strong></div>
        </li>
        <li>
          <div class="name"><p>HR 专员 </p>
            <p>2018-12-3 3:30</p></div>
          <div class="act"><strong> 放弃 </strong></div>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import { getSalaryDetail, getSettings } from '@/api/salary'
import { getUserDetailById } from '@/api/user'
import { getHistorysData } from '@/api/social'
import { getAtteArchiveDetail } from '@/api/attendance'
import { formatDate } from 'element-ui/src/utils/date-util'

export default {
  name: 'UsersTableIndex',
  data() {
    return {
      // 用户信息
      user: {},
      // 社保数据
      socialData: {},
      // 考勤数据
      atteData: {},
      // 工资构成数据
      paymentData: {
        p1: 0,
        p2: 0,
        p3: 0,
        p4: 0
      },
      // 用户 ID
      userId: this.$route.params.id,
      // 年月
      yearMonth: this.$route.params.yearMonth,
      // 表单标签对齐方式
      formLabelAlign: {}
    }
  },
  computed: {
    /**
     * 计算公司社保和公积金总和。
     *
     * 该方法用于根据公司承担的社会保险和公积金基数，计算出这两项的总和。
     * 仅当基数不为 null 时，才会进行计算并累加到总和中。
     * 返回计算得到的社保和公积金总和。
     */
    // 计算公司社保总和
    computeCompanyTotal() {
      // 初始化社会保险和公积金的总和为 0
      let social = 0
      let provident = 0
      // 如果社会保险基数不为 null，则将其转换为数字并累加到 social 中
      if (this.formLabelAlign.socialSecurityCompanyBase != null) {
        social = Number(this.formLabelAlign.socialSecurityCompanyBase)
      }
      // 如果公积金基数不为 null，则将其转换为数字并累加到 provident 中
      if (this.formLabelAlign.providentFundCompanyBase != null) {
        provident = Number(this.formLabelAlign.providentFundCompanyBase)
      }
      // 返回社保和公积金的总和
      return social + provident
    },
    /**
     * 计算个人社保和公积金的总和。
     *
     * 此函数用于根据员工的社保和个人公积金基数，计算出个人需要缴纳的社保和公积金的总金额。
     * 社保和公积金的基数可能为空，因此函数会先检查基数是否存在，然后进行计算。
     * 如果基数不存在，则对应的部分金额为 0。
     *
     * @returns {number} 返回个人社保和公积金的总和。
     */
    computePersonalTotal() {
      // 初始化社保和个人公积金的金额为 0
      let social = 0
      let provident = 0
      // 如果社保个人基数不为空，则使用公司基数作为社保金额
      if (this.formLabelAlign.socialSecurityPersonalBase != null) {
        social = Number(this.formLabelAlign.socialSecurityCompanyBase)
      }
      // 如果公积金个人基数不为空，则使用公司基数作为公积金金额
      if (this.formLabelAlign.providentFundCompanyBase != null) {
        provident = Number(this.formLabelAlign.providentFundPersonalBase)
      }
      // 返回社保和公积金的总和
      return social + provident
    },
    /**
     * 根据用户的服务状态确定其是否在职。
     *
     * 此方法用于根据用户对象中的服务状态属性（inServiceStatus）的值，
     * 确定用户是处于在职状态还是离职状态。如果 inServiceStatus 的值为 1，
     * 则返回字符串"在职"；否则，返回字符串"离职"。
     *
     * @returns {string} 用户的服务状态文本， either "在职" or "离职"。
     */
    // 根据用户状态返回在职或离职文本
    dutyStatusTxt() {
      return this.user.inServiceStatus === 1 ? '在职' : '离职'
    },
    /**
     * 根据用户的服役状态确定其职状态的显示颜色。
     *
     * 该方法用于根据用户对象中的服役状态属性（inServiceStatus）的值，
     * 返回一个相应的 CSS 类名，以控制显示用户职状态的颜色。如果用户处于服役状态，
     * 则返回'job-txt-green'类名；如果用户已离职，则返回'job-txt-red'类名。
     * 这种方法的应用在于视觉上区分用户的服役状态，提供一种直观的展示方式。
     *
     * @returns {string} 返回一个表示用户职状态的 CSS 类名。
     */
    dutyStatus() {
      // 根据用户服役状态决定返回的类名
      return this.user.inServiceStatus === 1 ? 'job-txt-green' : 'job-txt-red'
    }
  },
  created() {
    this.init()
  },
  methods: {
    formatDate,
    // 初始化数据
    init() {
      // 获取考勤详细信息
      getAtteArchiveDetail({ userId: this.userId, yearMonth: this.yearMonth }).then(res => {
        this.atteData = res || {}
        // 获取设置信息
        return getSettings()
      }).then(res => {
        // 根据考勤天数和设置计算各项补贴金额
        this.paymentData.p1 = this.calMoney(res.housingSubsidyScheme, res.housingSubsidyAmount, this.atteData.actualAtteOfficialDays)
        this.paymentData.p2 = this.calMoney(res.transportationSubsidyScheme, res.transportationSubsidyAmount, this.atteData.actualAtteOfficialDays)
        this.paymentData.p3 = this.calMoney(res.communicationSubsidyScheme, res.communicationSubsidyAmount, this.atteData.actualAtteOfficialDays)
        this.paymentData.p4 = this.calMoney(res.lunchAllowanceScheme, res.lunchAllowanceAmount, this.atteData.actualAtteOfficialDays)
      })
      // 获取用户详细信息
      this.getUserDetailById()
      // 获取工资详情
      this.getSalaryDetail()
      // 获取社保历史数据
      this.getHistorysData()
    },
    // 异步获取用户工资详情
    // 通过此方法，可以从服务器端获取指定用户的工资详细信息。此方法是异步的，意味着它会在后台执行而不会阻塞其他代码的执行。
    // 获取工资详情
    async getSalaryDetail() {
      // 设置表单标签的对齐方式，等待异步函数 getSalaryDetail 返回结果
      this.formLabelAlign = await getSalaryDetail(this.userId)
    },
    /**
     * 异步获取社保历史数据
     *
     * 本函数通过调用 getHistorysData 异步接口，传入当前用户的 ID 和指定的年份月份，
     * 来获取该用户的社保历史记录。使用 await 确保接口调用成功后才继续执行后续代码。
     * 主要用于在前端展示用户的社保信息，或进行相关业务逻辑处理。
     *
     * @returns {void} 本函数无返回值，但会将获取到的数据赋值给 this.socialData
     */
    async getHistorysData() {
      this.socialData = await getHistorysData({ userId: this.userId, yearMonth: this.yearMonth })
    },
    /**
     * 异步获取指定用户 ID 的详细信息。
     *
     * 此方法通过调用 getUserDetailById 函数，传入当前实例的 userId 属性作为参数，
     * 来获取用户的详细信息。它利用了 async/await 语法来处理异步操作，
     * 确保在获取用户信息的过程中，代码的执行流程不会被中断，提高了用户体验。
     *
     * @returns {void} 无返回值，但会将获取的用户详细信息赋值给 this.user。
     */
    async getUserDetailById() {
      this.user = await getUserDetailById(this.userId)
    },
    /**
     * 根据补贴类型计算实际补贴金额。
     *
     * 此函数用于根据不同的补贴类型（1: 按天补贴, 3: 固定金额补贴）计算员工的实际补贴金额。
     * 如果补贴类型为 1，那么实际补贴金额为补贴金额乘以考勤天数；
     * 如果补贴类型为 3，直接返回补贴金额；
     * 其他情况下，返回 0 表示没有补贴。
     *
     * @param {number} type - 补贴类型。1 表示按天补贴，3 表示固定金额补贴。
     * @param {number} money - 补贴金额。
     * @param {number} days - 考勤天数，仅在按天补贴时使用。
     * @returns {number} 实际补贴金额。
     */
    calMoney(type, money, days) {
      if (type === 3) {
        return money
      }
      if (type === 1) {
        return money * days
      }
      return 0
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./../../styles/variables";

.detailsContainer {
  display: flex;
  padding: 15px;

  .contLeft {
    flex: 4;
    background: #fff;
    margin-right: 10px;
    padding: 20px;

    .topTit {
      display: flex;
      padding-bottom: 10px;

      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }

      .more {
        display: inline-block;
        position: relative;
        text-align: center;
        width: 16px;
        line-height: 14px;
        font-size: 12px;
        top: -1px;
        left: 5px;
        border: solid 1px #666;
        color: #666;
        border-radius: 50px;
      }

      .info {
        margin-left: 10px;
        line-height: 25px;

        .name {
          span {
            // background: $green1;
            color: #fff;
            padding: 4px 10px;
            border-radius: 3px;
            margin-left: 10px;
            font-size: 12px;
          }
        }

        .time {
          ul {
            position: relative;
            display: inline-block;

            li {
              position: absolute;
              border-radius: 3px;
              box-shadow: 1px 2px 2px #ccc;
              top: 34px;
              left: -43px;
              width: 500px;
              padding: 5px 10px;
              line-height: 20px;
              display: none;
              background: #fff;
              border: solid 1px #ccc;
            }

            li::before {
              position: absolute;
              content: '∧';
              left: 50px;
              top: -15px;
              background: #fff;
              color: #ccc;
            }
          }

          ul:hover li {
            display: block;
          }
        }
      }
    }

    .social {
      padding-bottom: 10px;

      .title {
        line-height: 40px;
      }

      .table {
        display: table;
        background: #f9f9f9;
        padding: 20px;
        line-height: 30px;
        width: 100%;
        text-align: center;

        .tabTit {
          display: table-row;
          font-weight: bold;

          div {
            display: table-cell;
          }
        }

        .tabRow {
          display: table-row;
          width: 100%;

          div {
            display: table-cell;
          }
        }
      }
    }

    .fund {
      padding-bottom: 10px;

      .title {
        line-height: 40px;

        span {
          display: inline-block;
          padding: 0 80px;
        }
      }

      .table {
        display: table;
        background: #f9f9f9;
        padding: 20px;
        line-height: 30px;
        width: 100%;
        text-align: center;

        .tabTit {
          display: table-row;
          font-weight: bold;

          div {
            display: table-cell;
          }
        }

        .tabRow {
          display: table-row;
          width: 100%;

          div {
            display: table-cell;
          }
        }
      }
    }

    .formTable {
      margin-top: 20px;
    }
  }

  .contRit {
    flex: 1;
    background: #fff;
    padding: 0 20px;

    .topTit {
      margin-bottom: 10px;
      border-bottom: solid 1px #ccc;
      line-height: 40px;
    }

    .Items {
      padding: 20px 0;

      li {
        display: flex;

        .name {
          position: relative;
          text-align: center;
          line-height: 24px;
          padding: 0 0 10px 0;
          flex: 2;
          border-right: solid 1px #ccc;
        }

        .name:after {
          content: ' ';
          border-radius: 50%;
          position: absolute;
          width: 10px;
          height: 10px;
          border: solid 2px $green1;
          right: -5px;
          top: 0px;
          background: #fff;
        }

        .act {
          flex: 1;
          text-align: center;
        }
      }
    }
  }
}

.job-txt-green, .job-txt-red {
  // display: inline-block;
  position: relative;
  padding: 3px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
}

.job-txt-green {
  background: #67c23a;
}

.job-txt-red {
  background: #f56c6c;
}
</style>
