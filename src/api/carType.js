/**
 *
 * @author youyajuan
 * @create 2018-06-20 15:06
 **/
/**
 *
 * @author youyajuan
 * @create 2018-06-14 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加车型信息
 *
 * @param carTypeName   车型名称
 * @param carTypeCode   车型编号
 * @param marketTime    上市时间
 * @param carTypeUrl    车型图片
 * @param status        状态
 */
export function save(brandCode, carTypeName, carTypeCode, marketTime, attachmentIds, carTypeIntroduction) {
  const data = {
    brandCode,
    carTypeName,
    carTypeCode,
    marketTime,
    attachmentIds,
    carTypeIntroduction
  }
  return request({
    url: '/system/admin/carType/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 根据车型名称查询车型列表
 * @param carTypeName      车型名称
 * @param pageNum          页码
 * @param pageSize         每页显示的条数
 */
export function list(brandCode, carTypeCode, carTypeName, pageNum, pageSize) {
  const data = {
    brandCode,
    carTypeCode,
    carTypeName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/carType/list',
    method: 'get',
    params: data
  })
}

/**
 * 获取所有车型下拉列表
 */
export function listAll() {
  return request({
    url: '/system/admin/carType/listAll',
    method: 'get'
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
    url: '/system/admin/carType/getById',
    method: 'get',
    params: data
  })
}

/**
 * 修改车型信息
 *
 * @param id            id
 * @param carTypeName   车型名称
 * @param carTypeCode   车型编号
 * @param marketTime    上市时间
 * @param carTypeUrl    车型图片
 * @param status        状态
 */
export function update(id, brandCode, carTypeName, carTypeCode, marketTime, attachmentUuid, attachmentIds, carTypeIntroduction) {
  const data = {
    id,
    brandCode,
    carTypeName,
    carTypeCode,
    marketTime,
    attachmentUuid,
    attachmentIds,
    carTypeIntroduction
  }
  return request({
    url: '/system/admin/carType/update',
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
    url: '/system/admin/carType/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

/**
 * 启用禁用
 *
 * @param ids          车型id，多个id中间以，隔开
 * @param enableStatus 数据状态，0禁用，1启用
 */
export function updateEnableStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/system/admin/carType/updateEnableStatus',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

