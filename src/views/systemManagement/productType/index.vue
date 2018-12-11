<template>
  <div class="container">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="产品型号名称">
          <el-input clearable v-model="searchForm[1].productTypeName"></el-input>
        </el-form-item>
        <el-form-item label="产品型号编码">
          <el-input clearable v-model="searchForm[0].productTypeCode"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetSearchForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAdd"><i class="el-icons-jd-add"></i>&nbsp;添加产品型号
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEdit"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改产品型号
      </el-button>
      <el-button class="el-button--primary hidden" code="enable" :loading="enableLoading" @click="enable"><i
        class="el-icons-jd-qiyong"></i>&nbsp;启用
      </el-button>
      <el-button class="el-button--danger hidden" code="disable" :loading="disableLoading" @click="disable"><i
        class="el-icons-jd-jinyong"></i>&nbsp;禁用
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="remove"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除产品型号
      </el-button>
      <el-button class="el-button--primary hidden" code="setAttribute" @click="goAttributeValue"><i
        class="el-icons-jd-shezhichanpinshuxing"></i>&nbsp;设置产品属性
      </el-button>
    </div>
    <!--用车信息列表-->
    <el-table
      :data="dataList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="产品型号名称">
        <template slot-scope="scope">
          {{scope.row.productTypeName}}
        </template>
      </el-table-column>
      <el-table-column label="产品型号编码">
        <template slot-scope="scope">
          {{scope.row.productTypeCode}}
        </template>
      </el-table-column>
      <el-table-column label="产品型号内容">
        <template slot-scope="scope">
          {{scope.row.productTypeContent}}
        </template>
      </el-table-column>

      <el-table-column label="图片">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="showCarousel(scope.row.attachmentList || [])">查看图片</a>
        </template>
      </el-table-column>
      <el-table-column label="水洗标数量">
        <template slot-scope="scope">
          {{scope.row.washLabelNo}}
        </template>
      </el-table-column>
      <el-table-column label="用料长度（米）">
        <template slot-scope="scope">
          {{scope.row.materialLength / 100}}
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
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改产品型号">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.enableStatus === 0"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="启用产品型号">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="enable" icon="el-icons-jd-qiyong" @click="enableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover v-else
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="禁用产品型号">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="disable" icon="el-icons-jd-jinyong" @click="disableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="删除产品型号">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="设置产品属性">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="setAttribute" icon="el-icons-jd-shezhichanpinshuxing" @click="goAttributeValueLine(scope.row.productTypeCode)"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--添加产品型号-->
    <el-dialog
      title="添加产品型号 "
      :visible.sync="addDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="120px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="产品型号名称" prop="productTypeName">
          <el-input clearable v-model="addForm.productTypeName"></el-input>
        </el-form-item>
        <el-form-item label="产品型号编码" prop="productTypeCode">
          <el-input clearable v-model="addForm.productTypeCode"></el-input>
        </el-form-item>
        <el-form-item label="水洗标数量" prop="washLabelNo">
          <el-input clearable v-model="addForm.washLabelNo"></el-input>
        </el-form-item>
        <el-form-item label="用料长度（米）" prop="materialLength">
          <el-input clearable v-model="addForm.materialLength"></el-input>
        </el-form-item>
        <el-form-item label="产品型号图片" prop="attachmentIds">
          <upload-images :imgList="imgList" v-on:fileListChange="fileListChange"></upload-images>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改产品型号-->
    <el-dialog
      title="修改产品型号"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="120px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="产品型号名称" prop="productTypeName">
          <el-input clearable v-model="editForm.productTypeName"></el-input>
        </el-form-item>
        <el-form-item label="产品型号编码" prop="productTypeCode">
          <el-input clearable v-model="editForm.productTypeCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="水洗标数量" prop="washLabelNo">
          <el-input clearable v-model="editForm.washLabelNo"></el-input>
        </el-form-item>
        <el-form-item label="用料长度（米）" prop="materialLength">
          <el-input clearable v-model="editForm.materialLength"></el-input>
        </el-form-item>
        <el-form-item label="产品型号图片" prop="attachmentIds">
          <upload-images :imgList="imgList" v-on:fileListChange="fileListChange"></upload-images>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <show-carousel-images :visible.sync="carouselDialogVisible" :imgList="this.attachmentUrls"></show-carousel-images>

    <product-type-attribute-value
      :visible.sync="attributeValueVisible"
      :productTypeCode="productTypeCode"
      v-on:refresh="refreshData">
    </product-type-attribute-value>

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
  /* 文本编辑器组件 */
  import { list, save, update, updateEnableStatus, remove, getById } from '@/api/productType'
  import BaseTable from '@/components/BaseTable'
  import ProductTypeAttributeValue from './productTypeAttribute.vue'
  export default {
    name: 'productType',
    components: { ProductTypeAttributeValue },
    extends: BaseTable,
    data() {
      return {
        listMethod: list,
        saveMethod: save,
        removeMethod: remove,
        getByIdMethod: getById,
        updateMethod: update,
        updateEnableStatusMethod: updateEnableStatus,

        productTypeCode: '',
        attributeValueVisible: false,

        searchForm: [{
          productTypeCode: ''
        }, {
          productTypeName: ''
        }],
        addForm: {
          productTypeCode: '',
          productTypeName: '',
          washLabelNo: 3,
          materialLength: 0,
          attachmentIds: ''
        },
        editForm: {
          id: '',
          productTypeCode: '',
          productTypeName: '',
          washLabelNo: '',
          materialLength: '',
          attachmentIds: '',
          attachmentUuid: ''
        },
        rules: {
          productTypeCode: [
            { required: true, message: '请输入产品型号编码', trigger: 'blur' }
          ],
          productTypeName: [
            { required: true, message: '请输入产品型号名称', trigger: 'blur' }
          ],
          washLabelNo: [
            { required: true, message: '请输入水洗标数量', trigger: 'blur' },
            { pattern: /^[1-9][0-9]*$/, message: '请输入纯数字且最小数是1', trigger: 'blur' }
          ],
          materialLength: [
            { required: true, message: '请输入用料长度', trigger: 'blur' },
            { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/, message: '请输入数字，如是小数，位数保留两位', trigger: 'blur' }
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
      this.fetchData(this.searchForm.productTypeCode, this.searchForm.productTypeName)
    },
    methods: {
      resetSearchForm() {
        this.searchForm[0].productTypeCode = ''
        this.searchForm[1].productTypeName = ''
      },
      /* 打开修改产品型号信息对话框 */
      goEdit() {
        this.preEdit().then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.productTypeCode = resp.data.data.productTypeCode
          this.editForm.productTypeName = resp.data.data.productTypeName
          this.editForm.washLabelNo = resp.data.data.washLabelNo
          this.editForm.materialLength = resp.data.data.materialLength * 1.0 / 100
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.imgList = resp.data.data.attachmentList
        }).catch(e => {
        })
      },
      goEditLine(id) {
        this.preEdit(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.productTypeCode = resp.data.data.productTypeCode
          this.editForm.productTypeName = resp.data.data.productTypeName
          this.editForm.washLabelNo = resp.data.data.washLabelNo
          this.editForm.materialLength = resp.data.data.materialLength * 1.0 / 100
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.imgList = resp.data.data.attachmentList
        }).catch(e => {
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        if (formName === 'addForm') {
          this.save(
            this.addForm.productTypeCode,
            this.addForm.productTypeName,
            this.addForm.washLabelNo,
            this.addForm.materialLength * 100,
            this.addForm.attachmentIds,
          )
        } else if (formName === 'editForm') {
          this.update(
            this.editForm.id,
            this.editForm.productTypeCode,
            this.editForm.productTypeName,
            this.editForm.washLabelNo,
            this.editForm.materialLength * 100,
            this.editForm.attachmentIds,
            this.editForm.attachmentUuid
          )
        }
      },
      goAttributeValue() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作',
            duration: 1500
          })
          return
        } else {
          const rows = this.multipleSelection
          this.attributeValueVisible = true
          this.productTypeCode = rows[0].productTypeCode
        }
      },
      goAttributeValueLine(code) {
        this.attributeValueVisible = true
        this.productTypeCode = code
      },
      refreshData() {
        this.fetchData(this.searchForm.productTypeCode, this.searchForm.productTypeName)
      }
    }
  }
</script>
<style scoped>

</style>

<style>
  .el-pagination .el-select .el-input .el-input__inner{
    height: 20px;
    font-size: 12px;
  }
  .el-pagination__editor.el-input .el-input__inner{
    height: 20px;
    font-size: 12px;
  }
</style>
