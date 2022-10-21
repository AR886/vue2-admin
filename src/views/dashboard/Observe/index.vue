<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <Search />
      </el-col>
      <el-col :span="12" :offset="0">
        <Category />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from './Search'
import Category from './Category'
export default {
  name: 'ObServe',
  components: {
    Search,
    Category
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
</style>
