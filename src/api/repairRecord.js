/**
 *
 * @author 黄丽红
 * @create 2018-06-11
 **/

import request from '@/utils/request'
import qs from 'qs'

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
    url: '/commerce/admin/repairRecord/confirmRecive',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 确认维修
 *
 * @param ids        主键ids(逗号分隔)
 * @param productNos 产品编号(逗号分隔)
 *
 */
export function confirmRepair(ids, productNos) {
  const data = {
    ids,
    productNos
  }
  return request({
    url: '/commerce/admin/repairRecord/confirmRepair',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 获取id获取详情信息
 *
 * @param id      信息主键
 *
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/repairRecord/getInfoById',
    method: 'get',
    params: data
  })
}

/**
 * 维修信息列表
 *
 * @param productNumber      产品编号（若无传null）
 * @param orderTime        下单时间（若无传null）
 * @param repairStatus     维修状态(0.客服已保存1.库管已收货2.主任已审核3.客服已确认4.正在维修5.已发货)(若无传null)）
 * @param repairSource     维修来源(0.退货入库维修1.客户寄回维修2.出库维修)
 * @param pageNum           页码
 * @param pageSize          每页显示的条数
 */
export function list(productNumber, orderTime, repairStatus, repairSource, pageNum, pageSize) {
  const data = {
    productNumber,
    orderTime,
    repairStatus,
    repairSource,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/repairRecord/list',
    method: 'get',
    params: data
  })
}

/**
 * 删除维修信息
 *
 * @param ids       主键ids(逗号分隔）
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/repairRecord/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 添加维修信息
 *
 * @param productNumber      产品编号
 * @param returnReason     维修原因
 */
export function save(productNumber, repairReason, source, expressCompanyCode, expressNo) {
  const data = {
    productNumber,
    repairReason,
    source,
    expressCompanyCode,
    expressNo
  }
  return request({
    url: '/commerce/admin/repairRecord/save',
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
 * @param id                主键id
 * @param opinion      审核意见
 */
export function saveAuditOpinion(id, opinion, repairType, loginName) {
  const data = {
    id,
    opinion,
    repairType,
    loginName
  }
  return request({
    url: '/commerce/admin/repairRecord/saveAuditOpinion',
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/json;charset=utf-8'
    // },
    data: qs.stringify(data)
  })
}

/**
 * 修改维修信息
 *
 * @param id                主键id
 * @param productNumber       产品编号
 * @param returnReason      退货原因
 */
export function update(id, productNumber, repairReason, source, expressCompanyCode, expressNo) {
  const data = {
    id,
    productNumber,
    repairReason,
    source,
    expressCompanyCode,
    expressNo
  }
  return request({
    url: '/commerce/admin/repairRecord/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}
