/*
 * @Author: Jim Rae
 * @Date: 2019-09-04 09:24:22
 * @LastEditors: leijin
 * @LastEditTime: 2021-01-07 23:07:39
 * @Description: 常用工具库
 */

import { isArray } from './validator';
import { getStyle } from './dom';

/**
 * 快速深拷贝
 * @method fastCopy
 * @param {Object} obj 需要拷贝的对象
 * @param {Array<String>} keysArr 过滤要拷贝的字段
 */
export const fastCopy = (obj, keysArr) => {
  const clone = window.JSON.parse(window.JSON.stringify(obj));
  if (!keysArr) {
    return clone;
  }

  const result = {};
  keysArr.forEach(key => {
    result[key] = clone[key];
  })
  return result;
}

/**
 * 遍历一个数组或者一个对象里的所有项去执行某个函数
 *
 * @param {Object|Array} obj 要遍历的数组或者对象
 * @param {Function} fn 每个项需要调用的函数
 */
export const forEach = (obj, fn) => {
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  if (typeof obj !== 'object') {
    obj = [obj];
  }

  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      fn(obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn(obj[key], key, obj);
      }
    }
  }
}

/**
 * 深合并多个对象
 *
 * @method deepMerge
 * @param {object} obj1 需要合并的对象
 * @returns {object} 合并后的对象
 */
export const deepMerge = (...params) => {
  var result = {};
  function assignValue (val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = params.length; i < l; i++) {
    forEach(params[i], assignValue);
  }
  return result;
}

/**
 * 兼容的方式绑定事件
 *
 * @method registerEvent
 * @param {any} target 需要绑定事件的目标
 * @param {string} type 事件类型
 * @param {any} handler 事件处理函数
 */
export const registerEvent = (target, type, handler) => {
  if (target.addEventListener) {
    target.addEventListener(type, handler)
  } else if (target.attachEvent) {
    // 兼容低版本ie
    target.attachEvent('on' + type, handler)
  } else {
    target['on' + type] = handler
  }
}

/**
 * 兼容的方式解绑事件
 *
 * @method removeEvent
 * @param {any} target 需要解绑事件的目标
 * @param {string} type 事件类型
 * @param {any} handler 事件处理函数
 */
export const removeEvent = (target, type, handler) => {
  if (target.removeEventListener) {
    target.removeEventListener(type, handler)
  } else if (target.detachEvent) {
    // 兼容低版本ie
    target.detachEvent('on' + type, handler)
  } else {
    target['on' + type] = null
  }
}

/**
 * 函数去抖
 *
 * @method debounce
 * @param {(...args: any) => void} fn 要去抖的函数
 * @param {number} delay 去抖时间
 */
export const debounce = (fn, delay = 100) => {
  let timer = 0
  return function (...args) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 函数节流
 *
 * @method throttle
 * @param {(...args: any) => void} fn 要节流的函数
 * @param duration 节流时间间隔
 */
export const throttle = (fn, duration = 100) => {
  let begin = new Date().getTime()
  return function (...args) {
    const current = new Date().getTime()
    if (current - begin >= duration) {
      fn.apply(this, args)
      begin = current
    }
  }
}

/**
 * @description: 将表单验证转换成 promise
 * @param {ElForm} form 表单
 * @return {Promise}
 */
export const formValidate2Promise = form => new Promise((resolve, reject) => {
  form.validate(valid => {
    valid ? resolve() : reject('表单输入有误，请检查');
  });
});

/**
 * @description: 通过一个或多个源对象去赋值目标对象，只复制目标对象有的字段（浅复制）
 * @param {Object} target 目标对象
 * @param {...Object} ...objs 其他源对象
 */
export const assignObjectNoExtend = (target, ...objs) => {
  if (typeof target !== 'object') return;
  const tmpObj = Object.assign({}, ...objs);
  Object.keys(target).forEach(key => {
    tmpObj[key] && (target[key] = tmpObj[key]);
  });
  return target;
}

/**
 * @description: 通过某个字段搜索出某个元素在对象数组里的位置
 * @param {Array} arr 要搜索的数组
 * @param {String} field 搜索字段名
 * @param {any} val 搜索字段的值
 * @return {Number}
 */
export const getIndexByField = (arr, field, val) => {
  if (!(arr instanceof Array) || typeof field !== 'string') return -1;
  for (let index = 0; index < arr.length; index++) {
    if (arr[index][field] === val) return index;
  }
  return -1;
}

/**
 * @description: 计算内容是否超出wrapper
 * @param {node} wrapper 父节点
 * @return {Boolean}
 */
export const isOverflowing = wrapper => {
  const range = document.createRange();
  range.setStart(wrapper, 0);
  range.setEnd(wrapper, wrapper.childNodes.length);
  const rangeWidth = range.getBoundingClientRect().width;
  const rangeHeight = range.getBoundingClientRect().height;
  const paddingX = (parseInt(getStyle(wrapper, 'paddingLeft'), 10) || 0) +
  (parseInt(getStyle(wrapper, 'paddingRight'), 10) || 0);
  const paddingY = (parseInt(getStyle(wrapper, 'paddingTop'), 10) || 0) +
  (parseInt(getStyle(wrapper, 'paddingBottom'), 10) || 0);

  return rangeWidth + paddingX > wrapper.offsetWidth || wrapper.scrollWidth > wrapper.offsetWidth || rangeHeight + paddingY > wrapper.offsetHeight || wrapper.scrollHeight > wrapper.offsetHeight;
}

/**
 * @description: 睡眠函数
 * @param {number} ms 睡眠毫秒数
 * @return {Promise}
 */
export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
