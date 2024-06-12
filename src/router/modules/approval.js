// 导入布局组件，用于页面布局
import layout from '@/layout'

export default {
  // 审批模块的路由配置
  path: '/approval', name: 'approval', component: layout, children: [{
    // 审批页面的路由配置
    path: '', name: 'approval', component: () => import('@/views/approval'), meta: {
      // 页面标题和图标配置
      title: '审批', icon: 'tree-table'
    }
  }]
}
