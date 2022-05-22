import { newArrayProto } from "./array";

class Observer {
  // 观测值
  constructor(data) {
    // 将Observer的实例变成data的自定义属性__ob__
    // 如果data为对象，将无限被监控，形成死递归（笑死）
    // data.__ob__ = this;
    Object.defineProperty(data, "__ob__", {
      enumerable: false, // 不可枚举（循环的时候无法获取到）
      value: this,
    });
    // 判断是否为数组
    if (Array.isArray(data)) {
      // 保留数组原有方法，重写部分方法
      data.__proto__ = newArrayProto; // 重写数组原型方法
      this.observeArray(data);
    } else {
      // Object.defineProperty只能劫持已经存在属性，后增，或者删除的它都不知道
      this.walk(data);
    }
  }
  // 观测对象属性
  walk(data) {
    // 让对象上的所有属性依次进行观测
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
  // 观测数组
  observeArray(data) {
    // 监控数组中的对象
    data.forEach((item) => observe(item));
  }
}

function defineReactive(data, key, value) {
  // 如果value为对象，就再次劫持数据
  observe(value);
  Object.defineProperty(data, key, {
    get() {
      console.log("取值了");
      return value;
    },
    set(newValue) {
      if (newValue == value) return;
      // 如果newValue为对象，就再次劫持数据
      observe(newValue);
      value = newValue;
      console.log("设置值了");
    },
  });
}

export function observe(data) {
  // console.log(data);
  // 如果是null或者不是对象就不需要劫持
  if (typeof data !== "object" || data == null) {
    return;
  }
  // 如果这个属性被代理过
  if (data.__ob__ instanceof Observer) return data.__ob__;
  // 判断一个对象是否被劫持过，可以增加一个实例
  return new Observer(data);
}
