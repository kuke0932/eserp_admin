<template>
  <div class="container">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="品牌名称">
          <el-input clearable v-model="searchForm[1].brandName"></el-input>
        </el-form-item>
        <el-form-item label="品牌编码">
          <el-input clearable v-model="searchForm[0].brandCode"></el-input>
        </el-form-item>
        <el-button type="primary" :loading="searchLoading" @click="search">查询</el-button>
        <el-button type="primary" @click="resetSearchForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAdd"><i class="el-icons-jd-add"></i>&nbsp;添加品牌
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEdit"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改品牌
      </el-button>
      <el-button class="el-button--primary hidden" code="enable" :loading="enableLoading" @click="enable"><i
        class="el-icons-jd-qiyong"></i>&nbsp;启用</el-button>
      <el-button class="el-button--danger hidden" code="disable" :loading="disableLoading" @click="disable"><i
        class="el-icons-jd-jinyong"></i>&nbsp;禁用</el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="remove"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除品牌
      </el-button>
    </div>
    <!--添加品牌-->
    <el-dialog
      title="添加品牌 "
      :visible.sync="addDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="品牌名称" prop="brandName">
          <el-input clearable v-model="addForm.brandName"></el-input>
        </el-form-item>
        <el-form-item label="品牌编码" prop="brandCode">
          <el-input clearable v-model="addForm.brandCode"></el-input>
        </el-form-item>

        <el-form-item label="品牌简介" prop="brandIntroduction">
          <tinymce v-model="addForm.brandIntroduction"></tinymce>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改品牌-->
    <el-dialog
      title="修改品牌"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="品牌名称" prop="brandName">
          <el-input clearable v-model="editForm.brandName"></el-input>
        </el-form-item>
        <el-form-item label="品牌编码" prop="brandCode">
          <el-input clearable v-model="editForm.brandCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="品牌简介" prop="brandIntroduction">
          <tinymce ref="editTinyMce" v-model="editForm.brandIntroduction"></tinymce>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
      <el-table-column label="品牌名称">
        <template slot-scope="scope">
          {{scope.row.brandName}}
        </template>
      </el-table-column>
      <el-table-column label="品牌编码">
        <template slot-scope="scope">
          {{scope.row.brandCode}}
        </template>
      </el-table-column>
      <el-table-column label="品牌简介">
        <template slot-scope="scope">
          <el-popover v-if="!!scope.row.brandIntroduction"
            placement="top-start"
            width="300"
            trigger="hover">
            <div v-html="scope.row.brandIntroduction"></div>
            <div slot="reference" class="introduction">查看简介</div>
          </el-popover>
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
            content="修改品牌">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.enableStatus === 0"
            placement="top-start"
            width="100"
            trigger="hover"
            content="启用品牌">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="enable" icon="el-icons-jd-qiyong" @click="enableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover v-else
            placement="top-start"
            width="100"
            trigger="hover"
            content="禁用品牌">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="disable" icon="el-icons-jd-jinyong" @click="disableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <!--<el-tooltip content="Top center" placement="top">-->
            <!--<el-button class="icon-btn hidden" type="text" code="disable" icon="el-icons-jd-jinyong" @click="disableLine(scope.row.id, scope.row.enableStatus)"></el-button>-->
          <!--</el-tooltip>-->
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
  import { list, save, update, updateEnableStatus, remove, getById } from '@/api/brand'
  import BaseTable from '@/components/BaseTable'

  export default {
    name: 'carBrand',
    components: {},
    extends: BaseTable,
    data() {
      return {
        listMethod: list,
        saveMethod: save,
        removeMethod: remove,
        getByIdMethod: getById,
        updateMethod: update,
        updateEnableStatusMethod: updateEnableStatus,

        searchForm: [{
          brandCode: ''
        }, {
          brandName: ''
        }, {
          brandIntroduction: ''
        }],
        addForm: {
          brandCode: '',
          brandName: '',
          brandIntroduction: ''
        },
        editForm: {
          id: '',
          brandCode: '',
          brandName: '',
          brandIntroduction: ''
        },
        rules: {
          brandCode: [
            { required: true, message: '请输入品牌编码', trigger: 'blur' }
          ],
          brandName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      dataList(list) {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(this.searchForm[0].brandCode, this.searchForm[1].brandName, null)
    },
    methods: {
      /* 打开修改品牌信息对话框 */
      goEdit() {
        this.preEdit().then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.brandCode = resp.data.data.brandCode
          this.editForm.brandName = resp.data.data.brandName
          this.editForm.brandIntroduction = resp.data.data.brandIntroduction || ''
          this.$refs['']
        }).catch(e => {
        })
      },
      goEditLine(id) {
        this.preEdit(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.brandCode = resp.data.data.brandCode
          this.editForm.brandName = resp.data.data.brandName
          this.editForm.brandIntroduction = resp.data.data.brandIntroduction || ''
        }).catch(e => {
        })
      },
      resetSearchForm() {
        this.searchForm[0].brandCode = ''
        this.searchForm[1].brandName = ''
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        if (formName === 'addForm') {
          this.save(
            this.addForm.brandCode,
            this.addForm.brandName,
            this.addForm.brandIntroduction,
          )
        } else if (formName === 'editForm') {
          this.update(
            this.editForm.id,
            this.editForm.brandCode,
            this.editForm.brandName,
            this.editForm.brandIntroduction
          )
        }
      }
    }
  }
</script>
<style scoped>

</style>
