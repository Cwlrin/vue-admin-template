import request from '@/utils/request'

/**
 * 获取权限列表
 * @returns {Promise} 返回包含权限信息的响应
 */
export function getPermissionList() {
  return request({
    url: '/sys/permission'
  })
}

/**
 * 新增权限
 * @param {Object} data 包含新权限信息的对象
 * @returns {Promise} 返回操作结果的响应
 */
export function addPermission(data) {
  return request({
    url: '/sys/permission', method: 'post', data
  })
}

/**
 * 更新权限
 * @param {Object} data 包含更新后权限信息的对象，必须包含 id 以标识权限
 * @returns {Promise} 返回操作结果的响应
 */
export function updatePermission(data) {
  return request({
    url: `/sys/permission/${data.id}`, method: 'put', data
  })
}

/**
 * 删除权限
 * @param {String|Number} id 需要删除的权限的唯一标识
 * @returns {Promise} 返回操作结果的响应
 */
export function delPermission(id) {
  return request({
    url: `/sys/permission/${id}`, method: 'delete'
  })
}

/**
 * 获取权限详情
 * @param {String|Number} id 需要查询详情的权限的唯一标识
 * @returns {Promise} 返回包含权限详细信息的响应
 */
export function getPermissionDetail(id) {
  return request({
    url: `/sys/permission/${id}`
  })
}
