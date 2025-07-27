export const is = (val, type) => {
    return toString.call(val) === `[object ${type}]`;
};
/**
 * 判断是否是函数
 * 
 */
export const isFunction = (val) => {
    return typeof val === "function";
};
/**
 * 判断这个值是否存在
 * 
 */
export const isEmptyVal = (val) => {
    return val === "" || val === null || val === undefined;
};
export const isObject = (val) => {
    return val !== null && is(val, "Object");
};
/**
 * 驼峰转横杠
 * 
 */
export const humpToDash = (str) => {
    return str.replace(/([A-Z])/g, "-$1").toLowerCase();
};
/**
 * 首字母大写
 * 
 */
export function firstUpperCase(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}
/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
export const findIndex = (ary, fn) => {
    if (ary.findIndex) {
        return ary.findIndex(fn);
    }
    let index = -1;
    ary.some((item, i, ary) => {
        const ret = fn(item, i, ary);
        if (ret) {
            index = i;
            return ret;
        }
    });
    return index;
};
export const getSlot = (slots, slot = "default", data) => {
    /**
     * Reflect.has 判断一个对象是否存在某个属性
     * 
     */
    if (!slots || !Reflect.has(slots, slot)) {
        return null;
    }
    if (!isFunction(slots[slot])) {
        console.error(`${slot} is not a function!`);
        return null;
    }
    const slotFn = slots[slot];
    if (!slotFn)
        return null;
    return slotFn(data);
};
