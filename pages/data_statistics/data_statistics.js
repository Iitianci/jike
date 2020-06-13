// pages/data_statistics/data_statistics.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		taskLisk: []
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
	
	onShow: function() {
		console.log("获取本地task列表")
		wx.getStorage({
			key: 'task',
			success: (res) => {
				console.log("任务栏数据", res.data)
				this.setData({
					taskLisk: res.data
				})
			},
			fail: (res) => {
				console.log("获取本地task列表失败")
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	},

})
