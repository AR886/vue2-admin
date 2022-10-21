<template>
  <el-card shadow="always" style="margin: 20px 0px">
    <div slot="header" class="clearfix">
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale" />
        <el-tab-pane label="访问量" name="visit" />
      </el-tabs>
      <!-- 头部右侧 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker v-model="time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" style="width: 300px" value-format="yyyy-MM-dd" />
      </div>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="18" :offset="0">
          <!-- 柱形图 -->
          <div ref="chart" class="chart" />
        </el-col>
        <el-col :span="6" :offset="0">
          <div class="rightTab">
            <span>门店{{ title }}排行</span>
            <ul>
              <li>
                <span class="rindex">0</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">123123</span>
              </li>
              <li>
                <span class="rindex">1</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">123123</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">123123</span>
              </li>
              <li>
                <span class="rindex">4</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">123123</span>
              </li>
              <li>
                <span class="rindex">4</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">123123</span>
              </li>
              <li>
                <span class="rindex">5</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">123123</span>
              </li>
              <li>
                <span class="rindex">6</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">123123</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- card body -->
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      saleChart: null,
      // 收集日历事件
      time: []
    }
  },
  computed: {
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    }
  },
  watch: {
    title() {
      this.saleChart.setOption({
        title: {
          text: this.title + '趋势'
        }
      })
    }
  },
  mounted() {
    // 创建实例对象
    this.saleChart = echarts.init(this.$refs.chart)
    // 配置选项
    this.saleChart.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 23, 12, 45, 23, 87, 12, 46, 76, 34, 54, 34]
        }
      ]
    })
  },
  methods: {
    // 获取今日时间
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.time = [day, day]
    },
    // 获取本周时间
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.time = [start, end]
    },
    // 获取本月时间
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.time = [start, end]
    },
    // 获取今年时间
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.time = [start, end]
    }
  }
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 20px;
}
.right span {
  margin: 0px 15px;
}
.chart {
  width: 100%;
  height: 300px;
}
.rightTab {
  width: 100%;
  height: 300px;
}
.rightTab span {
  height: 20%;
}
.rightTab ul {
  padding: 0%;
  list-style: none;
  width: 100%;
  height: 80%;
}
.rightTab ul li {
  height: 14%;
}
.rightTab ul li p {
  display: inline-block;
}
.rindex {
  font-size: 20px;
}
.rname {
  margin: 0px 20px;
}
.rvalue {
  float: right;
}
</style>
