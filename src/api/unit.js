/**
 *
 * @author 黄丽红
 * @create 2018-06-11
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据 id获取单位信息
 *
 * @param id      单位编码
 *
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/system/admin/unit/getById',
    method: 'get',
    params: data
  })
}

/**
 * 根据 单位编码/单位名称/状态 查询单位列表信息
 *
 * @param unitCode      单位编码
 * @param unitName      单位名称
 * @param status        状态
 * @param pageNum       页码
 * @param pageSize      页大小
 */
export function list(unitCode, unitName, enableStatus, pageNum, pageSize) {
  const data = {
    unitCode,
    unitName,
    enableStatus,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/unit/list',
    method: 'get',
    params: data
  })
}

/**
 * 添加单位
 *
 * @param unitName      单位名称
 * @param unitCode      单位编码
 */
export function save(unitName, unitCode) {
  const data = {
    unitName,
    unitCode
  }
  return request({
    url: '/system/admin/unit/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 修改单位
 *
 * @param               单位id
 * @param unitName      单位名称
 * @param unitCode      单位编码
 */
export function update(id, unitName, unitCode) {
  const data = {
    id,
    unitName,
    unitCode
  }
  return request({
    url: '/system/admin/unit/update',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 *
 * 根据id单个/批量 启用、禁用单位
 *
 * @param ids           单位id
 * @param enableStatus  单位状态
 */
export function updateStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/system/admin/unit/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 *
 * 根据id 删除单位
 *
 * @param ids           单位id
 * @param enableStatus  单位状态
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/system/admin/unit/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}
