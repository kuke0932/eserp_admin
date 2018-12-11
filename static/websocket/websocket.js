/* eslint-disable */
var webSocket = null;
// var recInterval = null;

window.onload = function () {
  var token = sessionStorage.getItem('x-auth-token')
  if(token) {
    // window.new_conn();
  }
}
/**
 * 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
 */
window.onbeforeunload = function (event) {
  webSocket && webSocket.close();
};

/*window.new_conn = function () {

  try {
    if ('WebSocket' in window) {
      var token = sessionStorage.getItem('x-auth-token')
      webSocket = new SockJS("/websocket/notifyWebSocket?token=" + token)
    } else {
      console.log('当前浏览器不支持webSocket')
    }
  } catch (e) {
    console.log(e)
  }

  /!**
   * 连接成功建立的回调方法
   *!/
  webSocket.onopen = function () {
    console.log('连接成功！')
    // clearInterval(recInterval);
  };


  /!**
   * 接收到消息的回调方法
   *!/
  webSocket.onmessage = function (event) {
    console.log(event.data);
    window.globalApp1Vue.notify(JSON.parse(event.data).data);
  };

  webSocket.onclose = function () {
    console.log('连接关闭！')
    // recInterval = setInterval(function () {
       window.new_conn();
    // }, 10000);
  };
};*/
