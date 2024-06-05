<template>
  <div class="monthStatementBox">
    <div class="monthStatementTop">
      <div class="title">
        <span>社保报表</span>
      </div>
    </div>
    <div class="monthStatementTable">
      <div class="itemDropDown">
        <div class="topLab">
          <div><span style="background-color:#cfeffe;" />已离职</div>
          <div><span style="background-color:#a8f8bb;" />再入职</div>
          <div><span style="background-color:#fedbd7;" />公司合计</div>
          <div><span style="background-color:#ffe8c9;" />一级部门</div>
          <div><span style="background-color:#fdfcd5;" />二级部门</div>
          <div class="rightLabBox">
            <el-button size="small" type="primary">导出</el-button>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="contentData"
          border
          empty-text="暂无数据"
          fit
          highlight-current-row
          style="width: 100%;text-align: center"
        >
          <el-table-column center label="序号" type="index" width="50" />
          <el-table-column label="姓名" prop="username" width="150px" />
          <el-table-column :formatter="transformDateFormat" label="入职时间" prop="timeOfEntry" width="150px" />
          <el-table-column label="手机号" prop="mobile" width="150px" />
          <el-table-column label="身份证号码" prop="idNumber" width="150px" />
          <el-table-column label="学历" prop="theHighestDegreeOfEducation" width="150px" />
          <el-table-column label="开户行" prop="bankCardNumber" width="150px" />
          <el-table-column label="一级部门" prop="firstLevelDepartment" width="150px" />
          <el-table-column label="二级部门" prop="twoLevelDepartment" width="150px" />
          <el-table-column label="工作城市" prop="workingCity" width="150px" />
          <el-table-column label="社保电脑号" prop="socialSecurityComputerNumber" width="150px" />
          <el-table-column label="公积金账号" prop="providentFundAccount" width="150px" />
          <el-table-column label="离职时间" prop="leaveDate" width="150px" />
          <el-table-column label="户籍类型" prop="householdRegistrationType" width="150px" />
          <el-table-column label="参保城市" prop="participatingInTheCity" width="150px" />
          <el-table-column label="社保月份" prop="socialSecurityMonth" width="150px" />
          <el-table-column label="社保基数" prop="socialSecurityBase" width="150px" />
          <el-table-column label="社保合计" prop="socialSecurity" width="150px" />
          <el-table-column label="社保企业" prop="socialSecurityEnterprise" width="150px" />
          <el-table-column label="社保个人" prop="socialSecurityIndividual" width="150px" />
          <el-table-column label="公积金城市" prop="providentFundCity" width="150px" />
          <el-table-column label="公积金月份" prop="providentFundMonth" width="150px" />
          <el-table-column label="公积金基数" prop="providentFundBase" width="150px" />
          <el-table-column label="公积金企业基数" prop="accumulationFundEnterpriseBase" width="150px" />
          <el-table-column
            label="公积金企业比例"
            prop="proportionOfProvidentFundEnterprises"
            width="150px"
          />
          <el-table-column label="公积金个人基数" prop="individualBaseOfProvidentFund" width="150px" />
          <el-table-column label="公积金个人比例" prop="personalRatioOfProvidentFund" width="150px" />
          <el-table-column label="公积金合计" prop="totalProvidentFund" width="150px" />
          <el-table-column label="公积金企业" prop="providentFundEnterprises" width="150px" />
          <el-table-column label="公积金个人" prop="providentFundIndividual" width="150px" />
          <el-table-column label="养老企业基数" prop="pensionEnterpriseBase" width="150px" />
          <el-table-column label="养老企业比例" prop="proportionOfPensionEnterprises" width="150px" />
          <el-table-column label="养老企业" prop="pensionEnterprise" width="150px" />
          <el-table-column label="养老个人基数" prop="personalPensionBase" width="150px" />
          <el-table-column label="养老个人比例" prop="personalPensionRatio" width="150px" />
          <el-table-column label="养老个人" prop="oldAgeIndividual" width="150px" />
          <el-table-column label="失业企业基数" prop="unemploymentEnterpriseBase" width="150px" />
          <el-table-column label="失业企业比例" prop="proportionOfUnemployedEnterprises" width="150px" />
          <el-table-column label="失业企业" prop="unemployedEnterprise" width="150px" />
          <el-table-column label="失业个人基数" prop="theNumberOfUnemployedIndividuals" width="150px" />
          <el-table-column label="失业个人比例" prop="percentageOfUnemployedIndividuals" width="150px" />
          <el-table-column label="失业个人" prop="unemployedIndividual" width="150px" />
          <el-table-column label="医疗企业基数" prop="medicalEnterpriseBase" width="150px" />
          <el-table-column label="医疗企业比例" prop="proportionOfMedicalEnterprises" width="150px" />
          <el-table-column label="医疗企业" prop="medicalEnterprise" width="150px" />
          <el-table-column label="医疗个人基数" prop="medicalPersonalBase" width="150px" />
          <el-table-column label="医疗个人比例" prop="medicalPersonalRatio" width="150px" />
          <el-table-column label="医疗个人" prop="medicalIndividual" width="150px" />
          <el-table-column label="工伤企业基数" prop="baseOfIndustrialInjuryEnterprises" width="150px" />
          <el-table-column
            label="工伤企业比例"
            prop="proportionOfIndustrialInjuryEnterprises"
            width="150px"
          />
          <el-table-column label="工伤企业" prop="industrialInjuryEnterprise" width="150px" />
          <el-table-column label="生育企业基数" prop="fertilityEnterpriseBase" width="150px" />
          <el-table-column label="生育企业比例" prop="proportionOfFertilityEnterprises" width="150px" />
          <el-table-column label="生育企业" prop="childbearingEnterprise" width="150px" />
          <el-table-column label="大病企业基数" prop="baseOfSeriousIllness" width="150px" />
          <el-table-column label="大病企业比例" prop="proportionOfSeriouslyIllEnterprises" width="150px" />
          <el-table-column label="大病企业" prop="bigDiseaseEnterprise" width="150px" />
          <el-table-column label="大病个人基数" prop="personalBaseOfSeriousIllness" width="150px" />
          <el-table-column label="大病个人比例" prop="personalProportionOfSeriousIllness" width="150px" />
          <el-table-column label="大病个人" prop="aPersonOfGreatDisease" width="150px" />
          <el-table-column label="公积金备注" prop="providentFundNotes" width="150px" />
          <el-table-column label="社保备注" prop="socialSecurityNotes" width="150px" />
        </el-table>
      </div>
    </div>
    <el-row align="middle" justify="center" style="height:60px" type="flex">
      <el-col :span="12">
        <el-button size="small" type="primary" @click="archivingReportForm">归档{{
          yearVal ? yearVal.substr(4) : ''
        }}报表
        </el-button>
        <el-button size="small" type="primary" @click="createReportForm">新建报表</el-button>
        <el-button size="small" @click="$router.back()">取消</el-button>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import { getArchivingCont, getArchivingArchive, newReport } from '@/api/social'

export default {
  name: 'HistoricalArchiving',
  data() {
    return {
      num: 0,
      yearVal: this.$route.query.yearMonth,
      contentData: [],
      loading: false
    }
  },
  created() {
    this.getArchivingCont()
  },
  methods: {
    async getArchivingCont() {
      this.loading = true
      this.contentData = await getArchivingCont({ month: this.yearVal, opType: 1 })
      this.loading = false
    },
    // 归档报表
    archivingReportForm() {
      this.$confirm(`您确定要归档${this.yearVal}报表？报表归档将覆盖上一次归档记录，无法恢复。`).then(async() => {
        await getArchivingArchive({ yearMonth: this.yearVal })
        this.$message({
          type: 'success',
          message: '确定!'
        })
      })
    },
    // 新建报表
    createReportForm() {
      const yearMonth = this.getNextMonth()
      const year = yearMonth.substring(0, 4)
      const month = yearMonth.substring(4)
      this.$confirm(
        '您将创建 《 ' + year + '年' + month + '月 》 报表'
      ).then(() => {
        this.yearMonth = yearMonth
        this.createNewReport(yearMonth)
        this.getArchivingCont()
      })
    },
    async createNewReport(yearMonth) {
      await newReport({ yearMonth })
      this.$message.success('操作成功')
    },
    getNextMonth() {
      const year = this.yearVal.substring(0, 4)
      const month = this.yearVal.slice(4)
      let year2 = year
      let month2 = parseInt(month) + 1
      if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      const t2 = year2 + month2
      return t2
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import './../../styles/variables.scss';

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

      div:last-child, div:first-child {
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
            // background:$cl-1;
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
