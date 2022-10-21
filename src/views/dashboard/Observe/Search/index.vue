<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <div slot="header">
      <!-- 头部 -->
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown :hide-on-click="false">
          <span class="el-dropdown-link"> <i class="el-icon-more" /> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- card body -->
    <div>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <lineCharts />
        </el-col>
        <el-col :span="12" :offset="0">
          <lineCharts />
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="index" label="排名" width="80" text-align: center />
        <el-table-column prop="name" label="搜索关键字" width="200" />
        <el-table-column prop="address" label="用户数" sortable />
        <el-table-column prop="address" label="涨幅数" sortable />
      </el-table>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination style="text-align: center" layout="prev, pager, next" :total="1000" />
      </div>
    </div>
  </el-card>
</template>

<script>
import lineCharts from './lineCharts'
export default {
  name: 'Search',
  components: {
    lineCharts
  },
  data() {
    return {
      tableData: [{}]
    }
  }
}
</script>

<style>
.search-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
</style>
