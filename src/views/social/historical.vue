<template>
  <div class="historicalArcBox">
    <div class="historicalArcTop">
      <div class="title">
        <span>全公司</span>
        <div class="yearChange">
          <el-date-picker
            v-model="yearVal"
            placeholder="选择年"
            size="mini"
            type="year"
            value-format="yyyy"
            width="130px"
            @change="changeYear"
          />
        </div>
      </div>
    </div>
    <div v-loading="loading" class="historicalTable">
      <div v-for="( itemes, index) in tableData" :key="index" class="itemes">
        <div :class="{act: itemes.act}" class="itemTopLab">
          <div class="lab" @click="openTable(itemes,index)"> ></div>
          <div>
            <p class="title">{{ itemes.month }}社保报表 <span>{{ itemes.creationTime }}</span></p>
            <p class="labTit" @click="openTable(itemes,index)">社保报表</p>
          </div>
          <div>
            <p class="itemTit"><span>企业缴纳</span></p>
            <p class="itemNum">{{ itemes.enterprisePayment }}</p>
          </div>
          <div>
            <p class="itemTit"><span>个人缴纳</span></p>
            <p class="itemNum">{{ itemes.personalPayment }}</p>
          </div>
          <div>
            <p class="itemTit"><span>合计</span></p>
            <p class="itemNum">{{ itemes.total }}</p>
          </div>
        </div>
        <div v-show="itemes.act" class="itemDropDown">
          <div class="topLab">
            <div><span style="background-color:#cfeffe;" />已离职</div>
            <div><span style="background-color:#a8f8bb;" />再入职</div>
            <div><span style="background-color:#fedbd7;" />公司合计</div>
            <div><span style="background-color:#ffe8c9;" />一级部门</div>
            <div><span style="background-color:#fdfcd5;" />二级部门</div>
            <div class="rightLabBox">
              <a href="/"><i class="el-icon-search" /></a>
              <a href="/">
                <div>导出</div>
              </a>
            </div>
          </div>
          <el-table
            id="item"
            :data="itemes.contentData"
            border
            height="300"
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
            <el-table-column
              label="大病企业比例"
              prop="proportionOfSeriouslyIllEnterprises"
              width="150px"
            />
            <el-table-column label="大病企业" prop="bigDiseaseEnterprise" width="150px" />
            <el-table-column label="大病个人基数" prop="personalBaseOfSeriousIllness" width="150px" />
            <el-table-column label="大病个人比例" prop="personalProportionOfSeriousIllness" width="150px" />
            <el-table-column label="大病个人" prop="aPersonOfGreatDisease" width="150px" />
            <el-table-column label="公积金备注" prop="providentFundNotes" width="150px" />
            <el-table-column label="社保备注" prop="socialSecurityNotes" width="150px" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArchivingList, getArchivingCont } from '@/api/social'

export default {
  name: 'HistoricalArchiving',
  data() {
    return {
      loading: false,
      num: 0,
      yearVal: '2020',
      tableData: []
    }
  },
  mounted() {
    this.getArchivingList()
  },
  methods: {
    async getArchivingList() {
      this.loading = true
      this.tableData = await getArchivingList({ year: this.yearVal })
      this.loading = false
    },
    async openTable(obj, index) {
      if (!obj.act) {
        const data = await getArchivingCont({ month: obj.yearsMonth, year: this.yearVal, opType: 2 })
        this.$set(this.tableData[index], 'contentData', data)
        this.loading = false
        this.$set(this.tableData[index], 'act', true)
      } else {
        this.$set(this.tableData[index], 'act', false)
      }
    },

    changeYear() {
      this.getArchivingList()
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import './../../styles/variables.scss';

.historicalArcBox {
  padding: 20px;

  .historicalArcTop {
    position: relative;
    background: #fff;
    padding: 10px 15px 0 15px;

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

  .historicalTable {
    background: #fff;

    .itemes {
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
}
</style>
