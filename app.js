//app.js
App({
  onLaunch: function () {
    var token = wx.getStorageSync('token')
	var expireTime = wx.getStorageSync('expireTime')
    var http = require('./utils/http.js')
	var now_time=new Date().getTime()
	this.globalData.token=token
	this.globalData.expireTime=expireTime
   //  // 登录
   //  if (!token || now_time>=expireTime) {
   //    console.log("token重新请求");
   //    wx.login({
   //      success: res => {
   //        if (res.code) {
   //          //发起网络请求
   //          console.log('code为', res)
   //          let prams = {
   //            username: 'wx-' + res.code
   //          }
   //          let that=this
   //          http.postRequest("/user/login", prams,"x-www-form-urlencoded",
   //            function (res) {
   //              console.log("请求成功", res)
   //              let token = res.data.token
   //              let expireTime=res.data.expireTime   //过期时间
   //              that.globalData.token = token
   //              that.globalData.expireTime=expireTime
   //              wx.setStorageSync('token', token)
			// 	wx.setStorageSync('expireTime', expireTime)
   //              console.log("token是:", that.globalData.token)
   //            },
   //            function (err) {
   //              console.log("请求失败", err)
   //            })
   //        } else {
   //          console.log('登录失败！' + res.errMsg)
   //        }
   //      }
   //    })
   //  } else {
   //    console.log("token存在");
	  // this.globalData.token=token

   //  }


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
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
        }
      }
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight; //状态栏的高度
        this.globalData.Environment = e.environment; //运行环境
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })


  },
  globalData: {
    userInfo: null,
    Environment: '',
    token: '',
    userInfo: '',
	canUse:false,
  }
})