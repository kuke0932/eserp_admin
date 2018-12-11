import request from '@/utils/request'
import qs from 'qs'

/**
 * 开始裁剪
 *
 * @param orderNo                  订单编号
 * @param productNo                产品编号
 * @param materialId               物料id
 *
 */
export function startTailor(orderNo, productNo, materialId) {
  const data = {
    orderNo,
    productNo,
    materialId
  }
  return request({
    url: '/erp/admin/tailor/startTailor',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 结束裁剪
 *
 * @param id              产品工序关联表id
 */
export function endTailor(orderNo, productNo, id) {
  const data = {
    orderNo,
    productNo,
    id
  }
  return request({
    url: '/erp/admin/tailor/endTailor',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 扫描快递单二维码或者产品二维码活快递单条形码
 *
 * @param code              订单编号/产品编号/快递单号
 */
export function getOrderByScan(code, layer) {
  const data = {
    code,
    layer
  }
  return request({
    url: '/erp/admin/tailor/getOrderByScan',
    method: 'get',
    params: data
  })
}

/**
 * 扫描快递单二维码或者产品二维码活快递单条形码
 *
 * @param code              订单编号/产品编号/快递单号
 */
export function getLayerByMaterialId(productNo, materialId) {
  const data = {
    productNo,
    materialId
  }
  return request({
    url: '/erp/admin/tailor/getLayerByMaterialId',
    method: 'get',
    params: data
  })
}
