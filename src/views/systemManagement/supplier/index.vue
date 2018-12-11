<template>
  <div class="container">
    <el-form ref="searchForm" :model="searchForm" class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="供应商名称" prop="supplierName" label-width="82px">
          <el-input clearable v-model="searchForm.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts" label-width="56px">
          <el-input clearable v-model="searchForm.contacts"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="enableStatus" label-width="48px">
          <el-select v-model="searchForm.enableStatus" placeholder="请选择" clearable filterable>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" :loading="searchLoading"  @click="search">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>

    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="saveSupplier"><i class="el-icons-jd-add"></i>&nbsp;添加供应商</el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="updateSupplier"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改供应商</el-button>
      <el-button class="el-button--primary hidden" code="enable" :loading="enableLoading" @click="enable"><i class="el-icons-jd-qiyong"></i>&nbsp;启用供应商</el-button>
      <el-button class="el-button--danger hidden" code="disable" :loading="disabledLoading" @click="disabled"><i class="el-icons-jd-jinyong"></i>&nbsp;禁用供应商</el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="remove"><i class="el-icons-jd-shanchu"></i>&nbsp;删除供应商</el-button>
    </div>

    <el-dialog
      title="添加供应商 "
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label-width="100px" label="供应商名称" prop="supplierName">
          <el-input clearable v-model="addForm.supplierName"></el-input>
        </el-form-item>
        <el-row style="border-bottom: 0;">
          <el-form-item label-width="100px" label="供应商地址" prop="province" style="float: left;margin-right: 3px;">
            <el-select style="width: 140px;" v-model="addForm.province" placeholder="请选择省" @change="changeProvince" clearable filterable>
              <el-option
                v-for="item in province"
                :key="item.id"
                :label="item.areaName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="city" style="float: left;margin-right: 3px;">
            <el-select style="width: 140px;" v-model="addForm.city" placeholder="请选择市" @change="changeCity" clearable filterable>
              <el-option
                v-for="item in city"
                :key="item.id"
                :label="item.areaName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="county" style="float: left;">
            <el-select style="width: 140px;" v-model="addForm.county" placeholder="请选择区或县" clearable filterable>
              <el-option
                v-for="item in district"
                :key="item.id"
                :label="item.areaName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item label-width="100px" prop="street" label="请输入街道">
          <el-input clearable v-model="addForm.street"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="公司网址" prop="website">
          <el-input clearable v-model="addForm.website"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="主营业务" prop="business">
          <el-input clearable type="textarea" v-model="addForm.business"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="联系人" prop="contacts">
          <el-input clearable v-model="addForm.contacts"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="通讯地址" prop="contactAddress">
          <el-input clearable v-model="addForm.contactAddress"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="联系方式" prop="contactWay">
          <el-input clearable v-model="addForm.contactWay"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="邮箱" prop="email">
          <el-input clearable v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="修改供应商"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm"
               :rules="rules"
               :model="editForm"
               label-width="80px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label-width="100px" label="供应商名称" prop="supplierName">
          <el-input clearable v-model="editForm.supplierName"></el-input>
        </el-form-item>

        <el-row style="border-bottom: 0;">
          <el-form-item label-width="100px" label="供应商地址" prop="province" style="float: left;margin-right: 2px;">
            <el-select style="width: 140px;" v-model="editForm.province" placeholder="请选择省" @change="changeProvince" clearable filterable>
              <el-option
                v-for="item in province"
                :key="item.id"
                :label="item.areaName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="city" style="float: left;margin-right: 2px;">
            <el-select style="width: 140px;" v-model="editForm.city" placeholder="请选择市" @change="changeCity" clearable filterable>
              <el-option
                v-for="item in city"
                :key="item.id"
                :label="item.areaName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0px" prop="county" style="float: left;">
          <el-select style="width: 140px;" v-model="editForm.county" placeholder="请选择区" @change="countyChange" clearable filterable>
            <el-option
              v-for="item in district"
              :key="item.id"
              :label="item.areaName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        </el-row>

        <el-form-item label-width="100px" label="请写街道" prop="street">
          <el-input clearable v-model="editForm.street"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="公司网址" prop="website">
          <el-input clearable v-model="editForm.website"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="主营业务" prop="business">
          <el-input clearable type="textarea" v-model="editForm.business"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="联系人" prop="contacts">
          <el-input clearable v-model="editForm.contacts"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="通讯地址" prop="contactAddress">
          <el-input clearable v-model="editForm.contactAddress"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="联系方式" prop="contactWay">
          <el-input clearable v-model="editForm.contactWay"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="邮箱" prop="email">
          <el-input clearable v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      :data="supplierList"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="供应商名称" width="180">
        <template slot-scope="scope">
          {{scope.row.supplierName}}
        </template>
      </el-table-column>
      <el-table-column label="网址" width="180">
        <template slot-scope="scope">
          {{scope.row.website}}
        </template>
      </el-table-column>
      <el-table-column label="主营业务" width="180">
        <template slot-scope="scope">
          {{scope.row.business}}
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="180">
        <template slot-scope="scope">
          {{scope.row.contacts}}
        </template>
      </el-table-column>
      <el-table-column label="通讯地址" width="180">
        <template slot-scope="scope">
          {{scope.row.contactAddress}}
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="180">
        <template slot-scope="scope">
          {{scope.row.contactWay}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          {{scope.row.email}}
        </template>
      </el-table-column>
      <el-table-column label="启用/禁用" width="90">
        <template slot-scope="scope">
          {{scope.row.enableStatus == 0 ? "禁用":"启用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <!--<el-button class="el-button&#45;&#45;primary" code="add" size="small" @click="viewUser(scope.row.id)">查看用户</el-button>-->
          <!--<el-button class="el-button&#45;&#45;primary" code="add" size="small" @click="viewMenu(scope.row.id)">查看菜单</el-button>-->
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改供应商">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.enableStatus === 0"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="启用供应商">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="enable" icon="el-icons-jd-qiyong" @click="enableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover v-else
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="禁用供应商">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="disable" icon="el-icons-jd-jinyong" @click="disableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="删除供应商">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeLine(scope.row.id)"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

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
  </div>
</template>

<script>
  import { getById, list, save, update, updateStatus, remove } from '@/api/supplier'
  import { listByParentId } from '@/api/area'
  import { authMenuButton } from '@/utils/authMenuButton'

  export default {
    name: 'supplier',
    data() {
      return {
        options: [{
          value: '1',
          label: '启用'
        }, {
          value: '0',
          label: '禁用'
        }],
        lag: false,
        pValue: '',
        cValue: '',
        dValue: '',
        supplierList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        province: [],
        city: [],
        district: [],
        list: null,
        listLoading: false, // table
        searchLoading: false, // 查询按钮
        addFormLoading: false, // 添加对话框
        editFormLoading: false, // 修改对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        enableLoading: false, // 启用按钮
        disabledLoading: false, // 禁用按钮
        removeLoading: false, // 删除按钮
        dialogVisible: false,
        editDialogVisible: false,
        multipleSelection: [],
        enableStatus: null,
        addForm: {
          supplierName: '',
          province: '',
          city: '',
          county: '',
          street: '',
          website: '',
          business: '',
          contacts: '',
          contactAddress: '',
          contactWay: '',
          email: ''
        },
        editForm: {
          supplierName: '',
          province: '',
          city: '',
          county: '',
          street: '',
          website: '',
          business: '',
          contacts: '',
          contactAddress: '',
          contactWay: '',
          email: ''
        },
        searchForm: {
          supplierName: '',
          contacts: '',
          enableStatus: ''
        },
        rules: {
          supplierName: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' }
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
            { required: true, message: '请输入街道', trigger: 'blur' }
          ],
          website: [
            { pattern: /[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/, message: '请输入正确的网址格式' }
          ],
          business: [
            { required: true, message: '请输入主营业务', trigger: 'blur' }
          ],
          contacts: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          contactAddress: [
            { required: true, message: '请输入通讯地址', trigger: 'blur' }
          ],
          contactWay: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入正确的邮箱格式' }
          ]
        }
      }
    },
    watch: {
      supplierList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.province = []
      const parentId = 1
      listByParentId(
        parentId,
        this.pageNum,
        1000
      ).then(response => {
        for (let i = 0; i < response.data.data.rows.length; i++) {
          this.province.push({ id: response.data.data.rows[i].id, areaName: response.data.data.rows[i].areaName, parentId: response.data.data.rows[i].parentId })
        }
      })
      this.fetchData(null, null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 初始化列表 */
      fetchData(supplierName, contacts, enableStatus, pageNum, pageSize) {
        this.listLoading = true
        return list(
          supplierName,
          contacts,
          enableStatus,
          pageNum,
          pageSize
        ).then(resp => {
          this.supplierList = resp.data.data.rows
          this.supplierList.forEach((e, i) => { e['idx'] = i })
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          this.listLoading = false
          return resp
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        this.fetchData(
          this.searchForm.supplierName,
          this.searchForm.contacts,
          this.searchForm.enableStatus,
          this.pageNum,
          this.pageSize
        ).then((resp) => {
          this.searchLoading = false
          this.listLoading = false
        })
      },
      /* 选择省的时候 */
      changeProvince(id) {
        const parentId = id
        return listByParentId(
          parentId,
          this.pageNum,
          1000
        ).then(response => {
          this.city = []
          this.district = []
          this.addForm.city = ''
          this.addForm.county = ''
          this.editForm.city = ''
          this.editForm.county = ''
          for (let i = 0; i < response.data.data.rows.length; i++) {
            this.city.push({ id: response.data.data.rows[i].id, areaName: response.data.data.rows[i].areaName, parentId: response.data.data.rows[i].parentId })
          }
          return response
        })
      },
      /* 选择市的时候 */
      changeCity(id) {
        const parentId = id
        return listByParentId(
          parentId,
          this.pageNum,
          1000
        ).then(response => {
          this.district = []
          this.addForm.county = ''
          this.editForm.county = ''

          for (let i = 0; i < response.data.data.rows.length; i++) {
            this.district.push({ id: response.data.data.rows[i].id, areaName: response.data.data.rows[i].areaName, parentId: response.data.data.rows[i].parentId })
          }
          return response
        })
      },
      /* 收件人县点击事件 */
      countyChange(data) {
        const selectArea = this.forEachArea(this.district, data)
        this.editForm.county = selectArea.id
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
      /* 打开添加供应商对话框 */
      saveSupplier() {
        this.dialogVisible = true
      },
      /* 打开修改供应商对话框 */
      updateSupplier() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editFormLoading = true
        const supplier = this.multipleSelection[0]
        this.editForm.id = supplier.id
        getById(this.editForm.id).then(resp => {
          this.editForm.supplierName = resp.data.data.supplierName
          this.editForm.street = resp.data.data.street
          this.editForm.website = resp.data.data.website
          this.editForm.business = resp.data.data.business
          this.editForm.contacts = resp.data.data.contacts
          this.editForm.contactAddress = resp.data.data.contactAddress
          this.editForm.contactWay = resp.data.data.contactWay
          this.editForm.email = resp.data.data.email
          this.editForm.province = Number.parseInt(resp.data.data.province)
          this.changeProvince(resp.data.data.province).then(resp1 => {
            this.editForm.city = Number.parseInt(resp.data.data.city)
            this.changeCity(resp.data.data.city).then(resp1 => {
              this.editForm.county = Number.parseInt(resp.data.data.county)
            })
          })
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
        this.editDialogVisible = true
      },
      /* 表格里操作按钮 修改 */
      goEditLine(id) {
        this.editFormLoading = true
        this.editForm.id = id
        getById(id).then(resp => {
          this.editForm.supplierName = resp.data.data.supplierName
          this.editForm.street = resp.data.data.street
          this.editForm.website = resp.data.data.website
          this.editForm.business = resp.data.data.business
          this.editForm.contacts = resp.data.data.contacts
          this.editForm.contactAddress = resp.data.data.contactAddress
          this.editForm.contactWay = resp.data.data.contactWay
          this.editForm.email = resp.data.data.email
          this.editForm.province = Number.parseInt(resp.data.data.province)
          this.changeProvince(resp.data.data.province).then(resp1 => {
            this.editForm.city = Number.parseInt(resp.data.data.city)
            this.changeCity(resp.data.data.city).then(resp1 => {
              this.editForm.county = Number.parseInt(resp.data.data.county)
            })
          })
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
        this.editDialogVisible = true
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              // const supplierId = this.supplierList.length !== 0 ? this.supplierList[this.supplierList.length - 1].id + 1 : 1
              //              const supplierAddress = this.pValue + this.cValue + this.dValue + this.addForm.supplierAddress
              this.submitLoading = true
              this.addFormLoading = true
              this.loadingText = '正在提交......'
              save(
                this.addForm.business,
                this.addForm.city,
                this.addForm.contactAddress,
                this.addForm.contactWay,
                this.addForm.contacts,
                this.addForm.county,
                this.addForm.email,
                this.addForm.province,
                this.addForm.street,
                this.addForm.supplierName,
                this.addForm.website
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(
                      this.searchForm.supplierName,
                      this.searchForm.contacts,
                      this.searchForm.enableStatus,
                      this.pageNum,
                      this.pageSize
                    ).then((resp) => {
                      this.addFormLoading = false
                      this.submitLoading = false
                      this.loadingText = '拼命加载中......'
                    })
                    this.$refs[formName].resetFields()
                    this.addForm.province = ''
                    this.addForm.city = ''
                    this.addForm.county = ''
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.addFormLoading = false
                this.submitLoading = false
                this.loadingText = '拼命加载中......'
              })
            } else if (formName === 'editForm') {
              this.submitLoading = true
              this.editFormLoading = true
              this.loadingText = '正在提交......'
              update(
                this.editForm.business,
                this.editForm.city,
                this.editForm.contactAddress,
                this.editForm.contactWay,
                this.editForm.contacts,
                this.editForm.county,
                this.editForm.email,
                this.editForm.id,
                this.editForm.province,
                this.editForm.street,
                this.editForm.supplierName,
                this.editForm.website
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(
                      this.searchForm.supplierName,
                      this.searchForm.contacts,
                      this.searchForm.enableStatus,
                      this.pageNum,
                      this.pageSize
                    ).then((resp) => {
                      this.submitLoading = false
                      this.editFormLoading = false
                      this.loadingText = '拼命加载中......'
                    })
                    this.$refs[formName].resetFields()
                    this.editForm.province = ''
                    this.editForm.city = ''
                    this.editForm.county = ''
                    this.editDialogVisible = false
                  }
                })
              }).catch(e => {
                this.submitLoading = false
                this.editFormLoading = false
                this.loadingText = '拼命加载中......'
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
        this.addForm.province = ''
        this.addForm.city = ''
        this.addForm.county = ''
        this.addForm.street = ''
        this.editForm.province = ''
        this.editForm.city = ''
        this.editForm.county = ''
        this.editForm.street = ''
        this.$refs[formName].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.editFormLoading === true || this.submitLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.addForm.province = ''
          this.addForm.city = ''
          this.addForm.county = ''
          this.addForm.street = ''
          this.editForm.province = ''
          this.editForm.city = ''
          this.editForm.county = ''
          this.editForm.street = ''
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
        }).catch(() => {

        })
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.unitCode, this.searchForm.unitName, this.searchForm.status, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.unitCode, this.searchForm.unitName, this.searchForm.status, this.pageNum, this.pageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 启用供应商 */
      enable() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
        } else {
          const rows = this.multipleSelection
          const ids = []
          const status = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
            status.push(rows[i].enableStatus)
          }
          for (let j = 0; j < status.length; j++) {
            if (status[0] !== status[j]) {
              this.lag = true
              break
            }
          }
          if (this.lag === false) {
            // 判断是0还是1
            if (status[0] === 1) {
              this.$message({
                type: 'warning',
                message: '您已经启用了',
                duration: 1500
              })
            } else {
              this.enableLoading = true
              this.listLoading = true
              this.enableStatus = 1
              updateStatus(ids.join(','), this.enableStatus).then(response => {
                this.$message({
                  type: 'success',
                  message: '启用成功',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(null, null, null, this.pageNum, this.pageSize).then((resp) => {
                      this.listLoading = false
                      this.enableLoading = false
                    })
                  }
                })
              }).catch(e => {
                this.listLoading = false
                this.enableLoading = false
              })
            }
          } else {
            this.$message({
              type: 'warning',
              message: '请选择一致的状态',
              duration: 1500
            })
            this.lag = false
          }
        }
      },
      enableLine(ids, nowEnableStatus) {
        if (nowEnableStatus !== undefined && nowEnableStatus === 1) {
          this.$message({
            type: 'warning',
            message: '您选择的数据已经启用！',
            duration: 1500
          })
          return
        }
        this.enableLoading = true
        this.listLoading = true
        updateStatus(ids, 1).then(response => {
          this.$message({
            type: 'success',
            message: '启用成功',
            duration: 1000,
            onClose: () => {
              this.fetchData(null, null, null, this.pageNum, this.pageSize).then((resp) => {
                this.enableLoading = false
                this.listLoading = false
              })
            }
          })
        }).catch(e => {
          this.enableLoading = false
          this.listLoading = false
        })
      },
      /* 禁用供应商 */
      disabled() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
        } else {
          const rows = this.multipleSelection
          const ids = []
          const status = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
            status.push(rows[i].enableStatus)
          }
          for (let j = 0; j < status.length; j++) {
            if (status[0] !== status[j]) {
              this.lag = true
              break
            }
          }
          if (this.lag === false) {
            // 判断是0还是1
            if (status[0] === 0) {
              this.$message({
                type: 'warning',
                message: '您已经禁用了',
                duration: 1500
              })
            } else {
              this.disabledLoading = true
              this.listLoading = true
              this.enableStatus = 0
              updateStatus(ids.join(','), this.enableStatus).then(response => {
                this.$message({
                  type: 'success',
                  message: '禁用成功',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(null, null, null, this.pageNum, this.pageSize).then((resp) => {
                      this.listLoading = false
                      this.disabledLoading = false
                    })
                  }
                })
              }).catch(e => {
                this.listLoading = false
                this.disabledLoading = false
              })
            }
          } else {
            this.$message({
              type: 'warning',
              message: '请选择一致的状态',
              duration: 1500
            })
            this.lag = false
          }
        }
      },
      disableLine(ids, nowEnableStatus) {
        if (nowEnableStatus !== undefined && nowEnableStatus === 0) {
          this.$message({
            type: 'warning',
            message: '您选择的数据已经禁用！',
            duration: 1500
          })
          return
        }
        this.disabledLoading = true
        this.listLoading = true
        updateStatus(ids, 0).then(response => {
          this.$message({
            type: 'success',
            message: '禁用成功',
            duration: 1000,
            onClose: () => {
              this.fetchData(null, null, null, this.pageNum, this.pageSize).then((resp) => {
                this.disabledLoading = false
                this.listLoading = false
              })
            }
          })
        }).catch(e => {
          this.listLoading = false
        })
      },
      remove() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeLoading = true
          this.listLoading = true
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.pageNum = 1
                this.listLoading = true
                this.fetchData(null, null, null, this.pageNum, this.pageSize).then((resp) => {
                  this.listLoading = false
                  this.removeLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
            this.removeLoading = false
          })
        })
      },
      removeLine(ids) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeLoading = true
          this.listLoading = true
          remove(ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.pageNum = 1
                this.fetchData(null, null, null, this.pageNum, this.pageSize).then((resp) => {
                  this.removeLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
          })
        })
      }
    }
  }
</script>

<style scoped>
</style>
