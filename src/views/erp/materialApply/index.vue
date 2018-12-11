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
        <el-button type="primary" @click="resetForm()" :loading="searchLoading">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="pass" :loading="btnCheckThroughLoading"
                 @click="goCheckThrough"><i
        class="el-icons-jd-queren"></i>&nbsp;审核通过
      </el-button>
      <el-button class="el-button--primary hidden" code="forbid" :loading="btnCheckNoThroughLoading"
                 @click="goCheckNoThrough"><i
        class="el-icons-jd-shanchu"></i>&nbsp;审核不通过
      </el-button>
      <el-button class="el-button--primary hidden" code="transfer" :loading="btnGoApprovalLoading" @click="goApproval">
        <i
        class="el-icons-jd-shenheyijian"></i>&nbsp;转管理层审批
      </el-button>
      <el-button class="el-button--primary hidden" code="cancel" :loading="btnGoCancelCheckLoading"
                 @click="goCancelCheck"><i
        class="el-icons-jd-chexiao1"></i>&nbsp;撤销审核
      </el-button>
      <div v-if="message" style="float: right">
        {{message}}
      </div>
    </div>
    <!--审核通过弹窗-->
    <el-dialog
      :visible.sync="checkThroughDialog"
      width="40%"
      :before-close="handleClose">
      <el-form ref="checkThroughForm" class="checkThroughForm"
               v-loading="checkThroughLoading"
               :element-loading-text="loadingText">
        <el-row>
          <el-form-item>
            <el-input clearable type="textarea" :rows="4" placeholder="请输入审核意见" v-model="checkThroughForm.opinion">
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button type="primary" :loading="submitLoading" @click="confirm('checkThroughForm')">确定</el-button>
      <el-button type="primary" @click="cancelDialog">取消</el-button>
    </el-dialog>
    <!--审核不通过弹窗-->
    <el-dialog
      :visible.sync="checkNoThroughDialog"
      width="40%"
      :before-close="handleClose">
      <el-form ref="checkNoThroughForm" class="checkNoThroughForm"
               v-loading="checkNoThroughLoading"
               :element-loading-text="loadingText">
        <el-row>
          <el-form-item>
            <el-input clearable type="textarea" :rows="4" placeholder="请输入审核不通过意见" v-model="checkNoThroughForm.opinion">
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button type="primary" :loading="submitLoading" @click="confirm('checkNoThroughForm')">确定</el-button>
      <el-button type="primary" @click="cancelDialog">取消</el-button>
    </el-dialog>
    <!--撤销审核弹窗-->
    <el-dialog
      :visible.sync="cancelCheckDialog"
      width="40%"
      :before-close="handleClose">
      <el-form ref="cancelCheckForm" class="cancelCheckForm"
               v-loading="goApprovalLoading"
               :element-loading-text="loadingText">
        <el-row>
          <el-form-item>
            <el-input clearable type="textarea" :rows="4" placeholder="请输入撤销原因" v-model="cancelCheckForm.opinion">
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button type="primary" :loading="submitLoading" @click="confirm('cancelCheckForm')">确定</el-button>
      <el-button type="primary" @click="cancelDialog">取消</el-button>
    </el-dialog>
    <!--转管理层审批弹窗-->
    <el-dialog
      :visible.sync="goApprovalDialog"
      width="40%"
      :before-close="handleClose">
      <el-form ref="goApprovalForm" class="goApprovalForm"
               v-loading="goCancelCheckLoading"
               :element-loading-text="loadingText">
        <el-row>
          <el-form-item>
            <el-input clearable type="textarea" :rows="4" placeholder="请输入转管理层原因" v-model="goApprovalForm.opinion">
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button type="primary" :loading="submitLoading" @click="confirm('goApprovalForm')">确定</el-button>
      <el-button type="primary" @click="cancelDialog">取消</el-button>
    </el-dialog>
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
      <el-table-column label="所属车间">
        <template slot-scope="scope">
          {{scope.row.departmentName}}
        </template>
      </el-table-column>
      <el-table-column label="采购金额（元）">
        <template slot-scope="scope">
          {{scope.row.totalPrice / 100}}
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
      <el-table-column label="审核意见">
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
          <el-popover v-if="scope.row.status === 2"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="审核通过">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="pass" icon="el-icons-jd-queren" @click="goCheckThroughLine(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status === 2"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="审核不通过">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="forbid" icon="el-icons-jd-shanchu" @click="goCheckNoThroughLine(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status === 3 || scope.row.status === 4"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="撤销审核">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="cancel" icon="el-icons-jd-chexiao1" @click="goCancelCheckLine(scope.row)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status === 3"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="转管理层审批">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="transfer" icon="el-icons-jd-shenheyijian" @click="goApprovalLine(scope.row)"></el-button>
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
  import { listDirector, updateStatus } from '@/api/materialApply'
  import { getSelections } from '@/api/department'
  import { setDepartmentId } from '@/utils/departmentManage'

  export default {
    name: '采购申请-车间主任',
    data() {
      return {
        listLoading: false,
        searchLoading: false,
        submitLoading: false,
        loadingText: '拼命加载中...',
        btnCheckThroughLoading: false,
        checkThroughLoading: false,
        btnCheckNoThroughLoading: false, // 审核不通过 按钮
        checkNoThroughLoading: false, // 审核不通过 对话框
        btnGoApprovalLoading: false, // 转管理层审批 按钮
        goApprovalLoading: false, // 转管理层审批 对话框
        btnGoCancelCheckLoading: false, // 撤销审核 按钮
        goCancelCheckLoading: false, // 撤销审核 对话框
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
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
        enableDepartmentSelection: false,
        departmentSelections: [],
        materialApplyList: [],
        materialManagementList: [],
        multipleSelection: [],
        message: '',
        currentRow: null,
        searchForm: {
          applyName: '',
          departmentId: null,
          status: null,
          createTime: this.getDate()
        },
        dialogDeleteMaterialIndex: 0,
        materialList: [],
        checkThroughDialog: false,
        checkThroughForm: {
          opinion: ''
        },
        checkNoThroughDialog: false,
        checkNoThroughForm: {
          opinion: ''
        },
        cancelCheckDialog: false,
        cancelCheckForm: {
          opinion: ''
        },
        goApprovalDialog: false,
        goApprovalForm: {
          opinion: ''
        },
        ids: ''
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
      /* 查询列表----车间主任 */
      fetchData(applyName, departmentId, status, createTime, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(departmentId)
        return listDirector(
          applyName,
          status,
          createTime,
          pageNum,
          pageSize
        ).then(response => {
          this.materialApplyList = response.data.data.pageBean.rows
          this.materialApplyList.forEach((e, i) => {
            e['idx'] = i
          })
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
      /* 表格里操作按钮 修改 */
      tableFormatter(row, column, cellValue, index) {
        if (row.status) {
          return this.optionsStatus[row.status - 1].label
        }
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.submitLoading === true) {
          return
        }
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
      cancelDialog() {
        this.checkThroughDialog = false
        this.checkNoThroughDialog = false
        this.cancelCheckDialog = false
      },
      /* 审核通过按钮 */
      goCheckThrough() {
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
            }
            if (this.multipleSelection[i].status !== 2) {
              this.$message({
                type: 'warning',
                message: '不是待审核状态，不能审核',
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
        this.checkThroughDialog = true
        const rows = this.multipleSelection
        const ids = []
        for (let i = 0; i < rows.length; i++) {
          ids.push(rows[i].id)
        }
        this.ids = ids
      },
      /* 审核通过按钮-行内 */
      goCheckThroughLine(row) {
        if (row.status !== 2) {
          this.$message({
            type: 'warning',
            message: '不是待审核状态，不能审核',
            duration: 1500
          })
          return
        }
        this.ids = row.id
        this.checkThroughDialog = true
      },
      /* 提交 */
      confirm(formName) {
        let ids = this.ids.toString()
        if (ids.indexOf() !== -1) {
          ids = this.ids.join(',')
        }
        if (formName === 'checkThroughForm') {
          const opinion = this.checkThroughForm.opinion
          if (opinion === '') {
            this.$message({
              type: 'warning',
              message: '内容不能为空!',
              duration: 1500
            })
          } else {
            this.btnCheckThroughLoading = true
            this.checkThroughLoading = true
            this.submitLoading = true
            updateStatus(ids, 3, opinion).then(() => {
              this.$message({
                type: 'success',
                message: '审核通过!',
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
                    this.btnCheckThroughLoading = false
                    this.checkThroughLoading = false
                    this.submitLoading = false
                  })
                  this.$refs[formName].resetFields()
                }
              })
              this.checkThroughDialog = false
              this.checkThroughForm.opinion = ''
            }).catch(e => {
              this.btnCheckThroughLoading = false
              this.checkThroughLoading = false
              this.submitLoading = false
            })
          }
        } else if (formName === 'checkNoThroughForm') {
          const opinion = this.checkNoThroughForm.opinion
          if (opinion === '') {
            this.$message({
              type: 'warning',
              message: '内容不能为空!',
              duration: 1500
            })
          } else {
            this.btnCheckNoThroughLoading = true
            this.checkNoThroughLoading = true
            this.submitLoading = true
            updateStatus(ids, 4, opinion).then(() => {
              this.$message({
                type: 'success',
                message: '审核不通过!',
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
                    this.btnCheckNoThroughLoading = false
                    this.checkNoThroughLoading = false
                    this.submitLoading = false
                  })
                  this.$refs[formName].resetFields()
                }
              })
              this.checkNoThroughDialog = false
              this.checkNoThroughForm.opinion = ''
            }).catch(e => {
              this.btnCheckNoThroughLoading = false
              this.checkNoThroughLoading = false
              this.submitLoading = false
            })
          }
        } else if (formName === 'cancelCheckForm') {
          const opinion = this.cancelCheckForm.opinion
          if (opinion === '') {
            this.$message({
              type: 'warning',
              message: '内容不能为空!',
              duration: 1500
            })
          } else {
            this.btnGoCancelCheckLoading = true
            this.goCancelCheckLoading = true
            this.submitLoading = true
            updateStatus(ids, 2, opinion).then(() => {
              this.$message({
                type: 'success',
                message: '撤销审核成功!',
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
                    this.btnGoCancelCheckLoading = false
                    this.goCancelCheckLoading = false
                    this.submitLoading = false
                  })
                  this.$refs[formName].resetFields()
                }
              })
              this.cancelCheckDialog = false
              this.cancelCheckForm.opinion = ''
            }).catch(e => {
              this.btnGoCancelCheckLoading = false
              this.goCancelCheckLoading = false
              this.submitLoading = false
            })
          }
        } else if (formName === 'goApprovalForm') {
          const opinion = this.goApprovalForm.opinion
          if (opinion === '') {
            this.$message({
              type: 'warning',
              message: '内容不能为空!',
              duration: 1500
            })
          } else {
            this.btnGoApprovalLoading = true
            this.goApprovalLoading = true
            this.submitLoading = true
            updateStatus(ids, 5, opinion).then(() => {
              this.$message({
                type: 'success',
                message: '转审批成功!',
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
                    this.btnGoApprovalLoading = false
                    this.goApprovalLoading = false
                    this.submitLoading = false
                  })
                  this.$refs[formName].resetFields()
                }
              })
              this.goApprovalDialog = false
              this.goApprovalForm.opinion = ''
            }).catch(e => {
              this.btnGoApprovalLoading = false
              this.goApprovalLoading = false
              this.submitLoading = false
            })
          }
        }
      },
      /* 审核不通过按钮 */
      goCheckNoThrough() {
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
              if (this.multipleSelection[0].status !== 2) {
                this.$message({
                  type: 'warning',
                  message: '不是待审核状态，不能审核',
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
        const rows = this.multipleSelection
        const ids = []
        for (let i = 0; i < rows.length; i++) {
          ids.push(rows[i].id)
        }
        this.ids = ids
        this.checkNoThroughDialog = true
      },
      /* 审核不通过按钮-行内 */
      goCheckNoThroughLine(row) {
        if (row.status !== 2) {
          this.$message({
            type: 'warning',
            message: '不是待审核状态，不能审核',
            duration: 1500
          })
          return
        } else {
          this.ids = row.id
          this.checkNoThroughDialog = true
        }
      },
      /* 撤销审核 */
      goCancelCheck() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选择一行再执行此操作',
            duration: 1500
          })
          return
        }
        const rows = this.multipleSelection
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].status !== 3 && rows[i].status !== 4) {
            this.$message({
              type: 'warning',
              message: '该状态不能撤销',
              duration: 1500
            })
            return
          }
        }
        const ids = []
        for (let i = 0; i < rows.length; i++) {
          ids.push(rows[i].id)
        }
        this.ids = ids
        this.cancelCheckDialog = true
      },
      /* 撤销审核 - 行内 */
      goCancelCheckLine(row) {
        if (row.status !== 3 && row.status !== 4) {
          this.$message({
            type: 'warning',
            message: '该状态不能撤销',
            duration: 1500
          })
          return
        }
        this.ids = row.id
        this.cancelCheckDialog = true
      },
      /* 转管理层审批 */
      goApproval() {
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
              if (this.multipleSelection[0].status !== 2) {
                this.$message({
                  type: 'warning',
                  message: '不是待审核状态，不能审核',
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
        this.goApprovalDialog = true
        const rows = this.multipleSelection
        const ids = []
        for (let i = 0; i < rows.length; i++) {
          ids.push(rows[i].id)
        }
        this.ids = ids
      },
      /* 转管理层审批 - 行内 */
      goApprovalLine(row) {
        if (row.status !== 2) {
          this.$message({
            type: 'warning',
            message: '不是待审核状态，不能审核',
            duration: 1500
          })
          return
        }
        this.ids = row.id
        this.goApprovalDialog = true
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
