import request from '@/utils/request'

/**
 * 获取首页数据。
 *
 * 此函数发送一个 GET 请求到'/home/data' endpoint，以获取首页展示所需的数据。
 * 这些数据可能包括但不限于最新的消息、推荐内容等。
 *
 * @returns {Promise} 返回一个 Promise 对象，解析后的结果为服务器返回的首页数据。
 */
export function getHomeData() {
  return request({
    url: '/home/data'
  })
}

/**
 * 获取消息列表。
 *
 * 此函数发送一个 GET 请求到'/home/notice' endpoint，以获取用户的消息通知列表。
 * 这些消息可能包括系统通知、消息提醒等，用于在客户端展示给用户。
 *
 * @returns {Promise} 返回一个 Promise 对象，解析后的结果为服务器返回的消息列表。
 */
export function getMessageList() {
  return request({
    url: '/home/notice'
  })
}
