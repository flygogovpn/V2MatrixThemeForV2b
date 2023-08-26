/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    getticket();
    bindevent();
  }
  else {
    exitlogout();
  }
}

 var domain = "";

/*网络请求*/
function jsonlink(mode,link,params,callback){
  var auth = localStorage.getItem('authorization');
  var xmlHttp = new XMLHttpRequest;
  //let requesetjson;
  xmlHttp.open(mode,link,true);
  if(mode == 'POST'){
    xmlHttp.setRequestHeader('content-type','application/json');
    xmlHttp.setRequestHeader('authorization',auth);
    xmlHttp.send(JSON.stringify(params));
    console.log(params);
  }
  else {
      xmlHttp.setRequestHeader('authorization',auth);
      xmlHttp.send();
    }

  xmlHttp.onreadystatechange =  function(){
    if (xmlHttp.readyState ==4 && xmlHttp.status ==200){
      var json = xmlHttp.responseText;//获取到服务端返回的数据
      callback(xmlHttp.status,json);
    }
    else if (xmlHttp.readyState ==4 && xmlHttp.status ==500){
      var json = xmlHttp.responseText;//获取到服务端返回的数据
      callback(xmlHttp.status,json);
    }
    else if (xmlHttp.readyState ==4 && xmlHttp.status ==422){
      var json = xmlHttp.responseText;//获取到服务端返回的数据
      callback(xmlHttp.status,json);
    }
    else if (xmlHttp.readyState !=4 && xmlHttp.status != 500 && xmlHttp.status != 200 && xmlHttp.status != 422){
      var json = xmlHttp.responseText;//获取到服务端返回的数据
      callback(xmlHttp.status,'001');
    }
  }
}

/*请求个人信息接口*/
function getinfo(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/info';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responseinfo);
}

/*响应个人信息*/
function responseinfo(code,data){
  if (code == '200') {
    let a = document.getElementById('logout_words');
    a.innerHTML = JSON.parse(data).data.email;
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}

/*请求工单接口*/
function getticket(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/ticket/fetch';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responsegetticket);
}

var youxian = {
  0:'低',
  1:'中',
  2:'高'
}

/*响应订单接口*/
function responsegetticket(code,data){
  var j = document.getElementById('ticket_down');
  j.innerHTML = '';
  if (code == '200') {
    let a = JSON.parse(data).data;
    if (a == ''){
      console.log(a);
      let queshengbox = document.createElement('div');
      let queshengtu = document.createElement('img');
      queshengbox.setAttribute('class','queshengtu-box');
      queshengtu.setAttribute('src','./img/queshengtu.png');
      queshengtu.setAttribute('class','queshengtu');
      let fatherdiv = document.getElementById('ticket_down');
      queshengbox.appendChild(queshengtu);
      fatherdiv.appendChild(queshengbox);
    }
    for (x in a ){
      let b = document.createElement('div');
      b.setAttribute('class','ticket_box');

      let c = document.createElement('p');
      c.setAttribute('class','ticket_box_id');

      let d = document.createElement('button');
      d.setAttribute('class','ticket_box_title');

      let e = document.createElement('p');
      e.setAttribute('class','ticket_box_youxian');

      let f = document.createElement('p');
      f.setAttribute('class','ticket_box_zhuangtai');

      let g = document.createElement('p');
      g.setAttribute('class','ticket_box_shijian');

      let h = document.createElement('button');
      h.setAttribute('class','ticket_box_cancel');

      c.innerHTML = a[x].id;
      d.innerHTML = a[x].subject;
      d.setAttribute('value',a[x].id);
      d.setAttribute('onclick','xunhuan(this.value)');
      e.innerHTML = youxian[a[x].level];
      h.innerHTML = '关闭';
      if(a[x].status == '1'){
        f.innerHTML = '已关闭';
        f.style.color = '#6DD400';
        h.style.color = '#D9D9D9';
        h.setAttribute('value',a[x].id);
      }
      else {
        if(a[x].reply_status == '0'){
          f.innerHTML = '已回复';
          f.style.color = '#0091FF';
          h.setAttribute('value',a[x].id);
          h.setAttribute('onclick','closeticket(this.value)');
        }
        else {
          f.innerHTML = '待回复';
          f.style.color = '#E02020';
          h.setAttribute('value',a[x].id);
          h.setAttribute('onclick','closeticket(this.value)');
        }
      }
      g.innerHTML = getshijian(a[x].updated_at);
    
      b.appendChild(c);
      b.appendChild(d);
      b.appendChild(e);
      b.appendChild(f);
      b.appendChild(g);
      b.appendChild(h);
 
      let j = document.getElementById('ticket_down');
      j.appendChild(b);
    }
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}

//时间戳转日期
function getshijian(time) {
  let date = new Date(parseInt(time) * 1000);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return y + '/' + MM + '/' + d+' '+h+':'+m+':'+d;
}



/*关闭工单接口*/
function closeticket(ticketid){
  let mode = 'POST';
  let link = domain+'/api/v1/user/ticket/close';
  let params = {
    id : ticketid
  }
  console.log(params);
  tanjiazai();
  jsonlink(mode,link,params,responsecloseticket);
}

/*响应关闭工单接口*/
function responsecloseticket(code,data){
  if (code == '200') {
    tan('right','关闭成功');
    canceltanjiazai();
    getticket();
  }
  else if(code == '500'){
    tan('cuowu',JSON.parse(data).message);
    console.log(JSON.parse(data).message);
    canceltanjiazai();
  }
  else if(code == '422'){
    var xx = JSON.parse(data).errors;
    var errorname = new Array();
    for (item in xx){
      errorname.push(item);
    }
    for (mes in errorname){
      abc = errorname[mes];
      console.log(xx[abc][0]);
      tan('cuowu',xx[abc][0]);
    }
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不佳请您刷新页面后重试');
    canceltanjiazai();
  }
}

/*打开工单详情*/
var ticketid_quanju = null;
function detailticket(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/ticket/fetch?id='+ticketid_quanju;
  let params = '';
  console.log(params);
  jsonlink(mode,link,params,responsedetailticket);
  tan('right','数据请求中');
}

/*响应工单详情*/
function responsedetailticket(code,data){
  if (code == '200') {
    let user_id = JSON.parse(data).data.user_id;
    let subject = JSON.parse(data).data.subject;
    let a = document.getElementById('tanbox-gongdan-title');
    a.innerHTML = subject;
    let f = document.getElementById('tanbox-gongdan-down');
    f.innerHTML = '';
    let h = document.getElementById('gongdan_send');
    h.setAttribute('value',JSON.parse(data).data.id);
    let message = JSON.parse(data).data.message;
    for (x in message){
      var b = document.createElement('div');
      var c = document.createElement('p');
      var d = document.createElement('p');
      if (user_id != message[x].user_id){
        b.setAttribute('class','gongdanneirongbox_zuo');
        c.setAttribute('class','gongdanshijian');
        d.setAttribute('class','gongdanzuo');
      }
      else
      {
        b.setAttribute('class','gongdanneirongbox_you');
        c.setAttribute('class','gongdanshijian');
        d.setAttribute('class','gongdanyou');
      }
      d.innerHTML =  message[x].message;
      c.innerHTML =  getshijian(message[x].updated_at);
      b.appendChild(c);
      b.appendChild(d);
      f.appendChild(b);
    }
    let g = document.getElementById('chakangongdan');
    g.style.display = 'flex';
    canceltanjiazai();
  }
  else if(code == '500'){
    tan('cuowu',JSON.parse(data).message);
    console.log(JSON.parse(data).message);
    canceltanjiazai();
  }
  else if(code == '422'){
    var xx = JSON.parse(data).errors;
    var errorname = new Array();
    for (item in xx){
      errorname.push(item);
    }
    for (mes in errorname){
      abc = errorname[mes];
      console.log(xx[abc][0]);
      tan('cuowu',xx[abc][0]);
    }
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不佳请您刷新页面后重试');
    canceltanjiazai();
  }
}

//循环更新数据
var mytimer = null;
function xunhuan(ticketid){
  ticketid_quanju = ticketid;
  detailticket();
  mytimer = setInterval(detailticket, 5000);
}

//停止循环数据
function stopxunhua(){
  let g = document.getElementById('chakangongdan');
  g.style.display = 'none';
  clearInterval(mytimer);
  ticketid_quanju = null;
}

/*发送内容接口*/
function sendmessage(ticketid){
  let mode = 'POST';
  let link = domain+'/api/v1/user/ticket/reply';
  let a = document.getElementById('tanbox_gongdan_text');
  let params = {
    id : ticketid,
    message :a.value
  }
  console.log(params);
  tanjiazai();
  jsonlink(mode,link,params,responsesendmessage);
}

/*响应发送内容接口*/
function responsesendmessage(code,data){
  if (code == '200') {
    tan('right','发送成功');
    let a = document.getElementById('tanbox_gongdan_text');
    a.value = '';
    canceltanjiazai();
  }
  else if(code == '500'){
    tan('cuowu',JSON.parse(data).message);
    console.log(JSON.parse(data).message);
    canceltanjiazai();
  }
  else if(code == '422'){
    var xx = JSON.parse(data).errors;
    var errorname = new Array();
    for (item in xx){
      errorname.push(item);
    }
    for (mes in errorname){
      abc = errorname[mes];
      console.log(xx[abc][0]);
      tan('cuowu',xx[abc][0]);
    }
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不佳请您刷新页面后重试');
    canceltanjiazai();
  }
}

//这段代码是用来处理输入文本框默认提示的
function bindevent(){
  let a = document.getElementById('tanbox_textarea_text');
  a.addEventListener('focus',qingkongtishi);
  a.addEventListener('blur',huifutishi);
}
function qingkongtishi(){
  let a = document.getElementById('tanbox_textarea_text');
  if(a.value =='请输入工单内容'){
    a.value = '';
  }
}
function huifutishi(){
  let a = document.getElementById('tanbox_textarea_text');
  if(a.value ==''){
    a.value = '请输入工单内容';
  }
}

//打开发送新工单的弹窗
function opensendticket(){
  let a = document.getElementById('fabuxingongdan');
  a.style.display = 'block';
}

//关闭发送新工单的弹窗
function closesendticket(){
  let a = document.getElementById('fabuxingongdan');
  a.style.display = 'none';
}

/*发送工单接口*/
function sendticket(){
  let mode = 'POST';
  let link = domain+'/api/v1/user/ticket/save';
  let a = document.getElementById('tanbox_ticket_text');
  let b = document.getElementById('tanbox_select_text');
  let c = document.getElementById('tanbox_textarea_text');
  let d = b.selectedIndex;
  let params = {
    subject : a.value,
    message : c.value,
    level :  b.options[d].value
  }
  console.log(params);
  tanjiazai();
  jsonlink(mode,link,params,responsesendticket);
}

/*响应发送工单接口*/
function responsesendticket(code,data){
  if (code == '200') {
    tan('right','发送成功');
    getticket();
    closesendticket();
    canceltanjiazai();
  }
  else if(code == '500'){
    tan('cuowu',JSON.parse(data).message);
    console.log(JSON.parse(data).message);
    canceltanjiazai();
  }
  else if(code == '422'){
    var xx = JSON.parse(data).errors;
    var errorname = new Array();
    for (item in xx){
      errorname.push(item);
    }
    for (mes in errorname){
      abc = errorname[mes];
      console.log(xx[abc][0]);
      tan('cuowu',xx[abc][0]);
    }
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不佳请您刷新页面后重试');
    canceltanjiazai();
  }
}