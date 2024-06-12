<template>
  <!-- 当菜单项不隐藏时显示 -->
  <!-- 判断是否隐藏菜单 -->
  <div v-if="!item.hidden">
    <!-- 当只有一个子菜单项且没有子菜单项或子菜单项都隐藏时，且不总是显示菜单 -->
    <template
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
    >
      <!-- 如果子菜单项有 meta 信息，则显示为链接 -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :class="{'submenu-title-noDropdown':!isNest}" :index="resolvePath(onlyOneChild.path)">
          <!-- 显示子菜单项的图标和标题 -->
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>
    <!-- 当不满足上述条件时，显示为子菜单 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <!-- 显示父菜单项的图标和标题 -->
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- 遍历子菜单项，递归显示每个子菜单项 -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :base-path="resolvePath(child.path)"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

/**
 * 侧边栏菜单项组件
 * 负责渲染侧边栏中的菜单项结构
 */
export default {
  name: 'SidebarItem',
  components: { Item, AppLink }, // 引入的子组件
  mixins: [FixiOSBug], // 应用的混入，用于修复 iOS 系统特定问题
  props: {
    /**
     * 路由对象
     * 用于配置当前菜单项的数据
     */
    item: {
      type: Object,
      required: true
    },
    /**
     * 是否为嵌套结构
     * 标识当前菜单项下是否还有子菜单
     */
    isNest: {
      type: Boolean,
      default: false
    },
    /**
     * 基础路径
     * 用于拼接最终的路由地址
     */
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // 解决特定问题的临时变量声明
    // 详情见: https://github.com/PanJiaChen/vue-admin-template/issues/237
    // 计划重构使用渲染函数处理
    this.onlyOneChild = null
    return {}
  },
  methods: {
    /**
     * 判断给定的子菜单数组中是否只有一个可见的子菜单项
     * 如果是，则会将那个子菜单项临时存储在组件实例上
     *
     * @param {Array} children - 子菜单数组
     * @param {Object} parent - 父菜单项对象
     * @returns {Boolean} - 如果只有一个子菜单项可见则返回 true，否则返回 false
     */
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // 如果是唯一可见的子菜单项，则暂存
          this.onlyOneChild = item
          return true
        }
      })
      // 只有一个子菜单时，默认展开
      if (showingChildren.length === 1) {
        return true
      }
      // 没有可显示的子菜单时，显示父级作为默认
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    },
    /**
     * 根据 basePath 解析路由路径
     * 支持外部链接判断
     *
     * @param {String} routePath - 路由路径或外部链接
     * @returns {String} - 解析后的路径，可能是绝对路径、相对路径或外部链接
     */
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath // 直接返回外部链接
      }
      if (isExternal(this.basePath)) {
        return this.basePath // 基础路径本身就是外部链接，直接返回
      }
      return path.resolve(this.basePath, routePath) // 否则，拼接路径
    }
  }
}
</script>
