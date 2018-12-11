/**
 *
 * @author 黄丽红
 * @create 2018-06-11
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据 id获取供应商信息
 *
 * @param id      供应商id
 *
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/system/admin/supplier/getById',
    method: 'get',
    params: data
  })
}

/**
 * 根据 供应商名称/联系人/状态 查询供应商列表信息
 *
 * @param supplierName      供应商名称
 * @param contacts          联系人
 * @param enableStatus      状态
 * @param pageNum           页码
 * @param pageSize          页大小
 */
export function list(supplierName, contacts, enableStatus, pageNum, pageSize) {
  const data = {
    supplierName,
    contacts,
    enableStatus,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/supplier/list',
    method: 'get',
    params: data
  })
}

/**
 * 添加供应商
 *
 * @param business
 * @param contactAddress
 * @param contactWay
 * @param contacts
 * @param email
 * @param id
 * @param supplierAddress
 * @param supplierName
 * @param website
 */
export function save(business, city, contactAddress, contactWay, contacts, county, email, province, street, supplierName, website) {
  const data = {
    business,
    city,
    contactAddress,
    contactWay,
    contacts,
    county,
    email,
    province,
    street,
    supplierName,
    website
  }
  return request({
    url: '/system/admin/supplier/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 修改供应商
 *
 *@param business
 * @param contactAddress
 * @param contactWay
 * @param contacts
 * @param email
 * @param id
 * @param supplierAddress
 * @param supplierName
 * @param website
 */
export function update(business, city, contactAddress, contactWay, contacts, county, email, id, province, street, supplierName, website) {
  const data = {
    business,
    city,
    contactAddress,
    contactWay,
    contacts,
    county,
    email,
    id,
    province,
    street,
    supplierName,
    website
  }
  return request({
    url: '/system/admin/supplier/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 *
 * 根据id单个/批量 启用、禁用供应商
 *
 * @param ids           供应商id
 * @param enableStatus  供应商状态
 */
export function updateStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/system/admin/supplier/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 删除供应商
 * @param ids
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/system/admin/supplier/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}
