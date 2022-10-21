<template>
  <div style="margin-top: 20px">
    <el-row :gutter="20">
      <el-col :span="6" :offset="0">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
          <Detail title="销售总额" number="￥126560">
            <template slot="charts">
              <span>周同比 56.67% </span>
              <svg t="1652707462430" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1950" width="16" height="16">
                <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="1951" fill="#d81e06" />
              </svg>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <span>日同比 19.97% </span>
              <svg t="1652708546940" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4844" width="16" height="16">
                <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" p-id="4845" fill="#1afa29" />
              </svg>
            </template>
            <template slot="footer">
              <span>日销售总额 123123</span>
            </template>
          </Detail>
          <!-- card body -->
        </el-card>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
          <Detail title="访问量" number="88460">
            <template slot="charts">
              <lineCharts />
            </template>
            <template slot="footer">
              <span>日访问量 123123</span>
            </template>
          </Detail>
          <!-- card body -->
        </el-card>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
          <Detail title="支付笔数" number="88460">
            <template slot="charts">
              <barCharts />
            </template>
            <template slot="footer">
              <span>转换率 123123</span>
            </template>
          </Detail>
          <!-- card body -->
        </el-card>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
          <Detail title="运营活动效果" number="78%">
            <template slot="charts">
              <progressCharts />
            </template>
            <template slot="footer">
              <span>周同比 56.67% </span>
              <svg t="1652707462430" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1950" width="16" height="16">
                <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="1951" fill="#d81e06" />
              </svg>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <span>日同比 19.97% </span>
              <svg t="1652708546940" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4844" width="16" height="16">
                <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" p-id="4845" fill="#1afa29" />
              </svg>
            </template>
          </Detail>
          <!-- card body -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from '@/views/dashboard/Card/Detail'
import lineCharts from './lineChart'
import barCharts from './barChart'
import progressCharts from './progressChart'
export default {
  name: 'Card',
  components: {
    Detail,
    lineCharts,
    barCharts,
    progressCharts
  },
  data() {
    return {
      activityRate: null
    }
  }
}
</script>

<style scoped></style>
