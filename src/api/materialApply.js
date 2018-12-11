/**
 *
 * @author 黄丽红
 * @create 2018-07-11 8:30
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据 id获取详情
 *
 * @param id      采购申请id
 *
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/erp/admin/materialApply/getById',
    method: 'get',
    params: data
  })
}
/**
 * 采购申请列表（车间主任）
 *
 * @param departmentName    采购人
 * @param status            审核状态
 * @param createTime   申请时间
 * @param pageNum           页码
 * @param pageSize          页大小
 */
export function listDirector(departmentName, status, createTime, pageNum, pageSize) {
  const data = {
    departmentName,
    status,
    createTime,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/materialApply/listDirector',
    method: 'get',
    params: data
  })
}

/**
 * 采购申请列表（车间库管）
 *
 * @param applyName         采购人
 * @param status            审核状态
 * @param createTime   申请时间
 * @param pageNum           页码
 * @param pageSize          页大小
 */
export function listStoreKeeper(applyName, status, createTime, pageNum, pageSize) {
  const data = {
    applyName,
    status,
    createTime,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/materialApply/listStoreKeeper',
    method: 'get',
    params: data
  })
}

/**
 * 采购申请列表（总厂管理层）
 *
 * @param applyName         采购人
 * @param departmentId      所属车间id
 * @param status            审核状态
 * @param createTime   申请时间
 * @param pageNum           页码
 * @param pageSize          页大小
 */
export function listManagement(applyName, departmentId, status, createTime, pageNum, pageSize) {
  const data = {
    applyName,
    departmentId,
    status,
    createTime,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/materialApply/listManagement',
    method: 'get',
    params: data
  })
}

/**
 * 根据 id 单个/批量删除采购申请信息
 *
 * @param ids       采购申请id,多个以,分隔
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/materialApply/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 添加采购单
 *
 * @param materialList          采购详情集合
 */
export function save(materialList) {
  const data = {
    materialList
  }
  return request({
    url: '/erp/admin/materialApply/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 修改采购单
 *
 * @param id                    主键id
 * @param materialList          采购详情集合
 */
export function update(id, materialList) {
  const data = {
    id,
    materialList
  }
  return request({
    url: '/erp/admin/materialApply/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 根据 id 单个/批量启用禁用
 *
 * @param ids       物料id,多个以,分隔
 * @enableStatus   启用禁用状态
 */
export function updateEnableStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/erp/admin/materialApply/updateEnableStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 修改审核状态
 *
 * @param ids       物料id,多个以,分隔
 * @param status    审核状态
 * @param opinion   审核意见
 */
export function updateStatus(ids, status, opinion) {
  const data = {
    ids,
    status,
    opinion
  }
  return request({
    url: '/erp/admin/materialApply/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

