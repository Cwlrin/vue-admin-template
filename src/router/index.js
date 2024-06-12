import Vue from 'vue'
import Router from 'vue-router'

// 使用 Vue 的路由器插件
Vue.use(Router)

/* 布局组件 */
import Layout from '@/layout'
// 引入各个模块的路由配置
import departmentRouter from './modules/department'
import approvalRouter from './modules/approval'
import attendanceRouter from './modules/attendance'
import employeeRouter from './modules/employee'
import permissionRouter from './modules/permission'
import roleRouter from './modules/role'
import salaryRouter from './modules/salary'
import socialRouter from './modules/social'

/**
 * 注意：子菜单仅在 `route.children.length >= 1` 时出现
 * 详细信息请参考: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   设为 true 时，项目将不在侧边栏显示（默认为 false）
 * alwaysShow: true               设为 true，则总是显示根菜单
 *                                若未设置 alwaysShow，当项目有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           设为 noRedirect 则面包屑中不进行重定向
 * name:'router-name'             此名称供 <keep-alive> 使用（必须设置！！！）
 * meta : {
 * roles: ['admin','editor']      控制页面角色（可设置多个角色）
 * title: '标题'                   在侧边栏和面包屑中显示的名称（建议设置）
 * icon: 'svg-name'/'el-icon-x'   在侧边栏中显示的图标
 * breadcrumb: false              设为 false，则项目在面包屑中隐藏（默认为 true）
 * activeMenu: '/example/list'    设定路径后，侧边栏会高亮显示所设置的路径
 * }
 */

/**
 * 常量路由（constantRoutes）
 * 无需权限验证的基础页面，所有角色均可访问
 */
export const constantRoutes = [{
  path: '/login', component: () => import('@/views/login/index'), hidden: true
},

{
  path: '/404', component: () => import('@/views/404'), hidden: true
},

{
  path: '/', component: Layout, redirect: '/dashboard', children: [{
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: { title: '首页', icon: 'dashboard' } // 设置标题与图标
  }]
}

  // 注意：404 页面必须置于末尾！！！
]
// 动态路由
export const asyncRoutes = [departmentRouter, roleRouter, employeeRouter, permissionRouter, attendanceRouter, approvalRouter, salaryRouter, socialRouter]

// 创建路由实例的工厂函数
const createRouter = () => new Router({
  mode: 'history', // 需要服务端支持
  scrollBehavior: () => ({ y: 0 }), // 页面切换时滚动到顶部
  routes: constantRoutes // 初始化时使用常量路由
})

// 路由实例
const router = createRouter()

// 详情参见: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  // 重置路由实例，用于登录后重新设置权限相关的路由
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由匹配器
}

// 导出路由实例作为默认导出
export default router
