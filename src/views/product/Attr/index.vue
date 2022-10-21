<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 平台属性列表 -->
      <div v-show="isShowTable">
        <el-button icon="el-icon-plus" type="primary" style="margin: 0px 0px 20px 0px" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格  展示获取到得平台属性数据 -->
        <el-table border :data="attrList">
          <el-table-column type="index" width="100" label="序号" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="200" />
          <el-table-column prop="address" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag v-for="attr in row.attrValueList" :key="attr.id" type="success" style="margin: 0px 10px">{{ attr.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="200">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :model="attrInfo" :inline="true" label-width="80px">
          <el-form-item label="属性名称">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table border style="width: 100%; margin: 20px 0px" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="100" align="center" />
          <el-table-column prop="name" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
              <span v-else style="display: block" @click="toEdit(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}？`" @onConfirm="delAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入 lodash 中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 平台属性数组
      attrList: [],
      // 控制平台属性显示与隐藏
      isShowTable: true,
      // 收集添加属性 或 修改属性信息
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值列表
        ],
        categoryId: '', // 三级ID
        categoryLevel: 3 // 服务器区分 几级分类ID
      }
    }
  },
  methods: {
    // 自定义事件回调
    getCategoryId({ categoryId, level }) {
      // 区别 三 级ID
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 当有了3级ID 就可以发起请求
        this.getAttrList()
      }
    },
    // 获取平台属性数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      try {
        const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
        if (result.code === 200) {
          this.attrList = result.data
        }
      } catch (error) {
        alert(error.message)
      }
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 添加属性的ID 当点击添加属性值时 需要把该属性的id给它
        valueName: '', // 属性值(根据文档定义类型)
        flag: true
      })
      // 添加属性值时自动聚焦input
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮回调
    addAttr() {
      // 切换平台属性列表和添加属性
      this.isShowTable = false
      // 清除添加属性的信息
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值列表
        ],
        categoryId: this.category3Id, // 获取三级分类ID
        categoryLevel: 3 // 服务器区分 几级分类ID
      }
    },
    // 修改属性值
    updateAttr(row) {
      // 先切换列表和属性信息
      this.isShowTable = false
      // 将对应的信息给 attrInfo
      // 由于数据结构过于复杂 对象里放数组  数组里套对象 所以需要用深拷贝
      this.attrInfo = cloneDeep(row)
      // 在修改某个属性时 给予flag属性标记
      // 使用普通的property新增 是非响应式的 视图无法更新 需要使用$set
      this.attrInfo.attrValueList.forEach((item) => {
        // (对象,添加的响应式属性,对应的属性值)
        this.$set(item, 'flag', false)
      })
    },
    // 切换属性值名称的input  span
    toLook(row) {
      // 如果属性名输入为空
      if (row.valueName.trim() === '') {
        this.$message({
          type: 'error',
          message: '请输入正常的属性名'
        })
        return
      }
      // 如果输入属性名中已有的属性值
      const isRept = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRept) {
        return this.$message({
          type: 'error',
          message: '已有该属性'
        })
      }
      row.flag = false
    },
    // 点击span 的回调 切换为编辑模式
    toEdit(row, index) {
      row.flag = true
      // 当点击span 切换为input时自动聚焦
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 气泡确认框  确定按钮回调
    delAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮  进行添加属性或 修改属性
    async addOrUpdateAttr() {
      // 整理参数
      // 1.如果添加了很多的属性值 但属性值名称为空 则不该提交给服务器
      // 2.提交给服务器中的数据中不需要flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        // 过滤掉属性值为空的
        if (item.valueName !== '') {
          // 删除flag 字段
          delete item.flag
          return true
        }
      })
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 切换到平台属性列表
        this.isShowTable = true
        // 提示成功
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 重新发起请求 获取数据
        this.getAttrList()
      } catch (error) {
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      }
    }
  }
}
</script>

<style scoped></style>
