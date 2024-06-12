import request from '@/utils/request'

/**
 * 获取审批列表
 * @param {Object} data 分页信息对象，包含页码和每页大小
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getApprovalList(data) {
  return request({
    url: `/user/process/instance/${data.page}/${data.pageSize}`, method: 'put', data
  })
}

/**
 * 根据 ID 获取审批信息
 * @param {string|number} id 审批实例 ID
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getInformation(id) {
  return request({
    url: `/user/process/instance/getById/${id}`
  })
}

/**
 * 根据 ID 获取审批历史记录
 * @param {string|number} id 审批实例 ID
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getReviewHistory(id) {
  return request({
    url: `/approvals/flows/${id}`
  })
}

/**
 * 提交审批流程
 * @param {Object} data 提交的审批数据对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function process(data) {
  return request({
    url: '/approvals/process', method: 'post', data
  })
}

/**
 * 获取审批设置状态
 * @param {Object} params 查询参数对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getSetState(params) {
  return request({
    url: '/approvals/setting', params
  })
}

/**
 * 保存审批设置状态
 * @param {Object} data 设置状态的数据对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function saveSetState(data) {
  return request({
    url: '/approvals/setting', method: 'put', data
  })
}

/**
 * 根据 ID 获取审批详情
 * @param {string|number} id 审批实例 ID
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getApprovalsDetail(id) {
  return request({
    url: `/user/process/instance/${id}`
  })
}

/**
 * 根据 ID 获取审批任务详情
 * @param {string|number} id 审批任务 ID
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getApprovalsTaskDetail(id) {
  return request({
    url: `/user/process/instance/tasks/${id}`
  })
}

/**
 * 下载图片
 * @param {string|number} pictureId 图片 ID
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function downImg(picture_id) {
  return request({
    url: `//user/process/buss/showBussImgById/${picture_id}`
  })
}

/**
 * 获取流程定义列表
 * @param {Object} params 查询参数对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getFlowList(params) {
  return request({ url: `/user/process/definition`, params })
}

/**
 * 暂停流程
 * @param {Object} params 包含流程关键字的参数对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function suspend(params) {
  return request({
    url: `/user/process/suspend/${params.processKey}`, params
  })
}

/**
 * 启动流程实例
 * @param {Object} data 启动流程的数据对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function startProcess(data) {
  return request({
    url: `/user/process/startProcess`, data, method: 'post'
  })
}

/**
 * 申请请假
 * @param {Object} data 请假数据对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function applyeLave(data) {
  return request({
    url: `/user/process_leave/startProcess`, data, method: 'post'
  })
}

/**
 * 驳回审批
 * @param {Object} data 包含审批 ID 和驳回信息的数据对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function approvalsReject(data) {
  return request({
    url: `/user/approvals/${data.id}/reject`, method: 'put', data
  })
}

/**
 * 删除审批实例
 * @param {string|number} id 审批实例 ID
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function approvalsDel(id) {
  return request({
    url: `/user/approvals/${id}`, method: 'delete'
  })
}

/**
 * 通过审批
 * @param {Object} data 包含审批信息的数据对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function approvalsPass(data) {
  return request({
    url: '/user/process/instance/commit', method: 'put', data
  })
}

/**
 * 申请辞职
 * @param {Object} data 辞职数据对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function applyDimission(data) {
  return request({
    url: '/user/process_dimission/startProcess', method: 'post', data
  })
}

/**
 * 申请加班
 * @param {Object} data 加班数据对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function applyOvertime(data) {
  return request({
    url: '/user/process_overtime/startProcess', method: 'post', data
  })
}

/**
 * 导出审批数据
 * @param {Object} data 导出参数对象，包含月份信息
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function exportApprovals(data) {
  return request({
    url: `/approvals/export/${data.month}`, data
  })
}

/**
 * 更新用户信息
 * @param {Object} data 包含用户 ID 和更新信息的数据对象
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function updateUser(data) {
  return request({
    url: `/sys/user/${data.id}`, method: 'put', data
  })
}
