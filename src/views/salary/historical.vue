<template>
  <!-- 历史社保公积金盒 -->
  <div class="historicalArcBox">
    <!-- 顶部区域，包含年份选择 -->
    <div class="historicalArcTop">
      <div class="title">
        <!-- 全公司标题 -->
        <span> 全公司 </span>
        <!-- 年份选择器 -->
        <div class="yearChange">
          <el-date-picker v-model="yearVal" placeholder="选择年" size="mini" type="year" width="130px" />
        </div>
      </div>
    </div>
    <!-- 表格区域，展示详细数据 -->
    <div class="historicalTable">
      <!-- 遍历每个社保公积金条目 -->
      <div v-for="(itemes, index) in tableData" :key="index" class="itemes">
        <!-- 条目顶部标签，包含操作和基本信息 -->
        <div :class="{act: itemes.act}" class="itemTopLab">
          <!-- 点击展开详细信息 -->
          <div class="lab" @click="openTable(itemes,index)"> ></div>
          <!-- 标题和创建时间 -->
          <div>
            <p class="title">{{ itemes.month }} 社保报表 <span>{{ itemes.creationTime }}</span></p>
            <!-- 点击展开详细信息的标签 -->
            <p class="labTit" @click="openTable(itemes,index)"> 社保报表 </p>
          </div>
          <!-- 企业缴纳、个人缴纳和合计信息 -->
          <div>
            <p class="itemTit"><span> 企业缴纳 </span></p>
            <p class="itemNum">{{ itemes.enterprisePayment }}</p>
          </div>
          <div>
            <p class="itemTit"><span> 个人缴纳 </span></p>
            <p class="itemNum">{{ itemes.personalPayment }}</p>
          </div>
          <div>
            <p class="itemTit"><span> 合计 </span></p>
            <p class="itemNum">{{ itemes.total }}</p>
          </div>
        </div>
        <!-- 展开的详细信息区域 -->
        <div v-show="itemes.act" class="itemDropDown">
          <!-- 详细信息的顶部标签，包含各种分类和操作 -->
          <div class="topLab">
            <!-- 不同状态的人员分类 -->
            <div><span style="background-color:#cfeffe;" /> 已离职 </div>
            <div><span style="background-color:#a8f8bb;" /> 再入职 </div>
            <div><span style="background-color:#fedbd7;" /> 公司合计 </div>
            <div><span style="background-color:#ffe8c9;" /> 一级部门 </div>
            <div><span style="background-color:#fdfcd5;" /> 二级部门 </div>
            <!-- 搜索和导出功能按钮 -->
            <div class="rightLabBox">
              <a href="/"><i class="el-icon-search" /></a>
              <a href="/">
                <div> 导出 </div>
              </a>
            </div>
          </div>
          <!-- 数据表格，展示详细人员信息 -->
          <el-table :data="itemes.contentData" border height="300" style="width: 100%;text-align: center">
            <!-- 表格列定义 -->
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
      // 初始化计数器
      num: 0,
      // 初始化年份选择值
      yearVal: '2018',
      // 初始化表格数据数组
      tableData: []
    }
  },
  created() {
    // 组件创建后立即加载归档列表数据
    this.getArchivingList()
  },
  methods: {
    /**
     * 异步加载归档列表数据
     *
     * 此函数用于从服务器获取归档列表的数据，并更新 UI 显示的列表内容。
     * 它首先设置加载状态为 true，以指示用户界面即将更新数据。
     * 然后，它调用 getArchivingList API 来获取数据，并等待 API 的响应。
     * 在接收到响应后，它提取出数据部分，并将其赋值给 tableData 属性，这将触发 UI 的更新。
     * 最后，它将加载状态设置为 false，表示数据加载完成。
     */
    async getArchivingList() {
      this.loading = true
      // 调用 API 获取归档列表
      const { data } = await getArchivingList({})
      // 更新表格数据
      this.tableData = data.items
      this.loading = false
    },
    /**
     * 打开或关闭详细内容表格
     * @param {Object} obj 表格行数据对象
     * @param {Number} index 表格行索引
     */
    async openTable(obj, index) {
      if (!obj.act) {
        this.loading = true
        // 根据月份获取详细内容
        const { data } = await getArchivingCont({ month: obj.month })
        // 更新表格行的详细内容数据
        this.$set(this.tableData[index], 'contentData', data.items)
        this.loading = false
        // 标记该行已加载详细内容
        this.$set(this.tableData[index], 'act', true)
      } else {
        // 关闭详细内容，清除内容数据
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
