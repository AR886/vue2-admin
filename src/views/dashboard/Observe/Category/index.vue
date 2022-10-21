<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <div slot="header">
      <div class="category_header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="radio1">
          <el-radio-button label="全部渠道" />
          <el-radio-button label="线上" />
          <el-radio-button label="门店" />
        </el-radio-group>
      </div>
    </div>
    <!-- 饼图 -->
    <div ref="chart" class="chart" />
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import M from 'minimatch'
export default {
  name: 'Category',
  data() {
    return {
      radio1: '全部渠道'
    }
  },
  mounted() {
    const myChart = echarts.init(this.$refs.chart)
    myChart.setOption({
      title: {
        text: '元素女皇',
        subtext: '1',
        left: 'center',
        top: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access from',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1, name: '元素女皇' },
            { value: 2, name: '影流之主' },
            { value: 3, name: '蜘蛛女皇' },
            { value: 4, name: '刀锋之影' },
            { value: 5, name: '暗黑元首' }
          ]
        }
      ]
    })
    // 鼠标绑定事件
    myChart.on('mouseover', (params) => {
      // 获取鼠标移上去的 name 和 value
      const { name, value } = params.data
      // 重新赋值给标题和子标题
      myChart.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style scoped>
.category_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
.chart {
  width: 100%;
  height: 300px;
}
</style>
