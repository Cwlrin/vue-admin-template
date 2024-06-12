import request from '@/utils/request'

/**
 * 获取薪资列表
 * @param {Object} data 请求数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getSalarysList(data) {
  return request({
    url: '/salarys/list', data, method: 'post'
  })
}

/**
 * 获取员工列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getEmployeeList(params) {
  return request({
    url: '/sys/user', params // 地址参数 查询参数
  })
}

/**
 * 获取提示信息
 * @param {string} yearMonth 年月
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getTips(yearMonth) {
  return request({
    url: `/salarys/tips/${yearMonth}`
  })
}

/**
 * 获取设置信息
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getSettings() {
  return request({
    url: '/salarys/settings'
  })
}

/**
 * 获取公司设置
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getCompanySetting() {
  return request({
    url: '/salarys/company-settings'
  })
}

/**
 * 保存设置
 * @param {Object} data 请求数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function saveSettings(data) {
  return request({
    url: '/salarys/settings', method: 'post', data
  })
}

/**
 * 获取薪资详情
 * @param {number} userId 用户 ID
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getSalaryDetail(userId) {
  return request({
    url: `/salarys/modify/${userId}`
  })
}

/**
 * 修改薪资
 * @param {Object} data 请求数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function changeSalary(data) {
  return request({
    url: `/salarys/modify/${data.userId}`, method: 'post', data
  })
}

/**
 * 初始化薪资
 * @param {Object} data 请求数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function initSalary(data) {
  return request({
    url: `/salarys/init/${data.userId}`, method: 'post', data
  })
}

/**
 * 获取存档列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getArchivingList(params) {
  return request({
    url: `/salarys/reports/${params.year}`, params
  })
}

/**
 * 获取存档详情
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getArchivingCont(params) {
  return request({
    url: `/salarys/reports/${params.yearMonth}`, params
  })
}

/**
 * 新建报告
 * @param {Object} data 请求数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function newReport(data) {
  return request({
    url: `/salarys/reports/${data.yearMonth}/newReport`, method: 'put', data
  })
}

/**
 * 导出存档
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getArchivingExport(params) {
  return request({
    url: `/salarys/reports/${params.yearMonth}/export`, params
  })
}

/**
 * 获取存档首页
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getArchivingFirst(params) {
  return request({
    url: `/salarys/reports/${params.yearMonth}/first`, params
  })
}

/**
 * 存档归档
 * @param {Object} data 请求数据
 * @returns {Promise} 返回请求结果的 Promise 对象
 */
export function getArchivingArchive(data) {
  return request({
    url: `/salarys/reports/${data.yearMonth}/archive`, data, method: 'post'
  })
}
