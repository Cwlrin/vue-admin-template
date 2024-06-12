<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="220px">
          <!-- 姓名输入框 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" class="inputW" size="mini" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 工号输入框，系统生成，不可修改 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <!-- 工号是系统生成的  禁用这个组件 -->
                <el-input v-model="userInfo.workNumber" class="inputW" disabled size="mini" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 手机号输入框，如果存在路由参数 id，则禁止修改 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input
                  v-model="userInfo.mobile"
                  :disabled="!!$route.params.id"
                  class="inputW"
                  size="mini"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 部门选择框 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <!-- 放置及联部门组件 会单独封装 -->
                <!-- inputW 样式会给到 selectTree 中 template 第一层的组件 -->
                <select-tree v-model="userInfo.departmentId" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 聘用形式选择框 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="userInfo.formOfEmployment" class="inputW" size="mini">
                  <el-option :value="1" label="正式" />
                  <el-option :value="2" label="非正式" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 入职时间选择器 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker
                  v-model="userInfo.timeOfEntry"
                  class="inputW"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 转正时间选择器 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker
                  v-model="userInfo.correctionTime"
                  class="inputW"
                  size="mini"
                  type="date"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工头像上传组件 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 放置上传图片 -->
                <image-upload v-model="userInfo.staffPhoto" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存按钮 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left:220px">
              <el-button size="mini" type="primary" @click="saveData"> 保存更新 </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import SelectTree from './components/select-tree.vue'
import ImageUpload from './components/image-upload.vue'
import { addEmployee, getEmployeeDetail, updateEmployee } from '@/api/employee'

export default {
  components: { SelectTree, ImageUpload },
  data() {
    return {
      // 用户信息对象，包含各种属性用于表单绑定
      userInfo: {
        username: '', // 用户名
        mobile: '', // 手机号
        workNumber: '', // 工号
        formOfEmployment: null, // 聘用形式
        departmentId: null, // 部门 id
        timeOfEntry: '', // 入职时间
        correctionTime: '', // 转正时间
        staffPhoto: '' // 员工头像
      },
      // 表单验证规则
      rules: {
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }, {
          min: 1, max: 4, message: '姓名为1-4位'
        }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, {
          // pattern 正则表达式
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式不正确',
          trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '请选择转正时间', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            if (this.userInfo.timeOfEntry) {
              if (new Date(this.userInfo.timeOfEntry) > new Date(value)) {
                callback(new Error('转正时间不能小于入职时间'))
                return
              }
            }
            callback()
          }
        }]
      }
    }
  },
  created() {
    // 根据路由参数 id 决定是否获取员工详情
    // 如何获取路由参数的中 id
    // if (this.$route.params.id) {this.getEmployeeDetail() }
    this.$route.params.id && this.getEmployeeDetail()
  },
  methods: {
    /**
     * 异步获取指定员工的详细信息。
     *
     * 此方法用于在编辑员工信息的场景下，根据员工 ID 从服务器获取该员工的详细数据，
     * 并将这些数据赋值给 `userInfo` 属性，以在前端展示或编辑。
     * 使用了 `await` 关键字，表明这是一个异步操作，需要等待服务器响应。
     *
     * @returns {Promise<void>} 无返回值，但可能抛出异常。
     */
    async getEmployeeDetail() {
      this.userInfo = await getEmployeeDetail(this.$route.params.id)
    },
    /**
     * 保存或更新员工信息。此方法首先验证表单数据的有效性，然后根据路由参数的存在与否决定是更新还是添加员工信息。
     * 如果路由参数中包含 id，表示当前处于编辑模式，调用更新员工信息的接口；否则，表示处于新增模式，调用添加员工信息的接口。
     * 在数据保存或更新成功后，提示用户操作成功，并跳转到员工列表页面。
     */
    saveData() {
      // 验证表单数据的合法性，如果验证通过，isOK 为 true。
      this.$refs.userForm.validate(async isOK => {
        if (isOK) {
          // 当路由参数中存在 id 时，执行更新员工逻辑
          // 编辑模式
          if (this.$route.params.id) {
            // 编辑模式
            await updateEmployee(this.userInfo)
            // 更新员工信息成功后，提示用户并跳转到员工列表页面
            this.$message.success('更新员工成功')
          } else {
            // 路由参数中不存在 id 时，执行添加员工逻辑
            // 新增模式
            // 校验通过
            await addEmployee(this.userInfo)
            // 添加员工信息成功后，提示用户并跳转到员工列表页面
            this.$message.success('新增员工成功')
          }
          // 无论更新还是添加成功，都跳转到员工列表页面
          this.$router.push('/employee')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-form {
  background: #fff;
  padding: 20px;

  .inputW {
    width: 380px
  }
}
</style>
