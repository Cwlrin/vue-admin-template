import Vue from 'vue'

// 引入 normalize.css，用于统一不同浏览器的样式
import 'normalize.css/normalize.css'

// 引入 ElementUI 组件库及其主题样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入 ElementUI 的国际化语言包，这里以英文为例，注释掉表示使用默认语言
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 引入全局的 CSS 样式文件
import '@/styles/index.scss' // global css

// 引入 App 组件、store 状态管理器和 router 路由管理器
import App from './App'
import store from './store'
import router from './router'

// 引入图标资源和权限控制模块
import '@/icons' // icon
import '@/permission' // permission control

/**
 * 下面是关于使用 MockJS 模拟 API 的配置，
 * 在生产环境中，如果不需要模拟数据，应该删除这部分代码
 * 如果您不想使用 mock-server
 * 而想使用 MockJs 来模拟 API
 * 您可以执行: mockXHR()
 * 目前在生产环境中会使用 MockJs，
 * ! 上线前请务必移除！！！
 */
// if (process.env.NODE_ENV === 'production') {
//   const {mockXHR} = require('../mock')
//   mockXHR()
// }

// 设置 ElementUI 的语言为英文，取消注释并修改 locale import 语句以使用其他语言
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 关闭 Vue 的生产提示信息
Vue.config.productionTip = false

/**
 * 定义一个 Vue 自定义指令 v-permission，用于根据用户的权限控制元素的显示和禁用状态
 * @param {Object} el - 指令作用的 DOM 元素
 * @param {Object} binding - 指令的绑定对象，包含权限点信息
 */
Vue.directive('permission', {
  // 会在指令作用的元素插入到页面完成以后触发
  inserted(el, binding) {
    // el 指令作用的元素的 dom 对象
    console.log(el)
    // 获取用户权限点信息
    const points = store.state.user.userInfo?.roles?.points || [] // 当前用户信息的操作权
    // 检查用户权限是否包含当前指令的权限点，如果不包含则移除元素或禁用元素
    if (!points.includes(binding.value)) {
      // 不存在就要删除或者禁用
      el.remove() // 删除元素
      // el.disabled = true
      // 线上的权限数据和线下的代码进行对应
    }
  }
})

// 创建并挂载 Vue 实例，初始化应用
new Vue({
  el: '#app', router, store, render: h => h(App)
})
