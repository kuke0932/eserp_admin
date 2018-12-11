<template>
  <div class="container">
    <el-form class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="工序名称">
          <el-input clearable v-model="searchForm[0].name"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" :loading="searchLoading">查询</el-button>
        <el-button type="primary" @click="resetSearchForm" :loading="searchLoading">重置</el-button>
      </el-row>
    </el-form>
    <div class="btn_box">
      <el-button class="el-button--primary hidden" code="add" @click="goAdd"><i
        class="el-icons-jd-tianjia3"></i>&nbsp;添加工序
      </el-button>
      <el-button class="el-button--primary hidden" code="edit" @click="goEdit"><i
        class="el-icons-jd-xiugai1"></i>&nbsp;修改工序
      </el-button>
      <el-button class="el-button--danger hidden" :loading="removeLoading" code="remove" @click="localRemove"><i
        class="el-icons-jd-shanchu"></i>&nbsp;删除工序
      </el-button>
      <el-button class="el-button--primary hidden" :loading="enableLoading" code="able" @click="enable"><i
        class="el-icons-jd-qiyong"></i>&nbsp;启用
      </el-button>
      <el-button class="el-button--danger hidden" :loading="disableLoading" code="disable" @click="disable"><i
        class="el-icons-jd-jinyong"></i>&nbsp;禁用
      </el-button>
    </div>
    <!--添加工序-->
    <el-dialog
      title="添加工序 "
      :visible.sync="addDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="addForm"
               :rules="rules"
               :model="addForm"
               label-width="140px"
               v-loading="addFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="工序名称" prop="name">
          <el-input clearable v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="工序编码" prop="code">
          <el-input clearable v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="工序内容" prop="content">
          <tinymce v-model="addForm.content"></tinymce>
        </el-form-item>
        <el-form-item label="操作时长（分钟）" prop="duration">
          <el-input clearable v-model="addForm.duration"></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="processSort">
          <el-input clearable v-model="addForm.processSort"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改产品型号-->
    <el-dialog
      title="修改工序"
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="editForm"
               :rules="rules"
               :model="editForm"
               label-width="140px"
               v-loading="editFormLoading"
               :element-loading-text="loadingText">
        <el-form-item label="工序名称" prop="name">
          <el-input clearable v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="工序编码" prop="code">
          <el-input clearable v-model="editForm.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="工序内容" prop="content">
          <tinymce v-model="editForm.content"></tinymce>
        </el-form-item>
        <el-form-item label="操作时长（分钟）" prop="duration">
          <el-input clearable v-model="editForm.duration"></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="processSort">
          <el-input clearable v-model="editForm.processSort"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--用车信息列表-->
    <el-table
      :data="dataList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="工序名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="工序内容">
        <template slot-scope="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column label="工序操作时长（分钟）">
        <template slot-scope="scope">
          {{scope.row.duration}}
        </template>
      </el-table-column>
      <el-table-column label="顺序">
        <template slot-scope="scope">
          {{scope.row.processSort}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.enableStatus == 0 ? '禁用' : '启用'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改工序">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditLine(scope.row.id)"></el-button>
          </el-popover>
          <el-popover v-if="scope.row.enableStatus === 0"
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="启用工序">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="able" icon="el-icons-jd-qiyong" @click="enableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover v-else
                      placement="top-start"
                      width="100"
                      trigger="hover"
                      content="禁用工序">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="disable" icon="el-icons-jd-jinyong" @click="disableLine(scope.row.id, scope.row.enableStatus)"></el-button>
          </el-popover>
          <el-popover placement="top-start"
                      width="100"
                      trigger="hover"
                      content="删除工序">
            <el-button class="icon-btn hidden" slot="reference"  type="text" code="remove" icon="el-icons-jd-shanchu" @click="localRemoveLine(scope.row.id)"></el-button>
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
  import Tinymce from '@/components/Tinymce' /* 文本编辑器组件 */
  import { list, save, update, updateEnableStatus, remove, getById } from '@/api/processManagement'
  import BaseTable from '@/components/BaseTable'

  export default {
    name: 'processManagement',
    extends: BaseTable,
    components: {
      Tinymce /* 文本编辑器组件 */
    },
    data() {
      return {
        listMethod: list,
        saveMethod: save,
        getByIdMethod: getById,
        updateMethod: update,
        updateEnableStatusMethod: updateEnableStatus,

        productTypeCode: '',
        attributeValueVisible: false,
        searchForm: [{
          name: ''
        }],
        addForm: {
          name: '',
          code: '',
          content: '',
          duration: '',
          processSort: ''
        },
        editForm: {
          id: '',
          name: '',
          code: '',
          content: '',
          duration: '',
          processSort: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入工序名称', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入工序编码', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入工序内容', trigger: 'blur' }
          ],
          duration: [
            { required: true, message: '请输入操作时长', trigger: 'blur' }
          ],
          processSort: [
            { required: true, message: '请输入顺', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.fetchData(...this._searchFormToList())
    },
    watch: {
      dataList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    methods: {
      resetSearchForm() {
        this.searchForm[0].name = ''
      },
      /* 打开修改工序信息对话框 */
      goEdit() {
        this.preEdit().then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.name = resp.data.data.name
          this.editForm.code = resp.data.data.code
          this.editForm.content = resp.data.data.content
          this.editForm.duration = resp.data.data.duration
          this.editForm.processSort = resp.data.data.processSort
        }).catch(e => {
        })
      },
      /* 表格里操作按钮 修改 */
      goEditLine(id) {
        this.preEdit(id).then(resp => {
          this.editForm.id = resp.data.data.id
          this.editForm.name = resp.data.data.name
          this.editForm.code = resp.data.data.code
          this.editForm.content = resp.data.data.content
          this.editForm.duration = resp.data.data.duration
          this.editForm.processSort = resp.data.data.processSort
        }).catch(e => {
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        if (formName === 'addForm') {
          this.save(
            this.addForm.name,
            this.addForm.code,
            this.addForm.content,
            this.addForm.duration,
            this.addForm.processSort
          )
        } else if (formName === 'editForm') {
          this.update(
            this.editForm.id,
            this.editForm.name,
            this.editForm.code,
            this.editForm.content,
            this.editForm.duration,
            this.editForm.processSort
          )
        }
      },
      localRemoveLine(ids) {
        if (ids <= 50) {
          this.$message({
            type: 'warning',
            message: '内置工序禁止删除!',
            duration: 1500
          })
          return
        }
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
                this.fetchData(...this._searchFormToList(), this.pageNum, this.pageSize).then((resp) => {
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
      localRemove() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].id <= 50) {
            this.$message({
              type: 'warning',
              message: '内置工序禁止删除!',
              duration: 1500
            })
            return
          }
        }
        this.$confirm('确定删除吗？', '提示', {
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
                this.pageNum = 1
                this.fetchData(...this._searchFormToList(), this.pageNum, this.pageSize).then((resp) => {
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
