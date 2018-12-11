/**
 *
 * @author 黄丽红
 * @create 2018-06-11
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据 id获取投诉信息
 *
 * @param id      投诉信息id
 *
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/complaint/getById',
    method: 'get',
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
 * 查询投诉管理列表
 *
 * @param nickname          投诉人姓名
 * @param telephone         投诉人手机号
 * @param status            处理状态
 * @param complaintSource   投诉类型
 * @param complaintItem     投诉对象
 * @param complaintContent  投诉内容
 * @param pageNum           页码
 * @param pageSize          页大小
 */
export function list(nickname, telephone, status, complaintSource, complaintItem, complaintContent, pageNum, pageSize) {
  const data = {
    nickname,
    telephone,
    status,
    complaintSource,
    complaintItem,
    complaintContent,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/complaint/list',
    method: 'get',
    params: data
  })
}

/**
 * 根据 id 单个/批量投诉信息
 *
 * @param ids       投诉信息id,多个用户以,分隔
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/complaint/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 添加投诉信息
 *
 * @param attachmentIds      图片id,多个以，分隔
 * @param complaintContent   投诉内容
 * @param complaintItem      投诉对象
 * @param complaintSource    投诉类型
 * @param nickname           投诉人姓名
 * @param telephone          投诉人手机号
 */
export function save(attachmentIds, complaintContent, complaintItem, complaintSource, nickname, telephone) {
  const data = {
    attachmentIds,
    complaintContent,
    complaintItem,
    complaintSource,
    nickname,
    telephone
  }
  return request({
    url: '/commerce/admin/complaint/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 修改投诉信息
 *
 * @param attachmentIds
 * @param complaintContent
 * @param complaintItem
 * @param complaintSource
 * @param id
 * @param nickname
 * @param telephone
 */
export function update(id, attachmentUuid, nickname, telephone, complaintSource, complaintItem, complaintContent, attachmentIds) {
  const data = {
    attachmentIds,
    complaintContent,
    complaintItem,
    complaintSource,
    id,
    nickname,
    telephone,
    attachmentUuid
  }
  return request({
    url: '/commerce/admin/complaint/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 *
 * 根据id单个/批量 处理投诉
 *
 * @param ids           投诉id，多个用户以,分隔
 * @param operateResult  处理结果
 */
export function updateResult(ids, operateResult) {
  const data = {
    ids,
    operateResult
  }
  return request({
    url: '/commerce/admin/complaint/updateResult',
    method: 'post',
    data: qs.stringify(data)
  })
}
