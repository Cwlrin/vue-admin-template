import layout from '@/layout'

export default {
  // 定义路由的路径，这是部门管理页面的入口路径
  path: '/department', // 使用布局组件作为该路由的组件，通常用于一级路由
  component: layout, // 路由的名称，用于程序中引用该路由
  name: 'department', // 子路由配置，用于展示更具体的部门相关页面
  children: [{
    // 子路由的路径，空路径表示使用父路由路径加上该子路由的配置
    path: '', // 动态导入部门管理页面的组件，这种方式可以优化首屏加载时间
    component: () => import('@/views/department'), // 子路由的名称，与父路由的 name 一起可以唯一标识该路由
    name: 'department', // 元信息，用于侧边栏导航的图标和标题显示
    meta: {
      // 路由元信息 存储数据的
      icon: 'tree', // 图标
      title: '组织' // 标题
    }
  }]
}
