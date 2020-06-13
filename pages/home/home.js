//index.js
import http from '../../utils/http.js'
const app = getApp()

Page({
	//分享页面
	onShareAppMessage: function (res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '即刻微云印',
			path: '/pages/index/index'
		}
	},
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		userInfo: app.globalData.userInfo || ' ',
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		array: ["即刻打印1", "即刻打印2", "即刻打印3", "即刻打印4"]
	},
	//获取用户信息
	getuserInfo(e){
		if(e.detail.userInfo){
			console.log("用户允许获取用户信息",e.detail.userInfo)
			app.globalData.userInfo=e.detail.userInfo
			wx.getUserInfo({
				success: res => {
				  // 可以将 res 发送给后台解码出 unionId
				  app.globalData.userInfo = res.userInfo
				  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
				  // 所以此处加入 callback 以防止这种情况
				  if (this.userInfoReadyCallback) {
				    this.userInfoReadyCallback(res)
				  }
				
				  let prams = res
				  let that=this
				  http.postRequest("/wx/user/info", prams,"x-www-form-urlencoded",
				    function (res) {
				      console.log("用户信息请求成功", res)
					  that.globalData.canUse=true
				    },
				    function (err) {
				      console.log("请求失败", err)
				    })         
				}
			})
			this.setData({
				userInfo:e.detail.userInfo,
				hasUserInfo:true
			})	
		}
		else{
			console.log("用户拒绝获取用户信息")
		}
	},
	get_user_info(e) {
		// wx.getUserInfo({
		// 	success: res => {
		// 	  // 可以将 res 发送给后台解码出 unionId
		// 	  app.globalData.userInfo = res.userInfo
		// 	  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
		// 	  // 所以此处加入 callback 以防止这种情况
		// 	  if (this.userInfoReadyCallback) {
		// 	    this.userInfoReadyCallback(res)
		// 	  }
			
		// 	  let prams = res
		// 	  let that=this
		// 	  http.postRequest("/wx/user/info", prams,"x-www-form-urlencoded",
		// 	    function (res) {
		// 	      console.log("用户信息请求成功", res)
		// 		  that.globalData.canUse=true
		// 	    },
		// 	    function (err) {
		// 	      console.log("请求失败", err)
		// 	    })         
		// 	}
		// })
	},
	//扫码二维码
	scanCode() {
		this.hideModal()
		wx.scanCode({
			complete: (res) => {
				console.log(res)
			},
		})
	},
	//跳转数据统计页面
	data_statistics() {
		wx.navigateTo({
			url: '/pages/data_statistics/data_statistics',
		})
	},
	onLoad: function () {
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回s
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				console.log("返回结果:",res)
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
	},

})