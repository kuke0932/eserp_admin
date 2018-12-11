re<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row>
        <el-form-item label="资源名称" prop="name">
          <el-input clearable v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select :clearable="true" v-model="searchForm.auditStatus" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in auditOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类别" prop="type">
          <el-select :clearable="true" v-model="searchForm.type" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in categoryOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="addResource">
        <i class="el-icons-jd-add"></i>&nbsp;添加资源
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" :disabled="editDisabled" @click="editResource">
        <i class="el-icons-jd-xiugai1"></i>&nbsp;修改资源
      </el-button>
      <el-button class="el-button--danger hidden" code="remove" :disabled="editDisabled" @click="deleteResource" :loading="deleteLoding">
        <i class="el-icons-jd-shanchu"></i>&nbsp;删除资源
      </el-button>
      <el-button class="el-button--primary hidden" code="submit" @click="subxamine" :loading="submitExamineLoading">
        <i class="el-icons-jd-tijiaoshenhe"></i>&nbsp;提交审核
      </el-button>
      <el-button class="el-button--primary hidden" code="revert" :disabled="editDisabled" :loading="revokeLoading" @click="cancelCheck">
        <i class="el-icons-jd-chexiaoshenhe"></i>&nbsp;撤销审核
      </el-button>
      <el-button class="el-button--primary hidden" code="download" @click="downloadResource">
        <i class="el-icons-jd-xiazaiziyuan"></i>&nbsp;下载资源
      </el-button>
      <el-button class="el-button--primary hidden" code="pass" :disabled="editDisabled" @click="passExamine" :loading="adoptLoading">
        <i class="el-icons-jd-shenhetongguoyanzhengchenggongjiangzhangxianxing"></i>&nbsp;审核通过
      </el-button>
      <el-button class="el-button--primary hidden" code="noPass" :disabled="editDisabled" @click="nopassExamine" :loading="notThroughLoading">
        <i class="el-icons-jd-shenhebutongguo"></i>&nbsp;审核不通过
      </el-button>
    </div>
    <!--添加资源-->
    <el-dialog
      title="添加资源"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" v-loading="addLoading" :element-loading-text="loadingText">
        <el-form-item label="资源类型" prop="type">
          <el-select v-model="addForm.type" multiple placeholder="请选择" style="width: 100%" clearable filterable>
            <el-option
              v-for="item in categoryOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input clearable v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="下载密码" prop="code">
          <el-input clearable v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attachmentIds">
          <upload-images :isLarge="true" v-on:fileListChange="fileListChange" :imgList="imgList"></upload-images>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改资源-->
    <el-dialog
      title="修改资源"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px" v-loading="editLoading" :element-loading-text="loadingText">
        <el-form-item label="资源类型" prop="type">
          <el-select style="width: 100%;" v-model="editForm.type" multiple placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in categoryOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input clearable v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="下载密码" prop="codeEdit">
          <el-input clearable v-model="editForm.codeEdit"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attachmentIds">
          <img v-for="item in temps" :src="process.env.BASE_FILE_SERVER + item">
          <upload-images :isLarge="true" :imgList="imgList" v-on:fileListChange="fileListChange"></upload-images>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--提交审核-->
    <el-dialog
      title="提交审核"
      :visible.sync="centerDialogVisible"
      width="20%"
      center>
      <span>是否要提交审核</span>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitAudit(1)">确 定</el-button>
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--撤销审核-->
    <el-dialog
      title="撤销审核"
      :visible.sync="cancelDialogVisible"
      width="20%"
      center>
      <el-input clearable
        type="textarea"
        :rows="4"
        placeholder="请输入撤销原因"
        v-model="reason">
      </el-input>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitAudit(0)">确 定</el-button>
      <el-button @click="cancelDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--审核通过-->
    <el-dialog
      title="审核通过"
      :visible.sync="passDialogVisible"
      width="20%"
      center>
      <el-input clearable
        type="textarea"
        :rows="4"
        placeholder="请输入通过原因"
        v-model="reason">
      </el-input>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitAudit(2)">确 定</el-button>
      <el-button @click="cancelDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--审核不通过-->
    <el-dialog
      title="审核不通过"
      :visible.sync="nopassDialogVisible"
      width="20%"
      center>
      <el-input clearable
        type="textarea"
        :rows="4"
        placeholder="请输入不通过原因"
        v-model="reason">
      </el-input>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitAudit(3)">确 定</el-button>
      <el-button @click="cancelDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--输入下载密码-->
    <el-dialog
      title="请输入下载密码"
      :visible.sync="downloadPasswordVisible"
      width="20%"
      :before-close="closeDownload"
      center>
      <el-form ref="downloadForm" :rules="downloadFormRules" :model="downloadForm" label-width="80px">
        <el-form-item prop="downloadPassword">
          <el-input clearable
            placeholder="请输入下载密码" type="password"
            v-model="downloadForm.downloadPassword" required="required">
          </el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="confirmDownload()">确 定</el-button>
          <el-button @click="downloadPasswordVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--获取资源列表-->
    <el-table
      :data="useList"
      v-loading.body="listLoading"
      :element-loading-text="loadingText"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="资源名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="资源类别">
        <template slot-scope="scope">
          {{scope.row.typeName}}
          <!--{{scope.row.type == 1 ? '主图' : scope.row.type == 2 ? '详情' : scope.row.type == 4 ? '颜色图' : scope.row.type == 8 ? '海报' : scope.row.type == 16 ? '活动图' : scope.row.type == 32 ? '推广图' : scope.row.type == 64 ? '店铺装修图' : scope.row.type == 128 ? '主图修改' : scope.row.type == 521 ? '详情修改' : scope.row.type == 1024 ? '颜色图修改' : scope.row.type == 2048 ? '海报修改' : scope.row.type == 3072 ? '活动图修改' : scope.row.type == 4096 ? '推广图修改' : '店铺装修图修改' }}-->
        </template>
      </el-table-column>
      <el-table-column label="上传者">
        <template slot-scope="scope">
          {{scope.row.createName}}
        </template>
      </el-table-column>
      <el-table-column label="上传时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          {{scope.row.updateTime}}
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          {{scope.row.auditStatus == 0 ? '已保存' : scope.row.auditStatus == 1 ? '待审核' : scope.row.auditStatus == 2 ? '审核通过' : '审核未通过'}}
        </template>
      </el-table-column>
      <el-table-column label="审核意见">
        <template slot-scope="scope">
          {{scope.row.reason}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改资源">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditSource(scope.row.id,scope.row.auditStatus)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除资源">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeLine(scope.row.id,scope.row.auditStatus)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="提交审核">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="submit" icon="el-icons-jd-tijiaoshenhe" @click="submitAuditLine(scope.row.id, 1)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="撤销审核">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="revert" icon="el-icons-jd-chexiaoshenhe" @click="submitAuditLine(scope.row.id, 0)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="下载资源">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="download" icon="el-icons-jd-xiazaiziyuan" @click="downloadResourceLine(scope.row)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="审核通过">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="pass" icon="el-icons-jd-shenhetongguoyanzhengchenggongjiangzhangxianxing" @click="submitAuditLine(scope.row.id, 2)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="审核不通过">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="noPass" icon="el-icons-jd-shenhebutongguo" @click="submitAuditLine(scope.row.id, 3)"></el-button>
          </el-popover>

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
  import { authMenuButton } from '@/utils/authMenuButton'
  import BaseTable from '@/components/BaseTable'
  import UploadImages from '@/components/UploadImages'
  import { list, save, update, remove, getById, updateAuditStatus, checkDownloadCode } from '@/api/senseHouqi'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'senseHouqi',
    extends: BaseTable,
    components: {
      UploadImages /* 上传附件组件 */
    },
    data() {
      return {
        loadingText: '拼命加载中',
        total: -1,
        pageNum: 1,
        pageSize: 10,
        useList: null,
        multipleSelection: [],
        resourceRow: null,
        createName: null,
        carModel: null,
        status: null,
        isAll: true,
        usage: null,
        listLoading: false,
        imgList: [],
        temps: [],
        submitExamineLoading: false,
        notThroughLoading: false,
        adoptLoading: false,
        revokeLoading: false,
        deleteLoding: false,
        editLoading: false,
        addLoading: false,
        searchLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        centerDialogVisible: false,
        cancelDialogVisible: false,
        passDialogVisible: false,
        nopassDialogVisible: false,
        downloadPasswordVisible: false,
        dialogFormVisible: false,
        viewUserDialogVisible: false,
        viewMenuDialogVisible: false,
        editDisabled: false,
        reason: null,
        id: null,
        downloadForm: {
          downloadPassword: null
        },
        downloadFormRules: {
          downloadPassword: [
            { required: true, message: '请输入下载密码', trigger: 'blur' }
          ]
        },
        auditOption: [{
          value: '0',
          label: '已保存'
        }, {
          value: '1',
          label: '待审核'
        }, {
          value: '2',
          label: '审核通过'
        }, {
          value: '3',
          label: '审核未通过'
        }],
        categoryOption: [{
          value: 1, // 2的0次
          label: '主图'
        }, {
          value: 2, // 2的1次
          label: '详情'
        }, {
          value: 4, // 2的2次
          label: '颜色图'
        }, {
          value: 8, // 2的3次
          label: '海报'
        }, {
          value: 16, // 2的4次
          label: '活动图'
        }, {
          value: 32, // 2的5次
          label: '推广图'
        }, {
          value: 64, // 2的6次
          label: '店铺装修图'
        }, {
          value: 128, // 2的7次
          label: '主图修改'
        }, {
          value: 256, // 2的8次
          label: '详情修改'
        }, {
          value: 512, // 2的9次
          label: '颜色图修改'
        }, {
          value: 1024, // 2的10次
          label: '海报修改'
        }, {
          value: 2048, // 2的11次
          label: '活动图修改'
        }, {
          value: 4096, // 2的12次
          label: '推广图修改'
        }, {
          value: 8192, // 2的13次
          label: '店铺装修图修改'
        }],
        value: '',
        searchForm: {
          name: null,
          auditStatus: null,
          type: null
        },
        addForm: {
          type: [],
          name: '',
          code: '',
          attachmentIds: ''
        },
        editForm: {
          id: '',
          type: [],
          name: '',
          codeEdit: '',
          attachmentUuid: '',
          attachmentIds: ''
        },
        rules: {
          type: [
            { required: true, message: '请选择资源类别', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入资源名称', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入下载密码', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      useList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(null, null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 资源列表 */
      fetchData(name, auditStatus, type, pageNum, pageSize) {
        this.listLoading = true
        return list(
          name,
          auditStatus,
          type,
          pageNum,
          pageSize
        ).then(response => {
          this.useList = response.data.data.rows
          this.useList.forEach((e, i) => {
            e['idx'] = i
            const types = this.getTypes(e['type'])
            e['typeName'] = types.map(t => this.categoryOption[this.get2Pow(t)].label).join(';')
          })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
          this.searchLoading = false
          this.submitExamineLoading = false
          this.revokeLoading = false
          this.adoptLoading = false
          this.notThroughLoading = false
          return response
        }).catch(e => {
          this.listLoading = false
          this.searchLoading = false
          this.submitExamineLoading = false
          this.revokeLoading = false
          this.adoptLoading = false
          this.notThroughLoading = false
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.name, this.searchForm.auditStatus, this.searchForm.type, this.pageNum, this.pageSize)
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.name, this.searchForm.auditStatus, this.searchForm.type, this.pageNum, this.pageSize)
      },
      /* 获取所勾选资源 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.fetchData(this.searchForm.name, this.searchForm.auditStatus, this.searchForm.type, this.pageNum, this.pageSize)
      },
      /* 打开添加资源对话框 */
      addResource() {
        this.dialogVisible = true
      },
      /* 打开提交审核对话框 */
      subxamine() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].auditStatus !== 0) {
            this.$message({
              type: 'warning',
              message: '只能选择状态为【已保存】的进行提交审核！',
              duration: 1500
            })
            return
          }
        }
        this.centerDialogVisible = true
      },
      submitAudit(status) {
        this.centerDialogVisible = false
        let message
        if (status === 0) {
          this.revokeLoading = true
          this.loadingText = '正在撤销'
          message = '撤销成功！'
          if (!this.reason) {
            this.$message({
              type: 'warning',
              message: '请输入撤销原因！',
              duration: 1500
            })
            this.revokeLoading = false
            return
          }
          this.cancelDialogVisible = false
        }
        if (status === 1) {
          this.submitExamineLoading = true
          this.loadingText = '正在提交'
          message = '提交成功！'
        }
        if (status === 2) {
          this.adoptLoading = true
          message = '审核通过！'
          if (!this.reason) {
            this.$message({
              type: 'warning',
              message: '请输入通过原因！',
              duration: 1500
            })
            this.adoptLoading = false
            return
          }
          this.passDialogVisible = false
        }
        if (status === 3) {
          this.notThroughLoading = true
          message = '审核不通过！'
          if (!this.reason) {
            this.$message({
              type: 'warning',
              message: '请输入不通过原因！',
              duration: 1500
            })
            this.notThroughLoading = false
            return
          }
          this.nopassDialogVisible = false
        }
        const auditStatusList = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const data = {
            id: this.multipleSelection[i].id,
            fromStatus: this.multipleSelection[i].auditStatus,
            auditStatus: status,
            reason: this.reason
          }
          auditStatusList.push(data)
        }
        updateAuditStatus(auditStatusList).then(resp => {
          this.$message({
            type: 'success',
            message: message,
            duration: 1500
          })
          this.reason = null
          this.loadingText = '拼命加载中'
          this.fetchData(this.searchForm.name, this.searchForm.auditStatus, this.searchForm.type, this.pageNum, this.pageSize)
        })
      },
      submitAuditLine(id, status) {
        this.centerDialogVisible = false
        let message
        if (status === 0) {
          this.revokeLoading = true
          this.loadingText = '正在撤销'
          message = '撤销成功！'
          if (!this.reason) {
            this.$message({
              type: 'warning',
              message: '请输入撤销原因！',
              duration: 1500
            })
            this.revokeLoading = false
            return
          }
          this.cancelDialogVisible = false
        }
        if (status === 1) {
          this.submitExamineLoading = true
          this.loadingText = '正在提交'
          message = '提交成功！'
        }
        if (status === 2) {
          this.adoptLoading = true
          message = '审核通过！'
          if (!this.reason) {
            this.$message({
              type: 'warning',
              message: '请输入通过原因！',
              duration: 1500
            })
            this.adoptLoading = false
            return
          }
          this.passDialogVisible = false
        }
        if (status === 3) {
          this.notThroughLoading = true
          message = '审核不通过！'
          if (!this.reason) {
            this.$message({
              type: 'warning',
              message: '请输入不通过原因！',
              duration: 1500
            })
            this.notThroughLoading = false
            return
          }
          this.nopassDialogVisible = false
        }
        updateAuditStatus(id, status, this.reason).then(resp => {
          this.$message({
            type: 'success',
            message: message,
            duration: 1500
          })
          this.reason = null
          this.loadingText = '拼命加载中'
          this.fetchData(this.searchForm.name, this.searchForm.auditStatus, this.searchForm.type, this.pageNum, this.pageSize)
        })
      },
      /* 撤销审核 */
      cancelCheck() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].auditStatus !== 1) {
            this.$message({
              type: 'warning',
              message: '只能选择状态为【待审核】的进行撤销审核！',
              duration: 1500
            })
            return
          }
        }
        this.cancelDialogVisible = true
      },
      /* 审核通过 */
      passExamine() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].auditStatus !== 1) {
            this.$message({
              type: 'warning',
              message: '只能选择状态为【待审核】的进行审核通过！',
              duration: 1500
            })
            return
          }
        }
        this.passDialogVisible = true
      },
      /* 审核不通过 */
      nopassExamine() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].auditStatus !== 1) {
            this.$message({
              type: 'warning',
              message: '只能选择状态为【待审核】的进行审核不通过！',
              duration: 1500
            })
            return
          }
        }
        this.nopassDialogVisible = true
      },
      /* 打开修改资源对话框 */
      editResource() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].auditStatus !== 0) {
            this.$message({
              type: 'warning',
              message: '提交审核的数据不可修改！',
              duration: 1500
            })
            return
          }
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        const source = this.multipleSelection[0]
        getById(source.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.name = resp.data.data.name
          // this.editForm.codeEdit = resp.data.data.code
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          const temps = resp.data.data.attachmentList
          if (temps !== null) {
            for (let i = 0; i < temps.length; i++) {
              temps[i].attachmentUrl = process.env.BASE_FILE_SERVER + temps[i].attachmentUrl
            }
          }
          this.imgList = temps
          this.editForm.type = this.getTypes(resp.data.data.type)
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      getTypes(c) {
        const ret = []
        // 判断是否是2的n次幂
        if ((c !== 0 && (c & (c - 1)) === 0)) {
          ret.push(c)
          return ret
        } else {
          let cmp = 1
          while (c >= cmp) {
            if ((c & cmp) === cmp) {
              ret.push(cmp)
            }
            cmp <<= 1
          }
          return ret
        }
      },
      // 计算2的n次幂
      get2Pow(c) {
        let i = 0
        while (c !== 0) {
          c >>= 1
          i++
        }
        return i - 1
      },
      /* 点击右侧操作修改小按钮 */
      goEditSource(id, auditStatus) {
        if (id === null || id === undefined) {
          if (this.multipleSelection.length !== 1) {
            this.$message({
              type: 'warning',
              message: '请选中一行再执行此操作!'
            })
            return Promise.reject(new Error('error'))
          }
          id = this.multipleSelection[0].id
        }
        if (auditStatus !== 0) {
          this.$message({
            type: 'warning',
            message: '提交审核的数据不可修改！',
            duration: 1500
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        getById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.name = resp.data.data.name
          this.editForm.attachmentIds = resp.data.data.attachmentIds
          this.imgList = resp.data.data.attachmentList
          this.editForm.type = resp.data.data.type
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      /* 删除资源 */
      deleteResource() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].auditStatus !== 0) {
            this.$message({
              type: 'warning',
              message: '提交审核的数据不可删除！',
              duration: 1500
            })
            return
          }
        }
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          this.deleteLoding = true
          this.listLoading = true
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(null, null, null, this.pageNum, this.pageSize)
                this.deleteLoding = false
                this.listLoading = false
              }
            })
          }).catch(e => {
            this.deleteLoding = false
            this.listLoading = false
          })
        })
      },
      removeLine(id, auditStatus) {
        if (auditStatus !== 0) {
          this.$message({
            type: 'warning',
            message: '提交审核的数据不可删除！',
            duration: 1500
          })
          return
        }
        this.$confirm('此操作将删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteLoding = true
          this.listLoading = true
          remove(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(null, null, null, this.pageNum, this.pageSize)
                this.deleteLoding = false
                this.listLoading = false
              }
            })
          }).catch(e => {
            this.deleteLoding = false
            this.listLoading = false
          })
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              /* const id = this.useList.length !== 0 ? this.useList[this.useList.length - 1].id + 1 : 1 */
              this.addLoading = true
              this.loadingText = '正在提交'
              save(
                this.addForm.type.reduce((a, b) => a + b),
                this.addForm.name,
                this.addForm.code,
                this.addForm.attachmentIds
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.name, this.searchForm.auditStatus, this.searchForm.type, this.pageNum, this.pageSize).then(resp => {
                      this.addLoading = false
                      this.loadingText = '拼命加载中'
                    })
                    this.$refs[formName].resetFields()
                    this.imgList = []
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.addLoading = false
                this.loadingText = '拼命加载中'
              })
            } else if (formName === 'editForm') {
              this.editLoading = true
              this.loadingText = '正在提交'
              update(
                this.editForm.id,
                this.editForm.type.reduce((a, b) => a + b),
                this.editForm.name,
                this.editForm.codeEdit,
                this.editForm.attachmentIds,
                this.editForm.attachmentUuid
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.name, this.searchForm.auditStatus, this.searchForm.type, this.pageNum, this.pageSize).then(resp => {
                      this.editLoading = false
                      this.loadingText = '拼命加载中'
                    })
                    this.$refs[formName].resetFields()
                    this.editDialogVisible = false
                  }
                })
              }).catch(e => {
                this.editLoading = false
                this.loadingText = '拼命加载中'
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /* 下载资源 */
      downloadResource() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.resourceRow = this.multipleSelection[0]
        this.downloadPasswordVisible = true
      },
      downloadResourceLine(row) {
        this.resourceRow = row
        this.downloadPasswordVisible = true
      },
      /* 确认下载 */
      confirmDownload() {
        this.$refs['downloadForm'].validate((valid) => {
          if (valid) {
            if (!this.resourceRow || this.resourceRow.attachmentList === 0) {
              this.$message({
                type: 'warning',
                message: '没有资源文件可供下载！',
                duration: 1500
              })
              return
            }
            // 验证下载密码是否正确
            checkDownloadCode(this.resourceRow.id, this.downloadForm.downloadPassword).then(resp => {
              if (resp.data.status === 200) {
                const fileList = []
                this.resourceRow.attachmentList.forEach(v => {
                  const fileEntity = {}
                  fileEntity.fileName = v.attachmentName
                  fileEntity.filePath = v.attachmentUrl
                  fileList.push(fileEntity)
                })
                let urlParam = ''
                for (let i = 0; i < fileList.length; i++) {
                  // [] encodeURIComponent %5B %5D
                  urlParam += '&fileList%5B' + i + '%5D.fileName=' + encodeURIComponent(fileList[i].fileName)
                  urlParam += '&fileList%5B' + i + '%5D.filePath=' + encodeURIComponent(fileList[i].filePath)
                }
                document.getElementById('iframe').src = process.env.BASE_FILE_SERVER + ('/file/largeFile/downloadZip?resourceId=' + this.resourceRow.id +
                  '&type=' + this.resourceRow.type +
                  '&fileName=' + this.resourceRow.name + urlParam + '&x=' + getToken())

                this.$refs['downloadForm'].resetFields()
                this.resourceRow = null
                this.downloadPasswordVisible = false
              } else {
                this.$message({
                  type: 'warning',
                  message: '密码错误！',
                  duration: 1500
                })
              }
            })
          }
        })
      },

      fileListChange(imgList) {
        const imgIds = imgList.map(img => img.attachmentId).join(',')
        this.addForm.attachmentIds = imgIds
        this.editForm.attachmentIds = imgIds
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.editLoading === true || this.addLoading === true) {
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
      closeDownload(done) {
        done()
        this.$refs['downloadForm'].resetFields()
      }
    }
  }
</script>
<style scoped>

</style>
