/* 
 * @Author: weijie
 * @Date:   2016-02-13 09:47:15
 * @Last Modified by:   weijie
 * @Last Modified time: 2016-02-13 10:02:31
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
  var getLoadGroup = (function () {
    return function () {
      var groups = [];
      var ends = [];
      var loadIndex = 0;
      /**
       * [add 添加ajax]
       * @param {Function} fn [description]
       */
      groups.add = add;
      /**
       * [fire 执行ajax]
       * @param  {[type]} star [开始事件]
       * @param  {[type]} end  [结束事件]
       * @return {[type]}      [description]
       */
      groups.fire = fire;

      groups.onEnd = onEnd;
      /**
       * [ok 添加数据并且执行结束事件]
       * @return {[type]} [description]
       */
      groups.ok = ok;

      return groups;

      function fnEnd() {
        if (groups.end && typeof groups.end === 'function') {
          groups.end();
          ends.forEach(function (fn) {
            fn();
          });
          groups.isEnd = true;
        }
      }

      function add(fn) {
        groups.push(fn);
      }

      function fire(star, end) {
        if (star && typeof star === 'function') {
          star();
        }
        groups.end = end;

        if (groups.length) {
          groups.forEach(function (fn) {
            if (fn && typeof fn === 'function') {
              fn();
            }
          });
        } else {
          fnEnd();
        }
      }

      function onEnd(fn) {
        if (groups.isEnd) {
          fn();
        } else {
          ends.push(fn);
        }
      }

      function ok(fn) {
        if (fn && typeof fn === 'function') {
          fn();
        }
        loadIndex += 1;
        if (groups.length === loadIndex) {
          fnEnd();
        }
      }
    }
  }());

  if (!noGlobal) {
    window.getLoadGroup = getLoadGroup;
  }

  return getLoadGroup;
}));
