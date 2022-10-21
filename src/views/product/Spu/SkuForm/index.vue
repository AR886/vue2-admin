<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称" size="normal"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称" size="normal">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称" />
      </el-form-item>
      <el-form-item label="价格(元)" size="normal">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)" size="normal">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述" size="normal">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" placeholder="请描述" />
      </el-form-item>
      <el-form-item label="平台属性" size="normal">
        <el-form ref="form" label-width="80px" :inline="true" size="normal">
          <!-- 下拉选择框 -->
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName" size="normal">
            <el-select v-model="attr.doubleId" placeholder="请选择">
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性" size="normal">
        <el-form ref="form" label-width="80px" :inline="true" size="normal">
          <!-- 下拉选择框 -->
          <el-form-item v-for="sale in spuSaleAttrList" :key="sale.id" :label="sale.saleAttrName" size="normal">
            <el-select v-model="sale.doubleId" placeholder="请选择">
              <el-option v-for="saleValue in sale.spuSaleAttrValueList" :key="saleValue.id" :label="saleValue.saleAttrValueName" :value="`${sale.id}:${saleValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表" size="normal">
        <el-table ref="multipleTable" style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" />
          <el-table-column label="图片">
            <template slot-scope="{ row, $index }">
              <el-image :src="row.imgUrl" fit="fill" :lazy="true" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" />
          <el-table-column prop="address" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button v-if="row.isDefault === 0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else type="success">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储图片信息
      spuImageList: [],
      // 存储销售属性信息
      spuSaleAttrList: [],
      // 存储平台属性信息
      attrInfoList: [],
      // 收集sku数据信息
      skuInfo: {
        category3Id: '',
        spuId: '',
        tmId: '',
        price: '',
        skuAttrValueList: [],
        skuDefaultImg: '',
        skuDesc: '',
        skuImageList: [],
        skuName: '',
        skuSaleAttrValueList: [],
        weight: ''
      },
      // row 信息
      spu: {},
      // 收集 选中图片信息
      imageList: []
    }
  },
  methods: {
    // 发请求 获取数据
    async getData(category1Id, category2Id, row) {
      // 收集父组件给的数据
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      this.spu = row
      // 获取图片数据
      const imageResult = await this.$API.spu.reqSpuImageList(row.id)
      if (imageResult.code === 200) {
        const list = imageResult.data
        list.forEach((item) => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性数据
      const saleResult = await this.$API.spu.reqSaleAttrList(row.id)
      if (saleResult.code === 200) {
        this.spuSaleAttrList = saleResult.data
      }
      // 获取平台属性数据
      const attrInfoResult = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, row.category3Id)
      if (attrInfoResult.code === 200) {
        this.attrInfoList = attrInfoResult.data
      }
    },
    // 图片列表 复选框变化 回调
    handleSelectionChange(selection) {
      // 将勾选的图片row 进行收集
      this.imageList = selection
    },
    // 设置默认 排他
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消 按钮 回到spuList组件
    cancel() {
      this.$emit('changeScene', { scene: 'spuList', flag: '' })
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮 提交数据
    async save() {
      // 解构
      const { attrInfoList, spuSaleAttrList, imageList, skuInfo } = this
      // 整理 平台属性数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        // 判断 已选择的平台属性
        if (item.doubleId) {
          // 解构 切割 属性ID 属性值ID
          const [attrId, valueId] = item.doubleId.split(':')
          // 添加到初始值
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      // 整理 销售属性数据
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.doubleId) {
          const [saleAttrId, saleAttrValueId] = item.doubleId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 整理 选中图片列表
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 整理完数据 发请求
      const result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code === 200) {
        // 切换到spuList 组件
        this.$emit('changeScene', { scene: 'spuList', flag: '' })
        // 提示成功
        this.$message({ type: 'success', message: '添加成功' })
        // 清空数据
        Object.assign(this._data, this.$options.data())
      }
    }
  }
}
</script>

<style scoped></style>
