<template>
  <div class="container">
    <!-- 应用容器 -->
    <div class="app-container">
      <!-- 左侧区域 -->
      <div class="left">
        <!-- 搜索框，用于员工搜索 -->
        <el-input
          v-model="queryParams.keyword"
          placeholder="输入员工姓名全员搜索"
          prefix-icon="el-icon-search"
          size="small"
          style="margin-bottom:10px"
          type="text"
          @input="changeValue"
        />
        <!-- 部门树形组件，用于选择员工所属部门 -->
        <el-tree
          ref="deptTree"
          :data="depts"
          :expand-on-click-node="false"
          :props="defaultProps"
          default-expand-all
          highlight-current
          node-key="id"
          @current-change="selectNode"
        />
      </div>
      <!-- 右侧区域，包含操作按钮和员工列表 -->
      <div class="right">
        <!-- 操作工具栏 -->
        <el-row class="opeate-tools" justify="end" type="flex">
          <!-- 添加员工按钮，权限控制 -->
          <el-button v-permission="'add-employee'" size="mini" type="primary" @click="$router.push('/employee/detail')">
            添加员工
          </el-button>
          <!-- 导入Excel按钮 -->
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <!-- 导出Excel按钮 -->
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 员工列表 -->
        <el-table :data="list">
          <!-- 头像列，显示员工头像或首字母 -->
          <el-table-column align="center" label="头像" prop="staffPhoto">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :size="30" :src="row.staffPhoto" />
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <!-- 姓名列 -->
          <el-table-column label="姓名" prop="username" />
          <!-- 手机号列 -->
          <el-table-column label="手机号" prop="mobile" sortable />
          <!-- 工号列 -->
          <el-table-column label="工号" prop="workNumber" sortable />
          <!-- 聘用形式列，通过不同值显示不同聘用形式 -->
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <!-- 部门列 -->
          <el-table-column label="部门" prop="departmentName" />
          <!-- 入职时间列 -->
          <el-table-column label="入职时间" prop="timeOfEntry" sortable />
          <!-- 操作列，包含查看、角色分配和删除按钮 -->
          <el-table-column label="操作" width="280px">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <el-popconfirm
                title="确认删除该行数据吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button slot="reference" size="mini" style="margin-left:10px" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row align="middle" justify="end" style="height: 60px" type="flex">
          <el-pagination
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            :total="total"
            layout="total,prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <!-- 导入Excel对话框组件 -->
    <import-excel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
    <!-- 角色分配对话框 -->
    <el-dialog :visible.sync="showRoleDialog" title="分配角色">
      <!-- 弹层内容 -->
      <!-- 选择角色的复选框组 -->
      <el-checkbox-group v-model="roleIds">
        <!-- 遍历角色列表生成复选框 -->
        <el-checkbox
          v-for="item in roleList"
          :key="item.id"
          :label="item.id"
        >{{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <!-- 确定和取消按钮 -->
      <el-row slot="footer" justify="center" type="flex">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="btnRoleOK">确定</el-button>
          <el-button size="mini" @click="showRoleDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import {
  getEmployeeList,
  exportEmployee,
  delEmployee,
  getEnableRoleList,
  getEmployeeDetail,
  assignRole
} from '@/api/employee'
import { transListToTreeData } from '@/utils'
import FileSaver from 'file-saver'
import ImportExcel from './components/import-excel.vue'

export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      // 组织结构数据
      depts: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 查询参数
      queryParams: {
        departmentId: null,
        page: 1, // 当前页码
        pagesize: 10,
        keyword: ''
      },
      total: 0, // 员工总数
      list: [], // 员工列表
      // 弹窗控制变量
      showExcelDialog: false, // 控制 excel 的弹层显示和隐藏
      showRoleDialog: false, // 用来控制角色弹层的显示
      roleList: [], // 角色列表
      roleIds: [], // 分配给员工的角色ID列表
      currentUserId: null // 当前操作的员工ID
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    /**
     * 异步获取部门信息并初始化部门列表。
     * 此方法首先获取所有的部门数据，然后将其转换为树形结构的数据格式，
     * 以便在前端展示为树状列表。接着，它设置默认的查询参数为第一个部门的ID，
     * 并在部门树组件渲染完成后，选中这个默认部门。最后，它触发获取员工列表的操作，
     * 这样页面可以显示与所选部门相关的员工信息。
     */
    async getDepartment() {
      // 将获取到的部门数据转换为树形结构数据
      // 初始化部门列表并设置默认查询参数
      this.depts = transListToTreeData(await getDepartment(), 0)
      // 设置默认查询参数为第一个部门的ID
      this.queryParams.departmentId = this.depts[0].id
      // 等待部门树组件渲染完成
      // 等待树形组件渲染完成，设置选中节点
      this.$nextTick(() => {
        // 在渲染完成后，选中默认部门
        // 此时意味着树渲染完毕
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      // 获取与所选部门相关的员工列表
      // 这个时候参数 记录了id
      this.getEmployeeList()
    },
    /**
     * 当选择组织结构中的节点时触发该方法。
     * 主要用于更新查询员工列表的参数，以根据所选节点（部门）进行筛选。
     *
     * @param {Object} node - 被选择的节点对象，包含节点的详细信息。
     * @param {string} node.id - 节点（部门）的唯一标识符。
     */
    selectNode(node) {
      // 根据所选节点更新查询参数中的部门ID，以筛选对应部门的员工列表
      // 根据选择的节点更新查询参数
      this.queryParams.departmentId = node.id // 重新记录了参数
      // 重置页码为第一页，以便开始新的查询
      this.queryParams.page = 1 // 设置第一页
      // 调用方法获取更新后的员工列表
      this.getEmployeeList()
    },
    /**
     * 异步获取员工列表的方法。
     *
     * 通过调用`getEmployeeList`接口，使用`queryParams`作为查询条件，获取员工列表数据。
     * 接口返回的数据包括员工列表（rows）和总条数（total）。
     * 方法将获取到的员工列表赋值给`list`属性，总条数赋值给`total`属性，用于页面展示。
     */
    async getEmployeeList() {
      // 等待接口返回数据
      const { rows, total } = await getEmployeeList(this.queryParams)
      // 更新列表数据和总条数
      this.list = rows
      this.total = total
    },
    /**
     * 切换页面到新的页码。
     *
     * 此方法用于更新查询参数中的页码，并重新触发获取员工列表的操作。
     * 它是用户交互的一部分，允许用户通过页码导航浏览员工列表。
     *
     * @param {number} newPage - 要切换到的新页码。
     */
    changePage(newPage) {
      // 更新查询参数中的页码
      this.queryParams.page = newPage // 赋值新页码
      // 根据更新后的页码重新获取员工列表
      this.getEmployeeList() // 查询数据
    },
    /**
     * 当搜索值改变时触发的函数，用于延迟查询以提高性能。
     *
     * 通过设置定时器，在用户输入停止300毫秒后才执行查询操作。这样可以避免在用户快速输入时频繁发起请求，
     * 减轻服务器压力并提高响应速度。
     *
     * clearTimeout(this.timer) - 取消之前的定时器，以防止在新的输入开始之前，旧的定时器仍然触发查询。
     * setTimeout() - 设置一个新的定时器，当定时器触发时，更新查询参数并重新获取员工列表。
     * this.queryParams.page = 1 - 重置分页到第一页，因为新的搜索应该从第一页开始。
     * this.getEmployeeList() - 发起获取员工列表的请求，使用更新后的查询参数。
     */
    changeValue() {
      // 搜索值改变时延迟查询
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 300)
    },
    /**
     * 导出员工信息为Excel文件
     */
    async exportEmployee() {
      const result = await exportEmployee() // 导出所有的员工接口
      // console.log(result) // 使用一个npm包 直接将blob文件下载到本地 file-saver
      // FileSaver.saveAs(blob对象,文件名称)
      FileSaver.saveAs(result, '员工信息表.xlsx') // 下载文件
    },
    /**
     * 确认删除员工
     *
     * 此方法异步调用删除员工的操作，并根据列表长度和当前页码情况调整页码，
     * 避免因删除后列表为空但页码未更新导致的界面显示问题。最后，它会刷新员工列表
     * 并显示删除成功的提示消息。
     *
     * @param {number} id - 要删除的员工的ID。
     */
    // 删除员工方法
    async confirmDel(id) {
      // 删除员工
      await delEmployee(id)
      // 如果列表为空且当前页码大于1，则页码减1
      if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
      // 刷新员工列表
      this.getEmployeeList()
      // 显示删除成功的消息
      this.$message.success('删除员工成功')
    },
    /**
     * 弹出角色分配对话框，并加载可分配的角色列表和当前员工已有的角色信息。
     * @param {number} id - 员工ID，用于获取员工的角色信息和进行角色分配。
     */
    async btnRole(id) {
      // 获取所有可用的角色列表
      // 弹出角色分配对话框前获取角色列表和当前员工的角色ID
      this.roleList = await getEnableRoleList()
      // 设置当前操作的员工ID
      this.currentUserId = id
      // 获取当前员工已有的角色ID列表
      const { roleIds } = await getEmployeeDetail(id)
      // 设置当前员工已有的角色ID列表
      this.roleIds = roleIds
      // 打开角色分配对话框
      this.showRoleDialog = true // 调整顺序
    },
    /**
     * 确定按钮点击事件处理函数
     * 该函数用于给当前用户分配角色。当用户选择完角色后，通过调用后台接口assignRole，传入用户ID和角色ID集合，
     * 完成角色分配。分配成功后，给出成功提示，并关闭角色分配对话框。
     *
     * @async
     * @returns {void}
     */
    async btnRoleOK() {
      // 调用后台接口分配角色
      // 为员工分配角色
      await assignRole({
        id: this.currentUserId,
        roleIds: this.roleIds
      })
      // 提示角色分配成功，并关闭对话框
      this.$message.success('分配用户角色成功')
      this.showRoleDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;

  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }

  .right {
    flex: 1;
    padding: 20px;

    .opeate-tools {
      margin: 10px;
    }

    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
