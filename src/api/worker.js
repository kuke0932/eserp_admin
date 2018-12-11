
import request from '@/utils/request'
// import qs from 'qs'

/**
 * 人工列表
 * @param loginName  工号
 * @param userName   姓名
 * @param departmentId   部门id
 * @param pageNum    页码
 * @param pageSize   页大小
 *
 * */

export function list(userName, loginName, departmentId, pageNum, pageSize = 1 << 30) {
  const data = {
    userName,
    loginName,
    departmentId,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/worker/list',
    method: 'get',
    params: data
  })
}

/**
 * 获取工人工序
 * @param loginName
 *
 * */
export function getProcess(loginName) {
  const data = {
    loginName
  }
  return request({
    url: '/erp/admin/worker/getProcess',
    method: 'get',
    params: data
  })
}

/**
 * 设置工序
 * @param loginName   工号
 * @param processCodes    工序代码
 *
 * */
export function setProcess(loginName, processCodes) {
  const data = {
    loginName,
    processCodes
  }
  return request({
    url: '/erp/admin/worker/setProcess',
    method: 'post',
    params: data
  })
}

/**
 * 获得工序列表
 *
 * */
export function listProcess(name, pageNum, pageSize = 1 << 30) {
  const data = {
    name,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/worker/listProcess',
    method: 'get',
    params: data
  })
}

/**
 * 可工作的工人列表
 *
 *
 * */
export function listEnableWorker() {
  return request({
    url: '/erp/admin/worker/listEnableWorker',
    method: 'get'
  })
}

/**
 * 启用和禁用
 * @param ids   工序id
 * @param enableStatus   启用禁用状态
 *
 * */
export function updateEnableStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/erp/admin/worker/updateEnableStatus',
    method: 'post',
    params: data
  })
}

