// 导入测试工具的 shallowMount 方法和要测试的 SvgIcon 组件
import { shallowMount } from '@vue/test-utils'
import SvgIcon from '@/components/SvgIcon/index.vue'

// 描述 SvgIcon.vue 组件的测试用例
describe('SvgIcon.vue', () => {
  // 测试 iconClass 属性是否正确设置 SVG 图标
  it('iconClass', () => {
    // 使用 shallowMount 挂载 SvgIcon 组件，传入 iconClass 测试属性
    const wrapper = shallowMount(SvgIcon, {
      propsData: {
        iconClass: 'test'
      }
    })
    // 验证 SVG use 元素的 href 是否匹配 iconClass 属性值
    expect(wrapper.find('use').attributes().href).toBe('#icon-test')
  })

  // 测试 className 属性是否正确应用到组件上
  it('className', () => {
    // 挂载 SvgIcon 组件，初始不传入 className 属性
    const wrapper = shallowMount(SvgIcon, {
      propsData: {
        iconClass: 'test'
      }
    })
    // 检查组件初始类列表的长度
    expect(wrapper.classes().length).toBe(1)
    // 动态设置 className 属性
    wrapper.setProps({ className: 'test' })
    // 验证组件是否包含设置的 className
    expect(wrapper.classes().includes('test')).toBe(true)
  })
})
