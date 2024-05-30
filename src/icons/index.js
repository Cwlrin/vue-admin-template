import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon) // 全局注册组件

// require.context(目标目录，是否扫描子目录) 扫描目录中的文件
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
// 数组方法 map foreach
// map 是循环每一项 svg 图片 map(() ==> {})
// req 函数能够引用图片到项目中
// 将所有的 svg 都引用到项目中
requireAll(req) // 调用函数
