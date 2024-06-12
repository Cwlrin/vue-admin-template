// 导入布局组件，用于页面的布局
import layout from '@/layout'

// 定义路由配置，用于薪资管理模块
export default {
  // 薪资管理模块的路径
  path: '/salary', // 使用布局组件作为页面的容器
  component: layout, // 薪资管理模块的名称
  name: 'salary', // 子路由配置，用于细化薪资管理下的具体页面
  children: [{
    // 默认路由，进入薪资管理模块时的默认页面
    path: '', // 默认页面的名称
    name: 'salary', // 动态导入薪资管理页面的组件
    component: () => import('@/views/salary'), // 页面元信息，用于展示在导航栏上的标题和图标
    meta: {
      title: '工资', icon: 'money'
    }
  }]
}
