<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          placeholder="输入员工姓名全员搜索"
          prefix-icon="el-icon-search"
          size="small"
          style="margin-bottom:10px"
          type="text"
          @input="changeValue"
        />
        <!-- 树形组件 -->
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
      <div class="right">
        <el-row class="opeate-tools" justify="end" type="flex">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column align="center" label="头像" prop="staffPhoto">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :size="30" :src="row.staffPhoto" />
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="手机号" prop="mobile" sortable />
          <el-table-column label="工号" prop="workNumber" sortable />
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable />
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
        <!-- 分页 -->
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
    <!-- 放置导入组件 -->
    <import-excel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
    <el-dialog :visible.sync="showRoleDialog" title="分配角色">
      <!-- 弹层内容 -->
      <!-- checkbox -->
      <el-checkbox-group v-model="roleIds">
        <!-- 放置n个的checkbox  要执行checkbox的存储值 item.id-->
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
      depts: [], // 组织数据
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 存储查询参数
      queryParams: {
        departmentId: null,
        page: 1, // 当前页码
        pagesize: 10,
        keyword: ''
      },
      total: 0, // 记录员工的总数
      list: [], // 存储员工列表数据
      showExcelDialog: false, // 控制 excel 的弹层显示和隐藏
      showRoleDialog: false, // 用来控制角色弹层的显示
      roleList: [], // 接收角色列表
      roleIds: [], // 用来双向绑定数据的
      currentUserId: null // 用来记录当前点击的用户id
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      // 递归方法 将列表转化成树形
      // let result = await getDepartment()
      this.depts = transListToTreeData(await getDepartment(), 0)
      // console.log(this.depts[0])
      this.queryParams.departmentId = this.depts[0].id
      // 设置选中节点
      // 树组件渲染是异步的 等到更新完毕
      this.$nextTick(() => {
        // 此时意味着树渲染完毕
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      // 这个时候参数 记录了id
      this.getEmployeeList()
    },
    selectNode(node) {
      this.queryParams.departmentId = node.id // 重新记录了参数
      this.queryParams.page = 1 // 设置第一页
      this.getEmployeeList()
    },
    // 获取员工列表的方法
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    // 切换页码
    changePage(newPage) {
      this.queryParams.page = newPage // 赋值新页码
      this.getEmployeeList() // 查询数据
    },
    // 输入值内容改变时触发
    changeValue() {
      // 单位时间内只执行最后一次
      // this的实例上赋值了一个timer的属性
      clearTimeout(this.timer) // 清理上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 300)
    },
    /** *
     * 导出员工的excel
     */
    async exportEmployee() {
      const result = await exportEmployee() // 导出所有的员工接口
      // console.log(result) // 使用一个npm包 直接将blob文件下载到本地 file-saver
      // FileSaver.saveAs(blob对象,文件名称)
      FileSaver.saveAs(result, '员工信息表.xlsx') // 下载文件
    },
    // 删除员工方法
    async confirmDel(id) {
      await delEmployee(id)
      if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
      this.getEmployeeList()
      this.$message.success('删除员工成功')
    },
    // 点击角色按钮弹出层
    async btnRole(id) {
      this.roleList = await getEnableRoleList()
      // 记录当前点击的id 因为后边 确定取消要存取给对应的用户
      this.currentUserId = id
      const { roleIds } = await getEmployeeDetail(id)
      this.roleIds = roleIds
      this.showRoleDialog = true // 调整顺序
    },
    // 点击角色的确定
    async btnRoleOK() {
      await assignRole({
        id: this.currentUserId,
        roleIds: this.roleIds
      })
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
