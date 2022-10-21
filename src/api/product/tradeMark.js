// 品牌管理模块
import request from '@/utils/request'

// 获取品牌列表数据 /admin/product/baseTrademark/{page}/{limit} get
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 新增品牌  /admin/product/baseTrademark/save post 带两参 品牌名称、品牌LOGO
//    新增品牌不需要带ID 因为ID是由服务器生成传递的

// 修改品牌 /admin/product/baseTrademark/update put 带三参 id、品牌名称、品牌LOGO
//    修改品牌需要用到ID来进行修改

// 新增和修改写成一个
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
  } else {
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
  }
}

// 删除品牌  /admin/product/baseTrademark/remove/{id} delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
