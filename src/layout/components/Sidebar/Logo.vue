<template>
  <!-- 侧边栏 logo 容器，通过 collapse 属性控制是否折叠 -->
  <div :class="{'collapse':collapse}" class="sidebar-logo-container">
    <!-- 使用 transition 组件实现 logo 的淡入淡出效果 -->
    <transition name="sidebarLogoFade">
      <!-- 当侧边栏处于折叠状态时，使用带 logo 图片的链接 -->
      <router-link key="collapse" class="sidebar-logo-link" to="/">
        <!-- logo 图片路径 -->
        <img class="sidebar-logo" src="@/assets/common/logo.png">
      </router-link>
    </transition>
  </div>
</template>

<script>
/**
 * 侧边栏 Logo 组件
 *
 * 该组件用于在应用的侧边栏中显示 Logo。
 * 它接受一个 collapse prop，用于根据侧边栏的展开或折叠状态来调整 Logo 的显示方式。
 */
export default {
  name: 'SidebarLogo',
  props: {
    /**
     * 是否折叠侧边栏
     *
     * 该属性用于控制 Logo 在侧边栏折叠时的显示行为。
     * 当侧边栏折叠时，Logo 可能会缩小或以其他方式适应更小的空间。
     */
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Vue Admin Template', // 应用的名称
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png' // 应用的 Logo 图片链接
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 140px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
      width: 32px;
      height: 32px;
    }
  }
}
</style>
