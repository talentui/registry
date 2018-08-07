// export interface EventItem {
//     key: string,
//     event: ()=> any
// }
const obj = {};
const eventStacks = []; //回调栈
const handleError = function(err) {
    //错误处理
    throw new Error(err);
};
//工具方法
const helper = {
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
    validateData : key => {
        if (obj.hasOwnProperty(key)) {
            return `${key} 已经存在,请尝试更换`;
        }
        return null;
    }
}

const registry = {
    /**
     * 注册
     * @param key
     * @param value: any
     */
    set: function(key, value) {
        const error = helper.validateData(key);
        if (error) return handleError(error);
        //赋值
        obj[key] = value;
        const curEvent = eventStacks.find(item => item.key === key);
        curEvent && curEvent.event(value);
    },

    /**
     * 更新
     * @param key: string
     * @param updater: function
     */
    update: function(key, updater) {
        const preValue = obj[key];
        const newValue = updater(preValue);
        obj[key] = newValue;
        //调用相应的回调函数，通知更新
        const curEvent = eventStacks.find(item => item.key === key);
        curEvent && curEvent.event(newValue);
    },

    /**
     * 订阅更新
     * @param key: string
     * @param callBack: function
     */
    subscribe: function(key, callBack) {
        callBack && callBack(obj[key]);
        //推到栈中，更新时再次调用
        eventStacks.push({
            key,
            event: callBack
        });
    },
    //直接获取
    get: function(key){
        return obj[key];
    }
};

