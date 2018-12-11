<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row>
        <el-form-item label="用车人" prop="borrowName">
          <el-input clearable v-model="searchForm.borrowName"></el-input>
        </el-form-item>
        <el-form-item label="车型" prop="carModel">
          <el-input clearable v-model="searchForm.carModel"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAddRecord"><i class="el-icons-jd-add"></i>&nbsp;添加用车记录</el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEditRecord"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改用车记录</el-button>
      <el-button class="el-button--danger hidden" code="remove" @click="deleteRecord" :loading="deleteLoding"><i class="el-icons-jd-shanchu"></i>&nbsp;删除用车记录</el-button>
    </div>
    <!--发布用车信息-->
    <el-dialog
      title="添加用车记录"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="120px" v-loading="addLoading" :element-loading-text="loadingText">
        <el-form-item label="车主信息" prop="carOwner">
          <el-input clearable v-model="addForm.carOwner"></el-input>
        </el-form-item>
        <el-form-item label="车主联系方式" prop="carOwnerMobile">
          <el-input clearable v-model="addForm.carOwnerMobile"></el-input>
        </el-form-item>
        <el-form-item label="费用（元）" prop="cost">
          <el-input clearable v-model="addForm.cost"></el-input>
        </el-form-item>
        <el-form-item label="车型信息" prop="carModel">
          <el-input clearable v-model="addForm.carModel"></el-input>
        </el-form-item>
        <el-form-item label="用途" prop="usage">
          <tinymce v-model="addForm.usage"></tinymce>
        </el-form-item>
        <el-form-item label="用车时间" prop="useTime"  style="width: 100%;">
          <el-date-picker
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="addForm.useTime"
            type="datetime"
            placeholder="选择用车时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="还车时间" prop="endTime"  style="width: 100%;">
          <el-date-picker
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="addForm.endTime"
            type="datetime"
            placeholder="选择还车时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报销图片" prop="attachmentIds">
          <upload-images :imgList="imgList" v-on:fileListChange="fileListChange"></upload-images>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改用车信息-->
    <el-dialog
      title="修改用车信息"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="120px" v-loading="editLoading" :element-loading-text="loadingText">
        <el-form-item label="车主信息" prop="carOwner">
          <el-input clearable v-model="editForm.carOwner"></el-input>
        </el-form-item>
        <el-form-item label="车主联系方式" prop="carOwnerMobile">
          <el-input clearable v-model="editForm.carOwnerMobile"></el-input>
        </el-form-item>
        <el-form-item label="费用（元）" prop="cost">
          <el-input clearable v-model="editForm.cost"></el-input>
        </el-form-item>
        <el-form-item label="车型信息" prop="carModel">
          <el-input clearable v-model="editForm.carModel"></el-input>
        </el-form-item>
        <el-form-item label="用途" prop="usage">
          <tinymce v-model="editForm.usage"></tinymce>
        </el-form-item>
        <el-form-item label="借车时间" prop="useTime">
          <el-date-picker
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="editForm.useTime"
            type="datetime"
            placeholder="选择借车时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="还车时间" prop="endTime">
          <el-date-picker
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="editForm.endTime"
            type="datetime"
            placeholder="选择还车时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报销图片" prop="attachmentIds">
          <upload-images :imgList="imgList" v-on:fileListChange="fileListChange" ></upload-images>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--完成对话框-->
    <el-dialog
      title="是否完成用车"
      :visible.sync="dialogFormVisible"
      width="40%"
      :before-close="handleClose">
      <el-form-item label-width="110px" label="满足用车需求？">
        <el-select v-model="value" placeholder="请选择" clearable filterable>
          <el-option
            v-for="item in satisfyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btn_box">
        <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
        <el-button @click="resetForm('editForm')">重置</el-button>
      </el-form-item>
    </el-dialog>
    <show-carousel-images  :visible.sync="carouselDialogVisible" :imgList="this.attachmentUrls"></show-carousel-images>

    <!--用车信息列表-->
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
      <el-table-column label="用车人">
        <template slot-scope="scope">
          {{scope.row.borrowName}}
        </template>
      </el-table-column>
      <el-table-column label="部门">
        <template slot-scope="scope">
          {{scope.row.borrowDepartmentName}}
        </template>
      </el-table-column>
      <el-table-column label="用途">
        <template slot-scope="scope">
          <el-popover v-if="!!scope.row.usage"
                      placement="top-start"
                      width="300"
                      trigger="hover">
            <div v-html="scope.row.usage"></div>
            <div slot="reference" class="introduction">查看用途</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="车主信息">
        <template slot-scope="scope">
          {{scope.row.carOwner}}
        </template>
      </el-table-column>
      <el-table-column label="车主联系方式">
        <template slot-scope="scope">
          {{scope.row.carOwnerMobile}}
        </template>
      </el-table-column>
      <el-table-column label="费用（元）">
        <template slot-scope="scope">
          {{scope.row.cost}}
        </template>
      </el-table-column>
      <el-table-column label="车型信息" >
        <template slot-scope="scope">
          {{scope.row.carModel}}
        </template>
      </el-table-column>
      <el-table-column label="借车时间">
        <template slot-scope="scope">
          {{scope.row.useTime}}
        </template>
      </el-table-column>
      <el-table-column label="还车时间">
        <template slot-scope="scope">
          {{scope.row.endTime}}
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <a style="text-decoration: underline;" href="javascript:void(0)"
             @click="showCarousel(scope.row.attachmentList)">查看图片</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" style="border:1px solid red;">
        <template slot-scope="scope" style="border:1px solid red;">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改用车记录">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除用车记录">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeLine(scope.row.id)"></el-button>
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
  import Tinymce from '@/components/Tinymce' /* 文本编辑器组件 */
  import { list, save, update, remove, getInfoById } from '@/api/useInfo'
  import UploadImages from '@/components/UploadImages'
  import ShowCarouselImages from '@/components/ShowCarouselImages'
  import { parseTime } from '@/utils/index'
  export default {
    name: 'carUseInfo',
    components: {
      Tinymce, /* 文本编辑器组件 */
      UploadImages,
      ShowCarouselImages
    },
    data() {
      return {
        loadingText: '拼命加载中',
        total: -1,
        pageNum: 1,
        pageSize: 10,
        useList: null,
        multipleSelection: [],
        createName: null,
        carModel: null,
        status: null,
        isAll: true,
        usage: null,
        editLoading: false,
        addLoading: false,
        searchLoading: false,
        deleteLoding: false,
        listLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        dialogFormVisible: false,
        carouselDialogVisible: false,
        attachmentUrls: [],
        imgList: [],
        id: null,
        satisfyOptions: [{
          label: '不满足',
          value: '0'
        }],
        searchForm: {
          borrowName: '',
          carModel: ''
        },
        addForm: {
          carOwner: '',
          carOwnerMobile: '',
          cost: null,
          carModel: '',
          usage: '',
          useTime: '',
          endTime: '',
          attachmentIds: ''
        },
        editForm: {
          id: '',
          carOwner: '',
          carOwnerMobile: '',
          cost: null,
          carModel: '',
          usage: '',
          useTime: '',
          endTime: '',
          attachmentUuid: '',
          attachmentIds: ''
        },
        rules: {
          carOwner: [
            { required: true, message: '请输入车主信息', trigger: 'blur' }
          ],
          carOwnerMobile: [
            { required: true, message: '请输入车主联系方式', trigger: 'blur' }
          ],
          cost: [
            { required: true, message: '请输入用车费用', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
          ],
          carModel: [
            { required: true, message: '请输入车型信息', trigger: 'blur' }
          ],
          usage: [
            { required: true, message: '请选择用途', trigger: 'blur' }
          ],
          useTime: [
            { required: true, message: '请选择用车时间', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '请选择还车时间', trigger: 'blur' }
          ]
        },
        value: '',
        carTypeName: ''
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
      this.fetchData(null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 用车信息列表 */
      fetchData(borrowName, carModel, pageNum, pageSize) {
        this.listLoading = true
        return list(
          borrowName,
          carModel,
          pageNum,
          pageSize
        ).then(response => {
          this.useList = response.data.data.rows
          this.useList.forEach((e, i) => { e['idx'] = i })
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
        this.fetchData(this.searchForm.borrowName, this.searchForm.carModel, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.borrowName, this.searchForm.carModel, this.pageNum, this.pageSize)
      },
      /* 获取所勾选需求 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.fetchData(this.searchForm.borrowName, this.searchForm.carModel, this.pageNum, this.pageSize)
      },
      /* 打开用车信息对话框 */
      goAddRecord() {
        this.dialogVisible = true
      },
      /* 打开用车信息对话框 */
      goEditRecord() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        const useCar = this.multipleSelection[0]
        getInfoById(useCar.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.carOwner = resp.data.data.carOwner
          this.editForm.carOwnerMobile = resp.data.data.carOwnerMobile
          this.editForm.cost = resp.data.data.cost
          this.editForm.carModel = resp.data.data.carModel
          this.editForm.usage = resp.data.data.usage
          this.editForm.useTime = resp.data.data.useTime
          this.editForm.endTime = resp.data.data.endTime
          this.imgList = resp.data.data.attachmentList
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      goEditLine(id) {
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        getInfoById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.carOwner = resp.data.data.carOwner
          this.editForm.carOwnerMobile = resp.data.data.carOwnerMobile
          this.editForm.cost = resp.data.data.cost
          this.editForm.carModel = resp.data.data.carModel
          this.editForm.usage = resp.data.data.usage
          this.editForm.useTime = resp.data.data.useTime
          this.editForm.endTime = resp.data.data.endTime
          this.editForm.attachmentUuid = resp.data.data.attachmentUuid
          this.imgList = resp.data.data.attachmentList
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      /* 删除需求 */
      deleteRecord() {
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
          this.deleteLoding = true
          this.listLoading = true
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(null, null, this.pageNum, this.pageSize).then(resp => {
                  this.deleteLoding = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.deleteLoding = false
            this.listLoading = false
          })
        })
      },
      removeLine(id) {
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
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
                this.fetchData(null, null, this.pageNum, this.pageSize).then(resp => {
                  this.deleteLoding = false
                  this.listLoading = false
                })
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
              if (this.addForm.endTime > this.addForm.useTime) {
                this.loadingText = '正在提交'
                this.addLoading = true
                save(
                  this.addForm.carOwner,
                  this.addForm.carOwnerMobile,
                  this.addForm.cost,
                  this.addForm.carModel,
                  this.addForm.usage,
                  parseTime(this.addForm.useTime),
                  parseTime(this.addForm.endTime),
                  this.addForm.attachmentIds
                ).then(() => {
                  this.$message({
                    type: 'success',
                    message: '添加成功!',
                    duration: 1000,
                    onClose: () => {
                      this.fetchData(this.searchForm.borrowName, this.searchForm.carModel, this.pageNum, this.pageSize).then(resp => {
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
              } else {
                this.$message({
                  type: 'warning',
                  message: '还车时间比用车时间早哦!'
                })
                return
              }
            } else if (formName === 'editForm') {
              if (this.editForm.endTime > this.editForm.useTime) {
                this.editLoading = true
                this.loadingText = '正在提交'
                update(
                  this.editForm.id,
                  this.editForm.carOwner,
                  this.editForm.carOwnerMobile,
                  this.editForm.cost,
                  this.editForm.carModel,
                  this.editForm.usage,
                  parseTime(this.editForm.useTime),
                  parseTime(this.editForm.endTime),
                  this.editForm.attachmentUuid,
                  this.editForm.attachmentIds
                ).then(() => {
                  this.$message({
                    type: 'success',
                    message: '修改成功!',
                    duration: 1000,
                    onClose: () => {
                      this.editDialogVisible = false
                      this.fetchData(this.searchForm.borrowName, this.searchForm.carModel, this.pageNum, this.pageSize).then(resp => {
                        this.editLoading = false
                        this.loadingText = '拼命加载中'
                      })
                    }
                  })
                }).catch(e => {
                  this.editLoading = false
                  this.loadingText = '拼命加载中'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: '还车时间比用车时间早哦!'
                })
                return
              }
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
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
