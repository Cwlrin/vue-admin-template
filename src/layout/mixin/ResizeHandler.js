import store from '@/store' // 从应用的 Vuex store 导入

// 常量定义
const { body } = document // 获取文档的body元素
const WIDTH = 992 // 设备宽度切换到移动视图的临界值，参考Bootstrap的响应式设计

export default {
  // 监听路由变化，当从移动端访问且侧边栏打开时，关闭侧边栏
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false }) // 关闭侧边栏，可选择是否有动画效果
      }
    }
  },
  // 挂载前，添加窗口大小调整事件监听器
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  // 销毁前，移除窗口大小调整事件监听器
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  // 组件挂载后，检测是否为移动设备并相应调整设备状态和侧边栏
  mounted() {
    const isMobile = this.$_isMobile() // 判断当前是否为移动设备
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile') // 切换至移动设备模式
      store.dispatch('app/closeSideBar', { withoutAnimation: true }) // 关闭侧边栏，无动画效果
    }
  },
  methods: {
    // 私有方法，用于判断当前浏览环境是否为移动设备
    // 遵循Vue.js风格指南中关于混合属性的命名约定
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect() // 获取body元素的边界信息
      return rect.width - 1 < WIDTH // 如果宽度小于阈值则认为是移动设备
    },
    // 处理窗口大小变化的事件处理器
    $_resizeHandler() {
      if (!document.hidden) { // 确保页面不是隐藏状态
        const isMobile = this.$_isMobile() // 重新判断是否为移动设备
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop') // 根据设备类型切换应用设备模式

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true }) // 移动设备上关闭侧边栏，无动画
        }
      }
    }
  }
}
