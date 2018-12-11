/**
 *
 * @author 黄丽红
 * @create 2018-01-15 13:52
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据 id获取详情
 *
 * @param id      工序id
 *
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/erp/admin/process/getById',
    method: 'get',
    params: data
  })
}

/**
 * 查询工序列表
 *
 * @param name              工序名称
 * @param pageNum           页码
 * @param pageSize          页大小
 */
export function list(name, pageNum, pageSize) {
  const data = {
    name,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/process/list',
    method: 'get',
    params: data
  })
}

/**
 * 获得工序下拉列表
 *
 * @param 无
 */
export function listProcessSelection() {
  return request({
    url: '/erp/admin/process/listProcessSelection',
    method: 'get'
  })
}

/**
 * 添加工序
 *
 * @param name                  工序名称
 * @param code                  工序编码
 * @param content               工序内容
 * @param duration              操作时长
 * @param processSort           顺序
 */
export function save(name, code, content, duration, processSort) {
  const data = {
    name,
    code,
    content,
    duration,
    processSort
  }
  return request({
    url: '/erp/admin/process/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 修改工序
 *
 * @param id                    工序
 * @param name                  工序名称
 * @param code                  工序编码
 * @param content               工序内容
 * @param duration              操作时长
 * @param processSort           顺序
 */
export function update(id, name, code, content, duration, processSort) {
  const data = {
    id,
    name,
    code,
    content,
    duration,
    processSort
  }
  return request({
    url: '/erp/admin/process/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 根据 id 单个/批量删除工序
 *
 * @param ids       工序id,多个以,分隔
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/process/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据 id 单个/批量删除工序
 *
 * @param ids       工序id,多个以,分隔
 * @enableStatus   启用禁用状态
 */
export function updateEnableStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/erp/admin/process/updateEnableStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
