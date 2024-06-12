import layout from '@/layout'

export default {
  // 员工管理路由配置
  path: '/employee', component: layout, name: 'employee', children: [{
    // 员工列表页面路由
    path: '', name: 'employee', component: () => import('@/views/employee'), meta: {
      title: '员工', icon: 'people'
    }
  }, {
    // 员工详情页面路由
    path: '/employee/detail/:id?', component: () => import('@/views/employee/detail.vue'), hidden: true, // 隐藏在左侧菜单栏中
    meta: {
      title: '员工详情' // 显示在导航的文本
    }
  }]
}

// 注：此处的路由配置用于定义 Vue Router 中的员工管理模块的路由规则。
// 其中，包括员工列表页面和员工详情页面的访问路径、组件加载方式及元信息（如页面标题和图标）。
