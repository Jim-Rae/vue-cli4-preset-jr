/*
 * @Author: leijin
 * @Date: 2020-06-02 16:59:00
 * @LastEditors: leijin
 * @LastEditTime: 2020-06-02 17:33:18
 * @Description: 过滤器方法
 */

/**
 * 时间格式化
 * @method timeFormat
 * @param {String | Number} val 时间数值
 * @param {String} replaceStr 如果val值为空，要显示的字符
 */
export function timeFormat (val, replaceStr = '') {
  if (typeof val === 'string') {
    val = +val;
  }
  const reg = /^\d+$/g;
  if (!reg.test(val)) {
    return replaceStr;
  }
  // 补零操作
  const pad = num => ('' + num).padStart(2, '0');
  const d = new Date(val);
  const yearMonthDate = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(pad).join('-');
  const hourMinSec = [d.getHours(), d.getMinutes(), d.getSeconds()].map(pad).join(':');

  return `${yearMonthDate} ${hourMinSec}`;
};

/**
 * 简化版时间格式化，只输出日期
 * @method dateFormat
 * @param {String | Number} val 时间数值
 * @param {Object} config 配置分隔符和空白占位符
 */
export function dateFormat (val, {
  separator,
  replaceStr
} = {}) {
  // 处理 string 类型
  !!val && (val = +val);

  const reg = /^\d+$/g;
  if (!reg.test(val) || val === 0) {
    return replaceStr || '';
  }

  const d = new Date(val);
  return `${d.getFullYear()}${separator || '年'}${d.getMonth() + 1}${separator || '月'}${d.getDate()}${separator ? '' : '日'}`;
};

/**
 * 阿拉伯数字转中文数字
 * 如果传入数字时则最多处理到21位，超过21位js会自动将数字表示成科学计数法，导致精度丢失和处理出错
 * 传入数字字符串则没有限制
 * @method toZhDigit
 * @param {String | Number} digit 阿拉伯数字
 */
export const toZhDigit = digit => {
  digit = typeof digit === 'number' ? String(digit) : digit
  const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const unit = ['千', '百', '十', '']
  const quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数']

  let breakLen = Math.ceil(digit.length / 4)
  let notBreakSegment = digit.length % 4 || 4
  let segment
  const zeroFlag = []; const allZeroFlag = []
  let result = ''

  while (breakLen > 0) {
    if (!result) { // 第一次执行
      segment = digit.slice(0, notBreakSegment)
      const segmentLen = segment.length
      for (let i = 0; i < segmentLen; i++) {
        if (segment[i] !== 0) {
          if (zeroFlag.length > 0) {
            result += '零' + zh[segment[i]] + unit[4 - segmentLen + i]
            // 判断是否需要加上 quot 单位
            if (i === segmentLen - 1 && breakLen > 1) {
              result += quot[breakLen - 2]
            }
            zeroFlag.length = 0
          } else {
            result += zh[segment[i]] + unit[4 - segmentLen + i]
            if (i === segmentLen - 1 && breakLen > 1) {
              result += quot[breakLen - 2]
            }
          }
        } else {
          // 处理为 0 的情形
          if (segmentLen === 1) {
            result += zh[segment[i]]
            break
          }
          zeroFlag.push(segment[i])
          continue
        }
      }
    } else {
      segment = digit.slice(notBreakSegment, notBreakSegment + 4)
      notBreakSegment += 4

      for (let j = 0; j < segment.length; j++) {
        if (segment[j] !== 0) {
          if (zeroFlag.length > 0) {
            // 第一次执行zeroFlag长度不为0，说明上一个分区最后有0待处理
            if (j === 0) {
              result += quot[breakLen - 1] + zh[segment[j]] + unit[j]
            } else {
              result += '零' + zh[segment[j]] + unit[j]
            }
            zeroFlag.length = 0
          } else {
            result += zh[segment[j]] + unit[j]
          }
          // 判断是否需要加上 quot 单位
          if (j === segment.length - 1 && breakLen > 1) {
            result += quot[breakLen - 2]
          }
        } else {
          // 第一次执行如果zeroFlag长度不为0, 且上一划分不全为0
          if (j === 0 && zeroFlag.length > 0 && allZeroFlag.length === 0) {
            result += quot[breakLen - 1]
            zeroFlag.length = 0
            zeroFlag.push(segment[j])
          } else if (allZeroFlag.length > 0) {
            // 执行到最后
            if (breakLen === 1) {
              result += ''
            } else {
              zeroFlag.length = 0
            }
          } else {
            zeroFlag.push(segment[j])
          }

          if (j === segment.length - 1 && zeroFlag.length === 4 && breakLen !== 1) {
            // 如果执行到末尾
            if (breakLen === 1) {
              allZeroFlag.length = 0
              zeroFlag.length = 0
              result += quot[breakLen - 1]
            } else {
              allZeroFlag.push(segment[j])
            }
          }
          continue
        }
      }
    }

    --breakLen
  }

  return result
}

/**
 * Date实例转化为YYYY-MM-DD格式，可配置分隔符
 *
 * @method dateToString
 * @param {Date} dateInstance Date实例
 * @param {String} seperator 分隔符
 * @returns {String} 当天日期YYYY-MM-DD
 */
export const dateToString = (dateInstance, seperator = '-') => {
  const year = dateInstance.getFullYear();
  const month = dateInstance.getMonth() + 1;
  const date = dateInstance.getDate();
  const yearStr = year.toString();
  let monthStr = '';
  let dateStr = '';
  if (month >= 1 && month <= 9) {
    monthStr = '0' + month;
  }
  if (date >= 0 && date <= 9) {
    dateStr = '0' + date;
  }
  return yearStr + seperator + monthStr + seperator + dateStr;
}

/**
 * 将数字转化成保留两位小数的金额格式，如999,999,999.99
 *
 * @method parsePriceFormat
 * @param {number} price 需要转换的价格
 * @returns {String} 保留两位小数的金额格式
 */
export const parsePriceFormat = price => {
  const str = price.toFixed(2)
  let newStr = ''
  let count = 0
  if (!str.includes('.')) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    // 自动补小数点后两位
    newStr += '.00'
    return newStr
  } else {
    for (var i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    newStr += str.substr(str.indexOf('.'), 3)
    return newStr
  }
}
