/**
 *
 * @author youyajuan
 * @create 2018-06-5 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加入库信息
 *
 * @param id                   id
 * @param departmentId         部门id
 * @param materialAmount       物料数量
 * @param materialId           物料id
 * @param reason               入库原因
 * @param storageLocationCode  库位编码
 * @param supplierId           供应商id
 */
export function save(jsonData) {
  return request({
    url: '/erp/admin/semiProductInStorage/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: jsonData
  })
}

/**
 * 查询入库信息列表
 * @param materialType    物料类型(1原材料，2辅料，3电商产品，4成品，必传项)
 * @param materialCode    物料编码
 * @param materialName    物料名称
 * @param inStorageTime   入库时间
 * @param pageNum         页码
 * @param pageSize        每页显示的条数
 */

export function list(materialType, materialCode, materialName, inStorageTime, inStatus, pageNum, pageSize) {
  const data = {
    materialType,
    materialCode,
    materialName,
    inStorageTime,
    inStatus,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/semiProductInStorage/list',
    method: 'get',
    params: data
  })
}

/**
 * 获取入库详情信息
 *
 * @param id    车型id
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/erp/admin/semiProductInStorage/getInfoById',
    method: 'get',
    params: data
  })
}

/**
 * 修改入库信息
 * @param id                  id
 * @param departmentId        部门id
 * @param materialAmount      数量
 * @param materialId          物料Id
 * @param reason              原因
 * @param storageLocationCode 库位编码
 * @param supplierId          供应商Id
 */
export function update(id, departmentId, materialAmount, materialId, reason, storageLocationCode, supplierId, materialType) {
  const data = {
    id,
    departmentId,
    materialAmount,
    materialId,
    reason,
    storageLocationCode,
    supplierId,
    materialType
  }
  return request({
    url: '/erp/admin/semiProductInStorage/update',
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
    url: '/erp/admin/semiProductInStorage/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

/**
 * 打印二维码
 *
 * @param ids
 */
export function printQrCode(ids, amount) {
  const data = {
    ids,
    amount
  }
  return request({
    url: '/erp/admin/semiProductInStorage/printQrCode',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

/**
 * 确认入库单入库
 *
 * @param ids 入库单id，多个id中间以，隔开
 */
export function audit(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/semiProductInStorage/audit',
    method: 'post',
    data: qs.stringify(data)
  })
}
