<template>
  <div class="quitApproval">
    <!-- 左侧内容区域，展示请假申请的详细信息 -->
    <div class="contLeft">
      <h2>{{ information.user_name }} 申请请假 </h2>
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
        <!-- 展示请假申请的详细信息，如类型、单位、时长等 -->
        <p>
          <span> 申请类型：</span> 请假
        </p>
        <p>
          <span> 请假类型：</span>
          {{ information.data.holidayType == 1 ? '事假' : '调休' }}
        </p>
        <p>
          <span> 申请单位：</span>
          天
        </p>
        <p>
          <span> 开始时间：</span>
          {{ information.data.startTime | formatDate }}
        </p>
        <p>
          <span> 结束时间：</span>
          {{ information.data.endTime | formatDate }}
        </p>
        <p>
          <span> 请假时长：</span>
          {{ information.data.duration }}
        </p>
        <p>
          <span> 申请事由：</span>
          {{ information.data.reason }}
        </p>
      </div>
    </div>
    <!-- 右侧内容区域，展示审批记录 -->
    <div class="contRit">
      <div class="topTit">
        <strong> 审批记录 </strong>
      </div>
      <div class="Items">
        <!-- 遍历审批记录列表，展示每个审批的处理时间、处理人和状态 -->
        <li v-for="(item, index) in taskInstanceOutList" :key="index">
          <div :style="index==taskInstanceOutList.length-1?'border-right:none':''" class="name">
            <p>{{ item.handleTime | formatDate }}</p>
            <!-- <p>{{item.description}}</p> -->
          </div>
          <div class="act">
            <strong>{{ item.handleUserName }}</strong>
            <span v-if="index==0"> 发起申请 </span>
            <span v-else-if="item.handleType == '3'"> 审批驳回 </span>
            <span v-else-if="item.handleType == '4'"> 已撤销 </span>
            <span v-else-if="item.handleType == '1'"> 未开始 </span>
            <span v-else-if="item.handleType == '2'"> 审批通过 </span>
            <span v-else> 审批中 </span>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import { getApprovalsDetail, getApprovalsTaskDetail, downImg } from '@/api/approval'

export default {
  name: 'UsersTableIndex',
  components: {},
  data() {
    return {
      // 请假申请的唯一标识 ID
      approvalId: this.$route.params.id,
      // 请假申请的详细信息
      information: {
        data: {}
      },
      // 审批记录列表
      taskInstanceOutList: [],
      // 用于展示图片的 base64 编码字符串
      imgs: ''
    }
  },
  created() {
    // 页面创建时，获取请假申请的详细信息和审批记录
    this.getApprovalsDetail()
    this.getApprovalsTaskDetail()
  },
  methods: {
    /**
     * 异步获取请假申请的详细信息。
     *
     * 本函数通过调用 getApprovalsDetail 接口，使用 approvalId 获取特定请假申请的详细数据。
     * 获取的数据包括申请的基本信息以及通过 procData 字段解析出的详细流程数据。
     * 解析后的流程数据存储在 information.data 属性中，供后续使用。
     *
     * @ approvesId 请假申请的唯一标识符，用于查询特定申请的详细信息。
     */
    async getApprovalsDetail() {
      // 使用 await 等待接口调用结果，并将结果赋值给 information 属性
      this.information = await getApprovalsDetail(this.approvalId)
      // 解析 procData 字段，将解析后的结果存储在 information.data 属性中
      // 解析流程数据，获取请假申请的具体内容
      this.information.data = JSON.parse(this.information.procData)
    },
    // 异步获取审批任务的详细信息
    // 此函数用于通过审批 ID 获取具体的审批任务细节。它使用了 await 关键字来等待异步调用的结果，
    // 并将结果赋值给 this.taskInstanceOutList，以便在组件中显示审批任务的详细信息。
    // 获取审批记录
    async getApprovalsTaskDetail() {
      this.taskInstanceOutList = await getApprovalsTaskDetail(this.approvalId)
    },
    /**
     * 异步获取审查历史记录中的图片。
     * 此函数通过一个特定的 ID 来请求图片数据，然后将这个数据转换为 base64 编码，用于在页面上显示图片。
     *
     * @param {string} id - 图片的唯一标识符，用于检索图片数据。
     * @async
     */
    async getReviewHistory(id) {
      // 使用 ID 请求图片数据
      const response = await downImg(id)
      // 将二进制图片数据转换为 base64 编码的字符串
      this.imgs = 'data:image/png;base64,' + btoa(
        new Uint8Array(response.request.response).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
    }
  }
}
</script>
