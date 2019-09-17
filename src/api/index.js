import axios from 'axios';
// var baseURL = document.location.origin;  // 获取 url 的域名
// var baseURL = window.location.protocol+"//"+window.location.host; // 获取 url 的域名兼容ie
var baseURL = 'http://test99.yunyikang.cn'; // 测试
// var baseURL="https://www.yunyikang.cn";       // 正式
let http = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  },
  transformRequest: [function (data) {
    if (typeof data === 'object') {
      var newData = '';
      for (var k in data) {
        if (data.hasOwnProperty(k) === true) {
          newData += encodeURIComponent(k) + "=" + encodeURIComponent(data[k]) + "&";
        }
      }
      newData = newData.substr(0, newData.length - 1)
      return newData;
    }
     return data
  }]
});

http.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  if (!response.data.code && response.data.code != 0) {
      window.location.href = '/wechat/err404'
  }
  return response;
}, function (error) {
  errMsg(error)
  return Promise.reject(error);
});

function errMsg (error) {
    if(error && error.response){
      switch (error.response.status){
          case 400:
          console.log('错误请求')
          break
          case 401:
          console.log('未授权，请重新登录')
              break
          case 403:
          console.log('拒绝访问')
              break
          case 404:
          console.log('请求错误,未找到该资源')
              break
          case 405:
          console.log('请求方法未允许')
              break
          case 408:
          console.log('请求超时')
              break
          case 500:
          console.log('服务器端出错')
              break
          case 501:
          console.log('网络未实现')
              break
          case 502:
          console.log('网络错误')
              break
          case 503:
          console.log('服务不可用')
              break
          case 504:
          console.log('网络超时')
              break
          case 505:
          console.log('http版本不支持该请求')
              break
          default:
          console.log(`连接错误${error.response.status}`)
      }
  }else{
    console.log('链接服务器失败')
  }
}

function apiAxios(method, url, params) {
  return new Promise((resolve, reject) => {
    http({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
    }).then(function (res) {
      resolve(res.data);
    }).catch(function (err) {
      reject(err);
    })
  })
}

function timeGet(Url, data) { // 循环掉用的
  var getTimes = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
  });
  getTimes.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
  return new Promise((response, reject) => {
    getTimes.post(Url, data).then(res => {
      response(res.data);
    }).catch(error => {
      reject(error)
    });
  })
}

function $upload(Url, data) {  // formdata
  var instance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  instance.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
  return new Promise((response, reject) => {
    instance.post(Url, data).then(res => {
      response(res.data);
    }).catch(error => {
      reject(error)
    });
  })
}

export default {
  get: function (url, params) {
    return apiAxios('GET', url, params)
  },
  post: function (url, params) {
    return apiAxios('POST', url, params)
  },
  formdata: function (url, datas) {
    return $upload(url, datas)
  },
  put: function (url, params) {
    return apiAxios('PUT', url, params)
  },
  delete: function (url, params) {
    return apiAxios('DELETE', url, params)
  },
  getPost: function (url, params) {
    return timeGet(url, params)
  },
  baseURL: baseURL,
  all: function(arr, response) {
    axios.all(arr).then(
      axios.spread(function(acct, perms) {
        return response(acct, perms);
      })
    );
  },
  axios: function (url, data) {
    return new Promise((res, req) => {
      axios.post(baseURL + url, data).then(s => {
        res(s.data)
      }).catch(e => {
        req(e)
      })
    })
  }
}
