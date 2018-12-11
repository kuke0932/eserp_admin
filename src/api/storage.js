/**
 *
 * @author youyajuan
 * @create 2018-07-09 15:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加货位
 *
 * @param onFloor               在货架第几层
 * @param shelfCode             货架编码
 * @param storageLocationCode   库位编码
 */
export function save(shelfCode, storageLocationCode, onFloor) {
  const data = {
    shelfCode,
    storageLocationCode,
    onFloor
  }
  return request({
    url: '/erp/admin/storageLocation/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 查询货位列表
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
    url: '/erp/admin/storageLocation/list',
    method: 'get',
    params: data
  })
}

/**
 *
 * 获取库位详情信息
 *
 * @param id    物料id
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/erp/admin/storageLocation/getInfoById',
    method: 'get',
    params: data
  })
}

/**
 * 修改库位
 *
 * @param id                货架id
 * @param onFloor         在货架第几层
 * @param shelfCode         货架编码
 * @param storageLocationCode 库位编码
 */
export function update(id, onFloor, shelfCode, storageLocationCode) {
  const data = {
    id,
    onFloor,
    shelfCode,
    storageLocationCode
  }
  return request({
    url: '/erp/admin/storageLocation/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json' // DTO实体的时候用
    },
    data: data
  })
}
/**
 * 删除货位
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/storageLocation/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
