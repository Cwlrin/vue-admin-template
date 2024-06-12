<template>
  <!-- 细节框 -->
  <div class="detailBox">
    <!-- 顶部信息 -->
    <div class="detailTop">
      <!-- 用户头像和信息 -->
      <div>
        <!-- 用户头像 -->
        <img alt height="100" src="@/assets/common/img.jpeg" width="100">
      </div>
      <!-- 用户详情 -->
      <div>
        <!-- 用户名 -->
        <b>{{ sizeForm.user.username }}</b>
        <!-- 职位状态 -->
        <span :class="dutyStatus?'job-txt-green':'job-txt-red'">{{ dutyStatusTxt }}</span>
        <br>
        <!-- 工资、入职时间和电话 -->
        <p>
          <span> 最新工资基数 {{ sizeForm.salaryBase }}  </span>
          &emsp;&emsp;
          <span> 入职时间   {{ sizeForm.user.timeOfEntry | formatDate }}</span>
          &emsp;&emsp;
          <span> 联系电话 {{ sizeForm.user.mobile }}</span>
        </p>
        <br>
        <!-- 社保和公积金开关 -->
        <p>
          本月不缴纳社保
          <el-switch v-model="isPaySocialInMonth" active-color="#13ce66" inactive-color="#ff4949" />&emsp;&emsp;
          本月不缴纳公积金
          <el-switch
            v-model="isPayProvidentInMonth"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </p>
      </div>
    </div>
    <!-- 具体内容框 -->
    <div class="detailContentBox">
      <!-- 社保公积金表格 -->
      <el-form
        ref="sizeForm.userSocialSecurity"
        :model="sizeForm.userSocialSecurity"
        :rules="rules"
        label-width="100px"
        size="mini"
      >
        <!-- 参保城市选择 -->
        <el-form-item label="参保城市" prop="participatingInTheCity">
          <el-select
            v-model="sizeForm.userSocialSecurity.participatingInTheCity"
            placeholder="请选择参保城市"
            value-key="id"
            @change="socialSecurityCityChange"
          >
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>
        <!-- 社保类型选择 -->
        <el-form-item label="社保类型" prop="socialSecurityType">
          <el-select v-model="sizeForm.userSocialSecurity.socialSecurityType" placeholder="请选择社保类型">
            <el-option :value="1" label="首次开户" />
            <el-option :value="2" label="非首次开户" />
          </el-select>
        </el-form-item>
        <!-- 户籍类型选择 -->
        <el-form-item label="户籍类型" prop="householdRegistrationType">
          <el-select v-model="sizeForm.userSocialSecurity.householdRegistrationType" placeholder="请选择户籍类型">
            <el-option :value="1" label="本市城镇" />
            <el-option :value="2" label="本市农村" />
            <el-option :value="3" label="外阜城镇" />
            <el-option :value="4" label="外阜农村" />
          </el-select>
        </el-form-item>
        <!-- 社保基数输入 -->
        <el-form-item label="社保基数" prop="socialSecurityBase">
          <el-input v-model="sizeForm.userSocialSecurity.socialSecurityBase" style="width:38%" type="number" />
          （基数范围是 3387 ~ 25401）
        </el-form-item>
        <!-- 工伤比例输入 -->
        <el-form-item label="工伤比例" prop="industrialInjuryRatio">
          <el-input v-model="sizeForm.userSocialSecurity.industrialInjuryRatio" style="width:38%" type="number" />
          （比例范围是 0.2％ ~ 3％，推荐 0.2％）
        </el-form-item>
        <!-- 社保缴纳详情 -->
        <el-form-item label="社保缴纳">
          <!-- 个人缴纳部分 -->
          <el-form-item label="个人" label-width="74px" style="display:inline-block">
            <el-input
              v-model="personalPayment"
              :disabled="true"
              inline="true"
              placeholder="个人"
              style="width:100%"
            />
          </el-form-item>
          <!-- 公司缴纳部分 -->
          <el-form-item label="公司" label-width="74px" style="display:inline-block">
            <el-input
              v-model="companyPayment"
              :disabled="true"
              inline="true"
              placeholder="企业"
              size="small"
              style="width:100%"
            />
          </el-form-item>
          <!-- 社保缴纳明细表格 -->
          <el-table :data="computePaymentItemList">
            <el-table-column label="缴费项目" prop="name" />
            <el-table-column label="企业基数">
              <template slot-scope="paymentItem">
                <span v-show="paymentItem.row.switchCompany">{{ sizeForm.userSocialSecurity.socialSecurityBase }}</span>
              </template>
            </el-table-column>
            <el-table-column label="企业比例">
              <template slot-scope="paymentItem">
                <span v-show="paymentItem.row.switchCompany">{{ paymentItem.row.scaleCompany }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="企业缴纳">
              <template slot-scope="paymentItem">
                <el-input
                  v-show="paymentItem.row.switchCompany"
                  v-model="paymentItem.row.companyPay"
                  :disabled="true"
                />
              </template>
            </el-table-column>
            <el-table-column label="个人基数">
              <template slot-scope="paymentItem">
                <span v-show="paymentItem.row.switchPersonal">{{ sizeForm.socialSecurityBase }}</span>
              </template>
            </el-table-column>
            <el-table-column label="个人比例">
              <template slot-scope="paymentItem">
                <span v-show="paymentItem.row.switchPersonal">{{ paymentItem.row.scalePersonal }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="个人缴纳">
              <template slot-scope="paymentItem">
                <el-input
                  v-show="paymentItem.row.switchPersonal"
                  v-model="paymentItem.row.personalPay"
                  :disabled="true"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 社保备注输入 -->
        <el-form-item label="社保备注">
          <el-input
            v-model="sizeForm.userSocialSecurity.socialSecurityNotes"
            :rows="2"
            maxlength="300"
            placeholder="1-300字符"
            show-word-limit
            style="width:38%"
            type="textarea"
          />
        </el-form-item>

        <!-- 公积金城市选择 -->
        <el-form-item label="公积金城市" prop="providentFundCity">
          <el-select
            v-model="sizeForm.userSocialSecurity.providentFundCity"
            placeholder="请选择公积金城市"
            value-key="id"
          >
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>
        <!-- 公积金基数输入 -->
        <el-form-item label="公积金基数" prop="providentFundBase">
          <el-input v-model="sizeForm.userSocialSecurity.providentFundBase" style="width:38%" type="number" />
          （基数范围是 2273 ~ 25401）
        </el-form-item>
        <!-- 企业公积金比例输入 -->
        <el-form-item label="企业比例" prop="enterpriseProportion">
          <el-input
            v-model="sizeForm.userSocialSecurity.enterpriseProportion"
            placeholder="12"
            style="width:38%"
            type="number"
          />
          （比例范围是 5％ ~ 12％，推荐 12％ ）
        </el-form-item>
        <!-- 个人公积金比例输入 -->
        <el-form-item label="个人比例" prop="personalProportion">
          <el-input
            v-model="sizeForm.userSocialSecurity.personalProportion"
            placeholder="12"
            style="width:38%"
            type="number"
          />
          （比例范围是 5％ ~ 12％，推荐 12％ ）
        </el-form-item>
        <!-- 公积金缴纳详情 -->
        <el-form-item label="公积金缴纳">
          <!-- 个人缴纳部分 -->
          <el-form-item
            label="个人"
            label-width="50px"
            prop="personalProvidentFundPayment"
            style="display:inline-block"
          >
            <el-input
              v-model="sizeForm.userSocialSecurity.personalProvidentFundPayment"
              inline="true"
              placeholder="个人"
              style="width:100%"
              type="number"
            />
          </el-form-item>
          <!-- 公司缴纳部分 -->
          <el-form-item
            label="公司"
            label-width="50px"
            prop="enterpriseProvidentFundPayment"
            style="display:inline-block"
          >
            <el-input
              v-model="sizeForm.userSocialSecurity.enterpriseProvidentFundPayment"
              inline="true"
              placeholder="企业"
              style="width:100%"
              type="number"
            />
          </el-form-item>
          <!-- 公积金缴纳说明 -->
          <el-form-item style="display:inline-block">
            <span>（为自动测算结果，可手动调整）</span>
          </el-form-item>
        </el-form-item>
        <!-- 公积金备注输入 -->
        <el-form-item label="公积金备注">
          <el-input
            v-model="sizeForm.userSocialSecurity.providentFundNotes"
            :rows="2"
            maxlength="300"
            placeholder="1-300字符"
            show-word-limit
            style="width:38%"
            type="textarea"
          />
        </el-form-item>

        <!-- 提交和取消按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit()"> 保存 </el-button>
          <el-button> 取消 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveContent, getContent, getPaymentItemList } from '@/api/social'

export default {
  name: 'DetailSocial',
  data() {
    /**
     * 验证社保基数是否在合法范围内
     * @param {Object} rule 验证规则
     * @param {Number} value 社保基数值
     * @param {Function} callback 验证回调函数
     */
    var validateSocialSecurityBase = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入社保基数'))
      } else if (value < 3387 || value > 25401) {
        callback(new Error('请不要超出范围，基数范围是3387 ~ 25401'))
      } else {
        callback()
      }
    }

    /**
     * 验证工伤比例是否在合法范围内
     * @param {Object} rule 验证规则
     * @param {Number} value 工伤比例值
     * @param {Function} callback 验证回调函数
     */
    var validateIndustrialInjuryRatio = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入工伤比例'))
      } else if (value < 0.2 || value > 3) {
        callback(new Error('请不要超出范围，比例范围是0.2％ ~ 3％'))
      } else {
        callback()
      }
    }

    /**
     * 验证公积金基数是否在合法范围内
     * @param {Object} rule 验证规则
     * @param {Number} value 公积金基数值
     * @param {Function} callback 验证回调函数
     */
    var validateProvidentFundBase = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入公积金基数'))
      } else if (value < 2273 || value > 25401) {
        callback(new Error('请不要超出范围，基数范围是2273 ~ 25401'))
      } else {
        callback()
      }
    }

    /**
     * 验证企业比例是否在合法范围内
     * @param {Object} rule 验证规则
     * @param {Number} value 企业比例值
     * @param {Function} callback 验证回调函数
     */
    var validateEnterpriseProportion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入企业比例'))
      } else if (value < 5 || value > 12) {
        callback(new Error('请不要超出范围，比例范围是5％ ~ 12％'))
      } else {
        callback()
      }
    }

    /**
     * 验证个人比例是否在合法范围内
     * @param {Object} rule 验证规则
     * @param {Number} value 个人比例值
     * @param {Function} callback 验证回调函数
     */
    var validatePersonalProportion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入个人比例'))
      } else if (value < 5 || value > 12) {
        callback(new Error('请不要超出范围，比例范围是5％ ~ 12％'))
      } else {
        callback()
      }
    }

    return {
      // 社保公积金相关信息的表单数据
      sizeForm: {
        user: {},
        userSocialSecurity: {
          socialSecurityBase: 3387, // 默认社保基数
          industrialInjuryRatio: 0.2 // 默认工伤比例
        }
      },
      cityList: [], // 参保城市列表
      paymentItemList: [], // 缴费项列表
      personalPayment: 0.0, // 个人缴费总额
      companyPayment: 0.0, // 企业缴费总额
      isPaySocialInMonth: false, // 当月是否缴纳社保
      isPayProvidentInMonth: false, // 当月是否缴纳公积金
      rules: { // 表单验证规则
        participatingInTheCity: [
          { required: true, message: '请选择参保城市1234', trigger: 'change' }
        ],
        socialSecurityType: [
          { required: true, message: '请选择社保类型', trigger: 'change' }
        ],
        householdRegistrationType: [
          { required: true, message: '请选择户籍类型', trigger: 'change' }
        ],
        // 社保基数验证规则
        socialSecurityBase: [
          {
            required: true,
            validator: validateSocialSecurityBase,
            trigger: 'blur'
          }
        ],
        // 工伤比例验证规则
        industrialInjuryRatio: [
          {
            required: true,
            validator: validateIndustrialInjuryRatio,
            trigger: 'blur'
          }
        ],
        providentFundCity: [
          { required: true, message: '请选择公积金城市', trigger: 'change' }
        ],
        // 公积金基数验证规则
        providentFundBase: [
          {
            required: true,
            validator: validateProvidentFundBase,
            trigger: 'blur'
          }
        ],
        // 企业比例验证规则
        enterpriseProportion: [
          {
            required: true,
            validator: validateEnterpriseProportion,
            trigger: 'blur'
          }
        ],
        // 个人比例验证规则
        personalProportion: [
          {
            required: true,
            validator: validatePersonalProportion,
            trigger: 'blur'
          }
        ],
        enterpriseProvidentFundPayment: [
          {
            required: true,
            message: '请输入公司公积金缴纳数额',
            trigger: 'change'
          }
        ],
        personalProvidentFundPayment: [
          {
            required: true,
            message: '请输入个人公积金缴纳数额',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    /**
     * 根据用户服务状态获取相应的状态文本。
     *
     * 此方法用于根据用户服务状态属性（inServiceStatus）的值，
     * 确定用户是处于在职状态还是离职状态，并返回相应的文本描述。
     * 在职状态的值通常设定为 1，离职状态则为其他值。
     *
     * @returns {string} 返回用户的服务状态文本， either "在职" 或 "离职"。
     */
    dutyStatusTxt() {
      return this.sizeForm.user.inServiceStatus === 1 ? '在职' : '离职'
    },
    /**
     * 判断用户的服务状态。
     *
     * 本函数用于确定用户当前是否处于服务中状态。它通过比较用户对象中的服务状态字段（inServiceStatus）
     * 是否等于 1 来实现。如果等于 1，则表示用户当前在服务中；否则，表示用户不在服务中。
     *
     * @returns {boolean} 用户的服务状态。返回 true 表示在服务中，返回 false 表示不在服务中。
     */
    dutyStatus() {
      return this.sizeForm.user.inServiceStatus === 1
    },
    /**
     * 计算缴费项列表的总额。
     * 此函数遍历缴费项列表，根据各项的配置计算个人和单位应缴金额，并更新列表中的相应值。
     * 同时，它还根据工伤保险的开关状态，动态设置工伤保险的单位缴费比例。
     *
     * @returns {Array} 返回更新后的缴费项列表。
     */
    computePaymentItemList() {
      // 初始化个人和单位的总缴费金额
      let personalTotal = Number(0)
      let companyTotal = Number(0)

      // 遍历缴费项列表
      this.paymentItemList.forEach(item => {
        // 如果是工伤保险且单位承担，使用配置的工伤保险比例
        if (item.name === '工伤' && item.switchCompany) {
          item.scaleCompany = this.sizeForm.userSocialSecurity.industrialInjuryRatio
        }

        // 如果单位承担该缴费项，计算单位应缴金额并累加到单位总金额
        if (item.switchCompany) {
          item.companyPay = parseFloat(
            (this.sizeForm.userSocialSecurity.socialSecurityBase * item.scaleCompany) / 100
          ).toFixed(2)
          companyTotal = Number(companyTotal + Number(item.companyPay))
        }

        // 如果个人承担该缴费项，计算个人应缴金额并累加到个人总金额
        if (item.switchPersonal) {
          item.personalPay = parseFloat(
            (this.sizeForm.userSocialSecurity.socialSecurityBase * item.scalePersonal) / 100
          ).toFixed(2)
          personalTotal = Number(personalTotal + Number(item.personalPay))
        }
      })
      // gaolyQQ 不能在这里计算
      // this.personalPayment = parseFloat(personalTotal).toFixed(2)
      // this.companyPayment = parseFloat(companyTotal).toFixed(2)
      return this.paymentItemList
    },
    /**
     * 计算企业公积金缴纳金额。
     *
     * 根据员工的公积金基数和企业缴纳比例，计算企业应缴纳的公积金金额。
     * 这个计算是基于百分比的，需要将比例转换为实际金额，并确保结果保留两位小数。
     *
     * @returns {string} 企业应缴纳的公积金金额，以字符串形式返回，保留两位小数。
     */
    computeEnterpriseProvidentFundPayment() {
      return parseFloat(
        (this.sizeForm.userSocialSecurity.enterpriseProportion * this.sizeForm.userSocialSecurity.providentFundBase) /
        100
      ).toFixed(2)
    },
    /**
     * 计算个人公积金缴纳数额。
     *
     * 根据用户社保信息中的个人公积金缴纳比例和个人社保基数，
     * 计算出个人应缴纳的公积金金额。公式为：个人公积金缴纳额 =
     * 社保基数 * 公积金缴纳比例。结果保留两位小数。
     *
     * @returns {string} 个人公积金缴纳数额，以字符串形式返回，保留两位小数。
     */
    computePersonalProvidentFundPayment() {
      return parseFloat(
        (this.sizeForm.userSocialSecurity.personalProportion * this.sizeForm.userSocialSecurity.providentFundBase) / 100
      ).toFixed(2)
    }
  },
  watch: {
    // 监听社保基数、公积金基数、企业及个人比例的变化，用于更新缴费数额
    'sizeForm.userSocialSecurity.providentFundBase': function() {
      this.changeProvidentFundPayment()
    },
    'sizeForm.userSocialSecurity.enterpriseProportion': function() {
      this.changeProvidentFundPayment()
    },
    'sizeForm.userSocialSecurity.personalProportion': function() {
      this.changeProvidentFundPayment()
    },
    'sizeForm.userSocialSecurity.enterprisesPaySocialSecurityThisMonth': function() {
      this.isPaySocialInMonth = this.sizeForm.enterprisesPaySocialSecurityThisMonth === 1
    },
    'sizeForm.userSocialSecurity.enterprisesPayTheProvidentFundThisMonth': function() {
      this.isPayProvidentInMonth = this.sizeForm.enterprisesPayTheProvidentFundThisMonth === 1
    }
  },
  created() {
    // 初始化用户 ID
    this.sizeForm.userId = this.$route.params.id
    // 加载城市列表
    this.getCityList()
    // 获取用户社保公积金详情
    this.getContent()
  },
  methods: {
    /**
     * 当表单提交时执行的操作。
     *
     * 此方法封装了表单提交时所需的数据保存逻辑。通过调用 `saveData` 方法，
     * 实现表单数据的持久化存储或其他必要的处理。此注释解释了为什么选择在表单提交时调用 `saveData`，
     * 即为了执行与表单提交相关的数据保存操作。
     */
    onSubmit() {
      this.saveData()
    },
    /**
     * 当选择的社保城市发生变化时的处理函数
     *
     * 该函数主要负责更新用户社保信息中的参与城市，并根据新选择的城市初始化缴费项目。
     * 这是处理用户界面交互的关键部分，确保了用户选择的城市变化能够正确反映在模型中，
     * 并进一步驱动相关界面更新。
     *
     * @param {Object} obj - 包含新选择的社保城市的对象
     * @param {string} obj.city - 新选择的社保城市名称
     *
     * 注意：该函数不返回任何值，它的作用是更新内部状态和初始化相关设置。
     */
    socialSecurityCityChange(obj) {
      // 更新用户社保信息中的参与城市
      this.sizeForm.userSocialSecurity.participatingInTheCity = obj
      // 根据新选择的城市初始化缴费项目
      this.initPaymentItem(obj)
    },
    /**
     * 保存社保公积金信息
     * 异步操作，通过设置社保公积金的缴纳状态和相关城市信息，然后调用接口保存这些信息。
     * 成功保存后，会显示保存成功的提示消息。
     */
    async saveData() {
      // 根据当前月份的社保和公积金缴纳状态，设置相应的缴纳标志（1 表示缴纳，0 表示未缴纳）
      this.sizeForm.userSocialSecurity.enterprisesPaySocialSecurityThisMonth = this.isPaySocialInMonth ? 1 : 0
      this.sizeForm.userSocialSecurity.enterprisesPayTheProvidentFundThisMonth = this.isPayProvidentInMonth ? 1 : 0
      // 设置用户的 ID，以及社保和公积金缴纳所在城市的信息
      this.sizeForm.userSocialSecurity.userId = this.sizeForm.userId
      var cCity = this.sizeForm.userSocialSecurity.participatingInTheCity
      var fCity = this.sizeForm.userSocialSecurity.providentFundCity
      // 将城市对象的名称和 ID 分离，并分别赋值给相应的属性
      this.sizeForm.userSocialSecurity.participatingInTheCity = cCity.name
      this.sizeForm.userSocialSecurity.participatingInTheCityId = cCity.id
      this.sizeForm.userSocialSecurity.providentFundCity = fCity.name
      this.sizeForm.userSocialSecurity.providentFundCityId = fCity.id
      // 调用 saveContent 函数，传入用户社保公积金信息，保存信息
      await saveContent(this.sizeForm.userSocialSecurity)
      // 保存成功后，显示成功提示消息
      this.$message.success('保存成功')
    },
    // 加载城市列表
    async getCityList() {
      this.cityList = []
    },
    /**
     * 异步获取用户的社保公积金详情。
     * 此函数通过用户的 ID 从服务器获取用户的社保公积金信息，并根据返回的数据更新 UI。
     * 如果用户有社保公积金信息，那么更新 sizeForm 表单并初始化缴费项目；
     * 如果没有社保公积金信息，则更新用户的个人信息。
     *
     * @returns {Promise<void>} 无返回值，但处理了异步操作。
     */
    /**
     * 获取用户社保公积金详情
     */
    async getContent() {
      // 根据用户 ID 获取用户社保公积金信息
      const data = await getContent(this.$route.params.id)
      if (data.userSocialSecurity) {
        // 如果存在 userSocialSecurity，则更新 sizeForm
        this.sizeForm = data
        this.sizeForm.userId = this.$route.params.id
        // 初始化缴费项
        const city = {}
        city.name = this.sizeForm.userSocialSecurity.participatingInTheCity
        city.id = this.sizeForm.userSocialSecurity.participatingInTheCityId
        this.initPaymentItem(city)
      } else {
        // 如果不存在 userSocialSecurity，则更新用户信息
        this.sizeForm.user = data.user
      }
    },
    /**
     * 异步初始化支付项。
     * 此函数用于根据指定的城市 ID 获取支付项列表，并更新支付项列表。
     * @param {Object} city - 城市对象，包含城市 ID。
     */
    async initPaymentItem(city) {
      this.paymentItemList = await getPaymentItemList(city.id)
    },
    /**
     * 计算公积金缴纳金额。
     *
     * 根据企业缴纳比例、个人缴纳比例以及公积金基数，计算并更新企业与个人的公积金缴纳金额。
     * 这一功能旨在提供一个自动计算公积金的机制，以便用户在输入相关比例和基数后，能立即看到对应的缴纳金额。
     *
     * @returns {void} 无返回值，但更新了 this.sizeForm.userSocialSecurity 中的 enterpriseProvidentFundPayment 和个人 ProvidentFundPayment 属性。
     */
    changeProvidentFundPayment() {
      // 计算企业缴纳的公积金金额，并保留两位小数
      this.sizeForm.userSocialSecurity.enterpriseProvidentFundPayment = parseFloat(
        (this.sizeForm.userSocialSecurity.enterpriseProportion * this.sizeForm.userSocialSecurity.providentFundBase) /
        100
      ).toFixed(2)

      // 计算个人缴纳的公积金金额，并保留两位小数
      this.sizeForm.userSocialSecurity.personalProvidentFundPayment = parseFloat(
        (this.sizeForm.userSocialSecurity.personalProportion * this.sizeForm.userSocialSecurity.providentFundBase) /
        100
      ).toFixed(2)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.detailBox {
  margin: 20px;

  .detailTop {
    background: #fff;
    padding: 15px;
    display: flex;

    img {
      border-radius: 50%;
      margin-right: 40px;
      box-shadow: 1px 2px 4px #cccccc;
    }
  }

  .detailContentBox {
    margin: 15px 0;
    padding: 15px;
    background: #fff;
  }
}

.job-txt-green,
.job-txt-red {
  display: inline-block;
  padding: 3px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
}

.job-txt-green {
  background: #67c23a;
  //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.job-txt-red {
  //   padding: 20px;
  background: #f56c6c;
  //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
