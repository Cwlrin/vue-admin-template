<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    // 规定一个必需的字符串类型属性'to'，用于指定链接的目标位置
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    // 判断属性'to'是否为外部链接
    isExternal() {
      return isExternal(this.to)
    },
    // 根据链接是否为外部链接，决定组件的类型
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    /**
     * 根据链接是否为外部链接，返回相应的链接属性。
     *
     * 此方法用于确定一个链接应该如何被渲染。如果链接被识别为外部链接，
     * 则会返回包含 `href`、`target` 和 `rel` 属性的对象，以确保链接在新标签页中打开，
     * 并且不会传递页面的 SEO 值给目标页面。如果链接不是外部链接，
     * 则会返回一个包含 `to` 属性的对象，这是 Vue Router 使用的属性，
     * 用于在应用内部导航。
     *
     * @param {string} to 链接的目标位置。可以是绝对路径或相对路径。
     * @returns {Object} 返回一个对象，包含链接所需的属性。
     */
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
