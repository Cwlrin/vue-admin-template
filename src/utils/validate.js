/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * 判断一个路径是否为外部链接。
 *
 * 该函数用于确定给定的路径是否为外部资源的 URL，基于其是否以 http(s)、mailto 或 tel 协议开头。
 * 这对于在应用程序中过滤或处理内部和外部链接非常有用。
 *
 * @param {string} path 要检查的路径字符串。
 * @returns {Boolean} 如果路径是外部链接，则返回 true；否则返回 false。
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 判断一个字符串是否为有效的用户名。
 *
 * 该函数通过检查字符串是否在预定义的有效用户名列表中来确定其有效性。
 * 有效用户名列表包含“admin”和“editor”两个值。
 *
 * @param {string} str 要检查的用户名字符串。
 * @returns {Boolean} 如果字符串是有效的用户名，则返回 true；否则返回 false。
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
