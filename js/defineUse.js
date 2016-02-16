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
  var
    defineEventMap = {},
    defineMap = {};

  if (!noGlobal) {
    window.define = define;
    window.use = use;
  }

  return {
    define: define,
    use: use
  };

  function define(id, deps, factory) {
    defineMap[id] = {
      id: id,
      deps: deps,
      factory: factory
    };

    if (!defineEventMap[id]) {
      defineEventMap[id] = new getLoadGroup();
    }

    deps.forEach(function (dep) {
      if (!defineEventMap[dep]) {
        defineEventMap[dep] = new getLoadGroup();
      }

      defineEventMap[id].add(function () {
        defineEventMap[dep].onEnd(function () {
          defineEventMap[id].ok();
        });
      });
    });
  }

  function run() {
    for (var id in defineEventMap) {
      (function(id) {
        var item = defineEventMap[id];
        var module = defineMap[id];
        if (!module.exports) {
          item.fire(function () {
          }, function () {
            var factory = module.factory;
            var args = [];

            module.exports = {};

            if (module.deps) {
              module.deps.forEach(function(dep, i) {
                args.push(defineMap[dep].exports);
              });
            }

            module.exports = typeof factory === 'function' ? (factory.apply(null, args) || module.exports) : factory;

          });
        }
      }(id));
    }
  }

  function use(id, factory) {
    var newId = Math.floor(Math.random() * 1000000000000).toString(16);

    define(newId, typeof id === 'object' ? id : [id], factory);
    //console.log('use');
    run();
  }
}));