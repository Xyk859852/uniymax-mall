const app = getApp();
var header = getApp().globalData.header;
var page = 1;
var GetList = function (that) {
  wx.request({
    url: app.IP + 'chatUser/goBalance',
    data: {
      pageSize: 10,
      pageNo: page,
    },
    header: header,
    method: 'GET',
    dataType: 'json',
    success: function (res) {
      if (res.data.result == "1002"){
        wx.navigateTo({
          url: '../binding_phone/binding_phone?updatePhone=true',
        })
      }
      if (res.data.result == "true"){
      var l = that.data.list
      for (var i = 0; i < res.data.varList.length; i++) {
        l.push(res.data.varList[i])
      }
      that.setData({
        list: l
      });
      page++;
    }
      
    },
    fail: function (res) { },
    complete: function (res) { },
  })
}
// pages/expense_detail/expense_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    page = 1;
    that.setData({
      list: []
    });
    GetList(that);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("刷新");
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    page = 1;
    this.setData({
      list: []
    });
    GetList(this);
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("下拉");
    var that = this;
    GetList(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})