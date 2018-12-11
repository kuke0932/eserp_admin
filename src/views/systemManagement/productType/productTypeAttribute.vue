<template>
  <el-dialog
    title="设置产品属性"
    :visible.sync="dataVisible"
    width="40%"
    height="300px"
    @close="close"
    :before-close="handleClose">
    <h4 style="margin-top: 0;color:#606266">属性列表</h4>
    <el-scrollbar class="scrollbar" :style="{ height: treeHeight + 'px' }"
                  v-loading="treeDepLoading"
                  :element-loading-text= "loadingText">
      <el-tree
        :data="attributeTree"
        node-key="id"
        ref="tree"
        show-checkbox
        highlight-current
        default-expand-all
        check-on-click-node
        :props="defaultProps"
        @check-change="nodeCheckChange"
        @node-click="currentNodeClick">
      </el-tree>
      <el-button type="primary" :loading="submitLoading" @click="save">保存</el-button>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
  import { tree4ProductType, setProductTypeAttributeValue, getProductTypeAttributeValue } from '@/api/productAttributeValue'

  export default {
    name: 'productTypeAttributeValue',
    components: {},
    props: {
      visible: {
        type: Boolean,
        required: true,
        default: false
      },
      productTypeCode: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        treeDepLoading: false,
        submitLoading: false,
        loadingText: '拼命加载中',
        treeHeight: 0,
        attributeTree: [],
        checkedNodes: {},
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    computed: {
      dataVisible: {
        get: function() {
          return this.visible
        },
        set: function(val) {
        }
      }
    },
    created() {
      this.treeHeight = document.body.clientHeight - 500
      tree4ProductType().then(resp => {
        this.attributeTree = resp.data.data
      })
    },
    mounted() {
    },
    watch: {
      productTypeCode: function(val) {
        this.treeDepLoading = true
        getProductTypeAttributeValue(this.productTypeCode).then(resp => {
          this.$refs.tree.setCheckedKeys(resp.data.data)
          this.treeDepLoading = false
        })
      }
    },
    methods: {
      currentNodeClick(current, node) {
      },
      nodeCheckChange(node, check) {
      },
      save() {
        this.treeDepLoading = true
        this.loadingText = '提交中......' // 提示的文字
        this.submitLoading = true // 提交按钮设为 loading状态
        const checkedNodes = this.$refs['tree'].getCheckedNodes()
        if (checkedNodes.length === 0) {
          this.$message({
            type: 'warning',
            message: '您尚未选择属性值，请重新选择！',
            duration: 1500
          })
          return
        }
        let lastNode
        for (let i = 0, size = checkedNodes.length; i < size; i++) {
          if ((lastNode && lastNode.parentId) === checkedNodes[i].parentId) {
            const that = this
            this.$message({
              type: 'warning',
              message: '您在【' + that.$refs['tree'].getNode(checkedNodes[i].parentId).label + '】属性选择了多个属性值，请重新选择！',
              duration: 1500
            })
            return
          }
          lastNode = checkedNodes[i]
        }
        const attributeValueCodes = checkedNodes.map(node => {
          // TODO(只有一个value的时候会报错)
          // if (node.parentId) {
          return {
            productAttributeValueCode: node.id.split(',')[1],
            productAttributeValueName: node.label,
            attributeCode: node.parentId.split(',')[1],
            attributeName: this.$refs['tree'].getNode(node.parentId).label
          }
          // } else {
          //   return {
          //     productAttributeValueCode: node.children && node.children[0].id.split(',')[1],
          //     productAttributeValueName: node.children && node.children[0].label,
          //     attributeCode: node.id.split(',')[1],
          //     attributeName: node.label
          //   }
          // }
        })
        setProductTypeAttributeValue(this.productTypeCode, attributeValueCodes).then(resp => {
          this.$message({
            type: 'success',
            message: '设置成功',
            duration: 1500,
            onClose: () => {
              // this.$refs['tree'].setCheckedNodes([])
              this.checkedNodes = []
              this.$emit('update:visible', false)
              this.$emit('refresh', false)
              this.treeDepLoading = false
              this.loadingText = '拼命加载中......' // 提示的文字
              this.submitLoading = false // 提交按钮设为 正常状态
            }
          })
        }).catch(e => {
          this.treeDepLoading = false
          this.loadingText = '拼命加载中......' // 提示的文字
          this.submitLoading = false // 提交按钮设为 正常状态
        })
      },
      handleClose(done) {
        if (this.treeDepLoading === true || this.submitLoading === true) {
          return
        }
        this.$confirm('确认关闭1吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.checkedNodes = []
          // this.$refs['tree'].setCheckedNodes([])
          done()
        }).catch((e) => {
          done()
        })
      },
      close() {
        this.$emit('update:visible', false)
      }
    }
  }
</script>
<style scoped>

</style>
