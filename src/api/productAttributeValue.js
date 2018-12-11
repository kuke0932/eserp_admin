/**
 *
 * @author youyajuan
 * @create 2018-06-14 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 *
 * @param productAttributeValueName      车型名称
 * @param pageNum          页码
 * @param pageSize         每页显示的条数
 */
export function list(attributeCode, productAttributeValueCode, productAttributeValueName, pageNum, pageSize = 1 << 30) {
  const data = {
    attributeCode,
    productAttributeValueCode,
    productAttributeValueName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/productAttributeValue/list',
    method: 'get',
    params: data
  })
}

/**
 * 根据id获取车型信息
 *
 * @param id    车型id
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/system/admin/productAttributeValue/getById',
    method: 'get',
    params: data
  })
}

/**
 * 添加车型信息
 *
 * @param id            id
 * @param productAttributeValueName   车型名称
 * @param productAttributeValueCode   车型编号
 * @param marketTime    上市时间
 * @param productAttributeValueUrl    车型图片
 * @param status        状态
 */
export function save(attributeCode, productAttributeValueCode, productAttributeValueName) {
  const data = {
    attributeCode,
    productAttributeValueCode,
    productAttributeValueName
  }
  return request({
    url: '/system/admin/productAttributeValue/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 修改车型信息
 *
 * @param id            id
 * @param productAttributeValueName   车型名称
 * @param productAttributeValueCode   车型编号
 * @param marketTime    上市时间
 * @param productAttributeValueUrl    车型图片
 * @param status        状态
 */
export function update(id, attributeCode, productAttributeValueCode, productAttributeValueName) {
  const data = {
    id,
    attributeCode,
    productAttributeValueName,
    productAttributeValueCode
  }
  return request({
    url: '/system/admin/productAttributeValue/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
/**
 * 删除车型信息
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/system/admin/productAttributeValue/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
/**
 * 启用禁用
 *
 */
export function updateEnableStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/system/admin/productAttributeValue/updateEnableStatus',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

/**
 * 获取属性树
 */
export function tree4ProductType() {
  return request({
    url: '/system/admin/productAttributeValue/tree4ProductType',
    method: 'get'
  })
}

/**
 * 设置产品型号属性关联
 * @param productTypeCode
 * @param productAttributeValueCodes
 */
export function setProductTypeAttributeValue(productTypeCode, productAttributeValues) {
  const data = {
    productTypeCode,
    productAttributeValues
  }
  return request({
    url: '/system/admin/productAttributeValue/setProductTypeAttributeValue',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

/**
 * 获取产品型号属性关联
 * @param productTypeCode
 * @param productAttributeValueCodes
 */
export function getProductTypeAttributeValue(productTypeCode) {
  const data = {
    productTypeCode
  }
  return request({
    url: '/system/admin/productAttributeValue/getProductTypeAttributeValue',
    method: 'get',
    params: data
  })
}
