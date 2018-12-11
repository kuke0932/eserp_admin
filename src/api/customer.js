/**
 *
 * @author youyajuan
 * @create 2018-06-5 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加客户信息
 *
 * @param id         需求id
 * @param nickname   客户昵称
 * @param telephone  用户手机号
 * @param name       用户真实姓名
 * @param province   省
 * @param city       市
 * @param county       县
 */
export function save(id, telephone, name, province, city, county,
  street, postcode, taoBaoAccount,
  storeBrand, carBrand, carType, carDesc, productType, topColor, bottomColor) {
  const data = {
    id,
    telephone,
    name,
    province,
    city,
    county,
    street,
    postcode,
    taoBaoAccount,
    storeBrand,
    carBrand,
    carType,
    carDesc,
    productType,
    topColor,
    bottomColor
  }
  return request({
    url: '/commerce/admin/customerAddress/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 查询客户信息列表
 * @param telephone        客户手机号
 * @param customerName     客户姓名
 * @param pageNum          页码
 * @param pageSize         每页显示的条数
 */
export function list(telephone, customerName, productBrand, pageNum, pageSize) {
  const data = {
    telephone,
    customerName,
    productBrand,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/customerAddress/list',
    method: 'get',
    params: data
  })
}

/**
 * 查询客户信息列表
 * @param telephone        客户手机号
 * @param customerName     客户姓名
 * @param pageNum          页码
 * @param pageSize         每页显示的条数
 */
export function listByParam(param, pageNum, pageSize) {
  const data = {
    param,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/customerAddress/listByParam',
    method: 'get',
    params: data
  })
}

/**
 * 获取客户信息
 *
 * @param id    车型id
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/customerAddress/getInfoById',
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    },
    params: data
  })
}

/**
 * 修改客户信息
 *
 * @param id          需求id
 * @param nickname    用户昵称
 * @param telephone   电话
 * @param name        用户姓名
 * @param province    省
 * @param city        市
 * @param county      县
 */
export function update(id, telephone, name, province, city,
  county, street, postcode, taoBaoAccount,
  storeBrand, carBrand, carType, carDesc, productType, topColor, bottomColor) {
  const data = {
    id,
    telephone,
    name,
    province,
    city,
    county,
    street,
    postcode,
    taoBaoAccount,
    storeBrand,
    carBrand,
    carType,
    carDesc,
    productType,
    topColor,
    bottomColor
  }
  return request({
    url: '/commerce/admin/customerAddress/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
/**
 * 删除客户列表
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/customerAddress/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
/**
 * Excel上传客户信息
 *
 * @param file             excel文件（客户信息）
 */
export function upload(file) {
  const data = new FormData()
  data.append('file', file.raw)
  return request({
    url: '/commerce/admin/customerAddress/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}

/**
 * 获取没有areaType的规格下拉
 *
 * @param type 物料类型（1原材料，2辅料，3电商产品，4上层材质半成品）
 */
export function getNoAreaTypeMaterialProductSelections(type) {
  const data = {
    type
  }
  return request({
    url: '/system/admin/materialProduct/getNoAreaTypeMaterialProductSelections',
    method: 'get',
    params: data
  })
}

/**
 * 获取规格和单位下拉
 *
 * @param type 物料类型（1原材料，2辅料，3电商产品，4上层材质半成品）
 */
export function getSelections(type) {
}
