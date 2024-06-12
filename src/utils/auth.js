import Cookies from 'js-cookie'

/**
 * 定义 token 的键名，用于在 cookie 中存储和检索 token。
 */
const TokenKey = 'vue_admin_template_token'

/**
 * 从 cookie 中获取 token。
 *
 * @returns {string} 返回存储的 token，如果不存在则返回空字符串。
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * 在 cookie 中设置 token。
 *
 * @param {string} token 要设置的 token 值。
 * @returns {boolean} 如果设置成功，则返回 true；否则返回 false。
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 * 从 cookie 中删除 token。
 *
 * @returns {boolean} 如果删除成功，则返回 true；否则返回 false。
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}

