/**
 *
 * @author 黄丽红
 * @create 2018-06-11
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 确认可入库
 *
 * @param ids      主键ids(逗号分隔)
 *
 */
export function confirmInStorage(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/returnRecord/confirmInStorage',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 库管入库
 *
 * @param ids      主键ids(逗号分隔)
 *
 */
export function goInStorage(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/returnRecord/goInStorage',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 确认收货
 *
 * @param ids      主键ids(逗号分隔)
 *
 */
export function confirmRecive(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/returnRecord/confirmRecive',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 确认报废
 *
 * @param ids      主键ids(逗号分隔)
 *
 */
export function confirmReject(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/returnRecord/confirmReject',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 确认维修
 *
 * @param ids      主键ids(逗号分隔)
 *
 */
/* export function confirmRepair(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/returnRecord/confirmRepair',
    method: 'post',
    data: qs.stringify(data)
  })
} */

/**
 * 获取退换货记录详情信息
 *
 * @param id      信息主键
 *
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/returnRecord/getInfoById',
    method: 'get',
    params: data
  })
}

/**
 * 退换货信息列表
 *
 * @param productNumber      产品编号（若无传null）
 * @param orderTime        下单时间（若无传null）
 * @param orderStatus      订单状态（若无传null）
 * @param returnStatus     退换货状态(0.客服已保存1.库管已收货2.主任已审核3.客服已确认4.产品已入库5.产品已报废)(若无传null)）
 * @param pageNum           页码
 * @param pageSize          每页显示的条数
 */
export function list(productNumber, orderTime, orderStatus, returnStatus, pageNum, pageSize) {
  const data = {
    productNumber,
    orderTime,
    orderStatus,
    returnStatus,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/returnRecord/list',
    method: 'get',
    params: data
  })
}

/**
 * 删除退换货信息
 *
 * @param ids       主键ids(逗号分隔）
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/returnRecord/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 添加退换货信息
 *
 * @param expressCompanyCode      快递公司编码
 * @param expressNo               快递单号
 * @param productNumber             产品编号
 * @param returnReason            退货原因
 */
export function save(expressCompanyCode, expressNo, productNumber, returnReason) {
  const data = {
    expressCompanyCode,
    expressNo,
    productNumber,
    returnReason
  }
  return request({
    url: '/commerce/admin/returnRecord/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 添加审核意见
 *
 * @param id            退换货主键
 * @param status        维修或者入库状态：1维修，2入库
 * @param auditOpinion  审核意见
 *
 * 以下参数只有在   status 为 1 的时候才需要传
 *
 * @param productNo     产品编码
 * @param orderNo       订单号
 * @param loginName     维修工人工号和工序编码
 * @param repairType    维修类型(维修的时候传)1全部维修2维修主驾3维修副驾4维修主副驾5维修后座6维修后座副驾7维修主驾和后座8维修卡扣9维修网兜
 */
export function saveAuditOpinion(id, status, auditOpinion, productNo, orderNo, loginName, repairType) {
  const data = {
    id,
    status,
    auditOpinion,
    productNo,
    orderNo,
    loginName,
    repairType
  }
  return request({
    url: '/commerce/admin/returnRecord/saveAuditOpinion',
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/json;charset=utf-8'
    // },
    data: qs.stringify(data)
  })
}

/**
 * 修改退换货信息
 *
 * @param id                主键id
 * @param productNumber       产品编号
 * @param returnReason      退货原因
 */
export function update(id, expressCompanyCode, expressNo, productNumber, returnReason) {
  const data = {
    id,
    expressCompanyCode,
    expressNo,
    productNumber,
    returnReason
  }
  return request({
    url: '/commerce/admin/returnRecord/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 *
 * 启用/禁用退换货信息
 *
 * @param ids           投诉id，多个用户以,分隔
 * @param enableStatus  处理结果
 */
export function updateStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/commerce/admin/returnRecord/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 列出快点公司编码
 */
export function listExpressCodes() {
  return request({
    url: '/erp/admin/express/listSelectCodes',
    method: 'get'
  })
}
