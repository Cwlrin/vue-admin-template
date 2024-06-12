// 导入 Vue 测试工具和 VueRouter，以及 ElementUI 组件库和 Breadcrumb 组件
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb/index.vue'

// 创建一个局部的 Vue 实例，用于隔离测试环境
const localVue = createLocalVue()

// 使用 VueRouter 和 ElementUI
localVue.use(VueRouter)
localVue.use(ElementUI)

// 定义路由配置，包含首页和菜单页面的路由
const routes = [{
  path: '/', name: 'home', children: [{
    path: 'dashboard', name: 'dashboard'
  }]
}, {
  path: '/menu', name: 'menu', children: [{
    path: 'menu1', name: 'menu1', meta: { title: 'menu1' }, children: [{
      path: 'menu1-1', name: 'menu1-1', meta: { title: 'menu1-1' }
    }, {
      path: 'menu1-2', name: 'menu1-2', redirect: 'noredirect', meta: { title: 'menu1-2' }, children: [{
        path: 'menu1-2-1', name: 'menu1-2-1', meta: { title: 'menu1-2-1' }
      }, {
        path: 'menu1-2-2', name: 'menu1-2-2'
      }]
    }]
  }]
}]

// 创建一个路由器实例，用于管理页面路由
const router = new VueRouter({
  routes
})

// 对 Breadcrumb 组件进行单元测试
describe('Breadcrumb.vue', () => {
  // 挂载Breadcrumb组件，使用局部Vue实例和路由器
  const wrapper = mount(Breadcrumb, {
    localVue, router
  })

  // 测试路由为'/dashboard'时，breadcrumb 的项数
  it('dashboard', () => {
    router.push('/dashboard')
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(1)
  })

  // 测试普通路由'/menu/menu1'时，breadcrumb 的项数
  it('normal route', () => {
    router.push('/menu/menu1')
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(2)
  })

  // 测试嵌套路由'/menu/menu1/menu1-2/menu1-2-1'时，breadcrumb 的项数
  it('nested route', () => {
    router.push('/menu/menu1/menu1-2/menu1-2-1')
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(4)
  })

  // 测试没有'meta.title'的路由'/menu/menu1/menu1-2/menu1-2-2'，breadcrumb 的项数
  it('no meta.title', () => {
    router.push('/menu/menu1/menu1-2/menu1-2-2')
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(3)
  })
  // it('click link', () => {
  //   router.push('/menu/menu1/menu1-2/menu1-2-2')
  //   const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner')
  //   const second = breadcrumbArray.at(1)
  //   console.log(breadcrumbArray)
  //   const href = second.find('a').attributes().href
  //   expect(href).toBe('#/menu/menu1')
  // })
  // it('noRedirect', () => {
  //   router.push('/menu/menu1/menu1-2/menu1-2-1')
  //   const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner')
  //   const redirectBreadcrumb = breadcrumbArray.at(2)
  //   expect(redirectBreadcrumb.contains('a')).toBe(false)
  // })
  // 测试最后的 breadcrumb 项是否不包含链接
  it('last breadcrumb', () => {
    router.push('/menu/menu1/menu1-2/menu1-2-1')
    const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner')
    const redirectBreadcrumb = breadcrumbArray.at(3)
    expect(redirectBreadcrumb.contains('a')).toBe(false)
  })
})
