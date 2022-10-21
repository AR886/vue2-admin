<template>
  <div>
    <el-form :model="cForm" :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" :disabled="show" @change="handler1">
          <el-option v-for="attr1 in List1" :key="attr1.id" :label="attr1.name" :value="attr1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" :disabled="show" @change="handler2">
          <el-option v-for="attr2 in List2" :key="attr2.id" :label="attr2.name" :value="attr2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" :disabled="show" @change="handler3">
          <el-option v-for="attr3 in List3" :key="attr3.id" :label="attr3.name" :value="attr3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      // 一级分类数组
      List1: [],
      // 二级分类数组
      List2: [],
      // 三级分类数组
      List3: [],
      // 收集分类的ID
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  // 组件挂载完毕时 就要获取一级分类的数据
  mounted() {
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.List1 = result.data
      }
    },
    // 一级分类Select事件回调(当一级分类的option发生变化时触发 获取二级分类数组)
    async handler1() {
      // 当option发生改变时 清空原来的2Id和3Id 还有数据
      this.List2 = []
      this.List3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // 解构一级分类的ID
      const { category1Id } = this.cForm
      // 向父组件传递ID
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        this.List2 = result.data
      }
    },
    // 二级分类Select事件回调(当二级分类的option发生变化时触发 获取三级分类数组)
    async handler2() {
      this.List3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      const result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code === 200) {
        this.List3 = result.data
      }
    },
    // 三级分类Select事件回调
    handler3() {
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style scoped></style>
