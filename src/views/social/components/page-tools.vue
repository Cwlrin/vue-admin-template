<template>
  <!-- 使用 el-card 组件作为页面工具栏的容器，通过 class"page-tools"进行样式定义 -->
  <el-card class="page-tools">
    <!-- 使用 el-row 和 el-col 组件实现内容的栅格布局，以便灵活安排前后内容 -->
    <el-row align="middle" justify="space-between" type="flex">
      <!-- 当有前置内容时，通过 v-if 控制显示 -->
      <el-col>
        <div v-if="showBefore" class="before">
          <!-- 使用 el-icon-info 图标作为信息提示的图形化表示 -->
          <i class="el-icon-info" />
          <!-- 为前置内容预留的插槽，允许用户自定义显示内容 -->
          <slot name="before" />
        </div>
      </el-col>
      <!-- 后置内容区域，通过 flex 布局的 justify="end"实现右对齐 -->
      <el-col>
        <el-row justify="end" type="flex">
          <!-- 为后置内容预留的插槽，允许用户自定义显示内容 -->
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
/**
 * 组件默认导出对象，定义了组件的属性和行为。
 */
export default {
  /**
   * 定义组件接收的属性。
   *
   * @property {Boolean} showBefore - 控制组件中某个内容区域是否显示的属性。
   *                                   默认值为 false，表示该内容区域不显示。
   */
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.page-tools {
  margin: 10px 0;

  .before {
    line-height: 34px;

    i {
      margin-right: 5px;
      color: #409eff;
    }

    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>

