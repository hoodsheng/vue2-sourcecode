import { observe } from "./observe/index";

export function initState(vm) {
  // 获取所有选项
  const opts = vm.$options;
  if (opts.data) {
    // 初始化data
    initData(vm);
  }
}

function initData(vm) {
  let data = vm.$options.data;
  // data 可能是函数和对象 ,并将_data放在实例上
  data = vm._data = typeof data === "function" ? data.call(vm) : data;
  // console.log(data);
  observe(data);
  // 将用户访问的vm._data.xxx 转换成vm.xxx
  for (let key in data) {
    // 将_data上的属性全部代理给vm实例
    proxy(vm, "_data", key);
  }
}

// 数据代理
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key];
    },
    set(newValue) {
      vm[target][key] = newValue;
    },
  });
}
