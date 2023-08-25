/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    getdingyue();
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
function getdingyue(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/plan/fetch';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responsedingyue);
}

/*响应个人信息*/
function responsedingyue(code,data){
  if (code == '200') {
    let a = JSON.parse(data).data;
    let aa = document.getElementById('shop_timepay');
    let bb = document.getElementById('shop_onetimepay');
    aa.innerHTML = '';
    bb.innerHTML = '';

    for(x in a) {
      if (a[x].onetime_price == null){
        let b = document.createElement('div');
        let c = document.createElement('div');
        c.setAttribute('class','shop_title');
        let d = document.createElement('div');
        d.setAttribute('class','shop_price');
        let e = document.createElement('div');
        e.setAttribute('class','shop_meiyue');
        let f = document.createElement('button');
        f.setAttribute('class','shop_button');
        let g = document.createElement('div');
        g.setAttribute('class','shop_content');
        let h = document.getElementById('shop_timepay');
        
        if(a[x].content.slice(0,4)=='年付特惠'){
          b.setAttribute('class','shop_box_tehui');
          d.innerHTML = '¥'+(a[x].year_price/100/12).toFixed(2);
          d.style.color = '#0360df';
        }
        else {
          b.setAttribute('class','shop_box');
          d.innerHTML = '¥'+(a[x].month_price/100).toFixed(2);
        }
        
        c.innerHTML = a[x].name;
        e.innerHTML = '每月';
        f.setAttribute('value',a[x].id);
        f.innerHTML = '立即购买';
        f.setAttribute('onclick','godingyuepeizhi(this.value)');
        g.innerHTML =a[x].content;
        b.appendChild(c);
        b.appendChild(d);
        b.appendChild(e);
        b.appendChild(f);
        b.appendChild(g);
        h.appendChild(b); 
        console.log('月'+x);
      }
      else {
        let b = document.createElement('div');
        b.setAttribute('class','shop_box');
        let c = document.createElement('div');
        c.setAttribute('class','shop_title');
        let d = document.createElement('div');
        d.setAttribute('class','shop_price');
        let e = document.createElement('div');
        e.setAttribute('class','shop_meiyue');
        let f = document.createElement('button');
        f.setAttribute('class','shop_button');
        let g = document.createElement('div');
        g.setAttribute('class','shop_content');
       
        let i = document.getElementById('shop_onetimepay');
        c.innerHTML = a[x].name;
        d.innerHTML = '$'+(a[x].onetime_price/100/7).toFixed(2);
        e.innerHTML = '一次性';
        f.setAttribute('value',a[x].id);
        f.innerHTML = '立即购买';
        f.setAttribute('onclick','godingyuepeizhi(this.value)');
        g.innerHTML =a[x].content;
        b.appendChild(c);
        b.appendChild(d);
        b.appendChild(e);
        b.appendChild(f);
        b.appendChild(g);
        i.appendChild(b);
        console.log('次'+x);
      } 
    }
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}


//进入到订阅配置页面
function godingyuepeizhi(planid){
    window.location.href='./shop_peizhi.html?planid='+planid;
}