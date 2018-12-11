<template>
  <el-dialog
    title="产品属性值管理"
    :visible.sync="_visible"
    width="80%"
    height="80%"
    @close="close"
    :before-close="handleClose">
  <div class="container"
       v-loading="attributeLoading"
       :element-loading-text= "loadingText">
    <el-form  class="searchForm" :inline="true" label-width="120px">
      <el-row>
          <el-form-item label="产品属性值名称">
            <el-input clearable v-model="searchForm[2].productAttributeValueName"></el-input>
          </el-form-item>
          <el-form-item label="产品属性值编码">
            <el-input clearable v-model="searchForm[1].productAttributeValueCode"></el-input>
          </el-form-item>
          <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary" code="add" @click="goAdd"><i class="el-icons-jd-add"></i>&nbsp;添加产品属性值
      </el-button>
      <el-button class="el-button--primary" code="edit" @click="goEdit"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改产品属性值
      </el-button>
      <el-button class="el-button--primary" code="enable" :loading="enableLoading" @click="enable"><i
        class="el-icons-jd-qiyong"></i>&nbsp;启用
      </el-button>
      <el-button class="el-button--danger" code="disable" :loading="disableLoading" @click="disable"><i
        class="el-icons-jd-jinyong"></i>&nbsp;禁用
      </el-button>
      <el-button class="el-button--danger" code="remove" :loading="removeLoading" @click="remove"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除产品属性值
      </el-button>
    </div>
    <!--添加产品属性值-->
    <el-dialog
      title="添加产品属性值 "
      :visible.sync="addDialogVisible"
      width="40%"
      append-to-body
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="150px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="产品属性值名称" prop="productAttributeValueName">
          <el-input clearable v-model="addForm.productAttributeValueName"></el-input>
        </el-form-item>
        <el-form-item label="产品属性值编码" prop="productAttributeValueCode">
          <el-input clearable v-model="addForm.productAttributeValueCode"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改产品属性值-->
    <el-dialog
      title="修改产品属性值"
      :visible.sync="editDialogVisible"
      width="40%"
      append-to-body
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="120px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="产品属性值名称" prop="productAttributeValueName">
          <el-input clearable v-model="editForm.productAttributeValueName"></el-input>
        </el-form-item>
        <el-form-item label="产品属性值编码" prop="productAttributeValueCode">
          <el-input clearable v-model="editForm.productAttributeValueCode" disabled></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
      <el-table-column label="产品属性值名称">
        <template slot-scope="scope">
          {{scope.row.productAttributeValueName}}
        </template>
      </el-table-column>
      <el-table-column label="产品属性值编码">
        <template slot-scope="scope">
          {{scope.row.productAttributeValueCode}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.enableStatus == 0 ? '禁用' : '启用'}}
        </template>
      </el-table-column>
    </el-table>
    <!--操作-->
    <el-pagination
      style="float:right;margin-top: 15px;"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="handleCurrentPageChange">
    </el-pagination>
  </div>
  </el-dialog>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { list, save, update, updateEnableStatus, remove, getById } from '@/api/productAttributeValue'
  import BaseTable from '@/components/BaseTable'

  export default {
    name: 'productAttributeValue',
    components: {},
    extends: BaseTable,
    props: {
      attributeCode: {
        type: String,
        required: true
      },
      visible: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        listMethod: list,
        saveMethod: save,
        removeMethod: remove,
        getByIdMethod: getById,
        updateMethod: update,
        updateEnableStatusMethod: updateEnableStatus,
        optionsInProductType: [{
          label: '否',
          value: 0
        }, {
          label: '是',
          value: 1
        }],
        searchForm: [{
          attributeCode: this.attributeCode
        }, {
          productAttributeValueCode: ''
        }, {
          productAttributeValueName: ''
        }],
        addForm: {
          productAttributeValueCode: '',
          productAttributeValueName: ''
        },
        editForm: {
          id: '',
          productAttributeValueCode: '',
          productAttributeValueName: ''
        },
        attributeLoading: false, // 产品属性值对话框loading
        rules: {
          productAttributeValueCode: [
            { required: true, message: '请输入产品属性值编码', trigger: 'blur' }
          ],
          productAttributeValueName: [
            { required: true, message: '请输入产品属性值名称', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      attributeCode() {
        this.attributeLoading = true
        this.$set(this.searchForm, 0, {
          attributeCode: this.attributeCode
        })
        this.fetchData(this.searchForm[0].attributeCode, this.searchForm[1].productAttributeValueCode, this.searchForm[2].productAttributeValueName).then((resp) => {
          this.attributeLoading = false
        })
      }
    },
    computed: {
      _visible: {
        get: function() {
          return this.visible
        },
        set: function(val) {
        }
      }
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      // this.fetchData(...this._searchFormToList())
      // this.fetchData(this.searchForm[0].attributeCode, this.searchForm[1].productAttributeValueCode, this.searchForm[2].productAttributeValueName)
    },
    methods: {
      /* 打开修改产品属性值信息对话框 */
      goEdit() {
        this.preEdit().then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.productAttributeValueCode = resp.data.data.productAttributeValueCode
          this.editForm.productAttributeValueName = resp.data.data.productAttributeValueName
        }).catch(e => {
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        if (formName === 'addForm') {
          this.save(
            this.attributeCode,
            this.addForm.productAttributeValueCode,
            this.addForm.productAttributeValueName,
          )
        } else if (formName === 'editForm') {
          this.update(
            this.editForm.id,
            this.attributeCode,
            this.editForm.productAttributeValueCode,
            this.editForm.productAttributeValueName
          )
        }
      },
      close() {
        this.$emit('update:visible', false)
      }
    }
  }
</script>
<style scoped>

</style>
