# 简单的require和define

requirejs方便模块化关联，自己写个简单的require结合js-define-use，其实这里面可以自定义函数，并且有依赖，也能调用，相比下只要没有加载script的时候加载下
高版本浏览器可以通过document.currentScript来获取，但是safari不行，只能一个个js加载，再获取到最后一个加载的js

* js-define-use 方便定义
* loadCallback 用于所有加载
* require = loadCallback + use
* define = loadCallback + define
