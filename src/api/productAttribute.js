/**
 *
 * @author zhaokaiyuan
 * @create 2018-06-14 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 *
 * @param productAttributeName      车型名称
 * @param pageNum          页码
 * @param pageSize         每页显示的条数
 */
export function list(productAttributeCode, productAttributeName, pageNum, pageSize = 1 << 30) {
  const data = {
    productAttributeCode,
    productAttributeName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/productAttribute/list',
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
    url: '/system/admin/productAttribute/getById',
    method: 'get',
    params: data
  })
}

/**
 * 添加车型信息
 *
 * @param id            id
 * @param productAttributeName   车型名称
 * @param productAttributeCode   车型编号
 * @param marketTime    上市时间
 * @param productAttributeUrl    车型图片
 * @param status        状态
 */
export function save(productAttributeCode, productAttributeName, inProductType, productAttributeSort) {
  const data = {
    productAttributeCode,
    productAttributeName,
    inProductType,
    productAttributeSort
  }
  return request({
    url: '/system/admin/productAttribute/save',
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
 * @param productAttributeName   车型名称
 * @param productAttributeCode   车型编号
 * @param marketTime    上市时间
 * @param productAttributeUrl    车型图片
 * @param status        状态
 */
export function update(id, productAttributeCode, productAttributeName, inProductType, productAttributeSort) {
  const data = {
    id,
    productAttributeName,
    productAttributeCode,
    inProductType,
    productAttributeSort
  }
  return request({
    url: '/system/admin/productAttribute/update',
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
    url: '/system/admin/productAttribute/remove',
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
    url: '/system/admin/productAttribute/updateEnableStatus',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

