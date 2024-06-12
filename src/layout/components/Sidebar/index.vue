<template>
  <div :class="{'has-logo':showLogo}">
    <!-- 当显示 Logo 时，渲染 Logo 组件 -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 使用 el-scrollbar 组件以提供滚动功能，优化菜单显示 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 根据路由信息动态生成侧边栏菜单 -->
      <!-- 左侧菜单 -->
      <el-menu
        :active-text-color="variables.menuActiveText"
        :background-color="variables.menuBg"
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
        :text-color="variables.menuText"
        :unique-opened="false"
        mode="vertical"
      >
        <!-- 循环遍历路由信息，动态生成菜单项 -->
        <!-- 循环路由信息 -->
        <sidebar-item v-for="route in routes" :key="route.path" :base-path="route.path" :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  // 注册组件
  components: { SidebarItem, Logo },
  computed: {
    // 将 Vuex 中的 sidebar 和 routes 状态映射到计算属性
    ...mapGetters([
      'sidebar', 'routes'
    ]),
    /**
     * 获取当前激活的菜单项。
     *
     * 该方法用于确定侧边栏中应激活的菜单项。它首先检查当前路由的元数据（meta）
     * 是否包含 `activeMenu` 属性。如果存在，这个属性的值将决定侧边栏的激活状态。
     * 如果元数据中没有 `activeMenu` 属性，则默认使用当前路由的路径作为激活菜单项。
     * 这种设计允许开发者灵活地控制侧边栏的激活状态，既可以基于路由路径，也可以基于
     * 其他自定义逻辑。
     *
     * @returns {string} 返回当前应激活的菜单项的路径或标识。
     */
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // 如果设置了路径，侧边栏将突出显示设置的路径
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    /**
     * 决定是否显示侧边栏 Logo。
     *
     * 该方法通过访问 Vuex 存储中的 settings 对象的 sidebarLogo 属性，
     * 来确定侧边栏是否应该显示 Logo。如果 sidebarLogo 值为真，
     * 则返回 true，表示应该显示 Logo；否则返回 false，表示不应该显示 Logo。
     *
     * @returns {boolean} - 返回一个布尔值，指示侧边栏是否应该显示 Logo。
     */
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    /**
     * 导出组件的样式变量
     *
     * 该方法作为一个计算属性，用于返回样式变量对象。这样做是为了使组件能够根据
     * 主题或环境的变化动态地使用不同的样式变量，而不需要修改组件本身的代码。
     * 样式变量可能包括颜色、字体大小等，它们可以被组件内部的样式规则引用。
     *
     * @returns {Object} 返回一个包含样式变量的对象
     */
    variables() {
      return variables
    },
    /**
     * 判断侧边栏是否处于折叠状态
     *
     * 该方法用于根据侧边栏的打开状态决定是否返回折叠状态。
     * 侧边栏的打开状态由 sidebar 对象中的 opened 属性控制。
     * 如果 opened 为 false，则表示侧边栏是打开的；反之，如果 opened 为 true，
     * 则表示侧边栏是折叠的。因此，该方法通过取 opened 的反义来
     * 确定侧边栏当前的状态。
     *
     * @returns {boolean} 返回一个布尔值，表示侧边栏是否处于折叠状态。
     *                     如果侧边栏是打开的，返回 false；如果是折叠的，返回 true。
     */
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
