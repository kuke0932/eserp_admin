/**
 *
 * @author zhaokaiyuan
 * @create 2018-06-22 13:52
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 公用上传文件
 * @param file
 */
export function upload(file) {
  const data = new FormData()
  data.append('file', file)
  return request({
    url: '/system/admin/file/upload',
    method: 'post',
    timeout: 1000 * 60 * 60,
    headers: {
      'Content-Type': 'multipart/form-data;charset=utf-8'
    },
    data: data
  })
}

/**
 * 删除文件
 *
 * @param id 文件
 */
export function remove(id) {
  const data = {
    id
  }
  return request({
    url: '/system/admin/file/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function uploadLarge(file) {
  const data = new FormData()
  data.append('file', file)
  return request({
    url: process.env.BASE_FILE_SERVER + '/file/largeFile/upload',
    method: 'post',
    timeout: 1000 * 60 * 60,
    headers: {
      'Content-Type': 'multipart/form-data;charset=utf-8'
    },
    data: data
  })
}

/**
 * 删除文件
 *
 * @param id 文件
 */
export function removeLarge(id) {
  const data = {
    id
  }
  return request({
    url: process.env.BASE_FILE_SERVER + '/file/largeFile/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function uploadCarModel(file) {
  const data = new FormData()
  data.append('file', file)
  return request({
    url: process.env.BASE_FILE_SERVER + '/file/carModel/upload',
    method: 'post',
    timeout: 1000 * 60 * 60,
    headers: {
      'Content-Type': 'multipart/form-data;charset=utf-8'
    },
    data: data
  })
}

/**
 * 删除文件
 *
 * @param id 文件
 */
export function removeCarModel(id) {
  const data = {
    id
  }
  return request({
    url: process.env.BASE_FILE_SERVER + '/file/carModel/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}
