<template>
  <div class="securitySetting">
    <!-- 设置列表 -->
    <div class="settingList">
      <!-- 请假设置 -->
      <div class="set">
        <span> 请假 </span>
        <span>
          <el-switch
            v-model="levelData.enable"
            :inactive-color="inactiveColor"
            active-color="#13ce66"
            @change="handleChange(levelData,$event)"
          />
        </span>
        <i class="el-icon-setting" @click="setFlow('regular')" />
      </div>
      <!-- 加班设置 -->
      <div class="set">
        <span> 加班 </span>
        <span>
          <el-switch
            v-model="overtimeData.enable"
            :inactive-color="inactiveColor"
            active-color="#13ce66"
            @change="handleChange(overtimeData,$event)"
          />
        </span>
        <i class="el-icon-setting" @click="setFlow('regular')" />
      </div>
      <!-- 离职设置 -->
      <div class="set">
        <span> 离职 </span>
        <span>
          <el-switch
            v-model="dimissionData.enable"
            :inactive-color="inactiveColor"
            active-color="#13ce66"
            @change="handleChange(dimissionData,$event)"
          />
        </span>
        <i class="el-icon-setting" @click="setFlow('regular')" />
      </div>
    </div>
    <!-- 弹窗用于上传流程配置文件 -->
    <el-dialog :visible.sync="dialogVisible" title="提示" width="30%">
      <span style="text-align:center">
        <el-upload
          :before-upload="beforeUpload"
          :file-list="fileList"
          :headers="myheader"
          :on-error="uploadFail"
          :on-success="handleFileSuccess"
          :show-file-list="false"
          action="/api/user/process/deploy"
          class="upload-demo"
          drag
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text"> 将文件拖到此处 </div>
        </el-upload>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="dialogVisible = false"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveSetState,
  getFlowList,
  suspend
} from '@/api/approval'
import { getToken } from '@/utils/auth'

/**
 * 安全设置组件
 * 用于配置请假、加班、离职等审批流程的启用状态，并提供上传流程配置文件的功能。
 */
export default {
  name: 'UsersTableIndex',
  components: {},
  data() {
    return {
      requestData: {},
      activeColor: '#13ce66',
      inactiveColor: '#ccc',
      dialogVisible: false,
      processing: false,
      uploadTip: '点击上传',
      fileList: [],
      dataBase: [],
      levelData: {
        enable: false
      },
      overtimeData: {
        enable: false
      },
      dimissionData: {
        enable: false
      }
    }
  },
  computed: {
    /**
     * 获取 Authorization 头信息
     * @returns {Object} 头信息
     */
    myheader() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  created() {
    this.getFlowList()
  },
  methods: {
    /**
     * 获取流程列表并根据列表状态设置启用开关
     */
    async getFlowList() {
      const data = await getFlowList()
      data.map(item => {
        const items = {
          ...item,
          enable: item.persistentState.suspensionState !== 2
        }
        if (items.key === 'process_leave') {
          this.levelData = items
        } else if (items.key === 'process_dimission') {
          this.dimissionData = items
        } else {
          this.overtimeData = items
        }
      })
    },
    /**
     * 处理开关变化事件
     * @param {Object} obj 数据对象
     * @param {Event} e 事件对象
     */
    handleChange(obj, e) {
      if (!obj.key) {
        this.$message.error('还未上传流程')
        return
      }
      var parent = {
        processKey: obj.key,
        enable: e
      }
      suspend(parent)
    },
    /**
     * 保存设置
     */
    async changeSet() {
      await saveSetState(this.requestData)
      this.$message.success('设置保存成功！')
    },
    /**
     * 打开上传流程配置文件的弹窗
     * @param {string} obj 流程类型
     */
    setFlow(obj) {
      this.dialogVisible = true
    },
    /**
     * 当文件上传操作完成时显示错误信息。
     *
     * @param {Object} obj - 包含错误信息的对象。
     * @returns {void}
     */
    typeTip(obj) {
      this.$message.error(obj)
    },
    /**
     * 文件上传前的钩子
     * @param {File} file 上传的文件
     * @param {Object} obj 数据对象
     */
    beforeUpload(file, obj) {
      // importFilexml(file, obj, this.typeTip)
    },
    /**
     * 文件上传失败的处理函数
     * @param {Error} err 错误信息
     * @param {File} file 上传的文件
     * @param {Array} fileList 文件列表
     */
    uploadFail(err, file, fileList) {
      this.uploadTip = '点击上传'
      this.processing = false
      this.$message.error(err)
    },
    /**
     * 文件上传成功的处理函数
     * @param {Object} obj 返回的结果
     * @param {File} file 上传的文件
     * @param {Array} fileList 文件列表
     */
    handleFileSuccess(obj, file, fileList) {
      this.uploadTip = '点击上传'
      this.processing = false
      this.dialogImportVisible = false
      if (obj.code === 99999) {
        this.$message.error('导入失败' + '!')
      } else {
        this.$message.success('导入成功' + '!')
        this.$router.back(-1)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./../../styles/variables";

$active: #13ce66;
$inactive: #ccc;
.securitySetting {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  margin: 15px;
  border: 1px solid #ebeef5;

  .settingList {
    margin-bottom: 20px;

    .title {
      font-weight: bold;
      line-height: 40px;
      margin-bottom: 20px;
      border-bottom: solid 1px #ccc;
    }

    .set {
      border: solid 1px #ccc;
      border-radius: 3px;
      padding: 15px 30px 15px 20px;
      position: relative;
      display: inline-block;
      margin-right: 20px;

      span:first-child {
        padding-right: 15px;
        border-right: solid 1px #ccc;
        margin-right: 15px;
      }

      .el-icon-setting {
        position: absolute;
        right: 5px;
        top: 5px;
        color: #999;
      }
    }
  }
}
</style>

