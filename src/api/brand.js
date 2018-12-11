/**
 *
 * @author zhaokaiyuan
 * @create 2018-06-14 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加车型信息
 *
 * @param id            id
 * @param brandName   车型名称
 * @param brandCode   车型编号
 * @param marketTime    上市时间
 * @param brandUrl    车型图片
 * @param status        状态
 */
export function save(brandCode, brandName, brandIntroduction) {
  const data = {
    brandName,
    brandCode,
    brandIntroduction
  }
  return request({
    url: '/system/admin/brand/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 根据车型名称查询车型列表
 * @param brandName      车型名称
 * @param pageNum          页码
 * @param pageSize         每页显示的条数
 */
export function list(brandCode, brandName, brandIntroduction, pageNum, pageSize = 1 << 30) {
  const data = {
    brandCode,
    brandName,
    brandIntroduction,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/brand/list',
    method: 'get',
    params: data
  })
}

/**
 * 根据id获取车型信息
 *
 * @param id    车型id
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/system/admin/brand/getById',
    method: 'get',
    params: data
  })
}

/**
 * 修改车型信息
 *
 * @param id            id
 * @param brandName   车型名称
 * @param brandCode   车型编号
 * @param marketTime    上市时间
 * @param brandUrl    车型图片
 * @param status        状态
 */
export function update(id, brandCode, brandName, brandIntroduction) {
  const data = {
    id,
    brandName,
    brandCode,
    brandIntroduction
  }
  return request({
    url: '/system/admin/brand/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
/**
 * 删除车型信息
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/system/admin/brand/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
/**
 * 启用禁用
 *
 */
export function updateEnableStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/system/admin/brand/updateEnableStatus',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

