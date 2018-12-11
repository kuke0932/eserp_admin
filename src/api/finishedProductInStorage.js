/**
 *
 * @author youyajuan
 * @create 2018-06-5 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加成品入库信息
 *
 * @param id                   id
 * @param departmentId         部门id
 * @param materialAmount       物料数量
 * @param materialId           物料id
 * @param reason               入库原因
 * @param storageLocationCode  库位编码
 * @param supplierId           供应商id
 */
export function save(id, departmentId, productNumber, produceType, reason, storageLocationCode) {
  const data = {
    id,
    departmentId,
    productNumber,
    produceType,
    reason,
    storageLocationCode
  }
  return request({
    url: '/erp/admin/finishedProductInStorage/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 查询成品入库信息列表
 * @param productNumber      产品编号
 * @param productTypeName    产品型号名称
 * @param inStorageTime      入库时间,
 * @param inStatus           入库状态
 * @param departmentId       部门id
 * @param pageNum            页码
 * @param pageSize           每页显示的条数
 */
export function list(productNumber, productTypeName, inStorageTime, inStatus, pageNum, pageSize) {
  const data = {
    productNumber,
    productTypeName,
    inStorageTime,
    inStatus,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/finishedProductInStorage/list',
    method: 'get',
    params: data
  })
}

/**
 * 获取成品入库详情信息
 *
 * @param id    车型id
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/erp/admin/finishedProductInStorage/getInfoById',
    method: 'get',
    params: data
  })
}

/**
 * 修改入库信息
 * @param id            需求id
 * @param contactWay    联系方式
 * @param demandContent 需求内容
 * @param demandName    需求名称
 * @param demandTime    需求提出时间
 * @param presenterName 提出者
 */
export function update(id, departmentId, productNumber, produceType, reason, storageLocationCode) {
  const data = {
    id,
    departmentId,
    productNumber,
    produceType,
    reason,
    storageLocationCode
  }
  return request({
    url: '/erp/admin/finishedProductInStorage/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
/**
 * 删除入库信息
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/finishedProductInStorage/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
/**
 *
 * 根据id单个/批量 启用、禁用入库信息
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
    url: '/erp/admin/finishedProductInStorage/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 确认成品入库单入库
 *
 * @param ids 入库单id，多个id中间以，隔开
 */
export function audit(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/finishedProductInStorage/audit',
    method: 'post',
    data: qs.stringify(data)
  })
}
