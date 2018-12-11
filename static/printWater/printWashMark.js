/* eslint-disable */
var LODOP
var taskIds = []
var pids = []
var jobIds = []
var json
var printerName
var successCount = 0

function getQuery(para, search) {
  var reg = new RegExp('(^|&)' + para + '=([^&]*)(&|$)')
  var r = search.match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

// 是否真正打印成功的状态
function returnStatus(realPrintCount, index) {
  LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'))
  taskIds[index] = (LODOP.GET_VALUE('PRINT_STATUS_EXIST', realPrintCount))
}

$(function () {
  $(window).bind('beforeunload', function (e) {
    (e || window.event).returnValue = '您输入的内容尚未保存，确定离开此页面吗？'
    return '您输入的内容尚未保存，确定离开此页面吗？'
  })
  if(!window.parent.LodopInstalled) {
    // TODO 开始打印 清除队列按钮disable
    $(".goPrint").attr('disabled',true).css({'opacity': 0.5,'cursor': 'not-allowed'})
    $(".goClearPrint").attr('disabled',true).css({'opacity': 0.5,'cursor': 'not-allowed'})
  }
  var ids = decodeURIComponent(getQuery('ids', window.parent.location.search.substr(1)))
  $.get('/erp/admin/print/printWater?ids=' + ids)
    .success(function (resp) {
      json = {result: resp.data.sewnInLabelList}
      console.log(json)
      $('#expressCount').text(resp.data.sewnInLabelList.length)
    })
    .error(function (err) {
      console.log(err.responseJSON.message)
      alert(err.responseJSON.message)
    })
  initProcess()
})

function initProcess() {
  $('.box').show()
  var tiao = $('.tiao')
  tiao.css('width', '0%').html('0%')
}

function processChange() {
  var expressCount = $('#expressCount').html() || 0
  var successCount = $('#successCount').html() || 0
  var percent = (successCount / expressCount) * 100 || 0
  var tiao = $('.tiao')
  tiao.css('width', percent.toFixed(2) + '%').html(percent.toFixed(2) + '%')
  if (percent >= 100) {
    $('.ok').html('打印完成').fadeIn('slow')
    $(".loadEffect").hide()
    $(".wenzi").show()
    return
  }
}

function begin() {
  $(".loadEffect").show()
  $(".wenzi").hide()

  LODOP = getLodop(document.getElementById('LODOP'), document.getElementById('LODOP_EM'))
  $.each(json.result, function (i, item) {
    printerName = item.printerName
    LODOP.PRINT_INIT('')
    LODOP.On_Return_Remain = true
    LODOP.On_Return = function (TaskID, Value) {
      for (var i = 0; i < pids.length; i++) {
        if (TaskID === pids[i]) {
          jobIds[i] = Value
          returnStatus(Value, i)
        }
      }
      for (var i = 0; i < taskIds.length; i++) {
        if (TaskID === taskIds[i]) {
          if (Value === '0') {
            var successCode = item.orderCode
            $.ajax({
              url: '/erp/admin/print/updateSewnInLabelPrintStatus',
              type: 'post',
              beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('x-auth-token', window.sessionStorage.getItem('x-auth-token'))
              },
              data: {
                'orderNo': successCode
              },
              success: function () {
                $('#successCount').text(++successCount)
                processChange()
                console.log('操作成功')
              },
              error: function () {
                console.log('操作成功')
              }
            })
          } else {
            returnStatus(jobIds[i], i)
          }
        }
      }
    }
    LODOP.SET_PRINT_PAGESIZE(0, 400, 620, 'custom')
    LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true)
    for (let j = 0; j < item.washLabelNo; j++) {
      CreateOnePage(item.qrcodeUrl)
    }
    if ($('#IsPreview').val() == '1') {
      LODOP.PREVIEW()
    } else {
      if (LODOP.SET_PRINTER_INDEXA(printerName)) {
        pids.push(LODOP.PRINT())
      }
    }
  })
}

function purge() {
  var result = confirm('确定要清空队列吗?')
  if (result === true) {
    var LODOP = getLodop(document.getElementById('LODOP'), document.getElementById('LODOP_EM'))
    LODOP.On_Return = function (TaskID, Value) {
      alert('清理结果:' + Value)
    }
    LODOP.SET_PRINT_MODE('CONTROL_PRINTER:' + printerName, 'PURGE')
  } else {
  }
}

function CreateOnePage(detailItem) {
  LODOP.NewPage()
  var strFormHtml = '<body><div style="width: 100%;"><img src="' + detailItem + '"/></div></body>'
  LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strFormHtml)
}

