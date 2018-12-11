/**
 *
 * @author wagnyunlong
 * @create 2018-08-14 10:30
 **/
import request from '@/utils/request'

/**
 * 获得回访统计
 * @param date          日期
 * @param productBrand  产品品牌
 */
export function getVisitCount(date, departmentId) {
  const data = {
    date,
    departmentId
  }
  return request({
    url: '/erp/admin/report/getVisitCount',
    method: 'get',
    params: data
  })
}

/**
 * 获得工人工资统计
 * @param date           日期
 * @param loginName      工人工号
 * @param departmentName 部门名称
 * @param pageNum        页码
 * @param pageSize       页大小
 */
export function listUserSalaryCount(beginDate, endDate, loginName, departmentId, pageNum, pageSize) {
  const data = {
    beginDate,
    endDate,
    loginName,
    departmentId,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/report/listUserSalaryCount',
    method: 'get',
    params: data
  })
}

/**
 * 根据部门类型获取部门列表
 * @param departmentType
 */
export function listDepartments(departmentType) {
  const data = {
    departmentType
  }
  return request({
    url: '/erp/admin/report/listDepartments',
    method: 'get',
    params: data
  })
}

/**
 * 查看详情
 * @param beginDate     开始时间
 * @param endDate       结束时间
 * @param processNo     工序名称
 * @param fb            是否翻边
 * @param produceType   生产类型
 * @param pageNum       页码
 * @param pageSize      页大小
 */
export function listStatisticsDetail(userLoginName, beginDate, endDate, processNo, fb, produceType, pageNum, pageSize) {
  const data = {
    userLoginName,
    beginDate,
    endDate,
    processNo,
    fb,
    produceType,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/report/listStatisticsDetail',
    method: 'get',
    params: data
  })
}

