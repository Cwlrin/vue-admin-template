<template>
  <div class="cont-top-box">
    <div class="top-lable">
      <!-- 考勤提醒区域 -->
      <div class="careful-lab"><i class="el-icon-info" /> 有 {{ attendInfo.tobeTaskCount }} 条考勤审批尚未处理 </div>
      <!-- 操作按钮区域 -->
      <div class="lable-tit">
        <!-- 搜索图标和输入框 -->
        <span class="serachInput">
          <i v-show="iconShow" aria-hidden="true" class="fa fa-search" title="搜索" @click="searchIcon" />
          <el-input
            v-show="searchShow"
            v-model="formData.keyword"
            clearable
            placeholder="搜索"
            @clear="handleClear"
            @keyup.enter.native="dataSearch"
          />
        </span>
        <!-- 导入按钮 -->
        <router-link
          :to="{'path':'/employees/import/',query: {name: '考勤'}}"
          class="el-button el-button--primary el-button--mini"
          title="导入"
        > 导入
        </router-link>
        <!-- 提醒按钮，带有未读消息红点 -->
        <el-badge class="item" is-dot>
          <el-button size="mini" title="提醒" type="primary" @click="handleTip"> 提醒 </el-button>
        </el-badge>
        <!-- 设置按钮 -->
        <el-button size="mini" title="设置" type="primary" @click="handleSet"> 设置 </el-button>
        <!-- 历史归档按钮 -->
        <router-link
          :to="{'path':'/attendances/archiving/'}"
          class="el-button el-button--primary el-button--mini"
          title="历史归档"
        > 历史归档
        </router-link>
        <!-- 报表链接，显示当前月份报表 -->
        <router-link
          :to="{'path':'/attendances/report/'+ yearMonth}"
          class="el-button el-button--primary el-button--mini"
        >{{ attendInfo.month }} 月份报表
        </router-link>
      </div>
    </div>
    <!-- 设置弹窗组件 -->
    <!-- 设置 -->
    <component :is="employeesSet" ref="set" @handleCloseModal="handleCloseModal" />
  </div>
</template>

<script>
// import {notify} from '@/api/attendances'
import employeesSet from './set'

export default {
  name: 'AttendancesPageTool',
  components: {
    employeesSet
  },
  props: ['monthOfReport', 'formData', 'attendInfo', 'yearMonth'],
  data() {
    return {
      employeesSet: 'employeesSet',
      dataes: '',
      iconShow: true,
      searchShow: false,
      centerDialogVisible: false
    }
  },
  methods: {
    /**
     * 处理对话框的提交操作。
     * 此函数用于在用户完成某些操作后关闭对话框，并给出一个成功的反馈消息。
     * 它不接受任何参数，也没有返回值。
     */
    handleSub() {
      // 关闭对话框
      this.centerDialogVisible = false
      // 显示成功消息提示
      this.$message.success('提醒成功')
    },
    /**
     * 触发搜索图标点击时的事件处理函数。
     *
     * 该函数的目的是在用户点击搜索图标时，隐藏图标并显示搜索框，
     * 以便用户可以输入搜索关键字。这一行为提高了用户交互的直观性和
     * 操作的便捷性。
     *
     * @remarks
     * 此函数不接受任何参数，也不返回任何值。
     */
    searchIcon() {
      // 隐藏搜索图标，以便聚焦搜索框
      this.iconShow = false
      // 显示搜索框，允许用户输入搜索关键字
      this.searchShow = true
    },
    /**
     * 处理清空搜索操作。
     * 此函数在用户点击清空按钮时被调用，用于重置搜索界面的状态，并通知父组件更新数据列表。
     *
     * @emits dataList 发送当前的表单数据到父组件，用于更新数据列表。
     */
    handleClear() {
      // 显示清空图标
      this.iconShow = true
      // 隐藏搜索框
      this.searchShow = false
      // 触发自定义事件 dataList，传递当前表单数据给父组件
      this.$emit('dataList', this.formData)
    },
    /**
     * 触发数据列表更新事件
     *
     * 该方法用于向父组件发送当前表单数据，通过触发'dataList'事件来实现。
     * 主要用于在表单数据变更后，通知父组件更新相关数据列表或视图。
     *
     * @emits dataList 发送当前表单数据，数据包含在 formData 对象中。
     */
    dataSearch() {
      this.$emit('dataList', this.formData)
    },
    /**
     * 打开设置对话框
     *
     * 本函数用于触发设置对话框的显示。它通过调用 `dialogFormV` 方法来实现，
     * 具体实现逻辑包括但不限于对话框的显示逻辑、数据初始化等。
     *
     * ! 调用本函数前，确保 `$refs.set` 对象已初始化且 `dialogFormV` 方法可用。
     */
    handleSet() {
      this.$refs.set.dialogFormV()
    },
    /**
     * 关闭模态框的处理方法
     *
     * 通过调用 $refs 中的 set 对象的 dialogFormH 方法来关闭模态框。
     * 此方法通常在需要手动关闭模态框时调用，例如在确认操作后关闭。
     */
    handleCloseModal() {
      this.$refs.set.dialogFormH()
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

.top-lable {
  position: relative;
  line-height: 2;

  a {
    // display: inline-block;
    margin: 0;
  }

  .careful-lab {
    i {
      margin-right: 5px;
      color: #409eff;
    }

    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }

  .lable-tit {
    position: absolute;
    right: 0;
    top: 0px;
  }
}

.serachInput {
  .el-input--medium {
    width: 150px;
  }
}

.serachInput .el-input--medium .el-input__inner {
  height: 26px;
  line-height: 26px;
}

.attenInfo {
  p {
    line-height: 30px;
  }
}
</style>
