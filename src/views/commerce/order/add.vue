<template>
  <div class="container order" style="width: 100%; float: left">
    <el-form style="float: left;width: 100%">
      <!--上传资源信息对话框-->
        <el-form ref="addForm" :rules="rules" :model="addForm" label-width="120px">
          <!--订单信息-->
          <div class="orderDetail" style="float: left; width: 46%;">
            <h2 class="titleInfo">订单信息：</h2>
            <el-form-item label="订单编号" prop="outerOrderNo">
              <el-input clearable v-model="addForm.outerOrderNo" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="productBrand">
              <el-select v-model="addForm.productBrand" placeholder="请选择" style="width: 80%" clearable filterable>
                <el-option
                  v-for="item in productBrandOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="汽车品牌" prop="brandCode">
              <el-select v-model="addForm.brandCode" placeholder="请选择" style="width: 80%" @change='getCarType' clearable filterable>
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车型" prop="carTypeCode">
              <el-select v-model="addForm.carTypeCode" placeholder="请选择" style="width: 80%" @change="carTypeChange" clearable filterable>
                <el-option
                  v-for="item in options2"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品型号" prop="productTypeCode" >
              <el-select v-model="addForm.productTypeCode" placeholder="请选择" style="width: 80%" @change="productTypeChange" clearable filterable>
                <el-option
                  v-for="item in options3"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上层材质颜色" prop="topColorCode">
              <el-select v-model="addForm.topColorCode" placeholder="请选择" style="width: 80%" @change="topColorChange" clearable filterable>
                <el-option
                  v-for="item in options4"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下层材质颜色" prop="bottomColorCode" >
              <el-select v-model="addForm.bottomColorCode" placeholder="请选择" style="width: 80%" @change="bottomColorChange" clearable filterable>
                <el-option
                  v-for="item in options5"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单内容" prop="orderContent" style="width: 84%">
              <el-input clearable
                type="textarea"
                :rows="2"
                :disabled="true"
                v-model="addForm.orderContent">
              </el-input>
            </el-form-item>
            <el-form-item label="销售备注" prop="saleRemark" style="width: 84%">
              <el-input clearable
                type="textarea"
                :rows="2"
                placeholder="请输入销售备注"
                v-model="addForm.saleRemark">
              </el-input>
            </el-form-item>
            <el-form-item label="优先级" prop="priority" >
              <el-select v-model="addForm.priority" placeholder="请选择" style="width: 80%" clearable filterable>
                <el-option
                  v-for="item in options6"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单时间" prop="orderTime" style="width: 84%">
              <el-date-picker
                style="width: 100%;"
                v-model="addForm.orderTime"
                type="datetime"
                :editable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择下单时间">
              </el-date-picker>
            </el-form-item>
          </div>
          <!--淘宝会员信息-->
          <div class="taobaoInfo" style="width: 49%; float: left">
            <h2 class="titleInfo">淘宝会员信息：</h2>
            <el-form-item label="淘宝昵称" prop="taobaoNickName" >
              <el-input clearable v-model="addForm.taobaoNickName" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="淘宝会员名" prop="taobaoAccount">
              <el-input clearable v-model="addForm.taobaoAccount" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="淘宝用户姓名" prop="name">
              <el-input clearable v-model="addForm.name" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="淘宝用户手机号" prop="taobaoTelephone">
              <el-input clearable v-model="addForm.taobaoTelephone" style="width: 80%"></el-input>
            </el-form-item>
          </div>
          <!--收件信息-->
          <div class="consignee" style="width: 49%; float: left">
            <h2 class="titleInfo">收件信息：</h2>
            <el-form-item label="收件人" prop="addressee" >
              <el-input clearable v-model="addForm.addressee" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="telephone">
              <el-input clearable v-model="addForm.telephone" style="width: 80%"></el-input>
            </el-form-item>
            <el-row style="border-bottom: 0;">
              <el-form-item label="收件人省市县" prop="province" style="float: left;margin-right: 2px;">
                <el-select style="width: 140px;" v-model="addForm.province" placeholder="请选择省" @change="provinceChange" filterable>
                  <el-option
                    v-for="item in provinceOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="0px" prop="city" style="float: left;margin-right: 2px;">
                <el-select style="width: 140px;" v-model="addForm.city" placeholder="请选择市" @change="cityChange" filterable>
                  <el-option
                    v-for="item in cityOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="0px" prop="county" style="float: left;">
                <el-select style="width: 140px;" v-model="addForm.county" placeholder="请选择区" filterable>
                  <el-option
                    v-for="item in countyOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-form-item label="收件人街道地址" prop="street">
              <el-input clearable v-model="addForm.street" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="邮政编码" prop="postcode">
              <el-input clearable v-model="addForm.postcode" style="width: 80%"></el-input>
            </el-form-item>
            <el-form-item label="快递公司" prop="expressCompanyCode" style="width: 96%">
              <el-select v-model="addForm.expressCompanyCode" placeholder="请选择" style="width: 84%" clearable filterable>
                <el-option
                  v-for="item in options7"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <h2 class="titleInfo">生产车间：</h2>
            <el-form-item label="生产车间" prop="departmentId" >
              <el-select v-model="addForm.departmentId" placeholder="请选择" style="width: 80%" clearable filterable>
                <el-option
                  v-for="item in options8"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="submit" style="float: left; width: 100%;">
            <el-form-item class="btn_box">
              <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </div>
        </el-form>
    </el-form>
  </div>
</template>

<script>
  // import { listAllSelection, save, listCarTypeByBrandCode } from '@/utils/authMenuButton'
  // import { save } from '@/api/addOrder'
  // import { authMenuButton } from '@/utils/authMenuButton'
  import { listAllSelection, save, listCarTypeByBrandCode } from '@/api/addOrder'
  import { treeEnable } from '@/api/area'
  export default {
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        carList: null,
        multipleSelection: [],
        listLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        viewUserDialogVisible: false,
        viewMenuDialogVisible: false,
        editDisabled: false,
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
        // 优先级
        options6: [{
          code: '1',
          name: '1'
        }, {
          code: '2',
          name: '2'
        }, {
          code: '3',
          name: '3'
        }, {
          code: '4',
          name: '4'
        }, {
          code: '5',
          name: '5'
        }],
        // 快递公司
        options7: [],
        // 生产车间
        options8: [],
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
        addForm: {
          outerOrderNo: '',
          productBrand: '',
          brandName: '',
          brandCode: '',
          carType: '',
          carTypeCode: '',
          productType: '',
          productTypeCode: '',
          topColor: '',
          topColorCode: '',
          bottomColor: '',
          bottomColorCode: '',
          saleRemark: '',
          priority: '3',
          orderTime: '',
          taobaoNickName: '',
          taobaoAccount: '',
          taobaoTelephone: '',
          name: '',
          addressee: '',
          telephone: '',
          province: '',
          city: '',
          county: '',
          street: '',
          postcode: '',
          expressCompanyCode: '',
          departmentId: '',
          orderContent: ''
        },
        rules: {
          outerOrderNo: [
            { required: true, message: '请输入订单编号', trigger: 'blur' }
          ],
          productBrand: [
            { required: true, message: '请输入产品品牌', trigger: 'blur' }
          ],
          brandCode: [
            { required: true, message: '请选择汽车品牌', trigger: 'change' }
          ],
          carTypeCode: [
            { required: true, message: '请选择车型', trigger: 'change' }
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
          addressee: [
            { required: true, message: '请输入收件人姓名', trigger: 'blur' }
          ],
          expressCompanyCode: [
            { required: true, message: '请输入快递公司编码', trigger: 'blur' }
          ],
          postcode: [
            { required: true, message: '请输入邮政编码', trigger: 'blur' }
          ],
          taobaoAccount: [
            { required: true, message: '请输入淘宝会员名', trigger: 'blur' }
          ],
          taobaoNickName: [
            { required: true, message: '请输入淘宝昵称', trigger: 'blur' }
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
            { required: true, message: '请输入收件人街道地址', trigger: 'blur' }
          ],
          departmentId: [
            { required: true, message: '请选择生产车间', trigger: 'change' }
          ]
        }
      }
    },
    mounted() {
      treeEnable().then(resp => {
        const area = resp.data.data[0].children
        this.area = area
        this.provinceOptions = area
      })
      this.listAllSelection()
    },
    methods: {
      listAllSelection() {
        listAllSelection().then(resp => {
          this.options = resp.data.data.brandList
          this.options3 = resp.data.data.productTypeList
          this.options4 = resp.data.data.topColorList
          this.options5 = resp.data.data.bottomColorList
          this.options7 = resp.data.data.expressCompanyList
          this.options8 = resp.data.data.departmentList
        })
      },
      getCarType(data) {
        this.orderContent.brandName = this.getNameByCode(data, this.options)
        let brandName = ''
        let carType = ''
        let productType = ''
        let bottomColor = ''
        let topColor = ''
        if (this.orderContent.brandName) {
          brandName = this.orderContent.brandName
        }
        if (this.orderContent.carType) {
          carType = this.orderContent.carType
        }
        if (this.addForm.productTypeCode) {
          productType = '  ' + this.addForm.productTypeCode + '(' + this.orderContent.productType + ')'
        }
        if (this.orderContent.bottomColor) {
          bottomColor = this.orderContent.bottomColor
        }
        if (this.orderContent.topColor) {
          topColor = ' ＋ ' + this.orderContent.topColor
        }
        this.addForm.orderContent = brandName + carType + productType + bottomColor + topColor

        this.addForm.carType = ''
        listCarTypeByBrandCode(data).then(resp => {
          this.options2 = resp.data.data
        })
      },
      /* 收件人省点击事件 */
      provinceChange(data) {
        const selectArea = this.forEachArea(this.area, data)
        this.cityOptions = selectArea.children
        this.addForm.province = selectArea.label
        this.countyOptions = []
        this.addForm.city = ''
        this.addForm.county = ''
      },
      /* 收件人市点击事件 */
      cityChange(data) {
        const selectArea = this.forEachArea(this.cityOptions, data)
        this.countyOptions = selectArea.children
        this.addForm.city = selectArea.label
        this.addForm.county = ''
      },
      /* 收件人县点击事件 */
      countyChange(data) {
        const selectArea = this.forEachArea(this.countyOptions, data)
        this.addForm.county = selectArea.label
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
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.carTypeCode, this.carTypeName, this.carModelName, this.pageNum, this.pageSize)
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            save(
              this.addForm
            ).then(() => {
              this.$message({
                type: 'success',
                message: '添加成功!',
                duration: 1000
              })
              this.$refs['addForm'].resetFields()
              this.addForm.province = ''
              this.addForm.city = ''
              this.addForm.county = ''
            })
          } else {
            return false
          }
        })
      },
      /* 车型change事件 */
      carTypeChange(code) {
        this.orderContent.carType = this.getNameByCode(code, this.options2)
        let brandName = ''
        let carType = ''
        let productType = ''
        let bottomColor = ''
        let topColor = ''
        if (this.orderContent.brandName) {
          brandName = this.orderContent.brandName
        }
        if (this.orderContent.carType) {
          carType = this.orderContent.carType
        }
        if (this.addForm.productTypeCode) {
          productType = '  ' + this.addForm.productTypeCode + '(' + this.orderContent.productType + ')'
        }
        if (this.orderContent.bottomColor) {
          bottomColor = this.orderContent.bottomColor
        }
        if (this.orderContent.topColor) {
          topColor = ' ＋ ' + this.orderContent.topColor
        }
        this.addForm.orderContent = brandName + carType + productType + bottomColor + topColor
      },
      /* 产品型号change事件 */
      productTypeChange(code) {
        this.orderContent.productType = this.getNameByCode(code, this.options3)
        let brandName = ''
        let carType = ''
        let productType = ''
        let bottomColor = ''
        let topColor = ''
        if (this.orderContent.brandName) {
          brandName = this.orderContent.brandName
        }
        if (this.orderContent.carType) {
          carType = this.orderContent.carType
        }
        if (this.addForm.productTypeCode) {
          productType = '  ' + this.addForm.productTypeCode + '(' + this.orderContent.productType + ')'
        }
        if (this.orderContent.bottomColor) {
          bottomColor = this.orderContent.bottomColor
        }
        if (this.orderContent.topColor) {
          topColor = ' ＋ ' + this.orderContent.topColor
        }
        this.addForm.orderContent = brandName + carType + productType + bottomColor + topColor
      },
      /* 上层颜色change事件 */
      topColorChange(code) {
        this.orderContent.topColor = this.getNameByCode(code, this.options4)
        let brandName = ''
        let carType = ''
        let productType = ''
        let bottomColor = ''
        let topColor = ''
        if (this.orderContent.brandName) {
          brandName = this.orderContent.brandName
        }
        if (this.orderContent.carType) {
          carType = this.orderContent.carType
        }
        if (this.addForm.productTypeCode) {
          productType = '  ' + this.addForm.productTypeCode + '(' + this.orderContent.productType + ')'
        }
        if (this.orderContent.bottomColor) {
          bottomColor = this.orderContent.bottomColor
        }
        if (this.orderContent.topColor) {
          topColor = ' ＋ ' + this.orderContent.topColor
        }
        this.addForm.orderContent = brandName + carType + productType + bottomColor + topColor
      },
      /* 下层颜色change事件 */
      bottomColorChange(code) {
        this.orderContent.bottomColor = this.getNameByCode(code, this.options5)
        let brandName = ''
        let carType = ''
        let productType = ''
        let bottomColor = ''
        let topColor = ''
        if (this.orderContent.brandName) {
          brandName = this.orderContent.brandName
        }
        if (this.orderContent.carType) {
          carType = this.orderContent.carType
        }
        if (this.addForm.productTypeCode) {
          productType = '  ' + this.addForm.productTypeCode + '(' + this.orderContent.productType + ')'
        }
        if (this.orderContent.bottomColor) {
          bottomColor = this.orderContent.bottomColor
        }
        if (this.orderContent.topColor) {
          topColor = ' ＋ ' + this.orderContent.topColor
        }
        this.addForm.orderContent = brandName + carType + productType + bottomColor + topColor
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
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.addForm.province = ''
        this.addForm.city = ''
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
</style>
