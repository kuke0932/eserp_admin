/**
 *
 * @author 黄丽红
 * @create 2018-06-11
 **/

import request from '@/utils/request'
import qs from 'qs'
/**
 * 根据 回访状态/订单编号 查询投诉管理列表
 *
 * @param visitStatus       回访状态
 * @param orderNo           订单编号
 * @param visitTime         回访月份
 */
export function list(visitStatus, orderNo, visitTime, pageNum, pageSize) {
  const data = {
    visitStatus,
    orderNo,
    visitTime,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/customVisit/list',
    method: 'get',
    params: data
  })
}

/**
 * 填写回访内容
 *
 * @param ids
 * @param visitResult
 */
export function updateResult(ids, visitResult) {
  const data = {
    ids,
    visitResult
  }
  return request({
    url: '/commerce/admin/customVisit/updateResult',
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/json;charset=utf-8'
    // },
    data: qs.stringify(data)
  })
}
