<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="部门"  prop="departmentId" v-if="enableDepartmentSelection">
          <el-select v-model="searchForm[2].departmentId" placeholder="请选择部门" filterable>
            <el-option v-for="item in departmentSelections"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号">
          <el-input clearable v-model="searchForm[1].workNumber"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input clearable v-model="searchForm[0].workName"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="tesetWorkNumber">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="set" @click="setWorker"><i
      	class="el-icons-jd-gongxu_bianji"></i>&nbsp;设置工序
      </el-button>
    </div>
		<!--设置工序-->
		<el-dialog
      title="设置工序 "
      :visible.sync="setProcedure"
      width="40%"
      :before-close="handleClose">
      <el-form v-loading="setWorkerList" :element-loading-text="loadingText">
        <el-form class="searchForm" :inline="true">
          <el-row>
            <el-form-item label="工序名称">
              <el-input clearable v-model="searchName"></el-input>
            </el-form-item>
            <el-button type="primary" @click="searchProcess">查询</el-button>
            <el-button type="primary" @click="tesetProcedure">重置</el-button>
          </el-row>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="listProcessData"
          v-loading="dialoglistLoading"
          :element-loading-text="dialogloadingText"
          border
          fit
          tooltip-effect="dark"
          highlight-current-row
          @selection-change="handleProcessChange">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column
            prop="name"
            label="工序名称">
            <template slot-scope="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="工序内容">
            <template slot-scope="scope">
              <div v-html="scope.row.content"></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="工序操作时长（分钟）" width="180">
            <template slot-scope="scope">
              {{scope.row.duration}}
            </template>
          </el-table-column>
          <el-table-column
            prop="order"
            label="顺序">
            <template slot-scope="scope">
              {{scope.row.processSort}}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="创建时间" width="180">
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>
        </el-table>
				<el-form-item class="btn_box">
          <el-button type="primary" @click="modifyForm" :loading="submit">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--工人管理列表-->
    <el-table
      :data="dataList"
      v-loading.body="listLoading"
      :element-loading-text="loadingText"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="工号">
        <template slot-scope="scope">
          {{scope.row.loginName}}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{scope.row.mobile}}
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column label="所属车间">
        <template slot-scope="scope">
          {{scope.row.departmentName}}
        </template>
      </el-table-column>
      <el-table-column label="创建者">
        <template slot-scope="scope">
          {{scope.row.createName}}
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
            content="设置工序">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="set" icon="el-icons-jd-gongxu_bianji" @click="goEditLine(scope.row)"></el-button>
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
  import { list, setProcess, listProcess, updateEnableStatus, getProcess } from '@/api/worker'
  import { getSelections } from '@/api/department'
  import BaseTable from '@/components/BaseTable'
  export default {
    name: 'worker',
    extends: BaseTable,
    data() {
      return {
        dialoglistLoading: false, // 对话框里的表格
        dialogloadingText: '拼命加载中',
        loadingText: '拼命加载中',
        submit: false,
        setWorkerList: false,
        listMethod: list,
        updateEnableStatusMethod: updateEnableStatus,
        pageNum: 1,
        pageSize: 10,
        productTypeCode: '',
        setProcedure: false,
        enableDepartmentSelection: false,
        departmentSelections: [],
        multipleProcess: [],
        rows: [],
        searchForm: [{
          workName: null
        }, {
          workNumber: null
        }, {
          departmentId: null
        }],
        searchName: '',
        listProcessData: []
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
      // TODO(参数改成从菜单里面获取的部门类型)
      this.getDepartmentSelections(2)
      this.listProcess()
    },
    methods: {
      /* 获取部门下拉框 */
      getDepartmentSelections(departmentType) {
        getSelections(departmentType).then(resp => {
          this.departmentSelections = resp.data.data
          if (this.departmentSelections.length > 1) {
            this.enableDepartmentSelection = true
          }
          this.searchForm[2].departmentId = this.departmentSelections[0].code
          this.fetchData(this.searchForm[0].workName, this.searchForm[1].workNumber, this.searchForm[2].departmentId)
        })
      },
      /* 获取工序列表 */
      listProcess() {
        return listProcess(this.searchName, this.pageNum, this.pageSize).then(resp => {
          this.listProcessData = resp.data.data.rows
          return resp
        })
      },
      setWorker() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作',
            duration: 1500
          })
        } else {
          this.rows = []
          this.searchName = ''
          this.setProcedure = true
          this.setWorkerList = true
          getProcess(this.multipleSelection[0].loginName).then(resp => {
            this.$refs['multipleTable'].clearSelection()
            resp.data.data.forEach(v => {
              this.listProcessData.forEach(val => {
                if (v === val.code) {
                  this.rows.push(val)
                }
              })
            })
            if (this.rows) {
              this.rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row, true)
              })
            }
            this.setWorkerList = false
          }).catch(e => {
            this.setWorkerList = false
          })
        }
      },
      /* 关闭弹框 */
      handleClose(done) {
        if (this.setWorkerList === true || this.dialoglistLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs['multipleTable'].clearSelection()
          done()
        }).catch((e) => {
          if (e !== 'cancel') {
            done()
          }
        })
      },
      /* 表格里操作按钮 设置工序 */
      goEditLine(row) {
        this.setWorkerList = true
        this.rows = []
        this.setProcedure = true
        getProcess(row.loginName).then(resp => {
          this.$refs.multipleTable.clearSelection()
          resp.data.data.forEach(v => {
            this.listProcessData.forEach(val => {
              if (v === val.code) {
                this.rows.push(val)
              }
            })
          })
          if (this.rows) {
            this.rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row, true)
            })
          }
          this.setWorkerList = false
        }).catch(e => {
          this.setWorkerList = false
        })
      },
      searchProcess() {
        this.setWorkerList = true
        listProcess(this.searchName, this.pageNum, this.pageSize).then(resp => {
          this.listProcessData = resp.data.data.rows
          this.setWorkerList = false
        })
      },
      resetForm() {
        this.$refs.multipleTable.clearSelection()
      },
      tesetWorkNumber() {
        this.searchForm[1].workNumber = ''
        this.searchForm[0].workName = ''
      },
      tesetProcedure() {
        this.searchName = ''
      },
      handleProcessChange(val) {
        this.multipleProcess = val
      },
      modifyForm() {
        if (this.multipleProcess.length < 1) {
          this.$message({
            type: 'warning',
            message: '请选择一条数据！'
          })
          return
        } else {
          this.listLoading = true
          this.dialoglistLoading = true
          this.dialogloadingText = '正在提交...'
          this.submit = true
          let codeString = ''
          for (let i = 0; i < this.multipleProcess.length; i++) {
            codeString += this.multipleProcess[i].code + ','
          }
          codeString = codeString.substring(0, codeString.length - 1)
          setProcess(this.multipleSelection[0].loginName, codeString).then(resp => {
            if (resp.data.status === 200) {
              this.$message({
                type: 'success',
                message: '提交成功!',
                onClose: () => {
                  this.pageNum = 1
                  this.multipleProcess = []
                  this.fetchData(this.searchForm[0].workName, this.searchForm[1].workNumber, this.searchForm[2].departmentId).then(resp => {
                    this.listLoading = false
                    this.dialoglistLoading = false
                    this.dialogloadingText = '正在加载...'
                    this.submit = false
                  })
                  this.setProcedure = false
                }
              })
            } else {
              console.log('error ')
            }
            this.setWorkerList = false
            this.submit = false
          }).catch(e => {
            this.setWorkerList = false
            this.submit = false
          })
        }
      }
    }
  }
</script>
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
