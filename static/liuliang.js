/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    getjilu();
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

/*请求流量记录接口*/
function getjilu(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/stat/getTrafficLog';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responsegetjilu);
}


/*响应订单接口*/
function responsegetjilu(code,data){
  if (code == '200') {
    let a = JSON.parse(data).data;
    let jj = document.getElementById('order_down');
    jj.innerHTML = '';
    if (a == ''){
      console.log(a);
      let queshengbox = document.createElement('div');
      let queshengtu = document.createElement('img');
      queshengbox.setAttribute('class','queshengtu-box');
      queshengtu.setAttribute('src','./img/queshengtu.png');
      queshengtu.setAttribute('class','queshengtu');
      let fatherdiv = document.getElementById('order_down');
      queshengbox.appendChild(queshengtu);
      fatherdiv.appendChild(queshengbox);
    }

    for (x in a ){
      let b = document.createElement('div');
      b.setAttribute('class','order_box');
      let c = document.createElement('a');
      c.setAttribute('class','order_box_trade');
      let d = document.createElement('p');
      d.setAttribute('class','order_box_name');
      let e = document.createElement('p');
      e.setAttribute('class','order_box_zhouqi');
      let f = document.createElement('p');
      f.setAttribute('class','order_box_name');
      let g = document.createElement('p');
      g.setAttribute('class','order_box_zhuangtai');
  
      c.innerHTML = getshijian(a[x].record_at);
      d.innerHTML = '上行:'+(a[x].u/1024/1024/1024).toFixed(2)+'GB';
      e.innerHTML = a[x].server_rate+'X';
      f.innerHTML = '下行:'+(a[x].d/1024/1024/1024).toFixed(2)+'GB';
      g.innerHTML = '合计:'+(a[x].d/1024/1024/1024+a[x].u/1024/1024/1024).toFixed(2)+'GB';

      b.appendChild(c);
      b.appendChild(d);
      b.appendChild(e);
      b.appendChild(f);
      b.appendChild(g);
      let j = document.getElementById('order_down');
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
  return y + '/' + MM + '/' + d;
}




