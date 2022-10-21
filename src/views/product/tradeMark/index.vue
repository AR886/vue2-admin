<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showDialog">添加</el-button>
    <!-- 表格组件
        data:数据 展示的数据 需要是数组形式
        border：给表格添加纵向边框
        label:显示标题
        width:对应宽度
        align:标题的对齐方式
        prop:对应列内容的字段名
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="100%" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- 自定义插槽 -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateDialog(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器
        当前页数  数据总数 每一条展示页数 连续页码数
        current-page 代表的是当前页码数
        total 代表分页器总共展示多少条数据
        page-size  代表的是每一页需要展示多少条数据
        page-sizes  代表的是每一页展示多少条数据
        layout  实现分页器的布局
        pager-count  按钮的数量 是加上两个的按钮
    -->
    <el-pagination style="margin-top: 20px; text-align: center" :current-page="page" :total="total" :page-size="limit" :page-sizes="[3, 5, 10]" :page-count="7" layout="prev, pager, next, jumper,->, sizes,total " @current-change="getPageList" @size-change="handleSizeChange" />

    <!-- 对话框
        visible：是否显示 Dialog，支持 .sync 修饰符
    -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form 表单 model收集表单数据 -->
      <el-form ref="rulesFrom" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 这里收集数据不能用 v-model 因为不是表单
              action:设置图片上传的地址
              on-success:文件上传成功时的钩子
              before-upload:上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
          -->
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { call } from 'body-parser'

export default {
  name: 'TradeMark',
  data() {
    // 自定义验证规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('请输入 2 至 10 个字符'))
      } else {
        callback()
      }
    }
    return {
      // 分页器当前的页数
      page: 1,
      // 当前页数展示数据条数
      limit: 3,
      // 展示的总数据
      total: 0,
      // 数据列表
      list: [],
      // 控制对话框的显示和隐藏属性
      dialogFormVisible: false,
      // 收集品牌信息数据 对象身上的属性不能瞎写 需要根据文档进行
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名
      rules: {
        // 品牌名称验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validator: validateTmName, trigger: 'change' }
        ],
        // 品牌LOGO验证规则
        logoUrl: [{ required: true, message: '请选择品牌LOGO' }]
      }
    }
  },
  mounted() {
    // 首次挂载获取数据
    this.getPageList()
  },
  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      // 默认值为 1 有值拿值 没值拿1
      this.page = pager
      const result = await this.$API.tradeMark.reqTradeMarkList(this.page, this.limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    /** // 当表格的当前行发生变化的时候会触发该事件
    handleCurrentChange(pager) {
      // 把当前点击的页数给page
      this.page = pager
      // 再次发起请求
      this.getPageList()
    } */
    // 当选择展示数据条数项发生变化时 触发
    handleSizeChange(limits) {
      this.limit = limits
      this.getPageList()
    },
    // 添加按钮
    showDialog() {
      this.dialogFormVisible = true
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 修改按钮
    updateDialog(row) {
      this.dialogFormVisible = true
      // 浅拷贝 点击那个对象上的信息
      this.tmForm = { ...row }
    },
    // 文件上传成功时的钩子
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    // 上传文件之前的钩子
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加按钮
    addOrUpdateTradeMark() {
      // 在el-from 上添加 ref属性 判断验证规则 符合才进行确定添加或修改
      this.$refs.rulesFrom.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false
          // 发请求向服务器提交数据
          const result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
            // 弹出提示信息
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            })
            // 重新发起请求获取数据
            // 如果是修改品牌的话 则得停留在那一页
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          console.log('error submit')
          return false
        }
      })
    },
    // 删除按钮
    deleteTradeMark(row) {
      this.$confirm(`确定删除${row.tmName}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击确定执行
          const result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 再次发起请求获取数据 判断当前页里得数据是否大于 1 个 不是就得返回上一页
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          }
        })
        .catch(() => {
          // 点击删除执行
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
