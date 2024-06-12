import request from '@/utils/request'

/**
 * 获取员工列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回员工列表的请求 Promise
 */
export function getEmployeeList(params) {
  return request({
    url: '/sys/user', params // 地址参数 查询参数
  })
}

/**
 * 导出员工的 excel
 * @returns {Promise} 返回导出员工 Excel 的请求 Promise
 */
export function exportEmployee() {
  return request({
    url: '/sys/user/export', // 改变接收数据的类型
    responseType: 'blob' // 使用 blob 接收二进制文件流
  })
}

/**
 * 下载员工导入模版
 * @returns {Promise} 返回下载员工导入模板的请求 Promise
 */
export function getExportTemplate() {
  return request({
    url: '/sys/user/import/template', responseType: 'blob' // 二进制文件流
  })
}

/**
 * 上传用户的 excel
 * @param {Object} data 上传的 Excel 数据
 * @returns {Promise} 返回上传员工 Excel 的请求 Promise
 */
export function uploadExcel(data) {
  return request({
    url: '/sys/user/import', method: 'post', data // form-data 类型 因为要上传文件类型
  })
}

/**
 * 删除员工
 * @param {String} id 员工 ID
 * @returns {Promise} 返回删除员工的请求 Promise
 */
export function delEmployee(id) {
  return request({
    method: 'delete', url: `/sys/user/${id}`
  })
}

/**
 * 新增员工
 * @param {Object} data 新增员工的数据
 * @returns {Promise} 返回新增员工的请求 Promise
 */
export function addEmployee(data) {
  return request({
    url: '/sys/user', method: 'post', data
  })
}

/**
 * 获取员工详情
 * @param {String} id 员工 ID
 * @returns {Promise} 返回获取员工详情的请求 Promise
 */
export function getEmployeeDetail(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/**
 * 更新员工
 * @param {Object} data 更新员工的数据
 * @returns {Promise} 返回更新员工的请求 Promise
 */
export function updateEmployee(data) {
  return request({
    url: `/sys/user/${data.id}`, method: 'put', data
  })
}

/**
 * 获取可用的角色列表
 * @returns {Promise} 返回可用角色列表的请求 Promise
 */
export function getEnableRoleList() {
  return request({
    url: '/sys/role/list/enabled'
  })
}

/**
 * 分配员工角色
 * @param {Object} data 包含员工 ID 和角色 ID 的数据
 * @returns {Promise} 返回分配员工角色的请求 Promise
 */
export function assignRole(data) {
  return request({
    url: '/sys/user/assignRoles', method: 'put', data
  })
}
