<template>
  <div class="container">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="部门"  prop="departmentId" v-if="enableDepartmentSelection">
          <el-select v-model="searchForm.departmentId" placeholder="请选择部门" clearable filterable>
            <el-option v-for="item in departmentSelections"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input clearable v-model="searchForm.materialCode"></el-input>
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input clearable v-model="searchForm.materialName"></el-input>
        </el-form-item>
        <el-form-item label="库位编码">
          <el-input clearable v-model="searchForm.storageLocationCode"></el-input>
        </el-form-item>
        <!--<el-form-item label="物料规格">-->
          <!--<el-input clearable v-model="searchForm.materialProductTypeCode"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="物料规格">
          <el-select v-model="searchForm.materialProductTypeCode" placeholder="请选择规格" clearable filterable>
            <el-option v-for="item in materialProductTypeList"
                       :key="item.code"
                       :label="item.code"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchData">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </el-row>
    </el-form>
    <el-table
      :data="searchStorageList"
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
          {{ scope.row.materialName }}
          <!--<el-dialog title="二维码" style="width: 50%; height: 50%; margin: 0 auto" :visible.sync="dialogTableVisible">-->
            <!--<img ref="imgNode" :src="scope.row.qrCodeUrl"/>-->
          <!--</el-dialog>-->
          <!--<el-button type="text" @click="dialogTableVisible = true" style="color: #000; text-decoration: underline;">{{ scope.row.materialName }}</el-button>-->
        </template>
      </el-table-column>
      <el-table-column label="规格颜色">
        <template slot-scope="scope">
          {{scope.row.specificationValue}}
        </template>
      </el-table-column>
      <el-table-column label="数量">
        <template slot-scope="scope">
          {{scope.row.amount}}
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="scope">
          {{scope.row.unitName}}
        </template>
      </el-table-column>
      <!--<el-table-column label="库位名称">
        <template slot-scope="scope">
          {{scope.row.storageLocationName}}
        </template>
      </el-table-column>-->
      <el-table-column label="库位号">
        <template slot-scope="scope">
          {{scope.row.storageLocationCode}}
        </template>
      </el-table-column>
      <!--<el-table-column label="二维码内容">-->
        <!--<template slot-scope="scope">-->

        <!--</template>-->
      <!--</el-table-column>-->
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
  import { listMaterial } from '@/api/searchStorage'
  import { getSelections as getSelection } from '@/api/materialProduct'
  import { setDepartmentId } from '@/utils/departmentManage'
  import { setAreaType } from '@/utils/areaTypeManage'
  import { getSelections } from '@/api/department'
  export default {
    name: '原材料库存查询',
    data() {
      return {
        materialProductTypeList: [],
        searchData: false,
        dialogTableVisible: false,
        enableDepartmentSelection: false,
        departmentSelections: [],
        total: -1,
        searchStorageList: [],
        listLoading: false,
        searchForm: {
          materialCode: '',
          materialName: '',
          storageLocationCode: '',
          materialProductTypeCode: '',
          departmentId: null
        },
        treeHeight: 0,
        pageSize: 10,
        pageNum: 1
      }
    },
    watch: {
      searchStorageList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    created() {
      this.treeHeight = document.body.clientHeight - 500
    },
    mounted() {
      // TODO(参数改成从菜单里面获取的部门类型)
      this.getDepartmentSelections(2)
      setAreaType(1)
      getSelection(1).then(resp => {
        this.materialProductTypeList = resp.data.data.materialProductTypeList
      })
    },
    methods: {
      /* 获取部门下拉框 */
      getDepartmentSelections(departmentType) {
        getSelections(departmentType).then(resp => {
          this.departmentSelections = resp.data.data
          if (this.departmentSelections.length > 1) {
            this.enableDepartmentSelection = true
          }
          this.searchForm.departmentId = this.departmentSelections[0].code
          this.fetchData(this.departmentSelections[0].code, null, 1, null, null, null, this.pageNum, this.pageSize)
        })
      },
      fetchData(departmentId, materialProductTypeCode, materialType, materialCode, materialName, storageLocationCode, pageNum, pageSize) {
        this.listLoading = false
        setDepartmentId(departmentId)
        setAreaType(1)
        return listMaterial(
          materialProductTypeCode,
          materialType,
          materialCode,
          materialName,
          storageLocationCode,
          null,
          pageNum,
          pageSize
        ).then(response => {
          this.searchStorageList = response.data.data.rows
          this.searchStorageList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
          return response
        }).catch(e => {
          this.listLoading = false
        })
      },
      // 搜索
      search() {
        this.searchData = true
        this.pageNum = 1
        this.fetchData(
          this.searchForm.departmentId,
          this.searchForm.materialProductTypeCode,
          1,
          this.searchForm.materialCode,
          this.searchForm.materialName,
          this.searchForm.storageLocationCode,
          this.pageNum,
          this.pageSize
        ).then(resp => {
          this.searchData = false
        })
      },
      // 重置
      resetForm() {
        this.searchForm.materialCode = ''
        this.searchForm.materialName = ''
        this.searchForm.storageLocationCode = ''
        this.searchForm.materialProductTypeCode = ''
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(
          this.searchForm.departmentId,
          this.searchForm.materialProductTypeCode,
          1,
          this.searchForm.materialCode,
          this.searchForm.materialName,
          this.searchForm.storageLocationCode,
          this.pageNum,
          this.pageSize
        )
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(
          this.searchForm.departmentId,
          this.searchForm.materialProductTypeCode,
          1,
          this.searchForm.materialCode,
          this.searchForm.materialName,
          this.searchForm.storageLocationCode,
          this.pageNum,
          this.pageSize
        )
      }
    }
  }
</script>

<style scoped>

</style>
