import { initState } from "./state";

// 初始化
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    // 将用户的实例挂载到vue实例上
    vm.$options = options;
    // 初始化状态（props，data，methods，watch，computed等等）
    initState(vm);
  };
}
