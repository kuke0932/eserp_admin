/**
 *
 * @author youyajuan
 * @create 2018-07-09 15:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加货架
 *
 * @param shelfArea         货架区域
 * @param shelfCode         货架编码
 * @param shelfFloor        货架层数
 */
export function save(shelfArea, shelfCode, shelfFloor) {
  const data = {
    shelfArea,
    shelfCode,
    shelfFloor
  }
  return request({
    url: '/erp/admin/shelf/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 查询货架列表
 * @param shelfCode       货架编码
 * @param pageNum         页码
 * @param pageSize        每页显示的条数
 */
export function list(shelfCode, pageNum, pageSize) {
  const data = {
    shelfCode,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/shelf/list',
    method: 'get',
    params: data
  })
}

/**
 * 查询货架列表
 *
 * @param departmentId    部门Id
 */
export function getShelfSelections(departmentId) {
  const data = {
    departmentId
  }
  return request({
    url: '/erp/admin/shelf/getShelfSelections',
    method: 'get',
    params: data
  })
}

/**
 *获取货架详情信息
 *
 * @param id    物料id
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/erp/admin/shelf/getInfoById',
    method: 'get',
    params: data
  })
}

/**
 * 修改货架
 *
 * @param id                货架id
 * @param shelfArea         货架区域
 * @param shelfCode         货架编码
 * @param shelfFloor        货架层数
 */
export function update(id, shelfArea, shelfCode, shelfFloor) {
  const data = {
    id,
    shelfArea,
    shelfCode,
    shelfFloor
  }
  return request({
    url: '/erp/admin/shelf/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json' // DTO实体的时候用
    },
    data: data
  })
}
/**
 * 删除货架
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/shelf/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
