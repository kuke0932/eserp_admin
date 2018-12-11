<template>
  <div class="container">
    <el-form ref="searchForm" class="searchForm" :inline="true" :model="searchForm">
      <el-row :gutter="20">
        <el-form-item label="上市时间" prop="marketTime">
          <el-date-picker
            v-model="searchForm.marketTime"
            type="month"
            :editable="false"
            placeholder="选择上市时间"
            :picker-options="pickerOptions"
            value-format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="品牌" prop="newCarBrand">
          <el-input clearable v-model="searchForm.newCarBrand"></el-input>
        </el-form-item>
        <el-form-item label="车型名称" prop="newCarName">
          <el-input clearable v-model="searchForm.newCarName"></el-input>
        </el-form-item>
        <el-form-item label="导入类型" prop="newCarSource">
          <el-select :clearable="true" v-model="searchForm.newCarSource" placeholder="请选择" filterable>
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>

      <div class="btn_box">
        <el-button class="el-button--primary hidden" code="add" @click="goAddCar"><i class="el-icons-jd-add"></i>&nbsp;添加车型</el-button>
        <el-button class="el-button--primary hidden" code="edit" :disabled="editDisabled" @click="goEditCar"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改车型</el-button>
        <el-button class="el-button--danger hidden" code="remove" :disabled="editDisabled" @click="deleteCar" :loading="deleteLoding"><i class="el-icons-jd-shanchu"></i>&nbsp;删除车型</el-button>
        <el-button class="el-button--danger hidden" code="view" :disabled="editDisabled" @click="totalCar" :loading="displayLoding"><i class="el-icons-jd-xianshiquanbu"></i>&nbsp;显示全部</el-button>
      </div>
      <!--添加车型对话框-->
      <el-dialog
        title="添加车型 "
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
        <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" v-loading="addLoading" :element-loading-text="loadingText">
          <el-form-item label="品牌" prop="newCarBrand" >
            <el-input clearable v-model="addForm.newCarBrand"></el-input>
          </el-form-item>
          <el-form-item label="车型名称" prop="newCarName">
            <el-input clearable v-model="addForm.newCarName"></el-input>
          </el-form-item>
          <el-form-item label="上市时间" prop="marketTime"  style="width: 100%;">
            <el-date-picker
              style="width: 100%;"
              value-format="yyyy-MM"
              v-model="addForm.marketTime"
              type="month"
              placeholder="选择上市时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="btn_box">
            <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--修改车型对话框-->
      <el-dialog
        title="修改车型"
        :visible.sync="editDialogVisible"
        width="40%"
        :before-close="handleClose">
        <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px" v-loading="editLoading" :element-loading-text="loadingText">
          <el-form-item label="品牌" prop="newCarBrand">
            <el-input clearable v-model="editForm.newCarBrand"></el-input>
          </el-form-item>
          <el-form-item label="车型名称" prop="newCarName">
            <el-input clearable v-model="editForm.newCarName"></el-input>
          </el-form-item>
          <el-form-item label="上市时间" prop="marketTime">
            <el-date-picker
              style="width: 100%;"
              value-format="yyyy-MM"
              v-model="editForm.marketTime"
              type="month"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="btn_box">
            <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
            <el-button @click="resetForm('editForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--新车车型列表-->
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
        <el-table-column label="上市时间">
          <template slot-scope="scope">
            {{scope.row.marketTime}}
          </template>
        </el-table-column>
        <el-table-column label="品牌">
          <template slot-scope="scope">
            {{scope.row.newCarBrand}}
          </template>
        </el-table-column>
        <el-table-column label="车型名称">
          <template slot-scope="scope">
            {{scope.row.newCarName}}
          </template>
        </el-table-column>
        <el-table-column label="链接">
          <template slot-scope="scope">
            {{scope.row.newCarLink}}
          </template>
        </el-table-column>
        <el-table-column label="类型" >
          <template slot-scope="scope">
            {{scope.row.newCarSource}}
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
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="100"
              trigger="hover"
              content="修改车型">
              <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditType(scope.row.id)"></el-button>
            </el-popover>
            <el-popover
              placement="top-start"
              width="100"
              trigger="hover"
              content="删除车型">
              <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="goDeleteCar(scope.row.id)"></el-button>
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
  import { list, save, update, remove, getInfoById } from '@/api/car'
  import BaseTable from '@/components/BaseTable'
  export default {
    name: 'newCar',
    extends: BaseTable,
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        carList: null,
        multipleSelection: [],
        marketTime: null,
        newCarBrand: null,
        newCarName: null,
        newCarSource: null,
        searchForm: {
          marketTime: null,
          newCarBrand: null,
          newCarName: null,
          newCarSource: null
        },
        loadingText: '拼命加载中',
        addLoading: false,
        deleteLoding: false,
        editLoading: false,
        displayLoding: false,
        listLoading: false,
        searchLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        viewUserDialogVisible: false,
        viewMenuDialogVisible: false,
        editDisabled: false,
        id: null,
        ids: null,
        addForm: {
          marketTime: '',
          newCarBrand: '',
          newCarName: ''
        },
        editForm: {
          id: '',
          marketTime: '',
          newCarBrand: '',
          newCarName: ''
        },
        rules: {
          marketTime: [
            { required: true, message: '请输入上市时间', trigger: 'blur' }
          ],
          newCarBrand: [
            { required: true, message: '请输入新车品牌', trigger: 'blur' }
          ],
          newCarName: [
            { required: true, message: '请选择新车名称', trigger: 'blur' }
          ]
        },
        options: [{}],
        value: '',
        carTypeName: '',
        options2: [{
          value: '抓取'
        },
        {
          value: '录入'
        }]
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
      this.fetchData(null, null, null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 查询新车信息列表 */
      fetchData(marketTime, newCarBrand, newCarName, newCarSource, pageNum, pageSize) {
        this.listLoading = true
        return list(
          marketTime,
          newCarBrand,
          newCarName,
          newCarSource,
          pageNum,
          pageSize
        ).then(response => {
          this.carList = response.data.data.rows
          this.carList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          if (response.data.data.pages === 0) {
            this.pages = 1
          } else {
            this.pages = response.data.data.pages
          }
          this.listLoading = false
          this.displayLoding = false
          return response
        }).catch(e => {
          this.listLoading = false
          this.displayLoding = false
        })
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.marketTime, this.newCarBrand, this.newCarName, this.changeSource(this.newCarSource), this.pageNum, this.pageSize)
      },
      /* 转换抓取类型 */
      changeSource(value) {
        if (value === '') {
          value = null
        }
        if (value === '抓取') {
          value = '1'
        }
        if (value === '录入') {
          value = '0'
        }
        return value
      },

      /* 显示全部 */
      totalCar() {
        this.displayLoding = true
        this.searchForm.marketTime = ''
        this.searchForm.newCarBrand = ''
        this.searchForm.newCarName = ''
        this.searchForm.newCarSource = ''
        this.marketTime = ''
        this.newCarBrand = ''
        this.newCarName = ''
        this.newCarSource = ''
        this.fetchData(this.marketTime, this.newCarBrand, this.newCarName, this.changeSource(this.newCarSource), this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.marketTime, this.newCarBrand, this.newCarName, this.changeSource(this.newCarSource), this.pageNum, this.pageSize)
      },
      /* 获取所勾选车型 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 查询 */
      search() {
        this.marketTime = this.searchForm.marketTime
        this.newCarBrand = this.searchForm.newCarBrand
        this.newCarName = this.searchForm.newCarName
        this.newCarSource = this.searchForm.newCarSource
        if (this.pageNum !== 1) {
          this.pageNum = 1
        } else {
          this.fetchData(this.marketTime, this.newCarBrand, this.newCarName, this.changeSource(this.newCarSource), this.pageNum, this.pageSize)
        }
      },
      /* 打开添加车型对话框 */
      goAddCar() {
        this.dialogVisible = true
      },
      /* 打开修改车型对话框 */
      goEditCar() {
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
        getInfoById(car.id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.newCarBrand = resp.data.data.newCarBrand
          this.editForm.newCarName = resp.data.data.newCarName
          this.editForm.marketTime = resp.data.data.marketTime
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      /* 点击右侧操作修改小按钮 */
      goEditType(id) {
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
        this.editDialogVisible = true // visible属性，它接收Boolean，当为true时显示 Dialog。
        this.editLoading = true
        getInfoById(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.newCarBrand = resp.data.data.newCarBrand
          this.editForm.newCarName = resp.data.data.newCarName
          this.editForm.marketTime = resp.data.data.marketTime
          this.editLoading = false
        }).catch(e => {
          this.editLoading = false
        })
      },
      /* 删除车型 */
      deleteCar() {
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
                this.fetchData(null, null, null, null, this.pageNum, this.pageSize).then(resp => {
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
      /* 点击右侧操作删除小按钮 */
      goDeleteCar(ids) {
        this.ids = ids
        this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteLoding = true
          this.listLoading = true
          remove(this.ids).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(null, null, null, null, this.pageNum, this.pageSize).then(resp => {
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
              /* const id = this.carList.length !== 0 ? this.carList[this.carList.length - 1].id + 1 : 1 */
              this.addLoading = true
              this.loadingText = '正在提交'
              save(
                1,
                this.addForm.newCarBrand, // 品牌
                this.addForm.newCarName, // 车型名称
                this.addForm.marketTime, // 上市时间
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1000,
                  onClose: () => {
                    this.fetchData(this.marketTime, this.newCarBrand, this.newCarName, this.changeSource(this.newCarSource), this.pageNum, this.pageSize).then(resp => {
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
                this.editForm.newCarBrand,
                this.editForm.newCarName,
                this.editForm.marketTime
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1000,
                  onClose: () => {
                    this.editDialogVisible = false
                    this.fetchData(this.marketTime, this.newCarBrand, this.newCarName, this.changeSource(this.newCarSource), this.pageNum, this.pageSize).then(resp => {
                      this.editLoading = false
                      this.loadingText = '拼命加载中'
                    })
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
      /* 打开查看用户 */
      viewUser(id) {
        this.id = Number.parseInt(id)
        this.viewUserDialogVisible = true
      },
      /* 打开查看菜单 */
      viewMenu(id) {
        this.id = Number.parseInt(id)
        this.viewMenuDialogVisible = true
      },
      closeViewMenu() {
        this.viewMenuDialogVisible = false
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
      }
    }
  }
</script>
<style scoped>

</style>
