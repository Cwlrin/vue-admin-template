<template>
  <div class="dashboard">
    <div class="container">
      <!-- 左侧内容区域 -->
      <div class="left">
        <!-- 个人信息面板 -->
        <div class="panel">
          <!-- 个人信息展示 -->
          <div class="user-info">
            <!-- 显示用户头像，如果不存在则显示用户名的首字母 -->
            <img v-if="avatar" :src="avatar" alt="" class="avatar">
            <span v-else class="username">{{ name?.charAt(0) }}</span>
            <!-- 公司和部门信息展示 -->
            <div class="company-info">
              <div class="title">
                江苏传智播客教育科技股份有限公司
                <span> 体验版 </span>
              </div>
              <div class="depart">{{ name }} ｜ {{ company }}-{{ departmentName }}</div>
            </div>
          </div>
          <!-- 代办事项列表，展示各项统计数据 -->
          <div class="todo-list">
            <div class="todo-item">
              <span> 组织总人数 </span>
              <!-- 起始值 终点值 动画时间 -->
              <count-to
                :duration="1000"
                :end-val="homeData.employeeTotal"
                :start-val="0"
              />
            </div>
            <div class="todo-item">
              <span> 正式员工 </span>
              <count-to
                :duration="1000"
                :end-val="homeData.regularEmployeeTotal"
                :start-val="0"
              />
            </div>
            <div class="todo-item">
              <span> 合同待签署 </span>
              <count-to
                :duration="1000"
                :end-val="homeData.contractSignTotal"
                :start-val="0"
              />
            </div>
            <div class="todo-item">
              <span> 待入职 </span>
              <count-to
                :duration="1000"
                :end-val="homeData.toBeEmployed"
                :start-val="0"
              />
            </div>
            <div class="todo-item">
              <span> 本月待转正 </span>
              <count-to
                :duration="1000"
                :end-val="homeData.toBeConfirmed"
                :start-val="0"
              />
            </div>
            <div class="todo-item">
              <span> 本月待离职 </span>
              <count-to
                :duration="1000"
                :end-val="homeData.toBeDismissed"
                :start-val="0"
              />
            </div>
            <div class="todo-item">
              <span> 接口总访问 </span>
              <count-to
                :duration="1000"
                :end-val="homeData.interfaceAccessTotal"
                :start-val="0"
              />
            </div>
          </div>
        </div>
        <!-- 快捷入口面板 -->
        <div class="panel">
          <div class="panel-title"> 快捷入口 </div>
          <!-- 快捷入口列表 -->
          <div class="quick-entry">
            <div class="entry-item">
              <div class="entry-icon approval" />
              <span> 假期审批 </span>
            </div>
            <div class="entry-item">
              <div class="entry-icon social" />
              <span> 社保管理 </span>
            </div>
            <div class="entry-item">
              <div class="entry-icon role" />
              <span> 角色管理 </span>
            </div>
            <div class="entry-item">
              <div class="entry-icon salary" />
              <span> 薪资设置 </span>
            </div>
            <div class="entry-item">
              <div class="entry-icon bpm" />
              <span> 流程设置 </span>
            </div>
          </div>
        </div>
        <!-- 图表数据 -->
        <div class="panel">
          <div class="panel-title"> 社保申报数据 </div>
          <div class="chart-container">
            <div class="chart-info">
              <div class="info-main">
                <span> 申报人数 </span>
                <!-- homeData: {} -->
                <count-to
                  :duration="1000"
                  :end-val="homeData.socialInsurance?.declarationTotal"
                  :start-val="0"
                />

              </div>
              <div class="info-list">
                <div class="info-list-item">
                  <span> 待申报 (人)</span>
                  <count-to
                    :duration="1000"
                    :end-val="homeData.socialInsurance?.toDeclareTotal"
                    :start-val="0"
                  />
                </div>
                <div class="info-list-item">
                  <span> 申报中 (人)</span>
                  <count-to
                    :duration="1000"
                    :end-val="homeData.socialInsurance?.declaringTotal"
                    :start-val="0"
                  />
                </div>
                <div class="info-list-item">
                  <span> 已申报 (人)</span>
                  <count-to
                    :duration="1000"
                    :end-val="homeData.socialInsurance?.declaredTotal"
                    :start-val="0"
                  />
                </div>
              </div>
            </div>
            <div class="chart">
              <!-- 图表 -->
              <div ref="social" style=" width: 100%; height:100% " />
            </div>
          </div>
        </div>
        <!-- 图表数据 -->
        <div class="panel">
          <div class="panel-title"> 公积金申报数据 </div>
          <div class="chart-container">
            <div class="chart-info">
              <!-- 统计数据展示 -->
              <div class="info-main">
                <span> 申报人数 </span>
                <count-to
                  :duration="1000"
                  :end-val="homeData.providentFund?.declarationTotal"
                  :start-val="0"
                />
              </div>
              <div class="info-list">
                <div class="info-list-item">
                  <span> 待申报 (人)</span>
                  <count-to
                    :duration="1000"
                    :end-val="homeData.providentFund?.toDeclareTotal"
                    :start-val="0"
                  />
                </div>
                <div class="info-list-item">
                  <span> 申报中 (人)</span>
                  <count-to
                    :duration="1000"
                    :end-val="homeData.providentFund?.declaringTotal"
                    :start-val="0"
                  />
                </div>
                <div class="info-list-item">
                  <span> 已申报 (人)</span>
                  <count-to
                    :duration="1000"
                    :end-val="homeData.providentFund?.declaredTotal"
                    :start-val="0"
                  />
                </div>
              </div>
            </div>
            <!-- 图表展示区域 -->
            <div class="chart">
              <!-- 图表 -->
              <div ref="provident" style=" width: 100%; height:100% " />
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧内容区域 -->
      <div class="right">
        <!-- 帮助链接面板 -->
        <div class="panel">
          <div class="help">
            <!-- 帮助链接列表 -->
            <div class="help-left">
              <div class="panel-title"> 帮助链接 </div>
              <div class="help-list">
                <div class="help-block">
                  <i class="icon-entry" />
                  入门指南
                </div>
                <div class="help-block">
                  <i class="icon-help" />
                  在线帮助手册
                </div>
                <div class="help-block">
                  <i class="icon-support" />
                  联系技术支持
                </div>
                <div class="help-block">
                  <i class="icon-add" />
                  添加链接
                </div>
              </div>
            </div>
            <!-- 日历组件 -->
            <div class="help-right">
              <div class="calendar">
                <!-- <el-calendar /> -->
                <el-calendar />
              </div>
            </div>
          </div>
        </div>
        <!-- 通知公告面板 -->
        <div class="panel">
          <div class="panel-title"> 通知公告 </div>
          <!-- 通知公告列表 -->
          <div class="information-list">
            <div v-for="(item,index) in list" :key="index" class="information-list-item">
              <img :src="item.icon" alt="">
              <div>
                <p>
                  {{ item.notice }}
                </p>
                <p>{{ item.createTime }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
import { getHomeData, getMessageList } from '@/api/home'
// 引入 echarts 核心模块和所需图表及组件
// import * as echarts from 'echarts' // 引入所有的 echarts
import * as echarts from 'echarts/core' // 引入核心包
import { LineChart } from 'echarts/charts' // 引入折线图
import { GridComponent } from 'echarts/components' // 引入组件
import { CanvasRenderer } from 'echarts/renderers'

// 注册所需 echarts 模块
echarts.use([
  LineChart,
  GridComponent,
  CanvasRenderer
])

export default {
  // 注册 CountTo 组件
  components: {
    CountTo
  },
  data() {
    return {
      // 初始化首页数据对象
      homeData: {},
      // 初始化消息列表数组
      list: []
    }
  },
  // 映射 vuex getters 到计算属性
  // 计算属性
  computed: {
    // 将 getters 中的四个属性映射到计算属性中 - 指向
    ...mapGetters(['avatar', 'name', 'company', 'departmentName'])
  },
  watch: {
    /**
     * 监听 homeData 的变化，并更新图表配置。
     * 此函数旨在根据 homeData 的更新，刷新社保和公积金图表的数据展示。
     * 它首先打印当前的 homeData 到控制台，然后分别对社保和公积金图表进行配置更新。
     * 更新包括设置 x 轴和 y 轴的类型及数据，以及系列的数据和样式。
     * 特别地，区域图的填充颜色和线条颜色均设置为统一的青色。
     */
    // 监听 homeData 变化，更新图表数据
    homeData() {
      console.log(this.homeData)
      // 更新社保数据图表
      // 设置图表
      this.social.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.homeData.socialInsurance?.xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.homeData.socialInsurance?.yAxis,
            type: 'line',
            areaStyle: {
              color: '#04c9be' // 填充颜色
            },
            lineStyle: {
              color: '#04c9be' // 线的颜色
            }
          }
        ]
      })
      // 更新公积金数据图表
      this.provident.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.homeData.providentFund?.xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.homeData.providentFund?.yAxis,
            type: 'line',
            areaStyle: {
              color: '#04c9be' // 填充颜色
            },
            lineStyle: {
              color: '#04c9be' // 线的颜色
            }
          }
        ]
      })
    }
  },
  created() {
    // 在组件创建时获取首页数据和消息列表
    this.getHomeData()
    this.getMessageList()
  },
  mounted() {
    // 初始化 echarts 实例
    // 获取展示的数据 设置给图表
    // 监听 homeData 的变化
    this.social = echarts.init(this.$refs.social) // 初始化 echart
    // data 中没有声明 不是响应式
    this.provident = echarts.init(this.$refs.provident)
  },
  methods: {
    // 异步获取首页数据
    async getHomeData() {
      // 使用 await 等待 getHomeData 异步操作完成，并将结果赋值给 this.homeData
      this.homeData = await getHomeData()
    },
    // 异步获取消息列表
    async getMessageList() {
      this.list = await getMessageList()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  background: #f5f6f8;
  width: 100%;
  min-height: calc(100vh - 80px);

  ::v-deep .el-calendar-day {
    height: 40px;
  }

  ::v-deep .el-calendar-table__row td, ::v-deep .el-calendar-table tr td:first-child, ::v-deep .el-calendar-table__row td.prev {
    border: none;
  }

  .date-content {
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
  }

  .date-content .rest {
    color: #fff;
    border-radius: 50%;
    background: rgb(250, 124, 77);
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    font-size: 12px;
    margin-left: 10px;
  }

  .date-content .text {
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;

  }

  ::v-deep .el-calendar-table td.is-selected .text {
    background: #409eff;
    color: #fff;
    border-radius: 50%;
  }

  ::v-deep .el-calendar__header {
    display: none
  }

  .container {
    display: flex;

    .right {
      width: 40%;

      .panel {
        margin-left: 8px;
      }

      :nth-child(1) {
        margin-top: 0;
      }
    }

    .left {
      flex: 1;

      :nth-child(1) {
        margin-top: 0;
      }
    }

    .panel {
      background-color: #fff;

      margin-top: 8px;
      padding: 20px;

      .panel-title {
        font-size: 16px;
        color: #383c4e;
        font-weight: 500;
      }

      // 用户信息样式
      .user-info {
        display: flex;

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background-color: #d9d9d9;
          line-height: 48px;
          text-align: center;
        }

        .username {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background: #04c9be;
          color: #fff;
          margin-right: 4px;
        }

        .company-info {
          margin-left: 10px;
          height: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          .title {
            color: #383c4e;
            font-weight: 500;
            font-size: 16px;
            font-family: PingFang SC, PingFang SC-Medium;

            span {
              font-size: 12px;
              background: #f5f6f8;
              text-align: center;
              padding: 2px 8px;
              border-radius: 2px;
              color: #697086;
            }
          }

          .depart {
            font-size: 14px;
            color: #697086;
            font-weight: 400;
          }
        }
      }

      // 代办样式
      .todo-list {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;

        .todo-item {
          width: 18%;
          height: 90px;
          display: flex;
          flex-direction: column;
          padding: 10px;
          justify-content: space-around;

          :nth-child(1) {
            color: #697086;
            font-size: 14px;
          }

          :nth-child(2) {
            color: #383c4e;
            font-size: 30px;
            font-weight: 500;
          }
        }
      }

      // 快捷入口
      .quick-entry {
        margin-top: 16px;
        display: flex;

        .entry-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 60px;

          &:nth-child(1) {
            margin-left: 0px;
          }

          .entry-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: #f5f6f8;
            background-size: cover;

            &.approval {
              background-image: url('~@/assets/common/approval.png');
            }

            &.social {
              background-image: url('~@/assets/common/social.png');
            }

            &.salary {
              background-image: url('~@/assets/common/salary.png');
            }

            &.role {
              background-image: url('~@/assets/common/role.png');
            }

            &.bpm {
              background-image: url('~@/assets/common/bpm.png');
            }
          }

          span {
            color: #697086;
            font-size: 14px;
            margin-top: 8px;
          }
        }
      }

      // 图表数据
      .chart-container {
        display: flex;

        .chart-info {
          width: 240px;
          margin-top: 10px;

          .info-main {
            padding: 10px;
            display: flex;
            flex-direction: column;

            :nth-child(1) {
              font-size: 14px;
              color: #697086;
            }

            :nth-child(2) {
              margin-top: 10px;
              font-size: 30px;
              color: #04c9be;
              font-weight: 500;
            }
          }

          .info-list {
            background: #f5f6f8;
            border-radius: 4px;
            padding: 12px 15px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            .info-list-item {
              width: 50%;
              margin-top: 10px;
              display: flex;
              flex-direction: column;

              :nth-child(1) {
                font-size: 14px;
                color: #697086;
              }

              :nth-child(2) {
                margin-top: 10px;
                font-size: 30px;
                color: #383c4e;
                font-weight: 500;
              }
            }
          }
        }

        .chart {
          flex: 1
        }
      }

      // 帮助链接
      .help {
        display: flex;

        .help-left {
          width: 40%;
        }

        .help-right {
          flex: 1;
        }

        .help-list {
          .help-block {
            background: #f5f6f8;
            border-radius: 4px;
            width: 264px;
            height: 54px;
            padding: 17px 10px;
            font-size: 14px;
            color: #697086;
            margin-top: 10px;

            i {
              width: 14px;
              height: 14px;
              display: inline-block;
              background-size: cover;
              vertical-align: middle;
            }

            i.icon-help {
              background-image: url("~@/assets/common/help.png");
            }

            i.icon-support {
              background-image: url("~@/assets/common/support.png");
            }

            i.icon-add {
              background-image: url("~@/assets/common/add.png");
            }

            i.icon-entry {
              background-image: url("~@/assets/common/entry.png");
            }
          }
        }
      }

      // 通知公告
      .information-list {
        margin-top: 20px;

        .information-list-item {
          display: flex;
          align-items: center;
          margin: 15px 0;

          img {
            width: 40px;
            height: 40px;
            border: 50%;
          }

          .col {
            color: #8a97f8;
          }

          div :nth-child(2) {
            color: #697086;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
