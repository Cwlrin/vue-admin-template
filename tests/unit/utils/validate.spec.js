// 导入验证工具集中的两个验证函数
import { validUsername, isExternal } from '@/utils/validate.js'

// 描述验证工具集的单元测试
describe('Utils:validate', () => {
  // 测试用户名的有效性
  it('validUsername', () => {
    // 期望 'admin' 符合用户名规则
    expect(validUsername('admin')).toBe(true)
    // 期望 'editor' 符合用户名规则
    expect(validUsername('editor')).toBe(true)
    // 期望 'xxxx' 不符合用户名规则
    expect(validUsername('xxxx')).toBe(false)
  })

  // 测试外部链接的识别
  it('isExternal', () => {
    // 期望 https 链接被识别为外部链接
    expect(isExternal('https://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    // 期望 http 链接被识别为外部链接
    expect(isExternal('http://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    // 期望不带协议的链接不被识别为外部链接
    expect(isExternal('github.com/PanJiaChen/vue-element-admin')).toBe(false)
    // 期望相对路径不被识别为外部链接
    expect(isExternal('/dashboard')).toBe(false)
    // 期望相对路径不被识别为外部链接
    expect(isExternal('./dashboard')).toBe(false)
    // 期望仅域名不被识别为外部链接
    expect(isExternal('dashboard')).toBe(false)
  })
})
