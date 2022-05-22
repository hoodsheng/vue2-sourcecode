# Vue2 源码解析

## 1. 安装依赖及启动

```sh
# 安装依赖
pnpm install
```

```sh
# 启动，便于调试
pnpm dev
```

## 2.Vue2 响应式原理

- Object.defineProperty 数据劫持
- ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"]数组方法重写
