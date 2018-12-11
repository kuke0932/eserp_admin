/**
 *
 * @author 黄丽红
 * @create 2018-06-11
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据 id获取仓库信息
 *
 * @param id      仓库编码
 *
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/system/admin/repository/getById',
    method: 'get',
    params: data
  })
}

/**
 * 根据 仓库名称 查询仓库列表信息
 *
 * @param repositoryName      仓库名称
 * @param pageNum             页码
 * @param pageSize            页大小
 */
export function list(repositoryName, pageNum, pageSize) {
  const data = {
    repositoryName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/repository/list',
    method: 'get',
    params: data
  })
}

/**
 * 添加仓库
 *
 * @param repositoryName      仓库名称
 * @param areaType            区域编码
 * @param areaType            排序
 */
export function save(repositoryName, areaType, sort) {
  const data = {
    repositoryName,
    areaType,
    sort
  }
  return request({
    url: '/system/admin/repository/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 修改仓库
 *
 * @param               仓库id
 * @param repositoryName      仓库名称
 */
export function update(id, repositoryName) {
  const data = {
    id,
    repositoryName
  }
  return request({
    url: '/system/admin/repository/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 *
 * 根据id单个/批量 启用、禁用仓库
 *
 * @param ids           仓库id
 * @param enableStatus  仓库状态
 */
export function updateStatus(ids, enableStatus) {
  const data = {
    ids,
    enableStatus
  }
  return request({
    url: '/system/admin/repository/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 *
 * 根据id 删除仓库
 *
 * @param ids           仓库id
 * @param enableStatus  仓库状态
 */
export function remove(ids) {
  const data = {
    ids
  }
  return request({
    url: '/system/admin/repository/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}
