<template>
  <el-dialog
    title="选择物料"
    :visible.sync="_visible"
    width="50%"
    :append-to-body=true
    @close="close"
    :before-close="handleClose">
  <div class="container">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="物料编码">
          <el-input clearable v-model="searchForm.materialCode"></el-input>
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input clearable v-model="searchForm.materialName"></el-input>
        </el-form-item>
        <el-form-item label="型号编码" prop="typeCode">
          <el-input v-model="searchForm.typeCode"></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-input v-model="searchForm.color"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetSearchForm">重置</el-button>
      </el-row>
    </el-form>
    <el-button type="primary" @click="gotoSave">保存</el-button>
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
      <el-table-column label="颜色">
        <template slot-scope="scope">
          {{scope.row.materialColor}}
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="scope">
          {{scope.row.unitName}}
        </template>
      </el-table-column>
      <el-table-column label="数量">
        <template slot-scope="scope">
          {{scope.row.amount}}
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
  </el-dialog>
</template>

<script>
  import { listMaterial } from '@/api/searchStorage'
  import { setDepartmentId } from '@/utils/departmentManage'
  import { setAreaType } from '@/utils/areaTypeManage'
  export default {
    name: 'materialManagement',
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      materialType: {
        type: Number,
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
        pageNum: 1,
        pageSize: 10,
        total: -1,
        dataList: [],
        listLoading: false,
        searchLoading: false,
        unitList: [],
        multipleSelection: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        checkedNodes: {},
        searchForm: {
          departmentId: null,
          materialCode: null,
          materialName: null,
          materialType: 3,
          typeCode: '',
          color: ''
        }
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
    watch: {
      areaType: {
        handler(e) {
          this.fetchData(3, null, null, this.searchForm.typeCode, this.searchForm.color, this.pageNum, this.pageSize)
        }
      },
      departmentId: {
        handler(e) {
          this.fetchData(3, null, null, this.searchForm.typeCode, this.searchForm.color, this.pageNum, this.pageSize)
        }
      },
      materialType() {
        this.searchForm.materialType = 3
      }
    },
    mounted() {
      this.fetchData(3, null, null, this.searchForm.typeCode, this.searchForm.color, this.pageNum, this.pageSize)
    },
    methods: {
      fetchData(materialType, materialCode, materialName, typeCode, color, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(this.departmentId)
        setAreaType(this.areaType)
        return listMaterial(
          typeCode,
          3,
          materialCode,
          materialName,
          null,
          color,
          pageNum,
          pageSize
        ).then(resp => {
          this.dataList = resp.data.data.rows
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          this.listLoading = false
        }).catch(e => {
          this.listLoading = false
        })
      },
      search() {
        this.pageNum = 1
        this.searchLoading = true
        this.fetchData(
          3,
          this.searchForm.materialCode,
          this.searchForm.materialName,
          this.searchForm.typeCode,
          this.searchForm.color,
          this.pageNum,
          this.pageSize
        ).then((resp) => {
          this.searchLoading = false
        })
      },
      resetSearchForm() {
        this.searchForm.materialCode = null
        this.searchForm.materialName = null
        this.searchForm.materialType = 3
        this.searchForm.typeCode = ''
        this.searchForm.color = ''
      },
      close() {
        this.$emit('update:visible', false)
      },
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        }).catch((e) => {
          // console.log(e)
          if (e !== 'cancel') {
            done()
          }
        })
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
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
        const s = this.multipleSelection[0]
        this.$emit('closeMaterial', {
          materialCode: s.materialCode,
          materialName: s.materialName,
          specificationValue: s.specificationValue,
          unitName: s.unitName,
          materialId: s.materialId,
          storageLocationCode: s.storageLocationCode
        })
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.search()
      },
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.search()
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
