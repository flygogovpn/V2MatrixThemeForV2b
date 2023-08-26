/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    getinvite();
    getconfig();
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

/*请求邀请数据*/
function getinvite(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/invite/fetch';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responseinvite);
}

/*响应邀请信息*/
function responseinvite(code,data){
  if (code == '200') {
    let a = document.getElementById('invite_big_amount');
    a.innerHTML = '¥'+JSON.parse(data).data.stat[4]/100;
    let b = document.getElementById('invite_renshu');
    b.innerHTML = JSON.parse(data).data.stat[0]+'人';
    let c = document.getElementById('invite_yongjinbili');
    c.innerHTML = JSON.parse(data).data.stat[3]+'%';
    let d = document.getElementById('invite_querenzhong');
    d.innerHTML = '¥'+JSON.parse(data).data.stat[1];
    let e = document.getElementById('invite_leiji');
    e.innerHTML = '¥'+JSON.parse(data).data.stat[2];
    f = JSON.parse(data).data.codes;
    let g = document.getElementById('inbutbutton_huazhua');
    g.setAttribute('value',JSON.parse(data).data.stat[4]/100);
    let saoguang_box = document.getElementById('saoguang_box');
    saoguang_box.innerHTML = '';
    if (f == ''){
      console.log(a);
      let queshengbox = document.createElement('div');
      let queshengtu = document.createElement('img');
      queshengbox.setAttribute('class','queshengtu-box');
      queshengtu.setAttribute('src','./img/queshengtu.png');
      queshengtu.setAttribute('class','queshengtu');
      let fatherdiv = document.getElementById('invite_codes');
      queshengbox.appendChild(queshengtu);
      fatherdiv.appendChild(queshengbox);
    }
    for(x in f) {
      let aa = document.createElement('div');
      aa.setAttribute('class','invite_code_down');
      let bb = document.createElement('div');
      bb.setAttribute('class','invite_code_words_groups');
      let cc = document.createElement('p');
      cc.setAttribute('class','invite_code');
      let dd = document.createElement('button');
      dd.setAttribute('class','invite_code_copy');
      dd.setAttribute('value',f[x].code);
      dd.setAttribute('onclick','copylinkcode(this.value)');
      let ee =  document.createElement('p');
      ee.setAttribute('class','invite_code_creattime');
      cc.innerHTML = f[x].code;
      dd.innerHTML = '复制链接';
      ee.innerHTML = getshijian(f[x].updated_at);
      let ff = document.getElementById('invite_codes');
      bb.appendChild(cc);
      bb.appendChild(dd);
      aa.appendChild(bb);
      aa.appendChild(ee);
      ff.appendChild(aa);
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

// 复制函数
function copy (text) {
  // text是复制文本
  // 创建input元素
  const el = document.createElement('input');
  // 给input元素赋值需要复制的文本
  el.setAttribute('value', text);
  // 将input元素插入页面
  document.body.appendChild(el);
  // 选中input元素的文本
  el.select();
  // 复制内容到剪贴板
  document.execCommand('copy');
  // 删除input元素
  document.body.removeChild(el);
}

//复制链接
function copylinkcode(code){
  let a = 'index.html?register='+code;
  let b = window.location.href.replace('invite.html','');
  let c = b+a;
  copy (c);
  tan('right','复制成功请发送给好友');
}


/*请求添加邀请码*/
function addinvitecode(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/invite/save';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responseaddinvitecode);
}

/*响应邀请码*/
function responseaddinvitecode(code,data){
  if (code == '200') {
    tan('right','添加成功');
    window.location.reload();
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

//全部余额
function putall(price) {
  let a = document.getElementById('huazhuaninput');
  //a.setAttribute('value',price);
  a.value = price;
}

//打开划转窗口
function openhuazhuanbox() {
  let a = document.getElementById('tanhuazhuan');
  a.style.display = 'flex';
}

//关闭划转窗口
function closehuazhuanbox() {
  let a = document.getElementById('tanhuazhuan');
  a.style.display = 'none';
}



/*请求提交划转*/
function addhuazhuan(){
  let mode = 'POST';
  let link = domain+'/api/v1/user/transfer';
  let a = document.getElementById('huazhuaninput');
  let params = {
    transfer_amount : a.value * 100
  }
  tanjiazai();
  jsonlink(mode,link,params,responseaddhuazhuan);
}

/*响应划转*/
function responseaddhuazhuan(code,data){
  if (code == '200') {
    tan('right','划转成功请刷新页面');
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

/*请求配置信息接口*/
function getconfig(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/comm/config';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responseconfig);
}

/*响应个人信息*/
function responseconfig(code,data){
  if (code == '200') {
    let a = JSON.parse(data).data.withdraw_close;
    let b = JSON.parse(data).data.withdraw_methods;
    if (a == '0'){
      let c = document.getElementById('invite_get_cash');
      c.style.display = 'block';
    }
    for (x in b) {
      let d =  document.createElement('option');
      d.innerHTML = b[x];
      let e = document.getElementById('tixianlist');
      e.appendChild(d);
    }
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}

//打开提现窗口
function opentixianbox() {
  let a = document.getElementById('tantixian');
  a.style.display = 'flex';
}

//关闭提现窗口
function closetixianbox() {
  let a = document.getElementById('tantixian');
  a.style.display = 'none';
}

/*请求提交提现*/
function addtixian(){
  let mode = 'POST';
  let link = domain+'/api/v1/user/ticket/withdraw';
  let a = document.getElementById('tixianlist');
  let b = a.selectedIndex ;
  let c = a.options[b].text;
  let d = document.getElementById('tiixaninput');
  let params = {
    withdraw_account : d.value,
    withdraw_method : c
  }
  tanjiazai();
  jsonlink(mode,link,params,responseaddtixian);
}

/*响应划转*/
function responseaddtixian(code,data){
  if (code == '200') {
    tan('right','提现成功成功,请刷新页面');
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