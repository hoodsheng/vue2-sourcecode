(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  // 重写数组中的部分方法
  var oldArrayProtoMethods = Array.prototype; // 拷贝数组原型上的方法

  var newArrayProto = Object.create(oldArrayProtoMethods); // 改变原数组的方法

  var methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];
  methods.forEach(function (method) {
    // arr.push(1,2,3)
    newArrayProto[method] = function () {
      var _oldArrayProtoMethods;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 重写方法
      var result = (_oldArrayProtoMethods = oldArrayProtoMethods[method]).call.apply(_oldArrayProtoMethods, [this].concat(args)); // 内部调用原来的方法，函数的劫持
      // console.log(method);


      var ob = this.__ob__; // 如果新增的是对象，就需要再次对它劫持

      var inserted; //新增的数据

      switch (method) {
        case "push":
        case "unshift":
          // arr.push(1,2,3)
          inserted = args;
          break;

        case "splice":
          // arr.slice(0,1,{a:1},{a;2})
          inserted = args.slice(2);
      }

      if (inserted) ob.observeArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    // 观测值
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 将Observer的实例变成data的自定义属性__ob__
      // 如果data为对象，将无限被监控，形成死递归（笑死）
      // data.__ob__ = this;
      Object.defineProperty(data, "__ob__", {
        enumerable: false,
        // 不可枚举（循环的时候无法获取到）
        value: this
      }); // 判断是否为数组

      if (Array.isArray(data)) {
        // 保留数组原有方法，重写部分方法
        data.__proto__ = newArrayProto; // 重写数组原型方法

        this.observeArray(data);
      } else {
        // Object.defineProperty只能劫持已经存在属性，后增，或者删除的它都不知道
        this.walk(data);
      }
    } // 观测对象属性


    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 让对象上的所有属性依次进行观测
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      } // 观测数组

    }, {
      key: "observeArray",
      value: function observeArray(data) {
        // 监控数组中的对象
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    // 如果value为对象，就再次劫持数据
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        console.log("取值了");
        return value;
      },
      set: function set(newValue) {
        if (newValue == value) return; // 如果newValue为对象，就再次劫持数据

        observe(newValue);
        value = newValue;
        console.log("设置值了");
      }
    });
  }

  function observe(data) {
    // console.log(data);
    // 如果是null或者不是对象就不需要劫持
    if (_typeof(data) !== "object" || data == null) {
      return;
    } // 如果这个属性被代理过


    if (data.__ob__ instanceof Observer) return data.__ob__; // 判断一个对象是否被劫持过，可以增加一个实例

    return new Observer(data);
  }

  function initState(vm) {
    // 获取所有选项
    var opts = vm.$options;

    if (opts.data) {
      // 初始化data
      initData(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data; // data 可能是函数和对象 ,并将_data放在实例上

    data = vm._data = typeof data === "function" ? data.call(vm) : data; // console.log(data);

    observe(data); // 将用户访问的vm._data.xxx 转换成vm.xxx

    for (var key in data) {
      // 将_data上的属性全部代理给vm实例
      proxy(vm, "_data", key);
    }
  } // 数据代理


  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 将用户的实例挂载到vue实例上

      vm.$options = options; // 初始化状态（props，data，methods，watch，computed等等）

      initState(vm);
    };
  }

  function Vue(options) {
    // debugger;
    this._init(options);
  } // 扩展init方法


  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
