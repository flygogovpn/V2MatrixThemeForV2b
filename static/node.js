/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    getserver();
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

/*请求节点信息接口*/
function getserver(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/server/fetch';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responseserver);
}




/*响应订阅地址信息*/
function responseserver(code,data){ 
  if (code == '200') {
    let aa = document.getElementById('node_down');
    aa.innerHTML = '';
    let a = JSON.parse(data).data;
    if (a == ''){
      console.log(a);
      let queshengbox = document.createElement('div');
      let queshengtu = document.createElement('img');
      queshengbox.setAttribute('class','queshengtu-box');
      queshengtu.setAttribute('src','./img/queshengtu.png');
      queshengtu.setAttribute('class','queshengtu');
      let fatherdiv = document.getElementById('node_down');
      queshengbox.appendChild(queshengtu);
      fatherdiv.appendChild(queshengbox);
    }
    for (x in a ){
      let b = document.createElement('div');
      b.setAttribute('class','node_box');
      let c = document.createElement('p');
      c.setAttribute('class','node_box_title');
      let d = document.createElement('img');
      d.setAttribute('class','node_box_status');
      let e = document.createElement('p');
      e.setAttribute('class','node_box_rate');
      let f = document.createElement('p');
      f.setAttribute('class','node_box_tag');
      c.innerHTML = a[x].name;
      e.innerHTML = a[x].rate+'X';
      f.innerHTML = a[x].tags;
      let ts  = Math.round(new Date().getTime()/1000).toString();
      console.log(ts - a[x].last_check_at);
      if (ts -  a[x].last_check_at < 300) {
        d.setAttribute('src','./img/zhengchang.svg')
      }
      else {
        d.setAttribute('src','./img/cuowu.svg')
      }
      b.appendChild(c);
      b.appendChild(d);
      b.appendChild(e);
      b.appendChild(f);
      let g = document.getElementById('node_down');
      g.appendChild(b);
    }
    canceltanjiazai();
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}

