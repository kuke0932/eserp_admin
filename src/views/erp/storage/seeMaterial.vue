<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row :gutter="20">
        <el-form-item label="物料编码" prop="shelfCode">
          <el-input clearable v-model="searchForm.materielCode"></el-input>
        </el-form-item>
        <el-form-item label="物料名称" prop="shelfCode">
          <el-input clearable v-model="searchForm.materielName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="searchMaterial">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-dialog
      title="查看物料"
      :visible.sync="valueManageDialogVisible"
      width="80%"
      height="80%"
      :before-close="handleClose">
      <see-material :specificationCode="specificationCode"></see-material>
    </el-dialog>
    <!--货架列表-->
    <el-table
      :data="storageList"
      element-loading-text="拼命加载中"
      v-loading="materialList"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="物料编码">
        <template slot-scope="scope">
          {{scope.row.materialCode}}
        </template>
      </el-table-column>
      <el-table-column label="物料名称">
        <template slot-scope="scope">
          {{scope.row.materialName}}
        </template>
      </el-table-column>
      <el-table-column label="规格">
        <template slot-scope="scope">
          {{scope.row.specificationValue}}
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column label="物料类型">
        <template slot-scope="scope">

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
  import { listMaterial } from '@/api/seeMaterial'
  import { setDepartmentId } from '@/utils/departmentManage'
  import { setAreaType } from '@/utils/areaTypeManage'
  import BaseTable from '@/components/BaseTable'
  export default {
    name: 'seeMaterial',
    extends: BaseTable,
    props: {
      specificationCode: {
        type: String,
        required: true
      },
      departmentId: {
        type: String,
        required: true
      },
      areaType: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        valueManageDialogVisible: false,
        searchMaterial: false,
        materialList: false,
        storageList: null,
        searchForm: {
          materielCode: null,
          materielName: null
        }
      }
    },
    mounted() {
      this.fetchData(null, 2, null, null, null, this.pageNum, this.pageSize)
    },
    watch: {
      specificationCode: function() {
        this.fetchData(null, 2, null, null, this.specificationCode, this.pageNum, this.pageSize)
      },
      areaType: {
        handler(e) {
          this.fetchData(null, 2, null, null, this.specificationCode, this.pageNum, this.pageSize)
        }
      },
      departmentId: {
        handler(e) {
          this.fetchData(null, 2, null, null, this.specificationCode, this.pageNum, this.pageSize)
        }
      }
    },
    methods: {
      search() {
        this.searchMaterial = true
        this.fetchData(null, null, this.searchForm.materielCode, this.searchForm.materielName, null, this.pageNum, this.pageSize).then(resp => {
          this.searchMaterial = false
        })
      },
      /* 获取所勾选需求 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.specificationValueList, this.materialType, this.materialCode, this.materialName, this.storageLocationCode, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.specificationValueList, this.materialType, this.materialCode, this.materialName, this.storageLocationCode, this.pageNum, this.pageSize)
      },
      fetchData(specificationValueList, materialType, materialCode, materialName, storageLocationCode, pageNum, pageSize) {
        this.materialList = true
        setDepartmentId(this.departmentId)
        setAreaType(this.areaType)
        return listMaterial(
          specificationValueList,
          materialType,
          materialCode,
          materialName,
          storageLocationCode,
          pageNum,
          pageSize
        ).then(response => {
          this.storageList = response.data.data.rows
          this.storageList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.materialList = false
          return response
        }).catch(e => {
          this.materialList = false
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
        }).catch(() => {

        })
      }
    }
  }

</script>

<style scoped>

</style>
