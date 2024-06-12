<script>
export default {
  // 组件名称
  name: 'MenuItem',
  // 使用函数式组件
  functional: true,
  // 定义组件的 props
  props: {
    // 图标名称，可以是字符串或包含 el-icon 的类名
    icon: {
      type: String,
      default: ''
    },
    // 菜单项的标题
    title: {
      type: String,
      default: ''
    }
  },
  // 渲染函数
  render(h, context) {
    // 解构获取 icon 和 title props
    // 图标 和 标题
    const { icon, title } = context.props
    // 存储要渲染的子节点
    const vnodes = []
    // 根据 icon 的类型，创建对应的图标元素
    // 渲染图标
    if (icon) {
      if (icon.includes('el-icon')) {
        // 如果 icon 是 el-icon 类名，则创建一个 i 元素，并添加对应的类名
        vnodes.push(<i class={[icon, 'sub-el-icon']}/>)
      } else {
        // 如果 icon 是 svg 图标名称，则创建一个 svg-icon 组件，并传递 icon-class prop
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }
    // 如果有 title，则创建一个 span 元素，并设置其 slot 为 title
    // 渲染标题
    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    // 返回要渲染的子节点
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
