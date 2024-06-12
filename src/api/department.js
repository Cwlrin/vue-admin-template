import request from '@/utils/request'

/**
 * 获取组织架构数据
 *
 * @returns {Promise} 返回包含组织架构数据的 Promise 对象
 */
export function getDepartment() {
  return request({
    url: '/company/department'
  })
}

/**
 * 获取部门负责人数据
 *
 * @returns {Promise} 返回包含部门负责人信息的 Promise 对象
 */
export function getManagerList() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 新增组织部门
 *
 * @param {Object} data 部门相关信息
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function addDepartment(data) {
  return request({
    method: 'post', url: '/company/department', data
  })
}

/**
 * 获取部门详细信息
 *
 * @param {String} id 部门 ID
 * @returns {Promise} 返回包含部门详细信息的 Promise 对象
 */
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 更新部门信息
 *
 * @param {Object} data 需要更新的部门信息
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function updateDepartment(data) {
  return request({
    method: 'put', url: `/company/department/${data.id}`, data
  })
}

/**
 * 删除指定部门
 *
 * @param {String} id 部门 ID
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function delDepartment(id) {
  return request({
    method: 'delete', url: `/company/department/${id}`
  })
}
