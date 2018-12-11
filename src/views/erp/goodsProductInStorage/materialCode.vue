<template>
  <div class="container">
    <el-form class="searchForm" ref="searchForm" :model="searchForm" :inline="true">
      <el-row>
        <el-form-item label="物料编码" prop="code">
          <el-input clearable v-model="searchForm.code"></el-input>
        </el-form-item>
        <el-form-item label="物料名称" prop="name">
          <el-input clearable v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="型号编码" prop="typeCode">
          <el-input clearable v-model="searchForm.typeCode"></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input clearable v-model="searchForm.color"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="resetSearchForm">重置</el-button>
      </el-row>
    </el-form>
    <el-button type="primary" @click="gotoSave" :loading="conserveLoading">保存</el-button>
    <!--物料列表-->
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
      <el-table-column label="物料编码">
        <template slot-scope="scope">
          {{scope.row.code}}
        </template>
      </el-table-column>
      <el-table-column label="物料名称">
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
      <el-table-column label="单价（分）">
        <template slot-scope="scope">
          {{scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="scope">
          {{scope.row.unitName}}
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
  import { list } from '@/api/materialProduct'
  import { setAreaType } from '@/utils/areaTypeManage'
  import { setAreaType as setAreaTypeMethod } from '@/utils/areaTypeManage'

  export default {
    name: 'materialManagement',
    props: {
      material: {
        type: Object,
        required: false
      },
      materialEdit: {
        type: Object,
        required: false
      },
      addOrUpdate: {
        type: Boolean,
        required: true
      },
      areaType: {
        type: Number,
        required: true
      },
      departmentId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        total: -1,
        pages: 1,
        pageNum: 1,
        pageSize: 10,
        dataList: null,
        listLoading: false,
        searchButton: false,
        setAreaType: setAreaTypeMethod,
        multipleSelection: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        searchForm: {
          type: 3,
          code: null,
          name: null,
          typeCode: null,
          color: null
        },
        conserveLoading: false
      }
    },
    watch: {
      dataList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      },
      areaType: {
        handler(e) {
          this.fetchData(
            3,
            this.searchForm.code,
            this.searchForm.name,
            this.searchForm.typeCode,
            this.searchForm.color,
            this.departmentId,
            this.pageNum,
            this.pageSize
          )
        }
      },
      departmentId: {
        handler(e) {
          this.fetchData(
            3,
            this.searchForm.code,
            this.searchForm.name,
            this.searchForm.typeCode,
            this.searchForm.color,
            this.departmentId,
            this.pageNum,
            this.pageSize
          )
        }
      }
    },
    mounted() {
      this.fetchData(
        3,
        this.searchForm.code,
        this.searchForm.name,
        this.searchForm.typeCode,
        this.searchForm.color,
        this.departmentId,
        this.pageNum,
        this.pageSize
      )
    },
    methods: {
      fetchData(type, code, name, typeCode, color, departmentId, pageNum, pageSize) {
        this.listLoading = true
        setAreaType(this.areaType)
        return list(
          type,
          code,
          name,
          typeCode,
          color,
          departmentId,
          pageNum,
          pageSize
        ).then(resp => {
          this.dataList = resp.data.data.rows
          // todo 这是干嘛用的？
          /* this.storageList.forEach((e, i) => {
            e['idx'] = i
          })*/
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          if (resp.data.data.pages === 0) {
            this.pages = 1
          } else {
            this.pages = resp.data.data.pages
          }
          this.listLoading = false
          return resp
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 查询按钮 */
      search() {
        this.searchButton = true
        this.fetchData(
          this.searchForm.type,
          this.searchForm.code,
          this.searchForm.name,
          this.searchForm.typeCode,
          this.searchForm.color,
          this.departmentId,
          this.pageNum,
          this.pageSize
        ).then(resp => {
          this.searchButton = false
        })
      },
      /* 重置选项 */
      resetSearchForm() {
        this.$refs['searchForm'].resetFields()
      },
      /* 点击保存按钮执行的操作 */
      gotoSave() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.listLoading = true
        this.conserveLoading = true
        if (this.addOrUpdate) {
          this.material.materialId = this.multipleSelection[0].id
          this.material.code = this.multipleSelection[0].code
          this.material.name = this.multipleSelection[0].name
          this.material.specificationValue = this.multipleSelection[0].typeName
          this.material.unitName = this.multipleSelection[0].unitName
          this.listLoading = false
          this.conserveLoading = false
        } else {
          this.materialEdit.materialId = this.multipleSelection[0].id
          this.materialEdit.code = this.multipleSelection[0].code
          this.materialEdit.name = this.multipleSelection[0].name
          this.materialEdit.specificationValue = this.multipleSelection[0].typeName
          this.materialEdit.unitName = this.multipleSelection[0].unitName
          this.listLoading = false
          this.conserveLoading = false
        }
        this.$emit('closeSupplier')
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.listLoading = true
        this.fetchData(
          this.searchForm.type,
          this.searchForm.code,
          this.searchForm.name,
          this.searchForm.typeCode,
          this.searchForm.color,
          this.departmentId,
          this.pageNum,
          this.pageSize
        )
      },
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.listLoading = true
        this.fetchData(
          this.searchForm.type,
          this.searchForm.code,
          this.searchForm.name,
          this.searchForm.typeCode,
          this.searchForm.color,
          this.departmentId,
          this.pageNum,
          this.pageSize
        )
      },
      /* 选项发生变化时 */
      handleSelectionChange(selection) {
        this.multipleSelection = selection
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
