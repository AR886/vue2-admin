<template>
  <div>
    <!-- 表格 -->
    <el-table border stripe style="width: 100%; margin: 20px 0px" :data="skuList">
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="名称" prop="skuName" width="" />
      <el-table-column label="描述" prop="skuDesc" width="" />
      <el-table-column label="默认图片" prop="name" width="150" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" prop="weight" width="100" align="center" />
      <el-table-column label="价格(元)" prop="price" width="80" align="center" />
      <el-table-column label="操作" prop="name" width="" align="center">
        <template slot-scope="{ row, $index }">
          <el-button v-if="row.isSale" type="success" size="small" icon="el-icon-bottom" title="下架" @click="sale(row)" />
          <el-button v-else type="info" size="small" icon="el-icon-top" title="上架" @click="cancel(row)" />
          <el-button type="primary" size="small" icon="el-icon-edit" title="修改SKU" @click="edit" />
          <el-button type="info" size="small" icon="el-icon-info" title="查看信息" @click="getSkuInfo(row)" />
          <el-button type="danger" size="small" icon="el-icon-delete" title="删除" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination :current-page.sync="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper,->,total, sizes" :total="total" background style="text-align: center" @size-change="sizeChange" @current-change="getSkuList" />
    <!-- 抽屉 skuInfo -->
    <el-drawer :visible.sync="show" :with-header="false" size="50%">
      <el-form label-width="150px" :inline="false" size="normal" style="padding-right: 20px">
        <el-form-item label="名称" size="medium">
          {{ skuInfo.skuName }}
        </el-form-item>
        <el-form-item label="描述" size="medium">
          {{ skuInfo.skuDesc }}
        </el-form-item>
        <el-form-item label="价格" size="medium"> {{ skuInfo.price }} 元 </el-form-item>
        <el-form-item label="平台属性" size="medium">
          <template>
            <el-tag v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" type="success" size="normal" style="margin-left: 10px">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
          </template>
        </el-form-item>
        <el-form-item label="商品图片" size="medium">
          <el-carousel height="400px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%">
            </el-carousel-item>
          </el-carousel>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1, // 当前页
      limit: 10, // 每页展示几条数据
      total: 0, // 总共几条
      skuList: [], // skuList 列表
      skuInfo: {}, // skuList列表对应的详情信息
      show: false
    }
  },
  // 当组件挂载完毕时 需要先获取sku列表数据
  mounted() {
    // 获取列表数据
    this.getSkuList()
  },
  methods: {
    // 获取sku列表数据
    async getSkuList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      const result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code === 200) {
        this.skuList = result.data.records
        this.total = result.data.total
      }
    },
    // 分页器
    sizeChange(limits) {
      this.limit = limits
      this.getSkuList()
    },
    // 下架状态 上架商品
    async sale(row) {
      const result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200) {
        this.$set(row, 'isSale', 0)
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    // 上架状态 下架商品
    async cancel(row) {
      const result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        this.$set(row, 'isSale', 1)
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    // row 中的 修该SKU 按钮
    edit() {
      this.$message({ message: '正在开发中' })
    },
    // 获取row中 对应的详情信息
    async getSkuInfo(row) {
      const result = await this.$API.sku.reqSkuById(row.id)
      if (result.code === 200) {
        this.skuInfo = result.data
        this.show = true
      }
    }
  }
}
</script>

<style>
.el-form-item__label {
  font-size: 24px;
}
.el-form-item__content {
  font-size: 18px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
