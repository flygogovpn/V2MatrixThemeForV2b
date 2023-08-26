/*启动检测与页面初始化localStorage*/
function bootcheck(){
  let a = localStorage.getItem('authorization');
  if(a) {
    getinfo();
    getSubscribe()
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

/*请求订阅地址接口*/
function getSubscribe(){
  let mode = 'GET';
  let link = domain+'/api/v1/user/getSubscribe';
  let params = '';
  tanjiazai();
  jsonlink(mode,link,params,responseSubscribe);
}

/*响应订阅地址信息*/
var subscribe_dict = {};
function responseSubscribe(code,data){
  if (code == '200') {
    console.log(JSON.parse(data).data.subscribe_url);
    let a = JSON.parse(data).data.subscribe_url;
    let aa = encodeURIComponent(JSON.parse(data).data.subscribe_url);//URLencode的地址
    let b = 'flygogo飞狗加速器';
    let bb = encodeURIComponent('flygogo飞狗加速器');
    let c = 'clash://install-config?url='+a+'&name='+b; //ClashX
    let d = 'clash://install-config?url='+aa+'&name='+bb; //clash for windows
    let e = 'clash://install-config?url='+aa+'&name='+bb; //clash for android
    let f = 'surge:///install-config?url='+aa+'&name='+bb; //surfboard for android
    let g = 'surge:///install-config?url='+aa+'&name='+bb; //surge for ios
    let h = 'stash://install-config?url='+aa+'&name='+bb; //stash for ios
    let i = 'quantumult-x:///update-configuration?remote-resource=%7B%22server_remote%22%3A%5B%22'+a+'%2C%20tag%3D'+bb+'%22%5D%7D';//QX for ios
    let j = Base64.encode(a+'&flag=shadowrocket');
    let k = 'shadowrocket://add/sub://'+j+'?remark='+bb; //小火箭
    subscribe_dict['clashx'] = c;
    subscribe_dict['clashwindows'] = d;
    subscribe_dict['clashandroid'] = e;
    subscribe_dict['surfboard'] = f;
    subscribe_dict['surge'] = g;
    subscribe_dict['stash'] = h;
    subscribe_dict['qx'] = i;
    subscribe_dict['shadowsrocket'] = k;
    subscribe_dict['base64'] = a;
    console.log(subscribe_dict);
    canceltanjiazai();
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

//复制base64
function copybase64(appname){
  let a = subscribe_dict[appname];
  copy (a);
  tan('right','已复制成功');
}
//打开qrcode
function openqrcode(){
  console.log('daoh');
  new QRCode(document.getElementById('qrcode'), subscribe_dict['base64']);
  let a = document.getElementById('tan-qrcode-zhezhao');
  a.style.display = 'block';
}

//隐藏qrcode
function closeqrcode(){
  let a = document.getElementById('tan-qrcode-zhezhao');
  a.style.display = 'none';
  let b = document.getElementById('qrcode');
  b.innerHTML = '';
}

//导入三方应用base64
function daoruapp(appname){
  let a = subscribe_dict[appname];
  window.location.href = a;
}