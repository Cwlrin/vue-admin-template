<template>
  <div class="add-form">
    <!-- 弹出窗口用于新增或编辑流程 -->
    <el-dialog :visible.sync="dialogFormVisible" title="转正审批">
      <el-form ref="dataForm" :model="formData" label-position="right" label-width="100px">
        <!-- 选择流程类型 -->
        <el-form-item label="应用：" prop="processType">
          <el-select v-model="formData.processType" class="filter-item" filterable>
            <el-option
              v-for="item in baseData.approvalType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 节点列表，可新增、编辑节点 -->
        <el-form-item label="节点：">
          <p><strong />
            <el-button
              icon="el-icon-circle-plus-outline"
              size="small"
              type="primary"
              @click="addTemp"
            >新增节点
            </el-button>
          </p>
          <div
            v-for="(item, index) in tempList"
            :key="item.key"
            :label="'域名' + index"
            :prop="'item.' + index + '.name'"
            style="border-top:1px solid #ececec;margin-top:10px;"
          >
            <el-form-item label="名称：" prop="formOfEmployment" style="padding:10px 0;">
              <el-input v-model="item.name" style="width:300px;" />
            </el-form-item>
            <el-form-item label="执行人：" prop="formOfEmployment">
              <el-select v-model="item.user" class="filter-item" multiple style="width:300px;">
                <el-option
                  v-for="item in getEmploySimpleData"
                  :key="item.id"
                  :label="item.fullName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveBtn">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getManagerList } from '@/api/department'
import { process } from '@/api/approvals'
import commonApi from '@/api/constant/approvals'

/**
 * 设置页面，用于配置审批流程
 */
export default {
  name: 'Setting',
  props: ['setData'],
  data() {
    return {
      dialogFormVisible: false, // 控制弹出窗口的可见性
      activeName: 'first',
      Data: [],
      formData: {
        processType: '', // 流程类型
        points: [] // 节点配置
      },
      tempList: [], // 临时存储节点信息的列表
      baseData: commonApi // 基础数据，包含审批类型等
    }
  },
  created() {
    // 初始化时获取员工列表
    this.getEmploySimple()
  },
  methods: {
    // 获取员工列表
    async getEmploySimple() {
      this.Data = await getManagerList()
    },
    // 弹出对话框
    dialogFormV() {
      this.dialogFormVisible = true
    },
    // 关闭对话框
    dialogFormH() {
      this.dialogFormVisible = false
    },
    // 保存配置
    saveBtn() {
      // 将tempList中的节点信息转换为formData中的points格式
      for (var i = 0; i < this.tempList.length; i++) {
        var userData = this.tempList[i].user.join(',')
        var data = {
          name: this.tempList[i].name,
          users: userData
        }
        this.formData.points.push(data)
      }
      // 提交流程配置
      process(this.formData)
        .then(() => {
          this.$message.success('流程添加成功！')
          this.dialogFormVisible = false
        })
        .catch(e => {
          this.$message.error('保存失败！')
        })
    },
    // 新增节点
    addTemp() {
      // 当节点数量未达到上限时，新增节点
      if (this.tempList.length < 5) {
        this.tempList = this.tempList || []
        this.tempList.push({
          name: '',
          key: Date.now()
        })
      } else {
        this.$message.error('节点不能超过5个')
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.inputText {
  width: 400px;
  height: 32px;
  resize: none;
  line-height: 22px;
  overflow: hidden;
  font-size: 12px;
  border: 1px solid #dddee1;
  padding: 4px 7px;
  border-radius: 5px;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
.setInfo {
  label {
    margin-right: 15px;
    padding: 0;
  }
}

.el-checkbox + .el-checkbox {
  margin: 0;
}
</style>
