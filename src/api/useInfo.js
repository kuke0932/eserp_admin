/**
 *
 * @author youyajuan
 * @create 2018-06-14 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加用车记录
 *
 * @param carOwner      车主信息
 * @param carOwnerMobile 车主联系方式
 * @param cost      费用
 * @param carModel      车型信息
 * @param usage         用途
 * @param useTime       使用时间
 * @param endTime       还车时间
 * @param attachmentIds 图片id
 */
export function save(carOwner, carOwnerMobile, cost, carModel, usage, useTime, endTime, attachmentIds) {
  const data = {
    carOwner,
    carOwnerMobile,
    cost,
    carModel,
    usage,
    useTime,
    endTime,
    attachmentIds
  }
  return request({
    url: '/commerce/admin/useCarRecord/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 用车记录列表
 * @param borrowName       用车人
 * @param carModel         车型
 * @param pageNum          页码
 * @param pageSize         每页显示的条数
 */
export function list(borrowName, carModel, pageNum, pageSize) {
  const data = {
    borrowName,
    carModel,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/useCarRecord/list',
    method: 'get',
    params: data
  })
}

/**
 * 根据id获取详情
 *
 * @param id    车型id
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/useCarRecord/getById',
    method: 'get',
    params: data
  })
}
/**
 * 根据 uuid获取url集合
 *
 * @param attachmentUuid      uuid
 *
 */
export function getByUuid(attachmentUuid) {
  const data = {
    attachmentUuid
  }
  return request({
    url: '/commerce/admin/useCarRecord/getByUuid',
    method: 'get',
    params: data
  })
}
/**
 * 修改用车信息
 *
 * @param id             需求id
 * @param carOwner       车主信息
 * @param carOwnerMobile 车主联系方式
 * @param cost      费用
 * @param carModel       车型信息
 * @param usage          用途
 * @param useTime        使用时间
 * @param endTime        还车时间
 * @param attachmentUuid 图片uuid
 * @param attachmentIds  图片id
 */
export function update(id, carOwner, carOwnerMobile, cost, carModel, usage, useTime, endTime, attachmentUuid, attachmentIds) {
  const data = {
    id,
    carOwner,
    carOwnerMobile,
    cost,
    carModel,
    usage,
    useTime,
    endTime,
    attachmentIds,
    attachmentUuid
  }
  return request({
    url: '/commerce/admin/useCarRecord/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
/**
 * 删除用车记录
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/useCarRecord/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
/**
 * 满足状态判断
 *
 */
export function satisfy(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/demand/satisfy',
    method: 'post',
    data: data // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
