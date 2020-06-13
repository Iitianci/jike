// pages/print/print.js
var http = require('../../utils/http.js')
//获取应用实例
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		token: wx.getStorageSync("token"),
		taskList: [], //任务列表
		safe_mode: false,
		//默认数据
		id: '', //首页进来的id
		bill: '', //审批单号
		size: 'A4', //纸张尺寸
		view_printer: false, //查看打印机
		choiceList: ["微信文件", "微信图片"],
		printer: { //默认打印机
			p_id: -1,
			show_name: "请选择打印机",
			line_up: 6,
			statu: "在线",
			department: "人事部",
			pager_type: ['A3', 'A4'],
			color_printing: '黑白',
		},

		printerList: [{
				p_id: 2,
				img_url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-jike/ac74d030-8625-11ea-b244-a9f5e5565f30.jpg',
				status: 1,
				color_type: 1,
				department_name: "人事部",
				show_name: '打印机1'
			},
			{
				p_id: 3,
				img_url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-jike/ac74d030-8625-11ea-b244-a9f5e5565f30.jpg',
				status: 1,
				color_type: 1,
				department_name: "人事部",
				show_name: '打印机1'
			}
		]
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
	//选择打印机
	choice_printer(e) {
		let index = e.currentTarget.dataset.index
		console.log(index)
		console.log(this.data.printerList[index])
		if (this.data.printerList[index].status == 2) {
			console.log("当前设备已经下线");
			wx.showToast({
				title: "该设备以下线,请选择其他设备",
				icon: "none"
			})
		} else {
			this.setData({
				printer: this.data.printerList[index],
				view_printer: false
			})
		}

	},
	//查看打印机列表
	open_view_printer() {
		console.log("开关打印机列表", this.data.view_printer)

		this.setData({
			view_printer: !this.data.view_printer
		})
	},
	//改变文件打印方向
	change_direction(e) {
		console.log("改变文件方向", e.currentTarget.dataset.direction)
		console.log("改变文件下标", e.currentTarget.dataset.index)
		let direction = e.currentTarget.dataset.direction
		let index = e.currentTarget.dataset.index
		let str = "taskList" + "[" + index + "]" + ".direction"
		this.setData({
			[str]: direction
		})

	},
	//改变纸张大小
	changeSize(e) {

		if (this.data.printer.p_id == -1) {
			wx.showToast({
				title: "请先选择打印机",
				icon: "none"
			})
			return 0
		}
		let size = e.currentTarget.dataset.size
		let index = e.currentTarget.dataset.index
		console.log("index:", index, "size", size)
		let str = "taskList" + "[" + index + "]" + ".paper_type"
		console.log(str)
		if (this.data.printer.paper_type.indexOf(size) > -1) {
			console.log(size)
			this.setData({
				[str]: size
			})
			console.log(this.data.taskList[index].paper_type)
		} else {
			wx.showToast({
				title: "设备不支持该参数!",
				icon: "none"
			})
		}

	},
	//改变打印份数
	changeCopies(e) {
		let copies = e.currentTarget.dataset.copies
		let option = e.currentTarget.dataset.option
		let index = e.currentTarget.dataset.index
		let str = "taskList" + "[" + index + "]" + ".copies"
		console.log("选择的纸张数:", copies, "下标为:", index, "选择的操作是:", option, "字符串", str)
		if (this.data.printer.p_id == -1) {
			wx.showToast({
				title: "请先选择打印机",
				icon: "none"
			})
			return false
		} else {
			if (option == 'sub') {
				copies--
				if (copies > 0) {
					this.setData({
						[str]: copies
					})
				} else {
					wx.showToast({
						title: "最小数字不能小于1",
						icon: "none"
					})
					return false
				}
			} else {
				copies++
				if (copies <= this.data.printer.limit_copies) {
					this.setData({
						[str]: copies
					})
				} else {
					wx.showToast({
						title: "超出打印机可打印份数",
						icon: "none"
					})
					return false
				}
			}
		}
		if (this.data.copies > 1) {
			this.setData({
				copies: this.data.copies - 1
			})
		}
	},
	//输入打印份数
	bindKeyInput(e) {
		let index = e.currentTarget.dataset.index

		if (this.data.printer.p_id == -1) {
			wx.showToast({
				title: "请先选择打印机",
				icon: "none"
			})
			return false
		}
		console.log(e.detail.value)
		if (e.detail.value < 1) {
			wx.showToast({
				title: "请输入大于0的数",
				icon: "none"
			})
			return
		} else if (e.detail.value >= this.data.printer.limit_copies) {
			wx.showToast({
				title: "超出打印机可打印份数",
				icon: "none"
			})
			return false
		} else {
			let copies = parseInt(e.detail.value)
			let str = "taskList" + "[" + index + "]" + ".copies"
			this.setData({
				[str]: copies
			})
		}
		console.log(this.data.copies)
	},
	//单双面选择
	change_odd_even(e) {
		if (this.data.printer.p_id == -1) {
			wx.showToast({
				title: "请先选择打印机",
				icon: "none"
			})
			return false
		}

		if (e.currentTarget.dataset.odd_even == 'even' && this.data.printer.side_type == 0) {
			wx.showToast({
				title: "设备不支持该参数",
				icon: "none"
			})
		} else {
			let index = e.currentTarget.dataset.index
			let side_type = e.currentTarget.dataset.side_type
			let str = "taskList" + "[" + index + "]" + ".side_type"
			console.log(str)
			this.setData({
				[str]: side_type
			})
		}

	},
	//色彩模式选择
	change_colour(e) {
		if (this.data.printer.p_id == -1) {
			wx.showToast({
				title: "请先选择打印机",
				icon: "none"
			})
			return false
		}
		if (e.currentTarget.dataset.colour == '彩色' && this.data.printer.color_type == 0) {
			wx.showToast({
				title: "设备不支持该参数",
				icon: "none"
			})
		} else {
			let index = e.currentTarget.dataset.index
			let color_type = e.currentTarget.dataset.color_type
			let str = "taskList" + "[" + index + "]" + ".color_type"
			console.log(str)
			this.setData({
				[str]: color_type
			})
		}

	},
	//改变打印范围
	changeRange(e) {

		if (this.data.printer.p_id == -1) {
			wx.showToast({
				title: "请先选择打印机",
				icon: "none"
			})

		} else {
			let page_num = parseInt(e.detail.value)
			let index = e.currentTarget.dataset.index
			let option = e.currentTarget.dataset.option
			let page_range_start = this.data.taskList[index].page_range_start
			let page_range_end = this.data.taskList[index].page_range_end
			if (option == "range_start") {
				let str1 = "taskList" + "[" + index + "]" + ".page_range_start"
				let str2 = "taskList" + "[" + index + "]" + ".page_range"
				let page_range = page_num + '-' + page_range_end
				if (page_num < 1 || page_num > page_range_end) {
					wx.showToast({
						title: "输入数字不正确",
						icon: "none"
					})
					this.setData({
						[str1]: 1
					})

				} else {

					this.setData({
						[str1]: page_num,
						[str2]: page_range
					})
				}
			} else {
				let str1 = "taskList" + "[" + index + "]" + ".page_range_end"
				let str2 = "taskList" + "[" + index + "]" + ".page_range"
				let page_range = page_range_start + '-' + page_num
				console.log(str1)
				if (page_num > 200 || page_num < page_range_start) {
					wx.showToast({
						title: "输入数字不正确",
						icon: "none"
					})

				} else {

					this.setData({
						[str1]: page_num,
						[str2]: page_range
					})
				}
			}
		}
	},
	//选择图片
	ChooseImg() {
		if (this.data.printer.p_id == -1) {
			wx.showToast({
				title: "请先选择打印机",
				icon: "none"
			})
			return false
		}
		wx.chooseImage({
			count: 9, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: (res) => {
				//设置图片默认参数
				console.log("选择的图片", res)
				let count = 0
				for (let i = 0; i < res.tempFiles.length; i++) {
					res.tempFiles[i].type = "img"
					res.tempFiles[i].imgUrl = res.tempFiles[i].path
					res.tempFiles[i].direction = 0
					res.tempFiles[i].color_type = 0
					res.tempFiles[i].copies = 1
					res.tempFiles[i].image_direction = 0
					res.tempFiles[i].page_range = "1-1"
					res.tempFiles[i].page_range_start = 1
					res.tempFiles[i].page_range_end = 1
					res.tempFiles[i].paper_type = "A4"
					res.tempFiles[i].print_mode = 0
					res.tempFiles[i].printer_id = this.data.printer.id
					res.tempFiles[i].side_type = 0
					res.tempFiles[i].status = 0

					wx.showLoading({
						title: '上传文件中'
					})
					wx.uploadFile({
						url: 'https://api.didayunyin.com/scp/common/upload',
						filePath: res.tempFiles[i].path,
						name: 'file',
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'Authorization': this.data.token,
						},
						formData: {
							'name': new Date().getTime() + 'abc',
							'type': 1,
							'suffix': 'img'
						},
						success: result => {
							let data = result.data
							let statusCode = result.statusCode
							if (statusCode == 200) {
								// console.log("成功上传,返回data",JSON.parse(data))
								let data1 = JSON.parse(data)
								console.log("成功上传,返回data", data1)
								console.log("fileID:", data1.data.id)
								res.tempFiles[i].file_id = data1.data.id

								this.setData({
									taskList: this.data.taskList.concat(res.tempFiles[i])
								})

								// wx.showToast({
								// 	title: "上传成功",
								// 	icon: "none"
								// })

							} else {

								// wx.showToast({
								// 	title: "上传失败",
								// 	icon: "none"
								// })
								console.log("上传失败,", data)

							}
						},
						fail: err => {

							// wx.showToast({
							// 	title: "上传失败",
							// 	icon: "none"
							// })
							console.log("err", err)
						},
						complete: function() {
							count++
							let shenyu = res.tempFiles.length - count
							// wx.showToast({
							// 	title: "处理完成,还剩" + shenyu + "个待处理",
							// 	icon: "none"
							// })
							console.log("现在文件:", count)
							if (count == res.tempFiles.length) {
								wx.hideLoading()
								wx.showToast({
									title: "全部处理完成",
									icon: "none"
								})
							}
						}
					})
				}

			}
		});
	},

	//删除任务
	DelTask(e) {
		wx.showModal({
			title: '删除图片',
			content: '确定要删除这个任务吗？',
			cancelText: '取消',
			confirmText: '确定',
			success: res => {
				if (res.confirm) {
					this.data.taskList.splice(e.currentTarget.dataset.index, 1);
					this.setData({
						taskList: this.data.taskList
					})
				}
			}
		})
	},
	//文件列表
	ChooseFile() {
		if (this.data.printer.p_id == -1) {
			wx.showToast({
				title: "请先选择打印机",
				icon: "none"
			})
			return false
		}
		wx.chooseMessageFile({
			count: 10,
			type: "file",
			extension: ['txt', 'pdf', 'ppt', 'pptx', 'xlsx', 'xls', 'doc', 'docx', 'htm', 'html', 'mdb', 'csv'],
			success: (res) => {
				console.log("选择的文件", res.tempFiles)
				//设置文件默认参数
				let count = 0
				for (let i = 0; i < res.tempFiles.length; i++) {
					let filetype = res.tempFiles[i].path.split('.').pop()
					res.tempFiles[i].imgUrl = '/images/filetype/' + filetype + '.png'
					res.tempFiles[i].type = filetype
					res.tempFiles[i].direction = 0
					res.tempFiles[i].color_type = 0
					res.tempFiles[i].copies = 1

					res.tempFiles[i].image_direction = 0
					res.tempFiles[i].page_range = "1-1"
					res.tempFiles[i].page_range_start = 1
					res.tempFiles[i].page_range_end = 1
					res.tempFiles[i].paper_type = "A4"
					res.tempFiles[i].print_mode = 0
					res.tempFiles[i].printer_id = this.data.printer.id
					res.tempFiles[i].side_type = 0
					res.tempFiles[i].status = 0
					wx.showLoading({
						title: '上传文件中'
					})
					wx.uploadFile({
						url: 'https://api.didayunyin.com/scp/common/upload',
						filePath: res.tempFiles[i].path,
						name: 'file',
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'Authorization': this.data.token,
						},
						formData: {
							'name': res.tempFiles[i].name,
							'suffix': filetype,
							'type': 0
						},
						success: result => {
							let data = result.data
							let statusCode = result.statusCode
							if (statusCode == 200) {
								// console.log("成功上传,返回data",JSON.parse(data))
								let data1 = JSON.parse(data)
								console.log("成功上传文件,返回data", data1)
								console.log("fileID:", data1.data.id)
								res.tempFiles[i].file_id = data1.data.id
								this.setData({
									taskList: this.data.taskList.concat(res.tempFiles[i])
								})


							} else {

								console.log("上传失败,", data)

							}
						},
						fail: err => {

							wx.showToast({
								title: "上传失败",
								icon: "none"
							})
							console.log("err", err)
						},
						complete: function() {
							count++
							console.log("现在文件:", count)
							if (count == res.tempFiles.length) {
								console.log("count:", count, "文件长度:", res.tempFiles.length)
								wx.hideLoading()
								wx.showToast({
									title: "全部处理完成",
									icon: "none"
								})
							}
						}
					})
				}
			},
		})
	},
	//预览任务文件
	ViewTask(e) {
		console.log(e)
		console.log(e.currentTarget.dataset)
		console.log("预览文件地址", e.currentTarget.dataset.url)
		console.log("预览文件类型", e.currentTarget.dataset.type)
		let type = e.currentTarget.dataset.type
		if (type == 'img') {
			wx.previewImage({
				// urls: this.data.taskList.map(item => item.path),
				urls: e.currentTarget.dataset.url.split('------'),
				current: e.currentTarget.dataset.url
			})
		} else {
			wx.openDocument({
				filePath: e.currentTarget.dataset.url,
				success: function(res) {
					console.log('打开文档成功')
				}
			})
		}

	},

	//时间格式化
	formatDate() {
		let date = new Date();
		let y = date.getFullYear();
		let MM = date.getMonth() + 1;
		MM = MM < 10 ? ('0' + MM) : MM;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		let h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		let m = date.getMinutes();
		m = m < 10 ? ('0' + m) : m;
		let s = date.getSeconds();
		s = s < 10 ? ('0' + s) : s;
		return y + '-' + MM + '-' + d + ' ' + h + ':' + m;
	},
	//判断是否有文件
	is_exist_file() {
		if (this.data.taskList.length == 0) {
			wx.showToast({
				title: "请先上传文件",
				icon: "none",
			})
			return false
		}
		return true
	},
	//普通打印
	common_print() {
		if (this.data.printer.p_id == -1) {
			wx.showToast({
				title: "请先选择打印机",
				icon: "none"
			})
			return false
		}
		if (this.is_exist_file()) {
			wx.showModal({
				titile: '创建任务',
				content: '是否确定创建打印任务',
				success: (res) => {
					if (res.confirm) {
						console.log('用户点击确定')
						this.print()
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		}

	},
	//打印任务
	print() {
		console.log("安全模式", this.data.safe_mode)
		console.log("安任务单", this.data.taskList)
		if (this.data.safe_mode == false) {
			console.log("普通打印")
			for (let i = 0; i < this.data.taskList.length; i++) {
				let str = "taskList" + "[" + i + "]" + ".print_mode"
				this.setData({
					[str]: 0
				})
			}
		} else {
			console.log("安全打印", this.data.taskList)
			for (let i = 0; i < this.data.taskList.length; i++) {
				let str = "taskList" + "[" + i + "]" + ".print_mode"
				console.log(str)
				this.setData({
					[str]: 1
				})
			}
		}
		// 创建批量任务
		let prams = this.data.taskList
		let that = this
		http.postRequest("/simple_user/tasks", prams, "json",
			function(res) {
				console.log("请求成功", res)
				wx.switchTab({
					url: '/pages/task/task'
				})

			},
			function(err) {
				console.log("请求失败", err)
			})




		// print.ID = Number(Date.now());
		// print.taskList = this.data.taskList
		// print.taskList = this.data.taskList
		// // print.time = this.formatDate()
		// print.state = '待打印'
		// if (this.id == 0) {
		// 	print.type = "微信文件"
		// } else if (this.id == 1) {
		// 	print.type = "审批单"
		// } else {
		// 	print.type = "电子发票"
		// }
		// var task = []
		// wx.getStorage({
		// 	key: 'task',
		// 	success(res) {
		// 		console.log(res.data)
		// 		task = res.data
		// 		task.unshift(print)
		// 		wx.setStorage({
		// 			data: task,
		// 			key: 'task',
		// 			success: (res) => {
		// 				console.log("数据缓存成功")
		// 				wx.showToast({
		// 					title: "创建任务成功",
		// 					icon: "none"
		// 				}).then(res => {
		// 					wx.switchTab({
		// 						url: '/pages/task/task'
		// 					})
		// 				})

		// 			},
		// 			fail: (res) => {
		// 				console.log("数据缓存失败")
		// 			}
		// 		})
		// 	},
		// 	fail: (err) => {
		// 		task.unshift(print)
		// 		wx.setStorage({
		// 			data: task,
		// 			key: 'task',
		// 			success: (res) => {
		// 				console.log("数据缓存成功")
		// 				wx.showToast({
		// 					title: "创建任务成功",
		// 					icon: "none"
		// 				}).then(res => {
		// 					// wx.switchTab({
		// 					// 	url: '/pages/task/task'
		// 					// })
		// 				})

		// 			},
		// 			fail: (res) => {
		// 				console.log("数据缓存失败")
		// 			}

		// 		})


		// 	},
		// })
	},
	//显示对话框
	showModal(e) {

		if (e.currentTarget.dataset.target == 'safe_info') {
			if (this.is_exist_file() == false) {
				return false
			}
		}
		this.setData({
			modalName: e.currentTarget.dataset.target
		})
	},
	//隐藏打印机列表
	hide_printer_Modal(e) {
		console.log("设备是", this.data.printer)
		if (this.data.printer.status == 2) {
			wx.showToast({
				title: "该设备以下线,请选择其他设备",
				icon: "none"
			})
		} else {
			this.setData({
				modalName: null
			})
		}

	},
	//隐藏对话框
	hideModal(e) {

		console.log(e)
		this.setData({
			modalName: null
		})
	},
	//设置安全扫码
	SetSafe(e) {
		this.setData({
			safe_mode: e.detail.value
		})
	},
	safe_print() {
		this.print()
		wx.showToast({
			title: "创建打印任务成功",
			icon: "none"
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		console.log(options)
		this.setData({
			id: options.id,
			bill: options.bill
		})
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

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
