import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据 id获取详情
 *
 * @param id      物料id
 *
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/system/admin/materialProduct/getById',
    method: 'get',
    params: data
  })
}

/**
 * 物料列表
 *
 * @param type      类型（1原材料，2辅料，3电商产品，4上层材质半成品）
 * @param code      物料编码
 * @param name      物料名称
 * @param typeCode  型号编码
 * @param color     颜色
 * @param departmentId  部门id
 * @param pageNum   页码
 * @param pageSize  页大小
 */
export function list(type, code, name, typeCode, color, departmentId, pageNum, pageSize) {
  const data = {
    type,
    code,
    name,
    typeCode,
    color,
    departmentId,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/materialProduct/list',
    method: 'get',
    params: data
  })
}

/**
 * 添加物料
 *
 * @param code     物料编码
 * @param name     物料名称
 * @param price    单价（分）
 * @param type     类型（1原材料，2辅料，3电商产品，4上层材质半成品）
 * @param unitCode 单位编码
 * @param typeCode 型号编码
 * @param color    颜色
 */
export function save(code, name, price, unitCode, typeCode, color, type) {
  const data = {
    code,
    name,
    price,
    unitCode,
    typeCode,
    color,
    type
  }
  return request({
    url: '/system/admin/materialProduct/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 修改物料
 *
 * @param id       主键id
 * @param code     物料编码
 * @param name     物料名称
 * @param price    单价（分）
 * @param type     物料类型（1原材料，2辅料，3电商产品，4上层材质半成品）
 * @param unitCode 单位编码
 * @param typeCode 型号编码
 * @param color    颜色
 */
export function update(id, code, name, price, unitCode, typeCode, color, type) {
  const data = {
    id,
    code,
    name,
    price,
    unitCode,
    typeCode,
    color,
    type
  }
  return request({
    url: '/system/admin/materialProduct/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 根据 id 单个/批量删除物料信息
 *
 * @param ids       物料id,多个以,分隔
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/system/admin/materialProduct/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据 id 单个/批量启用禁用
 *
 * @param ids       物料id,多个以,分隔
 * @param enableStatus   启用禁用状态
 */
export function updateEnableStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/system/admin/materialProduct/updateEnableStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 获取规格和单位下拉
 *
 * @param type 物料类型（1原材料，2辅料，3电商产品，4上层材质半成品）
 */
export function getSelections(type) {
  const data = {
    type
  }
  return request({
    url: '/system/admin/materialProduct/getSelections',
    method: 'get',
    params: data
  })
}
