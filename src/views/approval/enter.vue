<template>
  <div class="enterApproval">
    <!-- 左侧内容区域，展示申请人的基本信息和申请内容 -->
    <div class="contLeft">
      <div class="topTit">
        <!-- 申请人头像 -->
        <img alt="" src="@/assets/common/img.jpeg">
        <div class="info">
          <!-- 申请人姓名 -->
          <p class="name"><strong> {{ information.user.fullName }} </strong></p>
          <!-- 申请人学历和毕业院校 -->
          <p><span> 学历：{{ information.user.academic }}</span> 毕业院校： {{ information.user.college }}</p>
          <!-- 申请人入职部门和岗位 -->
          <p><span> 入职部门： {{ information.user.department }}</span> 入职岗位：{{ information.user.post }}</p>
        </div>
      </div>
      <!-- 申请内容展示 -->
      <div class="content">
        <p v-for="(item, index) in information.body" :key="index"><span>{{ item.key }} </span> {{ item.val }}</p>
      </div>
    </div>
    <!-- 右侧内容区域，展示审批记录 -->
    <div class="contRit">
      <div class="topTit"><strong> 审批记录 </strong></div>
      <div class="Items">
        <!-- 审批记录列表 -->
        <li v-for="(item, index) in reviewHistoryDataes" :key="index">
          <div class="name">
            <!-- 审批时间 -->
            <p>{{ item.opTime }}</p>
            <!-- 审批备注 -->
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
import { information, reviewHistory } from '@/api/approval'

export default {
  name: 'UsersTableIndex',
  components: {},
  data() {
    return {
      // 申请信息
      information: {},
      // 审批记录数据
      reviewHistoryDataes: {}
    }
  },
  created() {
    // 页面创建时获取申请信息
    this.getInformation()
  },
  methods: {
    /**
     * 异步获取申请信息。
     *
     * 该方法通过调用 `information` 函数，传入特定的 id（此处为 1），来获取相关的申请信息。
     * 获取信息后，不直接处理返回的数据，而是先调用 `getReviewHistory` 方法，可能是为了获取或更新审批记录，
     * 然后将获取到的申请信息数据赋值给 `this.information`，以在组件中使用或展示。
     *
     * @async
     * @returns {void}
     */
    async getInformation() {
      // 发起请求获取申请信息
      const { data } = await information({ id: 1 })
      // 调用方法获取审批记录，此处没有详细注释，因为具体功能已在方法名中体现
      this.getReviewHistory()
      // 设置申请信息，供组件使用
      this.information = data
    },
    /**
     * 异步获取指定 ID 的审批历史记录。
     *
     * 此函数通过调用 reviewHistory API，使用给定的 ID 查询审批历史数据。
     * 查询结果将更新到组件的 data 属性 reviewHistoryDataes 中，供前端界面展示。
     *
     * @param {number} id - 需要查询审批历史的记录 ID。
     * @async
     */
    async getReviewHistory(id) {
      // 发起请求并等待响应
      const { data } = await reviewHistory({ id: 1 })
      // 更新组件数据，展示查询到的审批历史记录
      // 设置审批记录数据
      this.reviewHistoryDataes = data
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./../../styles/variables";

.enterApproval {
  display: flex;
  padding: 15px;
  margin-top: 15px;

  .contLeft {
    flex: 4;
    background: #fff;
    margin-right: 10px;
    padding: 20px;

    // 申请人基本信息区域
    .topTit {
      display: flex;
      border-bottom: solid 1px #ccc;

      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }

      // 省略了不相关的样式和代码...
    }

    // 申请内容展示区域
    .content {
      padding: 10px 0;
      min-height: 500px;

      p {
        margin: 25px 0;

        span {
          display: inline-block;
          width: 80px;
          margin-right: 20px;
          color: #999;
          border-right: solid 1px #ccc;
        }
      }
    }
  }

  .contRit {
    flex: 1;
    background: #fff;
    padding: 0 20px;

    // 审批记录标题
    .topTit {
      margin-bottom: 10px;
      border-bottom: solid 1px #ccc;
      line-height: 40px;
    }

    // 审批记录列表区域
    .Items {
      padding: 20px 0;

      li {
        display: flex;
        min-height: 70px;

        // 审批时间及备注区域
        .name {
          position: relative;
          text-align: center;
          line-height: 24px;
          padding: 0 0 10px 0;
          flex: 3;
          border-right: solid 1px #ccc;
        }

        // 审批操作区域
        .act {
          flex: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>

