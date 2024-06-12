// 导入布局组件，用于页面布局
import layout from '@/layout'

// 定义路由配置，用于考勤模块
export default {
  // 路径配置，考勤模块的根路径
  path: '/attendance', // 路由名称，用于路由跳转时的引用
  name: 'attendance', // 使用布局组件作为该路由的组件
  component: layout, // 子路由配置，用于细化考勤模块下的页面路由
  children: [{
    // 默认路由，当访问/attendance时默认跳转的页面
    path: '', // 路由名称，用于路由跳转时的引用
    name: 'attendance', // 动态导入考勤页面组件
    component: () => import('@/views/attendance'), // 页面元信息，用于设置页面标题和图标
    meta: {
      title: '考勤', icon: 'excel'
    }
  }]
}
