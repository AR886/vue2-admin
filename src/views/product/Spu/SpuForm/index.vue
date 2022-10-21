<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="请输入SPU名称" />
      </el-form-item>
      <el-form-item label="品牌" size="normal">
        <el-select v-model="spu.tmId" placeholder="请选择品牌" clearable filterable>
          <el-option v-for="(tm, index) in trademarkList" :key="tm.id" :value="tm.id" :label="tm.tmName" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" size="normal">
        <el-input v-model="spu.description" placeholder="SPU描述" size="normal" type="textarea" rows="4" clearable />
      </el-form-item>
      <el-form-item label="SPU图片" size="normal">
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="imageList" :on-success="handlerSuccess">
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" size="normal">
        <el-select v-model="saleId" :placeholder="`还有${unSelectSaleAttr.length}未选择`" clearable filterable>
          <el-option v-for="unSelect in unSelectSaleAttr" :key="unSelect.id" :value="unSelect" :label="unSelect.name" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!saleId.id" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 销售属性列表 -->
        <el-table border style="width: 100%" :data="spu.spuSaleAttrList">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column label="属性名" prop="saleAttrName" width="200" />
          <el-table-column label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 属性值列表 -->
              <el-tag v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" class="input-new-tag" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)" />
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="300">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="spu.spuSaleAttrList.splice($index, 1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item size="normal">
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // spu信息
      spu: {
        // 三级分类ID
        category3Id: 0,
        // 描述
        description: '',
        // spu名称
        spuName: '',
        // 平台ID
        tmId: '',
        // spu图片信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0
          // }
        ],
        // 平台销售属性信息
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrName: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      trademarkList: [], // 品牌信息
      imageList: [], // spu图片信息
      saleAttrList: [], // 平台销售属性信息
      saleId: '' // 销售属性ID和name
    }
  },
  computed: {
    // 计算还未选择的销售属性
    unSelectSaleAttr() {
      // 全部的销售属性由三个 尺寸、颜色、版本
      // 用 filter 返回 新的数组 过滤出来的未选择的销售属性
      return this.saleAttrList.filter((item) => {
        // 全部遍历 当 item.saleAttrName !== item1.saleAttrName 为真 返回
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName
        })
      })
    }
  },
  methods: {
    // 照片墙新增图片 回调
    handlerSuccess(response, file, fileList) {
      this.imageList = fileList // 收集图片
    },
    // 照片墙删除图片 回调
    handleRemove(file, fileList) {
      // file  被删除的图片
      // fileList  剩余的图片
      console.log(file, fileList)
      // 删除 图片后 要重新获取剩余的照片
      this.imageList = fileList // 收集图片
    },
    // 预览图片 回调
    handlePictureCardPreview(file) {
      // file 图片的地址
      this.dialogImageUrl = file.url
      // 显示与隐藏
      this.dialogVisible = true
    },
    // 初始化spu数据
    async initSpuData(spu) {
      // 获取spu信息数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌列表数据
      const tmResult = await this.$API.spu.reqTrademarkList()
      if (tmResult.code === 200) {
        this.trademarkList = tmResult.data
      }
      // 获取spu图片列表数据
      const imgResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (imgResult.code === 200) {
        // ele ui 照片墙需要name 和 url
        const listArr = imgResult.data
        listArr.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.imageList = listArr
      }
      // 获取平台销售属性数据
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 添加销售属性
    addSaleAttr() {
      const { id, name } = this.saleId
      // 重新整合数据 把数据添加到 spu.spuSaleAttrList
      const newSaleAttr = { baseSaleAttrId: id, saleAttrName: name, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 添加完 置空
      this.saleId = ''
    },
    // 属性值名称列表中的 添加  按钮
    showInput(row) {
      // 每一个row中添加响应式的 inputVisible 控制自身的 input button 切换显示
      this.$set(row, 'inputVisible', true)
      // 添加 inputValue 收集数据
      this.$set(row, 'inputValue', '')
    },
    // 属性值名称列表中的 input 失去焦点回调
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      // 判断输入是否为空
      if (inputValue.trim() === '') return this.$message('请输入属性值名称')
      // 判断是否重复
      const result = row.spuSaleAttrValueList.some((item) => item.saleAttrValueName === inputValue)
      if (result) {
        return this.$message('已有该属性值名称')
      }
      // 收集整理传递到销售属性值名称列表数据
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // 往销售属性值名称列表添加数据
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 切换input button
      row.inputVisible = false
      // 清空
    },
    // 保存按钮 回调
    async addOrUpdateSpu() {
      // 整理参数
      this.spu.spuImageList = this.imageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      // 发请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScene', { scene: 'spuList', flag: this.spu.id ? '修改' : '添加' })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 添加SPU按钮 回调
    async addSpuData(category3Id) {
      // 从父组件收集 三级分类ID
      this.spu.category3Id = category3Id
      // 获取品牌列表数据
      const tmResult = await this.$API.spu.reqTrademarkList()
      if (tmResult.code === 200) {
        this.trademarkList = tmResult.data
      }
      // 获取平台销售属性数据
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 取消按钮 回调
    cancel() {
      this.$emit('changeScene', { scene: 'spuList', flag: '' })
      // 清除数据
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
