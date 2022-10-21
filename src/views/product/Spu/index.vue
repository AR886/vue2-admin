<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect :show="scene !== 'spuList'" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- SPU列表 -->
      <div v-show="scene === 'spuList'">
        <!-- 按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <!-- 表格 -->
        <el-table border style="width: 100%; margin: 20px 0px" :data="record">
          <el-table-column type="index" label="序号" width="100" align="center" />
          <el-table-column prop="spuName" label="spu名称" width="width" />
          <el-table-column prop="description" label="spu描述" width="width" />
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)" />
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)" />
              <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)" />
              <el-popconfirm title="这是一段内容确定删除吗？" style="margin-left: 10px" @onConfirm="deleteSpu(row)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination :current-page.sync="page" :page-sizes="[3, 5, 7]" :page-size="limit" layout=" prev, pager, next,->,sizes" style="text-align: center" :total="total" @size-change="handleCurrentChange" @current-change="getSpuList" />
      </div>
      <!-- 添加SPU | 修改SPU -->
      <SpuForm v-show="scene === 'addSpu'" ref="spu" @changeScene="changeScene">添加SPU</SpuForm>
      <!-- 添加SKU -->
      <SkuForm v-show="scene === 'addSku'" ref="sku" @changeScene="changeScene">添加SKU</SkuForm>
    </el-card>
    <!-- spu列表row详情 -->
    <el-dialog :title="`${spu.spuName}的SKU列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table v-loading="loading" :data="skuList" stripe>
        <el-table-column label="名称" prop="skuName" />
        <el-table-column label="价格" prop="price" />
        <el-table-column label="重量" prop="weight" />
        <el-table-column label="默认图片">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" alt="" style="width: 80px; height: 80px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from '@/views/product/Spu/SpuForm'
import SkuForm from '@/views/product/Spu/SkuForm'
export default {
  name: 'Spu',
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // SPU列表数据
      record: [],
      // 分页器属性
      page: 1,
      limit: 3,
      total: 0,
      // 切换属性
      scene: 'spuList',
      // 控制spu详情对话框 显示 隐藏
      dialogTableVisible: false,
      // 存储 点击对应详情信息
      spu: {},
      // 存储获取到的对应详情的sku信息
      skuList: [],
      // 加载
      loading: true
    }
  },
  methods: {
    // 获取子组件 三级分类传来的ID
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 发请求获取数据
        this.getSpuList()
      }
    },
    // 获取数据
    async getSpuList(pager = 1) {
      this.page = pager
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.record = result.data.records
        this.total = result.data.total
      }
    },
    // 分页器每页展示多少条数据
    handleCurrentChange(limits) {
      this.limit = limits
      this.getSpuList()
    },
    // 添加SPU 按钮回调
    addSpu() {
      this.scene = 'addSpu'
      // 点击添加 切换 且发请求 获取品牌 和销售属性
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改SPU 按钮回调
    updateSpu(row) {
      this.scene = 'addSpu'
      // 获取对应的子组件数据
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件回调(回到spu列表) spuForm
    changeScene({ scene, flag }) {
      // 切换场景
      this.scene = scene
      // 重新渲染数据
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除 SPU商品
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        // 重新渲染数据 判断这页有几条数据 只有一条时回到上一页
        this.getSpuList(this.record.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加 SKU 按钮 回调
    addSku(row) {
      // 切换为 addSku 组件
      this.scene = 'addSku'
      const { category1Id, category2Id } = this
      // 当点击spu列表中数据的添加按钮 对应的发请求
      this.$refs.sku.getData(category1Id, category2Id, row)
    },
    // row 详情信息 表格
    async handler(row) {
      // 切换 显示 隐藏
      this.dialogTableVisible = true
      // 存储数据
      this.spu = row
      // 获取sku列表数据 展示
      const result = await this.$API.spu.reqSkuList(row.id)
      if (result.code === 200) {
        this.skuList = result.data
        // 当获取数据回来后把 loading 变为 false
        this.loading = false
      }
    },
    // 关闭dialog 对话框前的回调
    close(done) {
      // loading 变为 true
      this.loading = true
      // 清除 数据
      this.skuList = []
      this.spu = {}
      // done 用于关闭 Dialog
      done()
    }
  }
}
</script>

<style scoped></style>
