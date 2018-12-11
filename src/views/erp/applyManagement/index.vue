<template>
  <div class="container">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="所属车间">
          <el-select :clearable="true" v-model="searchForm.departmentId" placeholder="请选择车间" clearable filterable>
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
        <el-button type="primary" @click="resetForm('searchForm')" :loading="searchLoading">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="pass" :loading="btnApprovalLoading" @click="goApproval"><i
        class="el-icons-jd-queren"></i>&nbsp;审批通过
      </el-button>
      <el-button class="el-button--primary hidden" code="forbid" :loading="btnNoApprovalLoading" @click="goNoApproval">
        <i
        class="el-icons-jd-shenhebutongguo"></i>&nbsp;审批不通过
      </el-button>
      <div v-if="message" style="float: right">
        {{message}}
      </div>
    </div>
    <!--审批通过弹窗-->
    <el-dialog
      :visible.sync="approvalDialog"
      width="40%"
      :before-close="handleClose">
      <el-form class="approvalForm"
               v-loading="approvalLoading"
               :element-loading-text="loadingText">
        <el-row>
          <el-form-item>
            <el-input clearable type="textarea" :rows="4" placeholder="请输入审批意见" v-model="approvalForm.opinion">
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button type="primary" :loading="submitLoading" @click="confirm('approvalForm')">确定</el-button>
      <el-button type="primary" @click="cancelDialog">取消</el-button>
    </el-dialog>
    <!--审批不通过弹窗-->
    <el-dialog
      :visible.sync="noApprovalDialog"
      width="40%"
      :before-close="handleClose">
      <el-form class="noApprovalForm"
               v-loading="noApprovalLoading"
               :element-loading-text="loadingText">
        <el-row>
          <el-form-item>
            <el-input clearable type="textarea" :rows="4" placeholder="请输入审批不通过意见" v-model="noApprovalForm.opinion">
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button type="primary" :loading="submitLoading" @click="confirm('noApprovalForm')">确定</el-button>
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
          <el-popover v-if="scope.row.status === 5"
            placement="top-start"
            width="100"
            trigger="hover"
            content="审批通过">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="pass" icon="el-icons-jd-queren" @click="goApprovalLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.status === 5"
            placement="top-start"
                      width="100"
                      trigger="hover"
                      content="审批不通过">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="forbid" icon="el-icons-jd-shenhebutongguo" @click="goNoApprovalLine(scope.row.id)"></el-button>
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
  import { listManagement, updateStatus } from '@/api/materialApply'
  import { getAllSelections } from '@/api/department'
  export default {
    name: 'processManagement',
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
        approvalDialog: false,
        approvalForm: {
          opinion: ''
        },
        noApprovalDialog: false,
        noApprovalForm: {
          opinion: ''
        },
        listLoading: false,
        searchLoading: false,
        submitLoading: false,
        loadingText: '正在提交',
        btnApprovalLoading: false, // 审批通过 按钮
        approvalLoading: false, // 审批通过 对话框
        btnNoApprovalLoading: false, // 审批不通过 按钮
        noApprovalLoading: false, // 审批不通过 对话框
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        departmentSelections: [],
        multipleSelection: [],
        materialApplyList: [],
        message: '',
        selectedId: 0,
        ids: [],
        searchForm: {
          applyName: '',
          departmentId: null,
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
      this.fetchData(null, null, null, this.searchForm.createTime, this.pageNum, this.pageSize)
      // 获取所有车间下拉
      getAllSelections(2).then(resp => {
        this.departmentSelections = resp.data.data
      })
    },
    methods: {
      /* 查询列表----车间库管 */
      fetchData(applyName, departmentId, status, createTime, pageNum, pageSize) {
        this.listLoading = true
        return listManagement(
          applyName,
          departmentId,
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
      close() {
        this.$emit('update:visible', false)
      },
      handleClose(done) {
        if (this.submitLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs['addForm'].resetFields()
          done()
        }).catch((e) => {
          if (e !== 'cancel') {
            done()
          }
        })
      },
      cancelDialog() {
        this.approvalDialog = false
        this.noApprovalDialog = false
      },
      /* 重置表单 */
      resetForm() {
        this.searchForm.departmentId = null
        this.searchForm.applyName = null
        this.searchForm.status = null
      },
      /* 提交 */
      confirm(formName) {
        if (formName === 'approvalForm') {
          const opinion = this.approvalForm.opinion
          if (opinion === '') {
            this.$message({
              type: 'warning',
              message: '内容不能为空',
              duration: 1500
            })
          } else {
            this.submitLoading = true
            this.approvalLoading = true
            this.btnApprovalLoading = true
            updateStatus(this.ids.join(','), 6, opinion).then(() => {
              this.$message({
                type: 'success',
                message: '审批通过成功!',
                duration: 1000,
                onClose: () => {
                  this.approvalForm.opinion = ''
                  this.fetchData(
                    this.searchForm.applyName,
                    this.searchForm.departmentId,
                    this.searchForm.status,
                    this.searchForm.createTime,
                    this.pageNum,
                    this.pageSize
                  ).then((resp) => {
                    this.submitLoading = false
                    this.approvalLoading = false
                    this.btnApprovalLoading = false
                  })
                  if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields()
                  }
                }
              })
              this.approvalDialog = false
            }).catch(e => {
              this.submitLoading = false
              this.approvalLoading = false
              this.btnApprovalLoading = false
            })
          }
        } else if (formName === 'noApprovalForm') {
          const opinion = this.noApprovalForm.opinion
          if (opinion === '') {
            this.$message({
              type: 'warning',
              message: '内容不能为空',
              duration: 1500
            })
          } else {
            this.submitLoading = true
            this.approvalLoading = true
            this.btnApprovalLoading = true
            updateStatus(this.ids.join(','), 7, opinion).then(() => {
              this.$message({
                type: 'success',
                message: '审批不通过成功!',
                duration: 1000,
                onClose: () => {
                  this.noApprovalForm.opinion = ''
                  this.fetchData(
                    this.searchForm.applyName,
                    this.searchForm.departmentId,
                    this.searchForm.status,
                    this.searchForm.createTime,
                    this.pageNum,
                    this.pageSize
                  ).then((resp) => {
                    this.submitLoading = false
                    this.approvalLoading = false
                    this.btnApprovalLoading = false
                  })
                  if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields()
                  }
                }
              })
              this.noApprovalDialog = false
            }).catch(e => {
              this.submitLoading = false
              this.approvalLoading = false
              this.btnApprovalLoading = false
            })
          }
        }
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
      /* 审批通过 */
      goApproval() {
        const rows = this.multipleSelection
        const ids = []
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选一行再执行此操作',
            duration: 1500
          })
          return
        } else {
          this.approvalDialog = true
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].status === 5) {
              ids.push(rows[i].id)
            } else {
              this.approvalDialog = false
            }
          }
        }
        this.ids = ids
      },
      /* 审批通过-行内 */
      goApprovalLine(id) {
        this.approvalDialog = true
        this.ids.push(id)
      },
      /* 审批不通过 */
      goNoApproval() {
        const rows = this.multipleSelection
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选一行再执行此操作',
            duration: 1500
          })
          return
        } else {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].status === 5) {
              this.noApprovalDialog = true
              this.ids.push(rows[i].id)
            }
          }
        }
      },
      /* 审批不通过-行内 */
      goNoApprovalLine(id) {
        this.noApprovalDialog = true
        this.ids.push(id)
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
