<template>
  <el-card class="page-tools">
    <el-row align="middle" justify="space-between" type="flex">
      <!-- 当 showBefore 属性为真时，显示包含信息图标的提示区域 -->
      <el-col>
        <div v-if="showBefore" class="before">
          <i class="el-icon-info" />
          <slot name="before" />
        </div>
      </el-col>
      <!-- 显示自定义的后续内容 -->
      <el-col>
        <el-row justify="end" type="flex">
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    /**
     * 控制是否显示前置提示区域
     */
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
