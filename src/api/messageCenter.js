/**
 *
 * @author Liuchaoqun
 * @create 2018-06-11
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 *
 * @param messageType   消息类型
 * @param readed        是否已读
 * @param pageNum       页码
 * @param pageSize      页大小
 */
export function list(messageType, readed, pageNum, pageSize) {
  const data = {
    messageType,
    readed,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/message/list',
    method: 'get',
    params: data
  })
}

/**
 *
 * 根据id 已读
 *
 * @param ids           单位id
 */
export function read(ids) {
  const data = {
    ids
  }
  return request({
    url: '/system/admin/message/read',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 *  全部已读
 *
 */
export function readAll() {
  return request({
    url: '/system/admin/message/readAll',
    method: 'post'
  })
}

/**
 *  重置
 *
 */
export function resetData() {
  return request({
    url: '/system/admin/message/resetData',
    method: 'get'
  })
}
