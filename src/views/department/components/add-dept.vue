<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <!-- 放置弹层内容 -->
    <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="2-10个字符" size="mini" style="width: 80%" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="2-10个字符" size="mini" style="width: 80%" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="managerId">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" size="mini" style="width: 80%">
          <!-- 下拉选项 循环 负责人数据 label 表示显示的字段 value 存储字段 -->
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          :rows="4"
          placeholder="1-100个字符"
          size="mini"
          style="width: 80%"
          type="textarea"
        />
      </el-form-item>
      <el-form-item>
        <!-- 按钮 -->
        <el-row justify="center" type="flex">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="btnOK"> 确定 </el-button>
            <el-button size="mini" @click="close"> 取消 </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { updateDepartment, getDepartmentDetail, getDepartment, getManagerList, addDepartment } from '@/api/department'

/**
 * 部门管理对话框组件
 * 用于新增和编辑部门信息
 */
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      managerList: [], // 负责人列表
      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人 ID
        name: '', // 部门名称
        pid: '' // 父部门 ID
      },
      rules: {
        // 部门编码规则
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门编码的长度为2-10个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            // 自定义校验模式
            validator: async(rule, value, callback) => {
              // value 就是输入的编码
              let result = await getDepartment()
              // 判断是否是编辑模式
              if (this.formData.id) {
                // 编辑场景
                result = result.filter(item => item.id !== this.formData.id)
              }
              // result 数组中是否存在 value 值
              if (result.some(item => item.code === value)) {
                callback(new Error('部门中已经有该编码了'))
              } else {
                callback()
              }
            }
          }
        ],
        // 部门介绍规则
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '部门介绍的长度为1-100个字符', trigger: 'blur' }
        ],
        // 部门负责人 ID 规则
        managerId: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        // 部门名称规则
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称的长度为2-10个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            // 自定义校验模式
            validator: async(rule, value, callback) => {
              // value 就是输入的编码
              let result = await getDepartment()
              if (this.formData.id) {
                // 编辑场景 排除自身
                result = result.filter(item => item.id !== this.formData.id)
              }
              // result 数组中是否存在 value 值
              if (result.some(item => item.name === value)) {
                callback(new Error('部门中已经有该名称了'))
              } else {
                callback()
              }
            }
          }] // 部门名称
        // pid: '' // 父级部门的 id 不需要做校验
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    close() {
      // 重置表单数据和状态
      this.formData = {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人 id
        name: '', // 部门名称
        pid: '' // 父级部门的 id
      }
      this.$refs.addDept.resetFields() // 重置表单
      this.$emit('update:showDialog', false)
    },
    /**
     * 异步获取所有负责人列表
     *
     * 本函数通过调用 getManagerList 异步获取负责人列表，并将结果赋值给 managerList 属性。
     * 这允许在组件中显示和操作这些负责人数据，例如在列表中展示或进行相关操作。
     *
     * @returns {void} 本函数无返回值，但会更新组件状态以反映新的负责人列表。
     */
    async getManagerList() {
      // 获取所有负责人列表
      this.managerList = await getManagerList()
    },
    /**
     * 点击确认按钮时触发的函数。
     * 主要负责验证表单数据，并根据数据是否存在 ID 来判断是新增部门还是更新部门信息。
     * 如果表单验证通过，将调用相应的 API 进行部门信息的操作，并在操作成功后关闭对话框并给出成功提示。
     */
    btnOK() {
      // 验证表单数据的合法性
      this.$refs.addDept.validate(async isOK => {
        if (isOK) {
          let msg = '新增'
          // 检查 formData 中是否有 ID，以确定是更新部门还是新增部门
          if (this.formData.id) {
            // 设置消息为"更新"，准备调用更新部门的 API
            msg = '更新'
            // 调用更新部门的异步函数
            await updateDepartment(this.formData)
          } else {
            // 设置部门的父 ID 为当前选中的节点 ID，然后调用新增部门的异步函数
            await addDepartment({ ...this.formData, pid: this.currentNodeId })
          }
          // 发送信号给父组件，提示部门信息已更新
          this.$emit('updateDepartment')
          // 显示成功提示消息
          this.$message.success(`${msg} 部门成功 `)
          // 关闭当前对话框
          this.close()
        }
      })
    },
    /**
     * 异步获取当前选中部门的详细信息。
     *
     * 此方法通过调用 getDepartmentDetail 函数，并使用当前选中的节点 ID 作为参数，
     * 来获取对应部门的详细数据。它使用了 await 关键字来等待异步操作的完成，
     * 并将获取到的数据赋值给 formData，以便在界面上显示。
     *
     * @returns {Promise<void>} 无返回值，但会更新 formData 的值。
     */
    async getDepartmentDetail() {
      // 使用 getDepartmentDetail 函数请求数据，并将返回的结果赋值给 formData
      this.formData = await getDepartmentDetail(this.currentNodeId)
    }
  }
}
</script>
