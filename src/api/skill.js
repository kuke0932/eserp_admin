/**
 *
 * @author youyajuan
 * @create 2018-06-5 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 上传版型资源
 *
 * @param carTypeCode       车型编码
 * @param carModelName      资源名称
 * @param cutAmount         裁剪片数
 * @param attachmentFileId  版型文件id
 * @param attachmentIds     附件id,多个附件id中间以“,”隔开
 */
export function save(brandCode, carTypeCode, productTypeCode, carModelName, cutAmount, attachmentFileId, attachmentIds, attachmentCarModelIds) {
  const data = {
    brandCode,
    carTypeCode,
    productTypeCode,
    carModelName,
    cutAmount,
    attachmentFileId,
    attachmentIds,
    attachmentCarModelIds
  }
  return request({
    url: '/commerce/admin/carModel/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 *版型列表
 * @param carTypeCode    车型编码
 * @param carTypeName    车型名
 * @param carModelName   资源名称
 * @param pageNum        页码
 * @param pageSize       每页显示的条数
 */
export function list(brandCode, carTypeCode, carTypeName, carModelName, pageNum, pageSize) {
  const data = {
    brandCode,
    carTypeCode,
    carTypeName,
    carModelName,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/carModel/list',
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    },
    params: data
  })
}

/**
 * 根据id获取版型资源信息
 *
 * @param id    车型id
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/carModel/getById',
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    },
    params: data
  })
}
/**
 * 根据 uuid获取url集合
 *
 * @param attachmentUuid      uuid
 *
 */
export function getByUuid(attachmentUuid) {
  const data = {
    attachmentUuid
  }
  return request({
    url: '/commerce/admin/complaint/getByUuid',
    method: 'get',
    params: data
  })
}

/**
 * 根据id修改版型资源信息
 *
 * @param id
 * @param carTypeCode       车型编码
 * @param carModelName      资源名称
 * @param cutAmount         裁剪片数
 * @param attachmentUuid    附件UUID
 * @param attachmentFileId  版型文件id
 * @param attachmentIds     附件id,多个附件id中间以“,”隔开
 */
export function update(id, brandCode, carTypeCode, productTypeCode, carModelName, cutAmount, attachmentUuid, attachmentFileId, attachmentIds, attachmentCarModelIds) {
  const data = {
    id,
    brandCode,
    carTypeCode,
    productTypeCode,
    carModelName,
    cutAmount,
    attachmentUuid,
    attachmentFileId,
    attachmentIds,
    attachmentCarModelIds
  }
  return request({
    url: '/commerce/admin/carModel/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
/**
 * 根据id批量删除版型资源
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/carModel/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

