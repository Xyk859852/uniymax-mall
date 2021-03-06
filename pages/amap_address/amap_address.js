// pages/amap_address/amap_address.js
var amapFile = require('../../utils/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: 'd83e81a457dc244325637496faab2c75' });

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: {},
    nearby: {},
    location:{},
    address: "没能获取到您的定位",
    address_detail:"",
    content: false,
    content1: false,
    address_label_width: wx.getSystemInfoSync().windowWidth * 0.88 - 30,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRegeo()
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getRegeo: function () {
    var that = this;
    myAmapFun.getRegeo({
      success: function (data) {
        console.log(data);
        that.setData({
          address: data[0].desc,
          address_detail: data[0].regeocodeData.addressComponent.province + data[0].regeocodeData.addressComponent.city + data[0].regeocodeData.addressComponent.district+" "+data[0].name,
          location: data[0].longitude + "," + data[0].latitude,
          curLocatin: data[0]
        });
        myAmapFun.getPoiAround({
          querytypes: "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务 | 风景名胜 | 商务住宅 | 政府机构及社会团体 | 科教文化服务 |交通设施服务 | 金融保险服务 | 公司企业 | 道路附属设施 | 地名地址信息 | 公共设施",
          location: that.data.location,
          success: function (data) {
            //成功回调
            if (data && data.poisData) {
              var nearby=[];
              for (var i = 0; i < data.poisData.length; i++) {
                if (data.poisData[i].pname != "" && data.poisData[i].location != "") {
                  nearby.push(data.poisData[i]);
                }
              }
              console.log(nearby);
              that.setData({
                nearby: nearby,
                content: true,
              });
            }
          },
          fail: function (info) {
            //失败回调
            that.setData({
              address: "没能获取到您的定位",
              content: false,
            });
          }
        })
      },
      fail: function (info) {
        //失败回调
        that.setData({
          address:"没能获取到您的定位",
          content: false,
        });
      }
    })
  },
  locateCurAddress: function () {//定位当前地址
    var that = this;
    myAmapFun.getRegeo({
      success: function (data) {
        //console.log(data);
        that.setData({
          address: data[0].desc,
          address_detail: data[0].regeocodeData.addressComponent.province + data[0].regeocodeData.addressComponent.city + data[0].regeocodeData.addressComponent.district + " " + data[0].name,
          location: data[0].longitude + "," + data[0].latitude,
          curLocatin: data[0]
        });
      },
      fail: function (info) {
        //失败回调
        that.setData({
          content: false,
        });
      }
    })
  },
  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    if (keywords == "") {
      that.setData({
        content: true,
        content1: false,
      });
    }else{
    // myAmapFun.getInputtips({
    //   keywords: keywords,
    //   location: that.data.location,
    //   success: function (data) {
    //     if (data && data.tips) {
    //       var tips = [];
    //       for (var i = 0; i < data.tips.length; i++) {
    //         if (data.tips[i].adcode != "" && data.tips[i].location!="") {
    //           tips.push(data.tips[i]);
    //         }
    //       }
    //       that.setData({
    //         tips: tips,
    //         content1: true,
    //         content: false,
    //       });
    //     } else {
    //       that.setData({
    //         content: true,
    //         content1: false,
    //       });
    //     }
    //   },
    //   fail: function (info) {
    //     //失败回调
    //     that.setData({
    //       content: true,
    //       content1: false,
    //     });
    //   }
    // })

    myAmapFun.getPoiAround({
      querytypes: "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务 | 风景名胜 | 商务住宅 | 政府机构及社会团体 | 科教文化服务 |交通设施服务 | 金融保险服务 | 公司企业 | 道路附属设施 | 地名地址信息 | 公共设施",
      location: that.data.location,
      querykeywords: keywords,
      success: function (data) {
        //成功回调
        if (data && data.poisData) {
          var tips = [];
          for (var i = 0; i < data.poisData.length; i++) {
            if (data.poisData[i].pname != "" && data.poisData[i].location != "") {
              tips.push(data.poisData[i]);
            }
          }
          console.log(tips);
          that.setData({
            tips: tips,
            content1: true,
            content: false,
          });
        } else {
          that.setData({
            content: true,
            content1: false,
          });
        }
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
    }
  },
  bindSearch: function (e) {
    var keywords = e.currentTarget.dataset.keywords;
    var location = e.currentTarget.dataset.location;
    var moble = e.currentTarget.dataset.district;

    var cityname = e.currentTarget.dataset.cityname;
    var adname = e.currentTarget.dataset.adname;
    var pname = e.currentTarget.dataset.pname;
    var adcode = e.currentTarget.dataset.adcode;
    
    var locationArray = location.split(",");
    
    if (keywords==undefined){

    }else{
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]  //上一个页面
      prevPage.setData({
        address: keywords,
        location: location,
        moble: moble,
        province: pname,
        city: cityname,
        district: adname,
        DRESSTYPE: 1,
        adcode: adcode,
        LATITUDE: locationArray[1],
        LONGITUDE: locationArray[0]
      })
      wx.navigateBack({
        delta: -1
      });
    }
  },
  bindSearch1: function () {
    var that = this;
    console.log(that.data.curLocatin.latitude);
    var location = that.data.location;
    var keywords = that.data.address;
    var moble = that.data.address;

    var cityname = that.data.curLocatin.regeocodeData.addressComponent.city;
    var adname = that.data.curLocatin.regeocodeData.addressComponent.district;
    var pname = that.data.curLocatin.regeocodeData.addressComponent.province;
    
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]  //上一个页面
    prevPage.setData({
      address: keywords,
      location: location,
      moble: moble,
      province: pname,
      city: cityname,
      district: adname,
      DRESSTYPE: 1,
      LATITUDE: that.data.curLocatin.latitude,
      LONGITUDE: that.data.curLocatin.longitude

    })
    wx.navigateBack({
      delta: -1
    });
  }
})