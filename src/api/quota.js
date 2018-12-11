/**
 *
 * @author 黄丽红
 * @create 2018-07-11 8:30
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 限额管理
 *
 * @param departmentName    部门名称
 * @param pageNum           页码
 * @param pageSize          页大小
 */
export function list(departmentName, pageNum, pageSize) {
  const data = {
    departmentName,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/quota/list',
    method: 'get',
    params: data
  })
}

/**
 * 设置限额及比例
 *
 * @param id                         主键id
 * @param sharesMoney                入股金额
 * @param quotaProportion            限额比例
 * @param managementProportion       管理比例
 */
export function update(id, sharesMoney, quotaProportion, managementProportion) {
  const data = {
    id,
    sharesMoney,
    quotaProportion,
    managementProportion
  }
  return request({
    url: '/erp/admin/quota/update',
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/json;charset=utf-8'
    // },
    data: qs.stringify(data)
  })
}

