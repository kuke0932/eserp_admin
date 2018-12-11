/**
 *
 * @author 黄丽红
 * @create 2018-06-11
 **/

import request from '@/utils/request'
/**
 * 获取订单详情（详情页用）
 *
 * @param orderNo      订单编号orderNo
 *
 */
export function getInfoByOrderId(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/order/getInfoByOrderId',
    method: 'get',
    params: data
  })
}

