<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
// 导入用于验证 URL 是否为外部链接的函数
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from '@/utils/validate'

export default {
  // 组件名称
  name: 'SvgIcon',
  props: {
    // 图标类名，必须提供
    iconClass: {
      type: String,
      required: true
    },
    // 自定义 CSS 类名，可选
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    /**
     * 判断图标类名是否为外部链接。
     *
     * 该方法用于检查当前组件的 iconClass 属性是否符合外部链接的条件。
     * 如果 iconClass 属性被识别为外部链接，方法将返回 true；否则返回 false。
     * 这种判断对于决定图标如何展示或处理（例如，是否添加目标 =_blank 属性）是必要的。
     *
     * @returns {boolean} 如果图标类名是外部链接，则返回 true；否则返回 false。
     */
    isExternal() {
      return isExternal(this.iconClass)
    },
    /**
     * 构造图标的 ID。
     *
     * 此方法用于生成图标的唯一 ID，基于图标的类名。图标的类名是通过 `iconClass` 属性传入的。
     * 生成唯一 ID 是为了在页面中能够准确地引用和操作特定的图标元素。
     *
     * @returns {string} 返回构造的图标 ID 字符串，格式为 `#icon- 图标类名 `。
     */
    iconName() {
      // 使用 `this.iconClass` 构造并返回图标 ID 字符串
      return `#icon-${this.iconClass}`
    },
    /**
     * 根据当前组件的 className 属性生成 SVG 图标类名。
     *
     * 该方法用于确保 SVG 图标始终具有一个基础类名 'svg-icon'，同时允许通过 className 属性传递额外的类名。
     * 如果组件的 className 属性存在，则返回一个组合了基础类名和传入类名的字符串；如果 className 属性不存在，
     * 则仅返回基础类名。这种方法使得在不修改组件核心类名的前提下，能够灵活地为 SVG 图标添加自定义样式。
     *
     * @returns {string} 生成的 SVG 图标类名字符串。
     */
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    /**
     * 计算外部图标的样式
     *
     * 此方法用于生成外部图标的样式对象，该对象包含了图标显示所需的 CSS 属性。
     * 主要用于设置图标的位置和重复方式，确保图标能正确显示在对应元素上。
     *
     * @returns {Object} 返回一个包含 CSS 样式属性的对象，用于应用到外部图标元素上。
     */
    styleExternalIcon() {
      // 使用 URL 和 no-repeat 属性设置 mask 样式，以显示图标
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
