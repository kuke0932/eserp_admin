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
        <el-form-item label="采购人">
          <el-input clearable v-model="searchForm.applyName"></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select  :clearable="true" v-model="searchForm.status" placeholder="请选择审核状态" clearable filterable>
            <el-option v-for="item in optionsStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间" prop="visitTime">
          <el-date-picker
            v-model="searchForm.createTime"
            type="month"
            :editable="false"
            placeholder="选择申请时间"
            value-format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetForm" :loading="searchLoading">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAdd"><i
        class="el-icons-jd-add"></i>&nbsp;添加采购单
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEdit"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改采购单
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="deleteMaterialApply"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除采购单
      </el-button>
      <el-button class="el-button--primary hidden" code="submit" :loading="btnSubmitssionLoading" @click="goSubmission">
        <i
        class="el-icons-jd-tijiaoshenqing"></i>&nbsp;提交申请
      </el-button>
      <el-button class="el-button--primary hidden" code="cancel" :loading="btnCancelSubmitssionLoading"
                 @click="goCancelApply"><i
        class="el-icons-jd-chexiao1"></i>&nbsp;撤销申请
      </el-button>
      <div v-if="message" style="float: right">
      {{message}}
    </div>
    </div>
    <add :visible.sync="addDialogVisible" :departmentId="searchForm.departmentId" @fetchData = 'search'></add>
    <edit :visible.sync="editDialogVisible" :departmentId="searchForm.departmentId" :selectedId="selectedId" @fetchData = 'search'></edit>

    <!--用车信息列表-->
    <el-table
      :data="materialApplyList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="采购人">
        <template slot-scope="scope">
          {{scope.row.applyName}}
        </template>
      </el-table-column>
      <el-table-column label="采购单详情">
        <template slot-scope="scope">
          <el-popover v-if="!!scope.row.materialApplyInfoList"
                      placement="top-start"
                      width="300"
                      trigger="hover">
            <div>
              <h1 style="font-size: 14px;line-height: 24px;">采购单详情</h1>
              <ul style="padding-left: 10px;">
                <li v-for="item in scope.row.materialApplyInfoList" style="list-style: none;width: 100%;padding: 5px 0;">
                  <span style="display: inline-block;width: 33%;text-align: left;border: 1px solid  #ebeef5;text-indent: 5px;" class="materialName">{{ item.materialName }}</span>
                  <span style="display: inline-block;width: 30%;text-align: center;border: 1px solid  #ebeef5;" class="color">{{ item.specificationValue }}</span>*
                  <span style="display: inline-block;width: 30%;text-align: center;border: 1px solid  #ebeef5;" class="amount">{{ item.amount }}</span>
                </li>
              </ul>
            </div>
            <a slot="reference" class="introduction" href="javascript:void(0)">查看详情</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" :formatter="tableFormatter">
      </el-table-column>
      <el-table-column label="审核（批）意见">
        <template slot-scope="scope">
          {{scope.row.opinion}}
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
            content="修改采购单">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="删除采购单">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status === 1"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="提交申请">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="submit" icon="el-icons-jd-tijiaoshenqing" @click="goSubmissionLine(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status === 2"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="撤销申请">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="cancel" icon="el-icons-jd-chexiao1" @click="goCancelApplyLine(scope.row.id)"></el-button>
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
  import { listStoreKeeper, remove, updateStatus } from '@/api/materialApply'
  import { getSelections } from '@/api/department'
  import { setDepartmentId } from '@/utils/departmentManage'
  import Add from './add'
  import Edit from './edit'

  export default {
    name: '采购申请-车间库管',
    components: {
      Add,
      Edit
    },
    data() {
      return {
        optionsStatus: [{
          value: 1,
          label: '已保存'
        }, {
          value: 2,
          label: '待审核'
        }, {
          value: 3,
          label: '审核通过'
        }, {
          value: 4,
          label: '审核不通过'
        }, {
          value: 5,
          label: '待审批'
        }, {
          value: 6,
          label: '审批通过'
        }, {
          value: 7,
          label: '审批不通过'
        }],
        addDialogVisible: false,
        editDialogVisible: false,
        listLoading: false,
        searchLoading: false, // 查询按钮
        removeLoading: false, // 删除按钮
        btnSubmitssionLoading: false, // 提交申请
        btnCancelSubmitssionLoading: false, // 撤销申请
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        enableDepartmentSelection: false,
        departmentSelections: [],
        multipleSelection: [],
        materialApplyList: [],
        message: '',
        selectedId: 0,
        searchForm: {
          applyName: '',
          departmentId: '',
          status: null,
          createTime: this.getDate()
        }
      }
    },
    watch: {
      materialApplyList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
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
          this.fetchData(null, this.searchForm.departmentId, null, this.searchForm.createTime, this.pageNum, this.pageSize)
        })
      },
      /* 查询列表----车间库管 */
      fetchData(applyName, departmentId, status, createTime, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(departmentId)
        return listStoreKeeper(
          applyName,
          status,
          createTime,
          pageNum,
          pageSize
        ).then(response => {
          this.materialApplyList = response.data.data.pageBean.rows
          this.materialApplyList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.pageBean.total
          this.pageNum = response.data.data.pageBean.pageNum
          this.pageSize = response.data.data.pageBean.pageSize
          this.message = response.data.data.message
          this.listLoading = false
          return response
        }).catch(e => {
          this.listLoading = false
        })
      },
      // 搜索 按钮
      search() {
        this.searchLoading = true
        this.fetchData(
          this.searchForm.applyName,
          this.searchForm.departmentId,
          this.searchForm.status,
          this.searchForm.createTime,
          this.pageNum,
          this.pageSize
        ).then((resp) => {
          this.searchLoading = false
        })
      },
      /* 重置表单 */
      resetForm() {
        this.searchForm.applyName = ''
        this.searchForm.departmentId = ''
        this.searchForm.status = ''
      },
      // 添加采购申请 按钮
      goAdd() {
        this.addDialogVisible = true
      },
      // 修改采购申请 按钮
      goEdit() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        const materialApply = this.multipleSelection[0]
        if (materialApply.status !== 1 || materialApply.status !== 4 || materialApply.status !== 7) {
          this.$message({
            type: 'warning',
            message: '当前状态禁止修改!'
          })
          return
        }
        this.selectedId = materialApply.id
        this.editDialogVisible = true
      },
      goEditLine(row) {
        if (row.status !== 1 || row.status !== 4 || row.status !== 7) {
          this.$message({
            type: 'warning',
            message: '当前状态禁止修改!'
          })
          return
        }
        this.selectedId = row.id
        this.editDialogVisible = true
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(
          this.searchForm.applyName,
          this.searchForm.departmentId,
          this.searchForm.status,
          this.searchForm.createTime,
          this.pageNum,
          this.pageSize
        )
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(
          this.searchForm.applyName,
          this.searchForm.departmentId,
          this.searchForm.status,
          this.searchForm.createTime,
          this.pageNum,
          this.pageSize
        )
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      tableFormatter(row, column, cellValue, index) {
        if (row.status) {
          return this.optionsStatus[row.status - 1].label
        }
      },
      /* 删除采购单 */
      deleteMaterialApply() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请选一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeLoading = true
          this.listLoading = true
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.applyName,
                  this.searchForm.departmentId,
                  this.searchForm.status,
                  this.searchForm.createTime,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.removeLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.removeLoading = false
            this.listLoading = false
          })
        })
      },
      removeLine(ids) {
        this.removeLoading = true
        this.listLoading = true
        remove(ids).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 1000,
            onClose: () => {
              this.pageNum = 1
              this.fetchData(
                this.searchForm.applyName,
                this.searchForm.departmentId,
                this.searchForm.status,
                this.searchForm.createTime,
                this.pageNum,
                this.pageSize
              ).then((resp) => {
                this.removeLoading = false
                this.listLoading = false
              })
            }
          })
        }).catch(e => {
          this.removeLoading = false
          this.listLoading = false
        })
      },
      /* 提交申请按钮 */
      goSubmission() {
        if (this.multipleSelection.length !== 0) {
          const status = this.multipleSelection[0].status
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].status !== status) {
              this.$message({
                type: 'warning',
                message: '您选择的状态不一致',
                duration: 1500
              })
              return
            } else {
              if (this.multipleSelection[i].status !== 1) {
                this.$message({
                  type: 'warning',
                  message: '不是已保存状态，不能提交',
                  duration: 1500
                })
                return
              }
            }
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请至少选择一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.$confirm('是否提交该采购单申请', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnSubmitssionLoading = true
          this.listLoading = true
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          updateStatus(ids.join(','), 2, '待审核').then(response => {
            this.$message({
              type: 'success',
              message: '提交申请成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.applyName,
                  this.searchForm.departmentId,
                  this.searchForm.status,
                  this.searchForm.createTime,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.btnSubmitssionLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.btnSubmitssionLoading = false
            this.listLoading = false
          })
        })
      },
      /* 提交申请按钮-行内 */
      goSubmissionLine(row) {
        this.btnSubmitssionLoading = true
        this.listLoading = true
        if (row.status !== 1) {
          this.$message({
            type: 'warning',
            message: '不是已保存状态，不能提交',
            duration: 1500
          })
          return
        }
        this.$confirm('是否提交该采购单申请', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(row.id, 2, '待审核').then(response => {
            this.$message({
              type: 'success',
              message: '提交申请成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.applyName,
                  this.searchForm.departmentId,
                  this.searchForm.status,
                  this.searchForm.createTime,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.btnSubmitssionLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.btnSubmitssionLoading = false
            this.listLoading = false
          })
        })
      },
      /* 撤销申请按钮 */
      goCancelApply() {
        if (this.multipleSelection.length !== 0) {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].status !== 2) {
              this.$message({
                type: 'warning',
                message: '当前状态不能撤销',
                duration: 1500
              })
              return
            }
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请至少选择一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.$confirm('是否撤销该采购单申请', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnCancelSubmitssionLoading = true
          this.listLoading = true
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          updateStatus(ids.join(','), 1, '已保存').then(response => {
            this.$message({
              type: 'success',
              message: '撤销申请成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.applyName,
                  this.searchForm.departmentId,
                  this.searchForm.status,
                  this.searchForm.createTime,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.btnCancelSubmitssionLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.btnCancelSubmitssionLoading = false
            this.listLoading = false
          })
        })
      },
      /* 撤销申请按钮-行内 */
      goCancelApplyLine(id) {
        this.$confirm('是否撤销该采购单申请', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnCancelSubmitssionLoading = true
          this.listLoading = true
          updateStatus(id, 1, '已保存').then(response => {
            this.$message({
              type: 'success',
              message: '撤销申请成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.applyName,
                  this.searchForm.departmentId,
                  this.searchForm.status,
                  this.searchForm.createTime,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.btnCancelSubmitssionLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.btnCancelSubmitssionLoading = false
            this.listLoading = false
          })
        })
      },
      /* 获得日期 */
      getDate() {
        return new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2)
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
