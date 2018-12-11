/**
 *
 * @author zhaokaiyuan
 * @create 2018-06-14 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据车型名称查询车型列表
 * @param productTypeName      车型名称
 * @param pageNum          页码
 * @param pageSize         每页显示的条数
 */
export function list(productTypeCode, productTypeName, pageNum, pageSize = 1 << 30) {
  const data = {
    productTypeCode,
    productTypeName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/productType/list',
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
    url: '/system/admin/productType/getById',
    method: 'get',
    params: data
  })
}

/**
 * 添加车型信息
 *
 * @param id            id
 * @param productTypeName   车型名称
 * @param productTypeCode   车型编号
 * @param marketTime    上市时间
 * @param productTypeUrl    车型图片
 * @param status        状态
 */
export function save(productTypeCode, productTypeName, washLabelNo, materialLength, attachmentIds) {
  const data = {
    productTypeCode,
    productTypeName,
    washLabelNo,
    materialLength,
    attachmentIds
  }
  return request({
    url: '/system/admin/productType/save',
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
 * @param productTypeName   车型名称
 * @param productTypeCode   车型编号
 * @param marketTime    上市时间
 * @param productTypeUrl    车型图片
 * @param status        状态
 */
export function update(id, productTypeCode, productTypeName, washLabelNo, materialLength, attachmentIds, attachmentUuid) {
  const data = {
    id,
    productTypeName,
    productTypeCode,
    washLabelNo,
    materialLength,
    attachmentIds,
    attachmentUuid
  }
  return request({
    url: '/system/admin/productType/update',
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
    url: '/system/admin/productType/remove',
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
    url: '/system/admin/productType/updateEnableStatus',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

