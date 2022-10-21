<template>
  <div ref="charts" class="charts" />
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
export default {
  name: 'ProgressChart',
  computed: {
    ...mapGetters(['activityRate'])
  },
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据对象
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [this.activityRate],
          // 柱形宽度
          barWidth: 10,
          color: 'yellowgreen',
          // 背景颜色
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          // 文本
          label: {
            show: true,
            // 改变文本内容
            formatter: '|',
            // 文本标签的位置
            position: 'right'
          }
        }
      ],
      // 布局调适
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
