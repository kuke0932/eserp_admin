<template>
  <div class="container">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="物流公司名称">
          <el-input clearable v-model="searchForm[0].corporateName"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchExpress" :loading="searchLoading">查询</el-button>
        <el-button type="primary"  @click="resetSearchForm">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary" code="add" @click="addCompany"><i
        class="el-icons-jd-tianjia"></i>&nbsp;添加物流公司
      </el-button>
      <el-button class="el-button--primary" code="edit" @click="editCompany"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改物流公司
      </el-button>
      <el-button class="el-button--danger" code="remove" @click="removeCompany" :loading="removeLoading"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除物流公司
      </el-button>
    </div>
    <el-dialog
      title="添加物流公司"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form ref="addForm" :model="addForm" label-width="120px" v-loading="addListLoading" :element-loading-text="loadingText" :rules="rules">
        <el-form-item label="物流公司名称" prop="name">
          <el-input clearable v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="物流公司编码" prop="code">
          <el-input clearable v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="是否包邮" prop="isPostageIncluded">
          <el-select v-model="addForm.isPostageIncluded === 0 ? '否' : '是'" clearable placeholder="请选择" @change="selectChange" filterable>
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="不包邮地区" prop="postageExcludedArea">
          <el-input clearable v-model="addForm.postageExcludedArea"></el-input>
        </el-form-item>
        <el-form-item label="不发货地区" prop="sendExcludedArea">
          <el-input clearable v-model="addForm.sendExcludedArea"></el-input>
        </el-form-item>
        <el-form-item label="补差价" prop="price">
          <el-input clearable v-model="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input clearable v-model="addForm.contacts"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="telephone">
          <el-input clearable v-model="addForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="申请账号" prop="customerName">
          <el-input clearable v-model="addForm.customerName"></el-input>
        </el-form-item>
        <el-form-item label="申请密码" prop="customerPwd">
          <el-input clearable v-model="addForm.customerPwd"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="修改物流公司"
      :visible.sync="editLogisticsCompany"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" label-width="140px" v-loading="editListLoading" :element-loading-text="loadingText" :rules="rules">
        <el-form-item label="物流公司名称" prop="name">
          <el-input clearable v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="物流公司编码" prop="code">
          <el-input clearable v-model="editForm.code"></el-input>
        </el-form-item>
        <el-form-item label="是否包邮" prop="isPostageIncluded">
          <el-select v-model="editForm.isPostageIncluded === 0 ? '否' : '是'" clearable placeholder="请选择" @change="optionChange" filterable>
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="不包邮地区" prop="postageExcludedArea">
          <el-input clearable v-model="editForm.postageExcludedArea"></el-input>
        </el-form-item>
        <el-form-item label="不发货地区" prop="sendExcludedArea">
          <el-input clearable v-model="editForm.sendExcludedArea"></el-input>
        </el-form-item>
        <el-form-item label="补差价" prop="price">
          <el-input clearable v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input clearable v-model="editForm.contacts"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="telephone">
          <el-input clearable v-model="editForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="申请账号" prop="customerName">
          <el-input clearable v-model="editForm.customerName"></el-input>
        </el-form-item>
        <el-form-item label="申请密码" prop="customerPwd">
          <el-input clearable v-model="editForm.customerPwd"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-table
      :data="companyList"
      v-loading="listLoading"
      :element-loading-text="loadingText"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="物流公司名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="物流公司编码">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="是否包邮">
        <template slot-scope="scope">
          {{ scope.row.isPostageIncluded == 0 ? '否' : '是'}}
        </template>
      </el-table-column>
      <el-table-column label="不包邮区域">
        <template slot-scope="scope">
          {{ scope.row.postageExcludedArea }}
        </template>
      </el-table-column>
      <el-table-column label="不发货区域">
        <template slot-scope="scope">
          {{ scope.row.sendExcludedArea }}
        </template>
      </el-table-column>
      <el-table-column label="补差价">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="联系人">
        <template slot-scope="scope">
          {{ scope.row.contacts }}
        </template>
      </el-table-column>
      <el-table-column label="联系电话">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column label="申请账号">
        <template slot-scope="scope">
          {{ scope.row.customerName }}
        </template>
      </el-table-column>
      <!--<el-table-column label="申请密码">-->
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.customerPwd }}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改物流公司">
            <el-button class="icon-btn" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="editInLogistics(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除物流公司">
            <el-button class="icon-btn" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="goDeleteInLogistics(scope.row.id)"></el-button>
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
    import { list, remove, getById, update, save } from '@/api/expressCompany'
    // import BaseTable from '@/components/BaseTable'
    import { setDepartmentId } from '@/utils/departmentManage'
    import { getSelections } from '@/api/department'
    export default {
      name: '物流管理',
      // extends: BaseTable,
      data() {
        return {
          loadingText: '努力加载中',
          searchLoading: false,
          listLoading: false,
          addListLoading: false,
          addDialogVisible: false,
          removeLoading: false,
          editListLoading: false,
          editLogisticsCompany: false,
          companyList: [],
          multipleSelection: [],
          ids: '',
          searchForm: [{
            corporateName: ''
          }],
          editForm: {
            id: '',
            name: '',
            code: '',
            isPostageIncluded: '',
            postageExcludedArea: '',
            sendExcludedArea: '',
            price: '',
            contacts: '',
            telephone: '',
            customerName: '',
            customerPwd: ''
          },
          addForm: {
            id: '',
            name: '',
            code: '',
            isPostageIncluded: '',
            postageExcludedArea: '',
            sendExcludedArea: '',
            price: '',
            contacts: '',
            telephone: '',
            customerName: '',
            customerPwd: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入物流公司名称', trigger: 'blur' }
            ],
            code: [
              { required: true, message: '请输入物流公司编码', trigger: 'blur' }
            ],
            isPostageIncluded: [
              { required: true, message: '请输入是否包邮', trigger: 'blur' }
            ],
            postageExcludedArea: [
              { required: true, message: '请输入不包邮地区', trigger: 'blur' }
            ],
            sendExcludedArea: [
              { required: true, message: '请输入不发货地区', trigger: 'blur' }
            ],
            price: [
              { required: true, message: '请输入补差价', trigger: 'blur' }
            ],
            contacts: [
              { required: true, message: '请输入联系人姓名', trigger: 'blur' },
              { pattern: /^[\u4e00-\u9fa5]{2,4}$/i, message: '请输入正确的联系人姓名', trigger: 'blur' }
            ],
            telephone: [
              { required: true, message: '请输入联系人手机号', trigger: 'blur' },
              { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
            ],
            customerName: [
              { required: false, trigger: 'blur' }
            ],
            customerPwd: [
              { required: false, trigger: 'blur' }
            ]
          },
          total: -1,
          pageNum: 1,
          pageSize: 10,
          pages: 1,
          option: [{
            value: '1',
            label: '是'
          }, {
            value: '0',
            label: '否'
          }]
        }
      },
      mounted() {
        authMenuButton(location.hash.substring(2))
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
            this.fetchData(this.searchForm[0].corporateName, null, this.pageNum, this.pageSize)
          })
        },
        /* table表格当前页事件 */
        handleCurrentPageChange(currentPage) {
          this.pageNum = currentPage
          this.fetchData(this.searchForm[0].corporateName, null, this.pageNum, this.pageSize)
        },
        handleSizeChange(pageSize) {
          this.pageNum = 1
          this.pageSize = pageSize
          this.fetchData(null, null, this.pageNum, this.pageSize)
        },
        /* 查询货架列表 */
        fetchData(name, departmentId, pageNum, pageSize) {
          this.listLoading = true
          setDepartmentId(departmentId)
          return list(
            name,
            pageNum,
            pageSize
          ).then(response => {
            this.companyList = response.data.data.rows
            this.companyList.forEach((e, i) => { e['idx'] = i })
            this.total = response.data.data.total
            this.pageNum = response.data.data.pageNum
            this.pageSize = response.data.data.pageSize
            if (response.data.data.pages === 0) {
              this.pages = 1
            } else {
              this.pages = response.data.data.pages
            }
            this.listLoading = false
            return response
          }).catch(e => {
            this.listLoading = false
          })
        },
        searchExpress() {
          this.fetchData(this.searchForm[0].corporateName, null, this.pageNum, this.pageSize)
        },
        resetSearchForm() {
          this.searchForm[0].corporateName = ''
        },
        selectChange(e) {
          this.addForm.isPostageIncluded = parseInt(e)
        },
        optionChange(e) {
          this.editForm.isPostageIncluded = parseInt(e)
        },
        handleSelectionChange(val) {
          this.multipleSelection = val
        },
        addCompany() {
          this.addForm.isPostageIncluded = 1
          this.addDialogVisible = true
        },
        editCompany() {
          if (this.multipleSelection.length !== 1) {
            this.$message({
              type: 'warning',
              message: '请选中一行再执行此操作!'
            })
            return
          }
          this.editLogisticsCompany = true
          this.editListLoading = true
          const pecification = this.multipleSelection[0]
          getById(pecification.id).then(resp => {
            console.log(resp.data.data)
            this.editForm.id = resp.data.data.id
            this.editForm.name = resp.data.data.name
            this.editForm.code = resp.data.data.code
            this.editForm.postageExcludedArea = resp.data.data.postageExcludedArea
            this.editForm.sendExcludedArea = resp.data.data.sendExcludedArea
            this.editForm.price = resp.data.data.price
            this.editForm.contacts = resp.data.data.contacts
            this.editForm.telephone = resp.data.data.telephone
            this.editForm.isPostageIncluded = resp.data.data.isPostageIncluded
            this.editForm.customerName = resp.data.data.customerName
            this.editForm.customerPwd = resp.data.data.customerPwd
            this.editListLoading = false
          }).catch(e => {
            this.editListLoading = false
          })
        },
        removeCompany() {
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
            this.removeLoading = true
            remove(ids.join(',')).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000,
                onClose: () => {
                  this.fetchData(this.searchForm[0].corporateName, null, this.pageNum, this.pageSize).then(resp => {
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
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let jsonData
              if (formName === 'addForm') {
                jsonData = {
                  'code': this.addForm.code,
                  'contacts': this.addForm.contacts,
                  'id': 0,
                  'isPostageIncluded': this.addForm.isPostageIncluded,
                  'name': this.addForm.name,
                  'postageExcludedArea': this.addForm.postageExcludedArea,
                  'price': this.addForm.price,
                  'sendExcludedArea': this.addForm.sendExcludedArea,
                  'telephone': this.addForm.telephone,
                  'customerName': this.addForm.customerName,
                  'customerPwd': this.addForm.customerPwd
                }
                this.listLoading = true
                this.addListLoading = true
                this.loadingText = '正在提交'
                save(jsonData).then(() => {
                  this.$message({
                    type: 'success',
                    message: '添加成功!',
                    duration: 1000,
                    onClose: () => {
                      this.pageNum = 1
                      this.fetchData(this.searchForm[0].corporateName, null, this.pageNum, this.pageSize).then(resp => {
                        this.loadingText = '努力加载中'
                        this.addDialogVisible = false
                        this.listLoading = false
                      })
                      this.addListLoading = false
                      this.$refs[formName].resetFields()
                    }
                  })
                }).catch(e => {
                  this.loadingText = '努力加载中'
                  this.addListLoading = false
                  this.listLoading = false
                })
              } else if (formName === 'editForm') {
                jsonData = {
                  'code': this.editForm.code,
                  'contacts': this.editForm.contacts,
                  'id': this.editForm.id,
                  'isPostageIncluded': this.editForm.isPostageIncluded,
                  'name': this.editForm.name,
                  'postageExcludedArea': this.editForm.postageExcludedArea,
                  'price': this.editForm.price,
                  'sendExcludedArea': this.editForm.sendExcludedArea,
                  'telephone': this.editForm.telephone,
                  'customerName': this.editForm.customerName,
                  'customerPwd': this.editForm.customerPwd
                }
                this.listLoading = true
                this.editListLoading = true
                this.loadingText = '正在提交'
                update(jsonData).then(() => {
                  this.$message({
                    type: 'success',
                    message: '修改成功!',
                    duration: 1000,
                    onClose: () => {
                      this.pageNum = 1
                      this.fetchData(this.searchForm[0].corporateName, null, this.pageNum, this.pageSize).then(resp => {
                        this.editListLoading = false
                        this.listLoading = false
                        this.editLogisticsCompany = false
                        this.loadingText = '努力加载中'
                      })
                      this.$refs[formName].resetFields()
                    }
                  })
                }).catch(e => {
                  this.editListLoading = false
                  this.listLoading = false
                  this.editLogisticsCompany = false
                  this.loadingText = '努力加载中'
                })
              }
            }
          })
        },
        /* 点击右侧操作修改按钮 */
        editInLogistics(id) {
          if (id === null || id === undefined) {
            id = this.multipleSelection[0].id
          }
          this.editLogisticsCompany = true // visible属性，它接收Boolean，当为true时显示 Dialog。
          this.editListLoading = true
          getById(id).then(resp => {
            this.editForm.id = resp.data.data.id
            this.editForm.name = resp.data.data.name
            this.editForm.code = resp.data.data.code
            this.editForm.isPostageIncluded = resp.data.data.isPostageIncluded
            this.editForm.postageExcludedArea = resp.data.data.postageExcludedArea
            this.editForm.sendExcludedArea = resp.data.data.sendExcludedArea
            this.editForm.price = resp.data.data.price
            this.editForm.contacts = resp.data.data.contacts
            this.editForm.telephone = resp.data.data.telephone
            this.editForm.customerName = resp.data.data.customerName
            this.editForm.customerPwd = resp.data.data.customerPwd
            this.editListLoading = false
          }).catch(e => {
            this.editListLoading = false
            this.editLogisticsCompany = false
          })
        },
        /* 点击右侧操作删除按钮 */
        goDeleteInLogistics(ids) {
          this.ids = ids
          this.$confirm('此操作将永久删除该信息，是否继续', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.listLoading = true
            this.removeLoading = true
            remove(this.ids).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000,
                onClose: () => {
                  this.fetchData(this.searchForm[0].corporateName, null, this.pageNum, this.pageSize).then(resp => {
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
        /* 手动关闭对话框 */
        handleClose(done) {
          if (this.addListLoading === true || this.editListLoading === true) {
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
