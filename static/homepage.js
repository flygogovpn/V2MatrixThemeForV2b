/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getgonggao();
    getdingyue();
    gettishi();
    getinfo();
  }
  else {
    exitlogout();
  }
}

var domain = "www.v2matrix.com";

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

/*请求公告接口*/
function getgonggao(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/notice/fetch';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responsegonggao);
}

/*响应公告接口*/
var gonggao = new Array();
function responsegonggao(code,data){
  let dict = {};
  if (code == '200') {
    let mes = JSON.parse(data).data;
    for (x in mes){
      dict['title']= mes[x].title;
      dict['content']= mes[x].content;
      gonggao.push(dict);
      dict = {};
    }
    let a = document.getElementById('gonggao_connect');
    a.innerHTML = gonggao[0].title;
    let b = document.getElementById('gonggao_count');
    b.innerHTML = '1/'+gonggao.length;
    opengonggao();
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}

/*请求订阅接口*/
function getdingyue(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/getSubscribe';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responsedingyue);
}

/*响应订阅接口*/
var dingyue = {};
function responsedingyue(code,data){
  if (code == '200') {
    let d = JSON.parse(data).data.d;
    let u = JSON.parse(data).data.u;
    let expired_at = JSON.parse(data).data.expired_at;
    let transfer_enable = JSON.parse(data).data.transfer_enable;
    let reset_day = JSON.parse(data).data.reset_day;
    let plan_id  = JSON.parse(data).data.plan_id;
    let plan = JSON.parse(data).data.plan;
    dingyue['d'] = d;
    dingyue['u'] = u;
    dingyue['expired_at'] =expired_at;
    dingyue['transfer_enable'] = transfer_enable;
    dingyue['reset_day'] = reset_day;
    dingyue['plan_id'] = plan_id;
    dingyue['plan'] = plan;

    let a = document.getElementById('liuliang_title');
    let bb = document.getElementById('liuliang_button');
    let c = document.getElementById('liuliang_des');
    let dd = document.getElementById('liuliang_des_2');
    let e = document.getElementById('liuliang_line');
    let f = document.getElementById('liuliang_line_box');
    let ts  = Math.round(new Date().getTime()/1000).toString();

    if(plan==null && plan_id==null) {
      a.innerHTML = '您暂未购买任何订阅';
      bb.innerHTML = '立即购买';
      c.innerHTML = '购买高级会员订阅,以获取最佳的网络访问速度';
      dd.innerHTML = '暂无可用流量';
      e.style.width= '0px';
    }
    else if (ts< expired_at && expired_at!=null && u+d < transfer_enable) {
      a.innerHTML = plan.name;
      bb.innerHTML = '续费订阅';
      c.innerHTML = '将于'+getshijian(expired_at)+'日过期,还有'+reset_day+'天重置流量';
      e.style.width = Math.trunc(((u+d)/transfer_enable)*f.offsetWidth)+'px'; //设置进度条的宽度
      dd.innerHTML = '已使用'+Math.trunc((u+d)/1024/1024/1024)+'GB/'+Math.trunc(transfer_enable/1024/1024/1024)+'GB';
    }
    else if (ts> expired_at && expired_at!=null ) {
      a.innerHTML = plan.name;
      bb.innerHTML = '续费订阅';
      c.innerHTML = '已于'+getshijian(expired_at)+'日过期,请立即续费,以恢复使用';
      e.style.width = '0px'; //设置进度条的宽度
      dd.innerHTML = '已过期,无法使用,请立即续费';
      dd.style.color = '#E02020';
    }
    else if (ts< expired_at && expired_at!=null  && u+d > transfer_enable) {
      a.innerHTML = plan.name;
      bb.innerHTML = '重置流量';
      c.innerHTML = '将于'+getshijian(expired_at)+'日过期,还有'+reset_day+'天重置流量';
      e.style.width = Math.trunc(f.offsetWidth)+'px'; //设置进度条的宽度
      e.style.borderRadius = '10px';
      dd.innerHTML = '流量已经用尽,请立即重置';
      dd.style.color = '#E02020';
    }
    else if ((expired_at==null || expired_at==0) && u+d < transfer_enable) {
      a.innerHTML = plan.name;
      bb.innerHTML = '重置流量';
      c.innerHTML = '当前订阅为一次性流量包';
      e.style.width = Math.trunc(((u+d)/transfer_enable)*f.offsetWidth)+'px'; //设置进度条的宽度
      dd.innerHTML = '已使用'+Math.trunc((u+d)/1024/1024/1024)+'GB/'+Math.trunc(transfer_enable/1024/1024/1024)+'GB';
    }
    else if  ((expired_at==null || expired_at==0) && u+d > transfer_enable){
      a.innerHTML = plan.name;
      bb.innerHTML = '重置流量';
      c.innerHTML = '当前订阅为一次性流量包';
      e.style.width = Math.trunc(f.offsetWidth)+'px'; //设置进度条的宽度
      e.style.borderRadius = '10px';
      dd.innerHTML = '流量已经用尽,请立即重置';
      dd.style.color = '#E02020';
    }
    else {
      tan('cuowu','当前网络不稳定,请刷新页面重试');
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
  return y + '-' + MM + '-' + d;
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

//下一个公告
function nextgonggao(){
  let a = document.getElementById('gonggao_count');
  let b = a.innerText[0];
  let c = a.innerText[2];
  let d = document.getElementById('gonggao_connect');
  let e = document.getElementById('gonggao_count');  
  if (b < c ) {
    d.innerHTML = gonggao[b]['title'];
    e.innerHTML = (parseInt(b)+1)+'/'+c;
  }
  else {
    d.innerHTML = gonggao[0]['title'];
    e.innerHTML = '1/'+c;
  }
}

//上一个公告
function shangyigegonggao(){
  let a = document.getElementById('gonggao_count');
  let b = a.innerText[0];
  let c = a.innerText[2];
  let d = document.getElementById('gonggao_connect');
  let e = document.getElementById('gonggao_count');  
  if (b == 1 ) {
    d.innerHTML = gonggao[parseInt(c)-1]['title'];
    e.innerHTML = c+'/'+c;

  }
  else  {
    d.innerHTML = gonggao[parseInt(b)-2]['title'];
    e.innerHTML = (parseInt(b)-1)+'/'+c;

  } 
}

//打开公告弹窗
function opengonggao(){
  let a = document.getElementById('gonggao_count');
  let b = a.innerText[0];
  let c = document.getElementById('tangonggao');
  let d = document.getElementById('gonggao_tan_title');
  let e = document.getElementById('gonggao_tan_content');  
  d.innerHTML = gonggao[parseInt(b)-1]['title'];
  let f = gonggao[parseInt(b)-1]['content'].split('\n');
  let g = '';
  for (x in f) {
    g = f[x]+'</br>'+g;
  }
  e.innerHTML = g;
  c.style.display = 'block';
}

//关闭公告弹窗
function closegonggao(){
  let c = document.getElementById('tangonggao');
  c.style.display = 'none';
}

//续费按钮跳转
function xufeianniu(){
  let ts  = Math.round(new Date().getTime()/1000).toString();

  if(dingyue.plan==null && dingyue.plan_id==null) {
    window.location.href='./shop.html';
  }
  else if (ts< dingyue.expired_at && dingyue.expired_at!=null && dingyue.u+dingyue.d < dingyue.transfer_enable) {
    window.location.href='./shop_peizhi.html?type=xufei&planid='+dingyue.plan_id;
  }
  else if (ts> dingyue.expired_at && dingyue.expired_at!=null ) {
    window.location.href='./shop_peizhi.html?type=xufei&planid='+dingyue.plan_id;
  }
  else if (ts< dingyue.expired_at && dingyue.expired_at!=null  && dingyue.u+dingyue.d > dingyue.transfer_enable) {
    window.location.href='./shop_peizhi.html?type=chongzhi&planid='+dingyue.plan_id;
  }
  else if ((dingyue.expired_at==null || dingyue.expired_at==0) && dingyue.u+dingyue.d < dingyue.transfer_enable) {
    window.location.href='./shop_peizhi.html?type=chongzhi&planid='+dingyue.plan_id;
  }
  else if  ((dingyue.expired_at==null || dingyue.expired_at==0) && dingyue.u+dingyue.d > dingyue.transfer_enable){
    window.location.href='./shop_peizhi.html?type=chongzhi&planid='+dingyue.plan_id;
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
  }
}

//打开下载
function opendownload(){
  window.location.href='./download.html';
}
//打开outline
function openoutline(){
  window.location.href='./outline.html';
}
//打开三方应用
function opensanfang(){
  window.location.href='./sanfang.html';
}
//打开购买订阅
function openshop(){
  window.location.href='./shop.html';
}
//使用教程
function openuse(){
  window.location.href='./use.html';
}

/*请求提示信息接口*/
function gettishi(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/getStat';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responsegettishi);
}

/*响应个人信息*/
function responsegettishi(code,data){
  if (code == '200') {
    let a = document.getElementById('dingdantishi-box');
    let b = document.getElementById('gongdantishi-box');
    let c =JSON.parse(data).data
  
    
    if(c[0]=='1'){
      console.log(c[0]);
      a.style.display = 'flex';
    }
    if (c[1] == '1'){
      b.style.display = 'flex';
      console.log(c[1]);
    }
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}