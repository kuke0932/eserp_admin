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
        <el-form-item label="产品编码">
          <el-input clearable v-model="searchForm.productNo"></el-input>
        </el-form-item>
        <el-form-item label="库位编码">
          <el-input clearable v-model="searchForm.storageLocationCode"></el-input>
        </el-form-item>
        <el-form-item label="汽车品牌" prop="carBrandChange">
          <el-select v-model="searchForm.brandCode" clearable placeholder="请选择" @change="carBrandChange" clearable filterable>
            <el-option
              v-for="item in carBrandData"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型编号">
          <el-select v-model="searchForm.carTypeCode" clearable placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in carNumberData"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-select v-model="searchForm.productTypeCode" clearable placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in productModelData"
              :key="item.code"
              :label="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品属性">
          <el-input clearable @focus="onFocus" v-model="treeData" v-popover:popoverTree readonly></el-input>
        </el-form-item>
        <el-popover
          ref="popoverTree"
          placement="bottom-start"
          title="材料样式"
          width="400"
          trigger="click">
          <el-tree
            :data="finishedProductTree"
            ref="dataTree"
            node-key="id"
            show-checkbox
            highlight-current
            @check-change="nodeCheckChange">
          </el-tree>
        </el-popover>
        <el-button type="primary" @click="search" :loading="searchData">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </el-row>
    </el-form>
    <el-table
      :data="finishedProductList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="产品编码">
        <template slot-scope="scope">
          {{scope.row.productNo}}
        </template>
      </el-table-column>
      <!--<el-table-column label="物料名称">-->
        <!--<template slot-scope="scope">-->
          <!--<el-dialog title="二维码" style="width: 50%; height: 50%; margin: 0 auto" :visible.sync="dialogTableVisible">-->
            <!--<img :src="scope.row.qrCodeUrl"/>-->
          <!--</el-dialog>-->
          <!--<el-button type="text" @click="dialogTableVisible = true" style="color: #000; text-decoration: underline;">{{ scope.row.productName }}</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="规格颜色">
        <template slot-scope="scope">
          {{scope.row.content}}
        </template>
      </el-table-column>
      <!--<el-table-column label="类型">-->
        <!--<template slot-scope="scope">-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="库位">
        <template slot-scope="scope">
          {{scope.row.storageLocationCode}}
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
  import { listProduct, tree4ProductType, listProductStorageSelection, listCarTypeByBrandCode } from '@/api/finishedProduct'
  import { getSelections } from '@/api/department'
  import { setDepartmentId } from '@/utils/departmentManage'

  export default {
    name: '成品库存查询',
    data() {
      return {
        searchData: false,
        dialogTableVisible: false,
        treeData: '',
        total: -1,
        listLoading: false,
        enableDepartmentSelection: false,
        departmentSelections: [],
        searchForm: {
          departmentId: null,
          productNo: '',
          storageLocationCode: '',
          brandCode: '',
          carTypeCode: '',
          productTypeCode: ''
        },
        finishedProductList: [],
        treeHeight: 0,
        pageSize: 10,
        pageNum: 1,
        finishedProductTree: [],
        productAttributeList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        carBrandData: [],
        carNumberData: [],
        productModelData: []
      }
    },
    watch: {
      finishedProductList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    created() {
      this.treeHeight = document.body.clientHeight - 500
      tree4ProductType().then(resp => {
        this.finishedProductTree = resp.data.data
      })
    },
    mounted() {
      // TODO(参数改成从菜单里面获取的部门类型)
      this.getDepartmentSelections(2)
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
          this.fetchData(this.departmentSelections[0].code, null, null, null, null, null, null, this.pageNum, this.pageSize)
        })
      },
      fetchData(departmentId, productAttributeList, productNo, storageLocationCode, brandCode, carTypeCode, productTypeCode, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(departmentId)
        listProduct(
          productAttributeList,
          productNo,
          storageLocationCode,
          brandCode,
          carTypeCode,
          productTypeCode,
          pageNum,
          pageSize
        ).then(response => {
          this.finishedProductList = response.data.data.rows
          this.finishedProductList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
          this.searchData = false
        })
        listProductStorageSelection().then(value => {
          this.carBrandData = value.data.data.brandList
          this.productModelData = value.data.data.productTypeList
        })
      },
      // 搜索
      search() {
        this.listLoading = true
        this.searchData = true
        this.pageNum = 1
        this.fetchData(
          this.searchForm.departmentId,
          this.productAttributeList,
          this.searchForm.productNo,
          this.searchForm.storageLocationCode,
          this.searchForm.brandCode,
          this.searchForm.carTypeCode,
          this.searchForm.productTypeCode,
          this.pageNum,
          this.pageSize
        )
      },
      // 重置
      resetForm() {
        this.searchForm.productNo = ''
        this.searchForm.storageLocationCode = ''
        this.searchForm.brandCode = ''
        this.searchForm.carTypeCode = ''
        this.searchForm.productTypeCode = ''
        this.treeData = ''
        this.productAttributeList = []
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(
          this.searchForm.departmentId,
          this.searchForm.productAttributeList,
          this.searchForm.productNo,
          this.searchForm.storageLocationCode,
          this.searchForm.brandCode,
          this.searchForm.carTypeCode,
          this.searchForm.productTypeCode,
          this.pageNum,
          this.pageSize
        )
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(
          this.searchForm.departmentId,
          this.searchForm.productAttributeList,
          this.searchForm.productNo,
          this.searchForm.storageLocationCode,
          this.searchForm.brandCode,
          this.searchForm.carTypeCode,
          this.searchForm.productTypeCode,
          this.pageNum,
          this.pageSize
        )
      },
      // 清空tree数据的勾选
      onFocus() {
        this.finishedProductTree.forEach((val, i) => {
          val.children.forEach((v) => {
            this.$refs.dataTree.setChecked(v.id, false, false)
          })
        })
      },
      /* 输入框显示数据 */
      nodeCheckChange() {
        this.treeData = ''
        this.productAttributeList = []
        const treeAllDate = this.finishedProductTree
        const nodes = this.$refs['dataTree'].getCheckedNodes()
        for (let i = 0; nodes.length > i; i++) {
          const node = nodes[i]
          if (node.parentId) {
            const data = (node.parentId.split(',')[1] + node.id.split(',')[1])
            this.productAttributeList.push(data)
          }
        }
        for (let j = 0; treeAllDate.length > j; j++) {
          for (let v = 0; nodes.length > v; v++) {
            if (treeAllDate[j].id === nodes[v].parentId) {
              this.treeData += treeAllDate[j].label + ':' + nodes[v].label + ';'
            }
          }
        }
      },
      carBrandChange(val) {
        listCarTypeByBrandCode(val).then(resp => {
          this.carNumberData = resp.data.data
        })
      }
    }
  }

</script>

<style scoped>

</style>
