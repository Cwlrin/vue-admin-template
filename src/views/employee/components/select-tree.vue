<template>
  <!-- 使用 Element UI 的级联选择器组件，用于选择组织结构中的部门 -->
  <el-cascader
    :value="value"
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
    @change="changeValue"
  />
</template>
<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'

/**
 * 部门选择组件，用于选择或显示组织结构中的部门。
 * 通过级联选择器呈现，数据从后端 API 获取并转换为树形结构。
 */
export default {
  props: {
    value: {
      type: Number,
      // 默认值为 null，表示未选择任何部门
      default: null
    }
  },
  data() {
    return {
      treeData: [], // 存储组织结构的树形数据
      props: {
        label: 'name', // 在级联选择器中显示的属性名
        value: 'id' // 选择器选中项对应的值属性名
      }
    }
  },
  created() {
    // 组件创建时，初始化部门数据
    this.getDepartment()
  },
  methods: {
    /**
     * 获取部门列表，并将其转换为树形结构数据。
     */
    async getDepartment() {
      // 调用后端 API 获取部门列表，然后转换为树形数据
      this.treeData = transListToTreeData(await getDepartment(), 0)
    },
    /**
     * 当选择器的值发生变化时调用。
     * @param {Array} list 选中的部门路径列表。
     * 将选中的部门 ID 发送给父组件。
     */
    changeValue(list) {
      // 如果有选中的部门，则发送最后一个部门的 ID
      if (list.length > 0) {
        this.$emit('input', list[list.length - 1]) // 将最后一位的 id 取出来 传出去
      } else {
        // 如果没有选中的部门，则发送 null
        this.$emit('input', null)
      }
    }
  }
}
</script>
