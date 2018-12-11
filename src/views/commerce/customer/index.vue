<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row :gutter="20">
        <el-form-item label="手机号" prop="telephone">
          <el-input clearable v-model="searchForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-input clearable v-model="searchForm.customerName"></el-input>
        </el-form-item>
        <el-form-item label="产品品牌" prop="productBrand">
          <el-select v-model="searchForm.productBrand" placeholder="请选择品牌" :clearable="true" filterable>
            <el-option
              v-for="item in productBrands"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAddCustomer"><i class="el-icons-jd-add"></i>&nbsp;添加客户
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" :disabled="editDisabled" @click="goEditCustomer"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改客户
      </el-button>
      <el-button class="el-button--primary hidden" code="import" :disabled="editDisabled" @click="upLoadExcelBtn"><i
        class="el-icons-jd-push-customer"></i>&nbsp;导入客户
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" :disabled="editDisabled" @click="deleteCustomer" :loading="deleteLoadingr"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除客户
      </el-button>
    </div>
    <!--添加客户信息-->
    <el-dialog
      title="添加客户信息"
      top="6vh"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="120px" v-loading="addLoading" :element-loading-text="loadingText">
        <el-form-item label="淘宝会员账号">
          <el-input clearable v-model="addForm.taoBaoAccount"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="name">
          <el-input clearable v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="客户手机号" prop="telephone">
          <el-input clearable v-model="addForm.telephone" maxlength="11"
                    onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"></el-input>
        </el-form-item>
        <el-row style="border-bottom: 0;">
          <el-form-item label-width="120px" label="客户省市县" prop="province" style="float: left;margin-right: 3px;">
            <el-select style="width: 180px" v-model="addForm.province" prop="province" placeholder="请选择省" filterable
                       @change="changeProvince">
              <el-option
                v-for="item in provinces"
                :key="item.id"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="city" style="float: left;margin-right: 2px;">
            <el-select style="width: 180px" v-model="addForm.city" prop="city" placeholder="请选择市" @change="changeCity" filterable>
              <el-option
                v-for="item in cities"
                :key="item.id"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="county" style="float: left;">
            <el-select style="width: 180px" v-model="addForm.county" prop="county" placeholder="请选择区" filterable>
              <el-option
                v-for="item in counties"
                :key="item.id"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item label="客户街道地址" prop="street">
          <el-input clearable v-model="addForm.street"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="postcode">
          <el-input clearable v-model="addForm.postcode"></el-input>
        </el-form-item>
        <el-form-item label="产品品牌" prop="productBrand">
          <el-select v-model="addForm.productBrand" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in productBrands"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汽车品牌" prop="carBrandCode">
          <el-select v-model="addForm.carBrandCode" placeholder="请选择" style="width: 100%" @change="changeAddCarBrand" clearable filterable>
            <el-option
              v-for="item in carBrandCodes"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="carTypeCode">
          <el-select v-model="addForm.carTypeCode" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in carTypeCodes"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型参数" prop="carDesc">
          <el-input style="width: 100%" v-model="addForm.carDesc"/>
        </el-form-item>
        <el-form-item label="产品类型" prop="matOrNot">
          <el-select v-model="addForm.matOrNot" placeholder="请选择" style="width: 100%" @change="matOrNotChange" clearable filterable>
            <el-option
              v-for="item in productTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productTypeCode" v-if="addForm.matOrNot === 1">
          <el-select v-model="addForm.productTypeCode" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in productTypeCodes"
              :key="item.code"
              :label="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productTypeCode" v-if="addForm.matOrNot === 2">
          <el-select v-model="addForm.productTypeCode" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in materialProductTypeList"
              :key="item.code"
              :label="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上层材质颜色" v-if="addForm.matOrNot === 1">
          <el-select v-model="addForm.topColorCode" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in topColorCodes"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下层材质颜色" prop="bottomColorCode" v-if="addForm.matOrNot === 1">
          <el-select v-model="addForm.bottomColorCode" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in bottomColorCodes"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改客户对话框-->
    <el-dialog
      title="修改客户"
      top="6vh"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="120px" v-loading="editLoading" :element-loading-text="loadingText">
        <el-form-item label="淘宝会员账号">
          <el-input clearable v-model="editForm.taoBaoAccount"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名" prop="name">
          <el-input clearable v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="客户手机号" prop="telephone">
          <el-input clearable v-model="editForm.telephone" maxlength="11" onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"
                    onblur="this.value=this.value.replace(/[^0-9.]/g,'')"></el-input>
        </el-form-item>
        <el-row style="border-bottom: 0;">
          <el-form-item label-width="120px" label="客户省市县" prop="province" style="float: left;margin-right: 3px;">
            <el-select style="width: 180px" v-model="editForm.province" prop="province" placeholder="请选择省" filterable
                       @change="changeEditProvince">
              <el-option
                v-for="item in provinces"
                :key="item.id"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="city" style="float: left;margin-right: 2px;">
            <el-select style="width: 180px" v-model="editForm.city" prop="city" placeholder="请选择市" filterable
                       @change="changeEditCity">
              <el-option
                v-for="item in cities"
                :key="item.id"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="county" style="float: left;">
            <el-select style="width: 180px" v-model="editForm.county" prop="county" placeholder="请选择区" filterable>
              <el-option
                v-for="item in counties"
                :key="item.id"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item label="客户街道地址" prop="street">
          <el-input clearable v-model="editForm.street"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="postcode">
          <el-input clearable v-model="editForm.postcode"></el-input>
        </el-form-item>
        <el-form-item label="产品品牌" prop="productBrand">
          <el-select v-model="editForm.productBrand" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in productBrands"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汽车品牌" prop="carBrandCode">
          <el-select v-model="editForm.carBrandCode" placeholder="请选择" style="width: 100%" @change="changeCarBrand" clearable filterable>
            <el-option
              v-for="item in carBrandCodes"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="carTypeCode">
          <el-select v-model="editForm.carTypeCode" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in carTypeCodes"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型参数" prop="carDesc">
          <el-input v-model="editForm.carDesc"/>
        </el-form-item>
        <el-form-item label="产品类型" prop="matOrNot">
          <el-select v-model="editForm.matOrNot" placeholder="请选择" style="width: 100%" @change="matOrNotChange" clearable filterable>
            <el-option
              v-for="item in productTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productTypeCode" v-if="editForm.matOrNot === 1">
          <el-select v-model="editForm.productTypeCode" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in productTypeCodes"
              :key="item.code"
              :label="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productTypeCode" v-if="editForm.matOrNot === 2">
          <el-select v-model="editForm.productTypeCode" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in materialProductTypeList"
              :label="item.code"
              :key="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上层材质颜色" v-if="editForm.matOrNot === 1">
          <el-select v-model="editForm.topColorCode" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in topColorCodes"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下层材质颜色" prop="bottomColorCode" v-if="editForm.matOrNot === 1">
          <el-select v-model="editForm.bottomColorCode" placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in bottomColorCodes"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--客户信息列表-->
    <el-table
      :data="customerList"
      v-loading.body="listLoading"
      :element-loading-text="loadingText"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="淘宝账号">
        <template slot-scope="scope">
          {{scope.row.taoBaoAccount}}
        </template>
      </el-table-column>
      <el-table-column label="客户手机号">
        <template slot-scope="scope">
          {{scope.row.telephone}}
        </template>
      </el-table-column>
      <el-table-column label="客户姓名">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="客户地址">
        <template slot-scope="scope">
          {{scope.row.province+scope.row.city+scope.row.county+scope.row.street}}
        </template>
      </el-table-column>
      <el-table-column label="产品品牌">
        <template slot-scope="scope">
          {{scope.row.storeBrand}}
        </template>
      </el-table-column>
      <el-table-column label="汽车品牌车型">
        <template slot-scope="scope">
          {{(scope.row.carBrand + "->" + scope.row.carType + scope.row.carDesc).replace('null', '')}}
        </template>
      </el-table-column>
      <el-table-column label="产品型号">
        <template slot-scope="scope">
          {{scope.row.productType}}
        </template>
      </el-table-column>
      <el-table-column label="材质颜色">
        <template slot-scope="scope">
          {{scope.row.bottomColor + scope.row.topColor }}
        </template>
      </el-table-column>
      <el-table-column label="创建者">
        <template slot-scope="scope">
          {{scope.row.createName}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改客户">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1"
                       @click="goEditCust(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除客户">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu"
                       @click="goDeleteCust(scope.row.id)"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--操作-->
    <el-pagination
      style="margin-top: 15px;"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page.sync="pageNum"
      :page-sizes="[10, 15, 20, 25, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--上传客户信息-->
    <el-dialog
      title="导入客户信息"
      :visible.sync="upLoadExceldialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="upLoadExcelForm" :model="upLoadExcelForm" label-width="80px" v-loading="importLoading" :element-loading-text="loadingText">
        <el-form-item label-width="100px" label="请选择Excel" prop="file">
          <el-upload
            ref="upload"
            class="upload-demo"
            :auto-upload="false"
            action=""
            :before-remove="beforeRemove"
            :on-change="fileChange"
            :limit="1"
            accept=".xlsx"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xlsx</div>
          </el-upload>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="uploadForm('upLoadExcelForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import Tinymce from '@/components/Tinymce'
  /* 文本编辑器组件 */
  import { getInfoById, list, listByParam, remove, save, update, upload, getNoAreaTypeMaterialProductSelections } from '@/api/customer'
  import { listAllSelection, listCarTypeByBrandCode } from '@/api/addOrder'
  import { treeEnable } from '@/api/area'
  import BaseTable from '@/components/BaseTable'

  export default {
    name: '客户信息',
    extends: BaseTable,
    components: {
      Tinymce /* 文本编辑器组件 */
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        customerList: null,
        searchForm: {
          telephone: '',
          customerName: '',
          productBrand: ''
        },
        searchValue: '',
        telephone: '',
        customerName: '',
        productBrand: '',
        area: [],
        provinces: [],
        cities: [],
        counties: [],
        multipleSelection: [],
        demandName: null,
        demandContent: null,
        demandTime: null,
        presenterName: null,
        contactWay: null,
        ids: null,
        deleteLoadingr: false,
        addLoading: false,
        importLoading: false,
        listLoading: false,
        searchBtnLoading: false,
        searchLoading: false,
        dialogVisible: false,
        editLoading: false,
        editDialogVisible: false,
        viewUserDialogVisible: false,
        viewMenuDialogVisible: false,
        editDisabled: false,
        id: null,
        productBrands: [{
          label: '张氏',
          value: '张氏'
        }, {
          label: '澳狄达斯',
          value: '澳狄达斯'
        }, {
          label: '宝致',
          value: '宝致'
        }],
        productTypeOptions: [{
          value: 1,
          name: '脚垫'
        }, {
          value: 2,
          name: '非脚垫'
        }],
        materialProductTypeList: [],
        carBrandCodes: [],
        carTypeCodes: [],
        productTypeCodes: [],
        topColorCodes: [],
        bottomColorCodes: [],
        addForm: {
          telephone: '',
          name: '',
          province: '',
          city: '',
          county: '',
          street: '',
          postcode: '',
          taoBaoAccount: '',
          productBrand: '',
          carBrandCode: '',
          carTypeCode: '',
          carDesc: '',
          matOrNot: '',
          productTypeCode: '',
          topColorCode: '',
          bottomColorCode: ''
        },
        editForm: {
          id: '',
          telephone: '',
          name: '',
          province: '',
          city: '',
          county: '',
          street: '',
          postcode: '',
          taoBaoAccount: '',
          productBrand: '',
          carBrandCode: '',
          carTypeCode: '',
          carDesc: '',
          matOrNot: '',
          productTypeCode: '',
          topColorCode: '',
          bottomColorCode: ''
        },
        rules: {
          province: [
            { required: true, message: '请选择省', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请选择市', trigger: 'change' }
          ],
          county: [
            { required: true, message: '请选择区或县', trigger: 'change' }
          ],
          taoBaoNickname: [
            { required: true, message: '请输入淘宝昵称', trigger: 'blur' }
          ],
          nickname: [
            { required: true, message: '请输入客户昵称', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' }
          ],
          taoBaoAccount: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' }
          ],
          postcode: [
            { required: true, message: '请输入邮政编码', trigger: 'blur' }
          ],
          street: [
            { required: true, message: '请输入客户详细地址', trigger: 'blur' }
          ],
          productBrand: [
            { required: true, message: '请选择产品型号', trigger: 'change' }
          ],
          carBrandCode: [
            { required: true, message: '请选择汽车品牌', trigger: 'change' }
          ],
          carTypeCode: [
            { required: true, message: '请选择车型', trigger: 'change' }
          ],
          carDesc: [
            { required: true, message: '请填写车型参数', trigger: 'blur' }
          ],
          matOrNot: [
            { required: true, message: '请选择产品类型', trigger: 'change' }
          ],
          productTypeCode: [
            { required: true, message: '请选择产品型号', trigger: 'change' }
          ],
          topColorCode: [],
          bottomColorCode: []
        },
        options: [{}],
        value: '',
        customerTypeName: '',
        upLoadExceldialogVisible: false,
        loadingText: '拼命加载中',
        fileList: [],
        upLoadExcelForm: {
          file: ''
        }
      }
    },
    watch: {
      customerList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(null, null, null, this.pageNum, this.pageSize)
      this.fetchArea()
      listAllSelection().then(res => {
        this.bottomColorCodes = res.data.data.bottomColorList
        this.topColorCodes = res.data.data.topColorList
        this.productTypeCodes = res.data.data.productTypeList
        this.carBrandCodes = res.data.data.brandList
      })
      getNoAreaTypeMaterialProductSelections(3).then(resp => {
        this.materialProductTypeList = resp.data.data.materialProductTypeList
      })
    },
    methods: {
      /* 查询需求维护信息 */
      fetchData(telephone, customerName, productBrand, pageNum, pageSize) {
        this.listLoading = true
        return list(
          telephone,
          customerName,
          productBrand,
          pageNum,
          pageSize
        ).then(response => {
          this.customerList = response.data.data.rows
          this.customerList.forEach((e, i) => {
            e['idx'] = i
          })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          if (response.data.data.pages === 0) {
            this.pages = 1
          } else {
            this.pages = response.data.data.pages
          }
          this.listLoading = false
          return response
        }).catch(e => {
          this.listLoading = false
        })
      },
      searchCustomer() {
        this.searchBtnLoading = true
        this.listLoading = true
        this.pageNum = 1
        this.sign = 1
        listByParam(this.searchValue, this.pageNum, this.pageSize).then(response => {
          this.customerList = response.data.data.rows
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.pages = response.data.data.pages
          this.listLoading = false
          this.searchBtnLoading = false
        })
      },
      /* 查询省市县区域 */
      fetchArea() {
        treeEnable().then(res => {
          this.provinces = res.data.data[0].children
        })
      },
      /* 省份发生变化 */
      changeProvince(value) {
        this.addForm.city = ''
        this.addForm.county = ''
        this.cities = []
        this.counties = []
        for (let i = 0; i < this.provinces.length; i++) {
          // 省份变化查询省份
          if (this.provinces[i].label === value) {
            this.cities = this.provinces[i].children
            if (this.cities === null) {
              this.cities = []
            }
          }
        }
      },
      /* 修改省份改变 */
      changeEditProvince(value) {
        this.editForm.city = ''
        this.editForm.county = ''
        this.cities = []
        this.counties = []
        if (this.provinces == null) {
          return
        }
        for (let i = 0; i < this.provinces.length; i++) {
          // 省份变化查询省份
          if (this.provinces[i].label === value) {
            this.cities = this.provinces[i].children
            if (this.cities === null) {
              this.cities = []
            }
          }
        }
      },
      /* 城市发生变化 */
      changeCity(value) {
        this.addForm.county = ''
        this.counties = []
        for (let i = 0; i < this.cities.length; i++) {
          if (this.cities[i].label === value) {
            this.counties = this.cities[i].children
          }
        }
      },
      /* 修改城市发生变化 */
      changeEditCity(value) {
        this.editForm.county = ''
        this.counties = []
        for (let i = 0; i < this.cities.length; i++) {
          if (this.cities[i].label === value) {
            this.counties = this.cities[i].children
          }
        }
      },
      matOrNotChange(v) {
        if (v === 1) {
          // 脚垫
          this.rules.topColorCode = [
            { required: true, message: '请选择上层材质颜色', trigger: 'change' }
          ]
          this.rules.bottomColorCode = [
            { required: true, message: '请选择下层材质颜色', trigger: 'change' }
          ]
        } else {
          // 非脚垫
          this.rules.topColorCode = []
          this.rules.bottomColorCode = []
        }
      },
      /* 打开导入客户信息对话框 */
      upLoadExcelBtn() {
        this.upLoadExceldialogVisible = true
      },
      /* 添加、修改表单提交 */
      uploadForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'upLoadExcelForm') {
              this.importLoading = true
              upload(this.upLoadExcelForm.file).then(() => {
                this.$message({
                  type: 'success',
                  message: '上传成功!',
                  duration: 1000,
                  onClose: () => {
                    this.upLoadExceldialogVisible = false
                    this.fileList = []
                    this.upLoadExcelForm.file = ''
                    this.fetchData(null, null, null, this.pageNum, this.pageSize).then(resp => {
                      this.importLoading = false
                    })
                    this.$refs.upload.clearFiles()
                  }
                })
              }).catch(e => {
                this.importLoading = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.editForm.taoBaoAccount = ''
        this.$refs[formName].resetFields()
        // location.reload()
      },
      fileChange(file, fileList) {
        this.upLoadExcelForm.file = file
      },
      /* 文件上传 */
      beforeRemove(file, fileList) {
        return this.$confirm('确定移除' + file.name + '？')
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.telephone, this.customerName, this.productBrand, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.telephone, this.customerName, this.productBrand, this.pageNum, this.pageSize)
      },
      /* 获取所勾选需求 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        this.telephone = this.searchForm.telephone
        this.customerName = this.searchForm.customerName
        this.productBrand = this.searchForm.productBrand
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.telephone, this.customerName, this.productBrand, this.pageNum, this.pageSize).then(resp => {
            this.searchLoading = false
          })
        }
      },
      /* 打开添加用户信息对话框 */
      goAddCustomer() {
        this.cities = []
        this.counties = []
        this.addForm.province = ''
        this.addForm.city = ''
        this.addForm.county = ''
        this.dialogVisible = true
      },
      /* 打开修改用户信息对话框 */
      goEditCustomer() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        const customer = this.multipleSelection[0]
        getInfoById(customer.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.nickname = resp.data.data.nickname
          this.editForm.telephone = resp.data.data.telephone
          this.editForm.name = resp.data.data.name
          this.editForm.province = resp.data.data.province
          this.editForm.street = resp.data.data.street
          this.editForm.postcode = resp.data.data.postcode
          this.editForm.taoBaoAccount = resp.data.data.taoBaoAccount
          this.editForm.matOrNot = resp.data.data.matOrNot
          this.changeEditProvince(this.editForm.province)
          this.editForm.city = resp.data.data.city
          this.changeEditCity(this.editForm.city)
          this.editForm.county = resp.data.data.county
          this.editForm.productBrand = resp.data.data.storeBrand
          this.editForm.carBrandCode = resp.data.data.carBrand
          listCarTypeByBrandCode(this.editForm.carBrandCode).then(res => {
            this.carTypeCodes = res.data.data
          })
          this.editForm.carTypeCode = resp.data.data.carType
          this.editForm.carDesc = resp.data.data.carDesc
          this.editForm.productTypeCode = resp.data.data.productType
          this.editForm.topColorCode = resp.data.data.topColor
          this.editForm.bottomColorCode = resp.data.data.bottomColor
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      /* 点击右侧操作修改小按钮 */
      goEditCust(id) {
        if (id === null || id === undefined) {
          id = this.multipleSelection[0].id
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        getInfoById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.nickname = resp.data.data.nickname
          this.editForm.telephone = resp.data.data.telephone
          this.editForm.name = resp.data.data.name
          this.editForm.province = resp.data.data.province
          this.editForm.street = resp.data.data.street
          this.editForm.postcode = resp.data.data.postcode
          this.editForm.matOrNot = resp.data.data.matOrNot
          this.editForm.taoBaoAccount = resp.data.data.taoBaoAccount
          this.changeEditProvince(this.editForm.province)
          this.editForm.city = resp.data.data.city
          this.changeEditCity(this.editForm.city)
          this.editForm.county = resp.data.data.county
          this.editForm.productBrand = resp.data.data.storeBrand
          this.editForm.carBrandCode = resp.data.data.carBrand
          this.editForm.carDesc = resp.data.data.carDesc
          listCarTypeByBrandCode(this.editForm.carBrandCode).then(res => {
            this.carTypeCodes = res.data.data
          })
          this.editForm.carTypeCode = resp.data.data.carType
          this.editForm.productTypeCode = resp.data.data.productType
          this.editForm.topColorCode = resp.data.data.topColor
          this.editForm.bottomColorCode = resp.data.data.bottomColor
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      /* 删除客户 */
      deleteCustomer() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          this.deleteLoadingr = true
          this.listLoading = true
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(null, null, null, this.pageNum, this.pageSize).then(resp => {
                  this.deleteLoadingr = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.deleteLoadingr = false
            this.listLoading = false
          })
        })
      },
      /* 点击右侧操作删除小按钮 */
      goDeleteCust(ids) {
        this.ids = ids
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteLoadingr = true
          this.listLoading = true
          remove(this.ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(null, null, null, this.pageNum, this.pageSize).then(resp => {
                  this.deleteLoadingr = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.deleteLoadingr = false
            this.listLoading = false
          })
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              /* const id = this.customerList.length !== 0 ? this.customerList[this.customerList.length - 1].id + 1 : 1 */
              this.addLoading = true
              this.loadingText = '正在提交'
              save(
                1,
                this.addForm.telephone, // 电话号码
                this.addForm.name, // 用户姓名
                this.addForm.province,
                this.addForm.city,
                this.addForm.county,
                this.addForm.street,
                this.addForm.postcode,
                this.addForm.taoBaoAccount,
                this.addForm.productBrand,
                this.addForm.carBrandCode,
                this.addForm.carTypeCode,
                this.addForm.carDesc,
                this.addForm.productTypeCode,
                this.addForm.topColorCode,
                this.addForm.bottomColorCode
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.addForm.province = ''
                    this.addForm.city = ''
                    this.addForm.county = ''
                    this.addForm.street = ''
                    this.addForm.taoBaoAccount = ''
                    this.fetchData(this.telephone, this.customerName, this.productBrand, this.pageNum, this.pageSize).then(resp => {
                      this.loadingText = '拼命加载中'
                      this.addLoading = false
                    })
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.addLoading = false
              })
            } else if (formName === 'editForm') {
              this.editLoading = true
              this.loadingText = '正在提交'
              update(
                this.editForm.id,
                this.editForm.telephone,
                this.editForm.name,
                this.editForm.province,
                this.editForm.city,
                this.editForm.county,
                this.editForm.street,
                this.editForm.postcode,
                this.editForm.taoBaoAccount,
                this.editForm.productBrand,
                this.editForm.carBrandCode,
                this.editForm.carTypeCode,
                this.editForm.carDesc,
                this.editForm.productTypeCode,
                this.editForm.topColorCode,
                this.editForm.bottomColorCode
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.telephone, this.customerName, this.productBrand, this.pageNum, this.pageSize).then(resp => {
                      this.loadingText = '拼命加载中'
                      this.editLoading = false
                    })
                    this.editDialogVisible = false
                  }
                })
              }).catch(e => {
                this.loadingText = '拼命加载中'
                this.editLoading = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /* 打开查看用户 */
      viewUser(id) {
        this.id = Number.parseInt(id)
        this.viewUserDialogVisible = true
      },
      /* 打开查看菜单 */
      viewMenu(id) {
        this.id = Number.parseInt(id)
        this.viewMenuDialogVisible = true
      },
      closeViewMenu() {
        this.viewMenuDialogVisible = false
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.editLoading === true || this.addLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.addForm.taoBaoAccount = ''
          this.addForm.province = ''
          this.addForm.city = ''
          this.addForm.county = ''
          this.addForm.street = ''
          this.fileList = []
          this.upLoadExcelForm.file = ''
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
          this.$refs[upload].resetFields()
        }).catch(() => {

        })
      },
      /* 修改dialog汽车品牌改变 */
      changeCarBrand() {
        listCarTypeByBrandCode(this.editForm.carBrandCode).then(res => {
          this.carTypeCodes = res.data.data
        })
      },
      /* 添加dialog汽车品牌改变*/
      changeAddCarBrand() {
        listCarTypeByBrandCode(this.addForm.carBrandCode).then(res => {
          this.carTypeCodes = res.data.data
        })
      }
    }
  }
</script>
<style scoped>

</style>

<style>
  .el-pagination .el-select .el-input .el-input__inner {
    height: 20px;
    font-size: 12px;
  }

  .el-pagination__editor.el-input .el-input__inner {
    height: 20px;
    font-size: 12px;
  }
</style>
