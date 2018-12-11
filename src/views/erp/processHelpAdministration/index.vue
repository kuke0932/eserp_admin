<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="工序名称">
          <el-select  :clearable="true" v-model="searchForm[0].processCode" placeholder="请选择工序名称" clearable filterable>
            <el-option v-for="item in processList" :key="item.value" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="carBrandCode">
          <el-select  :clearable="true" v-model="searchForm[1].carBrandCode" placeholder="请选择品牌" @change="searchChangeBrandCode" clearable filterable>
            <el-option v-for="item in carBrands"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="carTypeCode">
          <el-select  :clearable="true" v-model="searchForm[2].carTypeCode" placeholder="请选择车型" clearable filterable>
            <el-option v-for="item in carTypes"
                       :key="item.code"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')" :loading="searchLoading">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAdd"><i
        class="el-icons-jd-tianjia3"></i>&nbsp;添加帮助
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEdit"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改帮助
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="remove"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除帮助
      </el-button>
    </div>
    <!--添加工序帮助-->
    <el-dialog
      title="添加工序帮助"
      :visible.sync="addDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm"
               :rules="rules"
               :model="addForm"
               label-width="80px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="工序名称" prop="processCode">
          <el-select  :clearable="true" v-model="addForm.processCode" placeholder="请选择工序名称" clearable filterable>
            <el-option v-for="item in processList" :key="item.value" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="carBrandCode">
          <el-select  :clearable="true" v-model="addForm.carBrandCode" placeholder="请选择品牌" @change="addChangeBrandCode" clearable filterable>
            <el-option v-for="item in carBrands"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="carTypeCode">
          <el-select  :clearable="true" v-model="addForm.carTypeCode" placeholder="请选择车型" clearable filterable>
            <el-option v-for="item in carTypes"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="帮助内容" prop="helpContent">
          <tinymce v-model="addForm.helpContent"></tinymce>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改工序帮助-->
    <el-dialog
      title="修改工序帮助"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm"
               :rules="rules"
               :model="editForm"
               label-width="80px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="工序名称" prop="processCode">
          <el-select  :clearable="true" v-model="editForm.processCode" placeholder="请选择工序名称" @change="changeProcessCode" clearable filterable>
            <el-option v-for="item in processList"
                       :key="item.value"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="carBrandCode">
          <el-select  :clearable="true" v-model="editForm.carBrandCode" placeholder="请选择品牌" @change="editChangeBrandCode" clearable filterable>
            <el-option v-for="item in carBrands"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="carTypeCode">
          <el-select  :clearable="true" v-model="editForm.carTypeCode" placeholder="请选择车型" clearable filterable>
            <el-option v-for="item in carTypes"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="帮助内容" prop="helpContent">
          <tinymce v-model="editForm.helpContent"></tinymce>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--工序列表-->
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
      <el-table-column label="工序名称">
        <template slot-scope="scope">
          {{scope.row.processName}}
        </template>
      </el-table-column>
      <el-table-column label="品牌">
        <template slot-scope="scope">
          {{scope.row.carBrandName}}
        </template>
      </el-table-column>
      <el-table-column label="车型">
        <template slot-scope="scope">
          {{scope.row.carTypeName}}
        </template>
      </el-table-column>
      <el-table-column label="帮助内容">
        <template slot-scope="scope">
          <div v-html="scope.row.helpContent"></div>
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
            content="修改帮助">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="删除帮助">
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
  import { authMenuButton } from '@/utils/authMenuButton'
  import Tinymce from '@/components/Tinymce' /* 文本编辑器组件 */
  import { list, save, update, updateEnableStatus, remove, getById } from '@/api/processHelpAdministration'
  import { listProcessSelection } from '@/api/processManagement'
  import { listAllSelection, listCarTypeByBrandCode } from '@/api/addOrder'
  import BaseTable from '@/components/BaseTable'

  export default {
    name: '车型工序帮助',
    extends: BaseTable,
    components: {
      Tinymce /* 文本编辑器组件 */
    },
    data() {
      return {
        listMethod: list,
        saveMethod: save,
        removeMethod: remove,
        getByIdMethod: getById,
        updateMethod: update,
        updateEnableStatusMethod: updateEnableStatus,

        processList: [],
        carBrands: [],
        carTypes: [],

        searchForm: [{
          processCode: ''
        }, {
          carBrandCode: ''
        }, {
          carTypeCode: ''
        }],
        addForm: {
          processCode: '',
          carBrandCode: '',
          carTypeCode: '',
          helpContent: ''
        },
        editForm: {
          id: '',
          processCode: '',
          carBrandCode: '',
          carTypeCode: '',
          helpContent: ''
        },
        rules: {
          processCode: [
            { required: true, message: '请选择工序名称', trigger: 'change' }
          ],
          carBrandCode: [
            { required: true, message: '请选择品牌', trigger: 'change' }
          ],
          carTypeCode: [
            { required: true, message: '请选择车型', trigger: 'change' }
          ],
          helpContent: [
            { required: true, message: '请输入帮助内容', trigger: 'blur' }
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
      authMenuButton(location.hash.substring(2))
      this.fetchData(...this._searchFormToList())
      // 显示工序名称
      listProcessSelection().then(resp => {
        for (let i = 0; i < resp.data.data.length; i++) {
          this.processList.push({ name: resp.data.data[i].name, code: resp.data.data[i].code })
        }
      })
      // 车的品牌
      listAllSelection().then(resp => {
        this.carBrands = resp.data.data.brandList
      })
    },
    methods: {
      /* 重置表单 */
      resetForm(formName) {
        this.searchForm[0].processCode = ''
        this.searchForm[1].carBrandCode = ''
        this.searchForm[2].carTypeCode = ''
        this.carTypes = []
        this.$refs[formName].resetFields()
      },
      /* 打开修改产品型号信息对话框 */
      goEdit() {
        this.preEdit().then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.processCode = resp.data.data.processCode
          this.editForm.carBrandCode = resp.data.data.carBrandCode
          listCarTypeByBrandCode(this.editForm.carBrandCode).then(resp => {
            this.carTypes = resp.data.data
          })
          this.editForm.carTypeCode = resp.data.data.carTypeCode
          this.editForm.helpContent = resp.data.data.helpContent
        }).catch(e => {
        })
      },
      /* 表格里操作按钮 修改 */
      goEditLine(id) {
        this.preEdit(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.processCode = resp.data.data.processCode
          this.editForm.carBrandCode = resp.data.data.carBrandCode
          listCarTypeByBrandCode(this.editForm.carBrandCode).then(resp => {
            this.carTypes = resp.data.data
          })
          this.editForm.carTypeCode = resp.data.data.carTypeCode
          this.editForm.helpContent = resp.data.data.helpContent
        }).catch(e => {
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        if (formName === 'addForm') {
          this.save(
            this.addForm.processCode,
            this.addForm.carBrandCode,
            this.addForm.carTypeCode,
            this.addForm.helpContent
          )
        } else if (formName === 'editForm') {
          this.update(
            this.editForm.id,
            this.editForm.processCode,
            this.editForm.carBrandCode,
            this.editForm.carTypeCode,
            this.editForm.helpContent
          )
        }
      },
      /* 添加品牌框改变时触发 */
      addChangeBrandCode() {
        listCarTypeByBrandCode(this.addForm.carBrandCode).then(resp => {
          this.addForm.carTypeCode = ''
          this.carTypes = resp.data.data
        })
      },
      /* 搜索品牌框改变时触发 */
      searchChangeBrandCode() {
        listCarTypeByBrandCode(this.searchForm[1].carBrandCode).then(resp => {
          this.searchForm[2].carTypeCode = ''
          this.carTypes = resp.data.data
        })
      },
      /* 修改 品牌框改变时触发 */
      editChangeBrandCode() {
        listCarTypeByBrandCode(this.editForm.carBrandCode).then(resp => {
          this.editForm.carTypeCode = ''
          this.carTypes = resp.data.data
        })
      },
      changeCarTypeCode(value) {
        this.editForm.carTypeCode = value
      },
      changeProcessCode(value) {
        this.editForm.processCode = value
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
