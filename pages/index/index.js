//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		token:app.globalData.token,
		userInfo: {},
		hasUserInfo: false,
		company: "即刻云印科技公司",
		view_printer:false, 
		companyList:["即刻云印科技公司","永多科技有限公司","盈凯网络技术公司","发宝网络科技公司","欣鼎科技有限公司"],
		printerList: [{
			p_id:1,
			p_name:"打印机1",
			line_up:6,
			statu:"在线",
			department:"人事部",
			pager_type:['A3','A4'],
			color_printing:true,
			p_img:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-jike/ac74d030-8625-11ea-b244-a9f5e5565f30.jpg"
		},{
			p_id:2,
			p_name:"打印机2",
			line_up:8,
			statu:"在线",
			department:"培训部",
			pager_type:['A4'],
			color_printing:false,
			p_img:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-jike/ac74d030-8625-11ea-b244-a9f5e5565f30.jpg"
		},{
			p_id:3,
			p_name:"打印机3",
			line_up:7,
			statu:"下线",
			department:"财务部",
			pager_type:['A3','A4','A5'],
			color_printing:true,
			p_img:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-jike/ac74d030-8625-11ea-b244-a9f5e5565f30.jpg"
		},{
			p_id:4,
			p_name:"打印机4",
			line_up:8,
			statu:"下线",
			department:"生产部",
			pager_type:['A3','A4','A5'],
			color_printing:false,
			p_img:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-jike/ac74d030-8625-11ea-b244-a9f5e5565f30.jpg"
		},
		],
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
			title: '即刻云打印',
			path: '/page/index/index'
		}
	},
	//事件处理函数
	//扫码
	scanCode() {
		wx.scanCode({
			complete: (res) => {
				console.log(res)
			},
		})
	},
	//切换企业
	bindPickerChange(e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		let index = parseInt(e.detail.value)
		let company = this.data.companyList[index]
		console.log(company)
		this.setData({
			company: company
		})
		//更换所在企业,刷新user信息
		var token=wx.getStorageSync('token')
		wx.request({
			url: 'https://api.didayunyin.com/scp/common/switch_corp',
			data:{
				open_corp_id :company.open_corp_id
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization':token
			},
			method: 'POST',
			success: res => {
				let statusCode=res.statusCode
				console.log("刷新user信息:",res)
				if(statusCode===200){
					console.log("服务器更换企业成功")
				}else{
					console.log("服务器更换企业失败");
				}				
			},
			fail:err=>{
				console.log("请求错误",err);
				
			}
		})

	},
	//查看打印机列表
	open_view_printer(){
		console.log("开关打印机列表",this.data.view_printer)
		
		this.setData({
			view_printer:!this.data.view_printer
		})
	},
	//打印审批单
	printBill(e) {
		console.log(e.detail.value)
		wx.navigateTo({
			url: '/pages/print/print?id=1&bill=' + e.detail.value,
		})
	},
	//打印电子发票
	printInvoice() {


		
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
										title:'提示',
										content:'检测到您还没授权发票权限,是否去授权',
										confirmText:'是',
										cancelText:'否',
										success:res=>{
											if(res.confirm){
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
								title:'提示',
								content:'检测到您还没授权发票权限,是否去授权',
								confirmText:'是',
								cancelText:'否',
								success:res=>{
									if(res.confirm){
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
		wx.navigateTo({
			url: '/pages/print/print?id=0',
		})
	},

	onLoad: function() {
		let token = wx.getStorageSync('token')
		console.log("请求用户所在企业","携带的token为:",token)
		wx.request({
			url: 'https://api.didayunyin.com/scp/common/joined_corp',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization':token
			},
			method: 'GET',
			success: res => {
				let statusCode=res.statusCode
				if(statusCode===200){
					console.log("用户加入的企业:",res)
					this.setData({
						companyList:res.data.data,
						company:res.data.data[0]
					})
				}else{
					console.log("请求错误",statusCode);
				}				
			},
			fail:err=>{
				console.log("请求错误",err);
				
			}
		})
	},

})
