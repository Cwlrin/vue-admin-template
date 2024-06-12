<template>
  <div class="add-form">
    <!-- 设置对话框，用于配置出勤、请假、扣款和加班设置 -->
    <el-dialog :visible.sync="dialogFormVisible" title="设置">
      <!-- 使用 Tabs 组件来切换不同的设置选项卡 -->
      <el-tabs v-model="activeName" style="margin-left:20px" @tab-click="handleClick">
        <!-- 出勤设置选项卡 -->
        <el-tab-pane label="出勤设置" name="first">
          <!-- 出勤设置表单 -->
          <el-form
            ref="dataForm"
            :model="formBase"
            :rules="rules"
            class="titmInfo"
            label-position="right"
            label-width="100px"
            style="width:700px;"
          >
            <!-- 部门选择器，用于选择部门 -->
            <el-form-item label="部门：" prop="departmentId">
              <el-select v-model="formBase.departmentId" placeholder="请选择" @change="handleChange">
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <!-- 出勤时间设置，包括上午开始时间、上午结束时间、下午开始时间和下午结束时间 -->
            <el-form-item label="出勤时间：" prop="morningStartTime" style="">
              <el-time-select
                v-model="formBase.morningStartTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '23:59'
                }"
                :placeholder="formBase.morningStartTime"
                class="timePicker"
              />
              -
              <el-time-select
                v-model="formBase.morningEndTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.morningEndTime"
                class="timePicker"
              />
              <el-time-select
                v-model="formBase.afternoonStartTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.afternoonStartTime"
                class="timePicker"
              />
              -
              <el-time-select
                v-model="formBase.afternoonEndTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                :placeholder="formBase.afternoonEndTime"
                class="timePicker"
              />
            </el-form-item>
          </el-form>
          <!-- 对话框底部操作按钮 -->
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleAttendance"> 保存更新 </el-button>
            <el-button @click="handleClose"> 取消 </el-button>
          </div>
        </el-tab-pane>
        <!-- 请假设置选项卡 -->
        <el-tab-pane label="请假设置" name="second">
          <!-- 请假设置表单 -->
          <el-form
            ref="leaveForm"
            :model="leaveBase"
            :rules="rules"
            class="titmInfo"
            label-position="right"
            label-width="80px"
          >
            <!-- 部门选择器，用于选择请假部门 -->
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="leaveBase.departmentId"
                placeholder="请选择"
                @change="handleChangeLeave"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 假期类型列表 -->
          <p> 假期类型 </p>
          <el-table ref="singleTable" :data="stateData.type" style="width: 100%">
            <el-table-column label="类型" prop="name" width="200" />
            <el-table-column label="是否可用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isEnable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
          </el-table>
          <!-- 请假设置提示信息 -->
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleLeave"> 保存更新 </el-button>
            <el-button @click="handleClose"> 取消 </el-button>
          </div>
          <el-alert :closable="false" show-icon title type="warning">
            <template>
              <div class="tipInfo">
                <p> 事假 请假单位为 0.5 天 只能提交工作日内的请假单 </p>
                <p> 当请假开关关闭后，员工则不可在员工端提交请假申请 </p>
              </div>
            </template>
          </el-alert>
        </el-tab-pane>
        <!-- 扣款设置选项卡 -->
        <el-tab-pane label="扣款设置" name="third">
          <!-- 扣款设置表单 -->
          <el-form
            ref="deductionsForm"
            :model="deductionsBase"
            :rules="rules"
            class="titmInfo"
            label-position="right"
            label-width="80px"
          >
            <!-- 部门选择器，用于选择扣款部门 -->
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="deductionsBase.departmentId"
                placeholder="请选择"
                @change="handleChangeDeductions"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 扣款规则列表 -->
          <el-table ref="singleTable" :data="stateData.departmentType" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.name }}
                  <el-switch
                    v-model="scope.row.isEnable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="handleStatus($event,scope.row)"
                  />
                </div>
                <!-- 迟到扣款规则 -->
                <div v-if="scope.row.dedTypeCode==='51000'" class="attentInfo">
                  <p>
                    迟到≤
                    <el-input
                      v-model="scope.row.periodUpperLimit"
                      class="inputInfo"
                      value="30"
                      @input.native="handleInput($event)"
                    />
                    分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      迟到≤
                      <el-input
                        v-model="scope.row.timesUpperLimit"
                        class="inputInfo"
                        @input.native="handleInput($event)"
                      />
                      次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutUpperLimit"
                        class="inputInfo"
                        @input.native="handleInput($event)"
                      />
                      元
                    </p>
                    <p>
                      迟到 >
                      <el-input
                        v-model="scope.row.timesLowerLimit"
                        class="inputInfo"
                        disabled
                        @input.native="handleInput($event)"
                      />
                      次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutLowerLimit"
                        class="inputInfo"
                        @input.native="handleInput($event)"
                      />
                      元
                    </p>
                  </div>
                  <p>
                    迟到 >
                    <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled />
                    分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      迟到 >
                      <el-input
                        v-model="scope.row.absenceTimesUpperLimt"
                        class="inputInfo"
                        disabled
                      />
                      次，每次旷工
                      <el-input
                        v-model="scope.row.absenceDays"
                        class="inputInfo"
                        @input.native="handleInputPoint($event)"
                      />
                      天
                    </p>
                  </div>
                </div>
                <!-- 早退扣款规则 -->
                <div v-if="scope.row.dedTypeCode==='52000'" class="attentInfo">
                  <p>
                    早退≤
                    <el-input
                      v-model="scope.row.periodUpperLimit"
                      class="inputInfo"
                      value="30"
                      @input.native="handleInput($event)"
                    />
                    分钟
                  </p>
                  <div class="deductionInfo">
                    <p>
                      早退≤
                      <el-input
                        v-model="scope.row.timesUpperLimit"
                        class="inputInfo"
                        @input.native="handleInput($event)"
                      />
                      次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutUpperLimit"
                        class="inputInfo"
                        @input.native="handleInput($event)"
                      />
                      元
                    </p>
                    <p>
                      早退 >
                      <el-input v-model="scope.row.timesLowerLimit" class="inputInfo" disabled />
                      次，每次扣款
                      <el-input
                        v-model="scope.row.dedAmonutLowerLimit"
                        class="inputInfo"
                        @input.native="handleInput($event)"
                      />
                      元
                    </p>
                  </div>
                  <p>
                    早退 >
                    <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled />
                    分钟
                  </p>
                  <div style="padding-left:120px;">
                    <p>
                      早退 >
                      <el-input
                        v-model="scope.row.absenceTimesUpperLimt"
                        class="inputInfo"
                        disabled
                      />
                      次，每次旷工
                      <el-input
                        v-model="scope.row.absenceDays"
                        class="inputInfo"
                        @input.native="handleInputPoint($event)"
                      />
                      天
                    </p>
                  </div>
                </div>
                <!-- 旷工扣款规则 -->
                <div v-if="scope.row.dedTypeCode==='53000'" class="attentInfo">
                  <p>
                    旷工按
                    <el-input
                      v-model="scope.row.fineSalaryMultiples"
                      class="inputInfo"
                      @input.native="handleInput($event)"
                    />
                    倍工资处罚
                  </p>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleDeductions"> 保存更新 </el-button>
            <el-button @click="handleClose"> 取消 </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="加班设置" name="fourth">
          <el-form
            ref="overtimeForm"
            :model="overtimeBase"
            :rules="overtimeRule"
            label-width="110px"
          >
            <el-form-item label="部门：" prop="departmentId">
              <el-select
                v-model="overtimeBase.departmentId"
                placeholder="请选择"
                @change="handleChangeovertime"
              >
                <el-option
                  v-for="item in departmentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="加班规则：">
              <div v-for="item in overtimeBase.rules" :key="item.id" class="ruleInfo">
                <el-row>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <el-switch v-model="item.isEnable" />
                      &nbsp;&nbsp;{{ item.rule }}
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div class="grid-content bg-purple-light">
                      <span class="pad">
                        <el-checkbox v-model="item.isTimeOff"> 调休假 </el-checkbox>
                      </span>
                      <template>
                        <el-time-select
                          v-model="item.ruleStartTime"
                          :disabled="item.isTimeOff===false"
                          :picker-options="{
                            start: '01:00',
                            step: '00:15',
                            end: '23:59'
                          }"
                          style="width:100px;"
                        />
                        <el-time-select
                          v-model="item.ruleEndTime"
                          :disabled="item.isTimeOff===false"
                          :picker-options="{
                            start: '01:00',
                            step: '00:15',
                            end: '23:59',
                            minTime: item.startTime
                          }"
                          style="width:100px;"
                        />
                      </template>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="打卡验证：" prop="isClock">
              <el-switch v-model="overtimeBase.isClock" />&nbsp;&nbsp; 加班需要有打卡记录
            </el-form-item>
            <el-form-item label="开启补偿：" prop="isCompensationint">
              <el-switch v-model="overtimeBase.isCompensationint" />
            </el-form-item>
            <el-form-item label="调休假设置：" prop="latestEffectDate">
              <div class="ruleInfo">
                最晚有效期： 次年
                <el-date-picker
                  v-model="overtimeBase.latestEffectDate"
                  placeholder="选择日期"
                  style="width:150px;"
                  type="date"
                />
              </div>
            </el-form-item>
            <el-form-item label prop="unit">
              <div class="ruleInfo">
                <p>
                  请假最小单位
                  <el-input v-model="overtimeBase.unit" style="width:50px" />
                  天
                </p>
              </div>
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleOvertime"> 保存更新 </el-button>
            <el-button @click="handleClose"> 取消 </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { addEmployee } from '@/api/employee'
// import {getInteger, getIntegerPoint} from '@/filters'
import { getDepartment } from '@/api/department'
import {
  attendanceSave,
  getAttendance,
  leaveSave,
  getLeave,
  deductionsSave,
  getDeductions,
  overtimeSave,
  getOvertime
} from '@/api/attendance'
import * as commonApi from '@/utils'

export default {
  name: 'Add',
  props: [],
  data() {
    return {
      // 控制对话框可见性
      dialogFormVisible: false,
      // 控制选择部门弹窗可见性
      isShowSelect: false,
      // 就业类型
      formOfEmployment: '',
      // 标签激活名称
      activeName: 'first',
      // 基本信息表单数据
      formBase: {
        morningStartTime: '',
        morningEndTime: '',
        afternoonStartTime: '',
        afternoonEndTime: '',
        departmentId: ''
      },
      // 请假基本信息
      leaveBase: {
        departmentId: ''
      },
      // 扣款基本信息
      deductionsBase: {
        departmentId: ''
      },
      // 加班基本信息
      overtimeBase: {
        departmentId: '',
        isClock: false,
        isCompensationint: false,
        latestEffectDate: '',
        unit: '',
        rules: []
      },
      // 部门数据
      departmentData: [],
      // 状态数据
      stateData: [],
      // 类型列表
      tylelist: [],
      // 扣款列表
      deductionList: [],
      // 旧数量
      oldNum: '',
      // 表单验证规则
      rules: {
        // 表单验证
        // name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        morningStartTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      },
      // 加班规则验证
      overtimeRule: {
        // 表单验证
        unit: [
          { required: true, message: '调休单位不能为空(', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        isClock: [
          { required: true, message: '请选择打卡验证', trigger: 'change' }
        ],
        isCompensationint: [
          { required: true, message: '请选择补偿', trigger: 'change' }
        ],
        latestEffectDate: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // 输入框数量计算属性
    inpNum() {
      return this.oldNum
    }
  },
  // 创建完毕状态
  created() {
    this.getDepartment() // 获取部门数据
    this.stateData = []
  },
  methods: {
    // 业务方法
    // 获取部门
    async getDepartment() {
      this.departmentData = await getDepartment()
      // 初始化各表单的部门 ID 为第一个部门的 ID
      this.formBase.departmentId = this.leaveBase.departmentId = this.deductionsBase.departmentId = this.overtimeBase.departmentId = this.departmentData[0].id
      this.handleChange(this.leaveBase.departmentId)
    },
    /**
     * 打开对话框
     *
     * 本函数用于触发对话框的显示。当调用此函数时，对话框的可见性状态将被设置为 true，
     * 从而在用户界面中显示对话框。这通常在需要用户输入额外信息或进行确认操作时使用。
     *
     * @returns {void} 无返回值
     */
    dialogFormV() {
      this.dialogFormVisible = true
    },
    /**
     * 关闭对话框
     *
     * 该方法用于隐藏对话框，使其在用户界面中不可见。这可以通过设置 `dialogFormVisible` 属性为 `false` 来实现。
     * 当对话框隐藏后，它可以再次通过设置 `dialogFormVisible` 为 `true` 来显示。
     *
     * @returns {void}
     */
    dialogFormH() {
      this.dialogFormVisible = false
    },
    /**
     * 清空表单数据方法
     *
     * 该方法用于重置表单的基础数据对象。通过将表单基础数据对象的属性设置为空对象，
     * 可以快速清空表单的所有输入字段，以便于重新开始表单填写或在提交后重置表单。
     *
     * @remarks
     * 此方法不涉及表单验证状态的重置，仅重置表单数据本身。
     */
    clearFormDate() {
      this.formBase = {}
    },
    // 关闭对话框并清空表单数据
    handleClose() {
      this.dialogFormH()
      this.clearFormDate()
    },
    /**
     * 提交表单并创建新数据。
     * 此函数首先将就业形式信息赋值给表单模型，然后验证表单数据的有效性。
     * 如果表单数据有效，则调用添加员工的异步函数，并在完成后清除表单数据、触发查询事件，
     * 最后关闭对话框。
     */
    createData() {
      // 将选择的就业形式信息赋值给表单模型
      this.formBase.formOfEmployment = this.formOfEmployment
      this.$refs.dataForm.validate(async valid => {
        // 如果表单验证成功
        if (valid) {
          // 提交表单数据到后端添加员工
          await addEmployee(this.formBase)
          // 清空表单数据
          this.$emit('clearFormDate', this.formBase)
          this.formBase = {}
          // 触发查询事件，更新列表展示
          this.$emit('doQuery', this.requestParameters)
          // 关闭对话框
          this.dialogFormVisible = false
        }
      })
    },
    /**
     * 当选择不同的部门时，异步加载并更新考勤配置。
     * 此函数的目的是为了根据部门的 ID 从服务器获取相应的考勤规则配置，并将这些配置应用于表单的基础信息部分。
     *
     * @param {string | number} val - 被选中的部门 ID。
     * @async
     * @returns {Promise<void>} 无返回值，但更新了组件状态。
     */
    async handleChange(val) {
      this.formBase = await getAttendance({ departmentId: val })
    },
    /**
     * 当选择不同的部门时，此函数被调用以更新请假配置。
     * 它首先将选中的部门 ID 赋值给 leaveBase 对象，然后重置所有类型的请假状态为禁用，并关联选中的部门 ID。
     * 接着，它从服务器获取针对所选部门的请假配置，并根据这些配置更新 stateData 中的请假类型状态。
     * @param {string} val - 被选中的部门 ID。
     */
    async handleChangeLeave(val) {
      // 将选中的部门 ID 赋值给 leaveBase 对象的 departmentId 属性
      this.leaveBase.departmentId = val
      // 遍历 stateData 中的 type 数组，为每个 item 设置 isEnable 属性为 false，并更新 departmentId
      this.stateData.type.forEach(item => {
        item.isEnable = false
        item.departmentId = val
      })
      // 根据选中的部门 ID 获取请假配置信息
      const res = await getLeave({ departmentId: val })
      // 遍历获取的请假配置信息
      // 根据服务器返回的配置，更新每个请假类型的启用状态
      res.forEach(item => {
        // 如果当前请假类型启用（isEnable 为 0），则将其 isEnable 属性设置为 true，否则设置为 false
        if (item.isEnable === 0) {
          item.isEnable = true
        } else {
          item.isEnable = false
        }
        // 遍历 stateData 中的 type 数组，找到与当前请假类型匹配的 item，更新其 isEnable 属性
        // 更新 stateData 中的请假类型启用状态，以与服务器返回的配置保持一致
        this.stateData.type.forEach(val => {
          if (val.leaveType === item.leaveType) {
            val.isEnable = item.isEnable
          }
        })
      })
    },
    /**
     * 根据选择的部门 ID 更改扣款配置
     * 此函数被调用时，会更新当前选中的部门 ID，并根据该 ID 从服务器获取相应的扣款配置信息。
     * 同时，它也会更新本地状态数据中的部门类型列表，为每个部门类型设置初始的禁用状态。
     * @param {string} val - 选中的部门 ID
     */
    async handleChangeDeductions(val) {
      // 将选中的部门 ID 赋值给扣款基础信息的对象
      this.deductionsBase.departmentId = val
      // 遍历状态数据中的部门类型，将部门 ID 更新为当前选中的 ID，并默认设置启用状态为 false
      this.stateData.departmentType.forEach(item => {
        item.departmentId = val
        item.isEnable = false
      })
      // 请求根据选中的部门 ID 获取相应的扣款配置信息
      const res = await getDeductions({ departmentId: val }).then(res => {
      })
      // 遍历返回的扣款配置信息，根据后端返回的 isEnable 值反向设置为 true 或 false，并更新到状态数据中的对应部门类型
      res.forEach(item => {
        if (item.isEnable === 0) {
          item.isEnable = true
        } else {
          item.isEnable = false
        }
        // 更新本地状态数据中的部门类型对应扣款类型的启用状态
        this.stateData.departmentType.forEach(val => {
          if (val.dedTypeCode === item.dedTypeCode) {
            val.isEnable = item.isEnable
          }
        })
      })
    },
    /**
     * 当部门选择发生变化时，异步更新加班配置。
     * @param {any} val - 被选中的部门 ID。
     */
    async handleChangeovertime(val) {
      // 设置当前选中的部门 ID 到加班基数对象
      this.overtimeBase.departmentId = val
      // 遍历规则列表，更新每个规则的部门 ID 并重置其状态
      this.overtimeBase.rules.forEach(item => {
        // 设置规则的部门 ID 为当前选中的部门 ID
        item.departmentId = val
        // 重置规则的启用状态、调休标志及其开始和结束时间
        item.isEnable = item.isTimeOff = false
        item.ruleEndTime = item.ruleStartTime = ''
      })
      // 重置最新生效日期和计算单位
      this.overtimeBase.latestEffectDate = ''
      this.overtimeBase.unit = ''
      // 重置加班方式和调休标志
      this.overtimeBase.isClock = this.overtimeBase.isCompensationint = false
      // 根据选中的部门 ID 获取相应的加班配置信息
      const data = await getOvertime({ departmentId: val })
      // 如果返回的加班配置不为空，则更新加班基数对象的相应属性
      if (data.dayOffConfigs !== null || data.extraDutyConfig !== null) {
        // 更新加班基数对象的部门 ID、最新生效日期、计算单位以及加班方式和调休标志
        this.overtimeBase.departmentId = data.dayOffConfigs.departmentId
        this.overtimeBase.latestEffectDate =
          data.dayOffConfigs.latestEffectDate
        this.overtimeBase.unit = data.dayOffConfigs.unit
        this.overtimeBase.isClock = data.extraDutyConfig.isClock
        this.overtimeBase.isCompensationint =
          data.extraDutyConfig.isCompensationint
      }
      // 逻辑处理，将 0 值转换为布尔值，用于判断是否启用钟点工模式和调休标志
      if (this.overtimeBase.isClock === 0) {
        this.overtimeBase.isClock = true
      } else {
        this.overtimeBase.isClock = false
      }
      if (this.overtimeBase.isCompensationint === 0) {
        this.overtimeBase.isClock = true
      } else {
        this.overtimeBase.isCompensationint = false
      }
      // 如果存在加班规则，遍历规则列表，更新每个规则的启用和调休状态
      if (data.extraDutyRuleList.length > 0) {
        // 遍历规则列表，将数值类型的启用和调休状态转换为布尔类型
        data.extraDutyRuleList.forEach(item => {
          if (item.isEnable === 0) {
            item.isEnable = true
          } else {
            item.isEnable = false
          }
          if (item.isTimeOff === 0) {
            item.isTimeOff = true
          } else {
            item.isTimeOff = false
          }
        })
        // 更新规则列表
        this.overtimeBase.rules = data.extraDutyRuleList
      }
    },
    /**
     * 处理考勤配置的保存操作。
     *
     * 本函数封装了表单验证和考勤配置保存的逻辑。它首先验证表单数据的有效性，如果表单数据有效，
     * 则调用 `attendanceSave` 函数保存考勤配置，并随后触发 `dataSearch` 事件以进行数据搜索，
     * 最后关闭当前窗口或视图。
     *
     * 使用异步函数语法以支持等待保存操作的完成，从而确保在进行后续操作之前，保存操作已经完成。
     */
    // 保存考勤配置
    async handleAttendance() {
      // 验证表单数据的有效性。如果表单有效，执行回调函数内的逻辑。
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          // 等待保存考勤配置的操作完成。
          await attendanceSave(this.formBase)
          // 触发数据搜索事件，允许父组件在保存后进行数据检索。
          this.$emit('dataSearch')
          // 关闭当前窗口或视图，完成保存操作。
          this.handleClose()
        }
      })
    },

    /**
     * 处理请假配置的保存操作。
     * 此函数首先验证表单数据的有效性，然后根据配置状态更新请假类型列表，
     * 最后调用接口保存更新后的配置并关闭当前窗口。
     *
     * @returns {void}
     */
    handleLeave() {
      // 验证表单数据的有效性
      this.$refs.leaveForm.validate(async valid => {
        if (valid) {
          // 将表单数据中的请假类型状态转换为统一的字符串格式
          this.tylelist = this.stateData.type
          this.tylelist.forEach(item => {
            if (item.isEnable) {
              item.isEnable = '0'
            } else {
              item.isEnable = '1'
            }
          })
          // 调用接口保存更新后的请假类型配置
          await leaveSave(this.tylelist)
          // 触发父组件的数据搜索事件
          this.$emit('dataSearch')
          // 关闭当前窗口或对话框
          this.handleClose()
        }
      })
    },
    /**
     * 处理扣款设置
     * 此函数用于提交扣款配置表单，并根据表单验证结果进行相应的操作。
     * 如果表单验证成功，它将转换表单中部门类型的启用状态，并保存这些设置。
     * 保存完成后，它会触发一个自定义事件来更新数据，并关闭当前的对话框。
     */
    handleDeductions() {
      this.$refs.deductionsForm.validate(async valid => {
        // 验证表单的有效性
        if (valid) {
          // 获取部门类型列表
          var deductionList = this.stateData.departmentType
          // 遍历部门类型列表，转换启用状态
          deductionList.forEach(item => {
            // 通过设置 isEnable 属性来切换启用状态
            if (item.isEnable) {
              item.isEnable = '0'
            } else {
              item.isEnable = '1'
            }
          })
          // 保存扣款设置
          await deductionsSave(deductionList)
          // 触发事件以更新数据
          this.$emit('dataSearch')
          // 关闭当前对话框
          this.handleClose()
        }
      })
    },
    /**
     * 处理加班设置操作。
     * 此函数用于提交加班配置的表单数据，并进行一些必要的数据转换和处理。
     * 它首先验证表单数据的有效性，然后格式化数据以满足后端接口的要求，并最后调用接口保存数据。
     * 如果数据保存成功，它会触发一个父组件的事件来刷新数据，并关闭当前的对话框。
     *
     * @returns {void}
     */
    handleOvertime() {
      // 校验表单数据的有效性
      this.$refs.overtimeForm.validate(async valid => {
        // 当表单数据有效时，进行后续操作
        if (valid) {
          // 初始化加班基数列表
          var deductionList = this.overtimeBase
          // 将最新的生效日期转换为树形数据结构
          deductionList.latestEffectDate = commonApi.transListToTreeData(
            deductionList.latestEffectDate
          )
          // 将布尔值转换为字符串，用于后台处理
          if (deductionList.isClock === true) {
            deductionList.isClock = '0'
          } else {
            deductionList.isClock = '1'
          }
          // 同上，转换另一个布尔值
          if (deductionList.isCompensationint === true) {
            deductionList.isCompensationint = '0'
          } else {
            deductionList.isCompensationint = '1'
          }
          // 遍历规则列表，将布尔值转换为字符串
          deductionList.rules.forEach(item => {
            if (item.isEnable === true) {
              item.isEnable = '0'
            } else {
              item.isEnable = '1'
            }
            // 同上，转换另一个布尔值
            if (item.isTimeOff === true) {
              item.isTimeOff = '0'
            } else {
              item.isTimeOff = '1'
            }
          })
          // 调用接口保存加班配置
          await overtimeSave(deductionList)
          // 触发父组件的数据搜索事件
          this.$emit('dataSearch')
          // 关闭当前弹窗或对话框
          this.handleClose()
        }
      })
    },
    /**
     * 处理标签点击事件
     * 根据点击的标签类型，触发相应的部门 ID 变更处理函数
     * @param {Object} tab - 被点击的标签对象，包含标签的 index 属性
     * @param {Event} event - 点击事件对象
     */
    handleClick(tab, event) {
      // 当点击的标签索引为 0 时，检查 formBase 部门 ID 是否为空
      if (tab.index === '0') {
        if (this.formBase.departmentId !== '') {
          // 如果部门 ID 不为空，则调用 handleChange 方法处理表单基础信息的部门 ID 变更
          this.handleChange(this.formBase.departmentId)
        }
      }
      // 当点击的标签索引为 1 时，检查 leaveBase 部门 ID 是否为空
      if (tab.index === '1') {
        if (this.leaveBase.departmentId !== '') {
          // 如果部门 ID 不为空，则调用 handleChangeLeave 方法处理请假基础信息的部门 ID 变更
          this.handleChangeLeave(this.leaveBase.departmentId)
        }
      } else if (tab.index === '2') {
        // 当点击的标签索引为 2 时，检查 deductionsBase 部门 ID 是否为空
        if (this.deductionsBase.departmentId !== '') {
          // 如果部门 ID 不为空，则调用 handleChangeDeductions 方法处理扣款基础信息的部门 ID 变更
          this.handleChangeDeductions(this.deductionsBase.departmentId)
        }
      } else {
        // 其他情况下，假设是标签索引为 3，检查 overtimeBase 部门 ID 是否为空
        if (this.overtimeBase.departmentId !== '') {
          // 如果部门 ID 不为空，则调用 handleChangeovertime 方法处理加班基础信息的部门 ID 变更
          this.handleChangeovertime(this.overtimeBase.departmentId)
        }
      }
    },
    /**
     * 显示错误提示信息
     *
     * 该方法用于在用户界面中显示一个错误提示消息。它利用了 Element UI 库的 $message 方法。
     * 主要用于反馈某些操作的错误信息，以引导用户正确操作。
     *
     * @param {Object} obj - 包含错误信息的对象。这个对象通常由后端返回的错误数据包装而成，
     *                       包含一个 message 属性，该属性是一个字符串，用于显示具体的错误信息。
     */
    typeTip(obj) {
      this.$message.error(obj)
    },
    /**
     * 处理输入事件
     *
     * 当用户在输入框中输入内容时，此函数被调用。它的目的是对输入的数据进行验证或处理，
     * 确保数据符合预期的格式或类型。在此基础上，可以实现诸如数据格式化、数据范围限制等功能。
     *
     * @param {Event} e - 输入事件对象。包含有关输入事件的详细信息，如触发事件的元素、事件类型等。
     *
     * !：此函数体为空，需要根据实际需求实现相应的输入处理逻辑。
     */
    handleInput: function(e) {
      // ? getInteger(e, this.typeTip)
    },
    /**
     * 处理输入框中的小数点输入。
     * 该方法旨在限制输入框只能输入一个小数点，并确保小数点后至少有一位数字。
     *
     * @param {Event} e - 输入事件对象，包含输入框的当前值和相关上下文。
     *
     * !：该方法的实现应包括检查并阻止多个小数点输入，
     * ! 以及在删除最后一个数字后保留小数点的逻辑。
     */
    handleInputPoint(e) {
      // ? getIntegerPoint(e)
    },
    /**
     * 处理状态更改事件
     *
     * 此函数在用户交互时调用，用于处理与部门状态相关的逻辑。它首先尝试将当前的部门 ID 赋值给传入的对象，
     * 然后检查是否有部门 ID 被选中。如果没有选择部门，函数将显示一个错误消息并阻止进一步的操作。
     *
     * @param {Event} e - 触发事件的对象，通常是从 UI 元素的事件监听器中传入
     * @param {Object} obj - 用于接收更新后部门 ID 的对象
     * @returns {boolean} - 如果没有选择部门，则返回 false，阻止默认行为
     */
    handleStatus(e, obj) {
      // 将当前配置的部门 ID 赋值给传入的对象
      obj.departmentId = this.deductionsBase.departmentId
      // 检查是否有部门 ID 被选中，如果没有则显示错误消息
      if (this.deductionsBase.departmentId === '') {
        this.$message.error('请选择部门')
        return false
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.inputInfo {
  width: 50px;
}

.attentInfo {
  p {
    padding: 3px 0;
  }

  .el-input--medium {
    .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
  }
}

.titmInfo {
  .el-date-editor--timerange.el-input__inner {
    width: 280px;
  }

  .el-date-editor .el-range-separator {
    padding: 0 15px 0 0;
  }
}

.ruleInfo {
  .el-input--medium .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
.tipInfo {
  p {
    padding: 5px 0;
  }
}

.titInfo {
  border-bottom: 1px solid #dcdfe6;
  height: 30px;
  line-height: 30px;
  padding: 0 0 15px;
}

.attentInfo {
  padding: 30px 15px 15px 80px;
}

.ruleInfo {
  .pad {
    padding-left: 80px;
  }
}
</style>
