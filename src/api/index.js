// 将四个模块的接口函数统一暴露
import * as tradeMark from '@/api/product/tradeMark.js'
import * as attr from '@/api/product/attr.js'
import * as sku from '@/api/product/sku.js'
import * as spu from '@/api/product/spu.js'

export default {
  tradeMark,
  attr,
  sku,
  spu
}
