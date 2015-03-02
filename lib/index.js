"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var explode = exports.explode = function () {
  var list = arguments[0] === undefined ? [] : arguments[0];
  return (list.reduce(function (results, forks) {
      return (!forks || !forks.length ? results : results.reduce(function (memo, result) {
          return [].concat(_toConsumableArray(memo), _toConsumableArray(forks.map(function (fork) {
            return ([].concat(_toConsumableArray(result), [fork])
            );
          })));
        }, [])
      );
    }, [[]])
  );
};

var explodeTree = exports.explodeTree = function (tree, _ref) {
  var fork = _ref.fork;
  var extract = _ref.extract;
  var compose = _ref.compose;
  return (fork(tree).reduce(function (memo, node) {
      return [].concat(_toConsumableArray(memo), _toConsumableArray(explode(extract(node).map(function (child) {
        return (explodeTree(child, { fork: fork, extract: extract, compose: compose })
        );
      })).map(function (children) {
        return (compose(node, children)
        );
      })));
    }, [])
  );
};
exports.__esModule = true;