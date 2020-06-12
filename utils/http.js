/**
 * 请求头
 */
var token = wx.getStorageSync("token")
var expireTime = wx.getStorageSync('expireTime')
const app = getApp()
// var header = {
//   'content-type': 'application/x-www-form-urlencoded',
//   'Authorization': wx.getStorageSync("token"),
// }

const baseUrl = "https://api.didayunyin.com/scp"
/**
 * 供外部post请求调用  
 */

function get_token() {
	console.log("重新获取token")
	wx.login({
		success: res => {
			if (res.code) {
				//发起网络请求
				console.log('code为', res)
				let prams = {
					username: 'wx-' + res.code
				}
				let that = this

				wx.request({
					url: 'https://api.didayunyin.com/scp/user/login',
					data: {
						username: 'wx-' + res.code
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					method: 'POST',
					success: res => {
						console.log("重新获取token成功", res)
						let token = res.data.data.token
						let expireTime = res.data.data.expireTime //过期时间
						app.globalData.token = token
						app.globalData.expireTime = expireTime
						wx.setStorageSync('token', token)
						wx.setStorageSync('expireTime', expireTime)
						console.log("token是:",token)
					},
					fail: err => {
						console.log("重新获取token失败", err)
					}
				})
			}
		},
		fail: err => {
			console.log("重新获取token失败", err)
		}
	})
}


function post(url, params, type, onSuccess, onFailed) {
	let now_time = new Date().getTime()
	console.log("请求方式：", "POST")
	if (!token || now_time >= expireTime-600000) {
		get_token()
	}
	request(url, params, "POST", type, onSuccess, onFailed);
}

/**
 * 供外部get请求调用
 */
function get(url, params, type, onSuccess, onFailed) {
	console.log("请求方式：", "GET")
	let now_time = new Date().getTime()
	if (!token || now_time >= expireTime-600000) {
		get_token()
	}
	request(url, params, "GET", type, onSuccess, onFailed);
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */

function request(url, params, method, type, onSuccess, onFailed) {
	console.log('请求url：' + url);
	let detialUrl = baseUrl + url
	// wx.showLoading({
	//   title: "正在加载中...",
	// })
	// type:x-www-form-urlencoded || json
	wx.request({
		url: detialUrl,
		data: dealParams(params),
		method: method,
		header: {
			'content-type': 'application/' + type,
			'Authorization': token,
		},
		success: function(res) {
			// wx.hideLoading();
			console.log('响应：', res.data);

			if (res.data) {
				/** start 根据需求 接口的返回状态码进行处理 */
				if (res.statusCode == 200) {
					onSuccess(res.data); //request success
				} else {
					onFailed(res.data.message); //request failed
				}
				/** end 处理结束*/
			}
		},
		fail: function(error) {
			onFailed(""); //failure for other reasons
		}
	})
}

/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
	console.log("请求参数:", params)
	return params;
}


// 1.通过module.exports方式提供给外部调用
module.exports = {
	postRequest: post,
	getRequest: get,
}
