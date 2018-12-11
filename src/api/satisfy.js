/**
 *
 * @author youyajuan
 * @create 2018-06-5 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加需求信息
 *
 * @param id             需求id
 * @param contactWay     联系方式
 * @param demandContent  需求内容
 * @param demandName     需求名称
 * @param demandTime     需求提出时间
 * @param presenterName  提出者
 */
export function save(id, contactWay, demandContent, demandName, demandTime, presenterName) {
  const data = {
    id,
    contactWay,
    demandContent,
    demandName,
    demandTime,
    presenterName
  }
  return request({
    url: '/commerce/admin/demand/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 查询需求维护信息
 * @param presenterName    提出者
 * @param contactWay       联系方式
 * @param demandName       需求名称
 * @param demandContent    需求内容
 * @param demandTime       需求提出时间
 * @param demandStatus     需求状态
 * @param createName       创建者名字
 * @param createTime       创建时间
 * @param pageNum          页码
 * @param pageSize         每页显示的条数
 */
export function list(demandName, demandContent, pageNum, pageSize) {
  const data = {
    demandName,
    demandContent,
    pageNum,
    pageSize
  }
  return request({
    url: '/commerce/admin/demand/list',
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    },
    params: data
  })
}

/**
 * 获取需求详情信息
 *
 * @param id    车型id
 */
export function getInfoById(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/demand/getInfoById',
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    },
    params: data
  })
}

/**
 * 修改需求信息
 *
 * @param id            需求id
 * @param contactWay    联系方式
 * @param demandContent 需求内容
 * @param demandName    需求名称
 * @param demandTime    需求提出时间
 * @param presenterName 提出者
 */
export function update(id, contactWay, demandContent, demandName, demandTime, presenterName) {
  const data = {
    id,
    contactWay,
    demandContent,
    demandName,
    demandTime,
    presenterName
  }
  return request({
    url: '/commerce/admin/demand/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
/**
 * 删除需求信息
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/demand/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
/**
 * 满足状态判断
 *
 */
export function satisfy(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/demand/satisfy',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
