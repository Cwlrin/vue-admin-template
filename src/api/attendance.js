import request from '@/utils/request'

/**
 * 获取考勤列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getAttendancesList(params) {
  return request({
    url: '/attendances', params
  })
}

/**
 * 获取考勤详情
 * @param {Object} data 查询数据，包含 userId 和 yearMonth
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getAtteArchiveDetail(data) {
  return request({
    url: `/attendances/archive/${data.userId}/${data.yearMonth}`
  })
}

/**
 * 更新考勤信息
 * @param {Object} data 更新的数据，包含 userId 等信息
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function updateAttendance(data) {
  return request({
    url: `/attendances/${data.userId}`, method: 'put', data
  })
}

/**
 * 获取归档列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getArchivingList(params) {
  return request({
    url: '/attendances/reports/year', params
  })
}

/**
 * 获取归档详情
 * @param {Object} params 查询参数，包含 atteArchiveMonthlyId
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getArchivingCont(params) {
  return request({
    url: `/attendances/reports/${params.atteArchiveMonthlyId}`, params
  })
}

/**
 * 导入归档数据
 * @param {Object} data 导入的数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function importArchive(data) {
  return request({
    url: '/archive/atte/export', method: 'post', data
  })
}

/**
 * 发送提醒邮件
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function notify() {
  return request({
    url: '/notify/mail', method: 'post'
  })
}

/**
 * 获取档案列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function archives(params) {
  return request({
    url: '/attendances/archives', params
  })
}

/**
 * 获取新报表列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function newReports(params) {
  return request({
    url: '/attendances/newReports', params
  })
}

/**
 * 获取通知信息
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function information() {
  return request({})
}

/**
 * 处理支付相关事项
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function pay() {
  return request({})
}

/**
 * 获取报告列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function reportFormList(params) {
  return request({
    url: '/attendances/reports', params
  })
}

/**
 * 保存请假记录
 * @param {Object} data 请假数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function leaveSave(data) {
  return request({
    url: '/cfg/leave', method: 'put', data
  })
}

/**
 * 获取请假记录
 * @param {Object} data 查询数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getLeave(data) {
  return request({
    url: '/cfg/leave/list', method: 'post', data
  })
}

/**
 * 保存扣款设置
 * @param {Object} data 扣款数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function deductionsSave(data) {
  return request({
    url: '/cfg/deduction', method: 'put', data
  })
}

/**
 * 获取扣款设置
 * @param {Object} data 查询数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getDeductions(data) {
  return request({
    url: '/cfg/ded/list', method: 'post', data
  })
}

/**
 * 保存加班配置
 * @param {Object} data 加班数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function overtimeSave(data) {
  return request({
    url: '/cfg/extDuty', method: 'put', data
  })
}

/**
 * 获取加班配置
 * @param {Object} data 查询数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getOvertime(data) {
  return request({
    url: '/cfg/extDuty/item', method: 'post', data
  })
}

/**
 * 保存考勤数据
 * @param {Object} data 考勤数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function attendanceSave(data) {
  return request({
    url: '/cfg/atte', method: 'put', data
  })
}

/**
 * 获取考勤数据
 * @param {Object} data 查询数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getAttendance(data) {
  return request({
    url: '/cfg/atte/item', method: 'post', data
  })
}

/**
 * 更新员工档案
 * @param {Object} data 更新数据，包含 month 等信息
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function fileUpdate(data) {
  return request({
    url: `/employee/archives/${data.month}`, method: 'put', data
  })
}
