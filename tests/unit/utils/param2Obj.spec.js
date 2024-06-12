/**
 * 导入从 URL 参数字符串创建对象的工具函数
 * @fileOverview 测试 utils 文件中 param2Obj 函数的功能
 * @requires utils/index.js
 */
import { param2Obj } from '@/utils/index.js'

/**
 * 描述 param2Obj 函数的测试套件
 * @param {string} url - 包含查询参数的 URL 字符串
 */
describe('Utils:param2Obj', () => {
  // 定义一个包含查询参数的 URL 字符串
  const url = 'https://github.com/PanJiaChen/vue-element-admin?name=bill&age=29&sex=1&field=dGVzdA==&key=%E6%B5%8B%E8%AF%95'

  /**
   * 测试 param2Obj 函数是否能正确解析 URL 查询参数
   * @test param2Obj 函数的正确性
   */
  it('param2Obj test', () => {
    // 断言 param2Obj 函数处理特定 URL 后的结果
    expect(param2Obj(url)).toEqual({
      name: 'bill', age: '29', sex: '1', field: window.btoa('test'), // 解码 base64 字符串
      key: '测试' // 解码 URL 编码字符
    })
  })
})
