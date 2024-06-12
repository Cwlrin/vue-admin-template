import defaultSettings from '@/settings'

// 解构默认设置中的几个配置项
const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

// 定义 state 对象，包含应用中的配置状态
const state = {
  showSettings: showSettings, fixedHeader: fixedHeader, sidebarLogo: sidebarLogo
}

// 定义 mutations，用于修改 state 中的配置状态
const mutations = {
  /**
   * 修改设置项
   * @param {Object} state Vuex 状态对象
   * @param {Object} data 修改设置的数据，包含键 (key) 和值(value)
   */
  CHANGE_SETTING: (state, { key, value }) => {
    // 检查 state 中是否存在键 key，如果存在则修改对应的值
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

// 定义 actions，用于触发 mutations 中的修改设置操作
const actions = {
  /**
   * 修改设置
   * @param {Object} context Vuex 上下文对象，包含 commit 等方法
   * @param {Object} data 需要修改的设置数据，包含键 (key) 和值(value)
   */
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

// 导出默认的 Vuex 模块配置，包含 namespaced、state、mutations 和 actions
export default {
  namespaced: true, state, mutations, actions
}
