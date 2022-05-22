import { initMixin } from "./init";

// options用户传入的选项
function Vue(options) {
  // debugger;
  this._init(options);
}

// 扩展init方法
initMixin(Vue);

export default Vue;
