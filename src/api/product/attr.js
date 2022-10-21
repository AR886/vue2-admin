// 平台管理属性请求接口
import request from '@/utils/request.js'

// 获取一级分类接口 /admin/product/getCategory1 get
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })

// 获取二级分类接口 /admin/product/getCategory2/{category1Id} get
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

// 获取三级分类接口 /admin/product/getCategory3/{category2Id} get
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 获取平台属性接口 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加属性和属性值接口 /admin/product/saveAttrInfo post
/* 携带参数
  {
    "attrName":""  属性名
    "attrValueList":[  属性值列表
      {
        "attrId":""  相对属性得ID
        "valueName":"" 属性值
      }
    ],
    categoryId:3  三级ID
    categoryLevel:3  三级属性
  }
*/
export const reqAddOrUpdateAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data })
