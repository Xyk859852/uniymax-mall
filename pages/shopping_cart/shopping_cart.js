//shopping_cart.js
//获取应用实例
const app = getApp()

Page({
  data: {
    appIP: app.IP,
    totalPrice: '0.00',
    totalCount: 0,
    isAll: false,
    commodity_li_width: wx.getSystemInfoSync().windowWidth * 0.88 - 30,
    commodity_li_right_width: wx.getSystemInfoSync().windowWidth * 0.84 - 110
  },
  onLoad: function () {
  },
  onShow: function () {
    wx.showToast({
      title: "Loading...",
      icon: "loading",
      duration: 2000
    })
    // 页面显示
    var that = this;
    wx.request({
      url: this.data.appIP + 'chatGoodscart/toList',
      // data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        if (res.data.result == "true") {
          that.setData({
            cartlist: res.data.cartlist
          });
        } else if (res.data.result == "noLogin") {//未登录

        }
      },
      fail: function () {
        // fail
        setTimeout(function () {
          wx.showToast({
            title: "加载失败",
            duration: 1500
          })
        }, 100)
      },
      complete: function () {
        // complete
        wx.hideToast();
      }
    });

  },
  addNum: function (e) {
    var id = e.target.dataset.id;
    var cartlist = this.data.cartlist;
    var tc = e.detail.value;
    for (var i = 0; i < cartlist.length; i++) {
      if (cartlist[i].id == id) {
        if (cartlist[i].count < cartlist[i].goods_inventory) {
          cartlist[i].count = cartlist[i].count + 1;
          this.updateNum(id, cartlist[i].count);
        } else {
          wx.showToast({
            title: "不能再加了"
          })
        }
        cartlist[i].count - 1;
        break;
      }
    }
    this.setData({
      cartlist: cartlist
    })
  },
  delNum: function (e) {
    var id = e.target.dataset.id;
    var cartlist = this.data.cartlist;
    var tc = e.detail.value;
    for (var i = 0; i < cartlist.length; i++) {
      if (cartlist[i].id == id) {
        if (cartlist[i].count > 1) {
          cartlist[i].count = cartlist[i].count - 1;
          this.updateNum(id, cartlist[i].count);
        } else {
          wx.showToast({
            title: "不能再减了"
          })
        }
        cartlist[i].count - 1;
        break;
      }
    }
    this.setData({
      cartlist: cartlist
    })
  },
  updateNum: function (id, num) {
    // wx.showToast({
    //   title: "Loading...",
    //   icon: "loading",
    //   duration: 300000
    // })
    // var that = this;
    // wx.request({
    //   url: 'http://localhost:8080/Wxmini/cart_changeNum.do?id=' + id + '&num=' + num,
    //   // data: {},
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: function (res) {
    //     console.log(res.data)
    //     if (res.data.flag) {
    //       setTimeout(function () {
    //         wx.showToast({
    //           title: "成功",
    //           duration: 1500
    //         })
    //       }, 100)
    //     }
    //   },
    //   fail: function () {
    //     setTimeout(function () {
    //       wx.showToast({
    //         title: "操作失败"
    //       })
    //     }, 100)
    //   },
    //   complete: function () {
    //     wx.hideToast()
    //   }
    // })
    this.calcateTotal()
  },
  checkItem: function (e) {
    var id = e.target.dataset.id;
    var checked = e.detail.value;
    var cartlist = this.data.cartlist;
    for (var i = 0; i < cartlist.length; i++) {
      if (cartlist[i].id == id) {
        cartlist[i].checked = checked;
        break;
      }
    }
    this.setData({
      cartlist: cartlist
    })
    this.calcateTotal()
    this.checkIsAll()
  },
  checkAll: function (e) {
    var checked = e.detail.value;
    var cartlist = this.data.cartlist;
    for (var i = 0; i < cartlist.length; i++) {
      cartlist[i].checked = checked;
    }
    this.setData({
      cartlist: cartlist
    })
    this.calcateTotal()
  },
  calcateTotal: function () {
    var cartlist = this.data.cartlist;
    var totalPrice = 0;
    for (var i = 0; i < cartlist.length; i++) {
      if (cartlist[i].checked) {
        totalPrice += cartlist[i].goods_price * cartlist[i].count;
      }
    }
    var totalPrice2 = totalPrice.toFixed(3);
    totalPrice = totalPrice2.substring(0, totalPrice2.lastIndexOf('.') + 3);
    this.setData({
      totalPrice: totalPrice
    })
  },
  checkIsAll: function () {
    var cartlist = this.data.cartlist;
    var isAll = cartlist.length != 0 ? true : false;
    for (var i = 0; i < cartlist.length; i++) {
      if (cartlist[i].checked == false) {
        isAll = false;
        break;
      }
    }
    this.setData({
      isAll: isAll
    })
  },
  submitOrder: function (){
    var that = this;
      //检查是否选择
      var cartlist = this.data.cartlist;
      var goodsArray = [];
      var IDS = "";
    for (var i = 0; i < cartlist.length; i++) {
      if (cartlist[i].checked) {
        //购物车id
        if (IDS == "") {
          IDS += cartlist[i].id;
        } else {
          IDS += "," + cartlist[i].id;
        }
         //组件选中商品对象数据
        var data = { GOODS_ID: cartlist[i].goods_id, goodsCount: cartlist[i].count, GOODS_AMOUNT:cartlist[i].count };
        goodsArray.push(data);                
      }
    }
   
    if (goodsArray.length == 0){
      wx.showToast({
        title: "请勾选宝贝",
        duration: 1500
      });
      return;
   }

    // wx.request({
    //   url: this.data.appIP + 'chatOrder/placeOrder',
    //   // data: {},
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: function (res) {
    //     // success
    //     if (res.data.result == "true") {
    //       that.setData({
    //         cartlist: res.data.cartlist
    //       });
    //     } else if (res.data.result == "noLogin") {//未登录

    //     }
    //   },
    //   fail: function () {
    //     // fail
    //     setTimeout(function () {
    //       wx.showToast({
    //         title: "加载失败",
    //         duration: 1500
    //       })
    //     }, 100)
    //   },
    //   complete: function () {
    //     // complete
    //     wx.hideToast();
    //   }
    // });
   
    // getApp().globalData.objArray = goodsArray;
  }
})