//index.js
//获取应用实例
var http = require('../../utils/http.js')
const app = getApp()

Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		token:wx.getStorageSync("token"),
		canUse: false,
		canIUse: app.globalData.canIUse,
		userInfo: {},
		hasUserInfo: false,
		bg_imag:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-jike/2861d5f0-ad2f-11ea-b43d-2358b31b6ce6.png",
		company: {
			open_corp_id:"test_454fsqewrqw6",
			name:"即刻微云印科技公司",
			logo_url:"https://www.didayunyin.com/logo.png"
		},
		view_printer: false,
		companyList: ["即刻微云印科技公司", "永多科技有限公司", "盈凯网络技术公司", "发宝网络科技公司", "欣鼎科技有限公司"],
		printerList: [],
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		invoiceInfo: [] //电子发票数组
	},
	//分享页面
	onShareAppMessage: function(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '即刻微云印',
			path: '/pages/index/index'
		}
	},
	//事件处理函数
	//扫码
	scanCode() {
		if (!this.data.canUse) {
			wx.showToast({
				title: "请先在个人页面登录!",
				icon: "none"
			})
			return false
		}
		wx.scanCode({
			complete: (res) => {
				console.log(res)
			},
		})
	},
	//切换企业
	bindPickerChange(e) {
		if (!this.data.canUse) {
			wx.showToast({
				title: "请先在个人页面登录!",
				icon: 'none'
			})
			return false
		}
		console.log('picker发送选择改变，携带值为', e.detail.value)
		let index = parseInt(e.detail.value)
		let company = this.data.companyList[index]
		console.log(company)
		
		wx.setStorageSync("company",company)
		
		
		let prams = {
			open_corp_id:company.open_corp_id
		}
		let that = this
		http.postRequest("/common/switch_corp", prams, "x-www-form-urlencoded",
			function(res) {
				console.log("切换企业成功", res.data)
				that.setData({
					company: company
				})
			},
			function(err) {
				console.log("请求失败", err)
			})
		
		//更换所在企业,刷新user信息
		// var token = wx.getStorageSync('token')
		// wx.request({
		// 	url: 'https://api.didayunyin.com/scp/common/switch_corp',
		// 	data: {
		// 		open_corp_id: company.open_corp_id
		// 	},
		// 	header: {
		// 		'content-type': 'application/x-www-form-urlencoded',
		// 		'Authorization': token
		// 	},
		// 	method: 'POST',
		// 	success: res => {
		// 		let statusCode = res.statusCode
		// 		console.log("刷新user信息:", res)
		// 		if (statusCode === 200) {
		// 			console.log("服务器更换企业成功")
		// 			this.get_printerList()//重新获取打印机
		// 		} else {
		// 			console.log("服务器更换企业失败");
		// 		}
		// 	},
		// 	fail: err => {
		// 		console.log("请求错误", err);

		// 	}
		// })

	},
	//查看打印机列表
	open_view_printer() {
		if (!this.data.canUse) {
			wx.showToast({
				title: "请先在个人页面登录!",
				icon: "none"
			})
			return false
		}
		console.log("开关打印机列表", this.data.view_printer)

		this.setData({
			view_printer: !this.data.view_printer
		})
	},
	//打印审批单
	printBill(e) {
		if (!this.data.canUse) {
			wx.showToast({
				title: "请先在个人页面登录!",
				icon: "none"
			})
			return false
		}
		console.log(e.detail.value)
		wx.navigateTo({
			url: '/pages/print/print?id=1&bill=' + e.detail.value,
		})
	},
	//打印电子发票
	printInvoice() {
		if (!this.data.canUse) {
			wx.showToast({
				title: "请先在个人页面登录!",
				icon: "none"
			})
			return false
		}
		// 微信端用户是否授权了 "scope.invoice" 这个 scope
		wx.getSetting({
			success(res) {
				console.log("获取授权信息")
				if (!res.authSetting['scope.invoice']) {
					console.log("还没有发票授权")
					wx.authorize({
						scope: 'scope.invoice',
						success: (res) => {
							console.log("调用成功")
							// 用户已经同意小程序使用电子发票功能，后续调用wx.chooseInvoice接口不会弹窗询问
							wx.chooseInvoice({
								success: (res) => {
									console.log(res)
									this.setData({
										invoiceInfo: res.invoiceInfo
									})
									// wx.navigateTo({
									//   url: '/pages/print/print?id=2'
									// })
								},
								fail: (res) => {
									console.log("失败了", res)
									wx.showModal({
										title: '提示',
										content: '检测到您还没授权发票权限,是否去授权',
										confirmText: '是',
										cancelText: '否',
										success: res => {
											if (res.confirm) {
												wx.openSetting({
													complete: (res) => {},
												})
											}
										}
									})
								},
								complete: (res) => {
									console.log("完成了")
								}

							})
						},
						fail: (res) => {
							console.log("调用失败", res)
							wx.showModal({
								title: '提示',
								content: '检测到您还没授权发票权限,是否去授权',
								confirmText: '是',
								cancelText: '否',
								success: res => {
									if (res.confirm) {
										wx.openSetting({
											complete: (res) => {},
										})
									}
								}
							})


						}
					})
				} else {
					wx.chooseInvoice({
						complete: (res) => {
							console.log(res)
							// wx.navigateTo({
							//   url: '/pages/print/print?id=2'
							// })
						},
					})
				}
			}
		})



	},

	//选择微信聊天文件
	chooseFile: function() {
		if (!this.data.canUse) {
			wx.showToast({
				title: "请先在个人页面登录!",
				icon: "none"
			})
			return false
		}
		wx.navigateTo({
			url: '/pages/print/print?id=0',
		})
	},
	//获取企业
	getCompany() {	
		let prams = {}
		let that = this
		http.getRequest("/common/joined_corp", prams, "x-www-form-urlencoded",
			function(res) {
				console.log("请求获取企业列表成功", res.data)
				that.setData({
					companyList: res.data,
				})	
			},
			function(err) {
				console.log("请求失败", err)
			})
			

	},
	get_printerList(){
		//获取打印机列表
		let prams = {
			page: 1
		}
		let that = this
		http.postRequest("/simple_user/printer_list", prams, "x-www-form-urlencoded",
			function(res) {
				console.log("请求打印机列表成功", res.data)
				for (let i = 0; i < res.data.length; i++) {
					res.data[i].paper_type = res.data[i].paper_type.split(',')
				}
				that.setData({
					printerList: res.data
				})
			},
			function(err) {
				console.log("请求失败", err)
			})
	},
	onLoad: function() {
		let company=wx.getStorageSync("company")
		if(company){
			this.setData({
				company: company
			})
		}
		
	},
	onShow() {
		let token =wx.getStorageSync("token")
		if (token) {
			this.getCompany()
			this.get_printerList()
			this.setData({
				canUse:true
			})
		}else{
			this.setData({
				canUse:false
			})
			wx.showToast({
				title: "请先在个人页面登录!",
				icon: "none"
			})
		}
	}

})
