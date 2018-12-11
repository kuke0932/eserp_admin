/**
 *
 * @author Dragon
 * @create 2018-07-20 15:41
 **/

import request from '@/utils/request'
import qs from 'qs'
/**
 *原材料、辅料、赠品库存查询
 * @param materialProductTypeCode   型号编码
 * @param materialType   物料类型（1原材料，2辅料，3电商产品，4上层材质半成品）
 * @param materialCode   物料编码
 * @param materialName   物料名称
 * @param storageLocationCode   库位编码
 * @param pageNum   页码
 * @param pageSize  页大小
 */

export function listMaterial(materialProductTypeCode, materialType, materialCode, materialName, storageLocationCode, color, pageNum, pageSize) {
  const data = {
    materialProductTypeCode,
    materialType,
    materialCode,
    materialName,
    storageLocationCode,
    color,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/storage/listMaterial',
    method: 'get',
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'indices', allowDots: true })
    }
  })
}
