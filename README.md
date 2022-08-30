## Doc

TypeScript + Electron + Vite + Vue3 + 大漠插件

## ENV
node版本不高于16.16.0  指定32位版本
electron-builder 版本不能高于 22.8.0
- choco install python visualcpp-build-tools -y

## Install

务必使用yarn安装、或者根据yarn.lock版本安装依赖
- npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
- yarn config set registry https://registry.npm.taobao.org

- yarn

- yarn rebuild

## Run

- yarn dev

## Build
- [安装visual studio 2017 ](https://my.visualstudio.com/Downloads?q=visual%20studio%202017%20version%2015.9) 安装时选择c++桌面程序  默认就行
- yarn build

- /dist/**_setup_0.0.1.exe
