<template>
  <div class="container">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="部门"  prop="departmentId" v-if="enableDepartmentSelection">
          <el-select v-model="searchForm[5].departmentId" placeholder="请选择部门" clearable filterable>
            <el-option v-for="item in departmentSelections"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="淘宝产品编码">
          <el-input clearable v-model="searchForm[1].code"></el-input>
        </el-form-item>
        <el-form-item label="淘宝产品名称">
          <el-input clearable v-model="searchForm[2].name"></el-input>
        </el-form-item>
        <el-form-item label="型号编码">
          <el-input clearable v-model="searchForm[3].typeCode"></el-input>
        </el-form-item>
        <el-form-item label="颜色">
          <el-input clearable v-model="searchForm[4].color"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetSearchForm">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAdd"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;添加淘宝产品
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEdit"><i
        class="el-icons-jd-shanchu"></i>&nbsp;修改淘宝产品
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="remove"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除淘宝产品
      </el-button>
    </div>
    <!--添加淘宝产品-->
    <el-dialog
      title="添加淘宝产品"
      :visible.sync="addDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="120px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="淘宝产品编码" prop="code">
          <el-input clearable v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="淘宝产品名称" prop="name">
          <el-input clearable v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="typeCode">
          <el-select :clearable="true"  v-model="addForm.typeCode" placeholder="请选择规格型号" filterable>
            <el-option v-for="item in materialProductTypeList"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input clearable v-model="addForm.color"></el-input>
        </el-form-item>
        <el-form-item label="单价（元）" prop="price">
          <el-input clearable v-model="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unitCode">
          <el-select  :clearable="true" v-model="addForm.unitCode" placeholder="请选择单位" filterable>
            <el-option v-for="item in unitList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetAddForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改淘宝产品-->
    <el-dialog
      title="修改淘宝产品"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="120px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="淘宝产品编码" prop="code">
          <el-input clearable v-model="editForm.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="淘宝产品名称" prop="name">
          <el-input clearable v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="typeCode">
          <el-select :clearable="true"  v-model="editForm.typeCode" placeholder="请选择规格型号" filterable>
            <el-option v-for="item in materialProductTypeList"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input clearable v-model="editForm.color"></el-input>
        </el-form-item>
        <el-form-item label="单价（元）" prop="price">
          <el-input clearable v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unitCode">
          <el-select  :clearable="true" v-model="editForm.unitCode" placeholder="请选择单位" filterable>
            <el-option v-for="item in unitList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetEditForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--淘宝产品列表-->
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
      <el-table-column label="淘宝产品编码">
        <template slot-scope="scope">
          {{scope.row.code}}
        </template>
      </el-table-column>
      <el-table-column label="淘宝产品名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="规格型号">
        <template slot-scope="scope">
          {{scope.row.typeName}}
        </template>
      </el-table-column>
      <el-table-column label="颜色">
        <template slot-scope="scope">
          {{scope.row.color}}
        </template>
      </el-table-column>
      <el-table-column label="单价（元）">
        <template slot-scope="scope">
          {{scope.row.price * 1.0 / 100}}
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="scope">
          {{scope.row.unitName}}
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改淘宝产品">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="删除淘宝产品">
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
  import { list, save, update, updateEnableStatus, remove, getById, getSelections } from '@/api/materialProduct'
  import { getSelections as getDepartmentSelections } from '@/api/department'
  import { setAreaType } from '@/utils/areaTypeManage'
  import { setDepartmentId } from '@/utils/departmentManage'
  import BaseTable from '@/components/BaseTable'

  export default {
    name: 'materialProduct',
    extends: BaseTable,
    data() {
      return {
        listMethod: list,
        saveMethod: save,
        setAreaType: setAreaType,
        removeMethod: remove,
        getByIdMethod: getById,
        updateMethod: update,
        updateEnableStatusMethod: updateEnableStatus,

        enableDepartmentSelection: false,
        unitList: [],
        areaType: null,
        materialProductTypeList: [],
        departmentSelections: [],
        ownerDepartmentId: null,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        checkedNodes: {},

        searchForm: [{
          type: 3
        }, {
          code: null
        }, {
          name: null
        }, {
          typeCode: null
        }, {
          color: null
        }, {
          departmentId: null
        }],
        addForm: {
          code: null,
          name: null,
          price: null,
          unitCode: null,
          typeCode: null,
          color: null,
          type: 3
        },
        editForm: {
          id: null,
          code: null,
          name: null,
          price: null,
          unitCode: null,
          typeCode: null,
          color: null,
          type: 3
        },
        rules: {
          code: [
            { required: true, message: '请输入淘宝产品编码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入淘宝产品名称', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入淘宝产品价格', trigger: 'blur' },
            { pattern: /^[0-9\.]*$/, message: '请输入纯数字', trigger: 'blur' }
          ],
          typeCode: [
            { required: true, message: '请选择规格型号', trigger: 'change' }
          ],
          unitCode: [
            { required: true, message: '请选择单位', trigger: 'change' }
          ],
          color: [
            { required: true, message: '请输入颜色', trigger: 'blur' }
          ]
        }
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.areaType = to.query.areaType
      this.fetchData(...this._searchFormToList())
      next()
    },
    watch: {
      dataList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      },
      $route: {
        handler(e) {
          this.areaType = parseInt(e.query.areaType)
        },
        immediate: true
      }
    },
    mounted() {
      // TODO(参数改成从菜单里面获取的部门类型)
      this.getDepartmentSelections(2).then(() => {
        setAreaType(this.areaType)
        getSelections(3).then(resp => {
          this.unitList = resp.data.data.unitList
          this.materialProductTypeList = resp.data.data.materialProductTypeList
        })
      })
      getDepartmentSelections(5).then(resp => {
        this.ownerDepartmentId = resp.data.data[0].code
      })
    },
    methods: {
      /* 获取部门下拉框 */
      getDepartmentSelections(departmentType) {
        return getDepartmentSelections(departmentType).then(resp => {
          this.departmentSelections = resp.data.data
          if (this.departmentSelections.length > 1) {
            this.enableDepartmentSelection = true
          }
          this.searchForm[5].departmentId = this.departmentSelections[0].code
          setAreaType(this.areaType)
          this.fetchData(...this._searchFormToList())
        })
      },
      currentNodeClick(current, node) {
      },
      nodeCheckChange(node, check) {
      },
      resetSearchForm() {
        this.searchForm[1].code = ''
        this.searchForm[2].name = ''
      },
      resetAddForm() {
        this.addForm.processCode = ''
        this.addForm.carTypeCode = ''
        this.addForm.helpContent = ''
      },
      resetEditForm() {
        this.editForm.processCode = ''
        this.editForm.carTypeCode = ''
        this.editForm.helpContent = ''
      },
      /* 打开修改产品型号信息对话框 */
      goEdit() {
        this.preEdit().then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.code = resp.data.data.code
          this.editForm.name = resp.data.data.name
          this.editForm.price = resp.data.data.price * 1.0 / 100
          this.editForm.typeCode = resp.data.data.typeCode
          this.editForm.color = resp.data.data.color
          this.editForm.unitCode = resp.data.data.unitCode
        }).catch(e => {
        })
      },
      /* 表格里操作按钮 修改 */
      goEditLine(id) {
        this.editForm.id = id
        getById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.code = resp.data.data.code
          this.editForm.name = resp.data.data.name
          this.editForm.price = resp.data.data.price * 1.0 / 100
          this.editForm.typeCode = resp.data.data.typeCode
          this.editForm.color = resp.data.data.color
          this.editForm.unitCode = resp.data.data.unitCode
        })
        this.editDialogVisible = true
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        if (formName === 'addForm') {
          setAreaType(this.areaType)
          setDepartmentId(this.ownerDepartmentId)
          this.save(
            this.addForm.code,
            this.addForm.name,
            this.addForm.price * 100,
            this.addForm.unitCode,
            this.addForm.typeCode,
            this.addForm.color,
            this.addForm.type
          )
        } else if (formName === 'editForm') {
          setDepartmentId(this.ownerDepartmentId)
          this.update(
            this.editForm.id,
            this.editForm.code,
            this.editForm.name,
            this.editForm.price * 100,
            this.editForm.unitCode,
            this.editForm.typeCode,
            this.editForm.color,
            this.editForm.type
          )
        }
      }
    }
  }
</script>

<style scoped>

</style>
