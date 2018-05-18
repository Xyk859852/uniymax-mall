
const app = getApp();
const p_c = require("time.js");

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isAvalible(value) {
  if (undefined != value && "undefined" != value && value != null && value != "" && value != "null") {
    return true;
  }

  return false;
}

//保留2位小数
function changeTwoDecimal_f(x) {
  var f_x = parseFloat(x);
  var f_x = Math.round(x * 100) / 100;
  var s_x = f_x.toString();
  var pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}

module.exports = {
  province: p_c.province,
  city: p_c.city,
  formatTime: formatTime
}

module.exports.isAvalible = isAvalible;
module.exports.changeTwoDecimal_f = changeTwoDecimal_f;

