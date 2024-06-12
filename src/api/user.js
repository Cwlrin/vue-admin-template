import request from '@/utils/request'

/**
 * 登录功能
 * @param {object} data 登录所需的数据，包括用户名和密码等
 * @returns {Promise} 返回一个 Promise 对象，包含服务器的响应
 */
export function login(data) {
  return request({
    url: '/sys/login', method: 'post', data
  })
}

/**
 * 获取用户信息
 * @returns {Promise} 返回一个 Promise 对象，包含服务器返回的用户信息
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile'
  })
}

/**
 * 更新用户密码
 * @param {object} data 包含新密码等需要更新的密码信息
 * @returns {Promise} 返回一个 Promise 对象，包含服务器的响应
 */
export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass', method: 'put', data
  })
}
