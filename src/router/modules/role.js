// 导入布局组件，用于页面布局
import layout from '@/layout'

// 定义路由配置，用于角色管理模块
export default {
  // 角色管理模块的路径
  path: '/role', // 角色管理模块的名称
  name: 'role', // 使用布局组件作为角色管理模块的组件
  component: layout, // 子路由配置，用于角色列表页面
  children: [{
    // 角色列表页面的路径
    path: '', // 角色列表页面的名称
    name: 'role', // 动态导入角色列表页面的组件
    component: () => import('@/views/role'), // 设置角色列表页面的元信息，包括标题和图标
    meta: {
      title: '角色', icon: 'setting'
    }
  }]
}
