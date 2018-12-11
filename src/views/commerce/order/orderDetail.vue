<template>
  <div class="container" style="height: auto;">
    <h3>订单信息</h3>
    <el-row :gutter="20" style="margin-left: 10px;">
      <div style="min-width: 20%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">淘宝订单编号：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.orderDetail.outerOrderNo}}</div></el-col>
      </div>
      <div style="min-width: 30%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">订单编号：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.orderDetail.orderNo}}</div></el-col>
      </div>
      <div style="min-width: 20%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">品牌：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.orderDetail.productBrand}}</div></el-col>
      </div>
    </el-row>
    <el-row :gutter="20" style="margin-left: 10px;">
      <div style="min-width: 20%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">优先级：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.orderDetail.priority == 3 ? '正常' : '加急'}}</div></el-col>
      </div>
      <div style="min-width: 30%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">下单日期：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.orderDetail.orderTime}}</div></el-col>
      </div>
      <div style="min-width: 30%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">修改日期：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.orderDetail.updateTime}}</div></el-col>
      </div>
    </el-row>
    <el-row :gutter="20" style="margin-left: 10px;">
      <div style="width:80%; float:left;">
        <el-col :span="3"><div class="grid-title">订单内容：</div></el-col>
        <el-col :span="13"><div class="grid-content bg-purple">{{this.orderDetail.orderContent}}</div></el-col>
      </div>
    </el-row>

    <h3>收件信息</h3>
    <el-row :gutter="20" style="margin-left: 10px;">
      <div style="min-width: 20%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">快递单号：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.orderDetail.expressNo}}</div></el-col>
      </div>
      <div style="min-width: 20%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">快递公司：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.orderDetail.expressCompany}}</div></el-col>
      </div>
      <div style="min-width: 20%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">收件人：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.eserpAddressDetailVO.name}}</div></el-col>
      </div>
      <div style="min-width: 20%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">联系方式：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.eserpAddressDetailVO.telephone}}</div></el-col>
      </div>
    </el-row>
    <el-row :gutter="20" style="margin-left: 10px;">
      <div style="min-width: 20%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">邮政编码：</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{this.eserpAddressDetailVO.postcode}}</div></el-col>
      </div>
      <div style="min-width: 40%; width:auto;float:left;">
        <el-col :span="3"><div class="grid-title">收货地址：</div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple">{{this.eserpAddressDetailVO.address}}</div></el-col>
      </div>

    </el-row>

    <h3>商品信息</h3>
    <el-row :gutter="20" style="margin-left: 10px; margin-right: 0; border: 1px solid  #fff;">
      <el-table style="width: 100%;"
        :data="productList"
        v-loading.body="listLoading"
        ref="productList"
        element-loading-text="拼命加载中"
        border
        tooltip-effect="dark"
        highlight-current-row>

        <el-table-column label="产品名称">
          <template slot-scope="scope">
            {{scope.row.content}}
          </template>
        </el-table-column>
        <el-table-column label="产品编码">
          <template slot-scope="scope">
            {{scope.row.productNo}}
          </template>
        </el-table-column>
        <el-table-column label="销售备注">
          <template slot-scope="scope">
            {{scope.row.saleRemark}}
          </template>
        </el-table-column>
        <el-table-column label="出入库记录">
          <template slot-scope="scope">
            <div v-for="item in scope.row.eserpProductStorageInOutVOList" class="divRecord">
              {{item.createTime}}&nbsp;&nbsp;<span v-html="item.content"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="换货记录">
          <template slot-scope="scope">
            <div v-for="item in scope.row.eserpRefundVOList" class="divRecord">
              {{item.updateTime}}&nbsp;&nbsp;<span v-html="item.statusContent"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="维修记录">
          <template slot-scope="scope">
            <!--{{scope.row.eserpRepairRecordSimpleVOList}}-->
            <div v-for="item in scope.row.eserpRepairRecordSimpleVOList" class="divRecord">
              {{item.updateTime}}&nbsp;&nbsp;<span v-html="item.statusContent"></span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <div class="orderLeft">
      <div class="div-f">
        <h3>订单状态</h3>
        <el-row :gutter="20" style="margin-left: 10px;">
          <el-col :span="3"><div class="grid-title">订单状态：</div></el-col>
          <el-col :span="9"><div class="grid-content bg-purple">{{orderStatusInDetail}}</div></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-left: 10px;">
          <el-col :span="3"><div class="grid-title" style="padding-top: 5px">历史状态：</div></el-col>
          <el-col :span="17">
            <div class="grid-content bg-purple"  style="float: left; height: auto; line-height: 30px">
              <!--{{this.eserpOrderStatusSimpleVO.track}}-->
              <div v-for="item in track">
                {{item.updateTime}}&nbsp;&nbsp;{{item.content}}<br />
                <div v-for="items in item.childrenStatusList" style="margin-left: 20px;">
                  {{items.updateTime}}&nbsp;&nbsp;{{items.content}}<br />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="orderLeft" style="float: right;">
      <div class="div-f">
        <h3>回访记录</h3>
        <el-row :gutter="20" style="margin-left: 10px;">
          <el-col :span="3"><div class="grid-title">回访时间：</div></el-col>
          <el-col :span="9"><div class="grid-content bg-purple">{{this.orderDetail.visitTime}}</div></el-col>
        </el-row>
        <el-row :gutter="20" style="margin-left: 10px;">
          <el-col :span="3"><div class="grid-title" style="padding-top: 5px">回访结果：</div></el-col>
          <el-col :span="17">
            <div class="grid-content bg-purple"  style="float: left; height: auto; line-height: 30px">{{this.orderDetail.visitResult}}</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>


</template>

<script>
  import { getInfoByOrderId } from '@/api/orderDetail'
  import { parseTime } from '@/filters'

  export default {
    name: 'orderDetail',
    data() {
      return {
        id: null,
        listLoading: false,
        productList: [],
        orderDetail: {},
        eserpAddressDetailVO: {},
        eserpOrderStatusSimpleVO: {},
        track: [],
        orderStatusInDetail: '',
        orderStatus: [
          // 0.待审核1.待生效2.待打单3.待生产4.生产中裁剪5.生产中拼接6.生产中去边
          // 7.生产中包边8.生产中钉扣9.待发货10.已揽件11.在途中12.签收13.问题件14.待回访15.已取消
          '待审核',
          '待生效',
          '待打单',
          '待生产',
          '生产中裁剪',
          '生产中拼接',
          '生产中去边',
          '生产中包边',
          '生产中钉扣',
          '待发货',
          '已揽件',
          '在途中',
          '已签收',
          '问题件',
          '待回访',
          '已取消'
        ],
        subStatus: [
          '生产中',
          '裁剪开始',
          '裁剪结束',
          '拼接开始',
          '拼接结束',
          '去边开始',
          '去边结束',
          '包边开始',
          '包边结束',
          '钉扣开始',
          '钉扣结束'
        ]
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.fetchData(to.query.id)
      next()
    },
    mounted() {
      // authMenuButton(location.hash.substring(2))
      this.id = this.$route.query.id
      if (this.id) {
        this.fetchData(this.id)
      } else {
        this.$router.push({ path: '/commerce/order/index' })
      }
    },
    methods: {
      /* 初始化订单 */
      fetchData(id) {
        this.listLoading = true
        getInfoByOrderId(
          id
        ).then(response => {
          this.orderDetail = response.data.data
          this.productList = response.data.data.productDetailVOList
          this.eserpOrderStatusSimpleVO = response.data.data.eserpOrderStatusSimpleVO
          this.eserpAddressDetailVO = response.data.data.eserpAddressDetailVO
          const track = JSON.parse(this.eserpOrderStatusSimpleVO.track)
          track.forEach(v => {
            v.updateTime = parseTime(v.updateTime)
          })
          this.track = track
          const a = this.eserpOrderStatusSimpleVO.orderMainStatus
          if (a === 4) {
            this.orderStatusInDetail = this.subStatus[this.eserpOrderStatusSimpleVO.subStatus]
          } else {
            this.orderStatusInDetail = this.orderStatus[a]
          }
          this.listLoading = false
          this.initOrderContent()
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 将产品内容组合到一起 */
      initOrderContent() {
        this.orderDetail.orderContent = ''
        this.productList.forEach(v => {
          this.orderDetail.orderContent += v.content + ';'
        })
      }
    }
  }
</script>

<style>
  .el-row {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 15px;
  }
  .el-row:last-child {
     margin-bottom: 0;
   }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    width: auto;
    /*background: #d3dce6;*/
    background: none;
    float: left;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    height: 26px;
    line-height: 18px;
    font-size: 14px;
    float: left;
    height: auto;
  }
  .grid-title{
    border-radius: 4px;
    height: 26px;
    line-height: 18px;
    /*background: #d3dce6;*/
    background: none;
    float: left;
    text-align: right;
    font-size: 14px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .orderLeft{
    width: 49.5%;
    float: left;
    height: auto;
  }
  .div-f{
    float: left;
    width: 100%;
    height: auto;
  }
  .container {
    margin: 30px;
  }
  .el-col-3{
    width: auto;
  }
  .el-col-5{
    width: auto;
  }

  h3{
    margin: 20px 0 15px;
    height: 40px;
    line-height: 44px;
    background: #f9f9f9;
    font-size: 16px;
    font-weight: bold;
    text-indent: 14px;
  }

  .divRecord{
    padding: 5px;
    overflow: hidden;
  }
</style>
