// 导入布局组件
import layout from '@/layout'

// 定义路由配置对象
export default {
  // 路由路径
  path: '/permission', // 使用的组件
  component: layout, // 路由名称
  name: 'permission', // 子路由配置
  children: [{
    // 子路由路径
    path: '', // 子路由名称
    name: 'permission', // 动态导入子路由组件
    component: () => import('@/views/permission'), // 子路由元信息，用于页面标题和菜单图标
    meta: {
      title: '权限', icon: 'lock'
    }
  }]
}
