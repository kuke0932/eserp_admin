import request from '@/utils/request'
import qs from 'qs'

/**
 * 查询出库信息列表
 *
 * @param materialType          物料类型(1原材料，2辅料，3电商产品，4成品，必传项)
 * @param materialCode          物料编码
 * @param materialName          物料名称
 * @param outStorageTime        出库时间
 * @param pageNum               页码
 * @param pageSize              页大小
 */
export function list(materialType, materialCode, materialName, status, outStorageTime, pageNum, pageSize) {
  const data = {
    materialType,
    materialCode,
    materialName,
    status,
    outStorageTime,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/semiProductOutStorage/list',
    method: 'get',
    params: data
  })
}

/**
 * 获取出库详情信息
 *
 * @param id      信息主键
 *
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/erp/admin/semiProductOutStorage/getInfoById',
    method: 'get',
    params: data
  })
}

/**
 * 添加出库信息
 *
 * @param applyName                      申请人账号
 * @param materialAmount                 物料数量
 * @param materialId                     物料id
 * @param reason                         出库原因
 * @param storageLocationCode            库位编码
 * @param supplierId                     供应商id
 */
export function save(applyName, materialAmount, materialId, reason, storageLocationCode, supplierId) {
  const data = {
    applyName,
    materialAmount,
    materialId,
    reason,
    storageLocationCode,
    supplierId
  }
  return request({
    url: '/erp/admin/semiProductOutStorage/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 修改出库信息
 *
 * @param applyName                 申请人账号
 * @param id                        id
 * @param materialAmount            物料数量
 * @param materialId                物料id
 * @param reason                    出库原因
 * @param storageLocationCode       库位编码
 * @param supplierId                供应商id
 */
export function update(applyName, id, materialAmount, materialId, reason, storageLocationCode, supplierId) {
  const data = {
    applyName,
    id,
    materialAmount,
    materialId,
    reason,
    storageLocationCode,
    supplierId
  }
  return request({
    url: '/erp/admin/semiProductOutStorage/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 删除出库信息
 *
 * @param ids       主键ids(逗号分隔）
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/semiProductOutStorage/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 确认出库单出库
 *
 * @param ids 出库单id，多个id中间以，隔开
 */
export function audit(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/semiProductOutStorage/audit',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 刷新出库单
 *
 * @param materialType 物料类型
 */
export function refresh(materialType) {
  const data = {
    materialType
  }
  return request({
    url: '/erp/admin/semiProductOutStorage/refresh',
    method: 'post',
    data: qs.stringify(data)
  })
}
