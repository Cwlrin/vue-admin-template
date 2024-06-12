import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

// 创建一个 axios 实例，配置基础 URL 和超时时间
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础地址
  timeout: 10000 // 超时设置为 10 秒
})

// 配置请求拦截器，用于在每个请求中添加 Authorization 头
// 成功 1 失败 2
service.interceptors.request.use((config) => {
  // 如果 store 中存在 token，将其添加到请求头中
  // 注入 token
  // this.$store.getters
  // store.getters.token => 请求头里面
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (error) => {
  // 处理请求错误，返回一个拒绝的 promise
  // 失败执行 promise
  return Promise.reject(error)
})

// 配置响应拦截器，用于处理服务器响应
// 响应拦截器
service.interceptors.response.use((response) => {
  // 如果响应数据是 Blob 类型，直接返回
  // axios 默认包裹了 data
  // 判断是不是 Blob
  if (response.data instanceof Blob) return response.data // 返回了 Blob 对象
  // 解构响应数据中的成功标志、消息和数据部分
  const { data, message, success } = response.data // 默认 json 格式
  // 如果请求成功，返回数据
  if (success) {
    return data
  } else {
    // 如果请求失败，显示错误消息，并拒绝 promise
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  // 如果响应状态码为 401，表示授权过期，显示提示，登出并跳转到登录页
  if (error.response.status === 401) {
    Message({ type: 'warning', message: 'token超时了' })
    // 说明 token 超时了
    await store.dispatch('user/logout') // 调用 action 退出登录
    //  主动跳到登录页
    router.push('/login') // 跳转到登录页
    return Promise.reject(error)
  }
  // 对于其他错误，显示错误消息，并拒绝 promise
  // error.message
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})
export default service
