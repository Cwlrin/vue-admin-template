<template>
  <div class="salaryApproval">
    <!-- 左侧内容区域，展示员工信息和详情 -->
    <div class="contLeft">
      <div class="topTit">
        <!-- 员工头像 -->
        <img alt src="@/assets/common/img.jpeg">
        <div class="info">
          <!-- 员工姓名 -->
          <p class="name"><strong> {{ information.user.fullName }} </strong></p>
          <!-- 部门和职位信息 -->
          <p>{{ information.user.department }} | {{ information.user.post }}</p>
          <!-- 入职时间 -->
          <p>{{ information.user.inJobTime }}</p>
        </div>
      </div>
      <!-- 员工详情信息列表 -->
      <div class="content">
        <p v-for="(item, index) in information.body" :key="index"><span>{{ item.key }} </span> {{ item.val }}</p>
      </div>
    </div>
    <!-- 右侧内容区域，展示审批记录 -->
    <div class="contRit">
      <div class="topTit"><strong> 审批记录 </strong></div>
      <!-- 审批记录列表 -->
      <div class="Items">
        <li v-for="(item, index) in reviewHistoryDataes" :key="index">
          <div class="name">
            <!-- 审批时间 -->
            <p>{{ item.opTime }}</p>
            <!-- 审批描述 -->
            <p>{{ item.description }}</p>
          </div>
          <div class="act">
            <!-- 审批人姓名 -->
            <strong>{{ item.opUserName }}</strong>
            <!-- 审批状态文本 -->
            <span v-if="item.state == 1"> 审批中 </span>
            <span v-else-if="item.state == 2"> 审批驳回 </span>
            <span v-else-if="item.state == 3"> 已撤销 </span>
            <span v-else-if="item.state == 4"> 审批通过 </span>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import { getInformation, getReviewHistory } from '@/api/approval'

export default {
  name: 'UsersTableIndex',
  components: {},
  data() {
    return {
      // 员工信息
      information: {},
      // 审批记录数据
      reviewHistoryDataes: {}
    }
  },
  created() {
    // 初始化员工信息和审批记录
    this.getInformation()
    this.getReviewHistory()
  },
  methods: {
    /**
     * 获取员工信息
     */
    async getInformation() {
      this.information = await getInformation({ id: 1 })
    },
    /**
     * 获取审批记录
     * @param {number} id 员工 ID
     */
    async getReviewHistory(id) {
      const { data } = await getReviewHistory({ id: 1 })
      this.reviewHistoryDataes = data
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./../../styles/variables";

.salaryApproval {
  display: flex;
  padding: 15px;

  .contLeft {
    flex: 4;
    background: #fff;
    margin-right: 10px;
    padding: 20px;

    .topTit {
      display: flex;
      border-bottom: solid 1px #ccc;

      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
    }
  }

  .contRit {
    flex: 1;
    background: #fff;
    padding: 0 20px;

    .topTit {
      margin-bottom: 10px;
      border-bottom: solid 1px #ccc;
      line-height: 40px;
    }

    .Items {
      padding: 20px 0;

      li {
        display: flex;
        min-height: 70px;

        .name {
          position: relative;
          text-align: center;
          line-height: 24px;
          padding: 0 0 10px 0;
          flex: 3;
          border-right: solid 1px #ccc;
        }
      }
    }
  }
}
</style>

