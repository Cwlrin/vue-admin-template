// 导入默认布局组件
import layout from '@/layout'

// 定义路由配置对象，用于配置社交模块的路由信息
export default {
  // 路径配置，指定该路由的URL路径
  path: '/social', // 组件配置，指定该路由使用的布局组件
  component: layout, // 路由名称，用于在路由跳转时使用
  name: 'social', // 子路由配置，用于配置该路由下的子路由
  children: [{
    // 子路由的路径配置，表示该子路由的URL路径为空时使用
    path: '', // 子路由的名称配置
    name: 'social', // 组件懒加载配置，表示该子路由使用的组件在需要时才加载
    component: () => import('@/views/social'), // 元信息配置，用于配置该路由的展示信息，如标题和图标
    meta: {
      title: '社保', // 路由的页面标题
      icon: 'table' // 路由在菜单中的图标
    }
  }]
}
