import request from '@/utils/request'

/**
 * 根据月份获取归档信息
 * @param {Object} params - 请求参数，包含月份信息
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的归档信息
 */
export function getArchivingCont(params) {
  return request({
    url: `/social_securitys/historys/${params.month}`, params
  })
}

/**
 * 根据年份获取归档列表
 * @param {Object} data - 请求参数，包含年份信息
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的归档列表
 */
export function getArchivingList(data) {
  return request({
    url: `/social_securitys/historys/${data.year}/list`, data
  })
}

/**
 * 提交新增报告
 * @param {Object} data - 请求参数，包含年月信息和报告内容
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的新增报告结果
 */
export function newReport(data) {
  return request({
    url: `/social_securitys/historys/${data.yearMonth}/newReport`, method: 'put', data
  })
}

/**
 * 获取历史数据详情
 * @param {Object} data - 请求参数，包含用户 ID 和年月信息
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的历史数据详情
 */
export function getHistorysData(data) {
  return request({
    url: `/social_securitys/historys/archiveDetail/${data.userId}/${data.yearMonth}`, data
  })
}

/**
 * 导出归档数据
 * @param {Object} data - 请求参数，包含年月信息
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的导出归档数据的结果
 */
export function getArchivingExport(data) {
  return request({
    url: `/social_securitys/historys/${data.yearMonth}/export`, data
  })
}

/**
 * 获取首次归档信息
 * @param {Object} data - 请求参数，包含年月信息
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的首次归档信息
 */
export function getArchivingFirst(data) {
  return request({
    url: `/social_securitys/historys/${data.yearMonth}/first`, data
  })
}

/**
 * 获取社保列表
 * @param {Object} data - 请求参数
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的社保列表
 */
export function getSocialList(data) {
  return request({
    url: '/social_securitys/list', method: 'post', data
  })
}

/**
 * 提交归档操作
 * @param {Object} data - 请求参数，包含年月信息和归档内容
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的归档操作结果
 */
export function getArchivingArchive(data) {
  return request({
    url: `/social_securitys/historys/${data.yearMonth}/archive`, method: 'post', data
  })
}

/**
 * 获取提示信息
 * @param {string} yearMonth - 年月信息
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的提示信息
 */
export function getTips(yearMonth) {
  return request({
    url: `/social_securitys/tips/${yearMonth}`
  })
}

/**
 * 保存或更新内容
 * @param {Object} data - 请求参数，包含用户 ID 和内容信息
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的保存或更新结果
 */
export function saveContent(data) {
  return request({
    url: `/social_securitys/${data.userId}`, method: 'put', data
  })
}

/**
 * 获取内容详情
 * @param {string} userId - 用户 ID
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的内容详情
 */
export function getContent(userId) {
  return request({
    url: `/social_securitys/${userId}`
  })
}

/**
 * 获取缴费项列表
 * @param {string} id - 社保 ID
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的缴费项列表
 */
export function getPaymentItemList(id) {
  return request({
    url: `/social_securitys/payment_item/${id}`
  })
}

/**
 * 获取设置信息
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的设置信息
 */
export function getSettings() {
  return request({
    url: '/social_securitys/settings'
  })
}

/**
 * 保存设置
 * @param {Object} data - 请求参数，包含设置信息
 * @returns {Promise} 返回一个 Promise，解析后的结果是后端返回的保存设置结果
 */
export function saveSettings(data) {
  return request({
    url: '/social_securitys/settings', data, method: 'post'
  })
}
