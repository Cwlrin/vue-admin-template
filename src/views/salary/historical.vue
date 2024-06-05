<template>
  <div class="historicalArcBox">
    <div class="historicalArcTop">
      <div class="title">
        <span>全公司</span>
        <div class="yearChange">
          <el-date-picker v-model="yearVal" placeholder="选择年" size="mini" type="year" width="130px" />
        </div>
      </div>
    </div>
    <div class="historicalTable">
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
          <el-table :data="itemes.contentData" border height="300" style="width: 100%;text-align: center">
            <el-table-column center fixed label="序号" type="index" width="50" />
            <el-table-column label="姓名" prop="fullName" width="150px" />
            <el-table-column label="入职时间" prop="dateOfEntry" width="150px" />
            <el-table-column label="手机号" prop="cellPhoneNumber" width="150px" />
            <el-table-column label="身份证号码" prop="iDNumber" width="150px" />
            <el-table-column label="银行卡号" prop="bankCardNumber" width="150px" />
            <el-table-column label="一级部门" prop="firstLevelDepartment" width="150px" />
            <el-table-column label="二级部门" prop="twoLevelDepartment" width="150px" />
            <el-table-column label="工作城市" prop="twoLevelDepartment" width="150px" />
            <el-table-column label="社保电脑号" prop="twoLevelDepartment" width="150px" />
            <el-table-column label="公积金账号" prop="twoLevelDepartment" width="150px" />
            <el-table-column label="离职日期" prop="twoLevelDepartment" width="150px" />
            <el-table-column label="户籍类型" prop="twoLevelDepartment" width="150px" />
            <el-table-column label="参保城市" prop="twoLevelDepartment" width="150px" />
            <el-table-column label="社保月份" prop="twoLevelDepartment" width="150px" />
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
      num: 0,
      yearVal: '2018',
      tableData: []
    }
  },
  created() {
    this.getArchivingList()
  },
  methods: {
    async getArchivingList() {
      this.loading = true
      const { data } = await getArchivingList({})
      this.tableData = data.items
      this.loading = false
    },
    async openTable(obj, index) {
      if (!obj.act) {
        this.loading = true
        const { data } = await getArchivingCont({ month: obj.month })
        this.$set(this.tableData[index], 'contentData', data.items)
        this.loading = false
        this.$set(this.tableData[index], 'act', true)
      } else {
        this.$set(this.tableData[index], 'act', false)
      }
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
      color: $panGreen;
      line-height: 40px;
      border-bottom: solid 2px $panGreen;
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
