<template>
  <div class="cont-top-box">
    <!-- 使用 Element UI 的表单组件进行部门、社保城市、公积金城市的筛选配置 -->
    <el-form label-width="100px">
      <!-- 部门筛选，使用复选框组来选择多个部门 -->
      <el-form-item label="部门">
        <el-checkbox-group v-model="departmentChecks" style="display:inline-block">
          <el-checkbox v-for="item in departmentList" :key="item.id" :label="item.id" @change="checkChange">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 社保城市筛选，使用复选框组来选择多个社保城市 -->
      <el-form-item label="社保城市">
        <el-checkbox-group v-model="socialSecurityChecks" style="display:inline-block">
          <el-checkbox v-for="item in cityList" :key="item" :label="item" @change="checkChange">{{ item }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 公积金城市筛选，使用复选框组来选择多个公积金城市 -->
      <el-form-item label="公积金城市">
        <el-checkbox-group v-model="providentFundChecks" style="display:inline-block">
          <el-checkbox v-for="item in cityList" :key="item" :label="item" @change="checkChange">{{ item }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'

export default {
  name: 'SocialTool',
  data() {
    return {
      // 用于显示提示信息的对象
      tips: {},
      // 关键词搜索输入框的值
      keyword: '',
      // 选中的部门复选框数组
      departmentChecks: [],
      // 选中的社保复选框数组
      socialSecurityChecks: [],
      // 选中的公积金复选框数组
      providentFundChecks: [],
      // 可选的城市列表
      cityList: ['北京', '上海', '深圳', '天津', '重庆', '珠海', '广州', '西安'],
      // 部门列表
      departmentList: []
    }
  },
  created() {
    // 初始化时获取城市列表和部门列表
    this.getCityList()
    this.getDepartment()
  },
  methods: {
    // 异步获取城市列表的方法
    // 获取城市
    async getCityList() {
      // TODO: 实现城市列表的获取逻辑
      // this.cityList = []
    },
    // 异步获取部门列表的方法
    // 获取组织架构
    async getDepartment() {
      // 使用 await 等待获取部门列表，并将其赋值给 departmentList
      this.departmentList = await getDepartment()
    },
    // 当复选框状态改变时触发的方法
    checkChange() {
      // 构造选中参数的对象
      const selectParams = {
        'departmentChecks': this.departmentChecks,
        'socialSecurityChecks': this.socialSecurityChecks,
        'providentFundChecks': this.providentFundChecks
      }
      // 将选中参数的对象传递给父组件的方法
      this.$parent.changeSelectParams && this.$parent.changeSelectParams(selectParams)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.cont-top-box {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

</style>
