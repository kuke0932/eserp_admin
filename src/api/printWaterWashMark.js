import request from '@/utils/request'

/**
 * 打印快递单水洗标页面列表
 *
 * @param orderNo                  订单编号
 * @param productNo                产品编号
 * @param expressNo                快递单号
 * @param orderTime                下单时间
 * @param productBrand             产品品牌
 * @param orderStatus              订单状态 0.待审核1.待生效2.待打单3.待生产4.生产中裁剪5.生产中拼接6.生产中去边7.生产中包边8.生产中钉扣9.待发货10.已揽件11.在途中12.签收13.问题件14.待回访
 * @param storageMatchedStatus     库存状态 0.不匹配 1.部分匹配 2.完全匹配
 * @param expressPrintStatus              打印状态：0未打印成功，1已打印成功
 * @param pageNum                  页码
 * @param pageSize                 页大小
 *
 */
export function listOrder(orderNo, productNo, expressNo, orderTime, productBrand, orderStatus, storageMatchedStatus, expressPrintStatus, sewnInLabelPrintStatus, pageNum, pageSize) {
  const data = {
    orderNo,
    productNo,
    expressNo,
    orderTime,
    productBrand,
    orderStatus,
    storageMatchedStatus,
    expressPrintStatus,
    sewnInLabelPrintStatus,
    pageNum,
    pageSize
  }
  return request({
    url: '/erp/admin/print/listOrder',
    method: 'get',
    params: data
  })
}

/**
 * 打印快递单
 *
 * @param ids             订单id
 * @param orderNos        订单编号
 * @param isPreview       是否预览：0-否，1-是
 * @param payType         邮费支付方式:1-现付，2-到付，3-月结，4-第三方支付
 * @param printType       打印类型:0-全部打印，1-只打印快递单，2-只打印水洗标
 * @param remark          备注，非必填
 * @param senderMobile    发件人手机号
 * @param senderName      发件人姓名
 * @param shipperCode     快递公司编码 /**
 * 快递公司编码
 * 顺丰（SF）、EMS（EMS）、宅急送（ZJS）、圆通（YTO）、百世快递（HTKY）、中通（ZTO）、
 * 韵达（YD）、申通（STO）、德邦（DBL）、优速（UC）、京东（JD）、信丰（XFEX）、全峰（QFKD）、
 * 跨越速运（KYSY）、安能小包（ANE）、快捷快递（FAST）、国通（GTO）、天天快递（HHTT）、
 * 邮政快递包裹（YZPY）、中铁快运（ZTKY）、邮政国内标快（YZBK）、全一快递（UAPEX）、速尔快递（SURE）
 */
export function printEOrder(ids, orderNos, expressPrintStatus, isPreview, payType, printType, remark, senderMobile, senderName, shipperCode) {
  const data = {
    ids,
    orderNos,
    expressPrintStatus,
    isPreview,
    payType,
    printType,
    remark,
    senderMobile,
    senderName,
    shipperCode
  }
  return request({
    url: '/erp/admin/print/printEOrder?ip=' + window.ip,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: data
  })
}

/**
 * 打印水洗标
 *
 * @param ids 订单id
 */
export function printWater(ids) {
  const data = {
    ids
  }
  return request({
    url: '/erp/admin/print/printWater',
    method: 'get',
    params: data
  })
}
