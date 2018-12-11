import request from '@/utils/request'
import qs from 'qs'

/**
 *成品库存查询
 *
 * @param productAttributeList   产品属性集合，为code名和code值拼接所得，例如’TOPCOLORBLACK’
 * @param productNo   产品编码
 * @param storageLocationCode   库位编码
 * @param brandCode  汽车品牌编号
 * @param carTypeCode  车型编号
 * @param productTypeCode    产品型号编号
 * @param pageNum   页码
 * @param pageSize   页大小
 * @returns {*}
 */
export function listProduct(productAttributeList, productNo, storageLocationCode, brandCode, carTypeCode, productTypeCode, pageNum, pageSize) {
  const data = {
    productAttributeList,
    productNo,
    storageLocationCode,
    brandCode,
    carTypeCode,
    productTypeCode,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/storage/listProduct',
    method: 'get',
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'indices', allowDots: true })
    }
  })
}

/**
 *产品属性列表
 */

export function tree4ProductType() {
  return request({
    url: '/system/admin/productAttributeValue/tree4ProductType',
    method: 'get'
  })
}

/**
 *汽车品牌和产品型号下拉
 */
export function listProductStorageSelection() {
  return request({
    url: '/erp/admin/storage/listProductStorageSelection',
    method: 'get'
  })
}

/**
 *车型编号下拉菜单
 * @param brandCode
 */
export function listCarTypeByBrandCode(brandCode) {
  const data = {
    brandCode
  }
  return request({
    url: '/commerce/admin/order/listCarTypeByBrandCode',
    method: 'get',
    params: data
  })
}
