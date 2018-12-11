/**
 *
 * @author zhaokaiyuan
 * @create 2018-07-09 15:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加规格
 *
 * @param specificationCode     物料规格编码
 * @param specificationName     物料规格名称
 * @param type  类型（1原材料，2辅料，3电商产品，4上层材质半成品）
 */
export function save(specificationCode, specificationName, type) {
  const data = {
    code: specificationCode,
    name: specificationName,
    type: type
  }
  return request({
    url: '/system/admin/materialProductType/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 查询物料规格列表
 *
 * @param type  类型（1原材料，2辅料，3电商产品，4上层材质半成品）
 * @param specificationName    规格名称
 * @param specificationCode    规格编码
 * @param pageNum              页码
 * @param pageSize             每页显示的条数
 */
export function list(type, specificationName, specificationCode, pageNum, pageSize) {
  const data = {
    type,
    name: specificationName,
    code: specificationCode,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/materialProductType/list',
    method: 'get',
    params: data
  })
}

/**
 *获取物料规格详情信息
 *
 * @param id    物料id
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/system/admin/materialProductType/getById',
    method: 'get',
    params: data
  })
}

/**
 * 修改物料规格
 *
 * @param id                   需求id
 * @param specificationCode    规格code
 * @param specificationName    规格名称
 * @param type  类型（1原材料，2辅料，3电商产品，4上层材质半成品）
 */
export function update(id, specificationCode, specificationName, type) {
  const data = {
    id,
    code: specificationCode,
    name: specificationName,
    type: type
  }
  return request({
    url: '/system/admin/materialProductType/update',
    method: 'post',
    data: qs.stringify(data)
  })
}
/**
 * 删除物料规格
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/system/admin/materialProductType/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
/**
 *
 * 根据id单个/批量 启用、禁用物料规格
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
    url: '/system/admin/materialProductType/updateEnableStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
