<template>
  <div v-loading="loading" class="dashboard-container">
    <!-- 仪表盘容器 -->
    <div class="app-container">
      <!-- 页面工具栏，用于展示考勤统计数据和操作按钮 -->
      <page-tools :show-before="true">
        <!-- 前面内容 -->
        <template v-slot:before> 有 {{ attendInfo.tobeTaskCount }} 条考勤审批尚未处理 </template>
        <template>
          <!-- 导入按钮，用于导入考勤数据 -->
          <el-button size="mini" type="danger" @click="$router.push('/import?type=attendance')"> 导入 </el-button>
          <!-- 提醒按钮，用于触发提醒功能 -->
          <el-button size="mini" type="warning"> 提醒 </el-button>
          <!-- 设置按钮，用于进入设置页面 -->
          <el-button size="mini" type="primary" @click="handleSet"> 设置 </el-button>
          <!-- 历史归档按钮，用于进入历史归档页面 -->
          <el-button size="mini" type="default" @click="$router.push('/attendances/archiving/')"> 历史归档 </el-button>
          <!-- 报表按钮，用于进入考勤报表页面 -->
          <el-button size="mini" type="primary" @click="$router.push({'path':'/attendances/report/'+ yearMonth})">
            {{ yearMonth }} 报表
          </el-button>
        </template>
      </page-tools>
      <!-- 考勤统计卡片，用于选择考勤部门和状态 -->
      <el-card class="hr-block">
        <el-form ref="formData" :model="formData" class="formInfo" label-width="120px">
          <!-- 部门选择，多选形式 -->
          <el-form-item label="部门:">
            <el-checkbox-group v-model="formData.deptID">
              <el-checkbox
                v-for="item in departments"
                :key="item.id"
                :label="item.name"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 考勤状态选择，单选形式 -->
          <el-form-item label="考勤状态：">
            <el-radio-group v-model="formData.stateID">
              <el-radio
                v-for="item in stateData.holidayType"
                :key="item.id"
                :label="item.value"
                :value="item.value"
              >
                {{ item.value }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 考勤数据卡片，用于展示考勤详细数据和操作 -->
      <el-card class="hr-block">
        <!-- 考勤列表，包含员工基本信息和每日考勤状态 -->
        <div style="width:100%;position: relative;overflow-x: auto; overflow-y: hidden;">
          <div style="width: 3000px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="tableInfo">
              <tr>
                <!-- 列表头部，包含考勤各项信息 -->
                <th width="50"> 序号 </th>
                <th width="100"> 姓名 </th>
                <th width="100"> 工号 </th>
                <th width="200"> 部门 </th>
                <th width="100"> 手机 </th>
                <th v-for="(it, ind) in monthOfReport" :key="ind" width="110">{{ attendInfo.month }}/{{ ind + 1 }}</th>
              </tr>
              <!-- 考勤数据行，每行代表一个员工的考勤信息 -->
              <tr v-for="(item, index) in list" :key="item.id">
                <td width="50">{{ index }}</td>
                <td width="100">{{ item.username }}</td>
                <td width="100">{{ item.workNumber }}</td>
                <td width="200">{{ item.departmentName }}</td>
                <td width="100">{{ item.mobile }}</td>
                <!-- 每日考勤状态，通过点击触发修改对话框 -->
                <td
                  v-for="(it,ind) in item.attendanceRecord"
                  :key="ind"
                  width="110"
                  @click="showChangeDialog(item,ind,it)"
                >
                  <!-- 根据考勤状态显示不同图标 -->
                  <span v-if="it.adtStatu===1">√</span>
                  <span v-if="it.adtStatu===2"> 旷工 </span>
                  <span v-if="it.adtStatu===3"> 迟到 </span>
                  <span v-if="it.adtStatu===4"> 早退 </span>
                  <span v-if="it.adtStatu===5"> 外出 </span>
                  <!-- 其他考勤状态省略... -->
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!-- 考勤记录修改对话框，用于修改员工的考勤状态 -->
        <el-dialog
          :visible.sync="centerDialogVisible"
          center
          width="30%"
        >
          <span slot="title" style="color:#fff;">{{ attendInfo.name }} {{ attendInfo.month }}/{{
            attendInfo.getDate
          }}（实际工作日考勤方案）</span>
          <div class="attenInfo">
            <!-- 考勤状态选择，用于修改考勤记录 -->
            <p class="colRed"> 注：统计考勤时，异常状态优先正常状态 </p>
            <p class="check">
              <el-radio-group v-model="modifyData.adtStatu">
                <el-radio
                  v-for="item in stateData.vacationtype"
                  :key="item.id"
                  :label="item.id"
                  :value="item.name"
                >{{ item.name }}
                </el-radio>
              </el-radio-group>
            </p>
          </div>
          <span slot="footer" class="dialog-footer">
            <!-- 确定按钮，用于提交考勤状态修改 -->
            <el-button type="primary" @click="btnOK"> 确定 </el-button>
            <!-- 取消按钮，用于关闭对话框而不修改考勤状态 -->
            <el-button @click="centerDialogVisible = false"> 取消 </el-button>
          </span>
        </el-dialog>
        <!-- 分页组件，用于翻页查看考勤数据 -->
        <el-row align="middle" justify="center" style="height: 60px" type="flex">
          <el-pagination
            :current-page="page.page"
            :page-size="page.pagesize"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="pageChange"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 提醒和设置组件，用于配置提醒和查看设置 -->
    <el-card>
      <!-- 提醒组件，用于显示旷工提醒信息 -->
      <el-dialog
        :visible.sync="tipsDialogVisible"
        center
        title="提醒"
        width="280px"
      >
        <div class="attenInfo">
          <p> 系统将通过邮件与短信的形式，对全体员工中存在旷工的考勤进行提醒，该提醒每月仅可发送 1 次。</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <!-- 确认按钮，用于关闭提醒对话框 -->
          <el-button type="primary" @click="handleSub"> 我知道了 </el-button>
          <!-- 取消按钮，用于关闭提醒对话框 -->
          <el-button @click="centerDialogVisible = false"> 取消 </el-button>
        </span>
      </el-dialog>
      <!-- 设置组件，用于配置考勤规则等设置 -->
      <attendance-set ref="set" @handleCloseModal="handleCloseModal" />
    </el-card>
  </div>
</template>

<script>
import { getAttendancesList } from '@/api/attendance'
import AttendanceSet from './components/attendance-set'
import { getDepartment } from '@/api/department'
import pageTools from './components/page-tools.vue'

export default {
  name: 'Attendances',
  components: { AttendanceSet, pageTools },
  data() {
    return {
      list: [],
      selectData: [],
      stateData: {
        // 假期类型
        holidayType: [{
          id: '1',
          value: '正常',
          isEnable: false
        },
        {
          id: '2',
          value: '旷工',
          isEnable: false
        },
        {
          id: '3',
          value: '事假',
          isEnable: false
        },
        {
          id: '4',
          value: '调休',
          isEnable: false
        },
        {
          id: '5',
          value: '迟到',
          isEnable: false
        },
        {
          id: '6',
          value: '早退',
          isEnable: false
        }
        ],
        vacationtype: [{
          id: '1',
          name: '正常'
        }, {
          id: '2',
          name: '旷工'
        }, {
          id: '3',
          name: '迟到'
        }, {
          id: '4',
          name: '早退'
        }, {
          id: '5',
          name: '外出'
        }, {
          id: '6',
          name: '出差'
        }, {
          id: '7',
          name: '年假'
        }, {
          id: '8',
          name: '事假'
        }, {
          id: '9',
          name: '病假'
        }, {
          id: '10',
          name: '婚假'
        }, {
          id: '11',
          name: '丧假'
        }, {
          id: '12',
          name: '产假'
        }, {
          id: '13',
          name: '奖励产假'
        }, {
          id: '14',
          name: '陪产假'
        }, {
          id: '15',
          name: '探亲假'
        }, {
          id: '16',
          name: '工伤假'
        }, {
          id: '17',
          name: '调休'
        }, {
          id: '18',
          name: '产检假'
        }, {
          id: '19',
          name: '流产假'
        }, {
          id: '20',
          name: '长期病假'
        }, {
          id: '21',
          name: '测试假'
        }, {
          id: '22',
          name: '补签'
        }

        ],
        type: [{
          leaveType: '60000',
          name: '年假',
          isEnable: false
        },
        {
          leaveType: '60100',
          name: '事假',
          isEnable: false
        },
        {
          leaveType: '60200',
          name: '病假',
          isEnable: false
        },
        {
          leaveType: '60300',
          name: '婚假',
          isEnable: false
        },
        {
          leaveType: '60400',
          name: '丧假',
          isEnable: false
        },
        {
          leaveType: '60500',
          name: '产假',
          isEnable: false
        },
        {
          leaveType: '60600',
          name: '奖励产假',
          isEnable: false
        },
        {
          leaveType: '60700',
          name: '陪产假',
          isEnable: false
        },
        {
          leaveType: '60800',
          name: '探亲假',
          isEnable: false
        },
        {
          leaveType: '60900',
          name: '工伤假',
          isEnable: false
        },
        {
          leaveType: '61000',
          name: '调休假',
          isEnable: false
        },
        {
          leaveType: '61100',
          name: '产检假',
          isEnable: false
        },
        {
          leaveType: '61200',
          name: '流产假',
          isEnable: false
        },
        {
          leaveType: '61300',
          name: '长期病假',
          isEnable: false
        },
        {
          leaveType: '61400',
          name: '测试假',
          isEnable: false
        }
        ],
        departmentType: [{
          dedTypeCode: '51000',
          name: '迟到扣款',
          isEnable: false,
          departmentId: '',
          periodLowerLimit: '30', // 时间段下限
          periodUpperLimit: '30', // 时间段上限
          timesLowerLimit: '2', // 次数下限
          timesUpperLimit: '2', // 次数上限
          dedAmonutLowerLimit: '30', // 扣款金额下限
          dedAmonutUpperLimit: '0', // 扣款金额上限
          absenceDays: '0.5', // 旷工天数
          fineSalaryMultiples: '2', // 罚款工资倍数
          absenceTimesUpperLimt: '0' // 旷工次数上限
        },
        {
          dedTypeCode: '52000',
          name: '早退扣款',
          isEnable: false,
          departmentId: '',
          periodLowerLimit: '30', // 时间段下限
          periodUpperLimit: '30', // 时间段上限
          timesLowerLimit: '2', // 次数下限
          timesUpperLimit: '2', // 次数上限
          dedAmonutLowerLimit: '30', // 扣款金额下限
          dedAmonutUpperLimit: '0', // 扣款金额上限
          absenceDays: '0.5', // 旷工天数
          fineSalaryMultiples: '2', // 罚款工资倍数
          absenceTimesUpperLimt: '0' // 旷工次数上限
        },
        {
          dedTypeCode: '53000',
          name: '旷工扣款',
          isEnable: false,
          departmentId: '',
          periodLowerLimit: '30', // 时间段下限
          periodUpperLimit: '30', // 时间段上限
          timesLowerLimit: '2', // 次数下限
          timesUpperLimit: '2', // 次数上限
          dedAmonutLowerLimit: '30', // 扣款金额下限
          dedAmonutUpperLimit: '0', // 扣款金额上限
          absenceDays: '0.5', // 旷工天数
          fineSalaryMultiples: '2', // 罚款工资倍数
          absenceTimesUpperLimt: '0' // 旷工次数上限
        }
        ],
        overtimeType: [{
          // id: '1',
          departmentId: '', // 部门 ID
          rule: '工作日可申请加班', // 规则内容
          ruleStartTime: '', // 规则生效每日开始时间
          ruleEndTime: '', // 规则生效每日结束时间
          isTimeOff: false, // 是否调休
          isEnable: false // 是否可用
        },
        {
          // id: '2',
          departmentId: '', // 部门 ID
          rule: '休息日可申请加班', // 规则内容
          ruleStartTime: '', // 规则生效每日开始时间
          ruleEndTime: '', // 规则生效每日结束时间
          isTimeOff: false, // 是否调休
          isEnable: false // 是否可用
        },
        {
          // id: '3',
          departmentId: '', // 部门 ID
          rule: '法定节假日可申请加班', // 规则内容
          ruleStartTime: '', // 规则生效每日开始时间
          ruleEndTime: '', // 规则生效每日结束时间
          isTimeOff: false, // 是否调休
          isEnable: false // 是否可用
        }
        ]
      },
      departments: [],
      total: 100,
      attendanceRecord: '',
      monthOfReport: '',
      centerDialogVisible: false,
      tipsDialogVisible: false,
      month: '',
      yearMonth: '',
      loading: false,
      attendInfo: {
        month: '',
        getDate: '',
        getInfo: '',
        name: '',
        counts: '',
        tobeTaskCount: ''
      },
      formData: {
        page: 1,
        pagesize: 10,
        keyword: this.keyword,
        deptID: [], // 性别
        stateID: ''
      },
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      modifyData: {
        userId: '',
        day: '',
        adtStatu: ''
      }
    }
  },
  // 创建完毕状态
  created() {
    this.getAttendancesList() // 获取考勤列表
    this.getDepartment() // 获取考勤列表
  },
  methods: {
    /**
     * 关闭提示对话框并显示成功消息。
     * 主要用于操作成功后的反馈，关闭提示对话框，并通过 $message 显示一个成功提示。
     */
    handleSub() {
      this.tipsDialogVisible = false
      this.$message.success('提醒成功')
    },

    /**
     * 打开提示对话框。
     * 用于触发显示提示对话框的操作，例如点击按钮时。
     */
    handleTip() {
      this.tipsDialogVisible = true
    },

    /**
     * 打开设置对话框。
     * 通过调用 $refs 中的 set 组件的方法，来打开设置对话框。
     * 主要用于配置或修改一些设置项。
     */
    handleSet() {
      this.$refs.set.dialogFormV()
    },

    /**
     * 关闭设置对话框。
     * 通过调用 $refs 中的 set 组件的方法，来关闭设置对话框。
     * 主要用于在完成设置操作后关闭对话框。
     */
    handleCloseModal() {
      this.$refs.set.dialogFormH()
    },
    /**
     * 异步获取部门列表
     *
     * 本函数通过异步调用 getDepartment 方法，获取部门列表，并将结果赋值给 this.departments。
     * 主要用于初始化或更新部门选择列表，为用户提供可选择的部门选项。
     *
     * @returns {Promise<void>} 无返回值，但会更新 this.departments 属性
     */
    async getDepartment() {
      this.departments = await getDepartment()
    },
    /**
     * 异步获取考勤列表。
     *
     * 此方法用于从服务器获取当前页面的考勤记录列表。它首先设置加载状态为 true，然后调用 getAttendancesList 接口，
     * 解析返回的数据，并将结果赋值给相应的属性。最后，它根据返回的月份信息计算出该月的最后一天，并更新相关日期属性，
     * 最后关闭加载状态。
     *
     * @returns {void}
     */
    async getAttendancesList() {
      // 开始加载，显示加载中的状态
      this.loading = true
      // 调用接口获取考勤列表数据，传入当前分页信息
      const { data, monthOfReport, tobeTaskCount } = await getAttendancesList({ ...this.page })
      // 分配获取的考勤记录到列表显示
      this.list = data.rows // 当前记录
      // 更新总记录数
      this.page.total = data.total // 总条数
      // 更新考勤信息中的统计数字
      this.attendInfo.counts = data.total
      // 更新考勤信息中的月份
      this.attendInfo.month = monthOfReport
      // 更新待处理任务的数量
      this.attendInfo.tobeTaskCount = tobeTaskCount
      // 获取当前日期和时间
      var date = new Date()
      // 获取当前年份
      var year = date.getFullYear()
      // 使用获取的报告月份
      const month = monthOfReport
      // 计算该月的最后一天
      var d = new Date(year, month, 0) // 获取月份
      // 更新报告月份的天数
      this.monthOfReport = d.getDate() // 获取日期
      // 组合年份和月份，用于显示
      this.yearMonth = year + ('' + month < 10 ? '0' + month : month)
      // 更新月份信息
      this.month = monthOfReport
      // 加载完成，隐藏加载中的状态
      this.loading = false
    },
    /**
     * 显示修改对话框
     * @param {Object} item - 用户信息对象
     * @param {String|Number} id - 用户 ID
     * @param {Object} it - 用户的考勤状态信息对象
     * 初始化修改数据，根据传入的用户信息和考勤状态信息，设置修改对话框中所需的数据，
     * 并根据考勤状态是否为空，决定是否显示对话框。
     */
    showChangeDialog(item, id, it) {
      // 将用户 ID、考勤天数、部门 ID 和考勤状态赋值给修改数据对象
      this.modifyData.userId = item.id
      this.modifyData.day = it.day
      this.modifyData.departmentId = item.departmentId
      this.modifyData.adtStatu = it.adtStatu + '' // 将考勤状态数字转换为字符串
      // 如果考勤状态不为空，则准备考勤信息并显示对话框
      if (it.adtStatu !== '') {
        // 设置获取日期为传入 ID 的数值加 1，作为考勤日期
        this.attendInfo.getDate = parseInt(id + 1)
        // 设置考勤状态信息
        this.attendInfo.getInfo = it.adtStatu
        // 设置用户名
        this.attendInfo.name = item.name
        // 显示修改对话框
        this.centerDialogVisible = true
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tableInfo {
  line-height: 36px;
  border: solid 1px #ebeef5;
  border-right: 0 none;
  border-bottom: 0 none;

  tr {
    th {
      height: 50px;
      text-align: center;
      border-right: solid 1px #ebeef5;
      border-bottom: solid 1px #ebeef5;
      border-bottom: 2px solid #e8e8e8;
      background: #fafafa;
      min-width: 100px;
    }

    td {
      height: 36px;
      text-align: center;
      border-right: solid 1px #ebeef5;
      border-bottom: solid 1px #ebeef5;
    }
  }
}

.attenInfo {
  p {
    &.check {
      padding: 20px 0 0;
    }

    .el-radio {
      display: inline-block;
      width: 60px;
      padding: 5px 0;

    }
  }
}
</style>
