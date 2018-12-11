/**
 *
 * @author 黄丽红
 * @create 2018-01-15 13:52
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据id获取行政区划信息
 *
 * @param id      行政区划id
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/system/admin/area/getById',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    params: data
  })
}

/**
 * 查询区划父id下的区划列表
 *
 * @param parentId      父id
 */
export function listByParentId(parentId, pageNum, pageSize) {
  const data = {
    parentId,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/area/listByParentId',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    params: data
  })
}

/**
 * 新增行政区划
 *
 * @param areaName      行政区划名称
 * @param areaCode      行政区划编码
 * @param parentId      父id
 */
export function save(areaName, areaCode, parentId) {
  const data = {
    areaName,
    areaCode,
    parentId
  }
  return request({
    url: '/system/admin/area/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 *根据id单个/批量删除行政区划
 *
 * @param ids     行政区划id,多个用户以,分隔
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/system/admin/area/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 行政区划树形菜单
 */
export function tree() {
  return request({
    url: '/system/admin/area/tree',
    method: 'get'
  })
}

/**
 * 行政区划树形菜单
 */
export function treeEnable() {
  return request({
    url: '/system/admin/area/treeEnable',
    method: 'get'
  })
}

/**
 * 修改行政区划信息
 *
 * @param eserpAdministrativeDistrictDTO            行政区划DTO
 */
export function update(areaCode, areaName, id, parentId) {
  const data = {
    areaCode,
    areaName,
    id,
    parentId
  }
  return request({
    url: '/system/admin/area/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 根据id单个/批量启用、禁用行政区划
 *
 * @param ids
 */
export function updateStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/system/admin/area/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
