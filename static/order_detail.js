/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    chushihua();
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
    //xmlHttp.setRequestHeader('content-type','application/x-www-form-urlencoded');
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

/*网络请求*/
function jsonlinkform(mode,link,params,callback){
  var auth = localStorage.getItem('authorization');
  var xmlHttp = new XMLHttpRequest;
  //let requesetjson;
  xmlHttp.open(mode,link,true);
  if(mode == 'POST'){
    //xmlHttp.setRequestHeader('content-type','application/json');
    xmlHttp.setRequestHeader('content-type','application/x-www-form-urlencoded');
    xmlHttp.setRequestHeader('authorization',auth);
    xmlHttp.send();
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

/*请求订单详情接口*/

function getdingdandetail(planid){
  let mode = 'GET';
  let link = domain+'/api/v1/user/order/detail?trade_no='+planid;
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responsegetdingdandetail);
}

/*响应订单详情信息*/
function responsegetdingdandetail(code,data){
  if (code == '200') {
    let a = document.getElementById('jihuamingcheng');
    a.innerHTML = JSON.parse(data).data.plan.name;
    let b = document.getElementById('jihuazhouqileixing');
    b.innerHTML = zhouqi[JSON.parse(data).data.period];
    let c = document.getElementById('jihualiuliang');
    c.innerHTML = JSON.parse(data).data.plan.transfer_enable + 'GB';
    let d = document.getElementById('jiahuadingdanhao');
    d.innerHTML = JSON.parse(data).data.trade_no;
    let e = document.getElementById('jiahuachuangjianshijian');
    e.innerHTML = getshijian(JSON.parse(data).data.created_at);
    let f = document.getElementById('tijiaozongjine');
    f.innerHTML = '¥'+(JSON.parse(data).data.total_amount/100).toFixed(2);
    let aa = document.getElementById('jiagewushouxufei');
    aa.innerHTML = '¥'+(JSON.parse(data).data.total_amount/100).toFixed(2);

    var price_group = {
      handling_amount : JSON.parse(data).data.handling_amount,
      discount_amount : JSON.parse(data).data.discount_amount,
      surplus_amount : JSON.parse(data).data.surplus_amount,
      balance_amount : JSON.parse(data).data.balance_amount,
      refund_amount : JSON.parse(data).data.refund_amount
    }

    for (x in price_group) {
      if (price_group[x] != null){
        let g = document.createElement('div');
        g.setAttribute('class','jiahuaneirong_group');
        let h = document.createElement('p');
        h.setAttribute('class','jiahuaneirong_des');
        h.innerHTML = jinemingcheng[x];
        let i = document.createElement('p');
        i.setAttribute('class','jiahuaneirong_des');
        i.innerHTML = '¥'+(price_group[x]/100).toFixed(2);
        i.setAttribute('id',x);
        g.appendChild(h);
        g.appendChild(i);
        console.log(g);
        let j = document.getElementById('zhifujine_group');
        let k = document.getElementById('zhifujine_zongji');
        j.insertBefore(g,k);
      }
    }

    let bb = document.getElementById('closeorder');
    bb.setAttribute('value',JSON.parse(data).data.trade_no);
    let cc = JSON.parse(data).data.status;
    let dd = document.getElementById('gotopaybutton');
    let ee = document.getElementById('status_group_id');
    let ff = document.getElementById('status_1');
    let gg = document.getElementById('status_2');
    let hh = document.getElementById('status_3');
    let ii = document.getElementById('status_4'); 
    if (cc == '0') {
      bb.style.display = 'block';
      huoquzhifu();
      trade_no_for_check  =JSON.parse(data).data.trade_no;
      setInterval(checkstatus, 5000);
    }
    else if(cc == '1'){
      ee.style.display = 'block';
      ff.style.display = 'flex';
      bb.style.display = 'none';
      dd.style.display = 'none';
    }
    else if(cc == '2'){
      ee.style.display = 'block';
      gg.style.display = 'flex';
      bb.style.display = 'none';
      dd.style.display = 'none';
    }
    else if(cc == '3'){
      ee.style.display = 'block';
      hh.style.display = 'flex';
      bb.style.display = 'none';
      dd.style.display = 'none';
    }
    else {
      ee.style.display = 'block';
      ii.style.display = 'flex';
      bb.style.display = 'none';
      dd.style.display = 'none';
    }
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
  return y + '-' + MM + '-' + d +' '+ h + ':' +m +':'+s;
}

var jinemingcheng = {
  'handling_amount':'支付手续费',
  'discount_amount':'优惠金额',
  'surplus_amount':'折抵金额',
  'balance_amount':'余额支付',
  'refund_amount':'退款金额'
};
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

//初始化页面
var qidongcanshu = {};
function chushihua(){
  let a = window.location.href;
  let b = a.split('?');
  if(b[1] != null ) {
      let d = b[1].split('=');
      qidongcanshu[d[0]]=d[1];
  }
  else {
    console.log('没有状态');
  }
  getdingdandetail(qidongcanshu['orderid']);
  tijiaocanshu['trade_no'] = qidongcanshu['orderid'];
}






/*请求支付方式*/

function huoquzhifu(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/order/getPaymentMethod';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responsehuoquzhifu);
}

/*响应支付方式信息*/
function responsehuoquzhifu(code,data){
  if (code == '200') {
    let a = JSON.parse(data).data;
    for (x in a){
      let b = document.createElement('div');
      b.setAttribute('class','peizhi_jine_option');
      b.setAttribute('id',a[x].id);
      b.setAttribute('onclick','switchchoose(this.id)');
      let c = document.createElement('img');
      c.setAttribute('class','pay_img');
      c.setAttribute('src',a[x].icon);
      let d = document.createElement('p');
      d.setAttribute('class','peizhi_jine_price');
      d.innerHTML = a[x].name;
      let f = document.createElement('p');
      f.style.display = 'none';
      f.innerHTML = a[x].handling_fee_fixed;
      let g = document.createElement('p');
      g.innerHTML = a[x].handling_fee_percent;
      g.style.display = 'none';
      let e = document.getElementById('shop_peizhi_jine');
      b.appendChild(c);
      b.appendChild(d);
      b.appendChild(f);
      b.appendChild(g);
      e.appendChild(b); 
    }
    switchchoose(a[0].id);
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

var zhifufangshi = [];




function switchchoose(data){
  let paymentgroup_notchoose = document.getElementsByClassName('peizhi_jine_option');
  let paymentgroup_choose = document.getElementsByClassName('peizhi_jine_option_choose');
  for (x in paymentgroup_notchoose){
    if(typeof paymentgroup_notchoose[x] == 'object')
    {
      paymentgroup_notchoose[x].setAttribute('class','peizhi_jine_option');
    }
  }
  if(paymentgroup_choose[0] != null){
    paymentgroup_choose[0].setAttribute('class','peizhi_jine_option');
  }
  let a  = document.getElementById(data);
  tijiaocanshu['method'] = data;
  a.setAttribute('class','peizhi_jine_option_choose');
  let b = document.getElementById('zhifu_shouxufei');
  let j = document.getElementById('zhifujine_group');
  if (b != null){
    j.removeChild(b);
  }

  let total_amount = document.getElementById('jiagewushouxufei').textContent.split('¥')[1];
  console.log(total_amount);
  let shouxufei = (a.children[2].textContent/100+(total_amount*(a.children[3].textContent/100))).toFixed(2);
  console.log(shouxufei);
  let l = document.getElementById('tijiaozongjine');
  console.log(total_amount);
  if (total_amount === '0.00'){
    l.innerHTML = '¥0.00';
  }
  else{
    l.innerHTML = '¥'+(parseFloat(total_amount)+parseFloat(shouxufei)).toFixed(2);
  }
  
  let g = document.createElement('div');
  g.setAttribute('class','jiahuaneirong_group');
  g.setAttribute('id','zhifu_shouxufei');
  let h = document.createElement('p');
  h.innerHTML = '支付手续费';
  h.setAttribute('class','jiahuaneirong_des');
  let i = document.createElement('p');
  i.innerHTML = '¥'+shouxufei;
  i.setAttribute('class','jiahuaneirong_des');
  g.appendChild(h);
  g.appendChild(i);
  let k = document.getElementById('zhifujine_zongji');
  j.insertBefore(g,k);
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
    window.location.href = './order.html';
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

//请求参数
var tijiaocanshu = {
  'method':'',
  'trade_no':''
};

/*提交支付*/
function gotopay(){
  let mode = 'POST';
  let link = domain+'/api/v1/user/order/checkout?trade_no='+tijiaocanshu['trade_no']+'&method='+tijiaocanshu['method'];
  let params = '';
  tanjiazai();
  jsonlinkform(mode,link,params,responsegotopay);
}

/*响应支付*/
function responsegotopay(code,data){
  console.log(data);
  if (code == '200') {
    if(JSON.parse(data).type == -1)
    {
      tan('right','购买成功');
      window.location.href = './order.html';
    }
    if(JSON.parse(data).type == 1)
    {
      tan('right','正在前往收银台');
      window.location.href = JSON.parse(data).data;
    }
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


var trade_no_for_check  =null;
/*定时任务check*/
function checkstatus(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/order/check?trade_no='+trade_no_for_check;
  let params = '';
  jsonlink(mode,link,params,responsecheckstatus);
}

/*响应支付*/
function responsecheckstatus(code,data){
  console.log(data);
  if (code == '200') {
    let a =JSON.parse(data).data;
    if (a != '0'){
      location.reload();
    }
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