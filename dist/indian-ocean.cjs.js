'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));

// Current version.
var VERSION = '1.12.1';

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || Function('return this')() || {};

// Save bytes in the minified (but not gzipped) version:
var ArrayProto = Array.prototype;
var ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
var push = ArrayProto.push;
var slice = ArrayProto.slice;
var toString = ObjProto.toString;
var hasOwnProperty = ObjProto.hasOwnProperty;

// Modern feature detection.
var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined';
var supportsDataView = typeof DataView !== 'undefined';

// All **ECMAScript 5+** native function implementations that we hope to use
// are declared here.
var nativeIsArray = Array.isArray;
var nativeKeys = Object.keys;
var nativeCreate = Object.create;
var nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

// Create references to these builtin functions because we override them.
var _isNaN = isNaN;
var _isFinite = isFinite;

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

// The largest integer that can be represented exactly.
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function’s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6’s "rest parameter".
function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest);
      case 1:
        return func.call(this, arguments[0], rest);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
}

// Is a given variable an object?
function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

// Is a given value equal to null?
function isNull(obj) {
  return obj === null;
}

// Is a given variable undefined?
function isUndefined(obj) {
  return obj === void 0;
}

// Is a given value a boolean?
function isBoolean(obj) {
  return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}

// Is a given value a DOM element?
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

// Internal function for creating a `toString`-based type tester.
function tagTester(name) {
  var tag = '[object ' + name + ']';
  return function (obj) {
    return toString.call(obj) === tag;
  };
}

var isString = tagTester('String');

var isNumber = tagTester('Number');

var isDate = tagTester('Date');

var isRegExp = tagTester('RegExp');

var isError = tagTester('Error');

var isSymbol = tagTester('Symbol');

var isArrayBuffer = tagTester('ArrayBuffer');

var isFunction = tagTester('Function');

// Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
// v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
var nodelist = root.document && root.document.childNodes;
if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
  isFunction = function (obj) {
    return typeof obj == 'function' || false;
  };
}

var isFunction$1 = isFunction;

var hasObjectTag = tagTester('Object');

// In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
// In IE 11, the most common among them, this problem also applies to
// `Map`, `WeakMap` and `Set`.
var hasStringTagBug = supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)));
var isIE11 = typeof Map !== 'undefined' && hasObjectTag(new Map());

var isDataView = tagTester('DataView');

// In IE 10 - Edge 13, we need a different heuristic
// to determine whether an object is a `DataView`.
function ie10IsDataView(obj) {
  return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
}

var isDataView$1 = hasStringTagBug ? ie10IsDataView : isDataView;

// Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.
var isArray = nativeIsArray || tagTester('Array');

// Internal function to check whether `key` is an own property name of `obj`.
function has(obj, key) {
  return obj != null && hasOwnProperty.call(obj, key);
}

var isArguments = tagTester('Arguments');

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
(function () {
  if (!isArguments(arguments)) {
    isArguments = function (obj) {
      return has(obj, 'callee');
    };
  }
})();

var isArguments$1 = isArguments;

// Is a given object a finite number?
function isFinite$1(obj) {
  return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
}

// Is the given value `NaN`?
function isNaN$1(obj) {
  return isNumber(obj) && _isNaN(obj);
}

// Predicate-generating function. Often useful outside of Underscore.
function constant(value) {
  return function () {
    return value;
  };
}

// Common internal logic for `isArrayLike` and `isBufferLike`.
function createSizePropertyCheck(getSizeProperty) {
  return function (collection) {
    var sizeProperty = getSizeProperty(collection);
    return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
  };
}

// Internal helper to generate a function to obtain property `key` from `obj`.
function shallowProperty(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
}

// Internal helper to obtain the `byteLength` property of an object.
var getByteLength = shallowProperty('byteLength');

// Internal helper to determine whether we should spend extensive checks against
// `ArrayBuffer` et al.
var isBufferLike = createSizePropertyCheck(getByteLength);

// Is a given value a typed array?
var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function isTypedArray(obj) {
  // `ArrayBuffer.isView` is the most future-proof, so use it when available.
  // Otherwise, fall back on the above regular expression.
  return nativeIsView ? nativeIsView(obj) && !isDataView$1(obj) : isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
}

var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);

// Internal helper to obtain the `length` property of an object.
var getLength = shallowProperty('length');

// Internal helper to create a simple lookup structure.
// `collectNonEnumProps` used to depend on `_.contains`, but this led to
// circular imports. `emulatedSet` is a one-off solution that only works for
// arrays of strings.
function emulatedSet(keys) {
  var hash = {};
  for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
  return {
    contains: function (key) {
      return hash[key];
    },
    push: function (key) {
      hash[key] = true;
      return keys.push(key);
    }
  };
}

// Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
// be iterated by `for key in ...` and thus missed. Extends `keys` in place if
// needed.
function collectNonEnumProps(obj, keys) {
  keys = emulatedSet(keys);
  var nonEnumIdx = nonEnumerableProps.length;
  var constructor = obj.constructor;
  var proto = isFunction$1(constructor) && constructor.prototype || ObjProto;

  // Constructor is a special case.
  var prop = 'constructor';
  if (has(obj, prop) && !keys.contains(prop)) keys.push(prop);

  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
      keys.push(prop);
    }
  }
}

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
function keys(obj) {
  if (!isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj);
  var keys = [];
  for (var key in obj) if (has(obj, key)) keys.push(key);
  // Ahem, IE < 9.
  if (hasEnumBug) collectNonEnumProps(obj, keys);
  return keys;
}

// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
function isEmpty(obj) {
  if (obj == null) return true;
  // Skip the more expensive `toString`-based type checks if `obj` has no
  // `.length`.
  var length = getLength(obj);
  if (typeof length == 'number' && (isArray(obj) || isString(obj) || isArguments$1(obj))) return length === 0;
  return getLength(keys(obj)) === 0;
}

// Returns whether an object has a given set of `key:value` pairs.
function isMatch(object, attrs) {
  var _keys = keys(attrs),
      length = _keys.length;
  if (object == null) return !length;
  var obj = Object(object);
  for (var i = 0; i < length; i++) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
}

// If Underscore is called as a function, it returns a wrapped object that can
// be used OO-style. This wrapper holds altered versions of all functions added
// through `_.mixin`. Wrapped objects may be chained.
function _$2(obj) {
  if (obj instanceof _$2) return obj;
  if (!(this instanceof _$2)) return new _$2(obj);
  this._wrapped = obj;
}

_$2.VERSION = VERSION;

// Extracts the result from a wrapped and chained object.
_$2.prototype.value = function () {
  return this._wrapped;
};

// Provide unwrapping proxies for some methods used in engine operations
// such as arithmetic and JSON stringification.
_$2.prototype.valueOf = _$2.prototype.toJSON = _$2.prototype.value;

_$2.prototype.toString = function () {
  return String(this._wrapped);
};

// Internal function to wrap or shallow-copy an ArrayBuffer,
// typed array or DataView to a new view, reusing the buffer.
function toBufferView(bufferSource) {
  return new Uint8Array(bufferSource.buffer || bufferSource, bufferSource.byteOffset || 0, getByteLength(bufferSource));
}

// We use this string twice, so give it a name for minification.
var tagDataView = '[object DataView]';

// Internal recursive comparison function for `_.isEqual`.
function eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  // `null` or `undefined` only equal to itself (strict comparison).
  if (a == null || b == null) return false;
  // `NaN`s are equivalent, but non-reflexive.
  if (a !== a) return b !== b;
  // Exhaust primitive checks
  var type = typeof a;
  if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
  return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `_.isEqual`.
function deepEq(a, b, aStack, bStack) {
  // Unwrap any wrapped objects.
  if (a instanceof _$2) a = a._wrapped;
  if (b instanceof _$2) b = b._wrapped;
  // Compare `[[Class]]` names.
  var className = toString.call(a);
  if (className !== toString.call(b)) return false;
  // Work around a bug in IE 10 - Edge 13.
  if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
    if (!isDataView$1(b)) return false;
    className = tagDataView;
  }
  switch (className) {
    // These types are compared by value.
    case '[object RegExp]':
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return '' + a === '' + b;
    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) return +b !== +b;
      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
    case '[object Symbol]':
      return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    case '[object ArrayBuffer]':
    case tagDataView:
      // Coerce to typed array so we can fall through.
      return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
  }

  var areArrays = className === '[object Array]';
  if (!areArrays && isTypedArray$1(a)) {
    var byteLength = getByteLength(a);
    if (byteLength !== getByteLength(b)) return false;
    if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
    areArrays = true;
  }
  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') return false;

    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor,
        bCtor = b.constructor;
    if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor && isFunction$1(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
      return false;
    }
  }
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) return bStack[length] === b;
  }

  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);

  // Recursively compare objects and arrays.
  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) return false;
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
  } else {
    // Deep compare objects.
    var _keys = keys(a),
        key;
    length = _keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (keys(b).length !== length) return false;
    while (length--) {
      // Deep compare each member
      key = _keys[length];
      if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return true;
}

// Perform a deep comparison to check if two objects are equal.
function isEqual(a, b) {
  return eq(a, b);
}

// Retrieve all the enumerable property names of an object.
function allKeys(obj) {
  if (!isObject(obj)) return [];
  var keys = [];
  for (var key in obj) keys.push(key);
  // Ahem, IE < 9.
  if (hasEnumBug) collectNonEnumProps(obj, keys);
  return keys;
}

// Since the regular `Object.prototype.toString` type tests don't work for
// some types in IE 11, we use a fingerprinting heuristic instead, based
// on the methods. It's not great, but it's the best we got.
// The fingerprint method lists are defined below.
function ie11fingerprint(methods) {
  var length = getLength(methods);
  return function (obj) {
    if (obj == null) return false;
    // `Map`, `WeakMap` and `Set` have no enumerable keys.
    var keys = allKeys(obj);
    if (getLength(keys)) return false;
    for (var i = 0; i < length; i++) {
      if (!isFunction$1(obj[methods[i]])) return false;
    }
    // If we are testing against `WeakMap`, we need to ensure that
    // `obj` doesn't have a `forEach` method in order to distinguish
    // it from a regular `Map`.
    return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
  };
}

// In the interest of compact minification, we write
// each string in the fingerprints only once.
var forEachName = 'forEach';
var hasName = 'has';
var commonInit = ['clear', 'delete'];
var mapTail = ['get', hasName, 'set'];

// `Map`, `WeakMap` and `Set` each have slightly different
// combinations of the above sublists.
var mapMethods = commonInit.concat(forEachName, mapTail);
var weakMapMethods = commonInit.concat(mapTail);
var setMethods = ['add'].concat(commonInit, forEachName, hasName);

var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');

var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');

var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');

var isWeakSet = tagTester('WeakSet');

// Retrieve the values of an object's properties.
function values(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var values = Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[_keys[i]];
  }
  return values;
}

// Convert an object into a list of `[key, value]` pairs.
// The opposite of `_.object` with one argument.
function pairs(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var pairs = Array(length);
  for (var i = 0; i < length; i++) {
    pairs[i] = [_keys[i], obj[_keys[i]]];
  }
  return pairs;
}

// Invert the keys and values of an object. The values must be serializable.
function invert(obj) {
  var result = {};
  var _keys = keys(obj);
  for (var i = 0, length = _keys.length; i < length; i++) {
    result[obj[_keys[i]]] = _keys[i];
  }
  return result;
}

// Return a sorted list of the function names available on the object.
function functions(obj) {
  var names = [];
  for (var key in obj) {
    if (isFunction$1(obj[key])) names.push(key);
  }
  return names.sort();
}

// An internal function for creating assigner functions.
function createAssigner(keysFunc, defaults) {
  return function (obj) {
    var length = arguments.length;
    if (defaults) obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (var index = 1; index < length; index++) {
      var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;
      for (var i = 0; i < l; i++) {
        var key = keys[i];
        if (!defaults || obj[key] === void 0) obj[key] = source[key];
      }
    }
    return obj;
  };
}

// Extend a given object with all the properties in passed-in object(s).
var extend = createAssigner(allKeys);

// Assigns a given object with all the own properties in the passed-in
// object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
var extendOwn = createAssigner(keys);

// Fill in a given object with default properties.
var defaults = createAssigner(allKeys, true);

// Create a naked function reference for surrogate-prototype-swapping.
function ctor() {
  return function () {};
}

// An internal function for creating a new object that inherits from another.
function baseCreate(prototype) {
  if (!isObject(prototype)) return {};
  if (nativeCreate) return nativeCreate(prototype);
  var Ctor = ctor();
  Ctor.prototype = prototype;
  var result = new Ctor();
  Ctor.prototype = null;
  return result;
}

// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
function create(prototype, props) {
  var result = baseCreate(prototype);
  if (props) extendOwn(result, props);
  return result;
}

// Create a (shallow-cloned) duplicate of an object.
function clone(obj) {
  if (!isObject(obj)) return obj;
  return isArray(obj) ? obj.slice() : extend({}, obj);
}

// Invokes `interceptor` with the `obj` and then returns `obj`.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
function tap(obj, interceptor) {
  interceptor(obj);
  return obj;
}

// Normalize a (deep) property `path` to array.
// Like `_.iteratee`, this function can be customized.
function toPath$1(path$$1) {
  return isArray(path$$1) ? path$$1 : [path$$1];
}
_$2.toPath = toPath$1;

// Internal wrapper for `_.toPath` to enable minification.
// Similar to `cb` for `_.iteratee`.
function toPath(path$$1) {
  return _$2.toPath(path$$1);
}

// Internal function to obtain a nested property in `obj` along `path`.
function deepGet(obj, path$$1) {
  var length = path$$1.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path$$1[i]];
  }
  return length ? obj : void 0;
}

// Get the value of the (deep) property on `path` from `object`.
// If any property in `path` does not exist or if the value is
// `undefined`, return `defaultValue` instead.
// The `path` is normalized through `_.toPath`.
function get(object, path$$1, defaultValue) {
  var value = deepGet(object, toPath(path$$1));
  return isUndefined(value) ? defaultValue : value;
}

// Shortcut function for checking if an object has a given property directly on
// itself (in other words, not on a prototype). Unlike the internal `has`
// function, this public version can also traverse nested properties.
function has$1(obj, path$$1) {
  path$$1 = toPath(path$$1);
  var length = path$$1.length;
  for (var i = 0; i < length; i++) {
    var key = path$$1[i];
    if (!has(obj, key)) return false;
    obj = obj[key];
  }
  return !!length;
}

// Keep the identity function around for default iteratees.
function identity(value) {
  return value;
}

// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
function matcher(attrs) {
  attrs = extendOwn({}, attrs);
  return function (obj) {
    return isMatch(obj, attrs);
  };
}

// Creates a function that, when passed an object, will traverse that object’s
// properties down the given `path`, specified as an array of keys or indices.
function property(path$$1) {
  path$$1 = toPath(path$$1);
  return function (obj) {
    return deepGet(obj, path$$1);
  };
}

// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function (value) {
        return func.call(context, value);
      };
    // The 2-argument case is omitted because we’re not using it.
    case 3:
      return function (value, index, collection) {
        return func.call(context, value, index, collection);
      };
    case 4:
      return function (accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
  }
  return function () {
    return func.apply(context, arguments);
  };
}

// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `_.identity`,
// an arbitrary callback, a property matcher, or a property accessor.
function baseIteratee(value, context, argCount) {
  if (value == null) return identity;
  if (isFunction$1(value)) return optimizeCb(value, context, argCount);
  if (isObject(value) && !isArray(value)) return matcher(value);
  return property(value);
}

// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only `argCount` argument.
function iteratee(value, context) {
  return baseIteratee(value, context, Infinity);
}
_$2.iteratee = iteratee;

// The function we call internally to generate a callback. It invokes
// `_.iteratee` if overridden, otherwise `baseIteratee`.
function cb(value, context, argCount) {
  if (_$2.iteratee !== iteratee) return _$2.iteratee(value, context);
  return baseIteratee(value, context, argCount);
}

// Returns the results of applying the `iteratee` to each element of `obj`.
// In contrast to `_.map` it returns an object.
function mapObject(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var _keys = keys(obj),
      length = _keys.length,
      results = {};
  for (var index = 0; index < length; index++) {
    var currentKey = _keys[index];
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

// Predicate-generating function. Often useful outside of Underscore.
function noop() {}

// Generates a function for a given object that returns a given property.
function propertyOf(obj) {
  if (obj == null) return noop;
  return function (path$$1) {
    return get(obj, path$$1);
  };
}

// Run a function **n** times.
function times(n, iteratee, context) {
  var accum = Array(Math.max(0, n));
  iteratee = optimizeCb(iteratee, context, 1);
  for (var i = 0; i < n; i++) accum[i] = iteratee(i);
  return accum;
}

// Return a random integer between `min` and `max` (inclusive).
function random(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}

// A (possibly faster) way to get the current timestamp as an integer.
var now = Date.now || function () {
  return new Date().getTime();
};

// Internal helper to generate functions for escaping and unescaping strings
// to/from HTML interpolation.
function createEscaper(map) {
  var escaper = function (match) {
    return map[match];
  };
  // Regexes for identifying a key that needs to be escaped.
  var source = '(?:' + keys(map).join('|') + ')';
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function (string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}

// Internal list of HTML entities for escaping.
var escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
};

// Function for escaping strings to HTML interpolation.
var _escape = createEscaper(escapeMap);

// Internal list of HTML entities for unescaping.
var unescapeMap = invert(escapeMap);

// Function for unescaping strings from HTML interpolation.
var _unescape = createEscaper(unescapeMap);

// By default, Underscore uses ERB-style template delimiters. Change the
// following template settings to use alternative delimiters.
var templateSettings = _$2.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g
};

// When customizing `_.templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /(.)^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
  "'": "'",
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

function escapeChar(match) {
  return '\\' + escapes[match];
}

var bareIdentifier = /^\s*(\w|\$)+\s*$/;

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
function template(text, settings, oldSettings) {
  if (!settings && oldSettings) settings = oldSettings;
  settings = defaults({}, settings, _$2.templateSettings);

  // Combine delimiters into one regular expression via alternation.
  var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

  // Compile the template source, escaping string literals appropriately.
  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;

    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }

    // Adobe VMs need the match returned to produce the correct offset.
    return match;
  });
  source += "';\n";

  var argument = settings.variable;
  if (argument) {
    if (!bareIdentifier.test(argument)) throw new Error(argument);
  } else {
    // If a variable is not specified, place data values in local scope.
    source = 'with(obj||{}){\n' + source + '}\n';
    argument = 'obj';
  }

  source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';

  var render;
  try {
    render = new Function(argument, '_', source);
  } catch (e) {
    e.source = source;
    throw e;
  }

  var template = function (data) {
    return render.call(this, data, _$2);
  };

  // Provide the compiled source as a convenience for precompilation.
  template.source = 'function(' + argument + '){\n' + source + '}';

  return template;
}

// Traverses the children of `obj` along `path`. If a child is a function, it
// is invoked with its parent as context. Returns the value of the final
// child, or `fallback` if any child is undefined.
function result(obj, path$$1, fallback) {
  path$$1 = toPath(path$$1);
  var length = path$$1.length;
  if (!length) {
    return isFunction$1(fallback) ? fallback.call(obj) : fallback;
  }
  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path$$1[i]];
    if (prop === void 0) {
      prop = fallback;
      i = length; // Ensure we don't continue iterating.
    }
    obj = isFunction$1(prop) ? prop.call(obj) : prop;
  }
  return obj;
}

// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter + '';
  return prefix ? prefix + id : id;
}

// Start chaining a wrapped Underscore object.
function chain(obj) {
  var instance = _$2(obj);
  instance._chain = true;
  return instance;
}

// Internal function to execute `sourceFunc` bound to `context` with optional
// `args`. Determines whether to execute a function as a constructor or as a
// normal function.
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
  var self = baseCreate(sourceFunc.prototype);
  var result = sourceFunc.apply(self, args);
  if (isObject(result)) return result;
  return self;
}

// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. `_` acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
var partial = restArguments(function (func, boundArgs) {
  var placeholder = partial.placeholder;
  var bound = function () {
    var position = 0,
        length = boundArgs.length;
    var args = Array(length);
    for (var i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return executeBound(func, bound, this, this, args);
  };
  return bound;
});

partial.placeholder = _$2;

// Create a function bound to a given object (assigning `this`, and arguments,
// optionally).
var bind = restArguments(function (func, context, args) {
  if (!isFunction$1(func)) throw new TypeError('Bind must be called on a function');
  var bound = restArguments(function (callArgs) {
    return executeBound(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
});

// Internal helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
var isArrayLike = createSizePropertyCheck(getLength);

// Internal implementation of a recursive `flatten` function.
function flatten(input, depth, strict, output) {
  output = output || [];
  if (!depth && depth !== 0) {
    depth = Infinity;
  } else if (depth <= 0) {
    return output.concat(input);
  }
  var idx = output.length;
  for (var i = 0, length = getLength(input); i < length; i++) {
    var value = input[i];
    if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
      // Flatten current level of array or arguments object.
      if (depth > 1) {
        flatten(value, depth - 1, strict, output);
        idx = output.length;
      } else {
        var j = 0,
            len = value.length;
        while (j < len) output[idx++] = value[j++];
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
}

// Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
var bindAll = restArguments(function (obj, keys) {
  keys = flatten(keys, false, false);
  var index = keys.length;
  if (index < 1) throw new Error('bindAll must be passed function names');
  while (index--) {
    var key = keys[index];
    obj[key] = bind(obj[key], obj);
  }
  return obj;
});

// Memoize an expensive function by storing its results.
function memoize(func, hasher) {
  var memoize = function (key) {
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!has(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
}

// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
var delay = restArguments(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args);
  }, wait);
});

// Defers a function, scheduling it to run after the current call stack has
// cleared.
var defer = partial(delay, _$2, 1);

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var _now = now();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

// When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is passed, the argument function will be
// triggered at the beginning of the sequence instead of at the end.
function debounce(func, wait, immediate) {
  var timeout, previous, args, result, context;

  var later = function () {
    var passed = now() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!timeout) args = context = null;
    }
  };

  var debounced = restArguments(function (_args) {
    context = this;
    args = _args;
    previous = now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result = func.apply(context, args);
    }
    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null;
  };

  return debounced;
}

// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
function wrap(func, wrapper) {
  return partial(wrapper, func);
}

// Returns a negated version of the passed-in predicate.
function negate(predicate) {
  return function () {
    return !predicate.apply(this, arguments);
  };
}

// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function () {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

// Returns a function that will only be executed on and after the Nth call.
function after(times, func) {
  return function () {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
}

// Returns a function that will only be executed up to (but not including) the
// Nth call.
function before(times, func) {
  var memo;
  return function () {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }
    if (times <= 1) func = null;
    return memo;
  };
}

// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
var once = partial(before, 2);

// Returns the first key on an object that passes a truth test.
function findKey(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = keys(obj),
      key;
  for (var i = 0, length = _keys.length; i < length; i++) {
    key = _keys[i];
    if (predicate(obj[key], key, obj)) return key;
  }
}

// Internal function to generate `_.findIndex` and `_.findLastIndex`.
function createPredicateIndexFinder(dir) {
  return function (array, predicate, context) {
    predicate = cb(predicate, context);
    var length = getLength(array);
    var index = dir > 0 ? 0 : length - 1;
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) return index;
    }
    return -1;
  };
}

// Returns the first index on an array-like that passes a truth test.
var findIndex = createPredicateIndexFinder(1);

// Returns the last index on an array-like that passes a truth test.
var findLastIndex = createPredicateIndexFinder(-1);

// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
function sortedIndex(array, obj, iteratee, context) {
  iteratee = cb(iteratee, context, 1);
  var value = iteratee(obj);
  var low = 0,
      high = getLength(array);
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee(array[mid]) < value) low = mid + 1;else high = mid;
  }
  return low;
}

// Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
function createIndexFinder(dir, predicateFind, sortedIndex) {
  return function (array, item, idx) {
    var i = 0,
        length = getLength(array);
    if (typeof idx == 'number') {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(slice.call(array, i, length), isNaN$1);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }
    return -1;
  };
}

// Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
var indexOf = createIndexFinder(1, findIndex, sortedIndex);

// Return the position of the last occurrence of an item in an array,
// or -1 if the item is not included in the array.
var lastIndexOf = createIndexFinder(-1, findLastIndex);

// Return the first value which passes a truth test.
function find(obj, predicate, context) {
  var keyFinder = isArrayLike(obj) ? findIndex : findKey;
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) return obj[key];
}

// Convenience version of a common use case of `_.find`: getting the first
// object containing specific `key:value` pairs.
function findWhere(obj, attrs) {
  return find(obj, matcher(attrs));
}

// The cornerstone for collection functions, an `each`
// implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
function each(obj, iteratee, context) {
  iteratee = optimizeCb(iteratee, context);
  var i, length;
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var _keys = keys(obj);
    for (i = 0, length = _keys.length; i < length; i++) {
      iteratee(obj[_keys[i]], _keys[i], obj);
    }
  }
  return obj;
}

// Return the results of applying the iteratee to each element.
function map(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var _keys = !isArrayLike(obj) && keys(obj),
      length = (_keys || obj).length,
      results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

// Internal helper to create a reducing function, iterating left or right.
function createReduce(dir) {
  // Wrap code that reassigns argument variables in a separate function than
  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
  var reducer = function (obj, iteratee, memo, initial) {
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
    if (!initial) {
      memo = obj[_keys ? _keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = _keys ? _keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  return function (obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
  };
}

// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
var reduce = createReduce(1);

// The right-associative version of reduce, also known as `foldr`.
var reduceRight = createReduce(-1);

// Return all the elements that pass a truth test.
function filter(obj, predicate, context) {
  var results = [];
  predicate = cb(predicate, context);
  each(obj, function (value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
}

// Return all the elements for which a truth test fails.
function reject(obj, predicate, context) {
  return filter(obj, negate(cb(predicate)), context);
}

// Determine whether all of the elements pass a truth test.
function every(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike(obj) && keys(obj),
      length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }
  return true;
}

// Determine if at least one element in the object passes a truth test.
function some(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike(obj) && keys(obj),
      length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }
  return false;
}

// Determine if the array or object contains a given item (using `===`).
function contains(obj, item, fromIndex, guard) {
  if (!isArrayLike(obj)) obj = values(obj);
  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
  return indexOf(obj, item, fromIndex) >= 0;
}

// Invoke a method (with arguments) on every item in a collection.
var invoke = restArguments(function (obj, path$$1, args) {
  var contextPath, func;
  if (isFunction$1(path$$1)) {
    func = path$$1;
  } else {
    path$$1 = toPath(path$$1);
    contextPath = path$$1.slice(0, -1);
    path$$1 = path$$1[path$$1.length - 1];
  }
  return map(obj, function (context) {
    var method = func;
    if (!method) {
      if (contextPath && contextPath.length) {
        context = deepGet(context, contextPath);
      }
      if (context == null) return void 0;
      method = context[path$$1];
    }
    return method == null ? method : method.apply(context, args);
  });
});

// Convenience version of a common use case of `_.map`: fetching a property.
function pluck(obj, key) {
  return map(obj, property(key));
}

// Convenience version of a common use case of `_.filter`: selecting only
// objects containing specific `key:value` pairs.
function where(obj, attrs) {
  return filter(obj, matcher(attrs));
}

// Return the maximum element (or element-based computation).
function max(obj, iteratee, context) {
  var result = -Infinity,
      lastComputed = -Infinity,
      value,
      computed;
  if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
    obj = isArrayLike(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value > result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    each(obj, function (v, index, list) {
      computed = iteratee(v, index, list);
      if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}

// Return the minimum element (or element-based computation).
function min(obj, iteratee, context) {
  var result = Infinity,
      lastComputed = Infinity,
      value,
      computed;
  if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
    obj = isArrayLike(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value < result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    each(obj, function (v, index, list) {
      computed = iteratee(v, index, list);
      if (computed < lastComputed || computed === Infinity && result === Infinity) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}

// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `_.map`.
function sample(obj, n, guard) {
  if (n == null || guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    return obj[random(obj.length - 1)];
  }
  var sample = isArrayLike(obj) ? clone(obj) : values(obj);
  var length = getLength(sample);
  n = Math.max(Math.min(n, length), 0);
  var last = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = random(index, last);
    var temp = sample[index];
    sample[index] = sample[rand];
    sample[rand] = temp;
  }
  return sample.slice(0, n);
}

// Shuffle a collection.
function shuffle(obj) {
  return sample(obj, Infinity);
}

// Sort the object's values by a criterion produced by an iteratee.
function sortBy(obj, iteratee, context) {
  var index = 0;
  iteratee = cb(iteratee, context);
  return pluck(map(obj, function (value, key, list) {
    return {
      value: value,
      index: index++,
      criteria: iteratee(value, key, list)
    };
  }).sort(function (left, right) {
    var a = left.criteria;
    var b = right.criteria;
    if (a !== b) {
      if (a > b || a === void 0) return 1;
      if (a < b || b === void 0) return -1;
    }
    return left.index - right.index;
  }), 'value');
}

// An internal function used for aggregate "group by" operations.
function group(behavior, partition) {
  return function (obj, iteratee, context) {
    var result = partition ? [[], []] : {};
    iteratee = cb(iteratee, context);
    each(obj, function (value, index) {
      var key = iteratee(value, index, obj);
      behavior(result, value, key);
    });
    return result;
  };
}

// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
var groupBy = group(function (result, value, key) {
  if (has(result, key)) result[key].push(value);else result[key] = [value];
});

// Indexes the object's values by a criterion, similar to `_.groupBy`, but for
// when you know that your index values will be unique.
var indexBy = group(function (result, value, key) {
  result[key] = value;
});

// Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
var countBy = group(function (result, value, key) {
  if (has(result, key)) result[key]++;else result[key] = 1;
});

// Split a collection into two arrays: one whose elements all pass the given
// truth test, and one whose elements all do not pass the truth test.
var partition = group(function (result, value, pass) {
  result[pass ? 0 : 1].push(value);
}, true);

// Safely create a real, live array from anything iterable.
var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function toArray(obj) {
  if (!obj) return [];
  if (isArray(obj)) return slice.call(obj);
  if (isString(obj)) {
    // Keep surrogate pair characters together.
    return obj.match(reStrSymbol);
  }
  if (isArrayLike(obj)) return map(obj, identity);
  return values(obj);
}

// Return the number of elements in a collection.
function size(obj) {
  if (obj == null) return 0;
  return isArrayLike(obj) ? obj.length : keys(obj).length;
}

// Internal `_.pick` helper function to determine whether `key` is an enumerable
// property name of `obj`.
function keyInObj(value, key, obj) {
  return key in obj;
}

// Return a copy of the object only containing the allowed properties.
var pick = restArguments(function (obj, keys) {
  var result = {},
      iteratee = keys[0];
  if (obj == null) return result;
  if (isFunction$1(iteratee)) {
    if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
    keys = allKeys(obj);
  } else {
    iteratee = keyInObj;
    keys = flatten(keys, false, false);
    obj = Object(obj);
  }
  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (iteratee(value, key, obj)) result[key] = value;
  }
  return result;
});

// Return a copy of the object without the disallowed properties.
var omit = restArguments(function (obj, keys) {
  var iteratee = keys[0],
      context;
  if (isFunction$1(iteratee)) {
    iteratee = negate(iteratee);
    if (keys.length > 1) context = keys[1];
  } else {
    keys = map(flatten(keys, false, false), String);
    iteratee = function (value, key) {
      return !contains(keys, key);
    };
  }
  return pick(obj, iteratee, context);
});

// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
function initial(array, n, guard) {
  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}

// Get the first element of an array. Passing **n** will return the first N
// values in the array. The **guard** check allows it to work with `_.map`.
function first(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[0];
  return initial(array, array.length - n);
}

// Returns everything but the first entry of the `array`. Especially useful on
// the `arguments` object. Passing an **n** will return the rest N values in the
// `array`.
function rest(array, n, guard) {
  return slice.call(array, n == null || guard ? 1 : n);
}

// Get the last element of an array. Passing **n** will return the last N
// values in the array.
function last(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return rest(array, Math.max(0, array.length - n));
}

// Trim out all falsy values from an array.
function compact(array) {
  return filter(array, Boolean);
}

// Flatten out an array, either recursively (by default), or up to `depth`.
// Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
function flatten$1(array, depth) {
  return flatten(array, depth, false);
}

// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
var difference = restArguments(function (array, rest) {
  rest = flatten(rest, true, true);
  return filter(array, function (value) {
    return !contains(rest, value);
  });
});

// Return a version of the array that does not contain the specified value(s).
var without = restArguments(function (array, otherArrays) {
  return difference(array, otherArrays);
});

// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// The faster algorithm will not work with an iteratee if the iteratee
// is not a one-to-one function, so providing an iteratee will disable
// the faster algorithm.
function uniq(array, isSorted, iteratee, context) {
  if (!isBoolean(isSorted)) {
    context = iteratee;
    iteratee = isSorted;
    isSorted = false;
  }
  if (iteratee != null) iteratee = cb(iteratee, context);
  var result = [];
  var seen = [];
  for (var i = 0, length = getLength(array); i < length; i++) {
    var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
    if (isSorted && !iteratee) {
      if (!i || seen !== computed) result.push(value);
      seen = computed;
    } else if (iteratee) {
      if (!contains(seen, computed)) {
        seen.push(computed);
        result.push(value);
      }
    } else if (!contains(result, value)) {
      result.push(value);
    }
  }
  return result;
}

// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
var union = restArguments(function (arrays) {
  return uniq(flatten(arrays, true, true));
});

// Produce an array that contains every item shared between all the
// passed-in arrays.
function intersection(array) {
  var result = [];
  var argsLength = arguments.length;
  for (var i = 0, length = getLength(array); i < length; i++) {
    var item = array[i];
    if (contains(result, item)) continue;
    var j;
    for (j = 1; j < argsLength; j++) {
      if (!contains(arguments[j], item)) break;
    }
    if (j === argsLength) result.push(item);
  }
  return result;
}

// Complement of zip. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.
function unzip(array) {
  var length = array && max(array, getLength).length || 0;
  var result = Array(length);

  for (var index = 0; index < length; index++) {
    result[index] = pluck(array, index);
  }
  return result;
}

// Zip together multiple lists into a single array -- elements that share
// an index go together.
var zip = restArguments(unzip);

// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values. Passing by pairs is the reverse of `_.pairs`.
function object(list, values) {
  var result = {};
  for (var i = 0, length = getLength(list); i < length; i++) {
    if (values) {
      result[list[i]] = values[i];
    } else {
      result[list[i][0]] = list[i][1];
    }
  }
  return result;
}

// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](https://docs.python.org/library/functions.html#range).
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
}

// Chunk a single array into multiple arrays, each containing `count` or fewer
// items.
function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result = [];
  var i = 0,
      length = array.length;
  while (i < length) {
    result.push(slice.call(array, i, i += count));
  }
  return result;
}

// Helper function to continue chaining intermediate results.
function chainResult(instance, obj) {
  return instance._chain ? _$2(obj).chain() : obj;
}

// Add your own custom functions to the Underscore object.
function mixin(obj) {
  each(functions(obj), function (name) {
    var func = _$2[name] = obj[name];
    _$2.prototype[name] = function () {
      var args = [this._wrapped];
      push.apply(args, arguments);
      return chainResult(this, func.apply(_$2, args));
    };
  });
  return _$2;
}

// Add all mutator `Array` functions to the wrapper.
each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
  var method = ArrayProto[name];
  _$2.prototype[name] = function () {
    var obj = this._wrapped;
    if (obj != null) {
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) {
        delete obj[0];
      }
    }
    return chainResult(this, obj);
  };
});

// Add all accessor `Array` functions to the wrapper.
each(['concat', 'join', 'slice'], function (name) {
  var method = ArrayProto[name];
  _$2.prototype[name] = function () {
    var obj = this._wrapped;
    if (obj != null) obj = method.apply(obj, arguments);
    return chainResult(this, obj);
  };
});

// Named Exports
// =============

//     Underscore.js 1.12.1
//     https://underscorejs.org
//     (c) 2009-2020 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

// Baseline setup.


var allExports = Object.freeze({
	VERSION: VERSION,
	restArguments: restArguments,
	isObject: isObject,
	isNull: isNull,
	isUndefined: isUndefined,
	isBoolean: isBoolean,
	isElement: isElement,
	isString: isString,
	isNumber: isNumber,
	isDate: isDate,
	isRegExp: isRegExp,
	isError: isError,
	isSymbol: isSymbol,
	isArrayBuffer: isArrayBuffer,
	isDataView: isDataView$1,
	isArray: isArray,
	isFunction: isFunction$1,
	isArguments: isArguments$1,
	isFinite: isFinite$1,
	isNaN: isNaN$1,
	isTypedArray: isTypedArray$1,
	isEmpty: isEmpty,
	isMatch: isMatch,
	isEqual: isEqual,
	isMap: isMap,
	isWeakMap: isWeakMap,
	isSet: isSet,
	isWeakSet: isWeakSet,
	keys: keys,
	allKeys: allKeys,
	values: values,
	pairs: pairs,
	invert: invert,
	functions: functions,
	methods: functions,
	extend: extend,
	extendOwn: extendOwn,
	assign: extendOwn,
	defaults: defaults,
	create: create,
	clone: clone,
	tap: tap,
	get: get,
	has: has$1,
	mapObject: mapObject,
	identity: identity,
	constant: constant,
	noop: noop,
	toPath: toPath$1,
	property: property,
	propertyOf: propertyOf,
	matcher: matcher,
	matches: matcher,
	times: times,
	random: random,
	now: now,
	escape: _escape,
	unescape: _unescape,
	templateSettings: templateSettings,
	template: template,
	result: result,
	uniqueId: uniqueId,
	chain: chain,
	iteratee: iteratee,
	partial: partial,
	bind: bind,
	bindAll: bindAll,
	memoize: memoize,
	delay: delay,
	defer: defer,
	throttle: throttle,
	debounce: debounce,
	wrap: wrap,
	negate: negate,
	compose: compose,
	after: after,
	before: before,
	once: once,
	findKey: findKey,
	findIndex: findIndex,
	findLastIndex: findLastIndex,
	sortedIndex: sortedIndex,
	indexOf: indexOf,
	lastIndexOf: lastIndexOf,
	find: find,
	detect: find,
	findWhere: findWhere,
	each: each,
	forEach: each,
	map: map,
	collect: map,
	reduce: reduce,
	foldl: reduce,
	inject: reduce,
	reduceRight: reduceRight,
	foldr: reduceRight,
	filter: filter,
	select: filter,
	reject: reject,
	every: every,
	all: every,
	some: some,
	any: some,
	contains: contains,
	includes: contains,
	include: contains,
	invoke: invoke,
	pluck: pluck,
	where: where,
	max: max,
	min: min,
	shuffle: shuffle,
	sample: sample,
	sortBy: sortBy,
	groupBy: groupBy,
	indexBy: indexBy,
	countBy: countBy,
	partition: partition,
	toArray: toArray,
	size: size,
	pick: pick,
	omit: omit,
	first: first,
	head: first,
	take: first,
	initial: initial,
	last: last,
	rest: rest,
	tail: rest,
	drop: rest,
	compact: compact,
	flatten: flatten$1,
	without: without,
	uniq: uniq,
	unique: uniq,
	union: union,
	intersection: intersection,
	difference: difference,
	unzip: unzip,
	transpose: unzip,
	zip: zip,
	object: object,
	range: range,
	chunk: chunk,
	mixin: mixin,
	default: _$2
});

// Default Export
// ==============
// In this module, we mix our bundled exports into the `_` object and export
// the result. This is analogous to setting `module.exports = _` in CommonJS.
// Hence, this module is also the entry point of our UMD bundle and the package
// entry point for CommonJS and AMD users. In other words, this is (the source
// of) the module you are interfacing with when you do any of the following:
//
// ```js
// // CommonJS
// var _ = require('underscore');
//
// // AMD
// define(['underscore'], function(_) {...});
//
// // UMD in the browser
// // _ is available as a global variable
// ```
// Add all of the Underscore functions to the wrapper object.
var _ = mixin(allExports);
// Legacy Node.js API.
_._ = _;

// ESM Exports
// ===========
// This module is the package entry point for ES module users. In other words,
// it is the module they are interfacing with when they import from the whole
// package instead of from a submodule, like this:
//
// ```js
// import { map } from 'underscore';
// ```
//
// The difference with `./index-default`, which is the package entry point for
// CommonJS, AMD and UMD users, is purely technical. In ES modules, named and
// default exports are considered to be siblings, so when you have a default
// export, its properties are not automatically available as named exports. For
// this reason, we re-export the named exports in addition to providing the same
// default export as in `./index-default`.

var EOL = {};
var EOF = {};
var QUOTE = 34;
var NEWLINE = 10;
var RETURN = 13;

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function (name, i) {
    return JSON.stringify(name) + ": d[" + i + "]";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function (row, i) {
    return f(object(row), i, columns);
  };
}

// Compute unique columns in order of discovery.
function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];

  rows.forEach(function (row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });

  return columns;
}

function pad(value, width) {
  var s = value + "",
      length = s.length;
  return length < width ? new Array(width - length + 1).join(0) + s : s;
}

function formatYear(year) {
  return year < 0 ? "-" + pad(-year, 6) : year > 9999 ? "+" + pad(year, 6) : pad(year, 4);
}

function formatDate(date) {
  var hours = date.getUTCHours(),
      minutes = date.getUTCMinutes(),
      seconds = date.getUTCSeconds(),
      milliseconds = date.getUTCMilliseconds();
  return isNaN(date) ? "Invalid Date" : formatYear(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2) + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z" : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z" : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z" : "");
}

var dsvFormat = function (delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      DELIMITER = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert,
        columns,
        rows = parseRows(text, function (row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns || [];
    return rows;
  }

  function parseRows(text, f) {
    var rows = [],
        // output rows
    N = text.length,
        I = 0,
        // current character index
    n = 0,
        // current line number
    t,
        // current token
    eof = N <= 0,
        // current token followed by EOF?
    eol = false; // current token followed by EOL?

    // Strip the trailing newline.
    if (text.charCodeAt(N - 1) === NEWLINE) --N;
    if (text.charCodeAt(N - 1) === RETURN) --N;

    function token() {
      if (eof) return EOF;
      if (eol) return eol = false, EOL;

      // Unescape quotes.
      var i,
          j = I,
          c;
      if (text.charCodeAt(j) === QUOTE) {
        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
        if ((i = I) >= N) eof = true;else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;else if (c === RETURN) {
          eol = true;if (text.charCodeAt(I) === NEWLINE) ++I;
        }
        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
      }

      // Find next delimiter or newline.
      while (I < N) {
        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;else if (c === RETURN) {
          eol = true;if (text.charCodeAt(I) === NEWLINE) ++I;
        } else if (c !== DELIMITER) continue;
        return text.slice(j, i);
      }

      // Return last token before EOF.
      return eof = true, text.slice(j, N);
    }

    while ((t = token()) !== EOF) {
      var row = [];
      while (t !== EOL && t !== EOF) row.push(t), t = token();
      if (f && (row = f(row, n++)) == null) continue;
      rows.push(row);
    }

    return rows;
  }

  function preformatBody(rows, columns) {
    return rows.map(function (row) {
      return columns.map(function (column) {
        return formatValue(row[column]);
      }).join(delimiter);
    });
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
  }

  function formatBody(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return preformatBody(rows, columns).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(value) {
    return value == null ? "" : value instanceof Date ? formatDate(value) : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\"" : value;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatBody: formatBody,
    formatRows: formatRows
  };
};

/* --------------------------------------------
 * Browser-implementations of NodeJS path module, adapted from Rich Harris, https://github.com/rollup/rollup/blob/master/browser/path.js
 */

var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))(?:[/]*)$/;

function posixSplitPath(filename) {
  var out = splitPathRe.exec(filename);
  out.shift();
  return out;
}

function extname(filename) {
  return posixSplitPath(filename)[3];
}

function dirname(path$$1) {
  var match = /(\/|\\)[^/\\]*$/.exec(path$$1);
  if (!match) return '.';

  var dir = path$$1.slice(0, -match[0].length);

  // If `dir` is the empty string, we're at root.
  return dir || '/';
}

/* --------------------------------------------
 * Join a path with a slash, removing any stub entries that end in a slash
 * to avoid a double slash scenario
 */
function joinPath() {
  var args = Array.prototype.slice.call(arguments);
  return args.map(function (d, i) {
    if (i === args.length - 1) return d;
    return d.replace(/\/$/, '');
  }).join('/'); // TODO, windows
}

/**
 * Given a `filePath` return the file's extension. Used internally by {@link discernParser} and {@link discernFileFormatter}. Returns `false` for files without an extension, including dotfiles
 *
 * @function discernFormat
 * @param {String} filePath Input file path
 * @returns {String} The file's extension
 *
 * @example
 * var format = io.discernFormat('path/to/data.csv')
 * console.log(format) // 'csv'
 *
 * @example
 * var format = io.discernFormat('path/to/.dotfile')
 * console.log(format) // false
 */
function discernFormat(filePath) {
  var ext = extname(filePath);
  if (ext === '') return false;

  // Chop '.' off extension returned by extname
  var formatName = ext.slice(1);
  return formatName;
}

var csv = dsvFormat(",");

var csvParse = csv.parse;

var csvFormat = csv.format;

/* istanbul ignore next */
var parserCsv = function (str, parserOptions) {
  parserOptions = parserOptions || {};
  return csvParse(str, parserOptions.map);
};

var identity$1 = (function (d) {
  return d;
});

/* istanbul ignore next */
var parserJson = function (str, parserOptions) {
  parserOptions = parserOptions || {};
  // Do a naive test whether this is a string or an object
  var mapFn = parserOptions.map ? str.trim().charAt(0) === '[' ? _.map : _.mapObject : identity$1;
  var jsonParser = JSON.parse;
  return mapFn(jsonParser(str, parserOptions.reviver, parserOptions.filename), parserOptions.map);
};

/* istanbul ignore next */
var parserPsv = function (str, parserOptions) {
  parserOptions = parserOptions || {};
  return dsvFormat('|').parse(str, parserOptions.map);
};

var tsv = dsvFormat("\t");

var tsvParse = tsv.parse;

var tsvFormat = tsv.format;

/* istanbul ignore next */
var parserTsv = function (str, parserOptions) {
  parserOptions = parserOptions || {};
  return tsvParse(str, parserOptions.map);
};

var parserTxt = function (str, parserOptions) {
  return parserOptions && typeof parserOptions.map === 'function' ? parserOptions.map(str) : str;
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var archieml = createCommonjsModule(function (module, exports) {
  // Structure inspired by John Resig's HTML parser
  // http://ejohn.org/blog/pure-javascript-html-parser/

  (function () {
    'use strict';

    // The load function takes a string of text as its only argument.
    // It then proceeds to match the text to one of several regular expressions
    // which match patterns for different types of commands in AML.

    function load(input, options) {
      var whitespacePattern = '\\u0000\\u0009\\u000A\\u000B\\u000C\\u000D\\u0020\\u00A0\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u200B\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF';
      var slugBlacklist = whitespacePattern + '\\u005B\\u005C\\u005D\\u007B\\u007D\\u003A';

      var nextLine = new RegExp('.*((\r|\n)+)');
      var startKey = new RegExp('^\\s*([^' + slugBlacklist + ']+)[ \t\r]*:[ \t\r]*(.*(?:\n|\r|$))');
      var commandKey = new RegExp('^\\s*:[ \t\r]*(endskip|ignore|skip|end).*?(\n|\r|$)', 'i');
      var arrayElement = new RegExp('^\\s*\\*[ \t\r]*(.*(?:\n|\r|$))');
      var scopePattern = new RegExp('^\\s*(\\[|\\{)[ \t\r]*([\+\.]*)[ \t\r]*([^' + slugBlacklist + ']*)[ \t\r]*(?:\\]|\\}).*?(\n|\r|$)');

      var data = {},
          scope = data,
          stack = [],
          stackScope = undefined,
          bufferScope = null,
          bufferKey = null,
          bufferString = '',
          isSkipping = false;

      var options = options || {};
      if (options.comments !== true) options.comments = false;

      while (input) {
        // Inside the input stream loop, the `input` string is trimmed down as matches
        // are found, and fires a call to the matching parse*() function.
        var match;

        if (commandKey.exec(input)) {
          match = commandKey.exec(input);

          parseCommandKey(match[1].toLowerCase());
        } else if (!isSkipping && startKey.exec(input) && (!stackScope || stackScope.arrayType !== 'simple')) {
          match = startKey.exec(input);

          parseStartKey(match[1], match[2] || '');
        } else if (!isSkipping && arrayElement.exec(input) && stackScope && stackScope.array && stackScope.arrayType !== 'complex' && stackScope.arrayType !== 'freeform' && stackScope.flags.indexOf('+') < 0) {
          match = arrayElement.exec(input);

          parseArrayElement(match[1]);
        } else if (!isSkipping && scopePattern.exec(input)) {
          match = scopePattern.exec(input);

          parseScope(match[1], match[2], match[3]);
        } else if (nextLine.exec(input)) {
          match = nextLine.exec(input);

          parseText(match[0]);
        } else {
          // End of document reached
          parseText(input);
          input = '';
        }

        if (match) input = input.substring(match[0].length);
      }

      // The following parse functions add to the global `data` object and update
      // scoping variables to keep track of what we're parsing.

      function parseStartKey(key, restOfLine) {
        // When a new key is encountered, the rest of the line is immediately added as
        // its value, by calling `flushBuffer`.
        flushBuffer();

        incrementArrayElement(key);

        if (stackScope && stackScope.flags.indexOf('+') > -1) key = 'value';

        bufferKey = key;
        bufferString = restOfLine;

        flushBufferInto(key, { replace: true });
      }

      function parseArrayElement(value) {
        flushBuffer();

        stackScope.arrayType = stackScope.arrayType || 'simple';

        stackScope.array.push('');
        bufferKey = stackScope.array;
        bufferString = value;
        flushBufferInto(stackScope.array, { replace: true });
      }

      function parseCommandKey(command) {
        // if isSkipping, don't parse any command unless :endskip

        if (isSkipping && !(command === "endskip" || command === "ignore")) return flushBuffer();

        switch (command) {
          case "end":
            // When we get to an end key, save whatever was in the buffer to the last
            // active key.
            if (bufferKey) flushBufferInto(bufferKey, { replace: false });
            return;

          case "ignore":
            // When ":ignore" is reached, stop parsing immediately
            input = '';
            break;

          case "skip":
            isSkipping = true;
            break;

          case "endskip":
            isSkipping = false;
            break;
        }

        flushBuffer();
      }

      function parseScope(scopeType, flags, scopeKey) {
        // Throughout the parsing, `scope` refers to one of the following:
        //   * `data`
        //   * an object - one level within `data` - when we're within a {scope} block
        //   * an object at the end of an array - which is one level within `data` -
        //     when we're within an [array] block.
        //
        // `scope` changes whenever a scope key is encountered. It also changes
        // within parseStartKey when we start a new object within an array.
        flushBuffer();

        if (scopeKey == '') {

          // Move up a level
          var lastStackItem = stack.pop();
          scope = (lastStackItem ? lastStackItem.scope : data) || data;
          stackScope = stack[stack.length - 1];
        } else if (scopeType === '[' || scopeType === '{') {
          var nesting = false;
          var keyScope = data;

          // If the flags include ".", drill down into the appropriate scope.
          if (flags.indexOf('.') > -1) {
            incrementArrayElement(scopeKey, flags);
            nesting = true;
            if (stackScope) keyScope = scope;

            // Otherwise, make sure we reset to the global scope
          } else {
            scope = data;
            stack = [];
          }

          // Within freeforms, the `type` of nested objects and arrays is taken
          // verbatim from the `keyScope`.
          if (stackScope && stackScope.flags.indexOf('+') > -1) {
            var parsedScopeKey = scopeKey;

            // Outside of freeforms, dot-notation interpreted as nested data.
          } else {
            var keyBits = scopeKey.split('.');
            for (var i = 0; i < keyBits.length - 1; i++) {
              keyScope = keyScope[keyBits[i]] = keyScope[keyBits[i]] || {};
            }
            var parsedScopeKey = keyBits[keyBits.length - 1];
          }

          var stackScopeItem = {
            array: null,
            arrayType: null,
            arrayFirstKey: null,
            flags: flags,
            scope: scope
          };

          // Content of nested scopes within a freeform should be stored under "value."
          var isNestedFreeform = stackScope && stackScope.flags.indexOf('+') > -1 && flags.indexOf('.') > -1;

          if (scopeType == '[') {
            if (isNestedFreeform) parsedScopeKey = 'value';
            stackScopeItem.array = keyScope[parsedScopeKey] = [];
            if (flags.indexOf('+') > -1) stackScopeItem.arrayType = 'freeform';
            if (nesting) {
              stack.push(stackScopeItem);
            } else {
              stack = [stackScopeItem];
            }
            stackScope = stack[stack.length - 1];
          } else if (scopeType == '{') {
            if (nesting) {
              if (isNestedFreeform) scope = scope.value = {};else scope = keyScope[parsedScopeKey] = keyScope = {};
              stack.push(stackScopeItem);
            } else {
              scope = keyScope[parsedScopeKey] = typeof keyScope[parsedScopeKey] === 'object' ? keyScope[parsedScopeKey] : {};
              stack = [stackScopeItem];
            }
            stackScope = stack[stack.length - 1];
          }
        }
      }

      function parseText(text) {
        if (stackScope && stackScope.flags.indexOf('+') > -1 && text.match(/[^\n\r\s]/)) {
          stackScope.array.push({ "type": "text", "value": text.replace(/(^\s*)|(\s*$)/g, '') });
        } else {
          bufferString += input.substring(0, text.length);
        }
      }

      function incrementArrayElement(key) {
        // Special handling for arrays. If this is the start of the array, remember
        // which key was encountered first. If this is a duplicate encounter of
        // that key, start a new object.

        if (stackScope && stackScope.array) {
          // If we're within a simple array, ignore
          stackScope.arrayType = stackScope.arrayType || 'complex';
          if (stackScope.arrayType === 'simple') return;

          // arrayFirstKey may be either another key, or null
          if (stackScope.arrayFirstKey === null || stackScope.arrayFirstKey === key) stackScope.array.push(scope = {});
          if (stackScope.flags.indexOf('+') > -1) {
            scope.type = key;
          } else {
            stackScope.arrayFirstKey = stackScope.arrayFirstKey || key;
          }
        }
      }

      function formatValue(value, type) {
        if (options.comments) {
          value = value.replace(/(?:^\\)?\[[^\[\]\n\r]*\](?!\])/mg, ""); // remove comments
          value = value.replace(/\[\[([^\[\]\n\r]*)\]\]/g, "[$1]"); // [[]] => []
        }

        if (type == 'append') {
          // If we're appending to a multi-line string, escape special punctuation
          // by using a backslash at the beginning of any line.
          // Note we do not do this processing for the first line of any value.
          value = value.replace(new RegExp('^(\\s*)\\\\', 'gm'), "$1");
        }

        return value;
      }

      function flushBuffer() {
        var result = bufferString + '';
        bufferString = '';
        bufferKey = null;
        return result;
      }

      function flushBufferInto(key, options) {
        options = options || {};
        var existingBufferKey = bufferKey;
        var value = flushBuffer();

        if (options.replace) {
          value = formatValue(value, 'replace').replace(new RegExp('^\\s*'), '');
          bufferString = new RegExp('\\s*$').exec(value)[0];
          bufferKey = existingBufferKey;
        } else {
          value = formatValue(value, 'append');
        }

        if (typeof key === 'object') {
          // key is an array
          if (options.replace) key[key.length - 1] = '';

          key[key.length - 1] += value.replace(new RegExp('\\s*$'), '');
        } else {
          var keyBits = key.split('.');
          bufferScope = scope;

          for (var i = 0; i < keyBits.length - 1; i++) {
            if (typeof bufferScope[keyBits[i]] === 'string') bufferScope[keyBits[i]] = {};
            bufferScope = bufferScope[keyBits[i]] = bufferScope[keyBits[i]] || {};
          }

          if (options.replace) bufferScope[keyBits[keyBits.length - 1]] = '';

          bufferScope[keyBits[keyBits.length - 1]] += value.replace(new RegExp('\\s*$'), '');
        }
      }

      flushBuffer();
      return data;
    }

    var archieml = { load: load };

    {
      if ('object' !== 'undefined' && module.exports) {
        exports = module.exports = archieml;
      }
      exports.archieml = archieml;
    }

    if (typeof undefined === 'function' && undefined.amd) {
      undefined('archieml', [], function () {
        return archieml;
      });
    }
  }).call(commonjsGlobal);
});

// Return a copy of the object, filtered to omit the blacklisted array of keys.
function omit$1(obj, blackList) {
  var newObj = {};
  Object.keys(obj || {}).forEach(function (key) {
    if (blackList.indexOf(key) === -1) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

/* istanbul ignore next */
var parserAml = function (str, parserOptions) {
  parserOptions = parserOptions || {};
  var map = parserOptions.map || identity$1;
  var data = archieml.load(str, omit$1(parserOptions, ['map']));
  return map(data);
};

/* --------------------------------------------
 * Formats that should be treated similarly
 */
var formatsIndex = {
  json: ['topojson', 'geojson']
};

var formatsList = Object.keys(formatsIndex).map(function (key) {
  return { name: key, equivalents: formatsIndex[key] };
});

var parsers = {
  csv: parserCsv,
  json: parserJson,
  psv: parserPsv,
  tsv: parserTsv,
  txt: parserTxt,
  aml: parserAml
};

formatsList.forEach(function (format) {
  format.equivalents.forEach(function (equivalent) {
    parsers[equivalent] = parsers[format.name];
  });
});

/* istanbul ignore next */
/**
 * Given a `filePath` return a parser that can read that file as json. Parses as text if format not supported by a built-in parser. If given a delimiter string as the second argument, return a parser for that delimiter regardless of `filePath`. Used internally by {@link readData} and {@link readDataSync}.
 *
 * @function discernParser
 * @param {String} [filePath] Input file path
 * @param {Object} [options] Optional options object, see below
 * @param {Object} [options.delimiter] If `{delimiter: true}`, it will treat the string given as `filePath` as a delimiter and delegate to `dsv.dsvFormat`.
 * @returns {Function} A parser that can parse a file string into json
 *
 * @example
 * var parser = io.discernParser('path/to/data.csv')
 * var json = parser('name,price\nApple,120\nPear,300')

 * var parser = io.discernParser('_', {delimiter: true})
 * var json = parser('name_price\nApple_120\nPear_300')
 */
function discernParser(filePath, opts_) {
  if (opts_ && opts_.delimiter === true) {
    return dsvFormat(filePath).parse;
  }
  var format = discernFormat(filePath);
  var parser = parsers[format];
  // If we don't have a parser for this format, return as text
  if (typeof parser === 'undefined') {
    parser = parsers['txt'];
  }
  return parser;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

// Our `readData` fns can take either a delimiter to parse a file, or a full blown parser
// Determine what they passed in with this handy function
function getParser(delimiterOrParser) {
  var parser;
  if (typeof delimiterOrParser === 'string') {
    parser = discernParser(delimiterOrParser, { delimiter: true });
  } else if (typeof delimiterOrParser === 'function' || (typeof delimiterOrParser === 'undefined' ? 'undefined' : _typeof(delimiterOrParser)) === 'object') {
    parser = delimiterOrParser;
  }
  return parser;
}

// from https://github.com/sindresorhus/strip-bom/blob/d5696fdc9eeb6cc8d97e390cf1de7558f74debd5/index.js#L3

function stripBom(string) {
  // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
  // conversion translates it to FEFF (UTF-16 BOM)
  if (string.charCodeAt(0) === 0xFEFF) {
    return string.slice(1);
  }

  return string;
}

/* istanbul ignore next */
function file(filePath, parser, parserOptions, cb) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    var fileFormat = discernFormat(filePath);
    if ((fileFormat === 'json' || formatsIndex.json.indexOf(fileFormat) > -1) && data === '') {
      data = '[]';
    }
    if (err) {
      cb(err);
      return false;
    }
    var parsed;
    try {
      data = stripBom(data);
      if (typeof parser === 'function') {
        parsed = parser(data, parserOptions);
      } else if ((typeof parser === 'undefined' ? 'undefined' : _typeof(parser)) === 'object' && typeof parser.parse === 'function') {
        parsed = parser.parse(data, parserOptions);
      } else {
        parsed = 'Your specified parser is not properly formatted. It must either be a function or have a `parse` method.';
      }
    } catch (err) {
      cb(err);
      return;
    }
    cb(null, parsed);
  });
}

/* istanbul ignore next */
function file$1(filePath, parser, parserOptions, cb) {
  var data = fs.readFileSync(filePath, 'utf8');
  var fileFormat = discernFormat(filePath);
  if ((fileFormat === 'json' || formatsIndex.json.indexOf(fileFormat) > -1) && data === '') {
    data = '[]';
  }

  data = stripBom(data);
  var parsed;
  if (typeof parser === 'function') {
    parsed = parser(data, parserOptions);
  } else if ((typeof parser === 'undefined' ? 'undefined' : _typeof(parser)) === 'object' && typeof parser.parse === 'function') {
    parsed = parser.parse(data, parserOptions);
  } else {
    return new Error('Your specified parser is not properly formatted. It must either be a function or have a `parse` method.');
  }

  return parsed;
}

/* istanbul ignore next */
var shapefile = require('shapefile');
function dbf(filePath, parser, parserOptions, cb) {
  var values = [];
  parserOptions = parserOptions || {};
  var map = parserOptions.map || identity$1;
  var i = 0;
  shapefile.openDbf(filePath).then(function (source) {
    return source.read().then(function log(result) {
      i++;
      if (result.done) return cb(null, values);
      values.push(map(result.value, i));
      return source.read().then(log);
    });
  }).catch(function (error) {
    return cb(error.stack);
  });
}

var loaders = {
  async: {
    aml: file,
    csv: file,
    psv: file,
    tsv: file,
    txt: file,
    json: file,
    dbf: dbf
  },
  sync: {
    aml: file$1,
    csv: file$1,
    psv: file$1,
    tsv: file$1,
    txt: file$1,
    json: file$1
  }
};

formatsList.forEach(function (format) {
  format.equivalents.forEach(function (equivalent) {
    Object.keys(loaders).forEach(function (key) {
      loaders[key][equivalent] = loaders[key][format.name];
    });
  });
});

function discernLoader(filePath) {
  var opts_ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var which = opts_.sync === true ? 'sync' : 'async';
  var format = discernFormat(filePath);
  var loader = loaders[which][format];
  // If we don't have a loader for this format, read in as a normal file
  if (typeof loader === 'undefined') {
    loader = loaders[which]['txt'];
  }
  return loader;
}

/* istanbul ignore next */
/**
 * Asynchronously read data given a path ending in the file format.
 *
 * Supported formats / extensions:
 *
 * * `.json` Array of objects or object
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.aml` ArchieML
 * * `.txt` Text file (a string)
 * * `.dbf` Database format used for shapefiles
 * * other All others are read as a text file
 *
 * @function readData
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {String|Function|Object} [parserOptions.parser] This can be a string that is the file's delimiter, a function that returns JSON, or, for convenience, can also be a dsv object such as `dsv.dsv('_')` or any object that has a `parse` method that's a function. See `parsers` in library source for examples.
 * @param {Function} [parserOptions.map] Transformation function. See {@link directReaders} for format-specific function signature. In brief, tabular formats get passed a `(row, i, columns)` and must return the modified row. Text or AML formats are passed the full document and must return the modified document. JSON arrays are mapped like tabular documents with `(row, i)` and return the modified row. JSON objects are mapped with Underscore's `_.mapObject` with `(value, key)` and return the modified value.
 * @param {Function} [parserOptions.reviver] Used for JSON files, otherwise ignored. See {@link readJson} for details.
 * @param {Function} [parserOptions.filename] Used for JSON files, otherwise ignored. See {@link readJson} for details.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readData('path/to/data.tsv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Parser specified as a string
 * io.readData('path/to/data.usv', {parser: '_'}, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Parser specified as a function
 * var myParser = dsv.dsv('_').parse
 * // var myParser = dsv.dsv('_') // This also works
 * io.readData('path/to/data.usv', {parser: myParser}, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Parser specified as a function
 * var naiveJsonLines = function (dataAsString) {
 *   return dataAsString.split('\n').map(function (row) { return JSON.parse(row) })
 * }
 * io.readData('path/to/data.jsonlines', {parser: naiveJsonLines}, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Shorthand for specifying a map function
 * io.readData('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Explicitly specify a map function and a filename for a json file. See `readJson` for more details
 * io.readData('path/to/data.json', {
 *   map: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 */
function readData(filePath, opts_, cb_) {
  var cb = arguments[arguments.length - 1];
  var parser;
  var parserOptions;
  if (arguments.length === 3) {
    if (opts_.parser) {
      parser = getParser(opts_.parser);
      opts_ = omit$1(opts_, ['parser']);
      if (_.isEmpty(opts_)) {
        opts_ = undefined;
      }
    } else {
      parser = discernParser(filePath);
    }

    if (opts_ && opts_.parserOptions) {
      if (typeof opts_.parserOptions === 'function') {
        parserOptions = { map: opts_.parserOptions };
      } else {
        parserOptions = opts_.parserOptions;
      }
    } else if (opts_) {
      if (typeof opts_ === 'function') {
        parserOptions = { map: opts_ };
      } else {
        parserOptions = opts_;
      }
    }
  } else {
    parser = discernParser(filePath);
  }
  var loader = discernLoader(filePath);
  loader(filePath, parser, parserOptions, cb);
}

'use strict';

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

var index$1 = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};

var index$3 = createCommonjsModule(function (module) {
	'use strict';

	function assembleStyles() {
		var styles = {
			modifiers: {
				reset: [0, 0],
				bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
				dim: [2, 22],
				italic: [3, 23],
				underline: [4, 24],
				inverse: [7, 27],
				hidden: [8, 28],
				strikethrough: [9, 29]
			},
			colors: {
				black: [30, 39],
				red: [31, 39],
				green: [32, 39],
				yellow: [33, 39],
				blue: [34, 39],
				magenta: [35, 39],
				cyan: [36, 39],
				white: [37, 39],
				gray: [90, 39]
			},
			bgColors: {
				bgBlack: [40, 49],
				bgRed: [41, 49],
				bgGreen: [42, 49],
				bgYellow: [43, 49],
				bgBlue: [44, 49],
				bgMagenta: [45, 49],
				bgCyan: [46, 49],
				bgWhite: [47, 49]
			}
		};

		// fix humans
		styles.colors.grey = styles.colors.gray;

		Object.keys(styles).forEach(function (groupName) {
			var group = styles[groupName];

			Object.keys(group).forEach(function (styleName) {
				var style = group[styleName];

				styles[styleName] = group[styleName] = {
					open: '\u001b[' + style[0] + 'm',
					close: '\u001b[' + style[1] + 'm'
				};
			});

			Object.defineProperty(styles, groupName, {
				value: group,
				enumerable: false
			});
		});

		return styles;
	}

	Object.defineProperty(module, 'exports', {
		enumerable: true,
		get: assembleStyles
	});
});

'use strict';

var index$7 = function () {
	return (/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g
	);
};

'use strict';
var ansiRegex = index$7();

var index$5 = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};

'use strict';
var ansiRegex$1 = index$7;
var re = new RegExp(ansiRegex$1().source); // remove the `g` flag
var index$9 = re.test.bind(re);

'use strict';

var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function (flag) {
	flag = '--' + flag;
	var pos = argv.indexOf(flag);
	return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

var index$11 = function () {
	if ('FORCE_COLOR' in process.env) {
		return true;
	}

	if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
		return false;
	}

	if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
		return true;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in process.env) {
		return true;
	}

	if (process.env.TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return true;
	}

	return false;
}();

'use strict';
var escapeStringRegexp = index$1;
var ansiStyles = index$3;
var stripAnsi = index$5;
var hasAnsi = index$9;
var supportsColor = index$11;
var defineProps = Object.defineProperties;
var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

function Chalk(options) {
	// detect mode if not set manually
	this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001b[94m';
}

var styles = function () {
	var ret = {};

	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

		ret[key] = {
			get: function () {
				return build.call(this, this._styles.concat(key));
			}
		};
	});

	return ret;
}();

var proto = defineProps(function chalk() {}, styles);

function build(_styles) {
	var builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder.enabled = this.enabled;
	// __proto__ is used because we must return a function, but there is
	// no way to create a function with a different prototype.
	/* eslint-disable no-proto */
	builder.__proto__ = proto;

	return builder;
}

function applyStyle() {
	// support varags, but simply cast to string in case there's only one arg
	var args = arguments;
	var argsLen = args.length;
	var str = argsLen !== 0 && String(arguments[0]);

	if (argsLen > 1) {
		// don't slice `arguments`, it prevents v8 optimizations
		for (var a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || !str) {
		return str;
	}

	var nestedStyles = this._styles;
	var i = nestedStyles.length;

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	var originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
		ansiStyles.dim.open = '';
	}

	while (i--) {
		var code = ansiStyles[nestedStyles[i]];

		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;
	}

	// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
	ansiStyles.dim.open = originalDim;

	return str;
}

function init() {
	var ret = {};

	Object.keys(styles).forEach(function (name) {
		ret[name] = {
			get: function () {
				return build.call(this, [name]);
			}
		};
	});

	return ret;
}

defineProps(Chalk.prototype, init());

var index = new Chalk();
var styles_1 = ansiStyles;
var hasColor = hasAnsi;
var stripColor = stripAnsi;
var supportsColor_1 = supportsColor;

index.styles = styles_1;
index.hasColor = hasColor;
index.stripColor = stripColor;
index.supportsColor = supportsColor_1;

/* istanbul ignore next */
var notListError = function (format) {
  throw new Error(index.red('[indian-ocean] You passed in an object but converting to ' + index.bold(format) + ' requires a list of objects.') + index.cyan('\nIf you would like to write a one-row csv, put your object in a list like so: `' + index.bold('[data]') + '`\n'));
};

// Some shared data integrity checks for formatters
function formattingPreflight(file, format) {
  if (file === '') {
    return [];
  } else if (!Array.isArray(file)) {
    notListError(format);
  }
  return file;
}

/* istanbul ignore next */
var parseError = function (format) {
  throw new Error(index.red('[indian-ocean] Error converting your data to ' + index.bold(format) + '.') + '\n\n' + index.cyan('Your data most likely contains objects or lists. Object values can only be strings for this format. Please convert before writing to file.\n'));
};

/* istanbul ignore next */
var csv$1 = function (file, writeOptions) {
  writeOptions = writeOptions || {};
  file = formattingPreflight(file, 'csv');
  try {
    return csvFormat(file, writeOptions.columns);
  } catch (err) {
    parseError('csv');
  }
};

var json = function (file, writeOptions) {
  writeOptions = writeOptions || {};
  return JSON.stringify(file, writeOptions.replacer, writeOptions.indent);
};

/* istanbul ignore next */
var psv = function (file, writeOptions) {
  writeOptions = writeOptions || {};
  file = formattingPreflight(file, 'psv');
  try {
    return dsvFormat('|').format(file, writeOptions.columns);
  } catch (err) {
    parseError('psv');
  }
};

/* istanbul ignore next */
var tsv$1 = function (file, writeOptions) {
  writeOptions = writeOptions || {};
  file = formattingPreflight(file, 'tsv');
  try {
    return tsvFormat(file, writeOptions.columns);
  } catch (err) {
    parseError('tsv');
  }
};

var txt = function (file) {
  return file;
};

var fieldsize = {
    // string
    C: 254,
    // boolean
    L: 1,
    // date
    D: 8,
    // number
    N: 18,
    // number
    M: 18,
    // number, float
    F: 18,
    // number
    B: 8
};

/**
 * @param {string} str
 * @param {number} len
 * @param {string} char
 * @returns {string}
 */
var lpad = function lpad(str, len, char) {
  while (str.length < len) {
    str = char + str;
  }return str;
};

/**
 * @param {string} str
 * @param {number} len
 * @param {string} char
 * @returns {string}
 */
var rpad = function rpad(str, len, char) {
  while (str.length < len) {
    str = str + char;
  }return str;
};

/**
 * @param {object} view
 * @param {number} fieldLength
 * @param {string} str
 * @param {number} offset
 * @returns {number}
 */
var writeField = function writeField(view, fieldLength, str, offset) {
  for (var i = 0; i < fieldLength; i++) {
    view.setUint8(offset, str.charCodeAt(i));offset++;
  }
  return offset;
};

var lib$1 = {
  lpad: lpad,
  rpad: rpad,
  writeField: writeField
};

var fieldSize$1 = fieldsize;

var types = {
    string: 'C',
    number: 'N',
    boolean: 'L',
    // type to use if all values of a field are null
    null: 'C'
};

var multi_1 = multi;
var bytesPer_1 = bytesPer;
var obj_1 = obj;

function multi(features) {
    var fields = {};
    features.forEach(collect);
    function collect(f) {
        inherit(fields, f);
    }
    return obj(fields);
}

/**
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
function inherit(a, b) {
    for (var i in b) {
        var isDef = typeof b[i] !== 'undefined' && b[i] !== null;
        if (typeof a[i] === 'undefined' || isDef) {
            a[i] = b[i];
        }
    }
    return a;
}

function obj(_) {
    var fields = {},
        o = [];
    for (var p in _) fields[p] = _[p] === null ? 'null' : typeof _[p];
    for (var n in fields) {
        var t = types[fields[n]];
        if (t) {
            o.push({
                name: n,
                type: t,
                size: fieldSize$1[t]
            });
        }
    }
    return o;
}

/**
 * @param {Array} fields
 * @returns {Array}
 */
function bytesPer(fields) {
    // deleted flag
    return fields.reduce(function (memo, f) {
        return memo + f.size;
    }, 1);
}

var fields$1 = {
    multi: multi_1,
    bytesPer: bytesPer_1,
    obj: obj_1
};

var lib = lib$1;
var fields = fields$1;

/**
 * @param {Array} data
 * @param {Array} meta
 * @returns {Object} view
 */
var structure$1 = function structure(data, meta) {

    var field_meta = meta || fields.multi(data),
        fieldDescLength = 32 * field_meta.length + 1,
        bytesPerRecord = fields.bytesPer(field_meta),
        // deleted flag
    buffer = new ArrayBuffer(
    // field header
    fieldDescLength +
    // header
    32 +
    // contents
    bytesPerRecord * data.length +
    // EOF marker
    1),
        now = new Date(),
        view = new DataView(buffer);

    // version number - dBase III
    view.setUint8(0, 0x03);
    // date of last update
    view.setUint8(1, now.getFullYear() - 1900);
    view.setUint8(2, now.getMonth() + 1);
    view.setUint8(3, now.getDate());
    // number of records
    view.setUint32(4, data.length, true);

    // length of header
    var headerLength = fieldDescLength + 32;
    view.setUint16(8, headerLength, true);
    // length of each record
    view.setUint16(10, bytesPerRecord, true);

    // Terminator
    view.setInt8(32 + fieldDescLength - 1, 0x0D);

    field_meta.forEach(function (f, i) {
        // field name
        f.name.split('').slice(0, 10).forEach(function (c, x) {
            view.setInt8(32 + i * 32 + x, c.charCodeAt(0));
        });
        // field type
        view.setInt8(32 + i * 32 + 11, f.type.charCodeAt(0));
        // field length
        view.setInt8(32 + i * 32 + 16, f.size);
        if (f.type == 'N') view.setInt8(32 + i * 32 + 17, 3);
    });

    var offset = fieldDescLength + 32;

    data.forEach(function (row, num) {
        // delete flag: this is not deleted
        view.setUint8(offset, 32);
        offset++;
        field_meta.forEach(function (f) {
            var val = row[f.name];
            if (val === null || typeof val === 'undefined') val = '';

            switch (f.type) {
                // boolean
                case 'L':
                    view.setUint8(offset, val ? 84 : 70);
                    offset++;
                    break;

                // date
                case 'D':
                    offset = lib.writeField(view, 8, lib.lpad(val.toString(), 8, ' '), offset);
                    break;

                // number
                case 'N':
                    offset = lib.writeField(view, f.size, lib.lpad(val.toString(), f.size, ' ').substr(0, 18), offset);
                    break;

                // string
                case 'C':
                    offset = lib.writeField(view, f.size, lib.rpad(val.toString(), f.size, ' '), offset);
                    break;

                default:
                    throw new Error('Unknown field type');
            }
        });
    });

    // EOF flag
    view.setUint8(offset, 0x1A);

    return view;
};

var structure = structure$1;

var index$13 = {
	structure: structure
};

/* istanbul ignore next */
var dbf$1 = function (file, writeOptions) {
  writeOptions = writeOptions || {};
  function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  }
  var buf = index$13.structure(file);
  return toBuffer(buf.buffer);
};

var formatters = {
  csv: csv$1,
  json: json,
  psv: psv,
  tsv: tsv$1,
  txt: txt,
  dbf: dbf$1
};

formatsList.forEach(function (format) {
  format.equivalents.forEach(function (equivalent) {
    formatters[equivalent] = formatters[format.name];
  });
});

/**
 * Returns a formatter that will format json data to file type specified by the extension in `filePath`. Used internally by {@link writeData} and {@link writeDataSync}.
 *
 * @function discernFileFormatter
 * @param {String} filePath Input file path
 * @returns {Function} A formatter function that will write the extension format
 *
 * @example
 * var formatter = io.discernFileFormatter('path/to/data.tsv')
 * var csv = formatter(json)
 */
function discernFileFormatter(filePath) {
  var format = discernFormat(filePath);
  var formatter = formatters[format];
  // If we don't have a parser for this format, return as text
  if (typeof formatter === 'undefined') {
    formatter = formatters['txt'];
  }
  return formatter;
}

var path$1 = path;
var fs$1 = fs;
var _0777 = parseInt('0777', 8);

var index$14 = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP(p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    } else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }

    var mode = opts.mode;
    var xfs = opts.fs || fs$1;

    if (mode === undefined) {
        mode = _0777;
    }
    if (!made) made = null;

    var cb = f || function () {};
    p = path$1.resolve(p);

    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                if (path$1.dirname(p) === p) return cb(er);
                mkdirP(path$1.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made);else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync(p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }

    var mode = opts.mode;
    var xfs = opts.fs || fs$1;

    if (mode === undefined) {
        mode = _0777;
    }
    if (!made) made = null;

    p = path$1.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    } catch (err0) {
        switch (err0.code) {
            case 'ENOENT':
                made = sync(path$1.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                } catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

/* istanbul ignore next */
/**
 * Asynchronously create directories along a given file path. Delegates to [mkdirp](http://npmjs.org/package/mkdirp) module. If the last element in your file path is also a folder, it must end in `/` or else it will be interpreted as a file and not created.
 *
 * @function makeDirectories
 * @param {String} outPath The path to a file
 * @param {Function} callback The function to do once this is done. Has signature of `(err)`
 *
 * @example
 * io.makeDirectories('path/to/create/to/data.tsv', function (err) {
 *   console.log(err) // null
 * })
 *
 * // Must end in `/` for the last item to be interpreted as a folder as well.
 * io.makeDirectories('path/to/create/to/another-folder/', function (err) {
 *   console.log(err) // null
 * })
 *
 */
function makeDirectories(outPath, cb) {
  index$14(dirname(outPath), function (err) {
    cb(err);
  });
}

/* istanbul ignore next */
var warn = function (msg) {
  console.log(index.gray('[indian-ocean]') + ' ' + index.yellow('Warning:', msg));
};

function warnIfEmpty(data, outPath, opts_) {
  if (!opts_ || opts_ && opts_.verbose !== false) {
    if (!data || _.isEmpty(data)) {
      var msg = 'You didn\'t pass any data to write for file: `' + outPath + '`. Writing out an empty ';
      if (!data) {
        msg += 'file';
      } else if (_.isEmpty(data)) {
        msg += Array.isArray(data) === true ? 'array' : 'object';
      }
      msg += '...';
      warn(msg);
    }
  }
}

/* istanbul ignore next */
/* istanbul ignore next */
/**
 * Write the data object, inferring the file format from the file ending specified in `fileName`.
 *
 * Supported formats:
 *
 * * `.json` Array of objects, also supports `.geojson` and `.topojson`
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.dbf` Database file, commonly used in ESRI-shapefile format.
 *
 * @function writeData
 * @param {String} filePath Input file path
 * @param {Array|Object|String} data Data to write
 * @param {Object} [options] Optional options object, see below
 * @param {Boolean} [options.makeDirectories=false] If `true`, create intermediate directories to your data file. Can also be `makeDirs` for short.
 * @param {Function|Array} [options.replacer] Used for JSON formats. Function to filter your objects before writing or an array of whitelisted keys to keep. Examples below. See JSON.stringify docs for more info https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 * @param {Boolean} [options.verbose=true] Verbose logging output. Currently, the only logging output is a warning if you write an empty file. Set to `false` if don't want that.
 * @param {Number} [options.indent] Used for JSON format. Specifies indent level. Default is `0`.
 * @param {Array} [options.columns] Used for tabular formats. Optionally specify a list of column names to use. Otherwise they are detected from the data. See `d3-dsv` for more detail: https://github.com/d3/d3-dsv/blob/master/README.md#dsv_format
 * @param {Function} callback Has signature `(err, dataStr)`. `dataStr` is the data that was written out as a string
 *
 * @example
 * io.writeData('path/to/data.json', jsonData, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true}, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/to/data.json', jsonData, {indent: 4}, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: function (key, value) {
 *     // Filtering out string properties
 *     if (typeof value === "string") {
 *       return undefined
 *     }
 *     return value
 *   }
 * }, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: ['name', 'occupation'] // Only keep "name" and "occupation" values
 * }, function (err, dataString) {
 *   console.log(err)
 * })
 */
function writeData(outPath, data, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_;
    opts_ = undefined;
  }
  warnIfEmpty(data, outPath, opts_);

  if ((typeof opts_ === 'undefined' ? 'undefined' : _typeof(opts_)) === 'object' && (opts_.makeDirectories === true || opts_.makeDirs === true)) {
    makeDirectories(outPath, proceed);
  } else {
    proceed();
  }

  function proceed(err) {
    if (err) {
      throw err;
    }

    opts_ = omit$1(opts_, ['makeDirectories', 'makeDirs']);
    var writeOptions;
    if (typeof opts_ !== 'function') {
      writeOptions = opts_;
    }

    var fileFormatter = discernFileFormatter(outPath);
    var formattedData = fileFormatter(data, writeOptions);
    fs.writeFile(outPath, formattedData, function (err) {
      cb(err, formattedData);
    });
  }
}

/**
 * Reads in data given a path ending in the file format with {@link readData} and writes to file using {@link writeData}. A convenience function for converting files to more other formats. All formats can convert to all others except as long as they are lists. For example, you can't convert an object-based aml file to a list format.
 *
 * @function convertData
 * @param {String} inFilePath Input file path
 * @param {String} outFilePath Output file path
 * @param {Object} [options] Optional config object that's passed to {@link writeData}. See that documentation for full options, which vary depending on the output format you choose.
 * @param {Function} callback Has signature `(err, dataStr)`. `dataStr` is the data that was written out as a string
 *
 * @example
 * io.convertData('path/to/data.dbf', 'path/to/data.csv', function (err, dataStr) {
 *   console.log(err)
 * })
 *
 * io.convertData('path/to/data.tsv', 'path/to/create/to/data.dbf', {makeDirectories: true}, function (err, dataStr) {
 *   console.log(err)
 * })
 */
function convertData(inPath, outPath, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_;
  }
  readData(inPath, function (error, jsonData) {
    if (error) {
      cb(error);
    } else {
      writeData(outPath, jsonData, opts_, cb);
    }
  });
}

/**
 * Asynchronously read a dbf file. Returns an empty array if file is empty.
 *
 * @function readDbf
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Called once for each row with the signature `(row, i)` and must return the transformed row. See example below.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readDbf('path/to/data.dbf', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readDbf('path/to/data.csv', function (row, i) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Converted json data
 * })
 */
function readDbf(filePath, opts_, cb) {
  var parserOptions = {
    map: identity$1
  };
  if (typeof cb === 'undefined') {
    cb = opts_;
  } else {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  readData(filePath, parserOptions, cb);
}

/**
 * Reads in a dbf file with {@link readData} and write to file using {@link writeData}. A convenience function for converting DBFs to more useable formats. Formerly known as `writeDbfToData` and is aliased for legacy support.
 *
 * @function convertDbfToData
 * @param {String} inFilePath Input file path
 * @param {String} outFilePath Output file path
 * @param {Object} [options] Optional config object that's passed to {@link writeData}. See that documentation for full options, which vary depending on the output format you choose.
 * @param {Function} callback Has signature `(err, dataStr)`. `dataStr` is the data that was written out as a string
 *
 * @example
 * io.convertDbfToData('path/to/data.dbf', 'path/to/data.csv', function (err, dataStr) {
 *   console.log(err)
 * })
 *
 * io.convertDbfToData('path/to/data.dbf', 'path/to/create/to/data.csv', {makeDirectories: true}, function (err, dataStr) {
 *   console.log(err)
 * })
 */
function convertDbfToData(inPath, outPath, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_;
  }
  readDbf(inPath, function (error, jsonData) {
    if (error) {
      cb(error);
    } else {
      writeData(outPath, jsonData, opts_, cb);
    }
  });
}

/* istanbul ignore next */
/**
 * Asynchronously test whether a file exists or not by using `fs.access` modified from https://github.com/nodejs/io.js/issues/1592#issuecomment-98392899.
 *
 * @function exists
 * @param {String} filePath Input file path
 * @param {Function} callback Has signature `(err, exists)`
 *
 * @example
 * var exists = io.exists('path/to/data.tsv', function (err, exists) {
 *   console.log(exists) // `true` if the file exists, `false` if not.
 * })
 *
 */
function exists(filePath, cb) {
  fs.access(filePath, function (err) {
    var exists;
    if (err && err.code === 'ENOENT') {
      exists = false;
      err = null;
    } else if (!err) {
      exists = true;
    }
    cb(err, exists);
  });
}

/* istanbul ignore next */
/**
 * Syncronous version of {@link exists}. Delegates to `fs.existsSync` if that function is available.
 *
 * @function existsSync
 * @param {String} filePath Input file path
 * @returns {Boolean} Whether the file exists or not
 *
 * @example
 * var exists = io.existsSync('path/to/data.tsv')
 * console.log(exists) // `true` if file exists, `false` if not.
 */
function existsSync(filePath) {
  if (fs.existsSync) {
    return fs.existsSync(filePath);
  } else {
    try {
      fs.accessSync(filePath);
      return true;
    } catch (ex) {
      return false;
    }
  }
}

/**
 * Test whether a file name has the given extension
 *
 * @function extMatchesStr
 * @param {String} filePath Input file path
 * @param {String} extension The extension to test. An empty string will match a file with no extension.
 * @returns {Boolean} Whether it matched or not.
 *
 * @example
 * var matches = io.extMatchesStr('path/to/data.tsv', 'tsv')
 * console.log(matches) // `true`
 */
function extMatchesStr(filePath, extension) {
  // Chop '.' off extension returned by extname
  var ext = extname(filePath).slice(1);
  return ext === extension;
}

/* istanbul ignore next */
/**
 * Synchronous version of {@link makeDirectories}. Delegates to [mkdirp](http://npmjs.org/package/mkdirp) module.
 *
 * @function makeDirectoriesSync
 * @param {String} outPath The path to a file
 *
 * @example
 * io.makeDirectoriesSync('path/to/create/to/data.tsv')
 *
 * @example
 * // Must end in `/` for the last item to be interpreted as a folder as well.
 * io.makeDirectoriesSync('path/to/create/to/another-folder/')
 *
 */
function makeDirectoriesSync(outPath) {
  index$14.sync(dirname(outPath));
}

/**
 * Test whether a string matches a given Regular Expression.
 *
 * @function matchesRegExp
 * @param {String} filePath Input file path or file path.
 * @param {RegExp} RegExp The Regular Expression to match against.
 * @returns {Boolean} Whether they match.
 *
 * @example
 * var matches = io.matchesRegExp('.gitignore', /\.gitignore/)
 * console.log(matches) // `true`
 *
 * var matches = io.matchesRegExp('data/final-data/basic.csv', /\/final-data\//)
 * console.log(matches) // `true`
 */
function matchesRegExp(filePath, regEx) {
  return regEx.test(filePath);
}

function isRegExp$1(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}

/**
 * Test whether a file name or path matches a given matcher. Delegates to {@link extMatchesStr} if `matcher` is a string` and tests only against the file name extension. Delegates to {@link matchesRegExp} if matcher is a Regular Expression and tests against entire string, which is usefulf or testing the full file path.
 *
 * @function matches
 * @param {String} filePath Input file path or path to the file.
 * @returns {String|RegExp} matcher The string or Regular Expression to match against.
 *
 * @example
 * var matches = io.matches('path/to/data.tsv', 'tsv')
 * console.log(matches) // `true`
 *
 * var matches = io.matches('.gitignore', /\.gitignore/)
 * console.log(matches) // `true`
 *
 * var matches = io.matches('file/with/no-extention', '') // Nb. Dot files are treated as files with no extention
 * console.log(matches) // `true`
 */
function matches(filePath, matcher) {
  if (typeof matcher === 'string') {
    return extMatchesStr(filePath, matcher);
  } else if (isRegExp$1(matcher)) {
    return matchesRegExp(filePath, matcher);
  } else {
    throw new Error('Matcher argument must be String or Regular Expression');
  }
}

/* istanbul ignore next */
/**
 * Syncronous version of {@link readData}. Read data given a path ending in the file format. This function detects the same formats as the asynchronous {@link readData} except for `.dbf` files, which it cannot read.
 *
 * * `.json` Array of objects or object
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.aml` ArchieML
 * * `.txt` Text file (a string)
 * * other All others are read as a text file
 *
 * @function readDataSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {String|Function|Object} [parserOptions.parser] This can be a string that is the file's delimiter, a function that returns JSON, or, for convenience, can also be a dsv object such as `dsv.dsv('_')` or any object that has a `parse` method that's a function. See `parsers` in library source for examples.
 * @param {Function} [parserOptions.map] Transformation function. See {@link directReaders} for format-specific function signature. In brief, tabular formats get passed a `(row, i, columns)` and must return the modified row. Text or AML formats are passed the full document and must return the modified document. JSON arrays are mapped like tabular documents with `(row, i)` and return the modified row. JSON objects are mapped with Underscore's `_.mapObject` with `(value, key)` and return the modified value.
 * @param {Function} [parserOptions.reviver] Used for JSON files, otherwise ignored. See {@link readJsonSync} for details.
 * @param {Function} [parserOptions.filename] Used for JSON files, otherwise ignored. See {@link readJsonSync} for details.
 * @returns {Object} the contents of the file as JSON
 *
 * @example
 * var data = io.readDataSync('path/to/data.tsv')
 * console.log(data) // Json data
 *
 * // Parser specified as a string
 * var data = io.readDataSync('path/to/data.usv', {parser: '_'})
 * console.log(data) // Json data
 *
 * // Parser specified as a function
 * var myParser = dsv.dsv('_').parse
 * // var myParser = dsv.dsv('_') // This also works
 * var data = io.readDataSync('path/to/data.usv', {parser: myParser})
 * console.log(data) // Json data
 *
 * // Parser as an object with a `parse` method
 * var naiveJsonLines = function(dataAsString) {
 *   return dataAsString.split('\n').map(function (row) { return JSON.parse(row) })
 * }
 * var data = io.readDataSync('path/to/data.jsonlines', {parser: naiveJsonLines})
 * console.log(data) // Json data
 *
 * // Shorthand for specifying a map function
 * var data = io.readData('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data
 *
 * // Explicitly specify a map function and a filename for a json file. See `readJson` for more details
 * var data = io.readData('path/to/data.json', {
 *   map: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * })
 * console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 */
function readDataSync(filePath, opts_) {
  var parser;
  var parserOptions;
  if (arguments.length === 2) {
    if (opts_.parser) {
      parser = getParser(opts_.parser);
      opts_ = omit$1(opts_, ['parser']);
      if (_.isEmpty(opts_)) {
        opts_ = undefined;
      }
    } else {
      parser = discernParser(filePath);
    }

    if (opts_ && opts_.parserOptions) {
      if (typeof opts_.parserOptions === 'function') {
        parserOptions = { map: opts_.parserOptions };
      } else {
        parserOptions = opts_.parserOptions;
      }
    } else if (opts_) {
      if (typeof opts_ === 'function') {
        parserOptions = { map: opts_ };
      } else {
        parserOptions = opts_;
      }
    }
  } else {
    parser = discernParser(filePath);
  }
  var loader = discernLoader(filePath, { sync: true });
  return loader(filePath, parser, parserOptions);
}

var slice$1 = [].slice;

var noabort = {};

function Queue(size) {
  this._size = size;
  this._call = this._error = null;
  this._tasks = [];
  this._data = [];
  this._waiting = this._active = this._ended = this._start = 0; // inside a synchronous task callback?
}

Queue.prototype = queue.prototype = {
  constructor: Queue,
  defer: function (callback) {
    if (typeof callback !== "function") throw new Error("invalid callback");
    if (this._call) throw new Error("defer after await");
    if (this._error != null) return this;
    var t = slice$1.call(arguments, 1);
    t.push(callback);
    ++this._waiting, this._tasks.push(t);
    poke(this);
    return this;
  },
  abort: function () {
    if (this._error == null) abort(this, new Error("abort"));
    return this;
  },
  await: function (callback) {
    if (typeof callback !== "function") throw new Error("invalid callback");
    if (this._call) throw new Error("multiple await");
    this._call = function (error, results) {
      callback.apply(null, [error].concat(results));
    };
    maybeNotify(this);
    return this;
  },
  awaitAll: function (callback) {
    if (typeof callback !== "function") throw new Error("invalid callback");
    if (this._call) throw new Error("multiple await");
    this._call = callback;
    maybeNotify(this);
    return this;
  }
};

function poke(q) {
  if (!q._start) {
    try {
      start(q);
    } // let the current task complete
    catch (e) {
      if (q._tasks[q._ended + q._active - 1]) abort(q, e); // task errored synchronously
      else if (!q._data) throw e; // await callback errored synchronously
    }
  }
}

function start(q) {
  while (q._start = q._waiting && q._active < q._size) {
    var i = q._ended + q._active,
        t = q._tasks[i],
        j = t.length - 1,
        c = t[j];
    t[j] = end(q, i);
    --q._waiting, ++q._active;
    t = c.apply(null, t);
    if (!q._tasks[i]) continue; // task finished synchronously
    q._tasks[i] = t || noabort;
  }
}

function end(q, i) {
  return function (e, r) {
    if (!q._tasks[i]) return; // ignore multiple callbacks
    --q._active, ++q._ended;
    q._tasks[i] = null;
    if (q._error != null) return; // ignore secondary errors
    if (e != null) {
      abort(q, e);
    } else {
      q._data[i] = r;
      if (q._waiting) poke(q);else maybeNotify(q);
    }
  };
}

function abort(q, e) {
  var i = q._tasks.length,
      t;
  q._error = e; // ignore active callbacks
  q._data = undefined; // allow gc
  q._waiting = NaN; // prevent starting

  while (--i >= 0) {
    if (t = q._tasks[i]) {
      q._tasks[i] = null;
      if (t.abort) {
        try {
          t.abort();
        } catch (e) {/* ignore */}
      }
    }
  }

  q._active = NaN; // allow notification
  maybeNotify(q);
}

function maybeNotify(q) {
  if (!q._active && q._call) {
    var d = q._data;
    q._data = undefined; // allow gc
    q._call(q._error, d);
  }
}

function queue(concurrency) {
  if (concurrency == null) concurrency = Infinity;else if (!((concurrency = +concurrency) >= 1)) throw new Error("invalid concurrency");
  return new Queue(concurrency);
}

// Used internally by `readdir` functions to make more DRY
/* istanbul ignore next */
/* istanbul ignore next */
function readdir(modeInfo, dirPath, opts_, cb) {
  opts_ = opts_ || {};
  var isAsync = modeInfo.async;

  // Convert to array if a string
  opts_.include = strToArray(opts_.include);
  opts_.exclude = strToArray(opts_.exclude);

  if (opts_.skipHidden === true) {
    var regex = /^\./;
    if (Array.isArray(opts_.exclude)) {
      opts_.exclude.push(regex);
    } else {
      opts_.exclude = [regex];
    }
  }

  // Set defaults if not provided
  opts_.includeMatchAll = opts_.includeMatchAll ? 'every' : 'some';
  opts_.excludeMatchAll = opts_.excludeMatchAll ? 'every' : 'some';

  if (isAsync === true) {
    fs.readdir(dirPath, function (err, files) {
      if (err) {
        throw err;
      }
      filter(files, cb);
    });
  } else {
    return filterSync(fs.readdirSync(dirPath));
  }

  function strToArray(val) {
    if (val && !Array.isArray(val)) {
      val = [val];
    }
    return val;
  }

  function filterByType(file, cb) {
    // We need the full path so convert it if it isn't already
    var filePath = opts_.fullPath ? file : joinPath(dirPath, file);

    if (isAsync === true) {
      fs.stat(filePath, function (err, stats) {
        var filtered = getFiltered(stats.isDirectory());
        cb(err, filtered);
      });
    } else {
      return getFiltered(fs.statSync(filePath).isDirectory());
    }

    function getFiltered(isDir) {
      // Keep the two names for legacy reasons
      if (opts_.skipDirectories === true || opts_.skipDirs === true) {
        if (isDir) {
          return false;
        }
      }
      if (opts_.skipFiles === true) {
        if (!isDir) {
          return false;
        }
      }
      return file;
    }
  }

  function filterByMatchers(files) {
    var filtered = files.filter(function (fileName) {
      var isExcluded;
      var isIncluded;

      // Don't include if matches exclusion matcher
      if (opts_.exclude) {
        isExcluded = opts_.exclude[opts_.excludeMatchAll](function (matcher) {
          return matches(fileName, matcher);
        });
        if (isExcluded === true) {
          return false;
        }
      }

      // Include if matches inclusion matcher, exclude if it doesn't
      if (opts_.include) {
        isIncluded = opts_.include[opts_.includeMatchAll](function (matcher) {
          return matches(fileName, matcher);
        });
        return isIncluded;
      }

      // Return true if it makes it to here
      return true;
    });

    // Prefix with the full path if that's what we asked for
    if (opts_.fullPath === true) {
      return filtered.map(function (fileName) {
        return joinPath(dirPath, fileName);
      });
    }

    return filtered;
  }

  function filterSync(files) {
    var filtered = filterByMatchers(files);

    return filtered.map(function (file) {
      return filterByType(file);
    }).filter(identity$1);
  }

  function filter(files, cb) {
    var filterQ = queue();

    var filtered = filterByMatchers(files);

    filtered.forEach(function (fileName) {
      filterQ.defer(filterByType, fileName);
    });

    filterQ.awaitAll(function (err, namesOfType) {
      cb(err, namesOfType.filter(identity$1));
    });
  }
}

/**
 * Asynchronously get a list of a directory's files and folders if certain critera are met.
 *
 * @function readdirFilter
 * @param {String} dirPath The directory to read from
 * @param {Object} options Filter options, see below
 * @param {Boolean} [options.fullPath=false] If `true`, return the full path of the file, otherwise just return the file name.
 * @param {Boolean} [options.skipFiles=false] If `true`, omit files from results.
 * @param {Boolean} [options.skipDirs=false] If `true`, omit directories from results.
 * @param {Boolean} [options.skipHidden=false] If `true`, omit files that start with a dot from results. Shorthand for `{exclude: /^\./}`.
 * @param {String|RegExp|Array<String|RegExp>} options.include If given a string, return files that have that string as their extension. If given a Regular Expression, return the files whose name matches the pattern. Can also take a list of either type. List matching behavior is described in `includeMatchAll`.
 * @param {String|RegExp|Array<String|RegExp>} options.exclude If given a string, return files that do not have that string as their extension. If given a Regular Expression, omit files whose name matches the pattern. Can also take a list of either type. List matching behavior is described in `excludeMatchAll`.
 * @param {Boolean} [options.includeMatchAll=false] If true, require all include conditions to be met for a file to be included.
 * @param {Boolean} [options.excludeMatchAll=false] If true, require all exclude conditions to be met for a file to be excluded.
 * @param {Function} callback Has signature `(err, data)` where `files` is a list of matching file names.
 *
 * @example
 * // dir contains `data-0.tsv`, `data-0.json`, `data-0.csv`, `data-1.csv`, `.hidden-file`
 * io.readdirFilter('path/to/files', {include: 'csv'}, function(err, files){
 *   console.log(files) // ['data-0.csv', 'data-1.csv']
 * })
 *
 * io.readdirFilter('path/to/files', {include: [/^data/], exclude: ['csv', 'json']}, , function(err, files){
 *   console.log(files) // ['path/to/files/data-0.csv', 'path/to/files/data-1.csv', 'path/to/files/data-0.tsv']
 * })
 *
 */
function readdirFilter(dirPath, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_;
    opts_ = undefined;
  }

  readdir({ async: true }, dirPath, opts_, cb);
}

/**
 * Syncronous version of {@link readdirFilter}. Get a list of a directory's files and folders if certain critera are met.
 *
 * @function readdirFilterSync
 * @param {String} dirPath The directory to read from
 * @param {Object} options Filter options, see below
 * @param {Boolean} [options.fullPath=false] If `true`, return the full path of the file, otherwise just return the file name.
 * @param {Boolean} [options.skipFiles=false] If `true`, omit files from results.
 * @param {Boolean} [options.skipDirs=false] If `true`, omit directories from results.
 * @param {Boolean} [options.skipHidden=false] If `true`, omit files that start with a dot from results. Shorthand for `{exclude: /^\./}`.
 * @param {String|RegExp|Array<String|RegExp>} options.include If given a string, return files that have that string as their extension. If given a Regular Expression, return the files whose name matches the pattern. Can also take a list of either type. List matching behavior is described in `includeMatchAll`.
 * @param {String|RegExp|Array<String|RegExp>} options.exclude If given a string, return files that do not have that string as their extension. If given a Regular Expression, omit files whose name matches the pattern. Can also take a list of either type. List matching behavior is described in `excludeMatchAll`.
 * @param {Boolean} [options.includeMatchAll=false] If true, require all include conditions to be met for a file to be included.
 * @param {Boolean} [options.excludeMatchAll=false] If true, require all exclude conditions to be met for a file to be excluded.
 * @returns {Array<String>} List of matching file names
 *
 * @example
 * // dir contains `data-0.tsv`, `data-0.json`, `data-0.csv`, `data-1.csv`, `.hidden-file`
 * var files = io.readdirFilterSync('path/to/files', {include: 'csv'})
 * console.log(files) // ['data-0.csv', 'data-1.csv']
 *
 * var files = io.readdirFilterSync('path/to/files', {include: [/^data/], exclude: 'json', fullPath: true})
 * console.log(files) // ['path/to/files/data-0.csv', 'path/to/files/data-1.csv', 'path/to/files/data-0.tsv']
 *
 * var files = io.readdirFilterSync('path/to/files', {include: [/^data/, 'json'], fullPath: true, includeMatchAll: true})
 * console.log(files) // ['path/to/files/data-0.json', 'path/to/files/data-1.json']
 *
 */
function readdirFilterSync(dirPath, opts_) {
  return readdir({ async: false }, dirPath, opts_);
}

/**
 * Asynchronously read an ArchieMl file. Returns an empty object if file is empty.
 *
 * @function readAml
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Takes the parsed file (usually an object) and must return the modified file. See example below.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readAml('path/to/data.aml', function (err, data) {
 *   console.log(data) // json data
 * })
 *
 * // With map
 * io.readAml('path/to/data.aml', function (amlFile) {
 *   amlFile.height = amlFile.height * 2
 *   return amlFile
 * }, function (err, data) {
 *   console.log(data) // json data with height multiplied by 2
 * })
 */
function readAml(filePath, opts_, cb) {
  var parserOptions;
  if (typeof cb === 'undefined') {
    cb = opts_;
  } else {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  readData(filePath, { parser: parserAml, parserOptions: parserOptions }, cb);
}

/**
 * Synchronously read an ArchieML file. Returns an empty object if file is empty.
 *
 * @function readAmlSync
 * @param {String} filePath Input file path
 * @param {Function} [map] Optional map function. Takes the parsed file (usually an object) and must return the modified file. See example below.
 * @returns {Object} The parsed file
 *
 * @example
 * var data = io.readAmlSync('path/to/data.aml')
 * console.log(data) // json data
 *
 * var data = io.readAmlSync('path/to/data-with-comments.aml', function (amlFile) {
 *   amlFile.height = amlFile.height * 2
 *   return amlFile
 * })
 * console.log(data) // json data with height multiplied by 2
 */
function readAmlSync(filePath, opts_) {
  var parserOptions;
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  return readDataSync(filePath, { parser: parserAml, parserOptions: parserOptions });
}

/**
 * Asynchronously read a comma-separated value file. Returns an empty array if file is empty.
 *
 * @function readCsv
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Called once for each row with the signature `(row, i)` and must return the transformed row. See example below or d3-dsv documentation for details.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readCsv('path/to/data.csv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readCsv('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Converted json data
 * })
 *
 * // Pass in an object with a `map` key
 * io.readCsv('path/to/data.csv', {map: function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }}, function (err, data) {
 *   console.log(data) // Converted json data
 * })
 */
function readCsv(filePath, opts_, cb) {
  var parserOptions;
  if (typeof cb === 'undefined') {
    cb = opts_;
  } else {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  readData(filePath, { parser: parserCsv, parserOptions: parserOptions }, cb);
}

/**
 * Synchronously read a comma-separated value file. Returns an empty array if file is empty.
 *
 * @function readCsvSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Called once for each row with the signature `(row, i)` and must return the transformed row. See example below or d3-dsv documentation for details.
 * @returns {Array} the contents of the file as JSON
 *
 * @example
 * var data = io.readCsvSync('path/to/data.csv')
 * console.log(data) // Json data
 *
 * // Transform values on load
 * var data = io.readCsvSync('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data with casted values
 *
 * // Pass in an object with a `map` key
 * var data = io.readCsvSync('path/to/data.csv', {map: function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }})
 * console.log(data) // Json data with casted values
 */
function readCsvSync(filePath, opts_) {
  var parserOptions;
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  return readDataSync(filePath, { parser: parserCsv, parserOptions: parserOptions });
}

/**
 * Asynchronously read a JSON file. Returns an empty array if file is empty.
 *
 * @function readJson
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {Function} [parserOptions.map] Map function. Called once for each row if your file is an array (it tests if the first non-whitespace character is a `[`) with a callback signature `(row, i)` and delegates to `_.map`. Otherwise it's considered an object and the callback the signature is `(value, key)` and delegates to `_.mapObject`. See example below.
 * @param {String} [parserOptions.filename] File name displayed in the error message.
 * @param {Function} [parserOptions.reviver] A function that prescribes how the value originally produced by parsing is mapped before being returned. See JSON.parse docs for more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readJson('path/to/data.json', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Specify a map
 * io.readJson('path/to/data.json', function (row, i) {
 *   row.height = row.height * 2
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Json data with height multiplied by two
 * })
 *
 * // Specify a filename
 * io.readJson('path/to/data.json', 'awesome-data.json', function (err, data) {
 *   console.log(data) // Json data, any errors are reported with `fileName`.
 * })
 *
 * // Specify a map and a filename
 * io.readJson('path/to/data.json', {
 *   map: function (row, i) {
 *     row.height = row.height * 2
 *     return row
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 *
 * // Specify a map and a filename on json object
 * io.readJson('path/to/json-object.json', {
 *   map: function (value, key) {
 *     if (typeof value === 'number') {
 *       return value * 2
 *     }
 *     return value
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 *
 * // Specify a reviver function and a filename
 * io.readJson('path/to/data.json', {
 *   reviver: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 */
function readJson(filePath, opts_, cb) {
  var parserOptions;
  if (typeof cb === 'undefined') {
    cb = opts_;
  } else {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  readData(filePath, { parser: parserJson, parserOptions: parserOptions }, cb);
}

/**
 * Synchronously read a JSON file. Returns an empty array if file is empty.
 *
 * @function readJsonSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {Function} [parserOptions.map] Map function. Called once for each row if your file is an array (it tests if the first non-whitespace character is a `[`) with a callback signature `(row, i)` and delegates to `_.map`. Otherwise it's considered an object and the callback the signature is `(value, key)` and delegates to `_.mapObject`. See example below.
 * @param {String} [parserOptions.filename] File name displayed in the error message.
 * @param {Function} [parserOptions.reviver] A function that prescribes how the value originally produced by parsing is mapped before being returned. See JSON.parse docs for more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
 * @returns {Array|Object} The contents of the file as JSON
 *
 * @example
 * var data = io.readJsonSync('path/to/data.json')
 * console.log(data) // Json data
 *
 * // Specify a map
 * var data = io.readJson('path/to/data.json', function (k, v) {
 *   if (typeof v === 'number') {
 *     return v * 2
 *   }
 *   return v
 * })
 * console.log(data) // Json data with any number values multiplied by two
 *
 * // Specify a filename
 * var data = io.readJson('path/to/data.json', 'awesome-data.json')
 * console.log(data) // Json data, any errors are reported with `fileName`.
 *
 * // Specify a map and a filename
 * var data = io.readJsonSync('path/to/data.json', {
 *   map: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * })
 *
 * console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 */
function readJsonSync(filePath, opts_) {
  var parserOptions;
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  return readDataSync(filePath, { parser: parserJson, parserOptions: parserOptions });
}

/**
 * Asynchronously read a pipe-separated value file. Returns an empty array if file is empty.
 *
 * @function readPsv
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Called once for each row with the signature `(row, i)` and must return the transformed row. See example below or d3-dsv documentation for details.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readPsv('path/to/data.psv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readPsv('path/to/data.psv', function (row, i, columns) {
 *     console.log(columns) // [ 'name', 'occupation', 'height' ]
 *     row.height = +row.height // Convert this value to a number
 *     return row
 * }, function (err, data) {
 *   console.log(data) // Json data with casted values
 * })
 */
function readPsv(filePath, opts_, cb) {
  var parserOptions;
  if (typeof cb === 'undefined') {
    cb = opts_;
  } else {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  readData(filePath, { parser: parserPsv, parserOptions: parserOptions }, cb);
}

/**
 * Synchronously read a pipe-separated value file. Returns an empty array if file is empty.
 *
 * @function readPsvSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Called once for each row with the signature `(row, i)` and must return the transformed row. See example below or d3-dsv documentation for details.
 * @returns {Array} The contents of the file as JSON
 *
 * @example
 * var data = io.readPsvSync('path/to/data.psv')
 * console.log(data) // Json data
 *
 * var data = io.readPsvSync('path/to/data.psv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data with casted values
 */
function readPsvSync(filePath, opts_) {
  var parserOptions;
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  return readDataSync(filePath, { parser: parserPsv, parserOptions: parserOptions });
}

/**
 * Asynchronously read a tab-separated value file. Returns an empty array if file is empty.
 *
 * @function readTsv
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Called once for each row with the signature `(row, i)` and must return the transformed row. See example below or d3-dsv documentation for details.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readTsv('path/to/data.tsv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readTsv('path/to/data.tsv', function (row, i, columns) {
 *     console.log(columns) // [ 'name', 'occupation', 'height' ]
 *     row.height = +row.height // Convert this value to a number
 *     return row
 * }, function (err, data) {
 *   console.log(data) // Json data with casted values
 * })
 */
function readTsv(filePath, opts_, cb) {
  var parserOptions;
  if (typeof cb === 'undefined') {
    cb = opts_;
  } else {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  readData(filePath, { parser: parserTsv, parserOptions: parserOptions }, cb);
}

/**
 * Synchronously read a tab-separated value file. Returns an empty array if file is empty.
 *
 * @function readTsvSync
 * @param {String} filePath Input file path
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)` and must return the transformed row. See example below or d3-dsv documentation for details.
 * @returns {Array} the contents of the file as JSON
 *
 * @example
 * var data = io.readTsvSync('path/to/data.tsv')
 * console.log(data) // Json data
 *
 * // Transform values on load
 * var data = io.readTsvSync('path/to/data.tsv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data with casted values
 */
function readTsvSync(filePath, opts_) {
  var parserOptions;
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  return readDataSync(filePath, { parser: parserTsv, parserOptions: parserOptions });
}

/**
 * Asynchronously read a text file. Returns an empty string if file is empty.
 *
 * @function readTxt
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Takes the file read in as text and return the modified file. See example below.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readTxt('path/to/data.txt', function (err, data) {
 *   console.log(data) // string data
 * })
 *
 * io.readTxt('path/to/data.txt', function (str) {
 *   return str.replace(/hello/g, 'goodbye') // Replace all instances of `"hello"` with `"goodbye"`
 * }, function (err, data) {
 *   console.log(data) // string data with values replaced
 * })
 */
function readTxt(filePath, opts_, cb) {
  var parserOptions;
  if (typeof cb === 'undefined') {
    cb = opts_;
  } else {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  readData(filePath, { parser: parserTxt, parserOptions: parserOptions }, cb);
}

/**
 * Synchronously read a text file. Returns an empty string if file is empty.
 *
 * @function readTxtSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Takes the file read in as text and must return the modified file. See example below.
 * @returns {String} the contents of the file as a string
 *
 * @example
 * var data = io.readTxtSync('path/to/data.txt')
 * console.log(data) // string data
 *
 * var data = io.readTxtSync('path/to/data.txt', function (str) {
 *   return str.replace(/hello/g, 'goodbye') // Replace all instances of `"hello"` with `"goodbye"`
 * })
 * console.log(data) // string data with values replaced
 */
function readTxtSync(filePath, opts_) {
  var parserOptions;
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
  }
  return readDataSync(filePath, { parser: parserTxt, parserOptions: parserOptions });
}

/* istanbul ignore next */
/* istanbul ignore next */
/**
 * Append to an existing data object, creating a new file if one does not exist. If appending to an object, data is extended with `Object.assign`. For tabular formats (csv, tsv, etc), existing data and new data must be an array of flat objects (cannot contain nested objects or arrays).
 *
 * Supported formats:
 *
 * * `.json` Array of objects
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 *
 * *Note: Does not currently support .dbf files.*
 *
 * @function appendData
 * @param {String} filePath File to append to
 * @param {Array|Object} data The new data to append
 * @param {Object} [options] Optional options object passed to {@link writeData}. See that function for format-specific options.
 * @param {Function} callback Has signature `(err, data)`. Data is the combined data that was written out
 *
 * @example
 * io.appendData('path/to/data.json', jsonData, function (err) {
 *   console.log(err)
 * })
 *
 * io.appendData('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true}, function (err){
 *   console.log(err)
 * })
 */
function appendData(outPath, data, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_;
  }
  if ((typeof opts_ === 'undefined' ? 'undefined' : _typeof(opts_)) === 'object' && (opts_.makeDirectories === true || opts_.makeDirs === true)) {
    makeDirectories(outPath, proceed);
  } else {
    proceed();
  }
  function proceed(err) {
    if (err) {
      throw err;
    }
    opts_ = omit$1(opts_, ['makeDirectories', 'makeDirs']);
    // Run append file to delegate creating a new file if none exists
    fs.appendFile(outPath, '', function (err) {
      if (!err) {
        readData(outPath, function (err, existingData) {
          if (!err) {
            if (!_.isEmpty(existingData)) {
              if (Array.isArray(existingData)) {
                data = existingData.concat(data);
              } else if ((typeof existingData === 'undefined' ? 'undefined' : _typeof(existingData)) === 'object') {
                data = Object.assign({}, existingData, data);
              }
            }
            writeData(outPath, data, opts_, cb);
          } else {
            cb(err);
          }
        });
      } else {
        cb(err);
      }
    });
  }
}

/* istanbul ignore next */
/* istanbul ignore next */
/**
 * Syncronous version of {@link writers#writeData}
 *
 * Supports the same formats with the exception of `.dbf` files
 *
 * @function writeDataSync
 * @param {String} filePath Input file path
 * @param {Array|Object|String} data Data to write
 * @param {Object} [options] Optional options object, see below
 * @param {Boolean} [options.makeDirectories=false] If `true`, create intermediate directories to your data file. Can also be `makeDirs` for short.
 * @param {Function|Array} [options.replacer] Used for JSON formats. Function to filter your objects before writing or an array of whitelisted keys to keep. Examples below. See JSON.stringify docs for more info https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 * @param {Boolean} [options.verbose=true] Verbose logging output. Currently, the only logging output is a warning if you write an empty file. Set to `false` if don't want that.
 * @param {Number} [options.indent] Used for JSON format. Specifies indent level. Default is `0`.
 * @param {Array} [options.columns] Used for tabular formats. Optionally specify a list of column names to use. Otherwise they are detected from the data. See `d3-dsv` for more detail: https://github.com/d3/d3-dsv/blob/master/README.md#dsv_format
 * @returns {String} The that was written as a string
 *
 * @example
 * io.writeDataSync('path/to/data.json', jsonData)
 *
 * io.writeDataSync('path/to/create/to/data.csv', flatJsonData, {makeDirs: true})
 *
 * io.writeDataSync('path/to/to/data.json', jsonData, {indent: 4})
 *
 * io.writeDataSync('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: function (key, value) {
 *     // Filtering out string properties
 *     if (typeof value === "string") {
 *       return undefined
 *     }
 *     return value
 *   }
 * })
 *
 * io.writeDataSync('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: ['name', 'occupation'] // Only keep "name" and "occupation" values
 * })
 */
function writeDataSync(outPath, data, opts_) {
  warnIfEmpty(data, outPath, opts_);
  var writeOptions;
  if ((typeof opts_ === 'undefined' ? 'undefined' : _typeof(opts_)) === 'object') {
    if (opts_.makeDirectories === true || opts_.makeDirs === true) {
      makeDirectoriesSync(outPath);
    }
    writeOptions = opts_;
  }
  opts_ = omit$1(opts_, ['makeDirectories', 'makeDirs']);
  var fileFormatter = discernFileFormatter(outPath);
  var formattedData = fileFormatter(data, writeOptions);
  fs.writeFileSync(outPath, formattedData);
  return formattedData;
}

/* istanbul ignore next */
/* istanbul ignore next */
/**
 * Synchronous version of {@link writers#appendData}. See that function for supported formats
 *
 * @function appendDataSync
 * @param {String} filePath File to append to
 * @param {Array|Object} data The new data to append
 * @param {Object} [options] Optional options object passed to {@link writeData}. See that function for format-specific options.
 * @returns {Object} The combined data that was written
 *
 * @example
 * io.appendDataSync('path/to/data.json', jsonData)
 *
 * io.appendDataSync('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true})
 */
function appendDataSync(outPath, data, opts_) {
  // Run append file to delegate creating a new file if none exists
  if (opts_ && (opts_.makeDirectories === true || opts_.makeDirs === true)) {
    makeDirectoriesSync(outPath);
  }
  opts_ = omit$1(opts_, ['makeDirectories', 'makeDirs']);
  fs.appendFileSync(outPath, '');
  var existingData = readDataSync(outPath);
  if (!_.isEmpty(existingData)) {
    if (Array.isArray(existingData)) {
      data = existingData.concat(data);
    } else if ((typeof existingData === 'undefined' ? 'undefined' : _typeof(existingData)) === 'object') {
      data = Object.assign({}, existingData, data);
    }
  }
  writeDataSync(outPath, data, opts_);
  return data;
}

// converters

exports.convertData = convertData;
exports.convertDbfToData = convertDbfToData;
exports.writeDbfToData = convertDbfToData;
exports.formatters = formatters;
exports.formatCsv = csv$1;
exports.formatDbf = dbf$1;
exports.formatJson = json;
exports.formatPsv = psv;
exports.formatTsv = tsv$1;
exports.formatTxt = txt;
exports.discernFileFormatter = discernFileFormatter;
exports.discernFormat = discernFormat;
exports.discernParser = discernParser;
exports.exists = exists;
exports.existsSync = existsSync;
exports.extMatchesStr = extMatchesStr;
exports.getParser = getParser;
exports.makeDirectories = makeDirectories;
exports.makeDirectoriesSync = makeDirectoriesSync;
exports.matches = matches;
exports.matchesRegExp = matchesRegExp;
exports.parsers = parsers;
exports.parseAml = parserAml;
exports.parseCsv = parserCsv;
exports.parseJson = parserJson;
exports.parsePsv = parserPsv;
exports.parseTsv = parserTsv;
exports.parseTxt = parserTxt;
exports.readData = readData;
exports.readDataSync = readDataSync;
exports.readdirFilter = readdirFilter;
exports.readdirFilterSync = readdirFilterSync;
exports.readAml = readAml;
exports.readAmlSync = readAmlSync;
exports.readCsv = readCsv;
exports.readCsvSync = readCsvSync;
exports.readDbf = readDbf;
exports.readJson = readJson;
exports.readJsonSync = readJsonSync;
exports.readPsv = readPsv;
exports.readPsvSync = readPsvSync;
exports.readTsv = readTsv;
exports.readTsvSync = readTsvSync;
exports.readTxt = readTxt;
exports.readTxtSync = readTxtSync;
exports.appendData = appendData;
exports.appendDataSync = appendDataSync;
exports.writeData = writeData;
exports.writeDataSync = writeDataSync;
//# sourceMappingURL=indian-ocean.cjs.js.map
