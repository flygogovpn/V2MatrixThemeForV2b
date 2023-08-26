/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    getconfig()
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
var kaiguan_status = {
  remind_expire : '1',
  remind_traffic : '1'
}
function responseinfo(code,data){
  if (code == '200') {
    let a = document.getElementById('logout_words');
    let b = document.getElementById('set_big_price');
    a.innerHTML = JSON.parse(data).data.email;
    b.innerHTML = '¥'+JSON.parse(data).data.balance/100;
    let c = JSON.parse(data).data.remind_expire;
    let d = JSON.parse(data).data.remind_traffic;
    kaiguan_status['remind_expire'] = c;
    kaiguan_status['remind_traffic'] = d;
    kaiguan('remind_expire',c);
    kaiguan('remind_traffic',d);
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
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
    let a = JSON.parse(data).data.telegram_discuss_link;
    let b = document.getElementById('jiaru_telegram');
    let c = 'javascript:window.location.href ="'+a+'"';
    b.setAttribute('onclick',c)
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}

//设置开关函数
function kaiguan(id,type) {
  let a = document.getElementById(id);
  if(type == '0'){
    a.setAttribute('class','geren_kaiguan_guan');
    console.log(a.childNodes);
    a.childNodes[1].setAttribute('class','geren_kaiguan_qiu_guan');
  }
  else {
    a.setAttribute('class','geren_kaiguan');
    console.log(a.childNodes);
    a.childNodes[1].setAttribute('class','geren_kaiguan_qiu');
  }
}


/*提交切换开关*/
function qiehuankaiguan(zhi){
  let mode = 'POST';
  let link = domain+'/api/v1/user/update';
  var params = {};
  if (zhi == 'remind_expire'){
    if(kaiguan_status[zhi]=='0'){
      params = {remind_expire : '1'}
    }
    else {
      params = {remind_expire : '0'}
    }
  }
  if (zhi == 'remind_traffic'){
    console.log('流量开关');
    if(kaiguan_status[zhi]=='0'){
      params = {remind_traffic : '1'}
    }
    else {
      params = {remind_traffic : '0'}
    }
  }
  console.log(params);
  tanjiazai();
  jsonlink(mode,link,params,responseqiehuankaiguan);
  
}

/*响应切换开关*/
function responseqiehuankaiguan(code,data){
  if (code == '200') {
    tan('right','操作成功');
    getinfo();
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


/*请求重置接口*/
function resetconfig(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/resetSecurity';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responseresetconfig);
}

/*响应个人信息*/
function responseresetconfig(code,data){
  if (code == '200') {
    tan('right','重置成功');
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}
//打开密码窗口
function openmima() {
  let a = document.getElementById('xiugaimima');
  a.style.display = 'flex';
}

//关闭密码窗口
function closemima() {
  let a = document.getElementById('xiugaimima');
  a.style.display = 'none';
}



/*确认修改密码*/
function querenxiugai(zhi){
  let mode = 'POST';
  let link = domain+'/api/v1/user/changePassword';
  var a = document.getElementById('oldmima');
  var b = document.getElementById('newmima');
  var c = document.getElementById('repetnewmima');
  if ( b.value != c.value) {
      tan('cuowu','两次输入的密码不一致');
  }
  else {
    let params = {
      old_password : a.value,
      new_password : b.value
    }
    tanjiazai();
    jsonlink(mode,link,params,responsequerenxiugai);
  }
}

/*响应修改密码*/
function responsequerenxiugai(code,data){
  if (code == '200') {
    tan('right','密码修改成功');
    closemima();
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
