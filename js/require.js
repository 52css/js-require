/**
 * Created by weijie on 2016/2/16.
 */
/**
 * Created by weijie on 2016/2/15.
 */
/*
 * @Author: weijie
 * @Date:   2016-02-14 10:01:28
 * @Last Modified by:   weijie
 * @Last Modified time: 2016-02-14 10:35:39
 */

(function (global, factory) {

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ?
      factory(global, true) :
      function (w) {
        return factory(w);
      };
  } else {
    factory(global);
  }

  // Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
  var currentScriptSrc,
    loadList = [],
    loadMap = {},
    isLoad,
    fns = [],
    beforeDefine = window.define;


  if (!noGlobal) {
    window.require = require;
    window.define = define;
  }

  return {
    require: require,
    define: define
  };

  function define(id, deps, factory) {
    var args = arguments;
    if (args.length === 1) {
      factory = id;
      id = currentScriptSrc;
      deps = [];
    } else if (args.length === 2) {
      factory = deps;
      if (typeof id === 'string') {
        deps = []
      } else {
        deps = id;
        id = currentScriptSrc;
      }
    }

    beforeDefine(id, deps, factory);
    loadCallback(deps);
  }

  function loadCallback(arr, callback) {
    arr.forEach(function(url) {
      if (!loadMap[url]) {
        loadMap[url] = true;
        loadList.push(url);
      }
    });
    if (callback) {
      fns.push(callback);
    }

    if (!isLoad) {
      function load(callback) {
        var url = loadList.shift();
        if (url) {
          currentScriptSrc = url;
          loadScript(url, function() {
            load(callback);
          });
        } else if (callback) {
          callback();
        }
      }

      isLoad = true;
      load(function() {
        isLoad = false;
        fns.forEach(function(fn) {
          fn();
        });
      });
    }
  }

  function require(arr, factory) {
    loadCallback(arr, function() {
      use(arr, factory);
    });
  }


  function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {  //IE
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" ||
          script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {  //Others
      script.onload = function () {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

}));