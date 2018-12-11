/* eslint-disable */
var LODOP;

setTimeout(function () {
  LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
  LODOP.PRINT_INIT("");
  $('.div').each(function (j) {
    CreateOnePage({ count: j });

  });
  if ($('#IsPreview').val() == "1") {
    LODOP.PREVIEW();
  } else {
    if (LODOP.SET_PRINTER_INDEX("SF")) {
      LODOP.PRINT();
    }
  }
}, "500");


function CreateOnePage(opts) {
  LODOP.NewPage();
  var strFormHtml = "<body>" + $(".div")[opts.count].innerHTML + "</body>";
  console.log(strFormHtml)
  LODOP.ADD_PRINT_HTM(0, 0, "100%", "100%", strFormHtml);
}

