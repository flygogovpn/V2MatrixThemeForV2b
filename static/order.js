/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    getorder();
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

/*请求订单接口*/
function getorder(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/order/fetch';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responseorder);
}

var zhouqi = {
  'month_price':'月付',
  'quarter_price':'季付',
  'half_year_price':'半年付',
  'year_price':'年付',
  'two_year_price':'两年付',
  'three_year_price':'三年付',
  'onetime_price':'一次性',
  'reset_price':'重置'
};
var zhuangtai = {
  '1':'开通中',
  '2':'已取消',
  '3':'已支付',
  '4':'已折抵',
  '0':'未支付'
};
/*响应订单接口*/
function responseorder(code,data){
  if (code == '200') {
    let aaa = document.getElementById('order_down');
    aaa.innerHTML = '';
    let a = JSON.parse(data).data;
    var j = document.getElementById('order_down');
    j.innerHTML = '';
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
      let h = document.createElement('p');
      h.setAttribute('class','order_box_name');
      let i = document.createElement('button');
      i.setAttribute('class','order_box_cancel');
      c.innerHTML = a[x].trade_no;
      c.setAttribute('href','./order_detail.html?orderid='+a[x].trade_no);
      d.innerHTML = a[x].plan.name;
      d.style.width = '100px';
      e.innerHTML = zhouqi[a[x].period];
      f.innerHTML = '¥'+a[x].total_amount/100;
      f.style.width = '40px';
      g.innerHTML = zhuangtai[a[x].status];
      h.innerHTML = getshijian(a[x].created_at);
      i.innerHTML = '取消';
      if(a[x].status == '0'){
        i.setAttribute('onclick','cancelorder(this.value)');
        i.setAttribute('value',a[x].trade_no);
      }
      else 
      {
        i.style.color = '#D8D8D8';
      }
      if (a[x].status == '0'){
        g.style.color = '#E02020';
      } 
      else if (a[x].status == '2'){
        g.style.color = '#D8D8D8';
      } 
      b.appendChild(c);
      b.appendChild(d);
      b.appendChild(e);
      b.appendChild(f);
      b.appendChild(g);
      b.appendChild(h);
      b.appendChild(i);
  
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



/*取消订单接口*/
function cancelorder(ordernumber){
  let mode = 'POST';
  let link = domain+'/api/v1/user/order/cancel';
  console.log(ordernumber);
  let params = {
    trade_no : ordernumber
  }
  console.log(params);
  tanjiazai();
  jsonlink(mode,link,params,responsecancelorder);
}

/*响应取消订单接口*/
function responsecancelorder(code,data){
  if (code == '200') {
    tan('right','取消成功');
    getorder();
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

