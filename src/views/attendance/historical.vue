<template>
  <!-- 员工历史归档组件 -->
  <div class="historicalArcBox">
    <!-- 顶部区域，包含年份选择器 -->
    <div class="historicalArcTop">
      <div class="title">
        <!-- 标题 -->
        <span> 员工历史归档 </span>
        <!-- 年份选择器 -->
        <div class="yearChange">
          <el-date-picker
            v-model="yearVal"
            format="yyyy"
            placeholder="选择年"
            type="year"
            value-format="yyyy"
            width="130px"
            @change="handleChangeYear"
          />
        </div>
      </div>
    </div>
    <!-- 数据展示区域，使用 Loading 效果 -->
    <div v-loading="loading" class="historicalTable">
      <!-- 当年份无归档数据时的提示 -->
      <div v-show="showArchivig" class="archivig"> 该年份无归档报表 </div>
      <!-- 遍历展示每个月的归档数据 -->
      <div v-for="(itemes, index) in tableData" :key="index" class="itemes">
        <!-- 每个月的统计数据项 -->
        <div :class="{act: itemes.act}" class="itemTopLab">
          <!-- 展开按钮 -->
          <div class="lab" @click="openTable(itemes,index)">
            >
          </div>
          <!-- 标题和考勤统计标签 -->
          <div>
            <p ref="sheelName" class="title">{{ itemes.archiveYear }}-{{ itemes.archiveMonth }} 月员工报表 </p>
            <p class="labTit" @click="openTable(itemes,index)"> 考勤统计 </p>
          </div>
          <!-- 总人数和全勤人数统计 -->
          <div class="fr">
            <div>
              <p class="itemTit">
                <span> 总人数 </span>
              </p>
              <p class="itemNum">{{ itemes.totalPeopleNum }}</p>
            </div>
            <div>
              <p class="itemTit">
                <span> 全勤人数 </span>
              </p>
              <p class="itemNum">{{ itemes.fullAttePeopleNum }}</p>
            </div>
          </div>
        </div>
        <!-- 展开的详细数据区域 -->
        <div v-show="itemes.act" class="itemDropDown">
          <!-- 警告提示，说明统计单位 -->
          <el-alert
            :closable="false"
            show-icon
            title="迟到、早退和补签的统计单位为“次”；所有假期类型、外出、旷工的统计单位均为“天”。"
            type="warning"
          />
          <!-- 导出按钮 -->
          <div class="topLab">
            <div class="rightLabBox">
              <a
                class="el-button fr el-button--primary el-button--mini"
                title="导出"
                @click="handleExport(index)"
              > 导出 </a>
            </div>
          </div>
          <!-- 数据表格，展示详细考勤数据 -->
          <el-table
            id="item"
            :data="contentData"
            border
            height="300"
            style="width: 100%;text-align: center"
          >
            <!-- 表格列定义 -->
            <el-table-column label="姓名" prop="name" width="120" />
            <el-table-column label="工号" prop="workNumber" width="100" />
            <el-table-column label="手机号" prop="mobile" width="200" />
            <!-- <el-table-column prop="atteSolution" label="当月考勤方案" width="200"></el-table-column>-->
            <el-table-column label="部门" prop="department" width="200" />
            <!-- <el-table-column prop="twoLevelDepartment" label="二级部门" width="200"></el-table-column>
            <el-table-column prop="threeLevelDepartment" label="三级部门" width="200"></el-table-column>
            <el-table-column prop="workCity" label="工作城市" width="200"></el-table-column>-->
            <el-table-column label="事假" prop="leaveDays" width="100" />
            <el-table-column label="调休" prop="dayOffLeaveDays" width="100" />
            <el-table-column label="正常" prop="normalDays" width="100" />
            <el-table-column label="迟到次数" prop="laterTimes" width="100" />
            <el-table-column label="早退次数" prop="earlyTimes" width="100" />
            <!--
            <el-table-column prop="hoursPerDays" label="日均时长（自然日）" width="150"></el-table-column>
            <el-table-column prop="hoursPerWorkDay" label="日均时长（工作日）" width="150"></el-table-column>
            <el-table-column prop="hoursPerRestDay" label="日均时长（休息日）" width="150"></el-table-column>
            <el-table-column prop="clockRate" label="打卡率（%）" width="120"></el-table-column>
            -->
            <el-table-column label="旷工天数" prop="absenceDays" width="100" />
            <el-table-column :formatter="fStandards" label="是否全勤" prop="isFullAttendanceint" width="100" />
            <!--
            <el-table-column prop="actualAtteUnofficialDays" label="实际出勤天数（非正式）" width="180"></el-table-column>
            -->
            <el-table-column label="实际出勤天数（正式）" prop="actualAtteOfficialDays" width="180" />
            <el-table-column label="应出勤工作日" prop="workingDays" width="120" />
            <!--
            <el-table-column prop="salaryStandards" label="计薪标准" width="100"></el-table-column>
            <el-table-column prop="salaryAdjustmentDays" label="计薪天数调整" width="120"></el-table-column>
            <el-table-column prop="workHour" label="工作时长" width="100"></el-table-column>
            <el-table-column prop="salaryUnofficialDays" label="计薪天数（非正式）" width="150"></el-table-column>
            -->
            <el-table-column label="计薪天数（正式）" prop="salaryOfficialDays" width="150" />
          </el-table>
          <!-- 分页 -->
          <!-- <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-size="requestParameters.pagesize"
              layout="total, prev, pager, next"
              :total="Number(counts)">
            </el-pagination>
          </div>-->
          <!-- end -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import {
  getArchivingList,
  getArchivingCont
} from '@/api/attendance'

export default {
  name: 'HistoricalArchiving',
  components: {
    // PageTool
  },
  data() {
    return {
      num: 0,
      yearVal: '',
      tableData: [],
      showArchivig: false,
      counts: '',
      requestParameters: {
        departmentId: '',
        year: ''
      },
      baseData: {
        atteArchiveMonthlyId: ''
      },
      loading: false,
      showHeight: 40,
      boxHeight: '',
      departmentData: [],
      contentData: []
    }
  },
  computed: {
    /**
     * 根据关键字搜索表格内容。
     *
     * 该方法用于模糊匹配表格数据中的内容，根据提供的关键字搜索所有表格行的数据。
     * 如果关键字存在，则筛选出包含关键字的行数据；如果关键字不存在，则返回所有行的数据。
     *
     * @returns {null|Array} 返回匹配的表格数据，如果没有关键字则返回所有数据；如果没有匹配的数据，则返回 null。
     */
    tables() {
      // 获取搜索关键字
      const search = this.baseData.keyword
      // 遍历表格数据
      for (var i = 0; i < this.tableData.length; i++) {
        // 如果存在关键字
        if (search) {
          // 筛选当前行中包含关键字的 contentData
          this.tableData[i].contentData.filter(data => {
            return Object.keys(data).some(key => {
              // 检查数据的每个键值是否包含关键字，忽略大小写
              return (
                String(data[key])
                  .toLowerCase()
                  .indexOf(search) > -1
              )
            })
          })
        } else {
          // 如果没有关键字，直接返回当前行的所有 contentData
          return this.tableData[i].contentData
        }
      }
      // 如果遍历完成后没有返回数据，表示没有匹配的关键字或数据，返回 null
      return null
    }
  },
  created() {
    const { preDates, preYear } = this.getMonth()
    this.yearVal = preDates
    this.requestParameters.year = preYear
    this.getDepartment()
  },
  methods: {
    /**
     * 获取上一个月的日期信息
     * 该函数用于计算当前日期的上一个月，以确保在日历中正确显示上一个月的日期。
     * 它返回一个对象，包含上一个月的年份、月份和日期字符串。
     *
     * @returns {Object} 返回一个对象，包含 preDates（上一个月的日期字符串）、preYear（上一个月的年份）、preMonth（上一个月的月份）
     */
    getMonth: function() {
      /* 获取当前日期 */
      /* 默认显示上个月的日期 */
      var nowdays = new Date()
      /* 解析当前日期的年份和月份 */
      var year = nowdays.getFullYear()
      var month = nowdays.getMonth()
      /* 如果当前月份为 1 月，则将月份设置为 12，年份减一，以计算上一年的 12 月 */
      if (month === 0) {
        month = 12
        year = year - 1
      }
      /* 如果月份小于 10，添加前导 0，以确保日期字符串的正确格式 */
      if (month < 10) {
        month = '0' + month
      }
      /* 记录上一个月的年份 */
      var preYear = year // 年
      /* 构造上一个月的日期字符串，格式为 YYYY-MM */
      var preDates = year + '-' + month // 上个月
      /* 记录上一个月的月份 */
      var preMonth = month // 上个月
      /* 月份自增用于后续逻辑，确保月份始终向前推进 */
      month++
      /* 返回上一个月的日期信息 */
      return {
        preDates: preDates,
        preYear: preYear,
        preMonth: preMonth
      }
    },
    /**
     * 根据状态码返回相应的标准文本。
     * @param {number} state - 状态码。
     * @returns {string} - 状态的文本描述。
     */
    fStandards(state) {
      // 将状态码转换为文本描述
      return state === 0 ? '是' : '否'
    },
    /**
     * 异步获取归档列表。
     * @param {Object} params - 请求参数。
     */
    async getArchivingList(params) {
      await getArchivingList(params)
      if (this.tableData.length === 0) {
        this.showArchivig = true
      } else {
        this.showArchivig = false
      }
      this.loading = false
    },
    /**
     * 异步获取部门列表，并初始化归档列表。
     */
    async getDepartment() {
      this.departmentData = await getDepartment()
      this.requestParameters.departmentId = this.departmentData[0].id
      this.getArchivingList(this.requestParameters)
    },
    /**
     * 根据传入的对象和索引，打开相应的表格项，并加载其内容。
     * @param {Object} obj - 表格项对象。
     * @param {number} index - 表格项索引。
     */
    async openTable(obj, index) {
      this.baseData.atteArchiveMonthlyId = obj.id
      if (!obj.act) {
        this.contentData = await getArchivingCont(this.baseData)
        this.loading = false
        this.$set(this.tableData[index], 'act', true)
      } else {
        this.$set(this.tableData[index], 'act', false)
      }
    },
    /**
     * 处理文件导出操作。
     * @param {number} index - 表格项索引。
     */
    handleExport(index) {
    },
    /**
     * 当部门选择发生变化时的处理函数。
     * @param {any} val - 新选中的部门值。
     */
    handleChange(val) {
      this.requestParameters.departmentId = val
      this.init(this.requestParameters)
    },
    /**
     * 当选择年份发生变化时的处理函数。
     * 主要用于更新查询参数中的年份，并根据查询结果决定是否显示无数据提示。
     *
     * 修改年份选择后，首先更新请求参数中的年份值，然后发起获取归档列表的请求。
     * 如果获取的表格数据为空，则显示无数据提示；否则，隐藏无数据提示。
     */
    handleChangeYear() {
      // 更新请求参数中的年份
      this.requestParameters.year = this.yearVal
      // 发起获取归档列表的请求
      this.getArchivingList(this.requestParameters)
      // 根据表格数据长度判断是否显示无数据提示
      if (this.tableData.length === 0) {
        this.showArchivig = true
      } else {
        this.showArchivig = false
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./../../styles/variables.scss";

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

        .fr {
          text-align: center;
        }

        div {
          display: inline-block;
          padding: 10px 50px 0;
        }

        div:last-child,
        div:first-child {
          border: none;
        }

        .lab {
          position: relative;
          top: -30px;
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
          padding: 15px 15px 30px;

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

            .btn {
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
        border-bottom: solid 3px $blue;

        .lab {
          color: $blue;
        }

        .labTit {
          color: $blue;
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
