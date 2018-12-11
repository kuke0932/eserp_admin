<template>
  <div class="container">
    <el-form ref="searchForm" :inline="true" class="searchForm" :model="searchForm">
      <el-row style="padding-bottom: 10px;">
        <el-form-item label="年月" prop="yearAndMounth">
          <el-date-picker
            v-model="searchForm.yearAndMounth"
            type="month"
            :editable="false"
            placeholder="选择年月"
            value-format="yyyy-MM">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="店铺" prop="shop">
          <el-select :clearable="true" v-model="searchForm.shop" placeholder="请选择店铺" clearable filterable>
            <el-option v-for="item in shopList" :key="item.value" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" :loading="searchLoading" @click="search">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>
    <div id="chart" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { getVisitCount, listDepartments } from '@/api/reportForm'

  export default {
    name: '回访统计',
    data() {
      return {
        shopList: [],
        listLoading: false,
        searchLoading: false,
        searchForm: {
          yearAndMounth: '',
          shop: ''
        },
        visitData: {
          alreadyVisit: 0,
          notVisit: 0,
          scale: 100
        },
        myChart: null
      }
    },
    mounted() {
      listDepartments(3).then(res => {
        this.shopList = res.data.data
      })
      this.showPie()
      this.fetchData(null, null)
    },
    methods: {
      showPie() {
        this.myChart = echarts.init(document.getElementById('chart'))
        this.myChart.setOption({
          title: {
            text: '回访统计',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: ['#42b983', '#f56c6c'],
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['已回访', '未回访']
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {
                  value: this.visitData.alreadyVisit,
                  name: '已回访'
                },
                {
                  value: this.visitData.notVisit,
                  name: '未回访'
                }
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      },
      /* 初始化数据 */
      fetchData(yearAndMounth, workShop) {
        this.listLoading = true
        return getVisitCount(
          yearAndMounth,
          workShop
        ).then(resp => {
          this.visitData.alreadyVisit = resp.data.data.alreadyVisit
          this.visitData.notVisit = resp.data.data.notVisit
          this.myChart.setOption({
            title: {
              text: '回访统计',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            color: ['#42b983', '#f56c6c'],
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['已回访', '未回访']
            },
            series: [
              {
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                  {
                    value: this.visitData.alreadyVisit,
                    name: '已回访'
                  },
                  {
                    value: this.visitData.notVisit,
                    name: '未回访'
                  }
                ],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }, true)
          this.listLoading = false
          return resp
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 查询 */
      search() {
        this.searchLoading = true
        this.fetchData(this.searchForm.yearAndMounth, this.searchForm.shop).then((resp) => {
          this.searchLoading = false
        })
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        // location.reload()
      }
    }
  }
</script>

<style scoped>
</style>
