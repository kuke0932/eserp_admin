<template>
  <el-dialog
    title="物料信息"
    :visible.sync="_visible"
    width="50%"
    :append-to-body=true
    @close="close"
    :before-close="handleClose">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="类型" prop="type">
          <el-select v-model="searchForm[0].type" filterable>
            <el-option v-for="item in materialTypeList"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input clearable v-model="searchForm[1].code"></el-input>
        </el-form-item>
        <el-form-item label="物料名称">
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
    <el-button type="primary" @click="gotoSave">保存</el-button>
    <br />
    <!--物料列表-->
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
  </el-dialog>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { list } from '@/api/materialProduct'
  import { setAreaType } from '@/utils/areaTypeManage'
  import BaseTable from '@/components/BaseTable'

  export default {
    name: 'materialManagement',
    extends: BaseTable,
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      departmentId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        listMethod: list,
        setAreaType: setAreaType,
        areaType: 1,
        materialTypeList: [{
          value: 1,
          name: '原材料'
        }, {
          value: 2,
          name: '辅料'
        }, {
          value: 3,
          name: '电商产品'
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        searchForm: [{
          type: 1
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
        }]
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
      dataList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      },
      departmentId: {
        handler(e) {
          this.searchForm[5].departmentId = this.departmentId
          this.fetchData(...this._searchFormToList())
        }
      }
    },
    mounted() {
      this.searchForm[5].departmentId = this.departmentId
      this.fetchData(...this._searchFormToList())
    },
    methods: {
      currentNodeClick(current, node) {
      },
      nodeCheckChange(node, check) {
      },
      resetSearchForm() {
        this.searchForm[1].code = ''
        this.searchForm[2].name = ''
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
          this.$refs['addForm'].resetFields()
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
        this.$emit('closeMaterial', { materialName: this.multipleSelection[0].name, specificationValue: this.multipleSelection[0].typeName, materialId: this.multipleSelection[0].id, unitCode: this.multipleSelection[0].unitCode, price: this.multipleSelection[0].price })
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
