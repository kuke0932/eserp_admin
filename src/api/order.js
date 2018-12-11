/**
 *
 * @author 黄丽红
 * @create 2018-06-11
 **/

import request from '@/utils/request'
import qs from 'qs'
import axios from 'axios'
import { getToken } from '@/utils/auth'

/**
 * 审核订单信息
 *
 * @param orderNumbers      订单编号orderNumbers(逗号分隔)
 */
export function auditOrder(orderNumbers) {
  const data = {
    orderNumbers
  }
  return request({
    url: '/commerce/admin/order/auditOrder',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 查询订单信息列表
 *
 * @param orderNumber      订单编号（若无传null）
 * @param orderTime        下单时间（若无传null）
 * @param orderStatus      订单状态（若无传null）
 * @param pageNum           页码
 * @param pageSize          每页显示的条数
 */
export function list(orderNumber, orderTime, orderStatus, expressNo, priority, produceDepartment, pageNum, pageSize) {
  const data = {
    orderNumber,
    orderTime,
    orderStatus,
    expressNo,
    priority,
    produceDepartment,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/order/list',
    method: 'get',
    params: data
  })
}

/**
 * 综合查询订单信息列表
 * @param param 综合参数
 * @param pageNum 页码
 * @param pageSize 每页显示的条数
 */
export function listByParam(param, pageNum, pageSize) {
  const data = {
    param,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/order/listByParam',
    method: 'get',
    params: data
  })
}

/**
 * Excel上传订单信息
 *
 * @param file             excel文件（订单信息）
 */
export function upload(file) {
  const data = new FormData()
  data.append('file', file.raw)
  return request({
    url: '/commerce/admin/order/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}

/**
 * Excel上传订单信息
 *
 * @param file             excel文件（订单信息）
 */
export function backfillExpressInfo(file) {
  const data = new FormData()
  data.append('file', file.raw)
  return axios.post('/commerce/admin/order/backfillExpressInfo',
    data, {
      headers: {
        'x-auth-token': getToken()
      },
      baseURL: process.env.BASE_API, // api的base_url
      timeout: 15000
    }).then(res => {
    const uuid = res.data
    const token = getToken()
    window.location.href = process.env.BASE_API + '/commerce/admin/order/downloadExpressInfo?uuid=' + uuid + '&x=' + token
  })
}

/**
 * 删除订单信息
 *
 * @param ids       主键ids(逗号分隔）
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/order/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 合并订单
 *
 * @param ids 主键ids(逗号分割)
 */
export function mergeOrder(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/order/mergeOrder',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 变更订单
 *
 * dto实体
 * @param order
 */
export function changeOrder(order) {
  const data = order
  return request({
    url: '/commerce/admin/order/changeOrder',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 添加退换货信息
 * @param productNos 产品编号,中间逗号分隔
 * @param cause      原因
 */
export function saveReturnRecord(productNos, cause) {
  const data = {
    productNos,
    cause
  }
  return request({
    url: '/commerce/admin/order/saveReturnRecord',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
* 添加维修信息
* @param productNos 产品编号,中间逗号分隔
* @param cause      原因
* @param source     维修来源
*/
export function saveRepairRecord(productNos, cause, source) {
  const data = {
    productNos,
    cause,
    source
  }
  return request({
    url: '/commerce/admin/order/saveRepairRecord',
    method: 'post',
    data: qs.stringify(data)
  })
}

