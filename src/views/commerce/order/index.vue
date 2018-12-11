<template>
  <div class="container">
    <el-form ref="searchForm" :model="searchForm" class="searchForm" :inline="true">
      <el-row>
        <el-form-item label="部门"  prop="departmentId" v-if="enableDepartmentSelection">
          <el-select v-model="searchForm.departmentId" placeholder="请选择部门" filterable>
            <el-option v-for="item in departmentSelections"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNumber">
          <el-input clearable v-model="searchForm.orderNumber"></el-input>
        </el-form-item>
        <el-form-item label="下单时间" prop="orderTime">
          <el-date-picker
            v-model="searchForm.orderTime"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select :clearable="true" v-model="searchForm.orderStatus" placeholder="请选择订单状态" clearable filterable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="expressNo">
          <el-input clearable v-model="searchForm.expressNo"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="searchForm.priority" placeholder="请选择优先级" clearable filterable>
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产车间" prop="produceDepartment">
          <el-select v-model="searchForm.produceDepartment" placeholder="请选择生产车间" clearable filterable>
            <el-option
              v-for="item in produceDepartmentOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" :loading="searchLoading" @click="search">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
      </el-row>
    </el-form>

    <div class="btn_box">
      <!--<el-button class="el-button&#45;&#45;primary hidden" code="add" @click="goAdd"><i class="el-icons-jd-add"></i>&nbsp;添加订单</el-button>-->
      <el-button class="el-button--primary hidden" code="edit" @click="goEdit"><i class="el-icons-jd-xiugai1"></i>&nbsp;修改订单</el-button>
      <el-dropdown type="primary" trigger="click" @command="modifyOrder" divided="true">
        <el-button type="primary hidden" code="change">
          <i class="el-icons-jd-biangeng"></i>&nbsp;变更订单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="4">变更材质颜色</el-dropdown-item>
          <el-dropdown-item command="1">变更双层</el-dropdown-item>
          <el-dropdown-item command="2">变更单层</el-dropdown-item>
          <el-dropdown-item command="8">变更收货地址</el-dropdown-item>
          <el-dropdown-item command="32">变更销售备注</el-dropdown-item>
          <el-dropdown-item command="64">添加退换货</el-dropdown-item>
          <el-dropdown-item command="128">添加维修</el-dropdown-item>
          <el-dropdown-item command="16">取消订单</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="el-button--primary hidden" code="audit" :loading="btnAuditOrderLoading" @click="auditOrderBtn"><i class="el-icons-jd-shenheyijian"></i>&nbsp;审核订单</el-button>
      <el-button class="el-button--primary hidden" code="import" @click="upLoadExcelBtn"><i class="el-icons-jd-daoru"></i>&nbsp;导入订单</el-button>
      <el-button class="el-button--primary hidden" code="import" @click="outExpressBtn"><i class="el-icons-jd-xiazaiziyuan"></i>&nbsp;导出快递单号</el-button>
      <el-button class="el-button--danger hidden" code="remove" :loading="removeLoading" @click="removeOrderBtn1"><i class="el-icons-jd-shanchu"></i>&nbsp;删除订单</el-button>
      <el-button class="el-button--primary hidden" code="check" @click="mergeOrder"><i class="el-icons-jd-chuli"></i>&nbsp;订单合并</el-button>
      <el-button class="el-button--primary hidden" code="view" @click="goDetail"><i class="el-icons-jd-chakanxiangqing1"></i>&nbsp;查看详情</el-button>
      <el-input clearable style="width: 332px;" placeholder="请输入买家姓名、手机号、收货地址、产品详情" v-model="searchValue"></el-input>
      <el-button class="el-button--primary" code="search"  @click="vagueSearch">搜索</el-button>
    </div>

    <el-dialog
      title="导入订单"
      :visible.sync="upLoadExceldialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="upLoadExcelForm" :model="upLoadExcelForm" label-width="80px"
               v-loading="upLoadExcelFormLoading"
               :element-loading-text="loadingText">

        <el-form-item label-width="100px" label="请选择Excel" prop="file">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            action=""
            :before-remove="beforeRemove"
            :on-change="fileChange"
            :limit="1"
            accept=".xlsx, .xls"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('upLoadExcelForm')">提交</el-button>
          <el-button @click="resetForm('upLoadExcelForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--导出快递编号-->
    <el-dialog
      title="导出快递编号"
      :visible.sync="outExpressdialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="outExpressForm" :model="outExpressForm" label-width="80px"
               v-loading="outExpressFormLoading"
               :element-loading-text="loadingText">

        <el-form-item label-width="100px" label="请选择Excel" prop="file">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            action=""
            :before-remove="beforeRemove"
            :on-change="exportFileChange"
            :limit="1"
            accept=".xlsx, .xls"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" :loading="submitLoading" @click="submitForm('outExpressForm')">提交</el-button>
          <el-button @click="resetForm('outExpressForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="核对订单"
      :visible.sync="checkOrderDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="checkOrderForm" :model="checkOrderForm" label-width="80px">

        <el-form-item label-width="100px" label="核对开始时间" prop="checkOrderBeginTime">
          <el-input clearable v-model="checkOrderForm.checkOrderBeginTime"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="核对结束时间" prop="checkOrderEndTime">
          <el-input clearable v-model="checkOrderForm.checkOrderEndTime"></el-input>
        </el-form-item>

        <el-form-item label-width="100px" label="请选择Excel" prop="checkFile">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            action=""
            :before-remove="beforeRemove"
            :on-change="exportFileChange"
            :limit="1"
            accept=".xlsx, .xls"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button type="primary" @click="submitForm('checkOrderForm')">提交</el-button>
          <el-button @click="resetForm('checkOrderForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      :data="orderList"
      ref="orderList"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column label="淘宝订单编号" width="160">
        <template slot-scope="scope">
          {{scope.row.taoBaoNumber}}
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="300">
        <template slot-scope="scope">
          {{scope.row.orderNumber}}
        </template>
      </el-table-column>
      <el-table-column label="产品详情">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.productList.length > 0"
                      placement="top-start"
                      width="1000"
                      trigger="click">
            <el-table :data="scope.row.productList" border>
              <el-table-column width="280" prop="productNo" label="产品编号"></el-table-column>
              <el-table-column width="500" prop="content" label="产品内容"></el-table-column>
              <el-table-column width="300" prop="saleRemark" label="销售备注"></el-table-column>
            </el-table>
            <div v-html="scope.row.productNo"></div>
            <a slot="reference" class="introduction" href="javascript:void(0)">查看详情</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="快递单号" width="150">
        <template slot-scope="scope">
          {{scope.row.expressNumber}}
        </template>
      </el-table-column>
      <el-table-column label="品牌" width="80">
        <template slot-scope="scope">
          {{scope.row.brand}}
        </template>
      </el-table-column>
      <el-table-column label="买家信息" width="80">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.productList.length > 0"
            placement="top-start"
            title="买家信息"
            width="400"
            trigger="hover">
            <div class="buyerInfo"><span>买家姓名:</span>{{scope.row.productList[0].name}}</div>
            <div class="buyerInfo"><span style="float: left;">详细地址:</span><span style="display: block;width: 230px;float: left;">{{scope.row.productList[0].addressInfo}}</span></div>
            <div class="buyerInfo"><span>邮编:</span>{{scope.row.productList[0].postcode}}</div>
            <div class="buyerInfo"><span>手机号:</span>{{scope.row.productList[0].telephone}}</div>
            <el-button style="border: 0;padding: 0;margin: 0;background: none;" slot="reference">查看详情</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="生产车间" width="120">
        <template slot-scope="scope">
          {{scope.row.produceDepartment}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="100" :formatter="tableFormatter">
      </el-table-column>
      <el-table-column label="优先级" width="100">
        <template slot-scope="scope">
          {{scope.row.priority == 3 ? '正常' : '加急'}}
        </template>
      </el-table-column>
      <el-table-column label="审核时间" width="160">
        <template slot-scope="scope">
          {{scope.row.auditTime}}
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="160">
        <template slot-scope="scope">
          {{scope.row.orderTime}}
        </template>
      </el-table-column>
      <el-table-column label="付款日期" width="160">
        <template slot-scope="scope">
          {{scope.row.payTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope" >
          <el-popover v-if="scope.row.orderStatus === 0"
            placement="top-start"
            width="100"
            trigger="hover"
            content="修改订单">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="edit" icon="el-icons-jd-xiugai1" @click="goEditOrder(scope.row.id)"></el-button>
          </el-popover>
          <el-popover  v-if="scope.row.orderStatus === 0"
            placement="top-start"
            width="100"
            trigger="hover"
            content="审核订单">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="audit" icon="el-icons-jd-shenheyijian" @click="auditOrderLine(scope.row.orderNumber)"></el-button>
          </el-popover>
          <el-popover  v-if="scope.row.orderStatus === 0"
            placement="top-start"
            width="100"
            trigger="hover"
            content="删除订单">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="remove" icon="el-icons-jd-shanchu" @click="removeOrder(scope.row.id)"></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            width="100"
            trigger="hover"
            content="查看详情">
            <el-button class="icon-btn hidden" slot="reference" type="text" code="view" icon="el-icons-jd-chakanxiangqing1" @click="viewDetail(scope.row.id)"></el-button>
          </el-popover>
        </template >
      </el-table-column>
    </el-table>
    <!--变更订单 -->
    <!--取消订单 -->
    <el-dialog
      title="取消订单:"
      :visible.sync="orderChangedialogVisible.cancelOrder"
      :close-on-click-modal="true"
      :show-close="true"
      width="20%"
      :before-close="handleClose">
      <span>确定要取消该订单？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureCancelOrder">确 定</el-button>
        <el-button type="primary" @click="notSure">取 消</el-button>
      </span>
    </el-dialog>
    <!--变更销售备注 -->
    <el-dialog
      title="变更销售备注:"
      :visible.sync="orderChangedialogVisible.changeRemark"
      :close-on-click-modal="true"
      :show-close="true"
      width="30%"
      :before-close="handleClose">
      <el-table :data="productList" width="100%" border>
        <el-table-column  label="产品编号">
          <template slot-scope="scope">
            <span>{{ scope.row.productNo }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="销售备注">
          <template slot-scope="scope">
            <input style="width: 100%; border: 0; height: 36px;" v-model="scope.row.saleRemark"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn_box" style="text-align: center;">
        <el-button type="primary" @click="changeSaleRemark">确定</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="danger" @click="notSure">取消</el-button>
      </div>
    </el-dialog>
    <!--变更地址-->
    <el-dialog
      title="变更地址信息:"
      :visible.sync="orderChangedialogVisible.changeOrderAddress"
      :close-on-click-modal="true"
      :show-close="true"
      width="40%"
      :before-close="handleClose">
      <el-form ref="orderAddress" :rules="rules" :model="orderAddress" label-width="120px">
        <el-form-item label="收货人姓名" prop="name" >
          <el-input clearable v-model="orderAddress.name"></el-input>
        </el-form-item>
        <el-form-item label="收货人手机号" prop="telephone" >
          <el-input clearable v-model="orderAddress.telephone"></el-input>
        </el-form-item>
        <el-form-item label-width="120px" label="收货人地址" prop="supplierAddress">
          <el-select v-model="orderAddress.province" placeholder="请选择省" @change="changeOrderProvince" clearable filterable>
            <el-option
              v-for="item in provinces"
              :key="item.id"
              :value="item.label">
            </el-option>
          </el-select>
          <el-select v-model="orderAddress.city" placeholder="请选择市" @change="changeOrderCity" clearable filterable>
            <el-option
              v-for="item in cities"
              :key="item.id"
              :value="item.label">
            </el-option>
          </el-select>
          <el-select v-model="orderAddress.county" placeholder="请选择区" clearable filterable>
            <el-option
              v-for="item in counties"
              :key="item.id"
              :value="item.label">
            </el-option>
          </el-select>
          <el-input clearable style="margin-top: 10px;" v-model="orderAddress.street"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="postcode" >
          <el-input clearable v-model="orderAddress.postcode"></el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="sureChangeOrderAddress">确定</el-button>
          <el-button type="danger" @click="notSure">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--变更材质颜色-->
    <el-dialog
      title="变更材质颜色:"
      :visible.sync="orderChangedialogVisible.changeOrderMaterial"
      :close-on-click-modal="true"
      :show-close="true"
      width="30%"
      :before-close="handleClose">
      <el-form ref="orderMaterial" :rules="rules" :model="orderMaterial" label-width="180px">
        <el-form-item label-width="120px" label="汽车品牌" prop="carBrandCode">
          <el-select v-model="orderMaterial.carBrandCode" placeholder="请选择汽车品牌" @change="getCarType" style="width: 100%;" clearable filterable>
            <el-option
              v-for="item in carbrandList"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="车型" prop="carTypeCode">
          <el-select v-model="orderMaterial.carTypeCode" placeholder="请选择车型" style="width: 100%;" clearable filterable>
            <el-option
              v-for="item in carTypeList"
              :key="item.id"
              :label="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" prop="carDesc">
          <el-input style="width: 100%;" v-model="orderMaterial.carDesc"/>
        </el-form-item>
        <el-form-item label-width="120px" label="产品型号" prop="productTypeCode">
          <el-select v-model="orderMaterial.productTypeCode" placeholder="请选择产品型号" style="width: 100%;" clearable filterable>
            <el-option
              v-for="item in productTypeList"
              :key="item.id"
              :label="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" prop="produceType">
          <el-input v-model="orderMaterial.produceType">
              <el-button type="primary" slot="append" @mouseover.native="sketchMapVisible = true" @mouseleave.native="mouseleave" icon="el-icons-jd-wenhao"></el-button>
          </el-input>
          <div class="divSketchMap" v-if="sketchMapVisible" >
            <sketch-map :produce-type.sync="orderMaterial.produceType" @mouseover.native="enterSketchMap" @mouseleave.native="leaveSketchMap" :readonly="false"></sketch-map>
          </div>
        </el-form-item>
        <el-form-item label-width="120px" label="上层材质颜色">
          <el-select v-model="orderMaterial.topColorCode" placeholder="请选择上层材质颜色" @change="changeTopColor" style="width: 100%;"  filterable :disabled="isHasTopColor">
            <el-option
              v-for="item in topColorList"
              :key="item.id"
              :label = "item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="下层材质颜色" prop="bottomColorCode">
          <el-select v-model="orderMaterial.bottomColorCode" placeholder="请选择下层材质颜色" @change="changeBottomColor" style="width: 100%;"  filterable>
            <el-option
              v-for="item in bottomColorList"
              :key="item.id"
              :label = "item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="sureChangeMaterial">确定</el-button>
          <el-button type="danger" @click="notSure">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--变更双层-->
    <el-dialog
      title="变更双层:"
      :visible.sync="orderChangedialogVisible.changeDouble"
      :close-on-click-modal="true"
      :show-close="true"
      width="30%"
      :before-close="handleClose">
      <el-form ref="orderMaterial" :rules="rules" :model="orderMaterial" label-width="160px">
        <el-form-item label-width="120px" label="产品型号" prop="productTypeCode">
          <el-select v-model="orderMaterial.productTypeCode" placeholder="请选择产品型号" style="width: 100%;" disabled>
            <el-option
              v-for="item in productTypeList"
              :key="item.id"
              :label="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="上层材质颜色">
          <el-select clearable v-model="orderMaterial.topColorCode" placeholder="请选择上层材质颜色" @change="changeTopColor" style="width: 100%;" clearable filterable>
            <el-option
              v-for="item in topColorList"
              :key="item.id"
              :label = "item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="下层材质颜色" prop="bottomColorCode">
          <el-select v-model="orderMaterial.bottomColorCode" placeholder="请选择下层材质颜色" @change="changeBottomColor" style="width: 100%;" clearable filterable disabled>
            <el-option
              v-for="item in bottomColorList"
              :key="item.id"
              :label = "item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="sureChangeDouble">变更双层</el-button>
          <el-button type="danger" @click="notSure">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--变更单层 -->
    <el-dialog
      title="变更单层:"
      :visible.sync="orderChangedialogVisible.changeSingle"
      :close-on-click-modal="true"
      :show-close="true"
      width="30%"
      :before-close="handleClose">
      <el-form ref="orderMaterial" :rules="rules" :model="orderMaterial" label-width="160px">
        <el-form-item label-width="120px" label="产品型号" prop="productTypeCode">
          <el-select v-model="orderMaterial.productTypeCode" placeholder="请选择产品型号" style="width: 100%;" disabled>
            <el-option
              v-for="item in productTypeList"
              :key="item.id"
              :label="item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="下层材质颜色" prop="bottomColorCode">
          <el-select v-model="orderMaterial.bottomColorCode" placeholder="请选择下层材质颜色" @change="changeBottomColor" style="width: 100%;" clearable filterable disabled>
            <el-option
              v-for="item in bottomColorList"
              :key="item.id"
              :label = "item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="sureChangeSingle">变更单层</el-button>
          <el-button type="danger" @click="notSure">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--变更退换货信息 -->
    <el-dialog
      title="添加退换货信息:"
      :visible.sync="orderChangedialogVisible.changeReturnRecord"
      :close-on-click-modal="true"
      :show-close="true"
      width="30%"
      :before-close="handleClose">
      <el-form ref="orderMaterial" :rules="rules" :model="ReturnRepairRecord" label-width="160px">
        <el-form-item label-width="120px" label="产品编号" prop="productNo">
          <el-select v-model="ReturnRepairRecord.productNos" multiple  placeholder="请选择产品编号" style="width: 100%;" clearable>
            <el-option
              v-for="item in productNoList"
              :key="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="退换货原因" prop="cause">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="ReturnRepairRecord.cause">
          </el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="sureChangeReturnRecord">提交</el-button>
          <el-button type="danger" @click="notSure">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--变更维修信息-->
    <el-dialog
      title="添加维修信息:"
      :visible.sync="orderChangedialogVisible.changeRepairRecord"
      :close-on-click-modal="true"
      :show-close="true"
      width="30%"
      :before-close="handleClose">
      <el-form ref="orderMaterial" :rules="rules" :model="ReturnRepairRecord" label-width="160px">
        <el-form-item label-width="120px" label="产品编号" prop="productNo">
          <el-select v-model="ReturnRepairRecord.productNos" multiple  placeholder="请选择产品编号" style="width: 100%;" clearable>
            <el-option
              v-for="item in productNoList"
              :key="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px"  label="维修来源" prop="repairSource">
          <el-select v-model="ReturnRepairRecord.source" placeholder="请选择来源" clearable filterable>
            <el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="原因" prop="cause">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="ReturnRepairRecord.cause">
          </el-input>
        </el-form-item>
        <el-form-item class="btn_box">
          <el-button type="primary" @click="sureChangeRepairRecord">提交</el-button>
          <el-button type="danger" @click="notSure">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--变更订单结束-->
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
  import { list, listByParam, auditOrder, upload, remove, changeOrder, mergeOrder, backfillExpressInfo, saveRepairRecord, saveReturnRecord } from '@/api/order'
  import { getById } from '@/api/editOrder'
  import { treeEnable } from '@/api/area'
  import { listAllSelection, listCarTypeByBrandCode } from '@/api/addOrder'
  import { authMenuButton } from '@/utils/authMenuButton'
  import { getSelections } from '@/api/department'
  import { setDepartmentId } from '@/utils/departmentManage'
  import SketchMap from '@/components/SketchMap'
  import _ from 'lodash'
  export default {
    name: '订单列表',
    components: {
      SketchMap
    },
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
        sketchMapVisible: false,
        isEnterSketchMap: false,
        produceDepartmentOptions: [],
        priorityOptions: [{
          value: '1',
          label: '加急'
        }, {
          value: '3',
          label: '正常'
        }],
        options: [{
          value: '0',
          label: '待审核'
        }, {
          value: '1',
          label: '待生效'
        }, {
          value: '2',
          label: '待打单'
        }, {
          value: '3',
          label: '待生产'
        }, {
          value: '4',
          label: '生产中'
        }, {
          value: '8',
          label: '待发货'
        }, {
          value: '9',
          label: '待揽件'
        }, {
          value: '10',
          label: '已揽件'
        }, {
          value: '11',
          label: '在途中'
        }, {
          value: '12',
          label: '签收'
        }, {
          value: '13',
          label: '问题件'
        }, {
          value: '14',
          label: '待回访'
        }, {
          value: '15',
          label: '已取消'
        }],
        mainStatus: {
          0: '待审核',
          1: '待生效',
          2: '待打单',
          3: '待生产',
          4: '生产中',
          8: '待发货',
          9: '待揽件',
          10: '已揽件',
          11: '在途中',
          12: '签收',
          13: '问题件',
          14: '待回访',
          15: '已取消'
        },
        subOptions: {
          1: '裁剪开始',
          2: '裁剪结束',
          3: '拼接开始',
          4: '拼接结束',
          5: '去边开始',
          6: '去边结束',
          7: '包边开始',
          8: '包边结束',
          9: '钉扣开始',
          10: '钉扣结束'
        },
        optionss: [{
          value: '0',
          label: '退货入库维修'
        }, {
          value: '1',
          label: '客户寄回维修'
        }, {
          value: '2',
          label: '出库维修'
        }],
        fileList: [],
        listLoading: false,
        searchLoading: false,
        upLoadExcelFormLoading: false, // 上传订单对话框
        outExpressFormLoading: false, // 导出对话框
        removeLoading: false, // 上传订单对话框
        loadingText: '拼命加载中...',
        submitLoading: false,
        btnAuditOrderLoading: false, // 审核订单按钮
        isHasTopColor: false, // 是否含有上层材质颜色，双层有，单层没有
        orderList: null,
        total: -1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        upLoadExceldialogVisible: false,
        outExpressdialogVisible: false,
        checkOrderDialogVisible: false,
        saveAuditOpinionDialogVisible: false,
        multipleSelection: [],
        auditOrderFlag: true,
        removeOrderFlag: true,
        enableDepartmentSelection: false,
        departmentSelections: [],
        upLoadExcelForm: {
          file: ''
        },
        outExpressForm: {
          file: ''
        },
        searchForm: {
          orderNumber: null,
          orderTime: null,
          orderStatus: null,
          departmentId: null,
          expressNo: null,
          priority: null,
          produceDepartment: null
        },
        searchValue: null,
        checkOrderForm: {
          checkOrderBeginTime: null,
          checkOrderEndTime: null,
          checkFile: null
        },
        saveAuditOpinionForm: {
          id: null,
          auditOpinion: null
        },
        orderChangedialogVisible: {
          cancelOrder: false,
          changeOrderAddress: false,
          changeOrderMaterial: false,
          changeDouble: false,
          changeSingle: false,
          changeRemark: false,
          changeReturnRecord: false,
          changeRepairRecord: false
        },
        orderChangeDto: {
          id: null,
          type: null,
          orderNumber: null,
          productNumber: null,
          addressId: null,
          customerName: null,
          customerTelephone: null,
          province: null,
          city: null,
          county: null,
          street: null,
          postcode: null,
          topColor: null,
          topColorCode: null,
          bottomColor: null,
          bottomColorCode: null,
          productTypeCode: null,
          carBrandCode: null,
          carTypeCode: null,
          carDesc: '',
          produceType: '',
          productList: []
        },
        orderAddress: {
          name: '',
          telephone: '',
          province: '',
          city: '',
          county: '',
          street: '',
          postcode: ''
        },
        orderMaterial: {
          topColorCode: '',
          topColor: '',
          bottomColorCode: '',
          bottomColor: '',
          productTypeCode: '',
          carBrandCode: '',
          carTypeCode: '',
          carDesc: '',
          produceType: ''
        },
        ReturnRepairRecord: {
          cause: null,
          productNos: [],
          source: null
        },
        provinces: [],
        cities: [],
        counties: [],
        rules: {
          name: [
            { required: true, message: '请输入收货人姓名', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '请输入收货人手机号', trigger: 'blur' }
          ],
          postcode: [
            { required: true, message: '请输入邮政编码', trigger: 'blur' }
          ],
          carBrandCode: [
            { required: true, message: '请选择汽车品牌', trigger: 'change' }
          ],
          carTypeCode: [
            { required: true, message: '请选择车型', trigger: 'change' }
          ],
          carDesc: [
            { required: true, message: '请填写车型参数', trigger: 'blur' }
          ],
          produceType: [
            { required: true, message: '请填写产品生产类型', trigger: 'blur' },
            { pattern: /^[0-3]{5}$/, message: '请填写正确的产品生产类型', trigger: 'blur' }
          ],
          productTypeCode: [
            { required: true, message: '请填写产品型号', trigger: 'change' }
          ],
          bottomColorCode: [
            { required: true, message: '请填写产品型号', trigger: 'change' }
          ],
          cause: [
            { required: true, message: '请填写原因', trigger: 'blur' }
          ],
          productNo: [
            { required: true, message: '请选择产品编号', trigger: 'blur' }
          ],
          repairSource: [
            { required: true, message: '请选择维修来源', trigger: 'blur' }
          ]
        },
        topColorList: [],
        bottomColorList: [],
        productTypeList: [],
        productList: [],
        carbrandList: [],
        carTypeList: [],
        productNoList: [],
        sign: 0,
        orderNumber: '',
        btnUpLoadExcelLoading: false,
        btnOutExpressLoading: false,
        searchTop: true
      }
    },
    watch: {
      orderList() {
        this.$nextTick(() => {
          authMenuButton(location.hash.substring(2))
        })
      }
    },
    created() {
      window.globalVue.$on('flushData', (flushData) => {
        if (flushData) {
          this.search()
        }
      })
    },
    mounted() {
      // TODO(参数改成从菜单里面获取的部门类型)
      this.getDepartmentSelections(3)
      this.fetchArea()
      this.listAllSelection()
    },
    methods: {
      mouseleave: _.debounce(function() {
        if (!this.isEnterSketchMap) {
          this.sketchMapVisible = false
        }
      }, 500),
      enterSketchMap() {
        this.sketchMapVisible = true
        this.isEnterSketchMap = true
      },
      leaveSketchMap() {
        this.sketchMapVisible = false
        this.isEnterSketchMap = false
      },
      /* 获取部门下拉框 */
      getDepartmentSelections(departmentType) {
        this.listLoading = true
        getSelections(departmentType).then(resp => {
          this.departmentSelections = resp.data.data
          if (this.departmentSelections.length > 1) {
            this.enableDepartmentSelection = true
          }
          this.searchForm.departmentId = this.departmentSelections[0].code
          this.fetchData(this.departmentSelections[0].code, null, null, null, null, null, null, this.pageNum, this.pageSize)
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 初始化订单列表 */
      fetchData(departmentId, orderNumber, orderTime, orderStatus, expressNo, priority, produceDepartment, pageNum, pageSize) {
        this.listLoading = true
        setDepartmentId(departmentId)
        return list(
          orderNumber,
          orderTime,
          orderStatus,
          expressNo,
          priority,
          produceDepartment,
          pageNum,
          pageSize
        ).then(resp => {
          this.orderList = resp.data.data.rows
          this.total = resp.data.data.total
          this.pageNum = resp.data.data.pageNum
          this.pageSize = resp.data.data.pageSize
          this.pages = resp.data.data.pages
          this.listLoading = false
          return resp
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 查询省市县区域 */
      fetchArea() {
        treeEnable().then(res => {
          this.provinces = res.data.data[0].children
        })
      },
      listAllSelection() {
        listAllSelection().then(resp => {
          this.productTypeList = resp.data.data.productTypeList
          this.topColorList = resp.data.data.topColorList
          this.bottomColorList = resp.data.data.bottomColorList
          this.produceDepartmentOptions = resp.data.data.departmentList
          this.carbrandList = resp.data.data.brandList
        })
      },
      /* 省份发生变化 */
      changeOrderProvince(value) {
        this.orderAddress.city = ''
        this.orderAddress.county = ''
        this.cities = []
        this.counties = []
        if (this.provinces === null) {
          return
        }
        for (let i = 0; i < this.provinces.length; i++) {
          // 省份变化查询省份
          if (this.provinces[i].label === value) {
            this.cities = this.provinces[i].children
            if (this.cities === null) {
              this.cities = []
            }
          }
        }
      },
      /* 城市发生变化 */
      changeOrderCity(value) {
        this.orderAddress.county = ''
        this.counties = []
        for (let i = 0; i < this.cities.length; i++) {
          if (this.cities[i].label === value) {
            this.counties = this.cities[i].children
          }
        }
      },
      /* 上层材质颜色发生变化 */
      changeTopColor(value) {
        this.orderMaterial.topColor = this.topColorList.filter(t => t.code === value).map(t => t.name)[0]
        return this.orderMaterial.topColor
      },
      /* 下层材质颜色发生变化 */
      changeBottomColor(value) {
        this.orderMaterial.bottomColor = this.bottomColorList.filter(t => t.code === value).map(t => t.name)[0]
        return this.orderMaterial.bottomColor
      },
      /* 查询 */
      search() {
        this.searchTop = true
        this.pageNum = 1
        this.sign = 0
        this.searchLoading = true
        this.fetchData(
          this.searchForm.departmentId,
          this.searchForm.orderNumber,
          this.searchForm.orderTime,
          this.searchForm.orderStatus,
          this.searchForm.expressNo,
          this.searchForm.priority,
          this.searchForm.produceDepartment,
          this.pageNum,
          this.pageSize
        ).then((resp) => {
          this.searchLoading = false
        }).catch(e => {
          this.searchLoading = false
        })
      },
      /* 打开导入订单对话框 */
      upLoadExcelBtn() {
        this.btnUpLoadExcelLoading = true
        this.upLoadExceldialogVisible = true
      },
      /* 打开导出订单对话框 */
      outExpressBtn() {
        this.btnOutExpressLoading = true
        this.outExpressdialogVisible = true
      },
      /* 删除订单 */
      removeOrderBtn1() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作!'
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].orderStatus !== 0 && this.multipleSelection[i].productList.length > 0) {
            this.removeOrderFlag = false
            break
          }
        }
        if (this.removeOrderFlag === false) {
          this.$message({
            type: 'warning',
            message: '当前状态不能删除订单!'
          })
          this.removeOrderFlag = true
        } else {
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
                  this.fetchData(
                    this.searchForm.departmentId,
                    this.searchForm.orderNumber,
                    this.searchForm.orderTime,
                    this.searchForm.orderStatus,
                    this.searchForm.expressNo,
                    this.searchForm.priority,
                    this.searchForm.produceDepartment,
                    this.pageNum,
                    this.pageSize
                  ).then((resp) => {
                    this.removeLoading = false
                    this.listLoading = false
                  })
                }
              })
            }).catch(e => {
              this.removeLoading = false
              this.listLoading = false
            })
          })
        }
      },
      removeOrder(id) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeLoading = true
          this.listLoading = true
          remove(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.departmentId,
                  this.searchForm.orderNumber,
                  this.searchForm.orderTime,
                  this.searchForm.orderStatus,
                  this.searchForm.expressNo,
                  this.searchForm.priority,
                  this.searchForm.produceDepartment,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.removeLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.removeLoading = false
            this.listLoading = false
          })
        })
      },
      checkOrderBtn() {
        this.checkOrderDialogVisible = true
      },
      goAdd() {
        this.$router.push({ path: '/commerce/order/add' })
      },
      goEdit() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        if (this.multipleSelection[0].orderStatus !== 0) {
          this.$message({
            type: 'warning',
            message: '当前状态不能修改订单!'
          })
          return
        }
        // 跳转页面并把id传过去
        this.$router.push({ path: '/commerce/order/edit', query: { id: this.multipleSelection[0].id + '' }})
      },
      goEditOrder(id) {
        // 跳转页面并把id传过去
        this.$router.push({ path: '/commerce/order/edit', query: { id: id + '' }})
      },
      goDetail() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        // 跳转页面并把id传过去
        this.$router.push({ path: '/commerce/order/orderDetail', query: { id: this.multipleSelection[0].id + '' }})
      },
      viewDetail(id) {
        // 跳转页面并把id传过去
        this.$router.push({ path: '/commerce/order/orderDetail', query: { id: id + '' }})
      },
      /* 导入订单和核对订单的表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'upLoadExcelForm') {
              this.submitLoading = true
              this.upLoadExcelFormLoading = true
              this.loadingText = '正在提交......'
              if (this.upLoadExcelForm.file === null || this.upLoadExcelForm.file === '') {
                this.$message({
                  type: 'warning',
                  message: '请选择上传文件!',
                  duration: '1500'
                })
                this.upLoadExcelFormLoading = false
                this.submitLoading = false
                return
              }
              upload(this.upLoadExcelForm.file).then(() => {
                this.$message({
                  type: 'success',
                  message: '上传成功!',
                  duration: '1500',
                  onClose: () => {
                    this.submitLoading = false
                    this.upLoadExcelFormLoading = false
                    this.loadingText = '正在提交......'
                    this.upLoadExceldialogVisible = false
                    this.fileList = []
                    this.search()
                    this.$refs[formName].resetFields()
                  }
                })
              }).catch(e => {
                this.submitLoading = false
                this.upLoadExcelFormLoading = false
                this.loadingText = '正在提交......'
                this.upLoadExceldialogVisible = false
              })
            } else if (formName === 'outExpressForm') {
              // console.log('写核对订单接口')
              this.submitLoading = true
              this.outExpressFormLoading = true
              this.loadingText = '正在提交......'
              if (this.outExpressForm.file === null || this.outExpressForm.file === '') {
                this.$message({
                  type: 'warning',
                  message: '请选择上传文件!',
                  duration: '1500'
                })
                this.outExpressFormLoading = false
                this.submitLoading = false
                return
              }
              backfillExpressInfo(this.outExpressForm.file).then(() => {
                this.$message({
                  type: 'success',
                  message: '上传成功!',
                  duration: '1500',
                  onClose: () => {
                    this.submitLoading = false
                    this.outExpressFormLoading = false
                    this.loadingText = '正在提交......'
                    this.outExpressdialogVisible = false
                    this.fileList = []
                    this.search()
                    this.$refs[formName].resetFields()
                  }
                })
              }).catch(e => {
                this.submitLoading = false
                this.outExpressFormLoading = false
                this.loadingText = '正在提交......'
                this.outExpressdialogVisible = false
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
        this.fileList = []
        this.$refs[formName].resetFields()
        // location.reload()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        if (this.editFormLoading === true || this.submitLoading === true || this.upLoadExcelFormLoading === true) {
          return
        }
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.upLoadExceldialogVisible = false
          this.fileList = []
          this.productNoList = []
          this.ReturnRepairRecord.cause = ''
          this.ReturnRepairRecord.source = null
          this.ReturnRepairRecord.productNos = []
        }).catch(() => {

        })
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        if (this.searchTop) {
          this.search()
        } else {
          this.vagueSearch()
        }
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        if (this.sign === 0) {
          this.fetchData(
            this.searchForm.departmentId,
            this.searchForm.orderNumber,
            this.searchForm.orderTime,
            this.searchForm.orderStatus,
            this.searchForm.expressNo,
            this.searchForm.priority,
            this.searchForm.produceDepartment,
            this.pageNum,
            this.pageSize
          )
        }
        if (this.sign === 1) {
          this.listLoading = true
          setDepartmentId(this.searchForm.departmentId)
          listByParam(this.searchValue, this.pageNum, this.pageSize).then(response => {
            this.orderList = response.data.data.rows
            this.total = response.data.data.total
            this.pageNum = response.data.data.pageNum
            this.pageSize = response.data.data.pageSize
            this.pages = response.data.data.pages
            this.listLoading = false
          })
        }
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
        if (this.multipleSelection.length === 1) {
          const rows = this.multipleSelection
          this.orderNumber = rows[0].orderNumber
        }
      },
      /* 审核订单 */
      auditOrderBtn() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择一行再执行此操作',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].orderStatus !== 0) {
            this.auditOrderFlag = false
          }
          break
        }
        if (this.auditOrderFlag === false) {
          this.$message({
            type: 'warning',
            message: '请选择状态为待审核的',
            duration: 1500
          })
          this.auditOrderFlag = true
          return
        } else {
          this.$confirm('是否要审核该订单', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnAuditOrderLoading = true
            this.listLoading = true
            const orderNumbers = []
            for (let j = 0; j < this.multipleSelection.length; j++) {
              orderNumbers.push(this.multipleSelection[j].orderNumber)
            }
            auditOrder(orderNumbers.join(',')).then(response => {
              this.$message({
                type: 'success',
                message: '审核成功',
                duration: 1000,
                onClose: () => {
                  this.fetchData(
                    this.searchForm.departmentId,
                    this.searchForm.orderNumber,
                    this.searchForm.orderTime,
                    this.searchForm.orderStatus,
                    this.searchForm.expressNo,
                    this.searchForm.priority,
                    this.searchForm.produceDepartment,
                    this.pageNum,
                    this.pageSize
                  ).then((resp) => {
                    this.btnAuditOrderLoading = false
                    this.listLoading = false
                  })
                }
              })
            }).catch(e => {
              this.btnAuditOrderLoading = false
              this.listLoading = false
            })
          })
        }
      },
      auditOrderLine(orderNumber) {
        this.$confirm('是否要审核该订单', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnAuditOrderLoading = true
          this.listLoading = true
          auditOrder(orderNumber).then(response => {
            this.$message({
              type: 'success',
              message: '审核成功',
              duration: 1000,
              onClose: () => {
                this.fetchData(
                  this.searchForm.departmentId,
                  this.searchForm.orderNumber,
                  this.searchForm.orderTime,
                  this.searchForm.orderStatus,
                  this.searchForm.expressNo,
                  this.searchForm.priority,
                  this.searchForm.produceDepartment,
                  this.pageNum,
                  this.pageSize
                ).then((resp) => {
                  this.btnAuditOrderLoading = false
                  this.listLoading = false
                })
              }
            })
          }).catch(e => {
            this.btnAuditOrderLoading = false
            this.listLoading = false
          })
        })
      },
      /* 文件上传 */
      beforeRemove(file, fileList) {
        return this.$confirm('确定移除' + file.name + '？')
      },
      fileChange(file, fileList) {
        this.upLoadExcelForm.file = file
      },
      exportFileChange(file, fileList) {
        this.outExpressForm.file = file
      },
      tableFormatter(row, column, cellValue, index) {
        const orderStatus = row.orderStatus
        if (orderStatus !== undefined && orderStatus !== '') {
          if (orderStatus === 4) {
            if (row.orderSubStatus) {
              return this.mainStatus[orderStatus] + '【' + this.subOptions[row.orderSubStatus] + '】'
            } else {
              return this.mainStatus[orderStatus]
            }
          } else {
            return this.mainStatus[orderStatus]
          }
        }
      },
      modifyOrder(value) {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选一行再执行此操作',
            duration: 1500
          })
          return
        }
        if (this.multipleSelection[0].orderStatus === 0) {
          this.$message({
            type: 'warning',
            message: '当前状态不能变更订单',
            duration: 1500
          })
          return
        }
        if (value === '32') {
          this.orderChangedialogVisible.changeRemark = true
          this.productList = this.multipleSelection[0].productList
          this.orderChangeDto.id = this.multipleSelection[0].id
          this.orderChangeDto.orderNumber = this.multipleSelection[0].orderNumber
          this.orderChangeDto.productNumber = this.multipleSelection[0].productNumber
          this.orderChangeDto.type = 32
          this.orderChangeDto.productList = this.productList
        }
        // 取消订单
        if (value === '16') {
          this.cancelorder()
        }
        // 变更地址
        if (value === '8') {
          this.orderChangedialogVisible.changeOrderAddress = true
          getById(this.multipleSelection[0].id).then(res => {
            const address = res.data.data
            this.orderAddress.name = address.name
            this.orderAddress.telephone = address.telephone
            this.orderAddress.province = address.province
            this.orderAddress.postcode = address.postcode
            this.orderChangeDto.addressId = address.customerAddressId
            this.orderMaterial.bottomColor = this.changeBottomColor(this.orderMaterial.bottomColorCode)
            this.orderMaterial.topColor = this.changeTopColor(this.orderMaterial.topColorCode)
            this.orderAddress.city = address.city
            this.orderAddress.county = address.county
            this.orderAddress.street = address.street
            this.orderChangeDto.id = this.multipleSelection[0].id
            this.orderChangeDto.orderNumber = this.multipleSelection[0].orderNumber
            this.orderChangeDto.productNumber = address.productNo
            this.orderChangeDto.type = 8
          })
        }
        // 变更材质
        if (value === '4') {
          getById(this.multipleSelection[0].id).then(res => {
            const product = this.selectMat(res.data.data.list)
            if (product === null) {
              this.$message({
                type: 'warning',
                message: '没有可变更的产品',
                duration: 1500
              })
              return
            }
            this.orderMaterial.topColorCode = product.topColorCode
            if (this.orderMaterial.topColorCode === null || this.orderMaterial.topColorCode === '' || this.orderMaterial.topColorCode === ' ') {
              this.isHasTopColor = true
            } else {
              this.isHasTopColor = false
            }
            this.orderChangedialogVisible.changeOrderMaterial = true
            this.orderMaterial.productTypeCode = product.productTypeCode
            this.orderMaterial.bottomColorCode = product.bottomColorCode
            this.orderMaterial.carTypeCode = product.carTypeCode
            this.orderMaterial.carBrandCode = product.brandCode
            this.orderMaterial.carDesc = product.carDesc
            this.orderMaterial.produceType = product.produceType
            listCarTypeByBrandCode(this.orderMaterial.carBrandCode).then(resp => {
              this.carTypeList = resp.data.data
            })
            this.orderMaterial.bottomColor = this.changeBottomColor(this.orderMaterial.bottomColorCode)
            this.orderMaterial.topColor = this.changeTopColor(this.orderMaterial.topColorCode)
            this.orderChangeDto.id = this.multipleSelection[0].id
            this.orderChangeDto.orderNumber = this.multipleSelection[0].orderNumber
            this.orderChangeDto.productNumber = product.productNo
            this.orderChangeDto.type = 4
          })
        }
        // 变更双层
        if (value === '1') {
          getById(this.multipleSelection[0].id).then(res => {
            const product = this.selectMat(res.data.data.list)
            if (product === null) {
              this.$message({
                type: 'warning',
                message: '没有可变更的产品',
                duration: 1500
              })
              return
            }
            this.orderMaterial.productTypeCode = product.productTypeCode
            this.orderMaterial.topColorCode = product.topColorCode
            if (this.orderMaterial.topColorCode === null || this.orderMaterial.topColorCode === '' || this.orderMaterial.topColorCode === ' ') {
              this.orderChangedialogVisible.changeDouble = true
            } else {
              this.$message({
                type: 'warning',
                message: '请选择单层产品进行变更',
                duration: 1500
              })
              return
            }
            this.orderMaterial.bottomColorCode = product.bottomColorCode
            this.orderMaterial.bottomColor = this.changeBottomColor(this.orderMaterial.bottomColorCode)
            this.orderMaterial.topColor = this.changeTopColor(this.orderMaterial.topColorCode)
            this.orderChangeDto.id = this.multipleSelection[0].id
            this.orderChangeDto.orderNumber = this.multipleSelection[0].orderNumber
            this.orderChangeDto.productNumber = product.productNo
          })
        }
        // 变更单层
        if (value === '2') {
          getById(this.multipleSelection[0].id).then(res => {
            const product = this.selectMat(res.data.data.list)
            if (product === null) {
              this.$message({
                type: 'warning',
                message: '没有可变更的产品',
                duration: 1500
              })
              return
            }
            this.orderMaterial.productTypeCode = product.productTypeCode
            this.orderMaterial.topColorCode = product.topColorCode
            if (this.orderMaterial.topColorCode === null || this.orderMaterial.topColorCode === '' || this.orderMaterial.topColorCode === ' ') {
              this.$message({
                type: 'warning',
                message: '请选择双层产品进行变更',
                duration: 1500
              })
              return
            } else {
              this.orderChangedialogVisible.changeSingle = true
            }
            this.orderMaterial.bottomColorCode = product.bottomColorCode
            this.orderMaterial.bottomColor = this.changeBottomColor(this.orderMaterial.bottomColorCode)
            this.orderMaterial.topColor = this.changeTopColor(this.orderMaterial.topColorCode)
            this.orderChangeDto.id = this.multipleSelection[0].id
            this.orderChangeDto.orderNumber = this.multipleSelection[0].orderNumber
            this.orderChangeDto.productNumber = product.productNo
          })
        }
        // 如果添加退换货信息
        if (value === '64') {
          if (this.multipleSelection[0].orderStatus < 9) {
            this.$message({
              type: 'warning',
              message: '当前状态不能变更退换货信息',
              duration: 1500
            })
            return
          }
          this.orderChangedialogVisible.changeReturnRecord = true
          this.multipleSelection[0].productList.forEach(v => {
            this.productNoList.push(v.productNo)
          })
          this.ReturnRepairRecord.cause = ''
        }
        // 如果添加维修信息
        if (value === '128') {
          if (this.multipleSelection[0].orderStatus < 9) {
            this.$message({
              type: 'warning',
              message: '当前状态不能变更退换货信息',
              duration: 1500
            })
            return
          }
          this.orderChangedialogVisible.changeRepairRecord = true
          this.multipleSelection[0].productList.forEach(v => {
            this.productNoList.push(v.productNo)
          })
          this.ReturnRepairRecord.cause = ''
        }
      },
      /* 变更销售备注 */
      changeSaleRemark() {
        changeOrder(this.orderChangeDto).then(res => {
          this.$notify({
            title: '提示',
            message: res.data.message,
            duration: 0
          })
          this.$refs.orderList.clearSelection()
          this.orderChangedialogVisible.changeRemark = false
          this.search()
        })
      },
      /* 打开取消订单提示框 */
      cancelorder() {
        this.orderChangedialogVisible.cancelOrder = true
        this.orderChangeDto.id = this.multipleSelection[0].id
        this.orderChangeDto.orderNumber = this.multipleSelection[0].orderNumber
        this.orderChangeDto.productNumber = this.multipleSelection[0].productNumber
        this.orderChangeDto.type = 16
      },
      /* 确定取消订单 */
      sureCancelOrder() {
        changeOrder(this.orderChangeDto).then(res => {
          this.$notify({
            title: '提示',
            message: res.data.message,
            duration: 0
          })
          this.$refs.orderList.clearSelection()
          this.orderChangedialogVisible.cancelOrder = false
          this.search()
        })
      },
      /* 确定变更订单地址 */
      sureChangeOrderAddress() {
        if (this.orderAddress.name === '' || this.orderAddress.name === null) {
          return
        }
        if (this.orderAddress.telephone === '' || this.orderAddress.telephone === null) {
          return
        }
        if (this.orderAddress.province === '' || this.orderAddress.province === null) {
          this.$message({
            type: 'warning',
            message: '请填写省份',
            duration: '2000'
          })
          return
        }
        if (this.orderAddress.city === '' || this.orderAddress.city === null) {
          this.$message({
            type: 'warning',
            message: '请填写城市',
            duration: '2000'
          })
          return
        }
        if (this.orderAddress.county === '' || this.orderAddress.county === null) {
          this.$message({
            type: 'warning',
            message: '请填写区县',
            duration: '2000'
          })
          return
        }
        if (this.orderAddress.street === '' || this.orderAddress.street === null) {
          this.$message({
            type: 'warning',
            message: '请填写详细地址',
            duration: '2000'
          })
          return
        }
        if (this.orderAddress.postcode === '' || this.orderAddress.postcode === null) {
          return
        }
        this.orderChangeDto.customerName = this.orderAddress.name
        this.orderChangeDto.customerTelephone = this.orderAddress.telephone
        this.orderChangeDto.province = this.orderAddress.province
        this.orderChangeDto.city = this.orderAddress.city
        this.orderChangeDto.county = this.orderAddress.county
        this.orderChangeDto.street = this.orderAddress.street
        this.orderChangeDto.postcode = this.orderAddress.postcode
        changeOrder(this.orderChangeDto).then(res => {
          this.$notify({
            title: '提示',
            message: res.data.message,
            duration: 0
          })
          this.$refs.orderList.clearSelection()
          this.orderChangedialogVisible.changeOrderAddress = false
          this.search()
        })
      },
      /* 变更材质 */
      sureChangeMaterial() {
        if (this.orderMaterial.productTypeCode === '' || this.orderMaterial.productTypeCode === null) {
          this.$message({
            type: 'warning',
            message: '请填写产品型号',
            duration: '2000'
          })
          return
        }
        if (this.orderMaterial.bottomColorCode === '' || this.orderMaterial.bottomColorCode === null) {
          this.$message({
            type: 'warning',
            message: '请填写下层材质颜色',
            duration: '2000'
          })
          return
        }
        this.orderChangeDto.topColor = this.orderMaterial.topColor
        this.orderChangeDto.topColorCode = this.orderMaterial.topColorCode
        this.orderChangeDto.bottomColor = this.orderMaterial.bottomColor
        this.orderChangeDto.bottomColorCode = this.orderMaterial.bottomColorCode
        this.orderChangeDto.productTypeCode = this.orderMaterial.productTypeCode
        this.orderChangeDto.carBrandCode = this.orderMaterial.carBrandCode
        this.orderChangeDto.carTypeCode = this.orderMaterial.carTypeCode
        this.orderChangeDto.carDesc = this.orderMaterial.carDesc
        this.orderChangeDto.produceType = this.orderMaterial.produceType
        changeOrder(this.orderChangeDto).then(res => {
          this.$notify({
            title: '提示',
            message: res.data.message,
            duration: 0
          })
          this.$refs.orderList.clearSelection()
          this.orderChangedialogVisible.changeOrderMaterial = false
          this.search()
        })
      },

      /* 变更双层 */
      sureChangeDouble() {
        this.orderChangeDto.type = 1
        if (this.orderMaterial.productTypeCode === '' || this.orderMaterial.productTypeCode === null) {
          this.$message({
            type: 'warning',
            message: '请填写产品型号',
            duration: '2000'
          })
          return
        }
        if (this.orderMaterial.bottomColorCode === '' || this.orderMaterial.bottomColorCode === null) {
          this.$message({
            type: 'warning',
            message: '请填写下层材质颜色',
            duration: '2000'
          })
          return
        }
        if (this.orderMaterial.topColorCode === '' || this.orderMaterial.topColorCode === null) {
          this.$message({
            type: 'warning',
            message: '请填写上层材质颜色',
            duration: '2000'
          })
          return
        }
        this.orderChangeDto.topColor = this.orderMaterial.topColor
        this.orderChangeDto.topColorCode = this.orderMaterial.topColorCode
        this.orderChangeDto.bottomColor = this.orderMaterial.bottomColor
        this.orderChangeDto.bottomColorCode = this.orderMaterial.bottomColorCode
        this.orderChangeDto.productTypeCode = this.orderMaterial.productTypeCode
        changeOrder(this.orderChangeDto).then(res => {
          this.$notify({
            title: '提示',
            message: res.data.message,
            duration: 0
          })
          this.$refs.orderList.clearSelection()
          this.orderChangedialogVisible.changeDouble = false
          this.search()
        })
      },

      /* 变更单层 */
      sureChangeSingle() {
        this.orderChangeDto.type = 2
        if (this.orderMaterial.productTypeCode === '' || this.orderMaterial.productTypeCode === null) {
          this.$message({
            type: 'warning',
            message: '请填写产品型号',
            duration: '2000'
          })
          return
        }
        if (this.orderMaterial.bottomColorCode === '' || this.orderMaterial.bottomColorCode === null) {
          this.$message({
            type: 'warning',
            message: '请填写下层材质颜色',
            duration: '2000'
          })
          return
        }
        this.orderChangeDto.topColor = this.orderMaterial.topColor
        this.orderChangeDto.topColorCode = ''
        this.orderChangeDto.bottomColor = ''
        this.orderChangeDto.bottomColorCode = this.orderMaterial.bottomColorCode
        this.orderChangeDto.productTypeCode = this.orderMaterial.productTypeCode
        changeOrder(this.orderChangeDto).then(res => {
          this.$notify({
            title: '提示',
            message: res.data.message,
            duration: 0
          })
          this.$refs.orderList.clearSelection()
          this.orderChangedialogVisible.changeSingle = false
          this.search()
        })
      },
      /* 添加退换货信息 */
      sureChangeReturnRecord() {
        if (this.ReturnRepairRecord.productNos.length === 0 || this.ReturnRepairRecord.cause === '') {
          this.$message({
            type: 'warning',
            message: '请检查填写参数',
            duration: '2000'
          })
          return
        }
        saveReturnRecord(this.ReturnRepairRecord.productNos.join(','), this.ReturnRepairRecord.cause).then(res => {
          this.$notify({
            title: '提示',
            message: res.data.message,
            duration: 0
          })
          this.orderChangedialogVisible.changeReturnRecord = false
          this.ReturnRepairRecord.productNos = []
          this.ReturnRepairRecord.cause = ''
          this.ReturnRepairRecord.source = null
        }).catch(e => {
          this.orderChangedialogVisible.changeReturnRecord = false
        })
      },
      /* 添加退换货信息 */
      sureChangeRepairRecord() {
        if (this.ReturnRepairRecord.productNos.length === 0 || this.ReturnRepairRecord.cause === '' ||
        this.ReturnRepairRecord.source === null || this.ReturnRepairRecord.source === 'null' || this.ReturnRepairRecord.source === '') {
          this.$message({
            type: 'warning',
            message: '请检查填写参数',
            duration: '2000'
          })
          return
        }
        saveRepairRecord(this.ReturnRepairRecord.productNos.join(','), this.ReturnRepairRecord.cause, this.ReturnRepairRecord.source).then(res => {
          this.$notify({
            title: '提示',
            message: res.data.message,
            duration: 0
          })
          this.orderChangedialogVisible.changeRepairRecord = false
          this.ReturnRepairRecord.productNos = []
          this.ReturnRepairRecord.cause = ''
          this.ReturnRepairRecord.source = null
        }).catch(e => {
          this.orderChangedialogVisible.changeRepairRecord = false
        })
      },
      /* 取消按钮 */
      notSure() {
        this.orderChangeDto = {
          id: null,
          type: null,
          orderNumber: null,
          productNumber: null,
          addressId: null,
          customerName: null,
          customerTelephone: null,
          province: null,
          city: null,
          county: null,
          street: null,
          postcode: null,
          topColor: null,
          topColorCode: null,
          bottomColor: null,
          bottomColorCode: null,
          productTypeCode: null,
          carBrandCode: null,
          carTypeCode: null,
          carDesc: '',
          produceType: '',
          productList: []
        }
        this.ReturnRepairRecord = {
          cause: null,
          productNos: '',
          source: null
        }
        this.productNoList = []
        this.orderChangedialogVisible.cancelOrder = false
        this.orderChangedialogVisible.changeOrderAddress = false
        this.orderChangedialogVisible.changeOrderMaterial = false
        this.orderChangedialogVisible.changeDouble = false
        this.orderChangedialogVisible.changeSingle = false
        this.orderChangedialogVisible.changeRemark = false
        this.orderChangedialogVisible.changeReturnRecord = false
        this.orderChangedialogVisible.changeRepairRecord = false
      },
      /* 订单合并 */
      mergeOrder() {
        // 如果小于两条,无法合并
        if (this.multipleSelection.length < 2) {
          this.$message({
            type: 'warning',
            message: '请选择至少两条订单进行合并',
            duration: 1500
          })
          return
        }
        const v = this.multipleSelection.filter(v => v === null || v.productList.length === 0)
        if (v === null || v.length > 0 || v === undefined) {
          this.$message({
            type: 'warning',
            message: '订单已无对应产品,请删除空订单!',
            duration: 1500
          })
          return
        }
        const areaType = this.multipleSelection[0].productList[0].areaType
        const address = this.multipleSelection[0].productList[0].address
        const array = []
        const ids = []
        let countMat = 0
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id)
          if (this.multipleSelection[i].problem === 2) {
            this.$message({
              type: 'warning',
              message: '订单【' + this.multipleSelection[i].orderNo + '】' + this.multipleSelection[i].error,
              duration: 1500
            })
            return
          }
          for (let j = 0; j < this.multipleSelection[i].productList.length; j++) {
            array.push(this.multipleSelection[i].productList[j])
            if (this.multipleSelection[i].productList[j].matOrNot === 1) {
              countMat += 1
            }
          }
        }
        if (countMat > 1) {
          this.$message({
            type: 'warning',
            message: '两个脚垫产品无法合并',
            duration: 1500
          })
          return
        }
        for (let i = 0; i < array.length; i++) {
          if (array[i].areaType !== areaType) {
            this.$message({
              type: 'warning',
              message: '产品仓库位置不同,无法合并',
              duration: 1500
            })
            return
          }
          if (array[i].address !== address) {
            this.$message({
              type: 'warning',
              message: '产品收货地址不同,无法合并',
              duration: 1500
            })
            return
          }
        }
        mergeOrder(ids.join(',')).then(res => {
          this.$message({
            type: 'success',
            message: '合并成功',
            duration: 1500
          })
          this.search()
        })
      },
      /* 综合搜索 */
      vagueSearch() {
        this.searchTop = false
        this.listLoading = true
        this.pageNum = 1
        this.sign = 1
        setDepartmentId(this.searchForm.departmentId)
        listByParam(this.searchValue, this.pageNum, this.pageSize).then(response => {
          this.orderList = response.data.data.rows
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.pages = response.data.data.pages
          this.listLoading = false
        }).catch(e => {
          this.listLoading = false
        })
      },
      /* 选择出脚垫 */
      selectMat(list) {
        let mat = null
        list.forEach(v => {
          if (v.matOrNot === 1) {
            mat = v
          }
        })
        return mat
      },
      /* 车型改变 */
      getCarType(code) {
        listCarTypeByBrandCode(code).then(resp => {
          this.carTypeList = resp.data.data
          this.orderMaterial.carTypeCode = ''
        })
      }
    }
  }
</script>

<style scoped>
  .el-dialog {
    border-radius: 5px;
  }
</style>

<style>
  .buyerInfo{
    line-height: 24px;
    overflow: hidden;
  }
  .buyerInfo span{
    width: 70px;
    display: inline-block;
    /*font-weight: bold;*/
  }
  .el-popover{
    padding-left: 16px;
    padding-top: 16px;
  }
  .el-popover__title{
    font-weight: bold;
    color: #409eff;
  }
  .divSketchMap{
    display: block;
    position: absolute;
    right: -291px;
    top: -100px;
    background: rgb(255, 255, 255);
  }
</style>
