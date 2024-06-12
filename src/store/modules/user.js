import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
import { constantRoutes, resetRouter } from '@/router'

// 定义初始状态
const state = {
  token: getToken(), // 从本地存储中获取 token 的初始值
  userInfo: {}, // 用户信息的初始状态为空对象
  routes: constantRoutes // 初始路由为静态路由
}

// 定义 mutations 用于修改状态
const mutations = {
  /**
   * 设置用户 token。
   *
   * 此函数用于在状态对象中设置用户的授权令牌，并同时将该令牌存储在本地存储空间中。
   * 这样做的目的是为了在用户会话期间保持登录状态，并在需要时能够快速验证用户身份。
   *
   * @param {Object} state - Vuex 状态对象，用于存储应用的全局状态。
   * @param {string} token - 用户的授权令牌，用于验证用户身份。
   */
  // 设置 token，并将其同步到本地存储
  setToken(state, token) {
    state.token = token
    // 同步到缓存
    setToken(token)
  },
  /**
   * 从状态中移除令牌。
   *
   * 此函数用于清理 Vuex 状态中的 token 值，同时调用 removeToken 函数从本地存储中删除令牌。
   * 这通常是登出操作的一部分，以确保用户信息不再被错误地访问。
   *
   * @param {Object} state Vuex 状态对象，其中包含 token 属性。
   */
  removeToken(state) {
    // 删除 Vuex 的 token
    state.token = null
    removeToken()
  },
  /**
   * 设置用户信息
   *
   * 此函数用于更新状态对象中的用户信息。
   * 它接受两个参数：state 和 userInfo。
   * state 是一个包含应用状态的对象，而 userInfo 是一个包含用户信息的对象。
   * 函数通过将 userInfo 赋值给 state.userInfo 来更新用户信息。
   * 这种方式适用于使用 Vuex 管理状态的应用中。
   *
   * @param {Object} state - Vuex 状态对象，用于存储应用的状态。
   * @param {Object} userInfo - 包含用户信息的对象，用于更新 state 中的用户信息。
   */
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  /**
   * 更新路由配置
   *
   * 此函数用于设置应用的路由表。它通过合并静态路由和动态路由来构建完整的路由配置。
   * 这样做是为了灵活地支持应用在运行时根据需求动态调整路由。
   *
   * @param {Object} state - Vuex 的状态对象，用于存储应用的全局状态。
   * @param {Array} newRoutes - 新的动态路由配置，这些路由可以根据需求动态添加到路由表中。
   */
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 静态路由 + 动态路由
  }
}

// 定义 actions 用于发起异步操作
const actions = {
  /**
   * 异步登录方法
   *
   * 本方法用于处理用户的登录逻辑。它接收用户的登录数据，然后调用登录接口以获取登录令牌（token）。
   * 登录成功后，它会通过提交一个 mutation 来更新状态，将获取到的 token 保存到状态中。
   *
   * @param {Object} context Vuex 的上下文对象，用于调用 commit 方法来触发状态更新
   * @param {Object} data 用户的登录数据，包含必要的认证信息
   */
  async login(context, data) {
    console.log(data)
    // 调用登录接口
    // TODO: 调用登录接口
    const token = await login(data)
    // 提交 mutation 来设置 token
    context.commit('setToken', token)
  },
  /**
   * 异步获取用户信息的 action。
   *
   * 此函数通过调用 getUserInfo 函数来获取用户信息，并将获取到的信息提交给 mutation 进行存储。
   * 主要用于在应用程序中初始化用户信息。
   *
   * @param {Object} context - Vuex 的上下文对象，包含 commit 等方法。
   * @returns {Object} 返回获取到的用户信息。
   */
  async getUserInfo(context) {
    // 等待 getUserInfo 异步函数完成，获取用户信息
    // 调用用户信息接口
    const result = await getUserInfo()
    // 将获取到的用户信息提交给 mutation，以更新状态
    // 提交 mutation 来设置用户信息
    context.commit('setUserInfo', result)
    return result // 返回数据
  },
  /**
   * 注销当前用户。
   *
   * 该函数负责执行注销操作，它通过调用 Vuex 中的两个 mutation 来实现：
   * 1. 移除用户的认证 token，以断开用户会话。
   * 2. 清空用户信息，确保用户界面恢复到登录前的状态。
   * 此外，它还调用了一个名为 `resetRouter` 的函数，用于重置路由配置，
   * 这对于在注销后重置应用的导航状态是非常重要的。
   *
   * @param {Object} context Vuex 的上下文对象，它提供了对 state、mutations 和 actions 的访问。
   */
  logout(context) {
    // 移除用户的认证 token，断开用户会话。
    // 移除 token
    context.commit('removeToken') // 删除 token
    // 清空用户信息，确保界面恢复到登录前的状态。
    // 清空用户信息
    context.commit('setUserInfo', {}) // 设置用户信息为空对象
    // 重置路由配置，以断开当前用户的所有路由链接。
    // 重置路由
    resetRouter()
  }
}

// 导出默认的 module 配置
export default {
  namespaced: true, // 开启命名空间
  state, mutations, actions
}
