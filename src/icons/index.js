import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // 引入 SvgIcon 组件

// 全局注册 SvgIcon 组件
Vue.component('svg-icon', SvgIcon)

// 使用 require.context 动态加载 svg 图标
// require.context 函数用于创建一个上下文，可以动态地加载指定目录下的所有模块
const req = require.context('./svg', false, /\.svg$/)

// 调用 requireAll 函数加载所有 svg 图标
// requireAll 函数的作用是遍历 req.keys() 返回的数组，逐个加载数组中的模块
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
