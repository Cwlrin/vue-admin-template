import Cookies from 'js-cookie'

// 定义初始状态，包括侧边栏的状态和设备类型
const state = {
  // 侧边栏状态，包括是否打开和是否无动画
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true, withoutAnimation: false
  }, device: 'desktop' // 设备类型，默认为桌面
}

// 定义可以修改状态的函数，即 mutations
const mutations = {
  /**
   * 切换侧边栏状态
   *
   * 此函数用于切换应用侧边栏的打开或关闭状态，并通过 Cookie 记录当前状态。
   * 当侧边栏状态改变时，它不仅更新应用的状态，还确保在用户下次访问时侧边栏能保持上次的状态。
   *
   * @param {Object} state - 应用的状态对象
   * @param {Object} state.sidebar - 侧边栏的状态对象
   * @param {boolean} state.sidebar.opened - 表示侧边栏是否打开
   * @param {boolean} state.sidebar.withoutAnimation - 表示侧边栏是否在切换时无动画效果
   */
  TOGGLE_SIDEBAR: state => {
    // 切换侧边栏的打开状态
    state.sidebar.opened = !state.sidebar.opened
    // 默认情况下，关闭动画效果
    state.sidebar.withoutAnimation = false
    // 根据侧边栏的打开状态，设置 Cookie 以持久化存储状态
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },

  /**
   * 定义一个名为 CLOSE_SIDEBAR 的常量函数，用于关闭侧边栏。
   * @param {Object} state - Vuex 的状态对象，用于更新应用的状态。
   * @param {boolean} withoutAnimation - 控制侧边栏关闭时是否使用动画。
   * 此函数通过设置 Cookie 来记录侧边栏的状态，并更新 state 中的侧边栏属性，
   * 使其关闭并根据参数决定是否使用动画。
   */
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  }, /**
   * 切换设备类型的 action creator
   *
   * 此函数用于定义一个名为 TOGGLE_DEVICE 的 action 类型，该 action 用于更改应用状态中的设备类型。
   * 它接受两个参数：state 和 device。其中 state 代表应用的状态对象，device 代表需要切换到的设备类型。
   * 函数通过将 state 中的 device 属性更新为传入的 device 值来实现设备类型的切换。
   *
   * @param {Object} state - 应用的状态对象
   * @param {string} device - 需要切换到的设备类型
   * @returns {Function} - 一个用于切换设备类型的 action creator 函数
   */
  // 切换设备类型
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

// 定义触发 mutations 的函数，即 actions
const actions = {
  /**
   * 切换侧边栏的打开或关闭状态。
   *
   * 此函数用于触发一个名为'TOGGLE_SIDEBAR'的 mutations，以改变侧边栏的显示状态。
   * 它不直接处理状态的改变，而是通过调用 store 中的 commit 方法来触发状态更新。
   * 这种方式符合 VueX 的规范，即通过 commit 来提交状态变更。
   *
   * @param {Object} context - Vuex store 中的上下文对象，包含各种用于状态管理的方法，如 commit。
   */
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  }, /**
   * 关闭侧边栏
   *
   * 该函数用于触发关闭侧边栏的行动。它通过调用 Vuex store 中的 mutation 来实现这一目标。
   * 可以选择是否使用动画来关闭侧边栏，这由 withoutAnimation 参数决定。
   *
   * @param {Object} context Vuex store 的上下文对象，包含 state、getters、mutations 和 actions。
   * @param {Object} payload 关闭侧边栏的操作参数。
   * @param {Boolean} payload.withoutAnimation 指示是否在关闭侧边栏时使用动画。
   */
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  }, /**
   * 切换设备类型
   *
   * 本函数用于在 Vuex 中触发一个名为 'TOGGLE_DEVICE' 的 mutation，以切换应用的设备类型。
   * 这对于响应式布局或根据设备类型提供不同用户体验的应用非常有用。
   *
   * @param {Object} context - Vuex 的上下文对象，包含各种用于状态管理的方法，如 commit。
   * @param {String} device - 待切换到的设备类型。此参数将作为 'TOGGLE_DEVICE' mutation 的第二个参数传递。
   */
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

// 导出 namespace 为 true 的 vuex 模块，包含 state、mutations 和 actions
export default {
  namespaced: true, state, mutations, actions
}
