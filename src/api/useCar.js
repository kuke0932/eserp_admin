/**
 *
 * @author youyajuan
 * @create 2018-06-14 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 发布用车信息
 *
 * @param id            id
 * @param carModel      车型信息
 * @param usage         用途
 * @param useTime       使用时间
 */
export function save(carModel, usage, useTime) {
  const data = {
    carModel,
    usage,
    useTime
  }
  return request({
    url: '/commerce/admin/useCar/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 用车信息列表
 * @param createName       用车人
 * @param carModel         车型
 * @param status           状态
 * @param showAll            是否查询全部
 * @param receiverName     领取人
 * @param receiverTime     领取时间
 * @param pageNum          页码
 * @param pageSize         每页显示的条数
 */
export function list(createName, carModel, status, showAll, receiverName, receiverTime, pageNum, pageSize) {
  const data = {
    createName,
    carModel,
    status,
    showAll,
    receiverName,
    receiverTime,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/useCar/list',
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
    url: '/commerce/admin/useCar/getById',
    method: 'get',
    params: data
  })
}

/**
 * 修改用车信息
 *
 * @param id            需求id
 * @param carModel      车型信息
 * @param usage         用途
 * @param useTime       使用时间
 */
export function update(id, carModel, usage, useTime) {
  const data = {
    id,
    carModel,
    usage,
    useTime
  }
  return request({
    url: '/commerce/admin/useCar/update',
    method: 'post',
    data: qs.stringify(data)
  })
}
/**
 * 删除用车信息
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/useCar/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
/**
 * 批量发布用车信息
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function publish(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/useCar/publish',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
/**
 * 领取任务
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function receive(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/useCar/receive',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

/**
 * 完成任务
 * @param ids
 */
export function finish(ids, evaluation, reason) {
  const data = {
    ids,
    evaluation,
    reason
  }
  return request({
    url: '/commerce/admin/useCar/finish',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
