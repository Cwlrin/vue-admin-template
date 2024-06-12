<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示部门的树形结构，通过 el-tree 组件实现 -->
      <!-- 展示树形结构 -->
      <el-tree :data="depts" :expand-on-click-node="false" :props="defaultProps" default-expand-all>
        <!-- 自定义节点内容模板 -->
        <!-- 节点结构 -->
        <!-- v-slot="{ node, data }" 只能作用在 template -->
        <template v-slot="{ data }">
          <el-row align="middle" justify="space-between" style="width:100%;height:40px" type="flex">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- 下拉菜单，用于操作部门 -->
              <!-- $event 实参 表示类型 -->
              <el-dropdown @command="operateDept($event, data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作 <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add"> 添加子部门 </el-dropdown-item>
                  <el-dropdown-item command="edit"> 编辑部门 </el-dropdown-item>
                  <el-dropdown-item command="del"> 删除 </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 添加部门的弹窗组件，用于新增和编辑部门 -->
    <!-- 放置弹层 -->
    <!-- 表示会接受子组件的事件  update:showDialog, 值 => 属性 -->
    <!-- ref 可以获取 dom 实例对象 ref 也可以获取自定义组件的实例对象 -->
    <add-dept
      ref="addDept"
      :current-node-id="currentNodeId"
      :show-dialog.sync="showDialog"
      @updateDepartment="getDepartment"
    />
  </div>
</template>
<script>
import { getDepartment, delDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'

export default {
  name: 'Department',
  components: { AddDept },
  data() {
    return {
      currentNodeId: null, // 当前选中节点的 ID
      showDialog: false, // 控制添加 / 编辑部门弹窗的显示状态
      depts: [], // 部门数据
      defaultProps: {
        label: 'name', // 节点显示的字段
        children: 'children' // 子节点的字段
      }
    }
  },
  created() {
    // 初始化时获取部门数据
    this.getDepartment()
  },
  methods: {
    /**
     * 异步获取部门信息。
     *
     * 本函数通过调用 getDepartment 接口，获取所有部门的数据，
     * 并将这些数据转换为树形结构，以便于前端更方便地展示和操作。
     * 使用异步操作确保了在数据未返回前不会阻塞 UI 线程，
     * 提升了用户体验。
     *
     * @returns {void} 无返回值，但更新了 this.depts 属性。
     */
    // 获取部门数据
    async getDepartment() {
      // 获取部门数据的异步调用
      const result = await getDepartment()
      // 将获取到的列表数据转换为树形结构
      // 将列表数据转换为树形数据
      this.depts = transListToTreeData(result, 0)
    },
    /**
     * 根据类型对部门进行操作：添加、编辑、删除。
     * @param {string} type - 操作类型，可以是 'add'、'edit' 或者其他（用于删除操作）。
     * @param {number} id - 部门的唯一标识符，用于添加或编辑时指定部门，删除时指定要删除的部门。
     */
    // 对部门进行操作：添加、编辑、删除
    operateDept(type, id) {
      if (type === 'add') {
        // 显示添加弹窗
        this.showDialog = true
        this.currentNodeId = id
      } else if (type === 'edit') {
        // 显示编辑弹窗
        this.showDialog = true
        this.currentNodeId = id
        // 在弹窗中加载部门详情
        this.$nextTick(() => {
          this.$refs.addDept.getDepartmentDetail()
        })
      } else {
        // 确认删除部门
        this.$confirm('您确认要删除该部门吗').then(async() => {
          await delDepartment(id)
          // 提示消息
          this.$message.success('删除部门成功')
          this.getDepartment()
        })
      }
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}

.tree-manager {
  width: 50px;
  display: inline-block;
  margin: 10px;
}
</style>
