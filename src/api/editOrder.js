/**
 *
 * @author youyajuan
 * @create 2018-06-5 11:40
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
/**
 * 根据订单id获取订单详情
 *
 * @param id    id
 */
export function getById(id) {
  const data = {
    id
  }
  return request({
    url: '/commerce/admin/order/getById',
    method: 'get',
    params: data
  })
}

/**
 * 修改订单
 *
 * @param eserpOrder          参数对象
 * {
 *  orderId             订单id
 *  productId           产品id
 *  customerId          客户id
 *  customerAddressId   客户收货地址id
 *  outerOrderNo        淘宝订单号
 *  productBrand        产品品牌
 *  brandName           汽车品牌
 *  brandCode           汽车品牌编码
 *  carType             车型
 *  carTypeCode         车型编码
 *  topColor            上层材质颜色
 *  topColorCode        上层材质颜色编码
 *  bottomColor         下层材质颜色
 *  bottomColorCode     下层材质颜色编码
 *  productType         产品型号
 *  productTypeCode     产品型号编码
 *  saleRemark          销售备注
 *  priority            优先级
 *  orderTime           下单时间
 *  taobaoNickName      淘宝昵称
 *  taobaoAccount       淘宝会员名
 *  taobaoTelephone     淘宝手机号
 *  name                客户真实姓名
 *  addressee           收件人姓名
 *  telephone           收件人联系方式
 *  province            收件人省份
 *  city                收件人城市
 *  county              收件人县
 *  street              收件人街道
 *  postcode            邮政编码
 *  expressCompanyCode  快递公司编码
 *  departmentId        生产车间id
 *  }
 */
export function update(eserpOrder) {
  return request({
    url: '/commerce/admin/order/update',
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    data: eserpOrder
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
    data: data // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。
  })
}
