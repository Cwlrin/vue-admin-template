/**
 * 导入格式化时间的工具函数
 */
import { formatTime } from '@/utils/index.js'

/**
 * 描述 formatTime 函数的测试集
 * 该测试集旨在验证 formatTime 函数是否能正确地将时间戳格式化为易读的日期字符串
 */
describe('Utils:formatTime', () => {
  /**
   * 初始化一个日期对象，用于后续的测试
   * @type {Date}
   */
  const d = new Date('2018-07-13 17:54:01')
  /**
   * 定义一个时间偏移量，用于调整测试时间，避免因系统时间不同导致的测试失败
   * @type {number}
   */
  const retrofit = 5 * 1000

  /**
   * 测试当时间戳为十位数字时，formatTime 函数的返回值
   * 验证函数能否正确格式化为"月日时分"的字符串格式
   */
  it('ten digits timestamp', () => {
    expect(formatTime((d / 1000).toFixed(0))).toBe('7月13日17时54分')
  })

  /**
   * 测试当前时间戳为 1 秒前，formatTime 函数应返回"刚刚"
   */
  it('test now', () => {
    expect(formatTime(+new Date() - 1)).toBe('刚刚')
  })

  /**
   * 测试当前时间戳为 2 分钟前，formatTime 函数应返回"2分钟前"
   */
  it('less two minute', () => {
    expect(formatTime(+new Date() - 60 * 2 * 1000 + retrofit)).toBe('2分钟前')
  })

  /**
   * 测试当前时间戳为 2 小时前，formatTime 函数应返回"2小时前"
   */
  it('less two hour', () => {
    expect(formatTime(+new Date() - 60 * 60 * 2 * 1000 + retrofit)).toBe('2小时前')
  })

  /**
   * 测试当前时间戳为 1 天前，formatTime 函数应返回"1天前"
   */
  it('less one day', () => {
    expect(formatTime(+new Date() - 60 * 60 * 24 * 1 * 1000)).toBe('1天前')
  })

  /**
   * 测试日期对象直接作为参数，formatTime 函数应正确格式化为"月日时分"的字符串格式
   */
  it('more than one day', () => {
    expect(formatTime(d)).toBe('7月13日17时54分')
  })

  /**
   * 测试自定义格式化字符串，验证 formatTime 函数的灵活性和正确性
   */
  it('format', () => {
    expect(formatTime(d, '{y}-{m}-{d} {h}:{i}')).toBe('2018-07-13 17:54')
    expect(formatTime(d, '{y}-{m}-{d}')).toBe('2018-07-13')
    expect(formatTime(d, '{y}/{m}/{d} {h}-{i}')).toBe('2018/07/13 17-54')
  })
})

