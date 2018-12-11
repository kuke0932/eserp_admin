import request from '@/utils/request'
import qs from 'qs'

/**
 * 物流公司列表
 * @param name  物流公司名称
 * @param pageNum   页码
 * @param pageSize  页大小
 */

export function list(name, pageNum, pageSize = 1 << 30) {
  const data = {
    name,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/expressCompany/list',
    method: 'get',
    params: data
  })
}

/**
 * 物流公司id
 * @param ids 物流公司id 多个id中间以“,”隔开
 */

export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/expressCompany/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 公司id
 * @param id   物流公司id
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/erp/admin/expressCompany/getById',
    method: 'get',
    params: data
  })
}

/**
 * 新增 修改物流公司所需参数
 * @param jsonData
 */
export function update(jsonData) {
  return request({
    url: '/erp/admin/expressCompany/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: jsonData
  })
}

/**
 * 添加物流公司所需参数
 * @param jsonData
 */
export function save(jsonData) {
  return request({
    url: '/erp/admin/expressCompany/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: jsonData
  })
}
