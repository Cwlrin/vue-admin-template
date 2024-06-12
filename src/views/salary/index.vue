<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏组件，用于展示页面操作按钮和提示信息 -->
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <!-- 前面内容插槽，用于显示提示信息 -->
        <template v-slot:before>{{ tipsInfo }}</template>
        <!-- 操作按钮插槽，包含设置和报表查看按钮 -->
        <template>
          <el-button size="mini" type="danger" @click="$router.push('/salarys/setting')"> 设置 </el-button>
          <el-button size="mini" type="primary" @click="$router.push(`/salarys/monthStatement?yearMonth=${yearMonth}`)">
            {{ yearMonth }} 报表
          </el-button>
        </template>
      </page-tools>
      <!-- 条件筛选组件，用于筛选员工列表 -->
      <!-- 条件筛选 -->
      <el-card class="hr-block">
        <el-form label-width="120px">
          <!-- 聘用形式筛选，多选 checkbox 组 -->
          <el-form-item label="聘用形式:">
            <el-checkbox-group v-model="formData.approvalsTypeChecks">
              <el-checkbox
                v-for="item in approvalsType"
                :key="item.id"
                :label="item.id"
                @change="changeParams"
              >{{ item.value }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 员工状态筛选，多选 checkbox 组 -->
          <el-form-item label="员工状态:">
            <el-checkbox-group v-model="formData.approvalsStateChecks">
              <el-checkbox
                v-for="item in approvalsState"
                :key="item.id"
                :label="item.id"
                @change="changeParams"
              >{{ item.value }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 部门筛选，多选 checkbox 组 -->
          <el-form-item label="部门:">
            <el-checkbox-group v-model="formData.departmentChecks">
              <el-checkbox
                v-for="item in departments"
                :key="item.id"
                :label="item.id"
                @change="changeParams"
              >{{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 员工列表组件，展示员工基本信息和工资详情 -->
      <el-card class="hr-block">
        <el-table :data="list" style="width: 100%">
          <!-- 各列定义 -->
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="手机" prop="mobile" />
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column :formatter="formatEmployment" label="聘用形式" prop="formOfEmployment" width="100" />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" width="130">
            <span>{{ new Date("2021-10-22").toLocaleDateString() }}</span>
          </el-table-column>
          <el-table-column :formatter="getMoney" label="工资基数" />
          <el-table-column label="津贴方案" width="100"> 通用方案 </el-table-column>
          <!-- 操作列，包含调薪和定薪按钮，以及查看详情链接 -->
        </el-table>
        <!-- 分页组件，用于分页显示员工列表 -->
        <el-row align="middle" justify="center" style="height: 50px" type="flex">
          <el-pagination
            :current-page="page.page"
            :page-size="page.pageSize"
            :total="page.total"
            background
            layout="prev,pager,next"
            @current-change="changePage"
          />

        </el-row>
      </el-card>
      <!-- 查看弹框，用于显示员工的详细工资信息 -->
      <!-- 查看弹框 -->
      <el-dialog :title="topLabel" :visible.sync="centerDialogVisible" left width="50%">
        <component
          :is="currentComponent"
          :user-id="selectUserId"
          :user-salary="selectedSalaryInfo"
          @onDialogCancel="centerDialogVisible=false"
        />
        <!-- 根据状态显示不同的组件，用于调薪或定薪操作 -->
        <!-- <ChangeSalary v-if="seeState == 'changeSalary'" :user-salary="selectedSalaryInfo" :user-id="selectUserId" @onDialogCancel="centerDialogVisible=false" /> -->
        <!-- <FixedSalary v-if="seeState == 'fixedSalary'" /> -->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getTips, getSalaryDetail } from '@/api/salary'
import { getDepartment } from '@/api/department'
import ChangeSalary from './components/change-salary'
import FixedSalary from './components/fixed-salary'
import pageTools from './components/page-tools.vue'
import { getEmployeeList } from '@/api/salary'

export default {
  name: 'UsersTableIndex',
  components: { ChangeSalary, FixedSalary, pageTools },
  data() {
    return {
      // 查看状态
      seeState: '',
      // 中心对话框可见性
      centerDialogVisible: false,
      // 顶部标签文本
      topLabel: '转正',
      // 聘用类型选项
      approvalsType: [
        {
          id: 1,
          value: '正式'
        },
        {
          id: 2,
          value: '非正式'
        }
      ],
      // 聘用状态选项
      approvalsState: [
        {
          id: '1',
          value: '在职'
        },
        {
          id: '2',
          value: '离职'
        }
      ],
      // 部门列表
      department: [],
      // 补贴方案列表
      subsidyScheme: [],
      // 员工列表
      list: [],
      // 所有部门列表
      departments: [],
      // 加载状态
      loading: false,
      // 分页信息
      page: {
        total: 0,
        page: 1,
        pageSize: 10
      },
      // 提示信息
      tips: {},
      // 年月
      yearMonth: '',
      // 表单数据
      formData: {
        approvalsTypeChecks: [],
        approvalsStateChecks: [],
        departmentChecks: []
      },
      // 选中的薪资信息
      selectedSalaryInfo: {},
      // 选中的用户 ID
      selectUserId: null,
      // 当前组件名称
      currentComponent: ''
    }
  },
  computed: {
    // 计算提示信息文本
    tipsInfo() {
      // return ` 本月 ${this.tips.dateRange}：入职 ${this.tips.worksCount} 离职 ${this.tips.leavesCount} 调薪 ${this.tips.adjustCount} 未定薪 ${this.tips.unGradingCount}`
      return ` 本月 0：入职 0 离职 0 调薪 0 未定薪 0`
    }
  },
  created() {
    // 初始化时获取员工列表和部门信息
    this.getEmployeeList() // 获取工资
    this.getDepartment() // 获取组织
  },
  methods: {
    /**
     * 随机生成一个薪资范围
     *
     * 本函数旨在为应用程序提供一个随机的薪资值，用于表示某个职位的可能薪资范围。
     * 薪资范围被预定义为一个数组，通过随机索引选择其中一个值作为结果返回。
     * 这种方法简单而有效，确保了每次调用时返回的薪资是预设范围内的一个可能值。
     *
     * @returns {number} 随机生成的薪资值，为预定义数组中的一个整数。
     */
    getMoney() {
      // 使用 Math.random 生成 0 到 1 之间的随机数，然后通过 Math.floor 将其转换为整数
      // 以获取数组中的一个随机索引。最终返回该索引对应的薪资值。
      return [3000, 5000, 6000, 8000, 10000, 12000, 15000, 16000][Math.floor(Math.random() * 8)]
    },
    /**
     * 根据就业形式的 ID，查找并返回对应的就业形式文本。
     * 如果找不到匹配的就业形式，则返回'未知'。
     * 此函数用于格式化表格中就业形式这一列的显示内容。
     *
     * @param {Object} row - 表格中的数据行对象。
     * @param {string} row.formOfEmployment - 就业形式的 ID，以字符串形式表示。
     * @returns {string} - 就业形式的文本描述或'未知'。
     */
    formatEmployment(row) {
      // 在 approvalsType 数组中查找与就业形式 ID 匹配的项
      const data = this.approvalsType.find(item => item.id === row.formOfEmployment.toString())
      // 如果找到，则返回就业形式的文本描述；否则返回'未知'
      return data ? data.value : '未知'
    },
    // 异步获取员工列表的方法
    // 通过调用 getEmployeeList 接口，传入当前的分页信息和表单查询数据，获取员工列表和总条数
    async getEmployeeList() {
      // 等待接口返回数据，解构出员工列表和总条数
      const { rows, total } = await getEmployeeList({ ...this.page, ...this.formData })
      // 将获取到的员工列表赋值给 list 属性，用于页面展示
      this.list = rows
      // 更新分页信息中的总条数，以便正确显示分页组件
      this.page.total = total
      // 数据加载完成后，关闭加载状态
      this.loading = false
    },
    // 异步获取部门列表数据
    // 此方法用于异步获取部门列表。它利用了 await 关键字来等待 getDepartment 函数的完成，
    // 并将返回的部门列表赋值给 this.departments，以便在组件中使用。
    // 异步获取部门列表数据
    async getDepartment() {
      // 发起请求，获取并更新部门列表
      // 从后端获取部门列表数据，并更新部门列表
      this.departments = await getDepartment()
    },
    // 异步获取提示信息并更新组件状态
    // 获取提示信息
    async getTips() {
      // 发起请求获取提示信息
      const { tipsRes } = await getTips()
      // 更新组件数据，将获取到的提示信息显示在组件中
      this.tips = tipsRes
    },
    /**
     * 改变当前页码以获取新的员工列表
     *
     * 此方法用于在分页情况下，更新当前的页码并重新请求员工列表数据。
     * 它通过设置页面的页码属性为新的页码值，然后调用 `getEmployeeList` 方法来刷新显示的数据。
     * 这样可以在用户交互时动态更新页面内容，无需重新加载整个页面。
     *
     * @param {number} newPage - 新的页码值，用于导航到不同的页面。
     */
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    /**
     * 异步处理薪资调整操作。
     * 此函数被调用时，将准备并显示与特定用户薪资调整相关的详细信息。
     *
     * @param {string} key - 指定当前操作的组件键名，用于切换界面显示。
     * @param {string} userId - 需要进行薪资调整的用户的 ID，用于获取该用户的薪资详情。
     * @returns {Promise<void>} - 无返回值，但异步加载了用户的薪资详情。
     */
    async changeSalary(key, userId) {
      // 设置当前操作的标签，此处为“调薪”
      this.topLabel = '调薪'
      // 切换到相应的组件，以显示薪资调整界面
      this.currentComponent = key
      // 打开对话框，准备显示薪资详情
      this.centerDialogVisible = true
      // 选中需要调整薪资的用户
      this.selectUserId = userId
      // 异步获取并显示选中用户的薪资详情
      this.selectedSalaryInfo = await getSalaryDetail(userId)
    },
    /**
     * 触定薪操作的对话框。
     *
     * 此函数用于启动一个用于处理定薪操作的对话框。它通过设置顶部标签文字、当前组件标识以及对话框的可见性状态，来准备并显示对话框。
     * 这是一个重要的操作，因此需要用户通过对话框进行确认或输入额外的信息。
     *
     * @param {string} key - 当前操作的组件标识。用于确定对话框中显示的具体内容或操作。
     */
    fixedSalary(key) {
      this.topLabel = '定薪' // 设置对话框顶部的标签为“定薪”。
      this.currentComponent = key // 设置当前操作的组件为 key 所代表的组件。
      this.centerDialogVisible = true // 将对话框的可见性设置为 true，以显示对话框。
    },
    /**
     * 当查询参数变化时重新加载员工列表。
     *
     * 本函数旨在处理查询参数变化的情形，通过重置分页信息为第一页，并重新调用获取员工列表的接口，
     * 来确保数据的刷新。在参数变化导致的数据刷新需求中，这是一个典型的响应式处理方式。
     *
     * 页面重载策略是重置分页到第一页，这是因为参数变化可能导致当前页的数据不再适用，需要从新页开始加载数据。
     * 这种策略保证了用户在更改查询参数后能够看到更新后的数据列表，而不是停留在当前页的旧数据上。
     */
    changeParams() {
      // 重置页码到第一页，以便开始新的查询
      this.page.page = 1 // 重置第一页
      // 调用获取员工列表的方法，刷新数据
      this.getEmployeeList() // 重新拉取工资数据
    }
  }
}
</script>
