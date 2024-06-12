// 导入 Vue 测试工具的 shallowMount 方法和 Hamburger 组件
import { shallowMount } from '@vue/test-utils'
import Hamburger from '@/components/Hamburger/index.vue'

// 描述 Hamburger.vue 组件的测试用例
describe('Hamburger.vue', () => {
  // 测试点击汉堡菜单的切换事件
  it('toggle click', () => {
    // 使用 shallowMount 挂载 Hamburger 组件
    const wrapper = shallowMount(Hamburger)
    // 创建一个 jest 函数模拟 $on 方法
    const mockFn = jest.fn()
    // 监听 toggleClick 事件，并模拟点击汉堡菜单
    wrapper.vm.$on('toggleClick', mockFn)
    wrapper.find('.hamburger').trigger('click')
    // 验证 toggleClick 事件是否被调用
    expect(mockFn).toBeCalled()
  })

  // 测试 isActive 属性是否正确地影响组件状态
  it('prop isActive', () => {
    // 挂载 Hamburger 组件并设置 isActive 为 true
    const wrapper = shallowMount(Hamburger)
    wrapper.setProps({ isActive: true })
    // 验证组件是否包含.is-active 类
    expect(wrapper.contains('.is-active')).toBe(true)
    // 更新 isActive 为 false
    wrapper.setProps({ isActive: false })
    // 验证组件是否不再包含.is-active 类
    expect(wrapper.contains('.is-active')).toBe(false)
  })
})
