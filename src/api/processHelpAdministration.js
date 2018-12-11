/**
 *
 * @author 黄丽红
 * @create 2018-01-15 13:52
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据 id获取详情
 *
 * @param id      工序id
 *
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/erp/admin/processCarHelp/getById',
    method: 'get',
    params: data
  })
}

/**
 * 车型工序帮助列表
 *
 * @param processCode       工序编码
 * @param carBrandCode      品牌编码
 * @param carTypeCode       车型编码
 * @param pageNum           页码
 * @param pageSize          页大小
 */
export function list(processCode, carBrandCode, carTypeCode, pageNum, pageSize) {
  const data = {
    processCode,
    carBrandCode,
    carTypeCode,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/processCarHelp/list',
    method: 'get',
    params: data
  })
}

/**
 * 添加车型工序帮助
 *
 * @param processCode                  工序编码
 * @param carBrandCode                 品牌编码
 * @param carTypeCode                  车型编码
 * @param helpContent                      帮助内容
 */
export function save(processCode, carBrandCode, carTypeCode, helpContent) {
  const data = {
    processCode,
    carBrandCode,
    carTypeCode,
    helpContent
  }
  return request({
    url: '/erp/admin/processCarHelp/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 修改车型工序帮助
 *
 * @param id                    工序
 * @param processCode           工序编码
 * @param carBrandCode          品牌编码
 * @param carTypeCode           车型编码
 * @param helpContent               帮助内容
 */
export function update(id, processCode, carBrandCode, carTypeCode, helpContent) {
  const data = {
    id,
    processCode,
    carBrandCode,
    carTypeCode,
    helpContent
  }
  return request({
    url: '/erp/admin/processCarHelp/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 根据 id 单个/批量删除工序帮助
 *
 * @param ids       工序id,多个以,分隔
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/processCarHelp/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据 id 单个/批量启用禁用工序帮助
 *
 * @param ids       工序id,多个以,分隔
 * @param enableStatus   启用禁用状态
 */
export function updateEnableStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/erp/admin/processCarHelp/updateEnableStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
