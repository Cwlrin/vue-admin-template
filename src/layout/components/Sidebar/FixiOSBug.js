/**
 * 此组件用于处理设备类型及 iOS 设备上的特定错误。
 * 通过计算属性获取设备类型，并在挂载后尝试修复 iOS 设备上的 mouseleave 事件错误。
 * fixBugIniOS 方法修改了子菜单组件的 mouseleave 事件处理器，以防止在移动设备上出现该错误。
 */
export default {
  computed: {
    /**
     * 计算并返回设备类型。
     * @returns {string} 设备类型，如 'mobile' 或 'desktop'。
     */
    device() {
      return this.$store.state.app.device
    }
  }, mounted() {
    // 为了解决 iOS 设备上点击菜单触发 mouseleave 错误的问题
    // https://github.com/PanJiaChen/vue-element-admin/issues/1135
    this.fixBugIniOS()
  }, methods: {
    /**
     * 解决 iOS 设备上菜单点击后错误触发 mouseleave 事件的问题。
     * 通过重写 submenu 组件的 mouseleave 处理器，仅在非移动设备上执行原始的 mouseleave 逻辑。
     */
    fixBugIniOS() {
      // 获取 submenu 组件的引用
      const $subMenu = this.$refs.subMenu
      // 如果 submenu 组件存在
      if ($subMenu) {
        // 获取原始的 mouseleave 事件处理函数
        const handleMouseleave = $subMenu.handleMouseleave
        // 重写 handleMouseleave 函数
        $subMenu.handleMouseleave = (e) => {
          // 如果当前设备不是移动设备
          if (this.device !== 'mobile') {
            // 执行原始的 mouseleave 处理逻辑
            handleMouseleave(e)
          }
        }
      }
    }
  }
}
