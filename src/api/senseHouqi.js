/**
 *
 * @author youyajuan
 * @create 2018-06-14 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加资源
 *
 * @param type             资源类别 0.新品 1.旧图修改
 * @param name             资源名称
 * @param code             下载密码
 * @param attachmentIds    附件id,多个附件id中间以“,”隔开
 */
export function save(type, name, code, attachmentIds) {
  const data = {
    type,
    name,
    code,
    attachmentIds,
    resourceType: 2
  }
  return request({
    url: '/commerce/admin/resource/save',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}

/**
 * 获取资源列表
 * @param name           资源名
 * @param auditStatus    审核状态 0.已保存 1.待审核 2.审核通过 3.审核未通过
 * @param type           资源类别 0.新品 1.旧图修改
 * @param pageNum        页码
 * @param pageSize       每页显示的条数
 */
export function list(name, auditStatus, type, pageNum, pageSize) {
  const data = {
    name,
    auditStatus,
    type,
    pageNum,
    pageSize,
    resourceType: 2
  }
  return request({
    url: '/commerce/admin/resource/list',
    method: 'get',
    params: data
  })
}

/**
 *
 * 根据id获取资源详情
 *
 * @param id    车型id
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/resource/getById',
    method: 'get',
    params: data
  })
}
/**
 * 根据 uuid获取url集合
 *
 * @param attachmentUuid      uuid
 *
 */
export function getByUuid(attachmentUuid) {
  const data = {
    attachmentUuid
  }
  return request({
    url: '/commerce/admin/complaint/getByUuid',
    method: 'get',
    params: data
  })
}
/**
 * 修改资源
 *
 * @param id                id
 * @param type             资源类别 0.新品 1.旧图修改
 * @param name             资源名称
 * @param code             下载密码
 * @param attachmentIds    附件id,多个附件id中间以“,”隔开
 * @param attachmentUuid   附件UUID，新增时不需要传值
 */
export function update(id, type, name, code, attachmentIds, attachmentUuid) {
  const data = {
    id,
    type,
    name,
    code,
    attachmentIds,
    attachmentUuid,
    resourceType: 2
  }
  return request({
    url: '/commerce/admin/resource/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
/**
 * 修改审核状态（提交审核，撤销审核，审核通过，审核不通过）
 *
 * @param auditStatusList 资源审核状态参数集合
 *
 * id 资源id
 * fromStatus 审核状态 0.已保存 1.待审核 2.审核通过 3.审核未通过
 * auditStatus 审核状态 0.已保存 1.待审核 2.审核通过 3.审核未通过
 * reason 审核原因
 */
export function updateAuditStatus(auditStatusList) {
  const data = {
    auditStatusList
  }
  return request({
    url: '/commerce/admin/resource/updateAuditStatus',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: data
  })
}
/**
 * 删除资源
 *
 * @param ids 车型id，多个id中间以，隔开
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/commerce/admin/resource/remove',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}

/**
 * 验证下载密码是否正确
 *
 * @param id 资源id
 * @param code 密码
 */
export function checkDownloadCode(id, code) {
  const data = {
    id,
    code
  }
  return request({
    url: '/commerce/admin/resource/checkDownloadCode',
    method: 'post',
    data: qs.stringify(data) // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
