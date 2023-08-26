function bootcheck(){
  let a = localStorage.getItem('authorization');
  let b = window.location.href;
  let c = b.split('?');
  if(c[1]){
    let d = c[1].split('&');
    for(x in d)
      {
        let e = d[x].split('=');
        canshu[e[0]]=e[1];
      }
  }
  if(canshu['register']){
    let e = document.getElementById('inviteforce');
    e.value = canshu['register'];
    e.setAttribute('disabled','disabled');
    gobox('regbox');
    buildrequest();
  } 
  else if(canshu['out_trade_no']){
    getzhifu();
    let paybox = document.getElementById('payfinish');
    let loginbox = document.getElementById('loginbox');
    loginbox.style.display = 'none';
    paybox.style.display = 'flex';
  }
  else if(a){
    window.location.href='./homepage.html';
  }
  console.log(canshu);
}
var canshu = {};
/*支付订单*/
function getzhifu(){
  let a = document.getElementById('dingdanhao');
  a.innerHTML = canshu['out_trade_no'];
  let b = document.getElementById('dingdanjine');
  b.innerHTML = '¥'+canshu['money'];
}
/*提示信息弹窗*/
function tan(mode,text){
    if(mode=='right'){
      let a = document.getElementById('tanright');
      a.setAttribute('style','!display:block');
      let b = document.createTextNode(text);
      a.appendChild(b);
      setTimeout(canceltan,1500,mode);
    }
    else {
      let c = document.getElementById('tancuowu');
      c.setAttribute('style','!display:block');
      let d = document.createTextNode(text);
      c.appendChild(d);
      setTimeout(canceltan,1500,mode);
    }
 }
 /*关闭信息弹窗*/
function canceltan(mode){
  if(mode=='right'){
      let a = document.getElementById('tanright');
      a.style.display=  'none';
      a.innerHTML='';
    }
    else {
      let c = document.getElementById('tancuowu');
      c.style.display=  'none';
      c.innerHTML='';
    }
} 

 /*加载信息弹窗*/
function tanjiazai(){
    let a  = document.getElementById('tanjiazai');
    a.setAttribute('style','!display:block')
}
 /*关闭加载信息弹窗*/
function canceltanjiazai(){
    let a  = document.getElementById('tanjiazai');
    a.style.display=  'none';
} 

 /*切换页面*/
function gobox(mode){
    let a = document.getElementById('loginbox');
    let b = document.getElementById('regbox');
    let c = document.getElementById('forgotbox');
    if(mode == 'regbox'){
      a.style.display = 'none'
      b.style.display = 'flex'
      c.style.display = 'none'
    }
    else if(mode == 'forgot'){
      a.style.display = 'none'
      b.style.display = 'none'
      c.style.display = 'flex'
    }
    else{
      a.style.display = 'flex'
      b.style.display = 'none'
      c.style.display = 'none'
    }
  }

  /*域名*/
 var domain = "";
  /*请求登录接口*/
function regrequest(){
    let mode = 'POST';
    let link = domain+'/api/v1/passport/auth/login';
    a = document.getElementById('regusername');
    b = document.getElementById('regpassword');
    if (a.value == '' || b.value == ''){
      tan('cuowu','请完整输入邮箱与密码后,再点击登录');
    }
    else {
      let params = {
        email : a.value,
        password : b.value
      }
      console.log(params);
      jsonlink(mode,link,params,regresonse);
      tanjiazai();
    }
}
  
/*登录接口操作*/
function regresonse(code,data){
    var xx = JSON.parse(data).errors;
    if (code == '200') {
      tan('right','登录成功');
      canceltanjiazai();
      console.log(JSON.parse(data).data.auth_data);
      localStorage.setItem('authorization',JSON.parse(data).data.auth_data);
      window.location.href='./homepage.html';
    }
    else if(code == '500'){
      tan('cuowu',JSON.parse(data).message);
      console.log(JSON.parse(data).message);
      canceltanjiazai();
    }
    else if(code == '422'){
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
 
/*请求构建注册页接口*/
function buildrequest(){
    let mode = 'GET';
    let link = domain+'/api/v1/guest/comm/config';
    console.log(link);
    params1 = '';
    jsonlink(mode,link,params1,buildregpage);
    tanjiazai();
}

/*构建注册页面*/
var is_email_whitelist_force; //是否邮件白名单
var is_recaptcha; //是否验证recaptcha
var is_email_verify; //是否验证邮箱
var is_invite_force;//是否强制邀请
function buildregpage(code,data){
    if (code == '200') {
      is_email_verify = JSON.parse(data).data.is_email_verify;
      is_invite_force = JSON.parse(data).data.is_invite_force;
      email_whitelist_suffix = JSON.parse(data).data.email_whitelist_suffix;
      is_recaptcha = JSON.parse(data).data.is_recaptcha;
      a = document.getElementById('emailcode');
      b = document.getElementById('inviteforce');
      c = document.getElementById('emaillistbox');
      d = document.getElementById('emailinput');
      if (is_email_verify == '1') {
        a.style.display = 'flex';
      } else {
        a.style.display = 'none';
      }
      if (is_invite_force == '1'){
        b.setAttribute('placeholder','请输入邀请码(必填)');
      } else {
        b.setAttribute('placeholder','请输入邀请码(选填)');
      }
      if (email_whitelist_suffix != '0'){
        c.style.display = 'block';
        d.setAttribute('class','inputbox-reg');
        c.innerHTML = '';
        for (x in email_whitelist_suffix){
          console.log(email_whitelist_suffix[x]);
          c_child = document.createElement("option");
          c_child.innerHTML = '@'+email_whitelist_suffix[x];
          c.appendChild(c_child);
          is_email_whitelist_force = '1';//代表强制白名单
        }
      } else if(email_whitelist_suffix == '0') {
        c.style.display = 'none';
        d.setAttribute('class','inputbox-reg-no');
        is_email_whitelist_force = '0';//代表不强制
      }
      canceltanjiazai();
    }
    else {
      tan('cuowu','当前网络不佳请您刷新页面后重试');
      canceltanjiazai();
    }
}


/*请求获取验证码*/
function emailrequest(){
    let mode = 'POST';
    let link = domain+'/api/v1/passport/comm/sendEmailVerify';
    let a = document.getElementById('emailinput');
    let b = document.getElementById('tanrecaptcha_email');

    if (a.value == ''){
      tan('cuowu','请输入邮箱后再获取验证码');
    }
    else if (is_already_onload_recaptcha == null && is_recaptcha == '1'){
      tan('cuowu','请等待页面加载完毕 或 刷新页面后重试');
    }
    else if(is_recaptcha == '1' && recaptcha_token_email == null){
      b.style.display = 'flex';
    }
    else {
      let params = new Object;
      params = {email : a.value};
      if(is_email_whitelist_force == '1'){
        let c = document.getElementById('emaillistbox');
        let index = c.selectedIndex;
        let d = c.options[index].text;
        params.email = a.value+d;
      }
      if(is_recaptcha == '1'){
        params.recaptcha_data = recaptcha_token_email;
      }
      console.log(params);
      jsonlink(mode,link,params,emailresponse);
      tanjiazai();
    }
  }

/*验证码响应操作*/
function emailresponse(code,data){
  let xx = JSON.parse(data).errors;
  if (code == '200'){
    tan('right','请前往邮箱查看验证码');
    canceltanjiazai();
    yanzhengtime();
    grecaptcha.reset(widgetId1);
    recaptcha_token_email = null;

  }
  else if (code == '500'){
    tan('cuowu',JSON.parse(data).message);
    canceltanjiazai();
    grecaptcha.reset(widgetId1);
    recaptcha_token_email = null;
  }
  else if (code == '422')
  {
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
    grecaptcha.reset(widgetId1);
    recaptcha_token_email = null;
  }
  else {
    tan('cuowu','当前网络不佳请您刷新页面后重试');
    canceltanjiazai();
    grecaptcha.reset(widgetId1);
    recaptcha_token_email = null;
  }
}
  
/*网络请求*/
function jsonlink(mode,link,params,callback){
    var xmlHttp = new XMLHttpRequest;
    //let requesetjson;
    xmlHttp.open(mode,link,true);
    if(mode == 'POST'){
      xmlHttp.setRequestHeader('content-type','application/json');
      xmlHttp.send(JSON.stringify(params));
    }
    else {
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



/*验证码到计时*/
var emailtime = 60;
var jishi = null;
function yanzhengtime() {
    let a = document.getElementById('emailbutton');
    if (emailtime > 0){
      a.innerHTML = emailtime+'S';
      emailtime = emailtime - 1;
      a.setAttribute('onclick','');
      jishi  = setTimeout(yanzhengtime,1000);
    }
    else {
      a.innerHTML = '获取验证码';
      emailtime = 60;
      a.setAttribute('onclick','emailrequest()');
      clearTimeout(jishi);
      console.log('执行到了这里验证吗');
    }
}


/*请求注册接口*/
function zhucerequest(){
    let mode = 'POST';
    let link = domain+'/api/v1/passport/auth/register';
    let a = document.getElementById('emailinput');
    let b = document.getElementById('emailverify');
    let c = document.getElementById('regpd');
    let d = document.getElementById('reregpd');
    let e = document.getElementById('inviteforce');
    let f = document.getElementById('tanrecaptcha_reg');

    if (a.value == '' || c.value == ''|| d.value == ''){
      tan('cuowu','请完整输入全部信息,再点击注册');
    } 
    else if(is_email_verify == '1' && b == '') {
      tan('cuowu','请输入验证码再注册');
    }
    else if(is_invite_force == '1' && e == '') {
      tan('cuowu','请输入邀请码再注册');
    }
    else if(c.value != d.value) {
      tan('cuowu','两次输入的密码不一致');
    }
    else if(is_recaptcha == '1' && recaptcha_token_reg == null ) {
      f.style.display = 'flex';
    }

    else {
      let params = new Object;
      params = {
        email : a.value,
        password : c.value
      }
      if (is_email_verify == '1') {
        params.email_code = b.value;
      }
      if (is_invite_force == '1') {
        params.invite_code = e.value;
      }
      if (is_recaptcha == '1') {
        params.recaptcha_data = recaptcha_token_reg;
      }
      if (is_email_whitelist_force == '1') {
        let aa = document.getElementById('emaillistbox');
        let index = aa.selectedIndex;
        let dd = aa.options[index].text;
        params.email = a.value+dd;
      }
      console.log(params);
      jsonlink(mode,link,params,zhucerespons);
      tanjiazai();
    }
}

/*注册接口响应*/
function zhucerespons(code,data){
  let xx = JSON.parse(data).errors;
  if (code == '200'){
    tan('right','注册成功');
    canceltanjiazai();
    grecaptcha.reset(widgetId2);
    recaptcha_token_reg = null;
    console.log(JSON.parse(data).data.auth_data);
    localStorage.setItem('authorization',JSON.parse(data).data.auth_data);
    window.location.href='./homepage.html';
  }
  else if (code == '500'){
    tan('cuowu',JSON.parse(data).message);
    canceltanjiazai();
    grecaptcha.reset(widgetId2);
    recaptcha_token_reg = null;
  }
  else if (code == '422')
  {
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
    grecaptcha.reset(widgetId2);
    recaptcha_token_reg = null;
  }
  else {
    tan('cuowu','当前网络不佳请您刷新页面后重试');
    canceltanjiazai();
    grecaptcha.reset(widgetId2);
    recaptcha_token_reg = null;
  }
}


/* 创建 recaptcha 回调*/
var widgetId1;
var widgetId2;
var widgetId3;
var is_already_onload_recaptcha = null;
var onloadCallback = function() {
  widgetId1 = grecaptcha.render('recap1',{
    'sitekey':'6LfaHFojAAAAAEE8dC-H2mfn-W4MAr2mVFvlQ0Cw',
    'callback':verifyCallback_email
  });
  widgetId2 = grecaptcha.render('recap2',{
    'sitekey':'6LfaHFojAAAAAEE8dC-H2mfn-W4MAr2mVFvlQ0Cw',
    'callback':verifyCallback_reg
  });
  widgetId3 = grecaptcha.render('recap3',{
    'sitekey':'6LfaHFojAAAAAEE8dC-H2mfn-W4MAr2mVFvlQ0Cw',
    'callback':verifyCallback_forgot
  });
  console.log('加载完毕被回调了');
  is_already_onload_recaptcha = 1;
}

/* 创建 recaptcha 邮件*/
var recaptcha_token_email = null;
var verifyCallback_email = function(response) {
  recaptcha_token_email = response;
  console.log('已经赋值给token了');
  emailrequest();
  var a = document.getElementById('tanrecaptcha_email');
  a.style.display = 'none';
}

/* 创建 recaptcha 注册*/
var recaptcha_token_reg = null;
var verifyCallback_reg = function(response) {
  recaptcha_token_reg = response;
  console.log('已经赋值给token了');
  zhucerequest();
  var a = document.getElementById('tanrecaptcha_reg');
  a.style.display = 'none';
}

/* 创建 recaptcha 忘记密码*/
var recaptcha_token_forgot = null;
var verifyCallback_forgot = function(response) {
  recaptcha_token_forgot = response;
  console.log('已经赋值给token了');
  emailrequest_forgot();
  var a = document.getElementById('tanrecaptcha_email_forgot');
  a.style.display = 'none';
}

function closeemail() {
  let a = document.getElementById('tanrecaptcha_email');
  a.style.display = 'none';
} 
function closereg() {
  let a = document.getElementById('tanrecaptcha_reg');
  a.style.display = 'none';
} 
function closeforgot() {
  let a = document.getElementById('tanrecaptcha_email_forgot');
  a.style.display = 'none';
} 

/*请求获取验证码-忘记密码*/
function emailrequest_forgot(){
  let mode = 'POST';
  let link = domain+'/api/v1/passport/comm/sendEmailVerify';
  let a = document.getElementById('forgotemail');
  let b = document.getElementById('tanrecaptcha_email_forgot');

  if (a.value == ''){
    tan('cuowu','请输入邮箱后再获取验证码');
  }
  else if (is_already_onload_recaptcha == null && is_recaptcha == '1'){
    tan('cuowu','请等待页面加载完毕 或 刷新页面后重试');
  }
  else if(is_recaptcha == '1' && recaptcha_token_forgot == null){
    b.style.display = 'flex';
  }
  else {
    let params = new Object;
    params = {email : a.value};
    if(is_recaptcha == '1'){
      params.recaptcha_data = recaptcha_token_forgot;
    }
    console.log(params);
    jsonlink(mode,link,params,emailresponse_forgot);
    tanjiazai();
  }
}

/*响应获取验证码-忘记密码*/
function emailresponse_forgot(code,data){
  let xx = JSON.parse(data).errors;
  if (code == '200'){
    tan('right','请前往邮箱查看验证码');
    canceltanjiazai();
    yanzhengtime_forgot();
    grecaptcha.reset(widgetId3);
    recaptcha_token_forgot = null;

  }
  else if (code == '500'){
    tan('cuowu',JSON.parse(data).message);
    canceltanjiazai();
    grecaptcha.reset(widgetId3);
    recaptcha_token_forgot = null;
  }
  else if (code == '422')
  {
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
    grecaptcha.reset(widgetId3);
    recaptcha_token_forgot = null;
  }
  else {
    tan('cuowu','当前网络不佳请您刷新页面后重试');
    canceltanjiazai();
    grecaptcha.reset(widgetId3);
    recaptcha_token_forgot = null;
  }
}

/*验证码到计时忘记密码界面*/
function yanzhengtime_forgot() {
    let a = document.getElementById('forgotemailbutton');
    if (emailtime > 0){
      a.innerHTML = emailtime+'S';
      emailtime = emailtime - 1;
      a.setAttribute('onclick','');
      jishi  = setTimeout(yanzhengtime_forgot,1000);
    }
    else {
      a.innerHTML = '获取验证码';
      emailtime = 60;
      a.setAttribute('onclick','emailrequest_forgot()');
      clearTimeout(jishi);
      console.log('执行到了这里验证吗');
    }
}

/*请求重置密码的接口*/
function forgotrequest(){
  let mode = 'POST';
  let link = domain+'/api/v1/passport/auth/forget';
  let a = document.getElementById('forgotemail');
  let b = document.getElementById('forgotemailcode');
  let c = document.getElementById('forgotemailpd');
  let d = document.getElementById('forgotemailrepd');

  if (a.value == '' || c.value == ''|| d.value == ''|| b.value == ''){
    tan('cuowu','请完整输入全部信息,再点击重置');
  } 
  else if(c.value != d.value) {
    tan('cuowu','两次输入的密码不一致');
  }
  else {
    let params = new Object;
    params = {
      email : a.value,
      password : c.value,
      email_code : b.value
    }
    console.log(params);
    jsonlink(mode,link,params,forgotrespons);
    tanjiazai();
  }
}

/*响应重置密码的接口*/
function forgotrespons(code,data){
  let xx = JSON.parse(data).errors;
  if (code == '200'){
    tan('right','重置密码成功,请返回登录');
    canceltanjiazai();
  }
  else if (code == '500'){
    tan('cuowu',JSON.parse(data).message);
    canceltanjiazai();
  }
  else if (code == '422')
  {
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