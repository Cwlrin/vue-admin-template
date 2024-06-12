<template>
  <!-- 使用 Element UI 的 Breadcrumb 组件实现面包屑导航，通过 separator 属性定义分隔符为"/" -->
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- 使用 transition-group 组件对 breadcrumb-item 进行过渡效果处理 -->
    <transition-group name="breadcrumb">
      <!-- 遍历 levelList 中的每个路由项，生成 breadcrumb-item -->
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <!-- 当路由项的 redirect 属性为'noRedirect'或当前项为最后一项时，不跳转，显示为普通文本 -->
        <span
          v-if="item.redirect==='noRedirect'||index==levelList.length-1"
          class="no-redirect"
        >{{ item.meta.title }}</span>
        <!-- 否则，生成可点击的链接，点击时触发 handleLink 方法 -->
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      // 存储面包屑列表
      levelList: null
    }
  },
  watch: {
    $route() {
      // 路由变化时更新面包屑
      this.getBreadcrumb()
    }
  },
  created() {
    // 组件创建时初始化面包屑
    this.getBreadcrumb()
  },
  methods: {
    /**
     * 生成面包屑导航列表。
     * 根据当前路由，筛选出需要展示在面包屑中的路由。
     */
    getBreadcrumb() {
      // 过滤出具有 meta.title 定义的匹配路由
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      // 如果首项不是仪表板，则在其前添加仪表板路由
      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '仪表板' }}].concat(matched)
      }

      // 过滤掉不应在面包屑中显示的路由
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },

    /**
     * 判断给定的路由是否为仪表板页面。
     * @param {Object} route - 路由对象
     * @return {boolean} 返回 true 表示是仪表板页面，否则为 false
     */
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === '仪表板'.toLocaleLowerCase()
    },

    /**
     * 根据动态参数编译路径。
     * 解决路径中含有动态参数时的跳转问题。
     */
    pathCompile(path) {
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },

    /**
     * 处理面包屑项的点击事件。
     * 根据 item 的 redirect 或 path 属性进行页面跳转。
     * @param {Object} item - 面包屑项对象
     */
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
