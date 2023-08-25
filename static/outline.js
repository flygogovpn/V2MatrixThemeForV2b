/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    getSubscribe();
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

/*请求订阅地址接口*/
function getSubscribe(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/getSubscribe';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responseSubscribe);
}

/*响应订阅地址信息*/
function responseSubscribe(code,data){
  if (code == '200') {
    canceltanjiazai();
    getbase64(JSON.parse(data).data.subscribe_url);
  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}

/*获取Base64*/
function getbase64(url){
  let mode = 'GET';
  let link = url;
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responsebase64);
}

/*解析BASE信息*/
function responsebase64(code,data){
  if (code == '200') {
    let aa = document.getElementById('outline_down');
    aa.innerHTML = '';
    canceltanjiazai();
    let a = Base64.decode(data);
    let b = a.split('\n');
    b.pop();
    if (b == ''){
      let queshengbox = document.createElement('div');
      let queshengtu = document.createElement('img');
      queshengbox.setAttribute('class','queshengtu-box');
      queshengtu.setAttribute('src','./img/queshengtu.png');
      queshengtu.setAttribute('class','queshengtu');
      let fatherdiv = document.getElementById('outline_down');
      queshengbox.appendChild(queshengtu);
      fatherdiv.appendChild(queshengbox);
    }
    for (x in b) {
      let c = document.createElement('div');
      c.setAttribute('class','outline_box');
      let d = document.createElement('p');
      d.setAttribute('class','download_box_title');
      d.innerHTML = decodeURIComponent(b[x].split('#')[1]);
      let e = document.createElement('div');
      e.setAttribute('class','outline_box_right');
      let f = document.createElement('img');
      f.setAttribute('class','outline_box_img');
      f.setAttribute('src','./img/xinhao.svg');
      let g = document.createElement('p');
      g.setAttribute('class','outline_box_content');
      g.innerHTML = '空闲';
      let h = document.createElement('a');
      h.setAttribute('class','outline_box_link');
      //h.setAttribute('href',b[x].split('#')[0]);
      h.setAttribute('href',b[x]);
      h.setAttribute('onclick',"copyhref(this.href)");
      h.innerHTML = '复制链接';
      c.appendChild(d);
      e.appendChild(f);
      e.appendChild(g);
      e.appendChild(h);
      c.appendChild(e);
      i = document.getElementById('outline_down');
      i.appendChild(c);
    }

  }
  else {
    tan('cuowu','当前网络不稳定,请刷新页面重试');
    canceltanjiazai();
  }
}

// Base64 编解码
let Base64 = {
encode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
},
decode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
}

function copyhref(href){
  copy(href);
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
