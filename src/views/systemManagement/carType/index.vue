<template>
  <div class="container">
    <el-form class="searchForm" :inline="true" :model="searchForm" ref="searchForm">
      <el-row>
        <el-form-item label="车型名称">
          <el-input clearable v-model="searchForm[2].carTypeName"></el-input>
        </el-form-item>
        <el-form-item label="车型编码">
          <el-input clearable v-model="searchForm[1].carTypeCode"></el-input>
        </el-form-item>
        <el-button type="primary" :loading="searchLoading" @click="search">查询</el-button>
        <el-button type="primary" @click="resetSearchForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden " code="add" @click="goAdd"><i class="el-icons-jd-add"></i>&nbsp;添加车型
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEdit"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改车型
      </el-button>
      <el-button class="el-button--primary hidden" icon="el-icons-jd-qiyong" code="enable" :loading="enableLoading" @click="enable">启用</el-button>
      <el-button class="el-button--danger hidden" icon="el-icons-jd-jinyong" code="disable" :loading="disableLoading" @click="disable">禁用</el-button>
      <el-button class="el-button--danger hidden" icon="el-icons-jd-shanchu" code="remove" :loading="removeLoading" @click="remove">&nbsp;删除车型
      </el-button>
    </div>
    <!--添加车型-->
    <el-dialog
      title="添加车型 "
      :visible.sync="addDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="品牌名" prop="brandCode">
          <el-select v-model="addForm.brandCode" placeholder="请选择" filterable :filter-method="filterBrand" clearable filterable>
            <el-option
              v-for="item in filterBrandOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型名称" prop="carTypeName">
          <el-input clearable v-model="addForm.carTypeName"></el-input>
        </el-form-item>
        <el-form-item label="车型编码" prop="carTypeCode">
          <el-input clearable v-model="addForm.carTypeCode"></el-input>
        </el-form-item>
        <el-form-item label="上市时间" prop="marketTime" style="width: 100%;">
          <el-date-picker
            style="width: 100%;"
            value-format="yyyy-MM-dd"
            v-model="addForm.marketTime"
            type="date"
            placeholder="选择上市时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车型图片" prop="imgList">
          <upload-images :imgList="imgList" :limitExceed="3" v-on:fileListChange="fileListChange"></upload-images>
        </el-form-item>
        <el-form-item label="车型简介" prop="carTypeIntroduction">
          <tinymce v-model="addForm.carTypeIntroduction"></tinymce>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改车型-->
    <el-dialog
      title="修改车型"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="品牌名" prop="brandCode">
          <el-select v-model="editForm.brandCode" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in filterBrandOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型名称" prop="carTypeName">
          <el-input clearable v-model="editForm.carTypeName"></el-input>
        </el-form-item>
        <el-form-item label="车型编码" prop="carTypeCode">
          <el-input clearable v-model="editForm.carTypeCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="上市时间" prop="marketTime">
          <el-date-picker
            style="width: 100%;"
            value-format="yyyy-MM-dd"
            v-model="editForm.marketTime"
            type="date"
            placeholder="选择上市时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车型图片" prop="imgList">
          <upload-images :imgList="imgList" :limitExceed="3" v-on:fileListChange="fileListChange"></upload-images>

        </el-form-item>
        <el-form-item label="车型简介" prop="carTypeIntroduction">
          <tinymce v-model="editForm.carTypeIntroduction"></tinymce>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <show-carousel-images :visible.sync="carouselDialogVisible" :imgList="this.attachmentUrls"></show-carousel-images>

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
      <el-table-column label="品牌">-->
        <template slot-scope="scope">
          {{scope.row.brandName}}
        </template>
      </el-table-column>
      <el-table-column label="车型名称">
        <template slot-scope="scope">
          {{scope.row.carTypeName}}
        </template>
      </el-table-column>
      <el-table-column label="车型编码">
        <template slot-scope="scope">
          {{scope.row.carTypeCode}}
        </template>
      </el-table-column>
      <el-table-column label="车型简介">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover">
            <div v-html="scope.row.carTypeIntroduction"></div>
            <div slot="reference" class="introduction">查看简介</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="查看图片">
        <template slot-scope="scope">
          <a style="text-decoration: underline;" href="javascript:void(0)"
             @click="showCarousel(scope.row.attachmentList)">查看图片</a>
        </template>
      </el-table-column>
      <el-table-column label="上市时间">
        <template slot-scope="scope">
          {{scope.row.marketTime}}
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
            content="修改车型">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.enableStatus === 0"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="启用车型">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="enable" icon="el-icons-jd-qiyong" @click="enableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover v-else
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="禁用车型">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="disable" icon="el-icons-jd-jinyong" @click="disableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="删除车型">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeLine(scope.row.id)"></el-button>
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
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  /* 文本编辑器组件 */
  import { list, save, update, remove, updateEnableStatus, getById } from '@/api/carType'
  import { listAllSelection } from '@/api/addOrder'
  import BaseTable from '@/components/BaseTable'

  export default {
    name: '车型管理',
    extends: BaseTable,
    components: {
      BaseTable
    },
    data() {
      return {
        listMethod: list,
        saveMethod: save,
        removeMethod: remove,
        getByIdMethod: getById,
        updateMethod: update,
        updateEnableStatusMethod: updateEnableStatus,
        brandOptions: [],
        filterBrandOptions: [],

        searchForm: [{
          brandCode: ''
        }, {
          carTypeCode: ''
        }, {
          carTypeName: ''
        }],
        addForm: {
          brandCode: '',
          carTypeName: '',
          carTypeCode: '',
          attachmentIds: '',
          marketTime: '',
          carTypeIntroduction: ''
        },
        editForm: {
          id: '',
          brandCode: '',
          carTypeName: '',
          carTypeCode: '',
          attachmentUuid: '',
          attachmentIds: '',
          marketTime: '',
          carTypeIntroduction: ''
        },
        rules: {
          carTypeName: [
            { required: true, message: '请输入车型名称', trigger: 'blur' }
          ],
          carTypeCode: [
            { required: true, message: '请输入车型编码', trigger: 'blur' }
          ],
          marketTime: [
            { required: true, message: '请选择上市时间', trigger: 'blur' }
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
      listAllSelection().then(resp => {
        this.brandOptions = resp.data.data.brandList
        this.filterBrandOptions = this.brandOptions
      })
      this.fetchData(...this._searchFormToList())
    },
    methods: {
      resetSearchForm() {
        this.searchForm[1].carTypeCode = ''
        this.searchForm[2].carTypeName = ''
      },
      filterBrand(value) {
        this.filterBrandOptions = this.brandOptions.filter(brand =>
          brand.code.indexOf(value) >= 0 ||
          brand.code.toLowerCase().indexOf(value) >= 0 ||
          brand.name.indexOf(value) >= 0)
      },
      /* 打开修改车型信息对话框 */
      goEdit() {
        this.preEdit().then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.brandCode = resp.data.data.brandCode
          this.editForm.carTypeName = resp.data.data.carTypeName
          this.editForm.carTypeCode = resp.data.data.carTypeCode
          this.editForm.carTypeIntroduction = resp.data.data.carTypeIntroduction
          this.editForm.marketTime = resp.data.data.marketTime
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.editForm.attachmentIds = resp.data.data.attachmentIds
          this.imgList = resp.data.data.attachmentList
        }).catch(e => {
        })
      },
      goEditLine(id) {
        this.preEdit(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.brandCode = resp.data.data.brandCode
          this.editForm.carTypeName = resp.data.data.carTypeName
          this.editForm.carTypeCode = resp.data.data.carTypeCode
          this.editForm.carTypeIntroduction = resp.data.data.carTypeIntroduction
          this.editForm.marketTime = resp.data.data.marketTime
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.editForm.attachmentIds = resp.data.data.attachmentIds
          this.imgList = resp.data.data.attachmentList
        }).catch(e => {
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        if (formName === 'addForm') {
          this.save(
            this.addForm.brandCode,
            this.addForm.carTypeName,
            this.addForm.carTypeCode,
            this.addForm.marketTime + ' 00:00:00',
            this.addForm.attachmentIds,
            this.addForm.carTypeIntroduction
          )
        } else if (formName === 'editForm') {
          this.update(
            this.editForm.id,
            this.editForm.brandCode,
            this.editForm.carTypeName,
            this.editForm.carTypeCode,
            this.editForm.marketTime + ' 00:00:00',
            this.editForm.attachmentUuid,
            this.editForm.attachmentIds,
            this.editForm.carTypeIntroduction
          )
        }
      }
    }
  }
</script>
<style scoped>

</style>
