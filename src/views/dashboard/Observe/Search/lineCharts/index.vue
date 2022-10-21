<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <svg t="1652706112087" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1945" width="28" height="28">
        <path
          d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z"
          p-id="1946"
          fill="#8a8a8a"
        />
      </svg>
    </div>
    <div class="main">
      <span>12321 </span>
      <svg t="1652707462430" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1950" width="16" height="16">
        <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="1951" fill="#d81e06" />
      </svg>
    </div>
    <div class="footer">
      <div ref="chart" class="chart" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineCharts',
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.chart)
    // 配置数据对象
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'line',
          data: [10, 7, 33, 21, 23, 43, 12, 88, 9],
          // 设置为曲线 圆滑的曲线
          smooth: true,
          // 拐点的样式设置
          itemStyle: {
            opacity: 0
          },
          //  线条样式
          lineStyle: {
            color: 'blue'
          },
          // 填充颜色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'blue' // 0% 颜色
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ]
            }
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

<style>
.header {
  display: flex;
  align-items: center;
  color: #666;
}
.header span {
  margin-right: 20px;
}
.main span {
  font-size: 26px;
  margin-right: 20px;
}
.chart {
  width: 100%;
  height: 50px;
}
</style>
