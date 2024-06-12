<template>
  <section class="app-main">
    <transition mode="out-in" name="fade-transform">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
/**
 * AppMain 组件
 * 该组件作为应用程序的主要部分，负责根据当前路由路径进行相应的操作。
 *
 * @export 默认导出该组件定义
 * @returns {Object} 返回一个包含组件名称、计算属性的对象
 */
export default {
  name: 'AppMain', // 定义组件名称
  computed: {
    /**
     * 计算属性：key
     * 该计算属性用于根据当前路由的路径生成一个键值，用于实现某些基于路由变化的功能。
     * 例如，可以使用这个键值来触发组件的重新渲染，或者作为缓存的键来实现路由级别的缓存。
     *
     * @returns {string} 返回当前路由的路径作为键值
     */
    key() {
      return this.$route.path // 根据当前路由路径生成键值
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
