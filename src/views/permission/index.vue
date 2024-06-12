<template>
  <div class="container">
    <div class="app-container">
      <!-- 添加权限按钮，通过点击按钮触发addPermission方法，添加权限点 -->
      <el-button class="btn-add" size="mini" type="primary" @click="addPermission(0, 1)">添加权限</el-button>
      <!-- 数据表格，展示权限列表，通过操作列的按钮可以进行添加、编辑、删除操作 -->
      <el-table :data="list" default-expand-all row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <!-- 添加子权限按钮，仅当行类型为1时显示，点击触发addPermission方法添加子权限 -->
            <el-button v-if="row.type === 1" size="mini" type="text" @click="addPermission(row.id, 2)">添加</el-button>
            <!-- 编辑权限按钮，点击触发editPermission方法编辑权限 -->
            <el-button size="mini" type="text" @click="editPermission(row.id)">编辑</el-button>
            <!-- 删除权限按钮，点击触发delPermission方法删除权限 -->
            <el-button size="mini" type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 权限编辑对话框，用于新增和编辑权限，通过showDialog控制显示和隐藏 -->
    <!-- 弹层中包含权限的表单，通过表单提交触发btnOK方法进行保存 -->
    <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <!-- 权限名称输入框 -->
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <!-- 权限标识输入框 -->
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <!-- 权限描述输入框 -->
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <!-- 开启状态开关 -->
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <!-- 对话框底部操作按钮，包括确定和取消按钮，点击分别触发btnOK和btnCancel方法 -->
      <el-row slot="footer" justify="center" type="flex">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, updatePermission, addPermission, getPermissionDetail, delPermission } from '@/api/permission'
import { transListToTreeData } from '@/utils'

export default {
  data() {
    return {
      list: [], // 权限列表
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型
        pid: '', // 父ID
        enVisible: '0' // 是否开启
      },
      rules: { // 表单验证规则
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false // 是否显示对话框
    }
  },
  computed: {
    showText() { // 根据formData.id判断是编辑还是新增
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList() // 页面创建时获取权限列表
  },
  methods: {
    /**
     * 异步获取权限列表并转换为树形结构数据。
     *
     * 本函数通过调用getPermissionList异步获取权限列表，然后使用transListToTreeData将这些数据转换为树形结构，
     * 以便于在前端以更直观的方式管理权限。其中，树形结构的根节点标识为0。
     *
     * @returns {void} 无返回值，但会修改this.list以包含转换后的树形结构数据。
     */
    async getPermissionList() { // 获取权限列表并转换为树形数据
      this.list = transListToTreeData(await getPermissionList(), 0)
    },
    /**
     * 添加权限方法
     *
     * 本方法用于在系统中添加新的权限。通过接收两个参数来指定新权限的父级ID和类型，
     * 然后将这些信息预填充到表单中，最后打开对话框以供用户完成权限添加操作。
     *
     * @param {Number/String} pid - 新权限的父级ID。用于指定新权限在系统中的位置关系。
     * @param {String} type - 新权限的类型。用于指定新权限的具体类别。
     */
    addPermission(pid, type) { // 添加权限方法，设置formData的pid和type，并打开对话框
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    /**
     * 点击确认按钮时触发的函数。
     * 验证表单数据后，根据是否存在ID来决定是更新权限信息还是新增权限信息。
     * 如果表单验证成功，且formData中存在ID，则调用更新权限的接口；
     * 否则，调用新增权限的接口。
     * 在权限信息成功更新或新增后，显示成功提示，刷新权限列表，并关闭对话框。
     */
    btnOK() {
      this.$refs.perForm.validate().then(() => {
        if (this.formData.id) {
          // 如果formData中有ID，表示是更新操作
          return updatePermission(this.formData)
        }
        // 如果formData中没有ID，表示是新增操作
        return addPermission(this.formData)
      }).then(() => {
        // 权限信息更新或新增成功后，显示成功提示
        // 提示消息
        this.$message.success('新增成功')
        // 刷新权限列表
        this.getPermissionList()
        // 关闭对话框
        this.showDialog = false
      })
    },
    /**
     * 取消按钮点击事件处理函数
     * 该函数用于重置表单数据和对话框的显示状态
     * 当用户点击取消按钮时，撤销当前的表单编辑操作，隐藏对话框，并将表单数据恢复为初始状态
     */
    btnCancel() {
      // 重置表单数据为初始状态
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型
        pid: '', // 父标识
        enVisible: '0' // 是否可见
      }
      // 重置表单验证字段
      this.$refs.perForm.resetFields()
      // 隐藏对话框
      this.showDialog = false
    },
    /**
     * 异步编辑权限。根据提供的权限ID，获取权限的详细信息，
     * 并开启对话框以进行编辑操作。
     *
     * @param {number/string} id - 需要编辑的权限的唯一标识符。
     * @async
     */
    async editPermission(id) { // 编辑权限方法，根据id获取权限详情并打开对话框
      // 使用await等待获取权限详细信息，并将其赋值给formData，用于后续的编辑操作
      this.formData = await getPermissionDetail(id)
      // 打开对话框，准备进行权限编辑
      this.showDialog = true
    },
    /**
     * 异步删除权限。
     * 此方法首先通过弹出确认框来确保用户想要删除所选数据，然后发送删除请求到服务器。
     * 如果删除成功，它将刷新权限列表并显示一条成功消息。
     * 如果出现错误，错误信息将被记录到控制台。
     *
     * @param {number} id - 要删除的权限的唯一标识符。
     */
    async delPermission(id) { // 删除权限方法，通过id删除权限，并刷新列表
      try {
        // 确认删除操作
        await this.$confirm('确定要删除该数据吗')
        // 发送删除请求
        await delPermission(id)
        // 刷新权限列表以反映删除操作的结果
        this.getPermissionList()
        // 显示删除成功的消息
        this.$message.success('删除成功')
      } catch (error) {
        // 记录删除过程中可能出现的错误
        console.log(error)
      }
    }
  }
}
</script>
<style>
.btn-add {
  margin: 10px;
}
</style>
