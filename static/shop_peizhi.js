/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    //getdingyue();
    chushihua();
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

/*请求订阅信息接口*/
function getdingyue(planid){
  let mode = 'GET';
  let link = domain+'/api/v1/user/plan/fetch?id='+planid;
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responsedingyue);
}

/*响应订阅信息*/
function responsedingyue(code,data){
  if (code == '200') {
    let a = document.getElementById('shop_peizhi_title');
    a.innerHTML = JSON.parse(data).data.name;
    let b = document.getElementById('shop_peizhi_des');
    b.innerHTML = JSON.parse(data).data.content;
    let jihuamingcheng = document.getElementById('jihuamingcheng');
    jihuamingcheng.innerHTML =JSON.parse(data).data.name;;

    let price_group = {};
    if(JSON.parse(data).data.month_price != null) {price_group['month_price']=JSON.parse(data).data.month_price; }
    if(JSON.parse(data).data.quarter_price != null)  {price_group['quarter_price']=JSON.parse(data).data.quarter_price; }
    if(JSON.parse(data).data.half_year_price != null)  {price_group['half_year_price']=JSON.parse(data).data.half_year_price; }
    if(JSON.parse(data).data.year_price != null)  {price_group['year_price']=JSON.parse(data).data.year_price; }
    if(JSON.parse(data).data.two_year_price != null)  {price_group['two_year_price']=JSON.parse(data).data.two_year_price; }
    if(JSON.parse(data).data.three_year_price != null)  {price_group['three_year_price']=JSON.parse(data).data.three_year_price;}
    if(JSON.parse(data).data.onetime_price != null)  {price_group['onetime_price']=JSON.parse(data).data.onetime_price;}

    let c =  document.getElementById('shop_peizhi_jine');
    if(qidongcanshu['type']=='chongzhi'){  
      let d = document.createElement('div');
      d.setAttribute('class','peizhi_jine_option');
      d.setAttribute('id','reset_price');
      d.setAttribute('onclick','switchchoose(this.id)');
      let e = document.createElement('p');
      e.setAttribute('class','peizhi_jine_name');
      let f = document.createElement('p');
      f.setAttribute('class','peizhi_jine_price');
      e.innerHTML = zhouqi['reset_price'];
      f.innerHTML = '¥'+(JSON.parse(data).data.reset_price/100).toFixed(2);
      d.appendChild(e);
      d.appendChild(f);
      c.appendChild(d);
    }
    else {
      for(var x in price_group)
      {
        let d = document.createElement('div');
        d.setAttribute('class','peizhi_jine_option');
        d.setAttribute('id',x);
        d.setAttribute('onclick','switchchoose(this.id)');
        let e = document.createElement('p');
        e.setAttribute('class','peizhi_jine_name');
        let f = document.createElement('p');
        f.setAttribute('class','peizhi_jine_price');
        e.innerHTML = zhouqi[x];
        f.innerHTML = '¥'+(price_group[x]/100).toFixed(2);
        d.appendChild(e);
        d.appendChild(f);
        c.appendChild(d);
      }
    }
    let dianji = document.getElementsByClassName('peizhi_jine_option')[0];
    dianji.click();
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



//初始化页面
var qidongcanshu ={};

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
function chushihua(){
  let a = window.location.href;
  let b = a.split('?');
  if(b[1] != null ) {
    let c = b[1].split('&');
    for(x in c){
      let d = c[x].split('=');
      qidongcanshu[d[0]]=d[1];
    }
    console.log(qidongcanshu);
  }
  else {
    console.log('没有状态');
  }
  getdingyue(qidongcanshu['planid']);
  tijiaocanshu['plan_id'] = qidongcanshu['planid'] ;
}

//切换选中项
var tijiaocanshu = {
  'plan_id':null,
  'period':null,
  'coupon_code':null
};


function switchchoose(data){
  for (x in zhouqi){
    let b = document.getElementById(x);
    if (b != null){
      b.setAttribute('class','peizhi_jine_option');
    }
  }
  let a  = document.getElementById(data);
  a.setAttribute('class','peizhi_jine_option_choose');
  let b = a.children[1].textContent.split('¥')[1];
  tijiaocanshu['period'] = data;
  let c = document.getElementById('fukuanzhouqi');
  c.innerHTML = '¥'+b;

  let d = document.getElementById('zongjijinebig');
  if (youhuiquan['type'] == '1'){
    d.innerHTML ='¥'+(b-(youhuiquan['value']/100)).toFixed(2);
  }
  else if (youhuiquan['type'] == '2'){
    d.innerHTML ='¥'+(b*((100-youhuiquan['value'])/100)).toFixed(2);
  }
  else {
    d.innerHTML ='¥'+ b;
  }
}



/*请求检查优惠券信息接口*/
function checkyouhui(){
  let mode = 'POST';
  let link = domain+'/api/v1/user/coupon/check';
  let a = document.getElementById('youhuiquaninput');
  let params = {
    plan_id : tijiaocanshu['plan_id'],
    code : a.value
  };
  tanjiazai();
  jsonlink(mode,link,params,responsecheckyouhui);
}

/*优惠券响应*/
var youhuiquan = {
  'type':null,
  'value':null
}

function responsecheckyouhui(code,data){
  if (code == '200') {
    tan('right','优惠券有效');
    let a = document.getElementById('zhekoushuzihuobili');
    let b = JSON.parse(data).data.type;
    let c = JSON.parse(data).data.value;
    if (b == '1'){
      a.innerHTML = '-¥'+(c/100).toFixed(2);
    }
    else {
      a.innerHTML = c+'%';
    }
    youhuiquan['type'] = b;
    youhuiquan['value'] = c;
    let dianji = document.getElementById(tijiaocanshu["period"]);
    console.log(dianji);
    dianji.click();
    tijiaocanshu['coupon_code'] = JSON.parse(data).data.code;
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

/*提交订单*/
function tijiaodingdan(){
  let mode = 'POST';
  let link = domain+'/api/v1/user/order/save';
  let params = tijiaocanshu;
  tanjiazai();
  jsonlink(mode,link,params,responsetijiaodingdan);
}

/*响应提交订单*/

function responsetijiaodingdan(code,data){
  if (code == '200') {
    tan('right','提交成功');
    let a = JSON.parse(data).data;
    window.location.href = './order_detail.html?orderid='+a;

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
