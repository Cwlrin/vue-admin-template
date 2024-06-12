import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from '@/router'

/**
 * 定义白名单列表，包含不需要登录即可访问的路径
 * @type {Array}
 */
const whiteList = ['/login', '/404']

/**
 * 在每个路由切换之前执行的守卫函数
 * 主要用于处理用户权限和页面进度条的控制
 * @param {Object} to - 将要进入的目标路由对象
 * @param {Object} from - 当前的路由对象
 * @param {Function} next - 前进函数，用于执行下一个路由
 */
router.beforeEach(async(to, from, next) => {
  // 开始页面加载进度条
  nprogress.start()
  // 检查是否有 token，即用户是否已登录
  if (store.getters.token) {
    // 如果当前路径是登录页，且用户已登录，重定向到首页
    if (to.path === '/login') {
      next('/')
      // 完成页面加载进度条
      nprogress.done()
    } else {
      // 如果用户已登录但未获取用户信息，则获取用户信息
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // 根据用户角色过滤路由，生成用户可访问的路由列表
        const filterRoutes = asyncRoutes.filter(item => {
          return roles.menus.includes(item.name)
        })
        // 将过滤后的路由设置到 store 中
        store.commit('user/setRoutes', filterRoutes)
        // 动态添加可访问路由到 router
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        // 重定向到原目标路由
        next(to.path)
      } else {
        // 用户已登录且已获取用户信息，直接前进到目标路由
        next()
      }
    }
  } else {
    // 如果用户未登录，检查当前请求的路径是否在白名单内
    if (whiteList.includes(to.path)) {
      // 如果在白名单内，直接前进
      next()
    } else {
      // 如果不在白名单内，重定向到登录页
      next('/login')
      // 完成页面加载进度条
      nprogress.done()
    }
  }
})

/**
 * 在每个路由切换完成后执行的守卫函数
 * 主要用于完成页面加载进度条
 */
router.afterEach(() => {
  // 完成页面加载进度条
  nprogress.done()
})
