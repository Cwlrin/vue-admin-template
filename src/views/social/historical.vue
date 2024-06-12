<template>
  <!-- 历史社保公积金盒子组件 -->
  <div class="historicalArcBox">
    <!-- 年份选择区域 -->
    <div class="historicalArcTop">
      <div class="title">
        <!-- 全公司标题 -->
        <span> 全公司 </span>
        <!-- 年份选择器 -->
        <div class="yearChange">
          <el-date-picker
            v-model="yearVal"
            placeholder="选择年"
            size="mini"
            type="year"
            value-format="yyyy"
            width="130px"
            @change="changeYear"
          />
        </div>
      </div>
    </div>
    <!-- 表格加载区域 -->
    <div v-loading="loading" class="historicalTable">
      <!-- 遍历数据列表 -->
      <div v-for="(itemes, index) in tableData" :key="index" class="itemes">
        <!-- 项的顶部标签，包含社保月份和创建时间 -->
        <div :class="{act: itemes.act}" class="itemTopLab">
          <!-- 点击展开按钮 -->
          <div class="lab" @click="openTable(itemes,index)"> ></div>
          <!-- 标题和创建时间显示 -->
          <div>
            <p class="title">{{ itemes.month }} 社保报表 <span>{{ itemes.creationTime }}</span></p>
            <p class="labTit" @click="openTable(itemes,index)"> 社保报表 </p>
          </div>
          <!-- 企业缴纳、个人缴纳和合计金额显示 -->
          <div>
            <p class="itemTit"><span> 企业缴纳 </span></p>
            <p class="itemNum">{{ itemes.enterprisePayment }}</p>
          </div>
          <div>
            <p class="itemTit"><span> 个人缴纳 </span></p>
            <p class="itemNum">{{ itemes.personalPayment }}</p>
          </div>
          <div>
            <p class="itemTit"><span> 合计 </span></p>
            <p class="itemNum">{{ itemes.total }}</p>
          </div>
        </div>
        <!-- 展开的详细信息表格 -->
        <div v-show="itemes.act" class="itemDropDown">
          <!-- 表格顶部标签，包含各种分类和导出按钮 -->
          <div class="topLab">
            <div><span style="background-color:#cfeffe;" /> 已离职 </div>
            <div><span style="background-color:#a8f8bb;" /> 再入职 </div>
            <div><span style="background-color:#fedbd7;" /> 公司合计 </div>
            <div><span style="background-color:#ffe8c9;" /> 一级部门 </div>
            <div><span style="background-color:#fdfcd5;" /> 二级部门 </div>
            <div class="rightLabBox">
              <a href="/"><i class="el-icon-search" /></a>
              <a href="/">
                <div> 导出 </div>
              </a>
            </div>
          </div>
          <!-- 社保公积金详细数据表格 -->
          <el-table
            id="item"
            :data="itemes.contentData"
            border
            height="300"
            style="width: 100%;text-align: center"
          >
            <!-- 表格列定义 -->
            <el-table-column center label="序号" type="index" width="50" />
            <el-table-column label="姓名" prop="username" width="150px" />
            <el-table-column :formatter="transformDateFormat" label="入职时间" prop="timeOfEntry" width="150px" />
            <!-- 其他列定义省略... -->
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArchivingList, getArchivingCont } from '@/api/social'

export default {
  // 组件名称
  name: 'HistoricalArchiving',
  data() {
    return {
      // 加载状态
      loading: false,
      // 数据项数量
      num: 0,
      // 选择的年份
      yearVal: '2020',
      // 表格数据
      tableData: []
    }
  },
  mounted() {
    // 组件挂载后获取存档列表
    this.getArchivingList()
  },
  methods: {
    /**
     * 异步获取指定年份的存档列表
     *
     * 此函数用于从服务器异步请求并获取指定年份的存档列表数据。
     * 它首先设置加载状态为 true，然后等待 getArchivingList 异步操作完成，
     * 接着更新 tableData 属性以显示新获取的存档列表数据，最后关闭加载状态。
     *
     * @returns {void}
     */
    async getArchivingList() {
      // 开始加载，显示加载中的状态
      this.loading = true
      // 等待异步获取存档列表数据，其中 yearVal 为指定的年份
      this.tableData = await getArchivingList({ year: this.yearVal })
      // 加载完成，隐藏加载中的状态
      this.loading = false
    },
    /**
     * 打开或关闭详细内容
     * @param {Object} obj - 表格行数据
     * @param {Number} index - 表格行索引
     */
    async openTable(obj, index) {
      if (!obj.act) {
        const data = await getArchivingCont({ month: obj.yearsMonth, year: this.yearVal, opType: 2 })
        this.$set(this.tableData[index], 'contentData', data)
        this.loading = false
        this.$set(this.tableData[index], 'act', true)
      } else {
        this.$set(this.tableData[index], 'act', false)
      }
    },
    /**
     * 当年份发生变化时触发此函数。
     * 目的是为了更新展示的归档列表，确保列表与当前选择的年份对应。
     * 此函数通过调用 `getArchivingList` 方法来实现列表的更新。
     */
    changeYear() {
      this.getArchivingList()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import './../../styles/variables.scss';

.historicalArcBox {
  padding: 20px;

  .historicalArcTop {
    position: relative;
    background: #fff;
    padding: 10px 15px 0 15px;

    .title {
      color: $blue;
      line-height: 40px;
      border-bottom: solid 2px $blue;
      font-size: 18px;
      font-weight: bold;
      display: inline-block;
      padding: 0 25px;

      .yearChange {
        position: absolute;
        top: 5px;
        right: 10px;
      }
    }
  }

  .historicalTable {
    background: #fff;

    .itemes {
      .itemTopLab {
        border-top: solid 1px #f0f0f0;
        border-bottom: solid 3px #ccc;
        padding: 15px;

        div {
          display: inline-block;
          padding: 0 50px;
          border-right: solid 1px #ccc;
        }

        div:last-child, div:first-child {
          border: none;
        }

        .lab {
          position: relative;
          top: -15px;
          padding-right: 0;
          padding-left: 15px;
        }

        .labTit {
          cursor: pointer;
        }

        .title {
          font-size: 16px;
          margin: 10px 0;

          span {
            position: relative;
            bottom: -2px;
            font-size: 13px;
            color: #999;
            margin-left: 5px;
          }
        }

        .itemTit {
          color: #999;
          margin: 8px 0;
          font-size: 13px;
        }

        .itemNum {
          font-size: 20px;
          margin: 0;
        }
      }

      .itemDropDown {
        background: #fff;

        .topLab {
          position: relative;
          padding: 15px;

          div {
            display: inline-block;
            margin: 0 10px;

            span {
              display: inline-block;
              position: relative;
              top: 2px;
              margin-right: 5px;
              width: 15px;
              height: 15px;
              // background:$cl-1;
            }
          }

          .rightLabBox {
            position: absolute;
            right: -10px;
            top: 10px;

            div {
              border: solid 1px $green;
              color: $green;
              border-radius: 3px;
              padding: 4px 10px;
              font-size: 14px;
            }
          }
        }
      }

      .act {
        border-bottom: solid 3px $panGreen;

        .lab {
          color: $panGreen;
        }

        .labTit {
          color: $panGreen;
        }
      }
    }

    .itemes:hover {
      background: #fafbff;
    }

    .itemes .lab:hover {
      cursor: pointer;
    }
  }
}
</style>
