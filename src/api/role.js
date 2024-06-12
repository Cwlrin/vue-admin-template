import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回包含角色列表的响应
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role', params // 查询参数
  })
}

/**
 * 新增角色
 * @param {Object} data 新增角色的数据
 * @returns {Promise} 返回新增角色的响应
 */
export function addRole(data) {
  return request({
    url: '/sys/role', method: 'post', data
  })
}

/**
 * 更新角色
 * @param {Object} data 更新角色的数据，包含角色 ID
 * @returns {Promise} 返回更新角色的响应
 */
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`, method: 'put', data
  })
}

/**
 * 删除角色
 * @param {String|Number} id 角色 ID
 * @returns {Promise} 返回删除角色的响应
 */
export function delRole(id) {
  return request({
    url: `/sys/role/${id}`, method: 'delete'
  })
}

/**
 * 获取角色详情
 * @param {String|Number} id 角色 ID
 * @returns {Promise} 返回包含角色详情的响应
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * 给角色分配权限
 * @param {Object} data 包含角色 ID 和权限信息的数据
 * @returns {Promise} 返回角色权限分配的响应
 */
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem', method: 'put', data
  })
}
