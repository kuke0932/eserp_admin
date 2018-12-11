<template>
  <div class="container">
    <el-form ref="searchForm" :inline="true" class="searchForm" :model="searchForm">
      <el-row>
          <el-form-item label="投诉人手机号" prop="telephone">
            <el-input clearable style="min-width: 70px;width: 170px;" v-model="searchForm.telephone"></el-input>
          </el-form-item>
          <el-form-item label="投诉人姓名" prop="nickname">
            <el-input clearable style="min-width: 170px;width: 170px;" v-model="searchForm.nickname"></el-input>
          </el-form-item>
          <el-form-item label="处理状态" prop="status">
            <el-select  :clearable="true" v-model="searchForm.status" placeholder="请选择处理状态" clearable filterable>
              <el-option v-for="item in optionsStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="投诉类型" prop="complaintSource">
            <el-select  :clearable="true" v-model="searchForm.complaintSource" placeholder="请选择投诉类型" clearable filterable>
              <el-option v-for="item in optionsComplaintSource" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="投诉对象" prop="complaintItem">
            <el-input clearable v-model="searchForm.complaintItem"></el-input>
          </el-form-item>
          <el-form-item  label="投诉内容" prop="complaintContent">
            <el-input clearable v-model="searchForm.complaintContent"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button  type="primary" :loading="searchLoading" @click="searchComplaint">查询</el-button>
            <el-button  type="primary" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
      </el-row>
    </el-form>

    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="save"><i class="el-icons-jd-add"></i>&nbsp;添加投诉</el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="updateComplaint"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改投诉</el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="deleteComplaint"><i class="el-icons-jd-shanchu"></i>&nbsp;删除投诉</el-button>
      <el-button class="el-button--primary hidden" code="deal" :loading="updateResultLoading" @click="updateResultComplaint"><i class="el-icons-jd-chuli"></i>&nbsp;处理</el-button>
    </div>

    <el-dialog
      title="添加投诉 "
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="120px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="投诉人姓名" prop="nickname">
          <el-input clearable v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="投诉人手机号" prop="telephone">
          <el-input clearable v-model="addForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="投诉类型" prop="complaintSource">
          <el-select v-model="addForm.complaintSource" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in optionsComplaintSource"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投诉对象" prop="complaintItem">
          <el-input clearable v-model="addForm.complaintItem"></el-input>
        </el-form-item>
        <el-form-item label="投诉内容" prop="complaintContent">
          <el-input clearable type="textarea" v-model="addForm.complaintContent"></el-input>
        </el-form-item>
        <el-form-item label="投诉图片" prop="imgList">
          <upload-images :imgList="imgList" :limitExceed="3" v-on:fileListChange="fileListChange" ></upload-images>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="修改投诉 "
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">

        <el-form-item label-width="100px" label="投诉人姓名" prop="nickname">
          <el-input clearable v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="投诉人手机号" prop="telephone">
          <el-input clearable v-model="editForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="投诉类型" prop="complaintSource">
          <el-select v-model="editForm.complaintSource" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in optionsComplaintSource"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="投诉对象" prop="complaintItem">
          <el-input clearable v-model="editForm.complaintItem"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="投诉内容" prop="complaintContent">
          <el-input clearable type="textarea" v-model="editForm.complaintContent"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="投诉图片" prop="imgList">
          <upload-images :imgList="imgList" :limitExceed="3" v-on:fileListChange="fileListChange" ></upload-images>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="处理结果"
      :visible.sync="complaintVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="complaintForm" :rules="rules" :model="complaintForm" label-width="80px"
               v-loading="updateResultFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label-width="0px" label="" prop="complaintResult">
          <el-input clearable type="textarea" v-model="complaintForm.complaintResult" autosize></el-input>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('complaintForm')">保存</el-button>
          <el-button @click="resetForm('complaintForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <show-carousel-images :visible.sync="carouselDialogVisible" :imgList="this.attachmentUrls"></show-carousel-images>

    <el-table
      :data="complaintList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="淘宝昵称" width="100">
        <template slot-scope="scope">
          {{scope.row.nickname}}
        </template>
      </el-table-column>
      <el-table-column label="投诉人手机号" width="150">
        <template slot-scope="scope">
          {{scope.row.telephone}}
        </template>
      </el-table-column>
      <el-table-column label="投诉类型" width="100">
        <template slot-scope="scope">
          {{scope.row.complaintSource == 1 ? '客服' : scope.row.complaintSource == 2 ? '快递' : '订单'}}
        </template>
      </el-table-column>
      <el-table-column label="投诉对象" width="100">
        <template slot-scope="scope">
          {{scope.row.complaintItem}}
        </template>
      </el-table-column>
      <el-table-column label="投诉内容" width="180">
        <template slot-scope="scope">
          {{scope.row.complaintContent}}
        </template>
      </el-table-column>
      <el-table-column label="图片" width="80" >
        <template slot-scope="scope">
          <a style="text-decoration: underline;" href="javascript:void(0)" @click="showCarousel(scope.row.attachmentList)">查看图片</a>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="处理状态" width="100">
        <template slot-scope="scope">
          {{scope.row.status==1?'已处理':'待处理'}}
        </template>
      </el-table-column>
      <el-table-column label="处理人">
        <template slot-scope="scope">
          {{scope.row.operateName}}
        </template>
      </el-table-column>
      <el-table-column label="处理结果" width="200">
        <template slot-scope="scope">
          {{scope.row.operateResult}}
        </template>
      </el-table-column>
      <el-table-column label="处理时间">
        <template slot-scope="scope">
          {{scope.row.operateTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start" v-if="scope.row.status !== 1"
            width="100"
            trigger="hover"
            content="修改投诉">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="删除投诉">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover placement="top-start" v-if="scope.row.status !== 1"
                      width="100"
                      trigger="hover"
                      content="处理投诉">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="deal" icon="el-icons-jd-chuli" @click="updateResultComplaintLine(scope.row.id)"></el-button>
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
  import { getById, list, save, update, remove, updateResult } from '@/api/complaint'
  import UploadImages from '@/components/UploadImages'
  import ShowCarouselImages from '@/components/ShowCarouselImages'

  export default {
    name: '投诉管理',
    components: {
      UploadImages,
      ShowCarouselImages
    },
    data() {
      return {
        imgList: [], // { id: 1234, file: null, url: 'baidu.png' }
        optionsStatus: [{
          value: '1',
          label: '已处理'
        }, {
          value: '0',
          label: '待处理'
        }],
        optionsComplaintSource: [{
          value: 1,
          label: '客服'
        }, {
          value: 2,
          label: '快递'
        }, {
          value: 3,
          label: '订单'
        }],
        attachmentUrls: [],
        temps: [],
        listLoading: false, // table
        searchLoading: false, // 查询按钮
        addFormLoading: false, // 添加对话框
        editFormLoading: false, // 修改对话框
        submitLoading: false, // 提交按钮
        loadingText: '拼命加载中......', // 提示的文字
        removeLoading: false, // 删除按钮
        updateResultLoading: false, // 处理按钮
        updateResultFormLoading: false, // 处理对话框
        complaintList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        list: null,
        dialogVisible: false,
        editDialogVisible: false,
        complaintVisible: false,
        carouselDialogVisible: false,
        multipleSelection: [],
        enableStatus: null,
        currentId: '',
        ids: [],
        addForm: {
          attachmentIds: '',
          complaintContent: '',
          complaintItem: '',
          complaintSource: '',
          nickname: '',
          telephone: ''
        },
        editForm: {
          attachmentUuid: '',
          attachmentIds: '',
          complaintContent: '',
          complaintItem: '',
          complaintSource: '',
          nickname: '',
          telephone: ''
        },
        searchForm: {
          telephone: '',
          nickname: '',
          status: '',
          complaintSource: '',
          complaintItem: '',
          complaintContent: ''
        },
        complaintForm: {
          complaintResult: ''
        },
        rules: {
          nickname: [
            { required: true, message: '请输入投诉人姓名', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
          ],
          complaintSource: [
            { required: true, message: '请选择投诉类型', trigger: 'change' }
          ],
          complaintItem: [
            { required: true, message: '请输入投诉对象', trigger: 'blur' }
          ],
          complaintContent: [
            { required: true, message: '请输入投诉内容', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      complaintList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.fetchData(null, null, null, null, null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 初始化单位列表 */
      fetchData(nickname, telephone, status, complaintSource, complaintItem, complaintContent, pageNum, pageSize) {
        this.listLoading = true
        return list(
          nickname,
          telephone,
          status,
          complaintSource,
          complaintItem,
          complaintContent,
          pageNum,
          pageSize
        ).then(resp => {
          this.complaintList = resp.data.data.rows
          this.complaintList.forEach((e, i) => { e['idx'] = i })
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          if (resp.data.data.pages === 0) {
            this.pages = 1
          } else {
            this.pages = resp.data.data.pages
          }
          this.listLoading = false
          return resp
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 查询 */
      searchComplaint() {
        this.searchLoading = true
        this.listLoading = true
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(
            this.searchForm.nickname,
            this.searchForm.telephone,
            this.searchForm.status,
            this.searchForm.complaintSource,
            this.searchForm.complaintItem,
            this.searchForm.complaintContent,
            this.pageNum,
            this.pageSize
          ).then((resp) => {
            this.searchLoading = false
            this.listLoading = false
          })
        }
      },
      /* 打开添加投诉对话框 */
      save() {
        this.dialogVisible = true
      },
      /* 打开修改投诉对话框 */
      updateComplaint() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editFormLoading = true
        const complaint = this.multipleSelection[0]
        if (complaint.status === 1) {
          this.$message({
            type: 'warning',
            message: '该投诉已经处理，禁止修改!'
          })
          this.editLoading = false
          return
        }
        getById(complaint.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.nickname = resp.data.data.nickname
          this.editForm.telephone = resp.data.data.telephone
          this.editForm.complaintSource = resp.data.data.complaintSource
          this.editForm.complaintItem = resp.data.data.complaintItem
          this.editForm.complaintContent = resp.data.data.complaintContent
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.imgList = resp.data.data.attachmentList || []
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
        this.editDialogVisible = true
      },
      /* 表格里操作按钮 修改 */
      goEditLine(id) {
        this.editFormLoading = true
        this.editForm.id = id
        getById(id).then(resp => {
          this.editForm.nickname = resp.data.data.nickname
          this.editForm.telephone = resp.data.data.telephone
          this.editForm.complaintSource = resp.data.data.complaintSource
          this.editForm.complaintItem = resp.data.data.complaintItem
          this.editForm.complaintContent = resp.data.data.complaintContent
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.imgList = resp.data.data.attachmentList || []
          this.editFormLoading = false
        }).catch(e => {
          this.editFormLoading = false
        })
        this.editDialogVisible = true
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              this.submitLoading = true
              this.addFormLoading = true
              this.loadingText = '正在提交......'
              save(
                this.addForm.attachmentIds,
                this.addForm.complaintContent,
                this.addForm.complaintItem,
                this.addForm.complaintSource,
                this.addForm.nickname,
                this.addForm.telephone
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(
                      this.searchForm.nickname,
                      this.searchForm.telephone,
                      this.searchForm.status,
                      this.searchForm.complaintSource,
                      this.searchForm.complaintItem,
                      this.searchForm.complaintContent,
                      this.pageNum,
                      this.pageSize
                    ).then((resp) => {
                      this.addFormLoading = false
                      this.submitLoading = false
                      this.loadingText = '拼命加载中......'
                    })
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              }).catch(e => {
                this.addFormLoading = false
                this.submitLoading = false
                this.loadingText = '拼命加载中......'
              })
            } else if (formName === 'editForm') {
              this.submitLoading = true
              this.editFormLoading = true
              this.loadingText = '正在提交......'
              update(
                this.editForm.id,
                this.editForm.attachmentUuid,
                this.editForm.nickname,
                this.editForm.telephone,
                this.editForm.complaintSource,
                this.editForm.complaintItem,
                this.editForm.complaintContent,
                this.editForm.attachmentIds
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(
                      this.searchForm.nickname,
                      this.searchForm.telephone,
                      this.searchForm.status,
                      this.searchForm.complaintSource,
                      this.searchForm.complaintItem,
                      this.searchForm.complaintContent,
                      this.pageNum,
                      this.pageSize
                    ).then((resp) => {
                      this.submitLoading = false
                      this.editFormLoading = false
                      this.loadingText = '拼命加载中......'
                    })
                    this.$refs[formName].resetFields()
                    this.editDialogVisible = false
                  }
                })
              }).catch(e => {
                this.submitLoading = false
                this.editFormLoading = false
                this.loadingText = '拼命加载中......'
              })
            } else if (formName === 'complaintForm') {
              this.submitLoading = true
              this.updateResultFormLoading = true
              this.loadingText = '正在提交......'
              this.listloading = true
              updateResult(this.ids.join(','), this.complaintForm.complaintResult).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加处理结果成功',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(
                      this.searchForm.nickname,
                      this.searchForm.telephone,
                      this.searchForm.status,
                      this.searchForm.complaintSource,
                      this.searchForm.complaintItem,
                      this.searchForm.complaintContent,
                      this.pageNum,
                      this.pageSize
                    ).then((resp) => {
                      this.submitLoading = false
                      this.updateResultFormLoading = false
                      this.loadingText = '拼命加载中......'
                      this.listloading = false
                    })
                    this.$refs[formName].resetFields()
                    this.complaintVisible = false
                    this.ids = []
                  }
                })
              }).catch(e => {
                this.submitLoading = false
                this.updateResultFormLoading = false
                this.loadingText = '拼命加载中......'
                this.listloading = false
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.imgList = []
        this.$refs[formName].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.editFormLoading === true || this.submitLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          // this.province = []
          this.imgList = []
          this.dialogVisible = false
          this.editDialogVisible = false
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
        }).catch(() => {

        })
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(
          this.searchForm.nickname,
          this.searchForm.telephone,
          this.searchForm.status,
          this.searchForm.complaintSource,
          this.searchForm.complaintItem,
          this.searchForm.complaintContent,
          this.pageNum,
          this.pageSize
        )
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(
          this.searchForm.nickname,
          this.searchForm.telephone,
          this.searchForm.status,
          this.searchForm.complaintSource,
          this.searchForm.complaintItem,
          this.searchForm.complaintContent,
          this.pageNum,
          this.pageSize
        )
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      fileListChange(imgList) {
        const imgIds = imgList.map(img => img.attachmentId).join(',')
        this.addForm.attachmentIds = imgIds
        this.editForm.attachmentIds = imgIds
      },
      // 查看轮播
      showCarousel(attachmentList) {
        this.attachmentUrls = attachmentList.map(img => img.attachmentUrl)
        if (this.attachmentUrls.length === 0) {
          this.$message({
            type: 'warning',
            message: '暂无图片显示!',
            duration: 1500
          })
          return
        }
        this.carouselDialogVisible = true
      },
      /* 删除投诉 */
      deleteComplaint() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        this.$confirm('此操作将永久删除该投诉，是否继续', '提示', {
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
                  this.searchForm.nickname,
                  this.searchForm.telephone,
                  this.searchForm.status,
                  this.searchForm.complaintSource,
                  this.searchForm.complaintItem,
                  this.searchForm.complaintContent,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.listLoading = false
                  this.removeLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
            this.removeLoading = false
          })
        })
      },
      /* 删除 表格内*/
      removeLine(ids) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
                  this.searchForm.nickname,
                  this.searchForm.telephone,
                  this.searchForm.status,
                  this.searchForm.complaintSource,
                  this.searchForm.complaintItem,
                  this.searchForm.complaintContent,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.listLoading = false
                  this.removeLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
            this.removeLoading = false
          })
        })
      },
      // 处理结果
      updateResultComplaint() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
        } else {
          const ms = this.multipleSelection

          for (let i = 0; i < ms.length; i++) {
            if (ms[i].status === 1) {
              this.$message({
                type: 'warning',
                message: '请选择处理状态为【待处理】的再操作',
                duration: 1500
              })
              return
            }
            this.ids.push(ms[i].id)
          }
          this.complaintVisible = true
        }
      },
      // 处理结果
      updateResultComplaintLine(id) {
        this.complaintVisible = true
        this.ids.push(id)
      }
    }
  }
</script>

<style scoped>
</style>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
