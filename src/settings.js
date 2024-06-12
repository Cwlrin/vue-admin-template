/**
 * 人力资源后台管理系统配置导出模块
 *
 * 本模块导出一个对象，包含了人力资源后台管理系统的一些配置项，
 * 用于定制系统界面和行为。
 */
module.exports = {

  /**
   * 系统标题
   *
   * 定义了人力资源后台管理系统的标题。此标题通常显示在系统主界面的顶部。
   */
  title: '人力资源后台管理系统',

  /**
   * 是否固定顶部导航栏
   *
   * 此配置项决定顶部导航栏是否固定在屏幕顶部。当设置为 true 时，导航栏会在用户滚动页面时保持在顶部可见。
   * @type {boolean} true | false
   * @description 是否固定表头
   */
  fixedHeader: false,

  /**
   * 是否在侧边栏显示 logo
   *
   * 此配置项控制是否在侧边栏显示系统的 logo。当设置为 true 时，logo 会出现在侧边栏的顶部。
   * @type {boolean} true | false
   * @description 是否在侧边栏中显示徽标
   */
  sidebarLogo: true
}

