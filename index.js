"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// export interface EventItem {
//     key: string,
//     event: ()=> any
// }
var obj = {};
var eventStacks = []; //回调栈
var handleError = function handleError(err) {
    //错误处理
    throw new Error(err);
};
//工具方法
var helper = {
    //获取nameSpace
    // getNameSpace : str => {
    //     const arr = str.split(".");
    //     return arr[1];
    // },
    // //获取key
    // getKey : (keyWithNs) =>{
    //     return keyWithNs.split('.')[0];
    // },
    //数据校验
    validateData: function validateData(key) {
        if (obj.hasOwnProperty(key)) {
            return key + " \u5DF2\u7ECF\u5B58\u5728,\u8BF7\u5C1D\u8BD5\u66F4\u6362";
        }
        return null;
    }
};

var registry = {
    /**
     * 注册
     * @param key
     * @param value: any
     */
    set: function set(key, value) {
        var error = helper.validateData(key);
        if (error) return handleError(error);
        //赋值
        obj[key] = value;
        var curEvent = eventStacks.find(function (item) {
            return item.key === key;
        });
        curEvent && curEvent.event(value);
    },

    /**
     * 更新
     * @param key: string
     * @param updater: function
     */
    update: function update(key, updater) {
        var preValue = obj[key];
        var newValue = updater(preValue);
        obj[key] = newValue;
        //调用相应的回调函数，通知更新
        var curEvent = eventStacks.find(function (item) {
            return item.key === key;
        });
        curEvent && curEvent.event(newValue);
    },

    /**
     * 订阅更新
     * @param key: string
     * @param callBack: function
     */
    subscribe: function subscribe(key, callBack) {
        callBack && callBack(obj[key]);
        //推到栈中，更新时再次调用
        eventStacks.push({
            key: key,
            event: callBack
        });
    },
    //直接获取
    get: function get(key) {
        return obj[key];
    }
};
exports.default = registry;
