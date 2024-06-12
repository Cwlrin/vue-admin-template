<template>
  <div class="quitApproval">
    <!-- 左侧内容区域，展示离职申请人的基本信息和申请详情 -->
    <div class="contLeft">
      <h2>{{ information.user_name }} 申请离职 </h2>
      <div class="topTit">
        <img alt src="@/assets/common/img.jpeg">
        <div class="info">
          <p class="name">
            <strong>{{ information.username }}</strong>
          </p>
          <p>
            <span> 部门：{{ information.departmentName }}</span>
          </p>
          <p>
            <span> 入职时间： {{ information.timeOfEntry | formatDate }}</span>
          </p>
        </div>
      </div>
      <div class="content">
        <!-- 申请详情，展示申请人的离职类型、期望离职时间和离职原因 -->
        <p>
          <span> 申请类型：</span> 离职
        </p>
        <p>
          <span> 期望离职时间：</span>
          {{ information.data.exceptTime | formatDate }}
        </p>
        <p>
          <span> 离职原因：</span>
          {{ information.data.reason }}
        </p>
      </div>
    </div>
    <!-- 右侧内容区域，展示离职申请的审批记录 -->
    <div class="contRit">
      <div class="topTit">
        <strong> 审批记录 </strong>
      </div>
      <div class="Items">
        <!-- 审批记录列表，遍历显示每个审批人的处理时间和结果 -->
        <li v-for="(item, index) in taskInstanceOutList" :key="index">
          <div class="name">
            <p>{{ item.handleTime | formatDate }}</p>
          </div>
          <div class="act">
            <strong>{{ item.shouldUserName }}</strong>
            <!-- 根据不同的 handleType 显示不同的审批状态 -->
            <span v-if="item.handleType == '3'"> 审批驳回 </span>
            <span v-else-if="item.handleType == '4'"> 已撤销 </span>
            <span v-else-if="item.handleType == '1'"> 未开始 </span>
            <span v-else-if="item.handleType == '2'"> 审批通过 </span>
            <span v-else> 审批中 </span>
          </div>
        </li>
        <li />
      </div>
    </div>
  </div>
</template>

<script>
import { getApprovalsDetail, getApprovalsTaskDetail, downImg } from '@/api/approval'

export default {
  name: 'UsersTableIndex',

  data() {
    return {
      approvalId: this.$route.params.id, // 用于获取审批详情和任务详情的 ID
      information: {
        data: {}
      }, // 存储离职申请人的信息和申请详情
      taskInstanceOutList: [], // 存储审批记录列表
      imgs: '' // 用于存储图片的 base64 编码
    }
  },
  created() {
    // 页面创建时获取离职申请的详情和审批记录
    this.getApprovalsDetail()
    this.getApprovalsTaskDetail()
  },
  methods: {
    /**
     * 异步获取审批详情并解析流程数据。
     * 此方法用于通过审批 ID 获取特定审批实例的详细信息。
     * 它首先等待 getApprovalsDetail 异步函数的结果，该函数使用 approvalId 作为参数。
     * 接着，它将返回的 information 对象中的 procData 字段解析为 JSON，以获取更具体的流程数据。
     * 这样做的目的是为了方便对流程数据的进一步处理和使用。
     */
    async getApprovalsDetail() {
      this.information = await getApprovalsDetail(this.approvalId)
      // 解析处理数据字段，将其转换为 JSON 格式
      this.information.data = JSON.parse(this.information.procData)
    },
    /**
     * 异步方法：获取审批任务的详细信息。
     * 此方法用于通过审批流程 ID 获取特定离职申请的审批任务详情。
     * 它使用了 await 关键字来等待异步调用的结果，并将结果赋值给 taskInstanceOutList 属性。
     *
     * @returns {void} 无返回值，但更新了 taskInstanceOutList 属性。
     */
    async getApprovalsTaskDetail() {
      // 使用 await 等待获取审批任务详情的异步操作完成，并将结果赋值给 taskInstanceOutList
      this.taskInstanceOutList = await getApprovalsTaskDetail(this.approvalId)
    },
    /**
     * 异步获取审查历史记录中的图片，并将其转换为 base64 格式用于显示。
     *
     * 此函数通过一个特定的 id 异步请求图片数据。请求返回后，它将二进制图片数据转换为 base64 格式，
     * 以便可以在浏览器中直接显示图片。这种处理图片数据的方式对于从服务器获取图片并将其
     * 直接嵌入到 HTML 中非常有用，可以减少对服务器的请求并提高页面加载速度。
     *
     * @param {string} id - 图片的唯一标识符，用于从服务器请求图片数据。
     */
    async getReviewHistory(id) {
      // 向服务器发送请求以下载图片，并等待响应。
      const response = await downImg(id)
      // 将二进制数据转换为 base64 编码，用于图片显示
      this.imgs = 'data:image/png;base64,' + btoa(
        new Uint8Array(response.request.response).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
    }
  }
}
</script>
