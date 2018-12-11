<template>
  <div class="container">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="产品属性名称">
          <el-input clearable v-model="searchForm[1].productAttributeName"></el-input>
        </el-form-item>
        <el-form-item label="产品属性编码">
          <el-input clearable v-model="searchForm[0].productAttributeCode"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetSearchForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAdd"><i class="el-icons-jd-add"></i>&nbsp;添加产品属性
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEdit"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改产品属性
      </el-button>
      <el-button class="el-button--primary hidden" code="enable" :loading="enableLoading" @click="enable"><i
        class="el-icons-jd-qiyong"></i>&nbsp;启用
      </el-button>
      <el-button class="el-button--danger hidden" code="disable" :loading="disableLoading" @click="disable"><i
        class="el-icons-jd-jinyong"></i>&nbsp;禁用
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="localRemove"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除产品属性
      </el-button>
      <el-button class="el-button--primary hidden" code="valueManage" @click="goValueManage"><i
        class="el-icons-jd-shuxingzhiguanli"></i>&nbsp;产品属性值管理
      </el-button>
    </div>
    <!--产品属性列表-->
    <el-table
      :data="dataList"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="产品属性名称">
        <template slot-scope="scope">
          {{scope.row.productAttributeName}}
        </template>
      </el-table-column>
      <el-table-column label="产品属性编码">
        <template slot-scope="scope">
          {{scope.row.productAttributeCode}}
        </template>
      </el-table-column>
      <el-table-column label="是否是产品型号属性">
        <template slot-scope="scope">
          {{optionsInProductType[scope.row.inProductType].label}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="顺序">
        <template slot-scope="scope">
          {{scope.row.productAttributeSort}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.enableStatus == 0 ? '禁用' : '启用'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改产品属性">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.enableStatus === 0"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="启用产品属性">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="enable" icon="el-icons-jd-qiyong" @click="enableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover v-else
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="禁用产品属性">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="disable" icon="el-icons-jd-jinyong" @click="disableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="删除产品属性">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="remove" icon="el-icons-jd-shanchu" @click="localRemoveLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="设置产品型号属性">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="valueManage" icon="el-icons-jd-shuxingzhiguanli" @click="goValueManageLine(scope.row.productAttributeCode)"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--添加产品属性-->
    <el-dialog
      title="添加产品属性 "
      :visible.sync="addDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="140px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="产品属性名称" prop="productAttributeName">
          <el-input clearable v-model="addForm.productAttributeName"></el-input>
        </el-form-item>
        <el-form-item label="产品属性编码" prop="productAttributeCode">
          <el-input clearable v-model="addForm.productAttributeCode"></el-input>
        </el-form-item>
        <el-form-item label="是否是产品型号属性" prop="inProductType">
          <el-select v-model="addForm.inProductType" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in optionsInProductType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品属性顺序" prop="productAttributeSort">
          <el-input clearable v-model="addForm.productAttributeSort"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改产品属性-->
    <el-dialog
      title="修改产品属性"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="140px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="产品属性名称" prop="productAttributeName">
          <el-input clearable v-model="editForm.productAttributeName"></el-input>
        </el-form-item>
        <el-form-item label="产品属性编码" prop="productAttributeCode">
          <el-input clearable v-model="editForm.productAttributeCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="是否是产品型号属性" prop="inProductType">
          <el-select v-model="editForm.inProductType" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in optionsInProductType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品属性顺序" prop="productAttributeSort">
          <el-input clearable v-model="editForm.productAttributeSort"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <product-attribute-value :visible.sync="valueManageDialogVisible" :attributeCode="attributeCode"></product-attribute-value>
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
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { list, save, update, updateEnableStatus, remove, getById } from '@/api/productAttribute'
  import BaseTable from '@/components/BaseTable'
  import ProductAttributeValue from './attributeValue'

  export default {
    name: 'productAttribute',
    components: {
      ProductAttributeValue
    },
    extends: BaseTable,
    data() {
      return {
        listMethod: list,
        saveMethod: save,
        getByIdMethod: getById,
        updateMethod: update,
        updateEnableStatusMethod: updateEnableStatus,
        attributeCode: '',
        valueManageDialogVisible: false,
        optionsInProductType: [{
          label: '否',
          value: 0
        }, {
          label: '是',
          value: 1
        }],
        searchForm: [{
          productAttributeCode: ''
        }, {
          productAttributeName: ''
        }],
        addForm: {
          productAttributeCode: '',
          productAttributeName: '',
          inProductType: 1,
          productAttributeSort: ''
        },
        editForm: {
          id: '',
          productAttributeCode: '',
          productAttributeName: '',
          inProductType: 1,
          productAttributeSort: ''
        },
        rules: {
          productAttributeCode: [
            { required: true, message: '请输入产品属性编码', trigger: 'blur' }
          ],
          productAttributeName: [
            { required: true, message: '请输入产品属性名称', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      dataList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(...this._searchFormToList())
      // this.fetchData(this.searchForm.productAttributeCode, this.searchForm.productAttributeName)
    },
    methods: {
      resetSearchForm() {
        this.searchForm[0].productAttributeCode = ''
        this.searchForm[1].productAttributeName = ''
      },
      /* 打开修改产品属性信息对话框 */
      goEdit() {
        this.preEdit().then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.productAttributeCode = resp.data.data.productAttributeCode
          this.editForm.productAttributeName = resp.data.data.productAttributeName
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.editForm.productAttributeSort = resp.data.data.productAttributeSort
          this.editForm.inProductType = resp.data.data.inProductType
          this.imgList = resp.data.data.attachmentList
        }).catch(e => {
        })
      },
      goEditLine(id) {
        this.preEdit(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.productAttributeCode = resp.data.data.productAttributeCode
          this.editForm.productAttributeName = resp.data.data.productAttributeName
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.editForm.productAttributeSort = resp.data.data.productAttributeSort
          this.editForm.inProductType = resp.data.data.inProductType
          this.imgList = resp.data.data.attachmentList
        }).catch(e => {
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        if (formName === 'addForm') {
          this.save(
            this.addForm.productAttributeCode,
            this.addForm.productAttributeName,
            this.addForm.inProductType,
            this.addForm.productAttributeSort
          )
        } else if (formName === 'editForm') {
          this.update(
            this.editForm.id,
            this.editForm.productAttributeCode,
            this.editForm.productAttributeName,
            this.editForm.inProductType,
            this.editForm.productAttributeSort
          )
        }
      },
      localRemove() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].id <= 50) {
            this.$message({
              type: 'warning',
              message: '内置属性禁止删除!',
              duration: 1500
            })
            return
          }
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
                this.fetchData(...this._searchFormToList(), this.pageNum, this.pageSize).then((resp) => {
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
      localRemoveLine(ids) {
        if (ids <= 50) {
          this.$message({
            type: 'warning',
            message: '内置属性禁止删除!',
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
          remove(ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.pageNum = 1
                this.fetchData(...this._searchFormToList(), this.pageNum, this.pageSize).then((resp) => {
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
      goValueManage() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作',
            duration: 1500
          })
        } else {
          const rows = this.multipleSelection
          this.attributeCode = rows[0].productAttributeCode
          this.valueManageDialogVisible = true
        }
      },
      goValueManageLine(code) {
        this.attributeCode = code
        this.valueManageDialogVisible = true
      }
    }
  }
</script>
<style scoped>

</style>
