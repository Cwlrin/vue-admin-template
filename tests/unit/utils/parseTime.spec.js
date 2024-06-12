/**
 * 导入 parseTime 函数，用于测试时间解析功能。
 */
import { parseTime } from '@/utils/index.js'

/**
 * 描述 parseTime 函数的测试组。
 * 这里将对 parseTime 函数的各种用例进行测试，以确保它能正确解析不同格式的时间输入。
 */
describe('Utils:parseTime', () => {
  /**
   * 创建一个日期对象，用于后续的测试。
   * @type {Date}
   */
  const d = new Date('2018-07-13 17:54:01')

  /**
   * 测试当传入 Date 对象时，parseTime 函数是否能正确返回时间字符串。
   */
  it('timestamp', () => {
    expect(parseTime(d)).toBe('2018-07-13 17:54:01')
  })

  /**
   * 测试当传入 Date 对象的字符串表示时，parseTime 函数是否能正确返回时间字符串。
   */
  it('timestamp string', () => {
    expect(parseTime((d + ''))).toBe('2018-07-13 17:54:01')
  })

  /**
   * 测试当传入十位数字的时间戳时，parseTime 函数是否能正确返回时间字符串。
   */
  it('ten digits timestamp', () => {
    expect(parseTime((d / 1000).toFixed(0))).toBe('2018-07-13 17:54:01')
  })

  /**
   * 测试当传入新的 Date 对象时，parseTime 函数是否能正确返回时间字符串。
   */
  it('new Date', () => {
    expect(parseTime(new Date(d))).toBe('2018-07-13 17:54:01')
  })

  /**
   * 测试 parseTime 函数是否能根据指定格式返回时间字符串。
   */
  it('format', () => {
    expect(parseTime(d, '{y}-{m}-{d} {h}:{i}')).toBe('2018-07-13 17:54')
    expect(parseTime(d, '{y}-{m}-{d}')).toBe('2018-07-13')
    expect(parseTime(d, '{y}/{m}/{d} {h}-{i}')).toBe('2018/07/13 17-54')
  })

  /**
   * 测试 parseTime 函数是否能正确返回中文星期几。
   */
  it('get the day of the week', () => {
    expect(parseTime(d, '{a}')).toBe('五') // 星期五
  })

  /**
   * 测试 parseTime 函数对两天后的日期返回正确的中文星期几。
   */
  it('get the day of the week', () => {
    expect(parseTime(+d + 1000 * 60 * 60 * 24 * 2, '{a}')).toBe('日') // 星期日
  })

  /**
   * 测试当不传入任何参数时，parseTime 函数的返回值。
   */
  it('empty argument', () => {
    expect(parseTime()).toBeNull()
  })

  /**
   * 测试当传入 null 时，parseTime 函数的返回值。
   */
  it('null', () => {
    expect(parseTime(null)).toBeNull()
  })
})
