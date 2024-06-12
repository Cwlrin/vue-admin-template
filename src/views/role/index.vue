<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容区域 -->
      <div class="role-operate">
        <!-- 添加角色按钮，点击打开添加角色对话框 -->
        <el-button size="mini" type="primary" @click="showDialog = true"> 添加角色</el-button>
      </div>
      <!-- 数据表格，展示角色列表 -->
      <el-table :data="list">
        <!-- 角色列，展示角色名称，可编辑 -->
        <el-table-column align="center" label="角色" prop="name" width="200">
          <template v-slot="{ row }">
            <!-- 编辑状态显示输入框，否则显示角色名称 -->
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <!-- 启用状态列，展示角色启用状态，可编辑 -->
        <el-table-column align="center" label="启用" prop="state" width="200">
          <template v-slot="{ row }">
            <!-- 编辑状态显示开关，否则显示启用状态文本 -->
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>  {{ row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无" }} </span>
          </template>
        </el-table-column>
        <!-- 描述列，展示角色描述，可编辑 -->
        <el-table-column align="center" label="描述" prop="description">
          <template v-slot="{ row }">
            <!-- 编辑状态显示输入框，否则显示角色描述 -->
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <!-- 操作列，提供编辑、分配权限、删除操作 -->
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <!-- 编辑状态下的操作按钮 -->
            <template v-if="row.isEdit">
              <!-- 确定编辑按钮，提交编辑后的角色信息 -->
              <el-button size="mini" type="primary" @click="btnEditOK(row)"> 确定</el-button>
              <!-- 取消编辑按钮，撤销编辑 -->
              <el-button size="mini" @click="row.isEdit = false"> 取消</el-button>
            </template>
            <!-- 非编辑状态下的操作按钮 -->
            <template v-else>
              <!-- 分配权限按钮，点击打开权限分配对话框 -->
              <el-button size="mini" type="text" @click="btnPermission(row.id)"> 分配权限</el-button>
              <!-- 编辑按钮，将角色切换到编辑状态 -->
              <el-button size="mini" type="text" @click="btnEditRow(row)"> 编辑</el-button>
              <!-- 删除按钮，确认后删除角色 -->
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button slot="reference" size="mini" style="margin-left:10px" type="text"> 删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件，用于分页浏览角色列表 -->
      <el-row align="middle" justify="end" style="height:60px" type="flex">
        <el-pagination
          :current-page="pageParams.page"
          :page-size="pageParams.pagesize"
          :total="pageParams.total"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 添加角色对话框，用于添加新角色 -->
    <el-dialog :visible.sync="showDialog" title="新增角色" width="500px" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <!-- 角色名称输入框 -->
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" size="mini" style="width:300px" />
        </el-form-item>
        <!-- 启用状态开关 -->
        <el-form-item label="启用" prop="state">
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <!-- 角色描述输入框 -->
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" :rows="3" size="mini" style="width:300px" type="textarea" />
        </el-form-item>
        <!-- 对话框操作按钮 -->
        <el-form-item>
          <el-row justify="center" type="flex">
            <el-col :span="12">
              <!-- 确定按钮，提交新增角色信息 -->
              <el-button size="mini" type="primary" @click="btnOK"> 确定</el-button>
              <!-- 取消按钮，关闭对话框 -->
              <el-button size="mini" @click="btnCancel"> 取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分配权限对话框，用于为角色分配权限 -->
    <el-dialog :visible.sync="showPermissionDialog" title="分配权限">
      <!-- 权限树组件，展示可分配的权限列表 -->
      <el-tree
        ref="permTree"
        :data="permissionData"
        :default-checked-keys="permIds"
        :props="{ label: 'name' }"
        check-strictly
        default-expand-all
        node-key="id"
        show-checkbox
      />
      <!-- 对话框操作按钮 -->
      <el-row slot="footer" justify="center" type="flex">
        <el-col :span="6">
          <!-- 确定按钮，提交权限分配信息 -->
          <el-button size="mini" type="primary" @click="btnPermissionOK"> 确定</el-button>
          <!-- 取消按钮，关闭对话框 -->
          <el-button size="mini" @click="showPermissionDialog = false"> 取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, delRole, getRoleDetail, assignPerm } from '@/api/role'
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'

export default {
  name: 'Role',
  data() {
    return {
      list: [],
      showDialog: false, // 控制弹层显示隐藏
      // 将分页信息放置到一个对象中
      pageParams: {
        page: 1, // 第几页
        pagesize: 5, // 每页多少条
        total: 0
      },
      roleForm: {
        name: '',
        description: '',
        state: 0 // 默认未 1 启用 关闭 0 打开 1
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      showPermissionDialog: false,
      permissionData: [],
      currentRoleId: null,
      permIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    /**
     * 异步获取角色列表数据。
     *
     * 本函数通过调用 getRoleList 接口，使用当前的分页参数来获取角色列表。
     * 获取到的数据包括角色列表的项和总数量。列表数据被赋值给 this.list，同时更新分页参数中的总数量。
     * 对于列表中的每个项，添加 isEdit 属性用于标识是否处于编辑状态，并初始化为 false。
     * 同时，为每个角色项创建一个 editRow 对象，用于存储角色的编辑前状态。
     * 这样做的目的是为了在角色编辑前后进行状态对比，确保数据的正确更新。
     */
    async getRoleList() {
      /* 调用接口获取角色列表和总数 */
      const { rows, total } = await getRoleList(this.pageParams)
      /* 分配获取的数据到列表，并更新总项数 */
      this.list = rows // 赋值数据
      this.pageParams.total = total
      /* 遍历列表，为每个角色项添加 isEdit 和 editRow 属性 */
      this.list.forEach(item => {
        /**
         *  初始化角色项的编辑状态为 false
         * item.isEdit = false // 添加一个属性 初始值为 false
         * 为角色项添加 editRow 属性，用于存储原始数据
         * 数据响应式的问题  数据变化 视图更新
         * 添加的动态属性 不具备响应式特点
         * this.$set(目标对象, 属性名称, 初始值) 可以针对目标对象 添加的属性 添加响应式
         */
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    /**
     * 分页切换时获取新的角色列表
     *
     * 此方法用于在用户交互中更新当前的分页参数，并触发获取新角色列表的操作。
     * 它通过修改 pageParams 对象中的 page 属性来实现页码的更新，并调用 getRoleList 方法来获取对应页码的角色列表数据。
     * 这种设计允许应用根据用户的分页操作动态加载数据，提高用户体验。
     *
     * @param {number} newPage - 新的页码，用于切换到目标页。
     */
    changePage(newPage) {
      this.pageParams.page = newPage // 赋值当前页码
      this.getRoleList()
    },
    /**
     * 点击确认按钮时执行的操作。
     * 该方法首先验证表单数据的有效性，如果表单数据有效，则添加角色。
     * 添加角色成功后，显示成功消息，刷新角色列表，并关闭对话框。
     */
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    /**
     * 取消添加角色操作并重置表单。
     *
     * 该方法用于用户取消添加角色操作时，重置表单字段至初始状态，并关闭添加角色的对话框。
     * 主要是为了避免用户在多次尝试添加不同角色时，表单数据相互影响。
     *
     * @returns {void} 无返回值。
     */
    btnCancel() {
      // 重置表单数据，使其回到初始状态
      this.$refs.roleForm.resetFields() // 重置表单数据
      // 关闭添加角色对话框
      this.showDialog = false // 关闭弹层
    },
    /**
     * 启动行编辑功能
     *
     * 此函数用于切换一行的数据展示状态到编辑状态。它通过设置行的 isEdit 属性为 true 来标记当前行处于编辑状态，
     * 并将当前行的显示数据复制到编辑数据对象中，以供后续编辑使用。
     *
     * @param {Object} row - 行对象。包含当前行的所有数据和状态属性。
     */
    btnEditRow(row) {
      row.isEdit = true // 改变行的编辑状态
      // 更新缓存数据
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    /**
     * 确认编辑角色信息
     * @param {Object} row - 行数据，包含角色的原始信息和编辑后的信息
     * @description 当用户点击确认编辑按钮时，此函数将被调用。它首先检查编辑后的角色名称和描述是否为空，
     * 如果不为空，则更新角色信息，并给出成功提示。如果为空，则给出警告提示，要求用户填写必填项。
     */
    async btnEditOK(row) {
      // 检查角色名称和描述是否都不为空
      if (row.editRow.name && row.editRow.description) {
        // 更新角色信息，将编辑后的角色信息与原始 ID 合并，然后发送更新请求
        await updateRole({ ...row.editRow, id: row.id })
        // 更新成功后，给出成功提示
        this.$message.success('更新角色成功')
        // 将行数据更新为编辑后的数据，并设置 isEdit 为 false，表示退出编辑模式
        // 更新显示数据  退出编辑状态
        // row.name = row.editRow.name // eslint 的一校验 误判
        // Object.assign(target, source)
        Object.assign(row, {
          ...row.editRow,
          isEdit: false // 退出编辑模式
        }) // 规避 eslint 的误判
      } else {
        // 如果角色名称或描述为空，则给出警告提示
        this.$message.warning('角色和描述不能为空')
      }
    },
    /**
     * 确认删除角色
     *
     * 此函数用于在前端触发删除角色的操作。它首先调用后端接口删除指定 ID 的角色，
     * 然后刷新角色列表，以更新前端显示。如果删除的角色是列表中的最后一个角色，
     * 则页码会向前回滚一页，以确保用户能够看到列表仍为空的情况。
     *
     * @param {number} id - 要删除的角色的 ID。
     */
    async confirmDel(id) {
      // 调用删除角色的后端接口
      await delRole(id) // 后端删除
      // 提示删除成功
      this.$message.success('删除角色成功')
      // 如果删除后列表为空，页码减一
      // 删除的如果是最后一个
      if (this.list.length === 1) this.pageParams.page--
      // 重新获取角色列表，以更新前端显示
      this.getRoleList()
    },
    /**
     * 点击按钮以分配权限
     * @param {number/string} id - 角色 ID，用于获取角色的权限详情
     * @async
     */
    async btnPermission(id) {
      // 设置当前操作的角色 ID
      this.currentRoleId = id
      // 获取角色的权限详情，包括已有的权限 ID
      const { permIds } = await getRoleDetail(id)
      // 将权限 ID 赋值给权限选择器，用于显示已选权限
      this.permIds = permIds
      // 获取所有权限列表，并转换为树状结构，用于权限选择界面显示
      this.permissionData = transListToTreeData(await getPermissionList(), 0)
      // 打开权限分配对话框
      this.showPermissionDialog = true
    },
    /**
     * 异步按钮权限确认操作
     * 此函数用于在角色权限分配中，确认并分配所选权限给指定角色。
     * 它首先调用 `assignPerm` 方法来执行权限分配操作，然后关闭权限分配对话框，并给出成功提示。
     *
     * @async
     * @returns {void}
     */
    async btnPermissionOK() {
      // 调用 assignPerm 方法，传入当前角色 ID 和已选权限 ID 数组，进行权限分配
      await assignPerm({
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      // 权限分配成功后，显示成功消息并关闭权限分配对话框
      this.$message.success('角色分配权限成功')
      this.showPermissionDialog = false
    }
  }
}
</script>

<style scoped>
.role-operate {
  padding: 10px;
}
</style>
