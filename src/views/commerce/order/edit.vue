<template>
  <div class="container"
       v-loading="listLoading"
       :element-loading-text="textLoading">
    <!--修改对话框-->
    <el-form ref="editForm" :rules="rules" :model="editForm" label-width="118px" :inline="true">
      <!--订单信息-->
      <div class="orderDetail">
        <h2 class="titleInfo">订单信息</h2>
        <el-row style="padding-left: 25px; border-bottom: 0; padding-top: 20px;">
          <el-form-item label="订单编号" prop="orderNo" label-width="100px" style="min-width: 0;margin-right: 28px;">
            <el-input clearable style="width: 300px;" v-model="editForm.orderNo"></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="productBrand" label-width="100px" style="min-width: 0;margin-right: 28px;">
            <el-select style="width: 300px;" v-model="editForm.productBrand" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in productBrandOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产车间" prop="departmentId" label-width="100px" style="min-width: 0;margin-right: 28px;">
            <el-select style="width: 250px;" v-model="editForm.departmentId" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in options8"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="下单时间" prop="orderTime" label-width="100px" style="min-width: 0;margin-right: 28px;">
            <el-date-picker
              style="width: 300px"
              v-model="editForm.orderTime"
              type="datetime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择下单时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="付款时间" prop="orderTime" label-width="100px" style="min-width: 0;margin-right: 28px;">
            <el-date-picker
              style="width: 300px"
              v-model="editForm.payTime"
              type="datetime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择付款时间">
            </el-date-picker>
          </el-form-item>
          <br />
          <el-form-item label="订单内容" prop="orderContent" label-width="100px" style="min-width: 0;margin-right: 28px;">
            <el-input clearable
              type="textarea"
              :rows="2"
              :disabled="true"
              style="width: 1120px;"
              v-model="editForm.orderContent">
            </el-input>
          </el-form-item>
          <br />
          <el-form-item label="销售备注" prop="saleRemark" label-width="100px" style="min-width: 0;margin-right: 28px;">
            <el-input clearable
              type="textarea"
              :rows="2"
              placeholder="请输入销售备注"
              style="width: 1120px;"
              v-model="editForm.saleRemark">
            </el-input>
          </el-form-item>
        </el-row>
      </div>
      <!--收件信息-->
      <div class="consignee">
        <h2 class="titleInfo">收件信息</h2>
        <el-row style="padding-left: 25px; border-bottom: 0; padding-top: 20px;">
          <el-form-item label="收件人" prop="name" label-width="70px" style="min-width: 0;margin-right: 28px;">
            <el-input clearable style="width: 200px;" v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="telephone" label-width="80px" style="min-width: 0;margin-right: 28px;">
            <el-input clearable style="width: 200px;" v-model="editForm.telephone"></el-input>
          </el-form-item>
          <el-form-item label="邮政编码" prop="postcode" label-width="80px" style="min-width: 0;margin-right: 28px;">
            <el-input clearable style="width: 200px;" v-model="editForm.postcode"></el-input>
          </el-form-item>
          <el-form-item label="淘宝会员名" label-width="90px" style="min-width: 0;margin-right: 28px;">
            <el-input clearable style="width: 220px;" v-model="editForm.taoBaoAccount"></el-input>
          </el-form-item>
          <br />
          <el-form-item class="address" label="收件人省市县" label-width="120px" prop="province" style="margin-right: 2px;min-width: 0; width: 260px;">
            <el-select style="width: 140px;" v-model="editForm.province" placeholder="请选择省" @change="provinceChange" filterable>
              <el-option
                v-for="item in provinceOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="city" style="margin-right: 2px;min-width: 0; width: 140px;">
            <el-select style="width: 140px;" v-model="editForm.city" placeholder="请选择市" @change="cityChange" filterable>
              <el-option
                v-for="item in cityOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="county" style="">
            <el-select style="width: 140px;" v-model="editForm.county" placeholder="请选择区" @change="countyChange" filterable>
              <el-option
                v-for="item in countyOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="收件人街道地址" label-width="120px" prop="street">
            <el-input clearable v-model="editForm.street" style="width: 434px;"></el-input>
          </el-form-item>
        </el-row>
      </div>

      <h2 class="titleInfo">产品详情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span @click="addMat" plain>添加脚垫</span>&nbsp;&nbsp;<span @click="addGood" plain>添加淘宝产品</span></h2>

      <div class="orderDetail" style="border: 1px solid  #e6e6e6;padding-bottom: 30px;">
        <div style="width: 95%;margin: 0 auto;border-bottom: 1px dashed  #e6e6e6; overflow: hidden;">
          <template v-for="(product, index) in editForm.list" v-if="product.matOrNot == 1">
            <h6 class="titleInfo2">产品编号：{{product.productNo}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;产品内容：{{product.content}}</h6>
            <el-button type="danger" @click="deleteGood(product, index)">刪除</el-button>
            <el-form-item class="tableFormItem2" style="float: left;width: 220px;min-width: 0;" label="汽车品牌" label-width="78px" :prop="'list.' + index + '.brandCode'" :rules="{ required: true, message: '汽车品牌不能为空', trigger: 'change'}">
              <el-select v-model="product.brandCode" placeholder="请选择" style="width: 100px;" @change="getCarType(product.brandCode, index, product.matOrNot)" clearable filterable>
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="tableFormItem2" style="float: left;width: 150px;min-width: 0;" label="车型" label-width="50px" :prop="'list.' + index + '.carTypeCode'":rules="{ required: true, message: '车型不能为空', trigger: 'change'}" >
              <el-select v-model="product.carTypeCode" placeholder="请选择" @change="carTypeChange(product.carTypeCode, index, product.matOrNot)" clearable filterable>
                <el-option
                  v-for="item in product.options"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="tableFormItem2 tableFormItem22" :prop="'list.' + index + '.carDesc'" :rules="{ required: true, message: '请填写车型描述', trigger: 'blur'}" style="float: left; margin-right: 30px; width: 150px;" label-width="0px">
              <el-input v-model="product.carDesc" @blur="carDescChange(product.carTypeCode, index, product.matOrNot)"/>
            </el-form-item>
            <el-form-item class="tableFormItem2" style="float: left;width: 220px;min-width: 0;" label="产品型号" label-width="78px" :prop="'list.' + index + '.productTypeCode'" :rules="{ required: true, message: '产品型号不能为空', trigger: 'change'}">
              <el-select v-model="product.productTypeCode" placeholder="请选择" @change="productTypeChange(product.productTypeCode, index, product.matOrNot)" clearable filterable>
                <el-option
                  v-for="item in options3"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="tableFormItem2 tableFormItem22" :prop="'list.' + index + '.produceType'" :rules="{ required: true, pattern: /^[0-1]{5}$/, message: '请填写正确的产品生产类型', trigger: 'blur'}" style="float: left; margin-right: 30px; width: 150px;" label-width="0px">
              <el-input v-model="product.produceType" @blur="produceTypeChange(product.produceType, index, product.matOrNot)"/>
            </el-form-item>
            <el-form-item class="tableFormItem2" style="float: left;width: 220px;min-width: 0;" label="下层材质颜色" label-width="106px" :prop="'list.' + index + '.bottomColorCode'" :rules="{ required: true, message: '下层材质颜色不能为空', trigger: 'change'}">
              <el-select v-model="product.bottomColorCode" placeholder="请选择" @change="bottomColorChange(product.bottomColorCode, index, product.matOrNot)" clearable filterable>
                <el-option
                  v-for="item in options5"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="tableFormItem2" style="float: left;width: 220px;min-width: 0;" label="上层材质颜色" label-width="96px">
              <el-select v-model="product.topColorCode" placeholder="请选择" @change="topColorChange(product.topColorCode, index, product.matOrNot)" clearable filterable>
                <el-option
                  v-for="item in options4"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </div>

        <div style="width: 95%;margin: 0 auto;border-bottom: 1px dashed  #e6e6e6; overflow: hidden;" v-for="(product, index) in editForm.list" v-if="product.matOrNot == 2">
          <template>
            <h6 class="titleInfo2">产品编号：{{product.productNo}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;产品内容：{{product.content}}</h6>
            <el-button type="danger" @click="deleteGood(product, index)">刪除</el-button>
            <el-form-item class="tableFormItem2" style="float: left;width: 220px;min-width: 0;" label="汽车品牌" label-width="78px" :prop="'list.' + index + '.brandCode'" :rules="{ required: true, message: '汽车品牌不能为空', trigger: 'change'}">
              <el-select v-model="product.brandCode" placeholder="请选择" @change="getCarType(product.brandCode, index, product.matOrNot)" clearable filterable>
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="tableFormItem2" style="float: left;width: 150px;min-width: 0;" label="车型" label-width="50px" :prop="'list.' + index + '.carTypeCode'" :rules="{ required: true, message: '车型不能为空', trigger: 'change'}">
              <el-select v-model="product.carTypeCode" placeholder="请选择" @change="carTypeChange(product.carTypeCode, index, product.matOrNot)" clearable filterable>
                <el-option
                  v-for="item in product.options"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="tableFormItem2 tableFormItem22" :prop="'list.' + index + '.carDesc'" :rules="{ required: true, message: '请填写车型描述', trigger: 'blur'}" style="float: left; margin-right: 30px; width: 150px;" label-width="0px">
              <el-input v-model="product.carDesc" @blur="carDescChange(product.carTypeCode, index, product.matOrNot)"/>
            </el-form-item>
            <el-form-item class="tableFormItem2" style="float: left;width: 220px;min-width: 0;" label="产品型号" label-width="78px" :prop="'list.' + index + '.productTypeCode'" :rules="{ required: true, message: '产品型号不能为空', trigger: 'change'}">
              <el-select v-model="product.productTypeCode" placeholder="请选择" @change="productTypeChange(product.productTypeCode, index, product.matOrNot)" clearable filterable>
                <el-option
                  v-for="item in taoBaoGoods"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </div>
      </div>

      <div class="submit" style="float: left; width: 100%; text-align: center;padding-top: 20px;">
        <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
        <el-button @click="resetForm('editForm')">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { listAllSelection, listCarTypeByBrandCode } from '@/api/addOrder'
  import { update, getById } from '@/api/editOrder'
  import { tree } from '@/api/area'
  export default {
    name: 'orderEdit',
    data() {
      return {
        listLoading: false,
        textLoading: '拼命加载中...',
        submitLoading: false,
        id: null,
        // 产品品牌
        productBrandOption: [{
          label: '张氏',
          value: '张氏'
        }, {
          label: '澳狄达斯',
          value: '澳狄达斯'
        }, {
          label: '宝致',
          value: '宝致'
        }],
        // 汽车品牌
        options: [],
        // 车型
        options2: [],
        // 产品型号
        options3: [],
        // 上层材质颜色
        options4: [],
        // 下层材质颜色
        options5: [],
        // 生产车间
        options8: [],
        // 淘宝商品下拉列表
        taoBaoGoods: [],
        // 全部区域
        area: [],
        // 省
        provinceOptions: [],
        // 市
        cityOptions: [],
        // 区县
        countyOptions: [],
        orderContent: {
          brandName: '',
          carType: '',
          productType: '',
          topColor: '',
          bottomColor: ''
        },
        editForm: {
          orderId: null,
          outerOrderNo: '',
          orderNo: '',
          productBrand: '',
          orderContent: '',
          saleRemark: '',
          orderTime: '',
          payTime: '',
          departmentId: '',
          taoBaoAccount: '',
          name: '',
          telephone: '',
          province: '',
          city: '',
          county: '',
          street: '',
          postcode: '',
          list: []
        },
        rules: {
          orderNo: [
            { required: true, message: '请输入订单编号', trigger: 'blur' }
          ],
          productBrand: [
            { required: true, message: '请输入产品品牌', trigger: 'blur' }
          ],
          departmentId: [
            { required: true, message: '请选择生产车间', trigger: 'blur' }
          ],
          brandCode: [
            { required: true, message: '请选择汽车品牌', trigger: 'change' }
          ],
          carTypeCode: [
            { required: true, message: '请选择车型', trigger: 'change' }
          ],
          carDesc: [
            { required: true, message: '请填写车型描述', trigger: 'blur' }
          ],
          productTypeCode: [
            { required: true, message: '请选择产品型号', trigger: 'change' }
          ],
          topColorCode: [
            { required: true, message: '请选择上层材质颜色', trigger: 'change' }
          ],
          bottomColorCode: [
            { required: true, message: '请选择下层材质颜色', trigger: 'change' }
          ],
          priority: [
            { required: true, message: '请选择优先级', trigger: 'change' }
          ],
          orderTime: [
            { required: true, message: '请选择下单时间', trigger: 'change' }
          ],
          payTime: [
            { required: true, message: '请选择付款时间', trigger: 'change' }
          ],
          expressCompanyCode: [
            { required: true, message: '请输入快递公司编码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入客户真实姓名', trigger: 'blur' }
          ],
          postcode: [
            { required: true, message: '请输入邮政编码', trigger: 'blur' }
          ],
          taoBaoAccount: [
            { required: true, message: '请输入淘宝会员名', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '请输入收件人联系方式', trigger: 'blur' }
          ],
          province: [
            { required: true, message: '请选择省', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请选择市', trigger: 'change' }
          ],
          county: [
            { required: true, message: '请选择区或县', trigger: 'change' }
          ],
          street: [
            { required: true, message: '请输入收件人具体位置', trigger: 'blur' }
          ]
        },
        deleteProductNos: [],
        productList: []
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.fetchData(to.query.id)
      next()
    },
    created() {
      tree().then(resp => {
        const area = resp.data.data[0].children
        this.area = area
        this.provinceOptions = area
      })
      if (this.$route.query.id) {
        this.listAllSelection()
      } else {
        this.$router.push({ path: '/commerce/order/index' })
      }
    },
    methods: {
      fetchData(id) {
        this.listLoading = true
        getById(id).then(resp => {
          this.editForm = resp.data.data
          // 验证数据是否正确，不正确的设置为空
          for (let i = 0; i < this.editForm.list.length; i++) {
            listCarTypeByBrandCode(this.editForm.list[i].brandCode).then(res => {
              const product = this.editForm.list[i]
              product.options = res.data.data
              const carType = this.getNameByCode(this.editForm.list[i].carTypeCode, this.editForm.list[i].options)
              if (carType === undefined) {
                product.carTypeCode = ''
              }
              this.$set(this.editForm.list, i, product)
            })
            const brandName = this.getNameByCode(this.editForm.list[i].brandCode, this.options)
            if (brandName === undefined) this.editForm.list[i].brandCode = ''
            const matOrNot = this.editForm.list[i].matOrNot
            if (matOrNot === 1) {
              const productType = this.getNameByCode(this.editForm.list[i].productTypeCode, this.options3)
              const bottomColor = this.getNameByCode(this.editForm.list[i].bottomColorCode, this.options5)
              const topColor = this.getNameByCode(this.editForm.list[i].topColorCode, this.options4)
              if (productType === undefined) this.editForm.list[i].productTypeCode = ''
              if (bottomColor === undefined) this.editForm.list[i].bottomColorCode = ''
              if (topColor === undefined) this.editForm.list[i].topColorCode = ''
            }
            if (matOrNot === 2) {
              const productType = this.getNameByCode(this.editForm.list[i].productTypeCode, this.taoBaoGoods)
              if (productType === undefined) this.editForm.list[i].productTypeCode = ''
            }
          }
          if (this.editForm.departmentId === null) {
            this.editForm.departmentId = ''
          }
          this.editForm.departmentId = this.editForm.departmentId + ''
          // 更新订单内容
          this.updateOrderContent()
          this.updateSaleRemark()
          this.listLoading = false
        }).catch(e => {
          this.listLoading = false
        })
      },
      listAllSelection() {
        listAllSelection().then(resp => {
          this.options = resp.data.data.brandList
          this.options3 = resp.data.data.productTypeList
          this.options4 = resp.data.data.topColorList
          this.options5 = resp.data.data.bottomColorList
          this.options8 = resp.data.data.departmentList
          this.taoBaoGoods = resp.data.data.taoBaoGoodList
          this.fetchData(this.$route.query.id)
        })
      },
      /* 收件人省点击事件 */
      provinceChange(data) {
        const selectArea = this.forEachArea(this.area, data)
        this.cityOptions = selectArea.children
        this.editForm.province = selectArea.label
        this.countyOptions = []
        this.editForm.city = ''
        this.editForm.county = ''
      },
      /* 收件人市点击事件 */
      cityChange(data) {
        const selectArea = this.forEachArea(this.cityOptions, data)
        this.countyOptions = selectArea.children
        this.editForm.city = selectArea.label
        this.editForm.county = ''
      },
      /* 收件人县点击事件 */
      countyChange(data) {
        const selectArea = this.forEachArea(this.countyOptions, data)
        this.editForm.county = selectArea.label
      },
      /* 遍历区域 */
      forEachArea(area, data) {
        let selectArea = {}
        area.forEach(v => {
          if (v.id === data) {
            selectArea = v
          }
        })
        return selectArea
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editForm.deleteProductNos = this.deleteProductNos.join(',')
            this.submitLoading = true
            this.listLoading = true
            this.textLoading = '正在提交...'
            update(
              this.editForm
            ).then(() => {
              const that = this
              this.$message({
                type: 'success',
                message: '修改成功!',
                duration: 1000,
                onClose: function() {
                  const tags = that.$store.state.tagsView.visitedViews
                  console.log(tags)
                  for (let i = 0; i < tags.length; i++) {
                    if (tags[i].path === '/commerce/order/edit' && tags[i].query.id === that.$route.query.id) {
                      that.$store.dispatch('delVisitedViews', tags[i])
                      break
                    }
                  }
                  window.globalVue.$emit('flushData', true)
                  that.$router.push({ path: '/commerce/order/index' })
                  that.submitLoading = false
                  that.listLoading = false
                  that.textLoading = '拼命加载中...'
                }
              })
            }).catch(e => {
              this.submitLoading = false
              this.listLoading = false
              this.textLoading = '拼命加载中...'
            })
          } else {
            return false
          }
        })
      },
      getCarType(data, index, matOrNot) {
        const product = this.editForm.list[index]
        const carDesc = product.carDesc
        const produceType = product.produceType
        const brandName = this.getNameByCode(data, this.options)
        listCarTypeByBrandCode(data).then(res => {
          this.editForm.list[index].options = res.data.data
          const carType = this.getNameByCode(product.carTypeCode, this.options2)
          if (carType === undefined) {
            this.editForm.list[index].carTypeCode = ''
          }
          let productType = ''
          if (matOrNot === 1) {
            productType = this.getNameByCode(product.productTypeCode, this.options3)
          }
          if (matOrNot === 2) {
            productType = this.getNameByCode(product.productTypeCode, this.taoBaoGoods)
          }
          const bottomColor = this.getNameByCode(product.bottomColorCode, this.options5)
          const topColor = ' + ' + this.getNameByCode(product.topColorCode, this.options4)
          if (matOrNot === 1) {
            productType = '  ' + product.productTypeCode + '_' + produceType + '(' + productType + ')'
            product.content = brandName + carType + carDesc + productType + bottomColor + topColor
          }
          if (matOrNot === 2) {
            productType = '  ' + product.productTypeCode + '(' + productType + ')'
            product.content = brandName + carType + carDesc + productType
          }
          this.updateOrderContent()
        })
      },
      /* 车型change事件 */
      carTypeChange(data, index, matOrNot) {
        const product = this.editForm.list[index]
        const carDesc = product.carDesc
        const produceType = product.produceType
        const brandName = this.getNameByCode(product.brandCode, this.options)
        const carType = this.getNameByCode(data, product.options)
        let productType = ''
        if (matOrNot === 1) {
          productType = this.getNameByCode(product.productTypeCode, this.options3)
        }
        if (matOrNot === 2) {
          productType = this.getNameByCode(product.productTypeCode, this.taoBaoGoods)
        }
        const bottomColor = this.getNameByCode(product.bottomColorCode, this.options5)
        const topColor = ' + ' + this.getNameByCode(product.topColorCode, this.options4)
        if (matOrNot === 1) {
          productType = '  ' + product.productTypeCode + '_' + produceType + '(' + productType + ')'
          product.content = brandName + carType + carDesc + productType + bottomColor + topColor
        }
        if (matOrNot === 2) {
          productType = '  ' + product.productTypeCode + '(' + productType + ')'
          product.content = brandName + carType + carDesc + productType
        }
        this.updateOrderContent()
      },
      /* 车型描述改变 */
      carDescChange(data, index, matOrNot) {
        const product = this.editForm.list[index]
        const carDesc = product.carDesc
        const produceType = product.produceType
        const brandName = this.getNameByCode(product.brandCode, this.options)
        const carType = this.getNameByCode(product.carTypeCode, product.options)
        if (carType === undefined) {
          this.editForm.list[index].carTypeCode = ''
        }
        let productType = ''
        if (matOrNot === 1) {
          productType = this.getNameByCode(product.productTypeCode, this.options3)
        }
        if (matOrNot === 2) {
          productType = this.getNameByCode(product.productTypeCode, this.taoBaoGoods)
        }
        const bottomColor = this.getNameByCode(product.bottomColorCode, this.options5)
        const topColor = ' + ' + this.getNameByCode(product.topColorCode, this.options4)
        if (matOrNot === 1) {
          productType = '  ' + product.productTypeCode + '_' + produceType + '(' + productType + ')'
          product.content = brandName + carType + carDesc + productType + bottomColor + topColor
        }
        if (matOrNot === 2) {
          productType = '  ' + product.productTypeCode + '(' + productType + ')'
          product.content = brandName + carType + carDesc + productType
        }
        this.updateOrderContent()
      },
      /* 产品生产类型改变 */
      produceTypeChange(data, index, matOrNot) {
        const product = this.editForm.list[index]
        const carDesc = product.carDesc
        const produceType = product.produceType
        const brandName = this.getNameByCode(product.brandCode, this.options)
        const carType = this.getNameByCode(product.carTypeCode, product.options)
        if (carType === undefined) {
          this.editForm.list[index].carTypeCode = ''
        }
        let productType = ''
        if (matOrNot === 1) {
          productType = this.getNameByCode(product.productTypeCode, this.options3)
        }
        if (matOrNot === 2) {
          productType = this.getNameByCode(product.productTypeCode, this.taoBaoGoods)
        }
        const bottomColor = this.getNameByCode(product.bottomColorCode, this.options5)
        const topColor = ' + ' + this.getNameByCode(product.topColorCode, this.options4)
        if (matOrNot === 1) {
          productType = '  ' + product.productTypeCode + '_' + produceType + '(' + productType + ')'
          product.content = brandName + carType + carDesc + productType + bottomColor + topColor
        }
        if (matOrNot === 2) {
          productType = '  ' + product.productTypeCode + '(' + productType + ')'
          product.content = brandName + carType + carDesc + productType
        }
        this.updateOrderContent()
      },
      /* 产品型号change事件 */
      productTypeChange(data, index, matOrNot) {
        const product = this.editForm.list[index]
        const carDesc = product.carDesc
        const produceType = product.produceType
        const brandName = this.getNameByCode(product.brandCode, this.options)
        const carType = this.getNameByCode(product.carTypeCode, product.options)
        if (carType === undefined) {
          this.editForm.list[index].carTypeCode = ''
        }
        if (brandName === undefined) {
          product.brandCode = ''
        }
        if (carType === undefined) {
          product.carTypeCode = ''
        }
        let productType = ''
        if (matOrNot === 1) {
          productType = this.getNameByCode(data, this.options3)
        }
        if (matOrNot === 2) {
          productType = this.getNameByCode(data, this.taoBaoGoods)
        }
        const bottomColor = this.getNameByCode(product.bottomColorCode, this.options5)
        const topColor = ' + ' + this.getNameByCode(product.topColorCode, this.options4)
        productType = '  ' + product.productTypeCode + '(' + productType + ')'
        if (matOrNot === 1) {
          productType = '  ' + product.productTypeCode + '_' + produceType + '(' + productType + ')'
          product.content = brandName + carType + carDesc + productType + bottomColor + topColor
        }
        if (matOrNot === 2) {
          productType = '  ' + product.productTypeCode + '(' + productType + ')'
          product.content = brandName + carType + carDesc + productType
        }
        this.updateOrderContent()
      },
      /* 上层颜色change事件 */
      topColorChange(data, index, matOrNot) {
        const product = this.editForm.list[index]
        const carDesc = product.carDesc
        const produceType = product.produceType
        const brandName = this.getNameByCode(product.brandCode, this.options)
        const carType = this.getNameByCode(product.carTypeCode, product.options)
        if (carType === undefined) {
          this.editForm.list[index].carTypeCode = ''
        }
        let productType = ''
        if (matOrNot === 1) {
          productType = this.getNameByCode(product.productTypeCode, this.options3)
        }
        if (matOrNot === 2) {
          productType = this.getNameByCode(product.productTypeCode, this.taoBaoGoods)
        }
        const bottomColor = this.getNameByCode(product.bottomColorCode, this.options5)
        const topColor = ' + ' + this.getNameByCode(data, this.options4)
        if (matOrNot === 1) {
          productType = '  ' + product.productTypeCode + '_' + produceType + '(' + productType + ')'
          this.editForm.list[index].content = brandName + carType + carDesc + productType + '_' + produceType + bottomColor + topColor
        }
        if (matOrNot === 2) {
          productType = '  ' + product.productTypeCode + '(' + productType + ')'
          this.editForm.list[index].content = brandName + carType + carDesc + productType
        }
        this.updateOrderContent()
      },
      /* 下层颜色change事件 */
      bottomColorChange(data, index, matOrNot) {
        const product = this.editForm.list[index]
        const carDesc = product.carDesc
        const produceType = product.produceType
        const brandName = this.getNameByCode(product.brandCode, this.options)
        const carType = this.getNameByCode(product.carTypeCode, product.options)
        if (carType === undefined) {
          this.editForm.list[index].carTypeCode = ''
        }
        let productType = ''
        if (matOrNot === 1) {
          productType = this.getNameByCode(product.productTypeCode, this.options3)
        }
        if (matOrNot === 2) {
          productType = this.getNameByCode(product.productTypeCode, this.taoBaoGoods)
        }
        const bottomColor = this.getNameByCode(data, this.options5)
        const topColor = ' + ' + this.getNameByCode(product.topColorCode, this.options4)
        if (matOrNot === 1) {
          productType = '  ' + product.productTypeCode + '_' + produceType + '(' + productType + ')'
          product.content = brandName + carType + carDesc + productType + bottomColor + topColor
        }
        if (matOrNot === 2) {
          productType = '  ' + product.productTypeCode + '(' + productType + ')'
          product.content = brandName + carType + carDesc + productType
        }
        this.updateOrderContent()
      },
      /* 根据编码获取名称 */
      getNameByCode(code, option) {
        let name
        option.forEach(v => {
          if (code === v.code) {
            name = v.name
          }
        })
        return name
      },
      /* 增加一个脚垫产品 */
      addMat() {
        const isHasMat = this.whetherHasMat(this.editForm.list)
        if (isHasMat === 1) {
          this.$message({
            type: 'warning',
            message: '产品中已包含一个脚垫'
          })
          return
        }
        const product = {}
        product.productId = null
        product.productNo = '新增脚垫产品'
        product.orderNo = null
        product.content = null
        product.brandCode = ''
        product.carTypeCode = ''
        product.carDesc = ''
        product.topColorCode = ''
        product.bottomColorCode = ''
        product.productTypeCode = ''
        product.matOrNot = 1
        product.areaType = 1
        this.editForm.list.push(product)
      },
      /* 新增加一个淘宝商品 */
      addGood() {
        const product = {}
        product.productId = null
        product.productNo = '新增淘宝产品'
        product.orderNo = null
        product.content = null
        product.brandCode = ''
        product.carTypeCode = ''
        product.carDesc = ''
        product.topColorCode = ''
        product.bottomColorCode = ''
        product.productTypeCode = ''
        product.matOrNot = 2
        product.areaType = 0
        this.editForm.list.push(product)
      },
      /* 删除一个产品 */
      deleteGood(item, index) {
        if (this.editForm.list.length <= 1) {
          this.$message({
            type: 'warning',
            message: '订单中只剩下一个产品了'
          })
          return
        }
        this.editForm.list.splice(index, 1)
        if (item.productNo !== null) {
          this.deleteProductNos.push(item.productNo)
        }
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.editForm.province = ''
        this.editForm.city = ''
        this.editForm.taoBaoAccount = ''
      },
      /* 更新订单内容 */
      updateOrderContent() {
        this.editForm.orderContent = ''
        this.editForm.list.forEach(v => {
          this.editForm.orderContent += v.content + ';  '
        })
      },
      /* 更新销售备注 */
      updateSaleRemark() {
        this.editForm.saleRemark = ''
        this.editForm.list.forEach(v => {
          this.editForm.saleRemark += v.saleRemark + ';  '
        })
      },
      /* 判断现有产品中是否含有脚垫 */
      whetherHasMat(list) {
        let sign = 2
        list.forEach(v => {
          if (v.matOrNot === 1) {
            sign = 1
          }
        })
        return sign
      }
    }
  }
</script>
<style scoped>
  .el-button+.el-button{
    margin-left: 0;
  }
  .el-textarea__inner{
    width: 80%;
    border: 1px solid red;
  }
  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 80%;
  }
  .el-input--medium .el-input__inner{
    width: 80%;
  }
  .titleInfo{
    font-size: 18px;
    color: #606266;
    font-weight: normal;
  }
  .titleInfo2{
    font-size: 15px;
    font-weight: bold;
    color: #606266;
  }
</style>

<style>
  h2{
    margin: 20px 0 15px;
    height: 40px;
    line-height: 44px;
    background: #f9f9f9;
    font-size: 16px;
    font-weight: bold;
    text-indent: 14px;
  }
  /*.el-form-item--medium .el-form-item__content, .el-form-item--medium .el-form-item__label{*/
    /*width: 70%;*/
  /*}*/
  .el-input[data-v-0abd6af5],.el-select{
    width: 100%;
  }
  .address .el-form-item__content{
    width: 140px;
  }
  .tableFormItem .el-form-item__content{
    width: 100px;
    font-size: 12px;
    line-height: 24px;
  }
  .tableFormItem .el-form-item__label{
    font-size: 12px;
    line-height: 24px;
  }
  .tableFormItem .el-input__inner{
    font-size: 12px;
    height: 24px;
    line-height: 24px;
  }
  .tableFormItem2 .el-form-item__content{
    width: 100px;
    font-size: 12px;
    line-height: 24px;
  }
  .tableFormItem22 .el-form-item__content{
    width: 100%;
  }
  h2>span{
    font-size: 14px;
    text-decoration: underline;
    /*font-style: italic;*/
    color: #f56c6c;
    letter-spacing: 1px;
    cursor: pointer;
  }
</style>
