<template>
  <!-- 应用程序主容器，用于包裹整个应用的布局 -->
  <div :class="classObj" class="app-wrapper">
    <!-- 当设备为移动设备且侧边栏打开时，显示遮罩层，点击关闭侧边栏 -->
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- 侧边栏组件，用于展示导航菜单 -->
    <sidebar class="sidebar-container" />
    <!-- 主内容区域，包含页面的主要内容和子组件 -->
    <div class="main-container">
      <!-- 头部导航区域，当设置为固定头部时，始终保持在顶部 -->
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <!-- 主要内容区域，用于展示具体的功能和内容 -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components' // 导入组件
import ResizeMixin from './mixin/ResizeHandler' // 导入混入，用于处理窗口大小改变

export default {
  name: 'Layout', // 定义组件名称
  components: {
    Navbar,
    Sidebar,
    AppMain
  }, // 注册组件
  mixins: [ResizeMixin], // 使用混入，以响应窗口大小变化
  computed: {
    /**
     * 获取侧边栏的状态。
     *
     * 该方法通过访问 Vuex 存储来获取应用的侧边栏状态。这允许组件根据侧边栏的状态
     * （例如，是否展开）来决定如何渲染自己。这种方法促进了状态的集中管理和组件之间的通信，
     * 增强了应用的可维护性和可扩展性。
     *
     * @returns {boolean} 侧边栏的当前状态。返回值为 true 表示侧边栏是展开的，false 表示它是收起的。
     */
    sidebar() {
      return this.$store.state.app.sidebar
    },
    /**
     * 获取当前设备类型
     *
     * 该方法通过访问 Vuex 存储中的 app.device 状态来获取当前设备的类型。
     * 这对于根据设备类型进行相应的界面布局或功能调整非常有用。
     *
     * @returns {string} 当前设备的类型，例如 'mobile' 或 'desktop'
     */
    device() {
      return this.$store.state.app.device
    },
    /**
     * 获取固定头部设置
     *
     * 该方法用于从 Vuex 存储中检索设置信息，具体来说是检查是否启用了固定头部。
     * 这对于根据设置动态调整页面布局非常重要，例如，如果启用了固定头部，
     * 则可能需要调整其他页面元素的位置或样式以适应固定头部。
     *
     * @returns {boolean} 返回固定头部设置的状态。如果为 true，则表示固定头部已启用；
     * 如果为 false，则表示未启用。
     */
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    /**
     * 计算类名对象，用于根据应用的状态动态调整侧边栏的样式。
     * 这个方法基于 sidebar 的状态和当前设备类型，返回一个对象，
     * 对象的键值对对应着类名和布尔值，布尔值决定该类名是否应该被应用。
     *
     * @returns {Object} 返回一个对象，对象中包含了根据侧边栏状态和设备类型计算得出的类名。
     */
    // 计算类名对象，根据 sidebar 状态和设备类型调整布局
    classObj() {
      // 返回一个对象，对象的属性用于控制侧边栏的显示和隐藏、动画效果以及针对移动设备的布局。
      return {
        // 当侧边栏关闭时，应用 'hideSidebar' 类名。
        hideSidebar: !this.sidebar.opened,
        // 当侧边栏打开时，应用 'openSidebar' 类名。
        openSidebar: this.sidebar.opened,
        // 当侧边栏关闭时没有动画效果时，应用 'withoutAnimation' 类名。
        withoutAnimation: this.sidebar.withoutAnimation,
        // 当设备为移动设备时，应用 'mobile' 类名。
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    /**
     * 监听组件外部的点击事件
     *
     * 该函数用于处理组件外部点击事件，当检测到外部点击时，它将触发一个 Vuex 动作来关闭侧边栏。
     * 关闭侧边栏时不会使用动画效果，这是通过传递 {withoutAnimation: false} 参数来实现的。
     * 这种方式可以确保用户在与组件外的其他元素交互时，侧边栏能够平滑且直观地隐藏起来。
     *
     * @returns {void}
     */
    // 当组件外部被点击时，关闭 sidebar
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
</style>
