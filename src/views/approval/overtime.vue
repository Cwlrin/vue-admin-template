<template>
  <div class="quitApproval">
    <!-- 左侧内容区域，展示审批信息 -->
    <div class="contLeft">
      <div class="topTit">
        <!-- 头像图片 -->
        <img alt src="@/assets/common/img.jpeg">
        <div class="info">
          <!-- 姓名区域 -->
          <p class="name">
            <strong>{{ information.username }}</strong>
          </p>
          <!-- 部门和入职时间信息 -->
          <p>
            <span> 部门：{{ information.departmentName }}</span>
          </p>
          <p>
            <span> 入职时间： {{ information.timeOfEntry | formatDate }}</span>
          </p>
        </div>
      </div>
      <!-- 加班详情区域 -->
      <div class="content">
        <!-- 遍历显示加班详情，此处注释掉的代码为示例 -->
        <!-- <p v-for="(item, index) in information.body" :key="index"><span>{{item.key}} </span> {{item.val}}</p> -->
        <!-- 补偿方式、加班时间、申请原因 -->
        <p>
          <span> 补偿方式：</span>
          调休
        </p>
        <p>
          <span> 加班开始时间：</span>
          {{ information.data.start_time | formatDate }}
        </p>
        <p>
          <span> 加班结束时间：</span>
          {{ information.data.end_time | formatDate }}
        </p>
        <p>
          <span> 申请原因：</span>
          {{ information.data.reason }}
        </p>
      </div>
    </div>
    <!-- 右侧内容区域，展示审批流程记录 -->
    <div class="contRit">
      <div class="topTit">
        <strong> 审批记录 </strong>
      </div>
      <div class="Items">
        <!-- 遍历显示审批记录 -->
        <li v-for="(item, index) in taskInstanceOutList" :key="index">
          <div :style="index==taskInstanceOutList.length-1?'border-right:none':''" class="name">
            <p>{{ item.handleTime | formatDate }}</p>
            <!-- 审批描述，此处注释掉的代码为示例 -->
            <!-- <p>{{item.description}}</p> -->
          </div>
          <div class="act">
            <strong>{{ item.handleUserName }}</strong>
            <!-- 根据处理类型显示不同的审批状态 -->
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
  data() {
    return {
      // 审批 ID，从路由参数中获取
      approvalId: this.$route.params.id,
      // 审批信息对象
      information: {
        data: {}
      },
      // 审批流程记录列表
      taskInstanceOutList: [],
      // 图片下载链接
      imgs: ''
    }
  },
  created() {
    // 页面创建时获取审批详情和流程记录
    this.getApprovalsDetail()
    this.getApprovalsTaskDetail()
  },
  methods: {
    /**
     * 异步获取审批详情。
     * 此函数通过调用 getApprovalsDetail 接口，使用 approvalId 获取特定审批实例的详细信息。
     * 接口返回的数据中，procData 字段是以字符串形式存储的流程数据，需要进行 JSON 解析以供使用。
     *
     * @returns {void} 无返回值，但更新了实例的 information 属性。
     */
    async getApprovalsDetail() {
      // 使用 await 等待接口调用结果，并将结果赋值给 information 属性。
      this.information = await getApprovalsDetail(this.approvalId)
      // 解析 procData 字段为 JSON 格式，并更新 information 对象中的 data 属性。
      this.information.data = JSON.parse(this.information.procData)
    },
    /**
     * 异步获取审批任务的详细信息。
     * 此方法用于从服务器获取特定审批流程的详细数据，包括但不限于审批任务的参与者、状态等信息。
     * 它使用了 `getApprovalsTaskDetail` 函数来执行实际的数据获取操作，并将结果赋值给 `taskInstanceOutList` 属性，用于在界面上展示审批流程的详细情况。
     *
     * @returns {Promise<void>} 无返回值，但通过修改 `taskInstanceOutList` 属性来间接影响组件状态。
     */
    async getApprovalsTaskDetail() {
      this.taskInstanceOutList = await getApprovalsTaskDetail(this.approvalId)
    },
    /**
     * 异步获取审查历史记录中的图片。
     * 此函数通过一个特定的 ID 来请求图片数据，然后将该数据转换为 base64 编码，用于在前端展示图片。
     *
     * @param {string} id - 图片的唯一标识符，用于检索图片数据。
     */
    async getReviewHistory(id) {
      // 发起图片下载请求，并等待响应。
      const response = await downImg(id)
      // 将响应的二进制数据转换为 base64 编码，用于在 img 标签的 src 属性中展示图片。
      this.imgs = 'data:image/png;base64,' + btoa(
        new Uint8Array(response.request.response).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
    },
    // 处理图片链接
    imgHandle(obj) {
      // 使用 window.URL.createObjectURL 方法创建一个可访问的 URL
      // 参数 obj 是包含图片数据的对象，通常是通过文件选择器上传的文件对象
      // 返回值是一个可以用于 img 标签 src 属性的 URL，用于在页面上显示图片
      return window.URL.createObjectURL(obj)
    }
  }
}
</script>
