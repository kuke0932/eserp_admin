<template>
  <div class="container">
    <el-form  ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row>
        <el-form-item label="车型" prop="carTypeCode">
          <el-select v-model="searchForm.carTypeCode" :clearable="true" placeholder="请选择车型" filterable :filter-method="filterBrand">
            <el-option v-for="item in filterCarTypeOptions"
                       :key="item.carTypeCode"
                       :label="item.brandName + item.carTypeName"
                       :value="item.carTypeCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input clearable v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary" code="add" @click="uploadResources"><i class="el-icons-jd-add"></i>&nbsp;添加版型</el-button>
      <el-button class="el-button--primary" code="edit" @click="editResources"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改版型</el-button>
      <el-button class="el-button--danger hidden" code="del" :loading="deleteLoading" @click="deleteResources"><i class="el-icons-jd-shanchu"></i>&nbsp;删除版型</el-button>
      <el-button class="el-button--primary" code="download" @click="loadResources"><i class="el-icons-jd-xiazaiziyuan"></i>&nbsp;下载版型</el-button>
      <el-button class="el-button--primary" code="downloadImg" @click="loadImgResources"><i class="el-icons-jd-xiazaiziyuan"></i>&nbsp;下载版型图片</el-button>
    </div>
    <!--上传资源信息对话框-->
    <el-dialog
      title="上传资源信息 "
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" v-loading="addLoading" :element-loading-text="loadingText">
        <el-form-item label="品牌" prop="brandCode" >
          <el-select v-model="addForm.brandCode" placeholder="请选择品牌" @change="addChangeBrandCode" clearable filterable>
            <el-option v-for="item in brandCodes"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="carTypeCode" >
          <el-select v-model="addForm.carTypeCode" placeholder="请选择车型" clearable filterable>
            <el-option v-for="item in carTypes"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productTypeCode">
          <el-select v-model="addForm.productTypeCode" placeholder="请选择产品型号" clearable filterable>
            <el-option
              v-for="item in productTypeList"
              :key="item.id"
              :label="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input clearable v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="版型文件" prop="attachmentIds" label-width="80px">
          <el-upload class="upload-demo"
            :action="baseFileServer + '/file/carModel/upload?x=' + token"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-remove="beforeRemove"
            :limit="20"
            :on-exceed="handleExceed"
            :file-list="carModelFileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传plt/dxf文件,最多20个文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片文件" prop="attachmentIds">
          <upload-images v-on:fileListChange="fileListChange" :imgList="imgList"></upload-images>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改资源信息对话框-->
    <el-dialog
      title="修改资源信息"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px" v-loading="editLoading" :element-loading-text="loadingText">
        <el-form-item label="品牌" prop="brandCode" >
          <el-select v-model="editForm.brandCode" placeholder="请选择品牌" @change="editChangeBrandCode" clearable filterable>
            <el-option v-for="item in brandCodes"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="carTypeCode">
          <el-select v-model="editForm.carTypeCode" placeholder="请选择车型" clearable filterable>
            <el-option v-for="item in carTypes"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productTypeCode">
          <el-select v-model="editForm.productTypeCode" placeholder="请选择产品型号" clearable filterable>
            <el-option
              v-for="item in productTypeList"
              :key="item.id"
              :label="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input clearable v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="版型文件" prop="attachmentIds">
          <el-upload class="upload-demo"
                     :action="baseFileServer + '/file/carModel/upload?x=' + token"
                     :on-remove="handleRemove"
                     :before-remove="beforeRemove"
                     :on-success="handleSuccess"
                     :limit="20"
                     :on-exceed="handleExceed"
                     :file-list="carModelFileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb,最多20个文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片文件" prop="attachmentIds">
          <upload-images v-on:fileListChange="fileListChange" :imgList="imgList"></upload-images>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--资源信息维护列表-->
    <el-table
      :data="carList"
      v-loading.body="listLoading"
      :element-loading-text="loadingText"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="品牌">
        <template slot-scope="scope">
          {{scope.row.brandName}}
        </template>
      </el-table-column>
      <el-table-column label="车型编码">
        <template slot-scope="scope">
          {{scope.row.carTypeCode}}
        </template>
      </el-table-column>
      <el-table-column label="车型名称">
        <template slot-scope="scope">
          {{scope.row.carTypeName}}
        </template>
      </el-table-column>
      <el-table-column label="产品型号">
        <template slot-scope="scope">
          {{scope.row.productTypeCode}}
        </template>
      </el-table-column>
      <el-table-column label="资源名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="版型图片">
        <template slot-scope="scope">
          <a style="text-decoration: underline;" href="javascript:void(0)"
             @click="showCarousel(scope.row.attachmentList)">查看图片</a>
        </template>
      </el-table-column>
      <el-table-column label="版型文件">
        <template slot-scope="scope">

          <el-popover v-if="scope.row.attachmentCarModelList.length > 0"
                      placement="top-start"
                      width="1000"
                      trigger="click">
            <el-table :data="scope.row.attachmentCarModelList" border>
              <el-table-column prop="attachmentName" label="版型名称"></el-table-column>
            </el-table>
            <a slot="reference" class="introduction" href="javascript:void(0)">查看详情</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改资源">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditResource(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除资源">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeResource(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="下载版型">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="download" icon="el-icons-jd-xiazaiziyuan" @click="downloadResource(scope.row)"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <show-carousel-images :visible.sync="carouselDialogVisible" :imgList="this.attachmentUrls"></show-carousel-images>

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
  import { removeCarModel } from '@/api/file'
  import { listAll } from '@/api/carType'
  import { list, save, update, remove, getById } from '@/api/skill'
  import UploadImages from '@/components/UploadImages'
  import BaseTable from '@/components/BaseTable'
  import { getToken } from '@/utils/auth'
  import { listAllSelection, listCarTypeByBrandCode } from '@/api/addOrder'
  export default {
    name: 'skill',
    extends: BaseTable,
    components: {
      BaseTable,
      UploadImages /* 上传附件 */
    },
    data() {
      return {
        baseFileServer: process.env.BASE_FILE_SERVER,
        token: window.sessionStorage.getItem('x-auth-token'),
        total: -1,
        pageNum: 1,
        pageSize: 10,
        carList: [],
        multipleSelection: [],
        loadingText: '拼命加载中',
        editLoading: false,
        addLoading: false,
        searchLoading: false,
        listLoading: false,
        deleteLoading: false, // 删除按钮的loading
        dialogVisible: false,
        editDialogVisible: false,
        brandCodes: [],
        carTypes: [],
        filterCarTypeOptions: [],
        carTypeOptions: [],
        carModelFileList: [],
        imgList: [],
        productTypeList: [],
        searchForm: {
          brandCode: null,
          carTypeCode: null,
          name: null
        },
        addForm: {
          attachmentFileId: null,
          attachmentIds: null,
          attachmentCarModelIds: null,
          brandCode: '',
          carTypeCode: '',
          name: '',
          cutAmount: 0,
          productTypeCode: null
        },
        editForm: {
          id: null,
          attachmentFileId: null,
          attachmentUuid: null,
          attachmentIds: null,
          attachmentCarModelIds: null,
          brandCode: '',
          carTypeCode: '',
          name: '',
          cutAmount: 0,
          productTypeCode: null
        },
        rules: {
          carTypeCode: [
            { required: true, message: '请输入车型名', trigger: 'blur' }
          ],
          brandCode: [
            { required: true, message: '请输入品牌名', trigger: 'blur' }
          ],
          productTypeCode: [
            { required: true, message: '请输入产品型号', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入资源名称', trigger: 'blur' }
          ],
          cutAmount: [
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      carList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      listAllSelection().then(resp => {
        this.brandCodes = resp.data.data.brandList
        this.productTypeList = resp.data.data.productTypeList
      })
      listAll().then(resp => {
        this.carTypeOptions = resp.data.data
        this.filterCarTypeOptions = resp.data.data
      })
      this.fetchData(null, null, null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 查询资源信息维护信息 */
      fetchData(brandCode, carTypeCode, carTypeName, name, pageNum, pageSize) {
        this.listLoading = true
        return list(
          brandCode,
          carTypeCode,
          carTypeName,
          name,
          pageNum,
          pageSize
        ).then(response => {
          this.carList = response.data.data.rows
          this.carList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
          return response
        }).catch(e => {
          this.listLoading = false
        })
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.brandCode, this.searchForm.carTypeCode, null, this.searchForm.name, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.brandCode, this.searchForm.carTypeCode, null, this.searchForm.name, this.pageNum, this.pageSize)
      },
      /* 获取所勾选资源信息 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.fetchData(this.searchForm.brandCode, this.searchForm.carTypeCode, null, this.searchForm.name, this.pageNum, this.pageSize)
      },
      /* 打开添加资源信息对话框 */
      uploadResources() {
        this.addForm.brandCode = ''
        this.addForm.carTypeCode = ''
        this.carTypes = []
        this.dialogVisible = true
      },
      /* 打开修改对话框 */
      editResources() {
        this.editForm.carTypeCode = ''
        this.carTypes = []
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        const car = this.multipleSelection[0]
        getById(car.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.brandCode = resp.data.data.brandCode
          this.editForm.carTypeCode = resp.data.data.carTypeCode
          this.editForm.productTypeCode = resp.data.data.productTypeCode
          listCarTypeByBrandCode(this.editForm.brandCode).then(res => {
            this.carTypes = res.data.data
          })
          this.editForm.cutAmount = resp.data.data.cutAmount
          this.editForm.name = resp.data.data.name
          this.editForm.attachmentIds = resp.data.data.attachmentIds
          this.editForm.attachmentFileId = resp.data.data.attachmentFileId
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.carModelFileList = resp.data.data.attachmentCarModelList
          this.carModelFileList = this.carModelFileList.map(t => {
            t.name = t.attachmentName
            return t
          })
          this.imgList = resp.data.data.attachmentList
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      goEditResource(id) {
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        getById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.brandCode = resp.data.data.brandCode
          this.editForm.carTypeCode = resp.data.data.carTypeCode
          this.editForm.productTypeCode = resp.data.data.productTypeCode
          listCarTypeByBrandCode(this.editForm.brandCode).then(res => {
            this.carTypes = res.data.data
          })
          this.editForm.cutAmount = resp.data.data.cutAmount
          this.editForm.name = resp.data.data.name
          this.editForm.attachmentIds = resp.data.data.attachmentIds
          this.editForm.attachmentFileId = resp.data.data.attachmentFileId
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.carModelFileList = resp.data.data.attachmentCarModelList
          this.carModelFileList = this.carModelFileList.map(t => {
            t.name = t.attachmentName
            return t
          })
          this.imgList = resp.data.data.attachmentList
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      /* 删除资源信息 */
      deleteResources() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
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
          this.listLoading = true
          this.deleteLoading = true
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(this.searchForm.brandCode, this.searchForm.carTypeCode, null, this.searchForm.name, this.pageNum, this.pageSize).then(resp => {
                  this.listLoading = false
                  this.deleteLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
            this.deleteLoading = false
          })
        })
      },
      removeResource(id) {
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          this.deleteLoading = true
          remove(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(this.searchForm.brandCode, this.searchForm.carTypeCode, null, this.searchForm.name, this.pageNum, this.pageSize).then(resp => {
                  this.listLoading = false
                  this.deleteLoading = false
                })
              }
            })
          }).catch(e => {
            this.listLoading = false
            this.deleteLoading = false
          })
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              this.addLoading = true
              this.loadingText = '正在提交'
              save(
                this.addForm.brandCode, // 品牌
                this.addForm.carTypeCode, // 车型名
                this.addForm.productTypeCode,
                this.addForm.name, // 资源名称
                this.addForm.cutAmount,
                this.addForm.attachmentFileId,
                this.addForm.attachmentIds,
                this.addForm.attachmentCarModelIds
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.brandCode, this.searchForm.carTypeCode, null, this.searchForm.name, this.pageNum, this.pageSize).then(resp => {
                      this.addLoading = false
                      this.loadingText = '拼命加载中'
                    })
                    this.$refs[formName].resetFields()
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
                this.editForm.brandCode, // 品牌
                this.editForm.carTypeCode, // 车型名
                this.editForm.productTypeCode,
                this.editForm.name, // 资源名称
                this.editForm.cutAmount,
                this.editForm.attachmentUuid,
                this.editForm.attachmentFileId,
                this.editForm.attachmentIds,
                this.editForm.attachmentCarModelIds
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.searchForm.brandCode, this.searchForm.carTypeCode, null, this.searchForm.name, this.pageNum, this.pageSize).then(resp => {
                      this.editLoading = false
                      this.loadingText = '拼命加载中'
                    })
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
      loadResources() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        const attachementCarModel = this.multipleSelection[0].attachmentCarModelList
        if (attachementCarModel.length === 0) {
          this.$message({
            type: 'warning',
            message: '没有资源文件可供下载！',
            duration: 1500
          })
          return
        }
        const fileList = []
        attachementCarModel.forEach(v => {
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
        document.getElementById('iframe').src = process.env.BASE_FILE_SERVER + ('/file/carModel/downloadZip?fileName=' + this.multipleSelection[0].name + '-版型' + urlParam + '&x=' + getToken())
      },
      downloadResource(row) {
        if (row.attachmentCarModelList.length === 0) {
          this.$message({
            type: 'warning',
            message: '没有资源文件可供下载！',
            duration: 1500
          })
          return
        }
        const fileList = []
        row.attachmentCarModelList.forEach(v => {
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
        document.getElementById('iframe').src = process.env.BASE_FILE_SERVER + ('/file/carModel/downloadZip?fileName=' + row.name + '-版型' + urlParam + '&x=' + getToken())
      },
      /* 下载图片文件 */
      loadImgResources() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        const attachement = this.multipleSelection[0].attachmentList
        if (attachement.length === 0) {
          this.$message({
            type: 'warning',
            message: '没有资源文件可供下载！',
            duration: 1500
          })
          return
        }
        const fileList = []
        attachement.forEach(v => {
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
        document.getElementById('iframe').src = process.env.BASE_API + ('/system/admin/file/downloadZip?fileName=' + this.multipleSelection[0].name + '-图片' + urlParam + '&x=' + getToken())
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
          this.carModelFileList = []
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
          done()
        }).catch((e) => {
          console.log(e)
          if (e !== 'cancel') {
            done()
          }
        })
      },
      filterBrand(value) {
        value = value.toLowerCase()
        this.filterCarTypeOptions = this.carTypeOptions.filter(brand =>
          brand.brandCode.toLowerCase().indexOf(value) >= 0 ||
          brand.brandName.indexOf(value) >= 0 ||
          brand.carTypeCode.toLowerCase().indexOf(value) >= 0 ||
          brand.carTypeName.indexOf(value) >= 0 ||
          (brand.brandCode.toLowerCase() + brand.carTypeCode.toLowerCase()).indexOf(value) >= 0 ||
          (brand.brandName.toLowerCase() + brand.carTypeName.toLowerCase()).indexOf(value) >= 0 ||
          (brand.brandCode.toLowerCase() + brand.carTypeName.toLowerCase()).indexOf(value) >= 0 ||
          (brand.brandName.toLowerCase() + brand.carTypeCode.toLowerCase()).indexOf(value) >= 0
        )
      },
      /* 添加品牌框改变时触发 */
      addChangeBrandCode() {
        // carTypes
        listCarTypeByBrandCode(this.addForm.brandCode).then(resp => {
          this.addForm.carTypeCode = ''
          this.carTypes = resp.data.data
        })
      },
      /**/
      editChangeBrandCode() {
        listCarTypeByBrandCode(this.editForm.brandCode).then(resp => {
          this.editForm.carTypeCode = ''
          this.carTypes = resp.data.data
        })
      },
      handleSuccess(response, file, fileList) {
        const imgIds = fileList.map(t => t.attachmentId || t.response.data).join(',')
        this.addForm.attachmentCarModelIds = imgIds
        this.editForm.attachmentCarModelIds = imgIds
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 20 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm('确定移除' + file.name + '？').then(() => {
          if (file.status === 'success') {
            removeCarModel(file.attachmentId || file.response.data).then(() => {
              return Promise.resolve()
            })
          } else {
            return Promise.resolve()
          }
        })
      },
      /* 添加图片 */
      fileListChange(imgList) {
        const imgIds = imgList.map(img => img.attachmentId).join(',')
        this.addForm.attachmentIds = imgIds
        this.editForm.attachmentIds = imgIds
      }
    }
  }
</script>
<style scoped>

</style>
