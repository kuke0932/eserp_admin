<template>
  <div class="container">
    <el-form ref="searchForm" :model="searchForm" class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="供应商名称" prop="supplierName" label-width="82px">
          <el-input clearable v-model="searchForm.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts" label-width="56px">
          <el-input clearable v-model="searchForm.contacts"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>
    <el-button type="primary" @click="gotoSave" :loading="conserveLoading">保存</el-button>
    <el-table
      :data="supplierList"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="供应商名称" width="180">
        <template slot-scope="scope">
          {{scope.row.supplierName}}
        </template>
      </el-table-column>
      <el-table-column label="网址" width="180">
        <template slot-scope="scope">
          {{scope.row.website}}
        </template>
      </el-table-column>
      <el-table-column label="主营业务" width="180">
        <template slot-scope="scope">
          {{scope.row.business}}
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="180">
        <template slot-scope="scope">
          {{scope.row.contacts}}
        </template>
      </el-table-column>
      <el-table-column label="通讯地址" width="180">
        <template slot-scope="scope">
          {{scope.row.contactAddress}}
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="180">
        <template slot-scope="scope">
          {{scope.row.contactWay}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          {{scope.row.email}}
        </template>
      </el-table-column>
      <el-table-column label="启用/禁用" width="90">
        <template slot-scope="scope">
          {{scope.row.enableStatus == 0 ? "禁用":"启用" }}
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
  import { list } from '@/api/supplier'
  import { listByParentId } from '@/api/area'
  import { authMenuButton } from '@/utils/authMenuButton'

  export default {
    name: '',
    props: {
      addForm: {
        type: Object,
        required: true
      },
      editForm: {
        type: Object,
        required: false
      },
      addOrUpdate: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        options: [{
          value: '1',
          label: '启用'
        }, {
          value: '0',
          label: '禁用'
        }],
        lag: false,
        pValue: '',
        cValue: '',
        dValue: '',
        listLoading: false,
        searchLoading: false,
        conserveLoading: false,
        supplierList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        province: [],
        city: [],
        district: [],
        list: null,
        dialogVisible: false,
        editDialogVisible: false,
        multipleSelection: [],
        enableStatus: null,
        searchForm: {
          supplierName: '',
          contacts: '',
          enableStatus: ''
        },
        rules: {
          supplierName: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' }
          ],
          province: [
            { required: true, message: '请选择省', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请选择市', trigger: 'change' }
          ],
          county: [
            { required: true, message: '请选择区或县', trigger: 'change' }
          ],
          street: [
            { required: true, message: '请输入街道', trigger: 'blur' }
          ],
          website: [
            { required: true, message: '请输入公司网址', trigger: 'blur' },
            { pattern: /[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/, message: '请输入正确的网址格式' }
          ],
          business: [
            { required: true, message: '请输入主营业务', trigger: 'blur' }
          ],
          contacts: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          contactAddress: [
            { required: true, message: '请输入通讯地址', trigger: 'blur' }
          ],
          contactWay: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入正确的邮箱格式' }
          ]
        }
      }
    },
    watch: {
      supplierList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    mounted() {
      this.province = []
      const parentId = 1
      listByParentId(
        parentId,
        this.pageNum,
        1000
      ).then(response => {
        for (let i = 0; i < response.data.data.rows.length; i++) {
          this.province.push({ id: response.data.data.rows[i].id, areaName: response.data.data.rows[i].areaName, parentId: response.data.data.rows[i].parentId })
        }
      })
      this.fetchData(null, null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 初始化单位列表 */
      fetchData(supplierName, contacts, enableStatus, pageNum, pageSize) {
        this.listLoading = true
        return list(
          supplierName,
          contacts,
          enableStatus,
          pageNum,
          pageSize
        ).then(response => {
          this.supplierList = response.data.data.rows
          this.supplierList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
          return response
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        this.fetchData(this.searchForm.supplierName, this.searchForm.contacts, this.searchForm.enableStatus, this.pageNum, this.pageSize).then(resp => {
          this.searchLoading = false
        })
      },
      /* 选择省的时候 */
      changeProvince(id) {
        const parentId = id
        return listByParentId(
          parentId,
          this.pageNum,
          1000
        ).then(response => {
          this.city = []
          this.district = []
          this.addForm.city = ''
          this.addForm.county = ''
          this.editForm.city = ''
          this.editForm.county = ''
          for (let i = 0; i < response.data.data.rows.length; i++) {
            this.city.push({ id: response.data.data.rows[i].id, areaName: response.data.data.rows[i].areaName, parentId: response.data.data.rows[i].parentId })
          }
          return response
        })
      },
      /* 选择市的时候 */
      changeCity(id) {
        const parentId = id
        return listByParentId(
          parentId,
          this.pageNum,
          1000
        ).then(response => {
          this.district = []
          this.addForm.county = ''
          this.editForm.county = ''

          for (let i = 0; i < response.data.data.rows.length; i++) {
            this.district.push({ id: response.data.data.rows[i].id, areaName: response.data.data.rows[i].areaName, parentId: response.data.data.rows[i].parentId })
          }
          return response
        })
      },
      /* 收件人县点击事件 */
      countyChange(data) {
        const selectArea = this.forEachArea(this.district, data)
        this.editForm.county = selectArea.id
      },
      /* 遍历区域 */
      forEachArea(area, data) {
        let selectArea = {}
        area.forEach(v => {
          if (v.id === data) {
            selectArea = v
          }
        })
        return selectArea
      },
      /* 打开添加供应商对话框 */
      saveSupplier() {
        this.dialogVisible = true
      },
      /* 点击保存按钮执行的操作 */
      gotoSave() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        this.listLoading = true
        this.conserveLoading = true
        if (this.addOrUpdate) {
          this.addForm.supplierName = this.multipleSelection[0].supplierName
          this.addForm.supplierId = this.multipleSelection[0].id
          this.listLoading = false
          this.conserveLoading = false
        } else {
          this.editForm.supplierName = this.multipleSelection[0].supplierName
          this.editForm.supplierId = this.multipleSelection[0].id
          this.listLoading = false
          this.conserveLoading = false
        }
        this.$emit('closeSupplier')
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.addForm.province = ''
          this.addForm.city = ''
          this.addForm.county = ''
          this.addForm.street = ''
          this.editForm.province = ''
          this.editForm.city = ''
          this.editForm.county = ''
          this.editForm.street = ''
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
        }).catch(() => {

        })
      },
      handleSizeChange(pageSize) {
        this.pageNum = 1
        this.pageSize = pageSize
        this.fetchData(this.searchForm.unitCode, this.searchForm.unitName, this.searchForm.status, this.pageNum, this.pageSize)
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchForm.unitCode, this.searchForm.unitName, this.searchForm.status, this.pageNum, this.pageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    }
  }
</script>

<style scoped>
</style>
