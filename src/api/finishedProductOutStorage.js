/**
 *
 * @author youyajuan
 * @create 2018-06-5 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 库管将待申请的记录设置为已申请
 *
 *
 * @param ids        主键ids（逗号分隔）
 */
export function apply(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/apply',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 添加成品出库信息
 *
 *
 * @param productNumber        产品编号
 * @param reason               出库原因
 * @param storageLocationCode  库位编码
 */
export function save(productNumber, reason, storageLocationCode) {
  const data = {
    productNumber,
    reason,
    storageLocationCode
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 查询成品出库信息列表
 * @param productNumber      产品编号
 * @param productTypeName    产品类型名称
 * @param outStorageTime     出库时间
 * @param pageNum            页码
 * @param pageSize           每页显示的条数
 */
export function list(productNumber, productTypeCode, outStorageTime, status, pageNum, pageSize) {
  const data = {
    productNumber,
    productTypeCode,
    outStorageTime,
    status,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/list',
    method: 'get',
    params: data
  })
}

/**
 * 获取成品出库详情信息
 *
 * @param id    主键id
 */
export function getInfoById(id) {
  console.log(1)
  const data = {
    id
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/getInfoById',
    method: 'get',
    params: data
  })
}

/**
 * 修改出库信息
 * @param id                     id
 * @param productNumber          产品编号
 * @param reason                 出库原因
 * @param storageLocationCode    库位编码
 */
export function update(id, productNumber, reason, storageLocationCode) {
  const data = {
    id,
    productNumber,
    reason,
    storageLocationCode
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 根据产品编号获取参与该产品制作的工人和工序
 *
 * @param productNo 产品编号
 */
export function listProcess(productNo) {
  const data = {
    productNo
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/listProcessByProductNo',
    method: 'get',
    params: data
  })
}

/**
 * 使用该产品
 * @param id                     申请单id
 * @param opinion                审核意见
 * @param productNumber          产品编码（库存）
 * @param produceType            生产类型(重组的时候传)0全部生产1生产上层2生产下层4生产副驾驶生产后排8生产上层生产副驾驶生产后排
 * @param repairType             维修类型(维修的时候传)1全部维修2维修主驾3维修副驾4维修主副驾5维修后座6维修后座副驾7维修主驾和后座8维修卡扣9维修网兜
 * @param status                 要审核的状态 3.维修 4.重组 5.不生产
 * @param loginName              维修工人工号
 */
export function audit(id, opinion, productNumber, produceType, repairType, status, loginName) {
  const data = {
    id,
    opinion,
    productNumber,
    produceType,
    repairType,
    status,
    loginName
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/audit',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 正常出库产品审核
 * @param id                     申请单id
 * @param opinion                审核意见
 * @param productNumber          产品编码（库存）
 * @param produceType            生产类型(重组的时候传)0全部生产1生产上层2生产下层4生产副驾驶生产后排8生产上层生产副驾驶生产后排
 * @param repairType             维修类型(维修的时候传)1全部维修2维修主驾3维修副驾4维修主副驾5维修后座6维修后座副驾7维修主驾和后座8维修卡扣9维修网兜
 * @param status                 要审核的状态 3.维修 4.重组 5.不生产
 * @param loginName              维修工人工号
 */
export function auditNormal(id, opinion, productNumber, produceType, repairType, status, loginName) {
  const data = {
    id,
    opinion,
    productNumber,
    produceType,
    repairType,
    status,
    loginName
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/auditNormal',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 获得匹配产品和原产品信息
 * @param productNo              库存产品编码
 *
 */
export function getMatchProduct(productNo, id) {
  const data = {
    productNo,
    id
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/getMatchProduct',
    method: 'get',
    params: data
  })
}

/**
 * 删除成品出库信息
 *
 * @param ids  主键ids，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

/**
 * 不使用该产品
 *
 * @param productNo         产品编号（非库存）
 * @param number            匹配次数
 */
export function resetMatch(productNo, number, id) {
  const data = {
    productNo,
    number,
    id
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/resetMatch',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

/**
 *
 * 根据id单个/批量 启用、禁用出库信息
 *
 * @param ids           id
 * @param enableStatus  状态
 */
export function updateStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 放弃使用库存匹配
 *
 * @param productNo      原产品产品编号
 * @param matchProductNo 匹配产品编号
 */
export function giveUpMatch(productNo, matchProductNo, id) {
  const data = {
    productNo,
    matchProductNo,
    id
  }
  return request({
    url: '/erp/admin/finishedProductOutStorage/giveUpMatch',
    method: 'post',
    data: qs.stringify(data)
  })
}
