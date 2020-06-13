// pages/task/task.js
import http from '../../utils/http.js'
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		TabCur: 0,
		scrollLeft: 0,
		taskList: [],//总任务单
		waitList:[],//未完成任务单
		finishList:[],//已完成任务单
		showList:[],//展示任务单
		page: 1,
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
	tabSelect(e) {
		this.setData({
			TabCur: e.currentTarget.dataset.id,
			scrollLeft: (e.currentTarget.dataset.id - 1) * 60
		})
		let index=e.currentTarget.dataset.id
		if(index==0){
			this.setData({
				showList:this.data.taskList
			})
		}else if(index==1){
			this.setData({
				showList:this.data.waitList
			})
		}else{
			this.setData({
				showList:this.data.finishList
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	loadData(pageNum) {
		//获取个人打印任务列表
		console.log("获取打印任表")
		let prams = {
			page: pageNum
		}
		let that = this
		http.postRequest("/simple_user/print_task_list", prams, "x-www-form-urlencoded",
			function(res) {
				console.log("获取个人打印任务列表成功", res.data)
				let data = res.data
				if (data) {
					for (let i = 0; i < data.length; i++) {
						console.log("设置参数")
						let color_type = data[i].color_type == 0 ? '黑白' : '彩印'
						let side_type = data[i].side_type == 0 ? '单面' : '双面'
						let image_direction = data[i].image_direction == 0 ? '纵向' : '横向'
						let paper_type = data[i].paper_type
						let parameters = color_type + ' / ' + side_type + ' / ' + image_direction + ' / ' + paper_type
						data[i].parameters = parameters
						if(data[i].status==0){
							that.setData({
								waitList: that.data.waitList.concat(data[i]),
							})
						}else{
							that.setData({
								finishList: that.data.finishList.concat(data[i]),
							})
						}
					}
					that.setData({
						taskList: that.data.taskList.concat(data),
						page: that.data.page + 1
					})
					if(pageNum==1){
						console.log("设置展示数据")
						that.setData({
							showList:that.data.taskList
						})
					}
				} else {
					wx.showToast({
						title: "没有更多数据了",
						icon: "none"
					})
				}


			},
			function(err) {
				console.log("请求失败", err)
			})

	},
	onLoad: function(options) {
		// this.loadData(this.data.page)
	},
	onShow(){
		this.setData({
			page: 1,
			taskList:[],
			waitList:[],
			finishList:[],
			showList:[]
			
		})
		this.loadData(this.data.page)
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {
		this.setData({
			page: 1,
			taskList:[],
			waitList:[],
			finishList:[],
			showList:[]
		})
		this.loadData(this.data.page)
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		this.loadData(this.data.page)
		
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
