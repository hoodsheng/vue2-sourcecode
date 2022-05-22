// 重写数组中的部分方法
let oldArrayProtoMethods = Array.prototype;
// 拷贝数组原型上的方法
export let newArrayProto = Object.create(oldArrayProtoMethods);
// 改变原数组的方法
let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];

methods.forEach((method) => {
  // arr.push(1,2,3)
  newArrayProto[method] = function (...args) {
    // 重写方法
    const result = oldArrayProtoMethods[method].call(this, ...args); // 内部调用原来的方法，函数的劫持
    // console.log(method);

    const ob = this.__ob__;
    // 如果新增的是对象，就需要再次对它劫持
    let inserted; //新增的数据
    switch (method) {
      case "push":
      case "unshift":
        // arr.push(1,2,3)
        inserted = args;
        break;
      case "splice":
        // arr.slice(0,1,{a:1},{a;2})
        inserted = args.slice(2);
      default:
        break;
    }
    if (inserted) ob.observeArray(inserted);
    return result;
  };
});
