/**
 *
 * @author youyajuan
 * @create 2018-06-5 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加车型信息
 *
 * @param id           车型id
 * @param newCarBrand  品牌
 * @param newCarName   车型名称
 * @param marketTime   上市时间
 */
export function save(id, newCarBrand, newCarName, marketTime) {
  const data = {
    id,
    newCarBrand,
    newCarName,
    marketTime
  }
  return request({
    url: '/commerce/admin/newCar/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 查询新车信息列表
 * @param marketTime    上市时间
 * @param newCarBrand   新车品牌
 * @param newCarName    车型名称
 * @param newCarLink    链接
 * @param newCarSource  新车导入类型
 * @param createName    创建者
 * @param createTime    创建时间
 * @param pageNum       页码
 * @param pageSize      每页显示的条数
 */
export function list(marketTime, newCarBrand, newCarName, newCarSource, pageNum, pageSize) {
  const data = {
    marketTime,
    newCarBrand,
    newCarName,
    newCarSource,
    pageNum,
    pageSize
  }
  return request({
    // url: '/commerce/admin/newCar/list?pageNum=' + pageNum + '&pageSize=' + pageSize,
    url: '/commerce/admin/newCar/list',
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    },
    params: data
  })
}

/**
 * 获取新车详情
 *
 * @param id    车型id
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/newCar/getInfoById',
    method: 'get',
    params: data
  })
}

/**
 * 修改新车信息
 *
 * @param id           车型id
 * @param newCarBrand  品牌
 * @param newCarName   车型名称
 * @param marketTime   上市时间
 */
export function update(id, newCarBrand, newCarName, marketTime) {
  const data = {
    id,
    newCarBrand,
    newCarName,
    marketTime
  }
  return request({
    url: '/commerce/admin/newCar/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
/**
 * 删除新车信息
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/newCar/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
