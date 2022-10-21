import request from '@/utils/request.js'

// 获取SPU数据列表 /admin/product/{page}/{limit} get page、limit、category3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id }})

// 获取SPU基本信息  /admin/product/getSpuById/{spuId} get
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌信息 /admin/product/baseTrademark/getTrademarkList get
export const reqTrademarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// 获取SPU图片  /admin/product/spuImageList/{spuId} get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取平台全部销售属性  /admin/product/baseSaleAttrList get
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

// 修改SPU | 添加SPU
export const reqAddOrUpdateSpu = (data) => {
  // 带id 则为修改SPU
  if (data.id) {
    return request({ url: '/admin/product/updateSpuInfo', method: 'post', data })
  } else {
    return request({ url: '/admin/product/saveSpuInfo', method: 'post', data })
  }
}

// 删除SPU /admin/product/deleteSpu/{spuId} delete
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 获取销售属性列表数据 /admin/product/spuSaleAttrList/{spuId} get
export const reqSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平台属性列表数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加SKU  /admin/product/saveSkuInfo post
export const reqAddSku = (data) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data })

// 获取SKU列表数据 /admin/product/findBySpuId/{spuId}  get
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
