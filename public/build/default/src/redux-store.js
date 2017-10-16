/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 72);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = commonAction;
/* harmony export (immutable) */ __webpack_exports__["a"] = dispatchActionBehavior;
function commonAction(){
    return {
        listeners:{
            'method':'handleCall'
        },
        handleCall:function(e){
            var detail = e.detail;
            var args = detail.args;
            var callback = detail.callback;

            var methodName = args[0];
            var args = Array.prototype.slice.call(args);
            if(args.length>1)
            args = args.slice(1,args.length);

            var argsText = "";
            var params = [];
            args.map((row,i)=>{
                params.push(row);
                if(i!=0) argsText+=',';
                argsText += `params[${i}]`
            });
        
            callback(eval(`
                if(this.${methodName})
                this.${methodName}(${argsText})
            `));

        }
    }
}

function dispatchActionBehavior(){
    return {
        dispatchAction:function(){
            return new Promise((reslove,reject)=>{
                this.fire('method',{
                    args:arguments,
                    callback:(promise)=>{
                        if(typeof promise == "undefined"){
                            reslove('Action no promise.');
                        }else{
                            promise.then((res)=>{
                                reslove(promise);
                            }).catch((err)=>{
                                reject(err);
                            })
                        }
                    }
                });
            })
            
        }
    }
}

const baseURL = `https://${window.location.hostname}:${location.port}`;
/* harmony export (immutable) */ __webpack_exports__["c"] = baseURL;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);


const settingAxios = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_axios__["create"])({
    baseURL:__WEBPACK_IMPORTED_MODULE_1__config__["c" /* baseURL */]+'/api',
    // headers: headers.common['Authorization'] = localStorage.token
});
settingAxios.defaults.headers.common['Authorization'] = localStorage.token
/* harmony default export */ __webpack_exports__["a"] = (settingAxios);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(9);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  typeof document.createElement -> undefined
 */
function isStandardBrowserEnv() {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(2);
var normalizeHeaderName = __webpack_require__(32);

var PROTECTION_PREFIX = /^\)\]\}',?\n/;
var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(5);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(5);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      data = data.replace(PROTECTION_PREFIX, '');
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMehtodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(2);
var settle = __webpack_require__(24);
var buildURL = __webpack_require__(27);
var parseHeaders = __webpack_require__(33);
var isURLSameOrigin = __webpack_require__(31);
var createError = __webpack_require__(8);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(26);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(29);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        if (request.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(23);

/**
 * Create an Error with the specified message, config, error code, and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 @ @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, response);
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root_js__ = __webpack_require__(44);


/** Built-in value references. */
var Symbol = __WEBPACK_IMPORTED_MODULE_0__root_js__["a" /* default */].Symbol;

/* harmony default export */ __webpack_exports__["a"] = (Symbol);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getPrototype_js__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__ = __webpack_require__(45);




/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__["a" /* default */])(value) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__["a" /* default */])(value) != objectTag) {
    return false;
  }
  var proto = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__getPrototype_js__["a" /* default */])(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/* harmony default export */ __webpack_exports__["a"] = (isPlainObject);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  var last = funcs[funcs.length - 1];
  var rest = funcs.slice(0, -1);
  return function () {
    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_symbol_observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ActionTypes; });
/* harmony export (immutable) */ __webpack_exports__["a"] = createStore;



/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__["a" /* default */])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = observable, _ref2;
}

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),
/* 15 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_polymer_redux__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_polymer_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_polymer_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__reducer_commonSystem__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__reducer_auth__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__reducer_provider__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__reducer_userWelfare__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__reducer_welfare__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__reducer_groupWelfare__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__reducer_commonData__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__reducer_users__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__reducer_conditionReadWelfare__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__reducer_upload__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__reducer_fundRvd__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__reducer_dateDb__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__reducer_chart__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__reducer_systemConfigs__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__reducer_retier__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__reducer_sso__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__reducer_fund__ = __webpack_require__(61);






















// axios.defaults.headers.common['Authorization'] = localStorage.token

const rootReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["a" /* combineReducers */])({
    commonSystem:__WEBPACK_IMPORTED_MODULE_4__reducer_commonSystem__["a" /* commonSystemReducer */],
    auth:__WEBPACK_IMPORTED_MODULE_5__reducer_auth__["a" /* authReducer */],
    provider:__WEBPACK_IMPORTED_MODULE_6__reducer_provider__["a" /* providerReducer */],
    userWelfare:__WEBPACK_IMPORTED_MODULE_7__reducer_userWelfare__["a" /* userWelfareReducer */],
    welfare:__WEBPACK_IMPORTED_MODULE_8__reducer_welfare__["a" /* welfareReducer */],
    groupWelfare:__WEBPACK_IMPORTED_MODULE_9__reducer_groupWelfare__["a" /* groupWelfareReducer */],
    commonData:__WEBPACK_IMPORTED_MODULE_10__reducer_commonData__["a" /* commonDataReducer */],
    users:__WEBPACK_IMPORTED_MODULE_11__reducer_users__["a" /* usersReducer */],
    conditionReadWelfare:__WEBPACK_IMPORTED_MODULE_12__reducer_conditionReadWelfare__["a" /* conditionReadWelfareReducer */],
    upload:__WEBPACK_IMPORTED_MODULE_13__reducer_upload__["a" /* uploadReducer */],
    fundRvd: __WEBPACK_IMPORTED_MODULE_14__reducer_fundRvd__["a" /* fundRvdReducer */],
    dateDb: __WEBPACK_IMPORTED_MODULE_15__reducer_dateDb__["a" /* dateDbReducer */],
    chart: __WEBPACK_IMPORTED_MODULE_16__reducer_chart__["a" /* chartReducer */],
    systemConfigs: __WEBPACK_IMPORTED_MODULE_17__reducer_systemConfigs__["a" /* systemConfigsReducer */],
    retier:__WEBPACK_IMPORTED_MODULE_18__reducer_retier__["a" /* retierReducer */],
    sso:__WEBPACK_IMPORTED_MODULE_19__reducer_sso__["a" /* ssoReducer */],
    fund:__WEBPACK_IMPORTED_MODULE_20__reducer_fund__["a" /* fundReducer */]
});
const storeApp = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["b" /* createStore */])(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.ReduxBehavior = [__WEBPACK_IMPORTED_MODULE_1_polymer_redux___default()(storeApp),__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__config__["a" /* dispatchActionBehavior */])()];
window.dispatchActionBehavior = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__config__["a" /* dispatchActionBehavior */])();
window.axios = __WEBPACK_IMPORTED_MODULE_3__axios__["a" /* default */];
window.commonSystemAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__reducer_commonSystem__["b" /* commonSystemAction */])(storeApp);
window.authAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__reducer_auth__["b" /* authAction */])(storeApp);
window.providerAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__reducer_provider__["b" /* providerAction */])(storeApp);
window.userWelfareAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__reducer_userWelfare__["b" /* userWelfareAction */])(storeApp);
window.welfareAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__reducer_welfare__["b" /* welfareAction */])(storeApp);
window.groupWelfareAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__reducer_groupWelfare__["b" /* groupWelfareAction */])(storeApp);
window.commonDataAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__reducer_commonData__["b" /* commonDataAction */])(storeApp); 
window.usersAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__reducer_users__["b" /* usersAction */])(storeApp);
window.conditionReadWelfareAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__reducer_conditionReadWelfare__["b" /* conditionReadWelfareAction */])(storeApp);
window.uploadAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_13__reducer_upload__["b" /* uploadAction */])(storeApp);
window.fundRvdAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__reducer_fundRvd__["b" /* fundRvdAction */])(storeApp);
window.dateDbAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__reducer_dateDb__["b" /* dateDbAction */])(storeApp);
window.chartAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__reducer_chart__["b" /* chartAction */])(storeApp);
window.systemConfigsAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__reducer_systemConfigs__["b" /* systemConfigsAction */])(storeApp);
window.retierAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__reducer_retier__["b" /* retierAction */])(storeApp);
window.ssoAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_19__reducer_sso__["b" /* ssoAction */])(storeApp);
window.fundAction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_20__reducer_fund__["b" /* fundAction */])(storeApp);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(18);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);
var bind = __webpack_require__(9);
var Axios = __webpack_require__(20);
var defaults = __webpack_require__(4);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(6);
axios.CancelToken = __webpack_require__(19);
axios.isCancel = __webpack_require__(7);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(34);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(6);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(4);
var utils = __webpack_require__(2);
var InterceptorManager = __webpack_require__(21);
var dispatchRequest = __webpack_require__(22);
var isAbsoluteURL = __webpack_require__(30);
var combineURLs = __webpack_require__(28);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);
var transformData = __webpack_require__(25);
var isCancel = __webpack_require__(7);
var defaults = __webpack_require__(4);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 @ @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.response = response;
  return error;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(8);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response
    ));
  }
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(2);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var atob = __webpack_require__(35);

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64_url_decode = __webpack_require__(36);

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

module.exports.InvalidTokenError = InvalidTokenError;


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getRawTag_js__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objectToString_js__ = __webpack_require__(42);




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__getRawTag_js__["a" /* default */])(value)
    : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__objectToString_js__["a" /* default */])(value);
}

/* harmony default export */ __webpack_exports__["a"] = (baseGetTag);


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ __webpack_exports__["a"] = (freeGlobal);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(15)))

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__overArg_js__ = __webpack_require__(43);


/** Built-in value references. */
var getPrototype = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__overArg_js__["a" /* default */])(Object.getPrototypeOf, Object);

/* harmony default export */ __webpack_exports__["a"] = (getPrototype);


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(10);


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["a"] = (getRawTag);


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ __webpack_exports__["a"] = (objectToString);


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* harmony default export */ __webpack_exports__["a"] = (overArg);


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__ = __webpack_require__(39);


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__["a" /* default */] || freeSelf || Function('return this')();

/* harmony default export */ __webpack_exports__["a"] = (root);


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ __webpack_exports__["a"] = (isObjectLike);


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

(function(global, factory) {
    /* istanbul ignore next */
    if (true) {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        global['PolymerRedux'] = factory();
    }
})(this, function() {
    var warning = 'Polymer Redux: <%s>.%s has "notify" enabled, two-way bindings goes against Redux\'s paradigm';

    /**
     * Returns property bindings found on a given Element/Behavior.
     *
     * @private
     * @param {HTMLElement|Object} obj Element or Behavior.
     * @param {HTMLElement} element Polymer element.
     * @param {Object} store Redux store.
     * @return {Array}
     */
    function getStatePathProperties(obj, element, store) {
        var props = [];

        if (obj.properties != null) {
            Object.keys(obj.properties).forEach(function(name) {
                var prop = obj.properties[name];
                if (prop.hasOwnProperty('statePath')) {
                    // notify flag, warn against two-way bindings
                    if (prop.notify && !prop.readOnly) {
                        console.warn(warning, element.is, name);
                    }
                    props.push({
                        name: name,
                        // Empty statePath return state
                        path: prop.statePath || store.getState,
                        readOnly: prop.readOnly,
                        type: prop.type
                    });
                }
            });
        }

        return props;
    }

    /**
     * Factory function for creating a listener for a give Polymer element. The
     * returning listener should be passed to `store.subscribe`.
     *
     * @private
     * @param {HTMLElement} element Polymer element.
     * @return {Function} Redux subcribe listener.
     */
    function createListener(element, store) {
        var props = getStatePathProperties(element, element, store);

        // behavior property bindings
        if (Array.isArray(element.behaviors)) {
            element.behaviors.forEach(function(behavior) {
                var extras = getStatePathProperties(behavior, element, store);
                if (extras.length) {
                    Array.prototype.push.apply(props, extras);
                }
            });

            // de-dupe behavior props
            var names = props.map(function(prop) {
                return prop.name; // grab the prop names
            });
            props = props.filter(function(prop, i) {
                return names.indexOf(prop.name) === i; // indices must match
            });
        }

        // redux listener
        return function() {
            var state = store.getState();
            props.forEach(function(property) {
                var propName = property.name;
                var splices = [];
                var value, previous;

                // statePath, a path or function.
                var path = property.path;
                if (typeof path == 'function') {
                    value = path.call(element, state);
                } else {
                    value = Polymer.Base.get(path, state);
                }

                // prevent unnecesary polymer notifications
                previous = element.get(property.name);
                if (value === previous) {
                    return;
                }

                // type of array, work out splices before setting the value
                if (property.type === Array) {
                    value = value || /* istanbul ignore next */ [];
                    previous = previous || /* istanbul ignore next */ [];

                    // check the value type
                    if (!Array.isArray(value)) {
                        throw new TypeError(
                            '<'+ element.is +'>.'+ propName +' type is Array but given: ' + (typeof value)
                        );
                    }

                    splices = Polymer.ArraySplice.calculateSplices(value, previous);
                }

                // set
                if (property.readOnly) {
                    element.notifyPath(propName, value);
                } else {
                    element.set(propName, value);
                }

                // notify element of splices
                if (splices.length) {
                    element.notifySplices(propName, splices);
                }
            });
            element.fire('state-changed', state);
        }
    }

    /**
     * Binds an given Polymer element to a Redux store.
     *
     * @private
     * @param {HTMLElement} element Polymer element.
     * @param {Object} store Redux store.
     */
    function bindReduxListener(element, store) {
        var listener;

        if (element._reduxUnsubscribe) return;

        listener = createListener(element, store);
        listener(); // start bindings

        element._reduxUnsubscribe = store.subscribe(listener);
    }

    /**
     * Unbinds a Polymer element from a Redux store.
     *
     * @private
     * @param {HTMLElement} element
     */
    function unbindReduxListener(element) {
        if (typeof element._reduxUnsubscribe === 'function') {
            element._reduxUnsubscribe();
            delete element._reduxUnsubscribe;
        }
    }

    /**
     * Builds list of action creators from a given element and it's inherited
     * behaviors setting the list onto the element.
     *
     * @private
     * @param {HTMLElement} element Polymer element instance.
     */
    function compileActionCreators(element) {
        var actions = {};
        var behaviors = element.behaviors;

        if (element._reduxActions) return;

        // add behavior actions first, in reverse order so we keep priority
        if (Array.isArray(behaviors)) {
            for (var i = behaviors.length - 1; i >= 0; i--) {
                objectAssign(actions, behaviors[i].actions);
            }
        }

        // element actions have priority
        element._reduxActions = objectAssign(actions, element.actions);
    }

    /**
     * Dispatches a Redux action via a Polymer element. This gives the element
     * a polymorphic dispatch function. See the readme for the various ways to
     * dispatch.
     *
     * @private
     * @param {HTMLElement} element Polymer element.
     * @param {Object} store Redux store.
     * @param {Arguments} args The arguments passed to `element.dispatch`.
     * @return {Object} The computed Redux action.
     */
    function dispatchReduxAction(element, store, args) {
        var action = args[0];
        var actions = element._reduxActions;

        args = castArgumentsToArray(args);

        // action name
        if (actions && typeof action === 'string') {
            if (typeof actions[action] !== 'function') {
                throw new TypeError('Polymer Redux: <' + element.is + '> has no action "' + action + '"');
            }
            action = actions[action].apply(element, args.slice(1));
        }

        // !!! DEPRECIATED !!!
        // This will be removed as of 1.0.

        // action creator
        if (typeof action === 'function' && action.length === 0) {
            return store.dispatch(action());
        }

        // ---

        // middleware, make sure we pass the polymer-redux dispatch
        // so we have access to the elements action creators
        if (typeof action === 'function') {
            return store.dispatch(function() {
                var argv = castArgumentsToArray(arguments);
                // replace redux dispatch
                argv.splice(0, 1, function() {
                    return dispatchReduxAction(element, store, arguments);
                });
                return action.apply(element, argv);
            });
        }

        // action
        return store.dispatch(action);
    }

    /**
     * Turns arguments into an Array.
     *
     * @param {Arguments} args
     * @return {Array}
     */
    function castArgumentsToArray(args) {
        return Array.prototype.slice.call(args, 0);
    }

    /**
     * Object.assign()
     *
     * @param {Object} target
     * @param {Object} [...obj]
     * @return {Object} The target.
     */
    function objectAssign(target) {
        // use browser
        if (typeof Object.assign === 'function') {
            return Object.assign.apply(Object, arguments);
        }

        var hasOwn = Object.prototype.hasOwnProperty;
        var argc = arguments.length;
        var obj;

        for (var i = 1; i < argc; ++i) {
            obj = arguments[i];
            if (obj != null) {
                for (var k in obj) {
                    if (hasOwn.call(obj, k)) {
                        target[k] = obj[k];
                    }
                }
            }
        }

        return target;
    }

    /**
     * Creates PolymerRedux behaviors from a given Redux store.
     *
     * @param {Object} store Redux store.
     * @return {PolymerRedux}
     */
    return function(store) {
        var PolymerRedux;

        // check for store
        if (!store) {
            throw new TypeError('missing redux store');
        }

        /**
         * `PolymerRedux` binds a given Redux store's state to implementing Elements.
         *
         * Full documentation available, https://github.com/tur-nr/polymer-redux.
         *
         * @polymerBehavior PolymerRedux
         * @demo demo/index.html
         */
        return PolymerRedux = {
            /**
             * Fired when the Redux store state changes.
             * @event state-changed
             * @param {*} state
             */

            ready: function() {
                bindReduxListener(this, store);
                compileActionCreators(this);
            },

            attached: function() {
                bindReduxListener(this, store);
                compileActionCreators(this);
            },

            detached: function() {
                unbindReduxListener(this);
            },

            /**
             * Dispatches an action to the Redux store.
             *
             * @param {String|Object|Function} action
             * @return {Object} The action that was dispatched.
             */
            dispatch: function(action /*, [...args] */) {
                return dispatchReduxAction(this, store, arguments);
            },

            /**
             * Gets the current state in the Redux store.
             * @return {*}
             */
            getState: function() {
                return store.getState();
            },
        };
    };
});


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compose__ = __webpack_require__(12);
/* unused harmony export default */
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = __WEBPACK_IMPORTED_MODULE_0__compose__["a" /* default */].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_warning__ = __webpack_require__(14);
/* harmony export (immutable) */ __webpack_exports__["a"] = combineReducers;




function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === __WEBPACK_IMPORTED_MODULE_0__createStore__["b" /* ActionTypes */].INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__["a" /* default */])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: __WEBPACK_IMPORTED_MODULE_0__createStore__["b" /* ActionTypes */].INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + __WEBPACK_IMPORTED_MODULE_0__createStore__["b" /* ActionTypes */].INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_warning__["a" /* default */])('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  if (process.env.NODE_ENV !== 'production') {
    var unexpectedKeyCache = {};
  }

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_warning__["a" /* default */])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__combineReducers__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__compose__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_warning__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__createStore__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__combineReducers__["a"]; });
/* unused harmony reexport bindActionCreators */
/* unused harmony reexport applyMiddleware */
/* unused harmony reexport compose */







/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utils_warning__["a" /* default */])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(52);


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(53);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), __webpack_require__(54)(module)))

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jwt_decode__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jwt_decode___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jwt_decode__);
/* harmony export (immutable) */ __webpack_exports__["a"] = authReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = authAction;




const initialState = {
    user: {}
}

function authReducer(state = initialState, action) {

    switch (action.type) {
        // case 'AUTH_SET_USER':
        //     var userInfo;
        //     if (action.payload.token) {
        //         userInfo = jwtDecode(action.payload.token)
        //     } else {
        //         userInfo = action.payload;
        //     }
        //     return Object.assign({}, state, { user: userInfo });
        // case 'AUTH_INFO':
        //     return Object.assign({}, state, { user: action.payload });
        case 'authGetUser':
            return Object.assign({}, state, { user: action.payload });
        default:
            return state
    }

}

function authAction(store) {

    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),
    {
        // AUTH_LOGIN: function (formLogin) {
        //     axios.post('./auth/login', { username: formLogin.user, password: formLogin.pass })
        //         .then((response) => {


        //             localStorage.setItem("token", response.data.token);
        //             store.dispatch({ type: 'AUTH_SET_USER', payload: response.data })

        //             let userInfo;
        //             if (response.data.token) {
        //                 userInfo = jwtDecode(response.data.token)
        //             } else {
        //                 userInfo = response.data;
        //             }

        //             //  if(userInfo.role=="teacher"){
        //             //     this.fire('nylon-change-page',{path:'/examRoom'})
        //             // }else{
        //             //     this.fire('nylon-change-page',{path:'/examHistory'})
        //             // }

        //         })
        //         .catch((error) => {
        //             //console.log('error');
        //             console.log({ error });
        //             alert('error')
        //         });
        // }
        authLogin: function (login) {
            return __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post('/auth/login', login)
            // .then(res => {
            //     localStorage.setItem("token", res.data.token)
            //     // var decoded = jwtDecode(res.data.token);
            //     // localStorage.setItem("emp_id", decoded.emp_id)
            //     // localStorage.setItem("role", decoded.role)
            //     // this.fire('nylon-change-page', {
            //     //     path: 'user-welfare/' + decoded.emp_id
            //     // });
            //     // store.dispatch({ type: 'GET_CHART_DAY_WITHOUT_GROUP', payload: res.data })
            // })
            // .catch(err => {
            //     console.log(err);
            // })

        },

        authGetUser: function (token) {
            var decoded = __WEBPACK_IMPORTED_MODULE_2_jwt_decode___default()(token);
            //    return axios.get('/auth/user', token)
            //         .then(res => {
            store.dispatch({ type: 'authGetUser', payload: decoded })
            //         })
            //         .catch(err => {
            //             console.log(err);
            //         })
        },

        authLogout: function () {
            // return dispatch => {
                localStorage.removeItem("token")
                // Nylon.redirect('/')
                store.dispatch({ type: 'authGetUser', payload: {} })
                this.fire('nylon-change-page', {
                    path: '/'
                })
            // }

        },

        // authTransform: function (url) {
        //     return dispatch => {
        //         axios.get('/auth/transform').then(
        //             res => {
        //                 window.location = `${url}/auth/transform?source=${res.data.token}`
        //             }
        //         )
        //             .catch(
        //             err => {
        //                 console.log(err)
        //             }
        //             )
        //     }

        // },

        // authVerifyToken: function () {
        //     return dispatch => {
        //         var decode = jwt_decode(localStorage.token)
        //         dispatch({ type: 'AUTH_VERIFY_TOKEN', payload: decode })
        //     }
        // }
    }
    ]

}

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = chartReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = chartAction;


// import groupArray from 'group-array'
// var groupArray = require();
const initialState = {
    module: [],
    date: {},
    chart: []

}
// const toThaiDate = (date) => {
//     // console.log(typeof date);
//     try {
//         let year = parseInt(date.split('-')[0]) + 543,
//             month = date.split('-')[1],
//             day = date.split('-')[2];
//         return day + '/' + month + '/' + year
//     } catch (error) {
//         console.log(error);
//     }
// }
// const splitDate = (data) => {
//     // let newData = []
//     data.map((news, index) => {
//         for (let variable in news) {
//             if (variable.search('date') >= 0) {
//                 data[index][variable] = toThaiDate(news[variable].split('T')[0])
//             }
//         }
//     })
//     let newData = groupArray(data, 'date_approve')
//     let datas = []
//     for (let variable2 in newData) {
//         datas.push({
//             id: variable2,
//             data: newData[variable2]
//         })
//     }
//     return datas
// }
// const sumBath = (data) => {
//     // console.log(data);
//     let newDatas = []
//     data.map((bath) => {
//         let sum = []
//         bath.data.map((d) => {
//             sum.push(d.use_budget)
//         })
//        let total=  sum.reduce((acc, val)=> {
//             return acc + val;
//         }, 0);
//         newDatas.push({id:bath.id,bath:total})
//     })
//     return newDatas

// }
function chartReducer(state = initialState, action) {
    switch (action.type) {
        case 'TEST':
            return Object.assign({}, state, { date: action.payload });
        case 'GET_CHART_DAY_WITHOUT_GROUP':
            return Object.assign({}, state, { chart: action.payload });
        case 'GET_CHART_WEEK_WITHOUT_GROUP':
            return Object.assign({}, state, { chart: action.payload });
        case 'GET_CHART_MONTH_WITHOUT_GROUP':
            return Object.assign({}, state, { chart: action.payload });
        case 'GET_CHART_YEAR_WITHOUT_GROUP' :
            return Object.assign({}, state, { chart: action.payload });
        default:
            return state;
    }
}

function chartAction(store) {
    return [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(), {
            TEST: function (data) {

                // console.log(groupArray(arr, 'tag'));
                store.dispatch({ type: 'TEST', payload: '1111' })

            },
            GET_CHART_DAY_WITHOUT_GROUP(data) {
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/chart/day/?${data}`)
                    .then(res => {
                        store.dispatch({ type: 'GET_CHART_DAY_WITHOUT_GROUP', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            // 
            GET_CHART_WEEK_WITHOUT_GROUP(data) {
                // console.log(data);
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/chart/week?${data}`)
                    .then(res => {
                        
                        store.dispatch({ type: 'GET_CHART_WEEK_WITHOUT_GROUP', payload: res.data})
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            GET_CHART_MONTH_WITHOUT_GROUP(data) {
                console.log(data);
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/chart/month?${data}`)
                    .then(res => {
                        
                        store.dispatch({ type: 'GET_CHART_MONTH_WITHOUT_GROUP', payload: res.data})
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            GET_CHART_YEAR_WITHOUT_GROUP(data) {
                console.log(data);
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/chart/year?${data}`)
                    .then(res => {
                        
                        store.dispatch({ type: 'GET_CHART_YEAR_WITHOUT_GROUP', payload: res.data})
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
        }
    ]
}

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = commonDataReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = commonDataAction;



const initialState = {
    list:[],
    select:{},
    academic:[{id:0,academic:''}],
    active:[{id:0,active:''}],
    department:[{id:0,department:''}],
    employee:[{id:0,employee:''}],
    faculty:[{id:0,faculty:''}],
    gender:[{id:0,gender:''}],
    matier:[{id:0,matier:''}],
    position:[{id:0,position:''}],
    prefixname:[{id:0,prefixname:''}],
    relation:[{id:0,relation:''}],
    type_employee:[{id:0,type_employee:''}],
}

function commonDataReducer(state = initialState,action){

    switch (action.type) {
        case 'COMMONDATA_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'COMMONDATA_SELECT':
            return Object.assign({},state,{select:action.payload});
        case  'COMMONDATA_DATA_ACADEMIC':
            return Object.assign({},state,{academic:action.payload});
        case  'COMMONDATA_DATA_DEPARTMENT':
            return Object.assign({},state,{department:action.payload});
        case  'COMMONDATA_DATA_ACTIVE':
            return Object.assign({},state,{active:action.payload});
        case  'COMMONDATA_DATA_EMPLOYEE':
            return Object.assign({},state,{employee:action.payload});
        case  'COMMONDATA_DATA_FACULTY':
            return Object.assign({},state,{faculty:action.payload});
        case  'COMMONDATA_DATA_GENDER':
            return Object.assign({},state,{gender:action.payload});
        case  'COMMONDATA_DATA_MATIER':
            return Object.assign({},state,{matier:action.payload});
        case  'COMMONDATA_DATA_POSITION':
            return Object.assign({},state,{position:action.payload});
        case  'COMMONDATA_DATA_PREFIXNAME':
            return Object.assign({},state,{prefixname:action.payload});
        case  'COMMONDATA_DATA_RELATION':
            return Object.assign({},state,{relation:action.payload});
        case 'COMMONDATA_DATA_TYPE_EMPLOYEE':
            return Object.assign({},state,{type_employee:action.payload});
        default:
            return state
    }

}

function commonDataAction(store){

    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),
        {
            COMMONDATA_LIST:function(){
                console.log(1)
                // axios.get('/providers')
                // .then(res=>{
                //     store.dispatch({type:'COMMONDATA_LIST',payload:res.data})
                // })
                // .catch(err=>{

                // })
            },
            //  COMMONDATA_DATA_ACADEMIC
            COMMONDATA_DATA_ACADEMIC:function(){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/academic`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    // console.log(12222222);
                    store.dispatch({type:'COMMONDATA_DATA_ACADEMIC',payload:newData})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_ACADEMIC_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`/common/academic/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACADEMIC()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_ACADEMIC_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('/common/academic/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACADEMIC()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_ACADEMIC_DELETE:function(del){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/common/academic/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACADEMIC()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_ACTIVE
            COMMONDATA_DATA_ACTIVE:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/active`)
                .then(res=>{
                    // console.log(res.data);
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_ACTIVE',payload:newData})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_ACTIVE_INSERT:function(data){
                // console.log(data)
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`/common/active/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACTIVE()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_ACTIVE_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('/common/active/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACTIVE()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_ACTIVE_DELETE:function(del){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/common/active/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACTIVE()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_DEPARTMENT 
            COMMONDATA_DATA_DEPARTMENT:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/department`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_DEPARTMENT',payload:newData})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_DEPARTMENT_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`/common/department/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_DEPARTMENT()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_DEPARTMENT_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('/common/department/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_DEPARTMENT()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_DEPARTMENT_DELETE:function(del){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/common/department/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_DEPARTMENT()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_FACULTY
            COMMONDATA_DATA_FACULTY:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/faculty`)
                .then(res=>{
                     var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_FACULTY',payload:newData})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_FACULTY_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`/common/faculty/insert`,data)
                .then((response)=>{
                    console.log(response);
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_FACULTY()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_FACULTY_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('/common/faculty/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_FACULTY()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_FACULTY_DELETE:function(del){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/common/faculty/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_FACULTY()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_GENDER:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/gender`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_GENDER',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_GENDER_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`/common/gender/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_GENDER()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_GENDER_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('/common/gender/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_GENDER()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_GENDER_DELETE:function(del){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/common/gender/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_GENDER()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_EMPLOYEE:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/employee`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_EMPLOYEE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            // COMMONDATA_DATA_MATIER
            COMMONDATA_DATA_MATIER:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/matier`)
                .then(res=>{
                     var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_MATIER',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_MATIER_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`/common/matier/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_MATIER()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_MATIER_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('/common/matier/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_MATIER()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_MATIER_DELETE:function(del){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/common/matier/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_MATIER()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_POSITION
            COMMONDATA_DATA_POSITION:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/position`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_POSITION',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_POSITION_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`/common/position/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_POSITION()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_POSITION_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('/common/position/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_POSITION()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_POSITION_DELETE:function(del){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/common/position/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_POSITION()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_PREFIXNAME
            COMMONDATA_DATA_PREFIXNAME:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/prefix`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_PREFIXNAME',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_PREFIXNAME_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`/common/prefix/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_PREFIXNAME()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_PREFIXNAME_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('/common/prefix/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_PREFIXNAME()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_PREFIXNAME_DELETE:function(del){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/common/prefix/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_PREFIXNAME()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_RELATION
            COMMONDATA_DATA_RELATION:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/relation`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_RELATION',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_RELATION_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`/common/relation/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_RELATION()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_RELATION_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('/common/relation/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_RELATION()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_RELATION_DELETE:function(del){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/common/relation/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_RELATION()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_TYPE_EMPLOYEE
            COMMONDATA_DATA_TYPE_EMPLOYEE:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/common/type_employee`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_TYPE_EMPLOYEE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_TYPE_EMPLOYEE_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`/common/type_employee/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_TYPE_EMPLOYEE()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_TYPE_EMPLOYEE_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('/common/type_employee/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_TYPE_EMPLOYEE()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_TYPE_EMPLOYEE_DELETE:function(del){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/common/type_employee/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_TYPE_EMPLOYEE()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            }
            // COMMONDATA_SELECT:function(id){
            //     axios.get(`/providers/provider/${id}`)
            //     .then(res=>{
            //         store.dispatch({type:'COMMONDATA_SELECT',payload:res.data})
            //     })
            //     .catch(err=>{

            //     })
            //     console.log(id);
            // }
        }
    ]

}

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = commonSystemReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = commonSystemAction;



const initialState = {
    module:[]
}

function commonSystemReducer(state = initialState,action){
    switch (action.type) {
        case 'COMMON_MODULE':
            return Object.assign({},state,{module:action.payload});
        default:
            return state;
    }
}

function commonSystemAction(store){
    return [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),{
            COMMON_MODULE:function(data){
                // var user = store.getState().auth.user;
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/common/module/')
                .then(res=>{
                    store.dispatch({type:'COMMON_MODULE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
    ]
}

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = conditionReadWelfareReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = conditionReadWelfareAction;



const initialState = {
    module:[],
    select:{type_continuous: "all" ,data_source:'',conditions:[{name:'',symbol:''}]},
    listConditions:[],
    listTable:[],
    listField:[],
    disabled:true,
    insert_view:true
}
const clearData = (data,callback)=>{

    let {label,field,data_source,type_continuous}=data;
    let newData={label,field,data_source,type_continuous};
    newData.conditions = new Array();
    // console.log(typeof newData.data_source == 'undefined');
    if(typeof newData.data_source == 'undefined')
        newData.data_source = ''
    // for (let prop in newData) {
    //    newData[prop] = newData[prop].replace(/ /g,'').trim()
    // }  
    data.conditions.map((tag)=>{
        newData.conditions.push({name:tag.name//.replace(/ /g,'').trim()
        ,symbol:tag.symbol});
    });
        callback(newData)
    // callback(data)
}
function conditionReadWelfareReducer(state = initialState,action){
    switch (action.type) {
        case 'CONDITIONREADWELFARE_SET':
            return Object.assign({},state,{type_continuous: "all" ,select:{conditions:[{name:'',symbol:''}]}});
        case 'CONDITIONREADWELFARE_LIST' : 
            return Object.assign({},state,{listConditions:action.payload});        
        case 'CONDITIONREADWELFARE_TABLE_LIST' :
            return Object.assign({},state,{listTable:action.payload}); 
        case 'CONDITIONREADWELFARE_FIEID_LIST' :
            return Object.assign({},state,{listField:action.payload}); 
        case 'CONDITIONREADWELFARE_SELECT' : 
             return Object.assign({},state,{select:action.payload}); 
        case 'CONDITIONREADWELFARE_BTN' :
            return Object.assign({},state,{disabled:action.payload});
        case 'CONDITIONREADWELFARE_INSERT_VIEW' : 
            return Object.assign({},state,{insert_view:action.payload});             
        default:
            return state;
    }
}

function conditionReadWelfareAction(store){
    return [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),{
            CONDITIONREADWELFARE_SET(){
                store.dispatch({type:'CONDITIONREADWELFARE_SET'})
            },
            CONDITIONREADWELFARE_BTN(data){
                // console.log(data)
                store.dispatch({type:'CONDITIONREADWELFARE_BTN',payload:data})
            },
            CONDITIONREADWELFARE_INSERT_VIEW(data){
                // console.log(data)
                store.dispatch({type:'CONDITIONREADWELFARE_INSERT_VIEW',payload:data})
            },
            CONDITIONREADWELFARE_LIST(){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/conditions/list')
                .then(res=>{
                    store.dispatch({type:'CONDITIONREADWELFARE_LIST',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            CONDITIONREADWELFARE_TABLE_LIST(){
                // console.log(1);
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/conditions/Table/')
                .then(res=>{
                    store.dispatch({type:'CONDITIONREADWELFARE_TABLE_LIST',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            CONDITIONREADWELFARE_FIEID_LIST(){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/conditions/Field/')
                .then(res=>{
                    store.dispatch({type:'CONDITIONREADWELFARE_FIEID_LIST',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            CONDITIONREADWELFARE_INSERT(data){
                // console.log(data);
                clearData(data,(newData)=>{
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`./conditions/insert`,newData)
                    .then(res=>{
                        this.CONDITIONREADWELFARE_LIST();
                        this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                            callback:()=>{
                                this.$$('panel-right').close();
                            }
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                    })
            },
            CONDITIONREADWELFARE_SELECT:function(data){
               store.dispatch({type:'CONDITIONREADWELFARE_SELECT',payload:data})
            },
            CONDITIONREADWELFARE_EDIT:function(data){
                // console.log(data)
                this.fire('toast',{
                    status:'openDialog',
                    text:'ต้องการบันทึกข้อมูลใช่หรือไม่ ?',
                    confirmed:(result)=>{
                        if(result == true){
                            this.fire('toast',{status:'load'})
                            clearData(data,(newData)=>{
                                this.fire('toast',{status:'load'});
                                newData.id = data.id
                                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`/conditions/update`,newData)
                                .then(res=>{
                                    this.CONDITIONREADWELFARE_LIST();
                                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                                        callback:()=>{
                                            this.$$('panel-right').close();
                                        }
                                    });
                                })
                                .catch(err=>{
                                    console.log(err);
                                })
                            })
                        }
                    }
                })
            },
            CONDITIONREADWELFARE_DELETED:function(id){
                // console.log(id)
                this.fire('toast',{
                    status:'openDialog',
                    text:'ต้องการลบข้อมูลใช่หรือไม่ ?',
                    confirmed:(result)=>{
                        if(result == true){
                            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete(`./conditions/delete/id/${id}`)
                            .then(res=>{
                                this.CONDITIONREADWELFARE_LIST();
                                this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                                    callback:()=>{
                                        this.$$('panel-right').close();
                                    }
                                });
                            })
                        }
                    }
                })
                
            },
        }
    ]
}

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = dateDbReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = dateDbAction;



const initialState = {
    module:[],
    date:{},
    listYear:{}
}

function dateDbReducer(state = initialState,action){
    switch (action.type) {
        case 'GET_DATE':
            return Object.assign({},state,{date:action.payload});
        case 'GET_LIST_YEAR':
            return Object.assign({},state,{listYear:action.payload});
        default:
            return state;
    }
}

function dateDbAction(store){
    return [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),{
            GET_DATE:function(data){
                // var user = store.getState().auth.user;
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/date/currentdate')
                .then(res=>{
                    store.dispatch({type:'GET_DATE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            GET_LIST_YEAR:function(data){
                // var user = store.getState().auth.user;
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/date/listyear')
                .then(res=>{
                    store.dispatch({type:'GET_LIST_YEAR',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
    ]
}

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = fundReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = fundAction;



const initialState = {
    list: [],
    data: {},
    list_sheet: []
}

function fundReducer(state = initialState, action) {
    switch (action.type) {
        case 'FUND_SELECT_UPLOAD':
            return Object.assign({}, state, { data: action.payload });
        case 'FUND_PREVIEW_DATA':
            return Object.assign({}, state, { list: action.payload });
        case 'FUND_GET_SHEET':
            return Object.assign({}, state, { list_sheet: action.payload });
        default:
            return state
    }
}

function fundAction(store) {
    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(), {
        FUND_UPLOADFILE: function (file) {
            // console.log(file[0]);
            var data = new FormData();
            data.append('file', file[0]);
            var config = {
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                },
                headers: { 'ref-path': 'fund.file' }
            };
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post('./fund/upload', data, config)
                .then((response) => {
                    // console.log(response.data);
                    var id = response.data.generated_keys[0];
                    __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./fund/download/id/' + id)
                        .then((result) => {
                            // console.log(result);
                            store.dispatch({ type: 'FUND_SELECT_UPLOAD', payload: result.data[0] })
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        FUND_PREVIEW_DATA: function (data) {
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./fund/getfile/name/' + data.name + '/sheet/' + data.sheet)
                .then((result) => {
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            store.dispatch({ type: 'FUND_PREVIEW_DATA', payload: result.data })
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        FUND_INSERT: function (data) {
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post('./fund/insert', data)
                .then((response) => {
                    this.fire('toast', { 
                        status: 'success', text: 'เก็บข้อมูลลงฐานข้อมูลสำเร็จ', callback: () => {
                            // console.log(response);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        FUND_GET_SHEET: function (nameFile) {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./fund/sheet/' + nameFile)
                .then((result) => {
                    store.dispatch({ type: 'FUND_GET_SHEET', payload: result.data })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }]
}

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = fundRvdReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = fundRvdAction;
 
 
 const initialState = {
     data:{},
     dataList: [],
     userList:[]
 }
 function fundRvdReducer(state = initialState, action) {
      switch (action.type) {
        case 'FUND_RVD_GET_LIST' :
            return Object.assign({},state,{dataList:action.payload});
        case 'FUND_RVD_SELECT':
            return Object.assign({},state,{data:action.payload});
        case 'FUND_RVD_CLEAR_DATA':
            return Object.assign({},state,{data:{}});
        case 'FUND_RVD_GET_USER_LIST':
            return Object.assign({},state,{userList:action.payload});
        default:
            return state
    }
}
 function fundRvdAction(store) {
    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),
        {
            FUND_RVD_GET_LIST:function(otheruser=false){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('rvd')
                .then((response)=>{
                   this.fire('toast',{status:'success',
                     callback:()=>{
                         if (!otheruser) 
                             this.fundForm.resetComponents();
                         
                         store.dispatch({ type: 'FUND_RVD_GET_LIST', payload: response.data })
                     }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_INSERT:function (data) {
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post('./rvd/insert',data)
                .then((response)=>{
                    this.FUND_RVD_GET_LIST();
                    this.fundForm.editForm = false;
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_SELECT:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./rvd/id/'+id)
                .then((response)=>{
                    this.panelRight.open();
                    this.fundForm.resetComponents();
                    this.fundForm.editForm = true;
                    store.dispatch({ type: 'FUND_RVD_SELECT', payload: response.data })
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_DELETE:function(id) {
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/rvd/delete/id/'+id)
                .then((response)=>{
                    this.FUND_RVD_GET_LIST();
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_UPDATE:function (data) {
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('./rvd/update',data)
                .then((response)=>{
                    this.FUND_RVD_GET_LIST();
                    this.fundForm.editForm = true;
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_CLEAR_DATA:function(data){
                store.dispatch({ type: 'FUND_RVD_CLEAR_DATA' })
            },
            FUND_RVD_GET_USER_LIST:function(){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./rvd/signup/list')
                .then((response)=>{
                    // console.log(response.data);
                    var newData = response.data;
                    newData.map((item)=>{
                        if (item.academic_name == "") {
                            item.fullName = item.prefix_name + " " + item.firstname + " " + item.lastname
                        }
                        else {
                            item.fullName = item.academic_name + " " + item.firstname + " " + item.lastname
                        }
                        item.check = false;
                        return item;
                    })
                    store.dispatch({type:'FUND_RVD_GET_USER_LIST',payload:newData})
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_UPDATE_USER:function(id){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('./rvd/signup/update',id)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                     callback:()=>{
                          this.FUND_RVD_GET_USER_LIST()
                     }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_DELETE_USER:function(id){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('./rvd/signup/delete/id/'+id)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                          this.FUND_RVD_GET_USER_LIST()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_EXIT_FUND:function(data){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('./rvd/signup/leave/',data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                          this.FUND_RVD_GET_USER_LIST()
                      }
                     });
                })
                .catch((error)=>{
                console.log('error');
                console.log(error);
                });
            },
            FUND_RVD_EXIT_WORK:function(data){
                this.fire('toast',{status:'load'});
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put('rvd/signup/fund/out',data)
                .then((response)=>{
                     this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                          this.FUND_RVD_GET_USER_LIST()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            }
        }
    ]
}

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = groupWelfareReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = groupWelfareAction;



const initialState = {
    list: [],
    select: {},
    list_id: [],
    list_year: [],
    data_clone: []
}

function groupWelfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'LIST_WELFARE':
            return Object.assign({}, state, { list: action.payload });
        case 'LIST_WELFARE_ID':
            return Object.assign({}, state, { list_id: action.payload });
        case 'SELECT_DATA':
            return Object.assign({}, state, { select: action.payload });
        case 'GET_YEAR':
            return Object.assign({}, state, { list_year: action.payload });
        case 'CLEAR_WELFARE':
            return Object.assign({}, state, { select: action.payload });
        case 'CLEAR_WELFARE_ID':
            return Object.assign({}, state, { list_id: action.payload });
        case 'CLONE_DATA':
            return Object.assign({}, state, { data_clone: action.payload });
        default:
            return state
    }

}

function groupWelfareAction(store) {

    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),
    {
        LIST_WELFARE: function (year) {
            // console.log(year);
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/group/welfare/year/' + year)
                .then((result) => {
                    // console.log(result.data);
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            store.dispatch({ type: 'LIST_WELFARE', payload: result.data })
                        }
                    });
                })
                .catch(err => {

                })
        },
        LIST_WELFARE_ID: function (data) {
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/group/welfare/' + data)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            store.dispatch({ type: 'LIST_WELFARE_ID', payload: result.data })
                        }
                    });
                })
                .catch(err => {

                })
        },
        INSERT_WELFARE: function (data) {
            var yearNow = new Date().getFullYear();
            // console.log(data);
            let { year, start_date, end_date, cal_date, group_welfare_name, group_use, description, onetime_use, status_approve, type_continuous, voluntary_status, type_group} = data;
            let newData = { year, group_welfare_name, group_use, description, onetime_use, status_approve, type_continuous, voluntary_status, type_group};
            var tz = "T00:00:00+07:00";
            newData.start_date = data.start_date + tz;
            if(data.cal_date === null){
                newData.cal_date = data.cal_date;
            }else{
                newData.cal_date = data.cal_date + tz;
            }
            if(data.end_date === null){
                newData.end_date = data.end_date
            }else{
                newData.end_date = data.end_date + tz;
            }
            // console.log(newData);
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`./group/welfare/insert`, newData)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this.LIST_WELFARE(yearNow);
                            this.selectYear = yearNow;
                            this.clearData();
                            this.GET_YEAR();
                            // this.fire('closePanel');
                            this.$$('welfare-panel').checked_tab('#tab2');
                            this.$$('welfare-panel').getGroupWelfareId(result.data.id[0]);
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        DELETE_WELFARE: function (data) {
            // console.log(data);
            var year = new Date().getFullYear();
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete(`./group/welfare/delete/id/` + data.id)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'ลบสำเร็จ', callback: () => {
                            // console.log('success');
                            this.$$('panel-right').close();
                            this.LIST_WELFARE(year);
                            this.selectYear = year;
                            this.GET_YEAR();
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        EDIT_WELFARE: function (data) {
            var yearNow = new Date().getFullYear();
            // console.log(data);
            let { id, year, start_date, end_date, cal_date, group_welfare_name, group_use, description, onetime_use, type_continuous, voluntary_status, type_group} = data;
            let newData = { id, year, group_welfare_name, group_use, description, onetime_use, type_continuous, voluntary_status, type_group};
            var tz = "T00:00:00+07:00";
            newData.start_date = data.start_date + tz;
            if(data.cal_date === null){
                newData.cal_date = data.cal_date;
            }else{
                newData.cal_date = data.cal_date + tz;
            }
            if(data.end_date === null){
                newData.end_date = data.end_date
            }else{
                newData.end_date = data.end_date + tz;
            }
            // console.log(newData);
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`./group/welfare/update`, newData)
            .then((result) => {
                this.fire('toast', {
                    status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                        this.LIST_WELFARE(yearNow);
                        this.LIST_WELFARE_ID(data.id);
                        this.SELECT_DATA(data.id);
                        this.UPDATE_WELFARE(newData.id);
                        // console.log('success');
                    }
                });
            })
            .catch((err) => {
                // console.log(err);
            })
        },
        UPDATE_WELFARE: function(id){
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/group/welfare/' + id)
                .then((result) => {
                    // console.log(result.data);
                    var calDate = result.data.cal_date;
                    var data = result.data.welfare;
                    var typeGroup = result.data.type_group;
                    var con = result.data.type_continuous;
                    var one = result.data.onetime_use;
                    var tz = "T00:00:00+07:00";
                    for(var i = 0; i < data.length; i++){
                        // console.log(data[i].condition);
                        if(typeGroup == 'general'){
                            if(con === true && one === true){
                                data[i].round_use = true;
                            }else if(con === true && one === false){
                                data[i].round_use = false;
                            }else if(con === false && one === true){
                                data[i].round_use = true;
                            }
                        }else{
                            data[i].round_use = true;
                        }
                        var condition = data[i].condition;
                        var arr = [];
                        for(var j = 0; j < condition.length; j++){
                            var data2 = condition[j];
                            var search = data2.field_name.search('date');
                            var search_age = data2.field_name.search('age');
                            if (search != -1) {
                                if (data2.logic_show.search(">") >= 0) {
                                    var d = calDate.split("-");
                                    data2.value = (parseInt(d[0]) - parseInt(data2.value_show)) + "-" + d[1] + "-" + d[2].split("T")[0] + tz;
                                    data2.logic = data2.logic_show.replace(">", "<");
                                } else if (data2.logic_show.search("<") >= 0) {
                                    var d = calDate.split("-");
                                    data2.value = (parseInt(d[0]) - parseInt(data2.value_show)) + "-" + d[1] + "-" + d[2].split("T")[0] + tz;
                                    data2.logic = data2.logic_show.replace("<", ">");
                                }
                            }
                            else if(search_age != -1){
                                if (data2.logic_show.search(">") >= 0) {
                                    data2.value = parseInt(data2.value_show);
                                    data2.logic = data2.logic_show;
                                } else if (data.logic_show.search("<") >= 0) {
                                    data2.value = parseInt(data2.value_show);
                                    data2.logic = data2.logic_show;
                                }
                            }
                            else{
                                data2.value = data2.value_show;
                                data2.logic = data2.logic_show;
                            }
                            arr.push(data2);
                            // console.log(arr);
                        }
                        data[i].condition = arr;
                    }
                    // console.log(data);
                    var setWelfare = data.map((item) => {
                                        let {budget, budget_emp, condition, group_id, id, round_use, welfare_name} = item;
                                        let newitem = { budget, condition, group_id, id, round_use, welfare_name }
                                        return newitem;
                                    })
                    // console.log(setWelfare);
                    __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`./group/welfare/updateGroup`, setWelfare)
                    .then((result) => {
                        // console.log(result);
                    })
                    .catch((err) => {
                        // console.log(err);
                    })
                })
                .catch(err => {

                })
        },
        SELECT_DATA: function (val) {
            // console.log(val);
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/group/welfare/' + val)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'SELECT_DATA', payload: result.data })
                })
                .catch(err => {

                })
        },
        GET_YEAR() {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/group/welfare/year')
                .then(function (result) {
                    store.dispatch({ type: 'GET_YEAR', payload: result.data })
                })
                .catch(err => {

                })
        },
        APPROVE_WELFARE: function (data) {
            var yearNow = new Date().getFullYear();
            // console.log(data);
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`./group/welfare/approve`, data)
                .then((result) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            this.LIST_WELFARE_ID(data.id);
                            this.SELECT_DATA(data.id);
                            this.LIST_WELFARE(yearNow);
                            // console.log('success');
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        CLEAR_WELFARE: function (data) {
            // console.log(data);
            store.dispatch({ type: 'CLEAR_WELFARE', payload: data })
        },
        CLEAR_WELFARE_ID: function (data) {
            // console.log(data);
            store.dispatch({ type: 'CLEAR_WELFARE_ID', payload: [] })
        },
        CLONE_DATA:function (year){
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/group/welfare/year/' + year)
            .then((result) => {
                // console.log(result.data);
                result.data.map((val) => {
                    return val.check = false
                })
                var data = result.data.filter((item) => {
                    return item.status_approve == true && item.year !== 9999
                })
                store.dispatch({ type: 'CLONE_DATA', payload: data })
            })
        },
        INSERT_CLONE_DATA:function(data){
            // console.log(data);
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`./group/welfare/clone`, data)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this._closeDialog();
                            this.LIST_WELFARE(data.year);
                            this.selectYear = data.year;
                            this.GET_YEAR();
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        }
    }
    ]

}


/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = providerReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = providerAction;



const initialState = {
    list:[],
    select:{}
}

function providerReducer(state = initialState,action){

    switch (action.type) {
        case 'PROVIDER_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'PROVIDER_SELECT':
            return Object.assign({},state,{select:action.payload});
        default:
            return state
    }

}

function providerAction(store){

    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),
        {
            PROVIDER_LIST:function(){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/providers')
                .then(res=>{
                    store.dispatch({type:'PROVIDER_LIST',payload:res.data})
                })
                .catch(err=>{

                })
            },
            PROVIDER_SELECT:function(id){
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`/providers/provider/${id}`)
                .then(res=>{
                    store.dispatch({type:'PROVIDER_SELECT',payload:res.data})
                })
                .catch(err=>{

                })
                console.log(id);
            }
        }
    ]

}

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = retierReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = retierAction;


const initialState = {
    list: []
}
function retierReducer(state = initialState, action) {
    switch (action.type) {
        case 'RETIER_SEARCH':
            return Object.assign({}, state, { list: action.payload });
        default:
            return state
    }
}
function retierAction(store) {
    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),
    {
        RETIER_SEARCH: function (data) {
            // var tz = "T00:00:00+07:00";
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/retier/list?date=' + data)
                .then((result) => {
                    // console.log(result.data);
                    // result.data.map((item) => {
                    //     return item.check = true
                    // })
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            store.dispatch({ type: 'RETIER_SEARCH', payload: result.data })
                        }
                    });
                })
                .catch(err => {

                })
        }
    }
    ]
}

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = ssoReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = ssoAction;



const initialState = {
    list: [],
    data: {},
    list_sheet: []
}

function ssoReducer(state = initialState, action) {
    switch (action.type) {
        case 'SSO_SELECT_UPLOAD':
            return Object.assign({}, state, { data: action.payload });
        case 'SSO_PREVIEW_DATA':
            return Object.assign({}, state, { list: action.payload });
        case 'SSO_GET_SHEET':
            return Object.assign({}, state, { list_sheet: action.payload});
        default:
            return state
    }
}

function ssoAction(store) {
    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(), {
        SSO_UPLOADFILE: function (file) {
            // console.log(file[0]);
            var data = new FormData();
            data.append('file', file[0]);
            var config = {
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                },
                headers: { 'ref-path': 'sso.file' }
            };
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post('./sso/upload', data, config)
                .then((response) => {
                    // console.log(response.data);
                    var id = response.data.generated_keys[0];
                    __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./sso/download/id/' + id)
                        .then((result) => {
                            // console.log(result);
                            store.dispatch({ type: 'SSO_SELECT_UPLOAD', payload: result.data[0] })
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        SSO_PREVIEW_DATA: function (data) {
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./sso/getfile/name/' + data.name + '/sheet/' + data.sheet)
                .then((result) => {
                    // console.log(result);
                    for (var i = 0; i <= result.data.length; i++) {
                        if (result.data[i]) {
                            // console.log(result.data[i]);
                            var data = result.data[i];
                            if(data.issued_date === null){
                                console.log(data);
                            }
                            // data.issued_date = data.issued_date.split('T')[0];
                            // data.expired_date = data.expired_date.split('T')[0];
                        }
                    }
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            store.dispatch({ type: 'SSO_PREVIEW_DATA', payload: result.data })
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        SSO_INSERT: function (data) {
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post('./sso/insert', data)
                .then((response) => {
                    this.fire('toast', {
                        status: 'success', text: 'เก็บข้อมูลลงฐานข้อมูลสำเร็จ', callback: () => {
                            // console.log(response);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        SSO_GET_SHEET: function (nameFile) {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./sso/sheet/' + nameFile)
                .then((result) => {
                    store.dispatch({ type: 'SSO_GET_SHEET', payload: result.data });
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }]
}

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = systemConfigsReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = systemConfigsAction;



const initialState = {
    module: [],
    config: {}
}

function systemConfigsReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_SYSTEM_CONFIG':
            return Object.assign({}, state, { config: action.payload });
        default:
            return state;
    }
}

function systemConfigsAction(store) {
    return [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(), {
            GET_SYSTEM_CONFIG: function () {
                // var user = store.getState().auth.user;
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/system/config')
                    .then(res => {
                        // console.log(res.data);
                        store.dispatch({ type: 'GET_SYSTEM_CONFIG', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            UPDATE_SYSTEM_CONFIG: function (data) {
                // var user = store.getState().auth.user;
                this.fire('toast', { status: 'load' });
                
                            this.fire('toast', { status: 'load' })
                            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post('/system/config/update', data)
                                .then(res => {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ',
                                        callback: () => {
                                            this.GET_SYSTEM_CONFIG()
                                        }
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                
                // axios.post('/system/config/update',data)
                //     .then(res => {
                //         // console.log(res.data)
                //         // this.fire('toast', {
                //         // status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                //         //     console.log('success');
                //         //     this.GET_SYSTEM_CONFIG()
                //         // }
                //     // });
                //         // store.dispatch({ type: 'GET_SYSTEM_CONFIG', payload: res.data })
                //     })
                //     .catch(err => {
                //         console.log(err);
                //     })
            }
        }
    ]
}

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = uploadReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = uploadAction;



const initialState = {
    select:{},
    list:[],
    fileIdUpload:{},
    // listFiles:[]
}

function uploadReducer(state = initialState,action){

    switch (action.type) {
        case 'UPLOAD_LIST':
          return Object.assign({},state,{list:action.payload});
        default:
          return state
    }

}

function uploadAction(store){
    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),{
      UPLOAD_DELETE(data){
        this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete('/document/delete/'+data)
        .then( (response)=>{
            console.log(response);
            // store.dispatch({type:'UPLOAD_DELETE',payload:response.data})
            this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',callback:function(){
              console.log('success');
            }});
        })
        .catch(function (error) {
            console.log(error);
        });
      },
      UPLOAD_GET_FILE(fileId){
        // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        // axios.get('/file/download/'+fileId)
        // .then( (response)=>{
        //     console.log(response);
            
        //     // store.dispatch({type:'UPLOAD_DELETE',payload:response.data})
        //     this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',callback:function(){
        //       console.log('success');
        //     }});
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
      }
   }]
};


/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = userWelfareReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = userWelfareAction;



const initialState = {
    list: [],
    select: {},
    list_id: [],
    list_user: [],
    list_history_welfare: [],
    list_history_fund: [],
    list_group_fund:[],
    list_history_sso:[],
    listSearch: [],
    welfare_employee: [],
    select_use_welefares: {},
    faculty_list: []
}
const clearData = (data, callback) => {

    let { prefix_id, firstname, lastname, gender_id, type_employee_id, active_id, position_id, matier_id, academic_id, department_id, faculty_id, emp_no, personal_id,
        academic_name, active_name, gender_name, matier_name, position_name, prefix_name, department_name, type_employee_name, faculty_name, end_work_date, work_age, age,
        hospital,email,tel } = data;
    let newData = {
        prefix_id, firstname, lastname, gender_id, type_employee_id, active_id, position_id, matier_id, academic_id, department_id, faculty_id, emp_no, personal_id,
        academic_name, active_name, gender_name, matier_name, position_name, prefix_name, department_name, type_employee_name, faculty_name, end_work_date, work_age, age,
        hospital,email,tel
    };
    // newData.period = new Array();
    // data.period.map((tag)=>{
    //     newData.period.push({no:tag.no,quality:tag.quality});
    // });
    if (data.start_work_date !== undefined && data.start_work_date !== '') {
        // 2017-06-09T11:52:18.157+07:00
        newData.start_work_date = data.start_work_date + 'T00:00:00.000+07:00'
    } else {
        newData.start_work_date = data.start_work_date
    }
    if (data.end_work_date !== null && data.end_work_date !== '') {
        // log
        newData.end_work_date = data.end_work_date + 'T00:00:00.000+07:00'
    } else {
        newData.end_work_date = data.end_work_date
    }
    // console.log();
    newData.birthdate = data.birthdate + 'T00:00:00.000+07:00'
    callback(newData)
    // callback(data)
}
const clearDatawelfare = (data, callback) => {

    let { budget_balance, budget_cover, budget_use, emp_id, group_id, description_detail, 
        status, welfare_id, date_use, date_approve, personal_id,budget_emp,type_group } = data;
    let newData = { budget_balance, budget_cover, budget_use, emp_id, group_id, description_detail, 
        status, welfare_id, date_use, date_approve, personal_id,budget_emp,type_group };
    // console.log(data.date/use_welfare/update_use == '');

    newData.document_ids = new Array()
    data.document_ids.map((file) => {
        newData.document_ids.push(file)
    })
    // console.log(newData);
    callback(newData)
}
const changeTime = (data, timeZone, callback) => {
    let time
    data.map((item, index) => {
        for (var prop in item) {
            if (prop.indexOf('date') >= 0 && prop !== 'updater') {
                time = new Date(item[prop])
                // console.log(data[index][prop]);
                data[index][prop] = new Date(time.setHours(time.getHours() + timeZone)).toISOString()
                // console.log(new Date(data[index][prop]).toISOString());
            }
            // console.log(typeof item[prop] === 'object');
            if (typeof item[prop] === 'object')
                changeTime(item[prop], timeZone)
        }
    })
    callback(data)
}
function userWelfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'WELFARE_LIST_YEAR':
            return Object.assign({}, state, { list: action.payload });
        case 'WELFARE_LIST':
            return Object.assign({}, state, { list_id: action.payload });
        case 'LIST_USER':
            return Object.assign({}, state, { list_user: action.payload });
        case 'EMPLOYEE_HISTORY_WELFARE':
            return Object.assign({}, state, { list_history_welfare: action.payload });
        case 'EMPLOYEE_HISTORY_FUND':
             return Object.assign({}, state, { list_history_fund: action.payload });
        case 'EMPLOYEE_LIST_GROUP_FUND':
             return Object.assign({}, state, { list_group_fund: action.payload });
        case 'EMPLOYEE_HISTORY_SSO':
             return Object.assign({}, state, { list_history_sso: action.payload });
        case 'LIST_USER_SERARCH':
            return Object.assign({}, state, { listSearch: action.payload });
        case 'LIST_EMPLOYEE_WELFARE':
            return Object.assign({}, state, { welfare_employee: action.payload });
        case 'LIST_EMPLOYEES_WELFARE':
            return Object.assign({}, state, { welfare_employee: action.payload });
        case 'EMPLOYEE_GET_WELFARES':
            return Object.assign({}, state, { welfare_employee: action.payload });
        case 'EMPLOYEE_USE_SELETE_WELFARE':
            return Object.assign({}, state, { select_use_welefares: action.payload });
        case 'FACULTY_LIST':
            return Object.assign({}, state, { faculty_list: action.payload });
        case 'CLEAR_INSERT':
            return Object.assign({}, state, { welfare_employee: action.payload });
        default:
            return state
    }

}

function userWelfareAction(store) {

    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),
    {
        WELFARE_LIST_YEAR: function () {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./group/welfare/year')
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST_YEAR', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_LISTS: function () {
            // console.log(data);
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./welfare/active/')
                .then(function (result) {
                    result.data.map((item) => {
                        // console.log(item.group_use === true);
                        if (item.group_use === true) {
                            item.label = item.group_welfare_name + ' (แบบกลุ่ม)'
                        }else {
                            item.label = item.group_welfare_name
                        }
                    })
                    // console.log(JSON.stringify(result.data));
                    store.dispatch({ type: 'WELFARE_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_USER: function (id) {
            // console.log(id);
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./employee/list/work')
                .then(function (result) {
                    // console.log(result.data);
                    var newData = result.data.map((item) => {
                        if (item.academic_name == "") {
                            item.fullName = item.prefix_name + " " + item.firstname + " " + item.lastname
                        }
                        else {
                            item.fullName = item.academic_name + " " + item.firstname + " " + item.lastname
                        }
                    })
                    store.dispatch({ type: 'LIST_USER', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_USER_SERARCH: function (id) {
            // console.log(id);
            this.userSearch = id;
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./group/welfare/adminEmployee/' + id)
                .then((response) => {
                    //  console.log(JSON.stringify(response.data));
                    var newData = response.data.map((item) => {
                        if (item.academic_name == "") {
                            item.fullName = item.prefix_name + " " + item.firstname + " " + item.lastname
                        }
                        else {
                            item.fullName = item.academic_name + " " + item.firstname + " " + item.lastname
                        }
                        item.check = false;
                        return item;
                    })
                    store.dispatch({ type: 'LIST_USER_SERARCH', payload: newData })
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        USER_INSERT: function (data) {
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post('./history/request/', data)
                .then((response) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            this.LIST_USER_SERARCH(this.userSearch);
                        }
                    });
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        LIST_EMPLOYEE_WELFARE: function (data) {
            // console.log(data);
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./employee/' + data)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'LIST_EMPLOYEE_WELFARE', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_EMPLOYEES_WELFARE: function (data) {
            // console.log(data);
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./employee/' + data)
                .then(function (result) {
                    // console.log(result.data);
                    // changeTime(result.date,+7,(data)=>{
                    //     console.log(data);
                    // })
                    // console.log(result.data);
                    store.dispatch({ type: 'LIST_EMPLOYEES_WELFARE', payload: result.data })
                })
                .catch(err => {

                })
        },
        EMPLOYEE_GET_WELFARES: function (id) {
            // console.log(year);
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./employee/' + id)
                .then(res => {
                    // console.log(2);
                    // console.log(res.data);
                    // store.dispatch({ type: 'EMPLOYEE_GET_WELFARES', payload: res.data })
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ',
                        callback: () => {
                            store.dispatch({ type: 'EMPLOYEE_GET_WELFARES', payload: res.data })
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        EMPLOYEE_USE_SELETE_WELFARE(data) {
            // console.log(data);
            store.dispatch({ type: 'EMPLOYEE_USE_SELETE_WELFARE', payload: data })
        },
        EMPLOYEE_USE_WELFARE(data) {
            // console.log(data);
            clearDatawelfare(data, (newData) => {
                // console.log(newData);
                this.fire('toast', { status: 'load' });
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`./history/approve`, newData)
                    .then(res => {
                        this.EMPLOYEE_GET_WELFARES(newData.emp_id);
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        },
        // EMPLOYEE_USE_RVD(data) {
        //     // console.log(data);
        //     // clearDatawelfare(data, (newData) => {
        //         // console.log(newData);
        //         this.fire('toast', { status: 'load' });
        //         axios.post(`./history/rvd`, data)
        //             .then(res => {
        //                 // this.EMPLOYEE_GET_WELFARES(data.emp_id);
        //                 this.fire('toast', {
        //                     status: 'success', text: 'บันทึกสำเร็จ',
        //                     callback: () => {
        //                         // this.$$('panel-right').close();
        //                         // this.$$('#welfare_budget').close()
        //                     }
        //                 });
        //             })
        //             .catch(err => {
        //                 console.log(err);
        //             })
        //     // })
        // },
        EMPLOYEE_USE_REJECT_RVD(data) {
            // console.log(data);
            // clearDatawelfare(data, (newData) => {
                // console.log(newData);
                this.fire('toast', { status: 'load' });
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`./history/rejectrvd`, data)
                    .then(res => {
                        console.log(data);
                        this.EMPLOYEE_GET_WELFARES(data.emp_id);
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            // })
        },
        EMPLOYEE_USE_WELFARE_GROUP(data) {
            // console.log(data);
                this.fire('toast', { status: 'load' });
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`./history/usegroup`, data)
                    .then(res => {
                        // this.EMPLOYEE_GET_WELFARES(newData.emp_id);
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
        },
        EMPLOYEE_HISTORY_WELFARE(data) {
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`./history/list/welfare?`+ data)
                    .then(res => {
                        store.dispatch({ type: 'EMPLOYEE_HISTORY_WELFARE', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
        },
        EMPLOYEE_HISTORY_FUND(data) {
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`./history/list/fund?`+ data)
                    .then(res => {
                        store.dispatch({ type: 'EMPLOYEE_HISTORY_FUND', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
        },
        EMPLOYEE_LIST_GROUP_FUND() {
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`./history/list/group/fund?`)
                    .then(res => {
                        store.dispatch({ type: 'EMPLOYEE_LIST_GROUP_FUND', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
        },
        EMPLOYEE_HISTORY_SSO(data) {
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`./history/list/sso?`+ data)
                    .then(res => {
                        store.dispatch({ type: 'EMPLOYEE_HISTORY_SSO', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
        },
        FACULTY_LIST() {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./common/faculty')
                .then((response) => {
                    store.dispatch({ type: 'FACULTY_LIST', payload: response.data })
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        EMPLOYEE_UPDATE(data) {
            // console.log(data);
            this.fire('toast', { status: 'load' })
           return  clearData(data, (newData) => {
                // console.log(newData);
                // this.fire('toast', { status: 'load' });
                newData.id = data.id
                // console.log(newData);
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`/employee/update`, newData)
                    .then(res => {
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                this.fire('back-page');
                                this.EMPLOYEE_GET_WELFARES(newData.id);
                                // this.LIST_EMPLOYEE_WELFARE(newData.id);
                                this.EMPLOYEE_USE_SELETE_WELFARE();
                                // this.LIST_USER();
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        },
        EMPLOYEE_UPDATE_RETIREMENT(data) {
            this.fire('toast', { status: 'load' })
            clearData(data, (newData) => {
                // console.log(newData);
                // this.fire('toast', { status: 'load' });
                newData.id = data.id
                // console.log(newData);
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`/employee/update`, newData)
                    .then(res => {
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                console.log(111);
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        },
        EMPLOYEE_INSERT(data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการบันทึกข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        clearData(data, (newData) => {
                            console.log(newData);
                            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post('./employee/insert', newData)
                                .then(res => {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ',
                                        callback: () => {
                                            this.dispatchAction('USERS_LIST_HISTORY_WELFARE', '')
                                            this.fire('close-panel-right');
                                            // this.LIST_USER();
                                            // this.fire('back_page');
                                        }
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        })
                    }
                    else {
                        this.fire('back_page');
                    }
                }
            })
        },
        CLEAR_INSERT() {
            store.dispatch({ type: 'CLEAR_INSERT', payload: {} })
        }
    }
    ]

    // ./employee/use_welfare/

}


/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = usersReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = usersAction;



const initialState = {
    lists: [],
    select: {},
    select_personal_id: {},
    select_welefares: {},
    select_use_welefares: { date_use: new Date().toISOString().split('T')[0] },
    disabled: true,
    insert_view: true,
    lisyUserFalse: [],
    lisyUserhistoryWelfare: [],
    listRvpFund: [],
    rvp_fund: []
}
const clearData = (data, callback) => {

    let { prefix_id, firstname, lastname, gender_id, type_employee_id, active_id, position_id, matier_id, academic_id, department_id, faculty_id, emp_no, personal_id,
        academic_name, active_name, gender_name, matier_name, position_name, prefix_name, department_name, type_employee_name, faculty_name, end_work_date, work_age, age } = data;
    let newData = {
        prefix_id, firstname, lastname, gender_id, type_employee_id, active_id, position_id, matier_id, academic_id, department_id, faculty_id, emp_no, personal_id,
        academic_name, active_name, gender_name, matier_name, position_name, prefix_name, department_name, type_employee_name, faculty_name, end_work_date, work_age, age
    };// newData.period = new Array();
    // data.period.map((tag)=>{
    //     newData.period.push({no:tag.no,quality:tag.quality});
    // });
    if (data.start_work_date !== undefined && data.start_work_date !== '') {
        newData.start_work_date = data.start_work_date + 'T00:00:00.000+07:00'
        // 2017-06-09T04:44:06.162+00:00
    } else {
        newData.start_work_date = data.start_work_date
    }
    if (data.end_work_date !== null && data.end_work_date !== '') {
        // log
        newData.end_work_date = data.end_work_date + 'T00:00:00.000+07:00'
    } else {
        newData.end_work_date = data.end_work_date
    }
    // console.log();
    newData.birthdate = data.birthdate + 'T00:00:00.000+07:00'
    callback(newData)
    // callback(data)
}
const clearDatawelfare = (data, callback) => {

    let { budget_balance, budget_cover, budget_use, emp_id, group_id, description_detail, 
        status, welfare_id, date_use, date_approve,type_group } = data;
    let newData = { budget_balance, budget_cover, budget_use, emp_id, group_id, description_detail, 
        status, welfare_id, date_use, date_approve,type_group };
    // console.log(data.date/use_welfare/update_use == '');

    newData.document_ids = new Array()
    data.document_ids.map((file) => {
        newData.document_ids.push(file)
    })
    // console.log(newData);
    callback(newData)
}
function usersReducer(state = initialState, action) {

    switch (action.type) {
        case 'USERS_LIST':
            // console.log(1)
            return Object.assign({}, state, { lists: action.payload });
        case 'USER_SELECT':
            return Object.assign({}, state, { select: action.payload });
        case 'USER_SEARCH_PERSONAL_ID':
            return Object.assign({}, state, { select_personal_id: action.payload });
        case 'USER_GET_WELFARES':
            return Object.assign({}, state, { select_welefares: action.payload });
        case 'USER_BTN':
            return Object.assign({}, state, { disabled: action.payload });
        case 'USER_INSERT_VIEW':
            return Object.assign({}, state, { insert_view: action.payload });
        case 'USER_USE_SELETE_WELFARE':
            return Object.assign({}, state, { select_use_welefares: action.payload });
        case 'USERS_FALSE_LIST':
            return Object.assign({}, state, { lisyUserFalse: action.payload });
        case 'USERS_LIST_HISTORY_WELFARE':
            return Object.assign({}, state, { lisyUserhistoryWelfare: action.payload });
        case 'USER_RVP_FUND_LIST':
            return Object.assign({}, state, { listRvpFund: action.payload });
        case 'USER_RVP_FUND':
            return Object.assign({}, state, { rvp_fund: action.payload });
        default:
            return state
    }

}

function usersAction(store) {

    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),
    {
        USERS_LIST: function () {
            // console.log(1)
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('./employee/list')
                .then(res => {
                    console.log(res.data)
                    store.dispatch({ type: 'USERS_LIST', payload: res.data })
                })
                .catch(err => {

                })
        },
        USER_INSERT(data) {
            clearData(data, (newData) => {
                this.fire('toast', { status: 'load' });
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`./employee/insert`, newData)
                    .then(res => {
                        this.USERS_LIST();
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                this.$$('panel-right').close();
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        },
        USER_SEARCH_PERSONAL_ID: function (pid) {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`./employee/search/${pid}`)
                .then(res => {
                    // console.log(res.data)
                    // console.log(res.data.length);
                    // console.log(res.data.length > 0);
                    let newData = {}
                    if (res.data.length > 0) {
                        newData = res.data[0]
                    } else {
                        this.fire('toast', {
                            status: 'error', text: 'ไม่พบข้อมล',
                            callback: () => {
                                // this.$$('panel-right').close();
                            }
                        });
                    }

                    store.dispatch({ type: 'USER_SEARCH_PERSONAL_ID', payload: newData })
                })
                .catch(err => {

                })
        },
        USER_SELECT: function (data) {
            store.dispatch({ type: 'USER_SELECT', payload: data })
        },
        USER_EDIT: function (data) {
            // console.log(data)
            this.fire('toast', { status: 'load' })
            clearData(data, (newData) => {
                this.fire('toast', { status: 'load' });
                newData.id = data.id
                // console.log(newData);
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`/employee/update`, newData)
                    .then(res => {
                        this.USER_GET_WELFARES(newData.id, true);
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                this.$$('panel-right').close();
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })


        },
        USER_DELETED: function (id) {
            // console.log(id)
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการลบข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete(`./employee/delete/${id}`)
                            .then(res => {
                                this.USERS_LIST();
                                this.fire('toast', {
                                    status: 'success', text: 'ลบข้อมูลสำเร็จ',
                                    callback: () => {
                                        this.$$('panel-right').close();
                                    }
                                });
                            })
                    }
                }
            })

        },
        USER_BTN(data) {
            // console.log(data)
            store.dispatch({ type: 'USER_BTN', payload: data })
        },
        USER_INSERT_VIEW(data) {
            // console.log(data)
            store.dispatch({ type: 'USER_INSERT_VIEW', payload: data })
        },
        USER_GET_WELFARES(id, otherFunction = false) {
            // console.log('otherFunctioncdddd', year)
            // console.log(typeof id );
            if (typeof id !== 'undefined' && id !== 'undefined' && id !== '') {
                this.fire('toast', { status: 'load' });
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`./employee/${id}`)
                    .then(res => {
                        // console.log(res)
                        this.fire('toast', {
                            status: 'success', text: 'โหลดข้อมูลสำเร็จ',
                            callback: () => {
                                store.dispatch({ type: 'USER_GET_WELFARES', payload: res.data })
                                if (!otherFunction)
                                    this.$$('panel-right').open();
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

        },
        USER_USE_WELFARE(data) {
            // console.log(data);
            clearDatawelfare(data, (newData) => {

                this.fire('toast', { status: 'load' });
                // newData.status = true;
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`./history/request/`, newData)
                    .then(res => {
                        this.USER_GET_WELFARES(newData.emp_id, true);
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        },
        USER_USE_WELFARE_APPROVE(data, url = () => { }) {
            // console.log(data);
            this.fire('toast', { status: 'load' });
            // let myFirstPromise = new Promise((resolve, reject) => {
            //     let newData = data.map((item) => {
            clearDatawelfare(data, (newData) => {
                //             item = newData
                //         })
                //         return item
                //     })
                //     resolve(newData)
                // });
                // myFirstPromise.then((data) => {
                //     // console.log(el);
                __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`./history/update/approve`, data)
                    .then(res => {
                        console.log(res.data);
                        // this.dispatchAction('USERS_FALSE_LIST');
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                // console.log(url);
                                // url()
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })

        },
        USER_REJECT_USE_WELFARE(data, url = () => { }) {
            // clearDatawelfare(data, (newData) => {
            //     newData.id = data.id;
            this.fire('toast', { status: 'load' });
            return __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`./history/update/reject`, data)
                .then(res => {
                    // this.dispatchAction('USERS_FALSE_LIST');
                    // console.log(11111);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            url()
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
            // })
            // console.log(data);
            //  this.fire('toast',{
            //     status:'openDialog',
            //     text:'ต้องการลบข้อมูลใช่หรือไม่ ?',
            //     confirmed:(result)=>{
            //         if(result == true){
            //             axios.delete(`./employee/use_welfare/delete/id/${id}`)
            //             .then(res=>{
            //                 this.dispatchAction('USERS_FALSE_LIST');
            //                 this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
            //                     callback:()=>{
            //                         // this.$$('panel-right').close();
            //                     }
            //                 });
            //             })
            //         }
            //     }
            // })
        },
        USER_CANCEL_USE_WELFARE(data, url = () => { }) {
            // clearDatawelfare(data, (newData) => {
            //     newData.id = data.id;
            this.fire('toast', { status: 'load' });
            return __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`./history/update/cancel`, data)
                .then(res => {
                    // this.dispatchAction('USERS_FALSE_LIST');
                    // console.log(11111);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            // url()
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_USE_SELETE_WELFARE(data) {
            store.dispatch({ type: 'USER_USE_SELETE_WELFARE', payload: data })
        },
        USERS_FALSE_LIST(data = '') {
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`./history/unapprove?` + data)
                .then(res => {
                    // console.log(res)
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ',
                        callback: () => {
                            store.dispatch({ type: 'USERS_FALSE_LIST', payload: res.data })
                            // if(!otherFunction)
                            //     this.$$('panel-right').open();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USERS_LIST_HISTORY_WELFARE(data = '') {

            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`./history/search?` + data)
                .then(res => {
                    // console.log(res)

                    store.dispatch({ type: 'USERS_LIST_HISTORY_WELFARE', payload: res.data })
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_RVP_FUND(pid) {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get(`./rvd/signup/pid/${pid}`)
                .then(res => {
                    // console.log(res)
                    store.dispatch({ type: 'USER_RVP_FUND', payload: res.data })
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_RVP_SIGNUP(data, pid) {
            this.fire('toast', { status: 'load' })
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`./rvd/signup/`, data)
                .then(res => {
                    if (res.data.insert_status) {
                        // console.log(1);
                        this.fire('toast', {
                            status: 'success', text: 'สมัครสำเร็จ',
                            callback: () => {
                                this.dispatchAction('USER_RVP_FUND', pid);
                            }
                        });
                    } else {
                        // console.log(2);
                        this.fire('toast', {
                            status: 'error', text: 'ไม่สามารถสมัครได้',
                            callback: () => {
                            }
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                })

        },
        USER_RVP_LEAVE_FUND(fid, pid) {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`./rvd/signup/leave/`, fid)
                .then(res => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            this.dispatchAction('USER_RVP_FUND', pid);
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_RVP_FUND_OUT(fid, pid) {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`./rvd/signup/fund/out/`, fid)
                .then(res => {
                    console.log(res)
                    this.dispatchAction('USER_RVP_FUND', pid);
                })
                .catch(err => {
                    console.log(err);
                })

        },
    },

    ]

}

/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axios__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = welfareReducer;
/* harmony export (immutable) */ __webpack_exports__["b"] = welfareAction;



const initialState = {
    list: [],
    select: {},
    list_id: [],
    dataSelect: {
        condition: []
    },
    condition: [],
    employees: []
}

function welfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'WELFARE_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'WELFARE_LIST_ID':
            return Object.assign({}, state, { list_id: action.payload });
        case 'WELFARE_DATA_SELECT':
            return Object.assign({}, state, { dataSelect: action.payload });
        case 'CONDITION_LIST':
            return Object.assign({}, state, { condition: action.payload });
        case 'WELFARE_LIST_EMPLOYEE':
            return Object.assign({}, state, { employees: action.payload });
        default:
            return state
    }

}

function welfareAction(store) {

    return [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__config__["b" /* commonAction */])(),
    {
        WELFARE_LIST: function () {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/welfare')
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_LIST_ID: function (data) {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/welfare/' + data)
                .then(function (result) {
                    // console.log('*', result.data);
                    store.dispatch({ type: 'WELFARE_LIST_ID', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_INSERT: function (data) {
            // console.log(data);
            var year = new Date().getFullYear();
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].post(`./welfare/insert`, data)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this.LIST_WELFARE_ID(data.group_id);
                            this.fire('refresh_group', year);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        WELFARE_DELETE: function (data) {
            // console.log(data);
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].delete(`./welfare/delete/id/` + data.id)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'ลบสำเร็จ', callback: () => {
                            // console.log('success');
                            this.LIST_WELFARE_ID(data.group_id);
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        WELFARE_EDIT: function (data) {
            // console.log(data);
            var year = new Date().getFullYear();
            this.fire('toast', { status: 'load' });
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].put(`./welfare/update`, data)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this.WELFARE_DATA_SELECT(data.id);
                            this.LIST_WELFARE_ID(data.group_id);
                            this.fire('refresh_group', year);
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        WELFARE_DATA_SELECT: function (val) {
            this.WELFARE_DATA_SELECT_CLEAR();
            // this.id = val
            // console.log(store.getState().welfare.condition);
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/welfare/' + val)
                .then(function (result) {
                    // console.log(result.data);
                    // console.log("*",result.data);
                    var data = result.data.condition;
                    var condition = store.getState().welfare.condition;

                    var use = data.map((item) => {
                        return item.field
                    })
                    // console.log(use);

                    var diff = condition.filter((item) => {
                        return use.indexOf(item.id) < 0;
                    })
                    // console.log(diff);

                    for (var i in data) {
                        for (var j in condition) {
                            if (condition[j].id == data[i].field) {
                                data[i].field = condition[j]
                            }
                        }
                        var a = [];
                        for (var j in diff) {
                            a.push(diff[j]);
                        }
                        a.push(data[i].field);
                        // console.log(a);
                        data[i].itemField = a;
                        // this.set('data.condition.' + i + '.itemField', a);
                    }
                    // console.log(result.data);

                    store.dispatch({ type: 'WELFARE_DATA_SELECT', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_DATA_SELECT_CLEAR: function () {
            store.dispatch({ type: 'WELFARE_DATA_SELECT', payload: { condition: [] } })
        },
        CONDITION_LIST: function () {
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/conditions/list')
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'CONDITION_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_LIST_EMPLOYEE: function (id) {
            // console.log(id);
            __WEBPACK_IMPORTED_MODULE_0__axios__["a" /* default */].get('/welfare/employee/' + id)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST_EMPLOYEE', payload: result.data })
                })
                .catch(err => {

                })
        }
    }
    ]

}


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzE5M2M1OTIwYjk3OGUxNzJkNWUiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9heGlvcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY2FuY2VsL0NhbmNlbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC1lcy9pc1BsYWluT2JqZWN0LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgvZXMvY29tcG9zZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlZHV4L2VzL2NyZWF0ZVN0b3JlLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgvZXMvdXRpbHMvd2FybmluZy5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9idG9hLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwid2VicGFjazovLy8uL34vYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qcyIsIndlYnBhY2s6Ly8vLi9+L2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2p3dC1kZWNvZGUvbGliL2F0b2IuanMiLCJ3ZWJwYWNrOi8vLy4vfi9qd3QtZGVjb2RlL2xpYi9iYXNlNjRfdXJsX2RlY29kZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2p3dC1kZWNvZGUvbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoLWVzL19iYXNlR2V0VGFnLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoLWVzL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovLy8uL34vbG9kYXNoLWVzL19nZXRQcm90b3R5cGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gtZXMvX2dldFJhd1RhZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZGFzaC1lcy9fb2JqZWN0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gtZXMvX292ZXJBcmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gtZXMvX3Jvb3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2Rhc2gtZXMvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovLy8uL34vcG9seW1lci1yZWR1eC9wb2x5bWVyLXJlZHV4LmpzIiwid2VicGFjazovLy8uL34vcmVkdXgvZXMvYXBwbHlNaWRkbGV3YXJlLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgvZXMvYmluZEFjdGlvbkNyZWF0b3JzLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgvZXMvY29tYmluZVJlZHVjZXJzLmpzIiwid2VicGFjazovLy8uL34vcmVkdXgvZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9zeW1ib2wtb2JzZXJ2YWJsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3N5bWJvbC1vYnNlcnZhYmxlL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3N5bWJvbC1vYnNlcnZhYmxlL2xpYi9wb255ZmlsbC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9hdXRoLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9jaGFydC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvY29tbW9uRGF0YS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvY29tbW9uU3lzdGVtLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9jb25kaXRpb25SZWFkV2VsZmFyZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvZGF0ZURiLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9mdW5kLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9mdW5kUnZkLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9ncm91cFdlbGZhcmUuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9yZWR1Y2VyL3Byb3ZpZGVyLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9yZXRpZXIuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9yZWR1Y2VyL3Nzby5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvc3lzdGVtQ29uZmlncy5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvdXBsb2FkLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci91c2VyV2VsZmFyZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvdXNlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9yZWR1Y2VyL3dlbGZhcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsRUFBRTtBQUN4QyxhQUFhOztBQUViO0FBQ0EsMEJBQTBCLFdBQVc7QUFDckMsdUJBQXVCLFdBQVcsR0FBRyxTQUFTO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7O0FBRWI7QUFDQTtBQUNBOztBQUVBLDJCQUFrQyx5QkFBeUIsR0FBRyxjQUFjLEU7Ozs7Ozs7Ozs7OztBQ3hEN0Q7QUFDQztBQUNoQjtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxxRTs7Ozs7OztBQ1BBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEIsV0FBVyxTQUFTO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQ0FBbUMsT0FBTztBQUMxQztBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsU0FBUyxHQUFHLFNBQVM7QUFDNUMsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUEsdUNBQXVDLE9BQU87QUFDOUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzFTQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixVQUFVOzs7Ozs7OzsrQ0N2THRDOztBQUVBO0FBQ0E7O0FBRUEsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0U7QUFDeEU7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxZQUFZO0FBQ25CO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7OytDQzVGQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRDQUE0QztBQUM1Qzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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QkFBaUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBb0Msb0RBQW9EO0FBQ3hGLGlCQUFpQjtBQUNqQjs7QUFFQSxpQkFBaUI7QUFDakIsU0FBUztBQUNUO0FBQ0EsNEJBQTRCLHdDQUF3QyxnQkFBZ0IsRUFBRTtBQUN0RixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsK0NBQStDO0FBQ25GLGlCQUFpQjtBQUNqQjs7QUFFQSxpQkFBaUI7QUFDakIsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msc0RBQXNEO0FBQzFGLGlCQUFpQjtBQUNqQjs7QUFFQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6Ii4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNzIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDMxOTNjNTkyMGI5NzhlMTcyZDVlIiwiZXhwb3J0IGZ1bmN0aW9uIGNvbW1vbkFjdGlvbigpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsaXN0ZW5lcnM6e1xyXG4gICAgICAgICAgICAnbWV0aG9kJzonaGFuZGxlQ2FsbCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhhbmRsZUNhbGw6ZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIHZhciBkZXRhaWwgPSBlLmRldGFpbDtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBkZXRhaWwuYXJncztcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gZGV0YWlsLmNhbGxiYWNrO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBhcmdzWzBdO1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpO1xyXG4gICAgICAgICAgICBpZihhcmdzLmxlbmd0aD4xKVxyXG4gICAgICAgICAgICBhcmdzID0gYXJncy5zbGljZSgxLGFyZ3MubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhcmdzVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBbXTtcclxuICAgICAgICAgICAgYXJncy5tYXAoKHJvdyxpKT0+e1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2gocm93KTtcclxuICAgICAgICAgICAgICAgIGlmKGkhPTApIGFyZ3NUZXh0Kz0nLCc7XHJcbiAgICAgICAgICAgICAgICBhcmdzVGV4dCArPSBgcGFyYW1zWyR7aX1dYFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY2FsbGJhY2soZXZhbChgXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLiR7bWV0aG9kTmFtZX0pXHJcbiAgICAgICAgICAgICAgICB0aGlzLiR7bWV0aG9kTmFtZX0oJHthcmdzVGV4dH0pXHJcbiAgICAgICAgICAgIGApKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hBY3Rpb25CZWhhdmlvcigpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkaXNwYXRjaEFjdGlvbjpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc2xvdmUscmVqZWN0KT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCdtZXRob2QnLHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzOmFyZ3VtZW50cyxcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazoocHJvbWlzZSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHByb21pc2UgPT0gXCJ1bmRlZmluZWRcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNsb3ZlKCdBY3Rpb24gbm8gcHJvbWlzZS4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oKHJlcyk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNsb3ZlKHByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycik9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgYmFzZVVSTCA9IGBodHRwczovLyR7d2luZG93LmxvY2F0aW9uLmhvc3RuYW1lfToke2xvY2F0aW9uLnBvcnR9YDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvY29uZmlnLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7Y3JlYXRlfSBmcm9tICdheGlvcydcclxuaW1wb3J0IHtiYXNlVVJMfSBmcm9tICcuL2NvbmZpZydcclxuY29uc3Qgc2V0dGluZ0F4aW9zID0gY3JlYXRlKHtcclxuICAgIGJhc2VVUkw6YmFzZVVSTCsnL2FwaScsXHJcbiAgICAvLyBoZWFkZXJzOiBoZWFkZXJzLmNvbW1vblsnQXV0aG9yaXphdGlvbiddID0gbG9jYWxTdG9yYWdlLnRva2VuXHJcbn0pO1xyXG5zZXR0aW5nQXhpb3MuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0F1dGhvcml6YXRpb24nXSA9IGxvY2FsU3RvcmFnZS50b2tlblxyXG5leHBvcnQgZGVmYXVsdCBzZXR0aW5nQXhpb3NcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvYXhpb3MuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG5cbi8qZ2xvYmFsIHRvU3RyaW5nOnRydWUqL1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG4gIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgLT4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50ID09PSAnZnVuY3Rpb24nXG4gICk7XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyAmJiAhaXNBcnJheShvYmopKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW1cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgUFJPVEVDVElPTl9QUkVGSVggPSAvXlxcKVxcXVxcfScsP1xcbi87XG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2UoUFJPVEVDVElPTl9QUkVGSVgsICcnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcblxuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1laHRvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2RlZmF1bHRzLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG52YXIgYnRvYSA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYnRvYSAmJiB3aW5kb3cuYnRvYS5iaW5kKHdpbmRvdykpIHx8IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idG9hJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIGxvYWRFdmVudCA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICAgIHZhciB4RG9tYWluID0gZmFsc2U7XG5cbiAgICAvLyBGb3IgSUUgOC85IENPUlMgc3VwcG9ydFxuICAgIC8vIE9ubHkgc3VwcG9ydHMgUE9TVCBhbmQgR0VUIGNhbGxzIGFuZCBkb2Vzbid0IHJldHVybnMgdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG4gICAgLy8gRE9OJ1QgZG8gdGhpcyBmb3IgdGVzdGluZyBiL2MgWE1MSHR0cFJlcXVlc3QgaXMgbW9ja2VkLCBub3QgWERvbWFpblJlcXVlc3QuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcgJiZcbiAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gcmVxdWVzdCkgJiZcbiAgICAgICAgIWlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkge1xuICAgICAgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcbiAgICAgIGxvYWRFdmVudCA9ICdvbmxvYWQnO1xuICAgICAgeERvbWFpbiA9IHRydWU7XG4gICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVQcm9ncmVzcygpIHt9O1xuICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge307XG4gICAgfVxuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdFtsb2FkRXZlbnRdID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0ICYmICF4RG9tYWluKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICAvLyBJRSBzZW5kcyAxMjIzIGluc3RlYWQgb2YgMjA0IChodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvcy9pc3N1ZXMvMjAxKVxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gMjA0IDogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzID09PSAxMjIzID8gJ05vIENvbnRlbnQnIDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnKSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcigndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnKSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICB2YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG5cbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cbiAgICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcud2l0aENyZWRlbnRpYWxzKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChyZXF1ZXN0LnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTtcbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChyZXF1ZXN0RGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiBAIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVzcG9uc2UpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gtZXMvX1N5bWJvbC5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGJhc2VHZXRUYWcgZnJvbSAnLi9fYmFzZUdldFRhZy5qcyc7XG5pbXBvcnQgZ2V0UHJvdG90eXBlIGZyb20gJy4vX2dldFByb3RvdHlwZS5qcyc7XG5pbXBvcnQgaXNPYmplY3RMaWtlIGZyb20gJy4vaXNPYmplY3RMaWtlLmpzJztcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gaW5mZXIgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLiAqL1xudmFyIG9iamVjdEN0b3JTdHJpbmcgPSBmdW5jVG9TdHJpbmcuY2FsbChPYmplY3QpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGF0IGlzLCBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGVcbiAqIGBPYmplY3RgIGNvbnN0cnVjdG9yIG9yIG9uZSB3aXRoIGEgYFtbUHJvdG90eXBlXV1gIG9mIGBudWxsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuOC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHZhbHVlKSB8fCBiYXNlR2V0VGFnKHZhbHVlKSAhPSBvYmplY3RUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHByb3RvID0gZ2V0UHJvdG90eXBlKHZhbHVlKTtcbiAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIEN0b3IgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3RvLCAnY29uc3RydWN0b3InKSAmJiBwcm90by5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IgJiZcbiAgICBmdW5jVG9TdHJpbmcuY2FsbChDdG9yKSA9PSBvYmplY3RDdG9yU3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc1BsYWluT2JqZWN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC1lcy9pc1BsYWluT2JqZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENvbXBvc2VzIHNpbmdsZS1hcmd1bWVudCBmdW5jdGlvbnMgZnJvbSByaWdodCB0byBsZWZ0LiBUaGUgcmlnaHRtb3N0XG4gKiBmdW5jdGlvbiBjYW4gdGFrZSBtdWx0aXBsZSBhcmd1bWVudHMgYXMgaXQgcHJvdmlkZXMgdGhlIHNpZ25hdHVyZSBmb3JcbiAqIHRoZSByZXN1bHRpbmcgY29tcG9zaXRlIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZ1bmNzIFRoZSBmdW5jdGlvbnMgdG8gY29tcG9zZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiBvYnRhaW5lZCBieSBjb21wb3NpbmcgdGhlIGFyZ3VtZW50IGZ1bmN0aW9uc1xuICogZnJvbSByaWdodCB0byBsZWZ0LiBGb3IgZXhhbXBsZSwgY29tcG9zZShmLCBnLCBoKSBpcyBpZGVudGljYWwgdG8gZG9pbmdcbiAqICguLi5hcmdzKSA9PiBmKGcoaCguLi5hcmdzKSkpLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmdW5jcyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGZ1bmNzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgaWYgKGZ1bmNzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICByZXR1cm4gYXJnO1xuICAgIH07XG4gIH1cblxuICBpZiAoZnVuY3MubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGZ1bmNzWzBdO1xuICB9XG5cbiAgdmFyIGxhc3QgPSBmdW5jc1tmdW5jcy5sZW5ndGggLSAxXTtcbiAgdmFyIHJlc3QgPSBmdW5jcy5zbGljZSgwLCAtMSk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHJlc3QucmVkdWNlUmlnaHQoZnVuY3Rpb24gKGNvbXBvc2VkLCBmKSB7XG4gICAgICByZXR1cm4gZihjb21wb3NlZCk7XG4gICAgfSwgbGFzdC5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC9lcy9jb21wb3NlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICdsb2Rhc2gtZXMvaXNQbGFpbk9iamVjdCc7XG5pbXBvcnQgJCRvYnNlcnZhYmxlIGZyb20gJ3N5bWJvbC1vYnNlcnZhYmxlJztcblxuLyoqXG4gKiBUaGVzZSBhcmUgcHJpdmF0ZSBhY3Rpb24gdHlwZXMgcmVzZXJ2ZWQgYnkgUmVkdXguXG4gKiBGb3IgYW55IHVua25vd24gYWN0aW9ucywgeW91IG11c3QgcmV0dXJuIHRoZSBjdXJyZW50IHN0YXRlLlxuICogSWYgdGhlIGN1cnJlbnQgc3RhdGUgaXMgdW5kZWZpbmVkLCB5b3UgbXVzdCByZXR1cm4gdGhlIGluaXRpYWwgc3RhdGUuXG4gKiBEbyBub3QgcmVmZXJlbmNlIHRoZXNlIGFjdGlvbiB0eXBlcyBkaXJlY3RseSBpbiB5b3VyIGNvZGUuXG4gKi9cbmV4cG9ydCB2YXIgQWN0aW9uVHlwZXMgPSB7XG4gIElOSVQ6ICdAQHJlZHV4L0lOSVQnXG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBSZWR1eCBzdG9yZSB0aGF0IGhvbGRzIHRoZSBzdGF0ZSB0cmVlLlxuICogVGhlIG9ubHkgd2F5IHRvIGNoYW5nZSB0aGUgZGF0YSBpbiB0aGUgc3RvcmUgaXMgdG8gY2FsbCBgZGlzcGF0Y2goKWAgb24gaXQuXG4gKlxuICogVGhlcmUgc2hvdWxkIG9ubHkgYmUgYSBzaW5nbGUgc3RvcmUgaW4geW91ciBhcHAuIFRvIHNwZWNpZnkgaG93IGRpZmZlcmVudFxuICogcGFydHMgb2YgdGhlIHN0YXRlIHRyZWUgcmVzcG9uZCB0byBhY3Rpb25zLCB5b3UgbWF5IGNvbWJpbmUgc2V2ZXJhbCByZWR1Y2Vyc1xuICogaW50byBhIHNpbmdsZSByZWR1Y2VyIGZ1bmN0aW9uIGJ5IHVzaW5nIGBjb21iaW5lUmVkdWNlcnNgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlZHVjZXIgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG5leHQgc3RhdGUgdHJlZSwgZ2l2ZW5cbiAqIHRoZSBjdXJyZW50IHN0YXRlIHRyZWUgYW5kIHRoZSBhY3Rpb24gdG8gaGFuZGxlLlxuICpcbiAqIEBwYXJhbSB7YW55fSBbcHJlbG9hZGVkU3RhdGVdIFRoZSBpbml0aWFsIHN0YXRlLiBZb3UgbWF5IG9wdGlvbmFsbHkgc3BlY2lmeSBpdFxuICogdG8gaHlkcmF0ZSB0aGUgc3RhdGUgZnJvbSB0aGUgc2VydmVyIGluIHVuaXZlcnNhbCBhcHBzLCBvciB0byByZXN0b3JlIGFcbiAqIHByZXZpb3VzbHkgc2VyaWFsaXplZCB1c2VyIHNlc3Npb24uXG4gKiBJZiB5b3UgdXNlIGBjb21iaW5lUmVkdWNlcnNgIHRvIHByb2R1Y2UgdGhlIHJvb3QgcmVkdWNlciBmdW5jdGlvbiwgdGhpcyBtdXN0IGJlXG4gKiBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzaGFwZSBhcyBgY29tYmluZVJlZHVjZXJzYCBrZXlzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVuaGFuY2VyIFRoZSBzdG9yZSBlbmhhbmNlci4gWW91IG1heSBvcHRpb25hbGx5IHNwZWNpZnkgaXRcbiAqIHRvIGVuaGFuY2UgdGhlIHN0b3JlIHdpdGggdGhpcmQtcGFydHkgY2FwYWJpbGl0aWVzIHN1Y2ggYXMgbWlkZGxld2FyZSxcbiAqIHRpbWUgdHJhdmVsLCBwZXJzaXN0ZW5jZSwgZXRjLiBUaGUgb25seSBzdG9yZSBlbmhhbmNlciB0aGF0IHNoaXBzIHdpdGggUmVkdXhcbiAqIGlzIGBhcHBseU1pZGRsZXdhcmUoKWAuXG4gKlxuICogQHJldHVybnMge1N0b3JlfSBBIFJlZHV4IHN0b3JlIHRoYXQgbGV0cyB5b3UgcmVhZCB0aGUgc3RhdGUsIGRpc3BhdGNoIGFjdGlvbnNcbiAqIGFuZCBzdWJzY3JpYmUgdG8gY2hhbmdlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlU3RvcmUocmVkdWNlciwgcHJlbG9hZGVkU3RhdGUsIGVuaGFuY2VyKSB7XG4gIHZhciBfcmVmMjtcblxuICBpZiAodHlwZW9mIHByZWxvYWRlZFN0YXRlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBlbmhhbmNlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBlbmhhbmNlciA9IHByZWxvYWRlZFN0YXRlO1xuICAgIHByZWxvYWRlZFN0YXRlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbmhhbmNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIGVuaGFuY2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHRoZSBlbmhhbmNlciB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIHJldHVybiBlbmhhbmNlcihjcmVhdGVTdG9yZSkocmVkdWNlciwgcHJlbG9hZGVkU3RhdGUpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiByZWR1Y2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCB0aGUgcmVkdWNlciB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIGN1cnJlbnRSZWR1Y2VyID0gcmVkdWNlcjtcbiAgdmFyIGN1cnJlbnRTdGF0ZSA9IHByZWxvYWRlZFN0YXRlO1xuICB2YXIgY3VycmVudExpc3RlbmVycyA9IFtdO1xuICB2YXIgbmV4dExpc3RlbmVycyA9IGN1cnJlbnRMaXN0ZW5lcnM7XG4gIHZhciBpc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZW5zdXJlQ2FuTXV0YXRlTmV4dExpc3RlbmVycygpIHtcbiAgICBpZiAobmV4dExpc3RlbmVycyA9PT0gY3VycmVudExpc3RlbmVycykge1xuICAgICAgbmV4dExpc3RlbmVycyA9IGN1cnJlbnRMaXN0ZW5lcnMuc2xpY2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVhZHMgdGhlIHN0YXRlIHRyZWUgbWFuYWdlZCBieSB0aGUgc3RvcmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHthbnl9IFRoZSBjdXJyZW50IHN0YXRlIHRyZWUgb2YgeW91ciBhcHBsaWNhdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuICAgIHJldHVybiBjdXJyZW50U3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNoYW5nZSBsaXN0ZW5lci4gSXQgd2lsbCBiZSBjYWxsZWQgYW55IHRpbWUgYW4gYWN0aW9uIGlzIGRpc3BhdGNoZWQsXG4gICAqIGFuZCBzb21lIHBhcnQgb2YgdGhlIHN0YXRlIHRyZWUgbWF5IHBvdGVudGlhbGx5IGhhdmUgY2hhbmdlZC4gWW91IG1heSB0aGVuXG4gICAqIGNhbGwgYGdldFN0YXRlKClgIHRvIHJlYWQgdGhlIGN1cnJlbnQgc3RhdGUgdHJlZSBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKlxuICAgKiBZb3UgbWF5IGNhbGwgYGRpc3BhdGNoKClgIGZyb20gYSBjaGFuZ2UgbGlzdGVuZXIsIHdpdGggdGhlIGZvbGxvd2luZ1xuICAgKiBjYXZlYXRzOlxuICAgKlxuICAgKiAxLiBUaGUgc3Vic2NyaXB0aW9ucyBhcmUgc25hcHNob3R0ZWQganVzdCBiZWZvcmUgZXZlcnkgYGRpc3BhdGNoKClgIGNhbGwuXG4gICAqIElmIHlvdSBzdWJzY3JpYmUgb3IgdW5zdWJzY3JpYmUgd2hpbGUgdGhlIGxpc3RlbmVycyBhcmUgYmVpbmcgaW52b2tlZCwgdGhpc1xuICAgKiB3aWxsIG5vdCBoYXZlIGFueSBlZmZlY3Qgb24gdGhlIGBkaXNwYXRjaCgpYCB0aGF0IGlzIGN1cnJlbnRseSBpbiBwcm9ncmVzcy5cbiAgICogSG93ZXZlciwgdGhlIG5leHQgYGRpc3BhdGNoKClgIGNhbGwsIHdoZXRoZXIgbmVzdGVkIG9yIG5vdCwgd2lsbCB1c2UgYSBtb3JlXG4gICAqIHJlY2VudCBzbmFwc2hvdCBvZiB0aGUgc3Vic2NyaXB0aW9uIGxpc3QuXG4gICAqXG4gICAqIDIuIFRoZSBsaXN0ZW5lciBzaG91bGQgbm90IGV4cGVjdCB0byBzZWUgYWxsIHN0YXRlIGNoYW5nZXMsIGFzIHRoZSBzdGF0ZVxuICAgKiBtaWdodCBoYXZlIGJlZW4gdXBkYXRlZCBtdWx0aXBsZSB0aW1lcyBkdXJpbmcgYSBuZXN0ZWQgYGRpc3BhdGNoKClgIGJlZm9yZVxuICAgKiB0aGUgbGlzdGVuZXIgaXMgY2FsbGVkLiBJdCBpcywgaG93ZXZlciwgZ3VhcmFudGVlZCB0aGF0IGFsbCBzdWJzY3JpYmVyc1xuICAgKiByZWdpc3RlcmVkIGJlZm9yZSB0aGUgYGRpc3BhdGNoKClgIHN0YXJ0ZWQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgbGF0ZXN0XG4gICAqIHN0YXRlIGJ5IHRoZSB0aW1lIGl0IGV4aXRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBBIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgb24gZXZlcnkgZGlzcGF0Y2guXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0byByZW1vdmUgdGhpcyBjaGFuZ2UgbGlzdGVuZXIuXG4gICAqL1xuICBmdW5jdGlvbiBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGxpc3RlbmVyIHRvIGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgdmFyIGlzU3Vic2NyaWJlZCA9IHRydWU7XG5cbiAgICBlbnN1cmVDYW5NdXRhdGVOZXh0TGlzdGVuZXJzKCk7XG4gICAgbmV4dExpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiB1bnN1YnNjcmliZSgpIHtcbiAgICAgIGlmICghaXNTdWJzY3JpYmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaXNTdWJzY3JpYmVkID0gZmFsc2U7XG5cbiAgICAgIGVuc3VyZUNhbk11dGF0ZU5leHRMaXN0ZW5lcnMoKTtcbiAgICAgIHZhciBpbmRleCA9IG5leHRMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICBuZXh0TGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGFuIGFjdGlvbi4gSXQgaXMgdGhlIG9ubHkgd2F5IHRvIHRyaWdnZXIgYSBzdGF0ZSBjaGFuZ2UuXG4gICAqXG4gICAqIFRoZSBgcmVkdWNlcmAgZnVuY3Rpb24sIHVzZWQgdG8gY3JlYXRlIHRoZSBzdG9yZSwgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGVcbiAgICogY3VycmVudCBzdGF0ZSB0cmVlIGFuZCB0aGUgZ2l2ZW4gYGFjdGlvbmAuIEl0cyByZXR1cm4gdmFsdWUgd2lsbFxuICAgKiBiZSBjb25zaWRlcmVkIHRoZSAqKm5leHQqKiBzdGF0ZSBvZiB0aGUgdHJlZSwgYW5kIHRoZSBjaGFuZ2UgbGlzdGVuZXJzXG4gICAqIHdpbGwgYmUgbm90aWZpZWQuXG4gICAqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9ubHkgc3VwcG9ydHMgcGxhaW4gb2JqZWN0IGFjdGlvbnMuIElmIHlvdSB3YW50IHRvXG4gICAqIGRpc3BhdGNoIGEgUHJvbWlzZSwgYW4gT2JzZXJ2YWJsZSwgYSB0aHVuaywgb3Igc29tZXRoaW5nIGVsc2UsIHlvdSBuZWVkIHRvXG4gICAqIHdyYXAgeW91ciBzdG9yZSBjcmVhdGluZyBmdW5jdGlvbiBpbnRvIHRoZSBjb3JyZXNwb25kaW5nIG1pZGRsZXdhcmUuIEZvclxuICAgKiBleGFtcGxlLCBzZWUgdGhlIGRvY3VtZW50YXRpb24gZm9yIHRoZSBgcmVkdXgtdGh1bmtgIHBhY2thZ2UuIEV2ZW4gdGhlXG4gICAqIG1pZGRsZXdhcmUgd2lsbCBldmVudHVhbGx5IGRpc3BhdGNoIHBsYWluIG9iamVjdCBhY3Rpb25zIHVzaW5nIHRoaXMgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uIEEgcGxhaW4gb2JqZWN0IHJlcHJlc2VudGluZyDigJx3aGF0IGNoYW5nZWTigJ0uIEl0IGlzXG4gICAqIGEgZ29vZCBpZGVhIHRvIGtlZXAgYWN0aW9ucyBzZXJpYWxpemFibGUgc28geW91IGNhbiByZWNvcmQgYW5kIHJlcGxheSB1c2VyXG4gICAqIHNlc3Npb25zLCBvciB1c2UgdGhlIHRpbWUgdHJhdmVsbGluZyBgcmVkdXgtZGV2dG9vbHNgLiBBbiBhY3Rpb24gbXVzdCBoYXZlXG4gICAqIGEgYHR5cGVgIHByb3BlcnR5IHdoaWNoIG1heSBub3QgYmUgYHVuZGVmaW5lZGAuIEl0IGlzIGEgZ29vZCBpZGVhIHRvIHVzZVxuICAgKiBzdHJpbmcgY29uc3RhbnRzIGZvciBhY3Rpb24gdHlwZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEZvciBjb252ZW5pZW5jZSwgdGhlIHNhbWUgYWN0aW9uIG9iamVjdCB5b3UgZGlzcGF0Y2hlZC5cbiAgICpcbiAgICogTm90ZSB0aGF0LCBpZiB5b3UgdXNlIGEgY3VzdG9tIG1pZGRsZXdhcmUsIGl0IG1heSB3cmFwIGBkaXNwYXRjaCgpYCB0b1xuICAgKiByZXR1cm4gc29tZXRoaW5nIGVsc2UgKGZvciBleGFtcGxlLCBhIFByb21pc2UgeW91IGNhbiBhd2FpdCkuXG4gICAqL1xuICBmdW5jdGlvbiBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICBpZiAoIWlzUGxhaW5PYmplY3QoYWN0aW9uKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBY3Rpb25zIG11c3QgYmUgcGxhaW4gb2JqZWN0cy4gJyArICdVc2UgY3VzdG9tIG1pZGRsZXdhcmUgZm9yIGFzeW5jIGFjdGlvbnMuJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhY3Rpb24udHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWN0aW9ucyBtYXkgbm90IGhhdmUgYW4gdW5kZWZpbmVkIFwidHlwZVwiIHByb3BlcnR5LiAnICsgJ0hhdmUgeW91IG1pc3NwZWxsZWQgYSBjb25zdGFudD8nKTtcbiAgICB9XG5cbiAgICBpZiAoaXNEaXNwYXRjaGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWR1Y2VycyBtYXkgbm90IGRpc3BhdGNoIGFjdGlvbnMuJyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudFJlZHVjZXIoY3VycmVudFN0YXRlLCBhY3Rpb24pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGxpc3RlbmVycyA9IGN1cnJlbnRMaXN0ZW5lcnMgPSBuZXh0TGlzdGVuZXJzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIHRoZSByZWR1Y2VyIGN1cnJlbnRseSB1c2VkIGJ5IHRoZSBzdG9yZSB0byBjYWxjdWxhdGUgdGhlIHN0YXRlLlxuICAgKlxuICAgKiBZb3UgbWlnaHQgbmVlZCB0aGlzIGlmIHlvdXIgYXBwIGltcGxlbWVudHMgY29kZSBzcGxpdHRpbmcgYW5kIHlvdSB3YW50IHRvXG4gICAqIGxvYWQgc29tZSBvZiB0aGUgcmVkdWNlcnMgZHluYW1pY2FsbHkuIFlvdSBtaWdodCBhbHNvIG5lZWQgdGhpcyBpZiB5b3VcbiAgICogaW1wbGVtZW50IGEgaG90IHJlbG9hZGluZyBtZWNoYW5pc20gZm9yIFJlZHV4LlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXh0UmVkdWNlciBUaGUgcmVkdWNlciBmb3IgdGhlIHN0b3JlIHRvIHVzZSBpbnN0ZWFkLlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIHJlcGxhY2VSZWR1Y2VyKG5leHRSZWR1Y2VyKSB7XG4gICAgaWYgKHR5cGVvZiBuZXh0UmVkdWNlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCB0aGUgbmV4dFJlZHVjZXIgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICBjdXJyZW50UmVkdWNlciA9IG5leHRSZWR1Y2VyO1xuICAgIGRpc3BhdGNoKHsgdHlwZTogQWN0aW9uVHlwZXMuSU5JVCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm9wZXJhYmlsaXR5IHBvaW50IGZvciBvYnNlcnZhYmxlL3JlYWN0aXZlIGxpYnJhcmllcy5cbiAgICogQHJldHVybnMge29ic2VydmFibGV9IEEgbWluaW1hbCBvYnNlcnZhYmxlIG9mIHN0YXRlIGNoYW5nZXMuXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgdGhlIG9ic2VydmFibGUgcHJvcG9zYWw6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS96ZW5wYXJzaW5nL2VzLW9ic2VydmFibGVcbiAgICovXG4gIGZ1bmN0aW9uIG9ic2VydmFibGUoKSB7XG4gICAgdmFyIF9yZWY7XG5cbiAgICB2YXIgb3V0ZXJTdWJzY3JpYmUgPSBzdWJzY3JpYmU7XG4gICAgcmV0dXJuIF9yZWYgPSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBtaW5pbWFsIG9ic2VydmFibGUgc3Vic2NyaXB0aW9uIG1ldGhvZC5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYnNlcnZlciBBbnkgb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgYXMgYW4gb2JzZXJ2ZXIuXG4gICAgICAgKiBUaGUgb2JzZXJ2ZXIgb2JqZWN0IHNob3VsZCBoYXZlIGEgYG5leHRgIG1ldGhvZC5cbiAgICAgICAqIEByZXR1cm5zIHtzdWJzY3JpcHRpb259IEFuIG9iamVjdCB3aXRoIGFuIGB1bnN1YnNjcmliZWAgbWV0aG9kIHRoYXQgY2FuXG4gICAgICAgKiBiZSB1c2VkIHRvIHVuc3Vic2NyaWJlIHRoZSBvYnNlcnZhYmxlIGZyb20gdGhlIHN0b3JlLCBhbmQgcHJldmVudCBmdXJ0aGVyXG4gICAgICAgKiBlbWlzc2lvbiBvZiB2YWx1ZXMgZnJvbSB0aGUgb2JzZXJ2YWJsZS5cbiAgICAgICAqL1xuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiBzdWJzY3JpYmUob2JzZXJ2ZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYnNlcnZlciAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCB0aGUgb2JzZXJ2ZXIgdG8gYmUgYW4gb2JqZWN0LicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb2JzZXJ2ZVN0YXRlKCkge1xuICAgICAgICAgIGlmIChvYnNlcnZlci5uZXh0KSB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KGdldFN0YXRlKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9ic2VydmVTdGF0ZSgpO1xuICAgICAgICB2YXIgdW5zdWJzY3JpYmUgPSBvdXRlclN1YnNjcmliZShvYnNlcnZlU3RhdGUpO1xuICAgICAgICByZXR1cm4geyB1bnN1YnNjcmliZTogdW5zdWJzY3JpYmUgfTtcbiAgICAgIH1cbiAgICB9LCBfcmVmWyQkb2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBfcmVmO1xuICB9XG5cbiAgLy8gV2hlbiBhIHN0b3JlIGlzIGNyZWF0ZWQsIGFuIFwiSU5JVFwiIGFjdGlvbiBpcyBkaXNwYXRjaGVkIHNvIHRoYXQgZXZlcnlcbiAgLy8gcmVkdWNlciByZXR1cm5zIHRoZWlyIGluaXRpYWwgc3RhdGUuIFRoaXMgZWZmZWN0aXZlbHkgcG9wdWxhdGVzXG4gIC8vIHRoZSBpbml0aWFsIHN0YXRlIHRyZWUuXG4gIGRpc3BhdGNoKHsgdHlwZTogQWN0aW9uVHlwZXMuSU5JVCB9KTtcblxuICByZXR1cm4gX3JlZjIgPSB7XG4gICAgZGlzcGF0Y2g6IGRpc3BhdGNoLFxuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICAgIGdldFN0YXRlOiBnZXRTdGF0ZSxcbiAgICByZXBsYWNlUmVkdWNlcjogcmVwbGFjZVJlZHVjZXJcbiAgfSwgX3JlZjJbJCRvYnNlcnZhYmxlXSA9IG9ic2VydmFibGUsIF9yZWYyO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC9lcy9jcmVhdGVTdG9yZS5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBQcmludHMgYSB3YXJuaW5nIGluIHRoZSBjb25zb2xlIGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBUaGUgd2FybmluZyBtZXNzYWdlLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdhcm5pbmcobWVzc2FnZSkge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuICB0cnkge1xuICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgaWYgeW91IGVuYWJsZVxuICAgIC8vIFwiYnJlYWsgb24gYWxsIGV4Y2VwdGlvbnNcIiBpbiB5b3VyIGNvbnNvbGUsXG4gICAgLy8gaXQgd291bGQgcGF1c2UgdGhlIGV4ZWN1dGlvbiBhdCB0aGlzIGxpbmUuXG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWVtcHR5ICovXG4gIH0gY2F0Y2ggKGUpIHt9XG4gIC8qIGVzbGludC1lbmFibGUgbm8tZW1wdHkgKi9cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgvZXMvdXRpbHMvd2FybmluZy5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge2NyZWF0ZVN0b3JlLGNvbWJpbmVSZWR1Y2Vyc30gZnJvbSAncmVkdXgnXHJcbmltcG9ydCBQb2x5bWVyUmVkdXggZnJvbSAncG9seW1lci1yZWR1eCdcclxuaW1wb3J0IHtkaXNwYXRjaEFjdGlvbkJlaGF2aW9yfSBmcm9tICcuL2NvbmZpZydcclxuaW1wb3J0IGF4aW9zIGZyb20gJy4vYXhpb3MnXHJcbmltcG9ydCB7Y29tbW9uU3lzdGVtUmVkdWNlcixjb21tb25TeXN0ZW1BY3Rpb259IGZyb20gJy4vcmVkdWNlci9jb21tb25TeXN0ZW0nXHJcbmltcG9ydCB7YXV0aFJlZHVjZXIsYXV0aEFjdGlvbn0gZnJvbSAnLi9yZWR1Y2VyL2F1dGgnXHJcbmltcG9ydCB7cHJvdmlkZXJSZWR1Y2VyLHByb3ZpZGVyQWN0aW9ufSBmcm9tICcuL3JlZHVjZXIvcHJvdmlkZXInXHJcbmltcG9ydCB7dXNlcldlbGZhcmVSZWR1Y2VyLHVzZXJXZWxmYXJlQWN0aW9ufSBmcm9tICcuL3JlZHVjZXIvdXNlcldlbGZhcmUnXHJcbmltcG9ydCB7d2VsZmFyZVJlZHVjZXIsd2VsZmFyZUFjdGlvbn0gZnJvbSAnLi9yZWR1Y2VyL3dlbGZhcmUnXHJcbmltcG9ydCB7Z3JvdXBXZWxmYXJlUmVkdWNlcixncm91cFdlbGZhcmVBY3Rpb259IGZyb20gJy4vcmVkdWNlci9ncm91cFdlbGZhcmUnXHJcbmltcG9ydCB7Y29tbW9uRGF0YVJlZHVjZXIsY29tbW9uRGF0YUFjdGlvbn0gZnJvbSAnLi9yZWR1Y2VyL2NvbW1vbkRhdGEnXHJcbmltcG9ydCB7dXNlcnNSZWR1Y2VyLHVzZXJzQWN0aW9ufSBmcm9tICcuL3JlZHVjZXIvdXNlcnMnXHJcbmltcG9ydCB7Y29uZGl0aW9uUmVhZFdlbGZhcmVSZWR1Y2VyLGNvbmRpdGlvblJlYWRXZWxmYXJlQWN0aW9ufSBmcm9tICcuL3JlZHVjZXIvY29uZGl0aW9uUmVhZFdlbGZhcmUnXHJcbmltcG9ydCB7dXBsb2FkUmVkdWNlcix1cGxvYWRBY3Rpb259IGZyb20gJy4vcmVkdWNlci91cGxvYWQnXHJcbmltcG9ydCB7ZnVuZFJ2ZFJlZHVjZXIsZnVuZFJ2ZEFjdGlvbn0gZnJvbSAnLi9yZWR1Y2VyL2Z1bmRSdmQnXHJcbmltcG9ydCB7ZGF0ZURiUmVkdWNlcixkYXRlRGJBY3Rpb259IGZyb20gJy4vcmVkdWNlci9kYXRlRGInXHJcbmltcG9ydCB7Y2hhcnRSZWR1Y2VyLGNoYXJ0QWN0aW9ufSBmcm9tICcuL3JlZHVjZXIvY2hhcnQnXHJcbmltcG9ydCB7c3lzdGVtQ29uZmlnc1JlZHVjZXIsc3lzdGVtQ29uZmlnc0FjdGlvbn0gZnJvbSAnLi9yZWR1Y2VyL3N5c3RlbUNvbmZpZ3MnXHJcbmltcG9ydCB7cmV0aWVyUmVkdWNlcixyZXRpZXJBY3Rpb259IGZyb20gJy4vcmVkdWNlci9yZXRpZXInXHJcbmltcG9ydCB7c3NvUmVkdWNlcixzc29BY3Rpb259IGZyb20gJy4vcmVkdWNlci9zc28nXHJcbmltcG9ydCB7ZnVuZFJlZHVjZXIsZnVuZEFjdGlvbn0gZnJvbSAnLi9yZWR1Y2VyL2Z1bmQnXHJcblxyXG4vLyBheGlvcy5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQXV0aG9yaXphdGlvbiddID0gbG9jYWxTdG9yYWdlLnRva2VuXHJcblxyXG5jb25zdCByb290UmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBjb21tb25TeXN0ZW06Y29tbW9uU3lzdGVtUmVkdWNlcixcclxuICAgIGF1dGg6YXV0aFJlZHVjZXIsXHJcbiAgICBwcm92aWRlcjpwcm92aWRlclJlZHVjZXIsXHJcbiAgICB1c2VyV2VsZmFyZTp1c2VyV2VsZmFyZVJlZHVjZXIsXHJcbiAgICB3ZWxmYXJlOndlbGZhcmVSZWR1Y2VyLFxyXG4gICAgZ3JvdXBXZWxmYXJlOmdyb3VwV2VsZmFyZVJlZHVjZXIsXHJcbiAgICBjb21tb25EYXRhOmNvbW1vbkRhdGFSZWR1Y2VyLFxyXG4gICAgdXNlcnM6dXNlcnNSZWR1Y2VyLFxyXG4gICAgY29uZGl0aW9uUmVhZFdlbGZhcmU6Y29uZGl0aW9uUmVhZFdlbGZhcmVSZWR1Y2VyLFxyXG4gICAgdXBsb2FkOnVwbG9hZFJlZHVjZXIsXHJcbiAgICBmdW5kUnZkOiBmdW5kUnZkUmVkdWNlcixcclxuICAgIGRhdGVEYjogZGF0ZURiUmVkdWNlcixcclxuICAgIGNoYXJ0OiBjaGFydFJlZHVjZXIsXHJcbiAgICBzeXN0ZW1Db25maWdzOiBzeXN0ZW1Db25maWdzUmVkdWNlcixcclxuICAgIHJldGllcjpyZXRpZXJSZWR1Y2VyLFxyXG4gICAgc3NvOnNzb1JlZHVjZXIsXHJcbiAgICBmdW5kOmZ1bmRSZWR1Y2VyXHJcbn0pO1xyXG5jb25zdCBzdG9yZUFwcCA9IGNyZWF0ZVN0b3JlKFxyXG4gICAgcm9vdFJlZHVjZXIsXHJcbiAgICB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyAmJiB3aW5kb3cuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXygpXHJcbik7XHJcblxyXG53aW5kb3cuUmVkdXhCZWhhdmlvciA9IFtQb2x5bWVyUmVkdXgoc3RvcmVBcHApLGRpc3BhdGNoQWN0aW9uQmVoYXZpb3IoKV07XHJcbndpbmRvdy5kaXNwYXRjaEFjdGlvbkJlaGF2aW9yID0gZGlzcGF0Y2hBY3Rpb25CZWhhdmlvcigpO1xyXG53aW5kb3cuYXhpb3MgPSBheGlvcztcclxud2luZG93LmNvbW1vblN5c3RlbUFjdGlvbiA9IGNvbW1vblN5c3RlbUFjdGlvbihzdG9yZUFwcCk7XHJcbndpbmRvdy5hdXRoQWN0aW9uID0gYXV0aEFjdGlvbihzdG9yZUFwcCk7XHJcbndpbmRvdy5wcm92aWRlckFjdGlvbiA9IHByb3ZpZGVyQWN0aW9uKHN0b3JlQXBwKTtcclxud2luZG93LnVzZXJXZWxmYXJlQWN0aW9uID0gdXNlcldlbGZhcmVBY3Rpb24oc3RvcmVBcHApO1xyXG53aW5kb3cud2VsZmFyZUFjdGlvbiA9IHdlbGZhcmVBY3Rpb24oc3RvcmVBcHApO1xyXG53aW5kb3cuZ3JvdXBXZWxmYXJlQWN0aW9uID0gZ3JvdXBXZWxmYXJlQWN0aW9uKHN0b3JlQXBwKTtcclxud2luZG93LmNvbW1vbkRhdGFBY3Rpb24gPSBjb21tb25EYXRhQWN0aW9uKHN0b3JlQXBwKTsgXHJcbndpbmRvdy51c2Vyc0FjdGlvbiA9IHVzZXJzQWN0aW9uKHN0b3JlQXBwKTtcclxud2luZG93LmNvbmRpdGlvblJlYWRXZWxmYXJlQWN0aW9uID0gY29uZGl0aW9uUmVhZFdlbGZhcmVBY3Rpb24oc3RvcmVBcHApO1xyXG53aW5kb3cudXBsb2FkQWN0aW9uID0gdXBsb2FkQWN0aW9uKHN0b3JlQXBwKTtcclxud2luZG93LmZ1bmRSdmRBY3Rpb24gPSBmdW5kUnZkQWN0aW9uKHN0b3JlQXBwKTtcclxud2luZG93LmRhdGVEYkFjdGlvbiA9IGRhdGVEYkFjdGlvbihzdG9yZUFwcCk7XHJcbndpbmRvdy5jaGFydEFjdGlvbiA9IGNoYXJ0QWN0aW9uKHN0b3JlQXBwKTtcclxud2luZG93LnN5c3RlbUNvbmZpZ3NBY3Rpb24gPSBzeXN0ZW1Db25maWdzQWN0aW9uKHN0b3JlQXBwKTtcclxud2luZG93LnJldGllckFjdGlvbiA9IHJldGllckFjdGlvbihzdG9yZUFwcCk7XHJcbndpbmRvdy5zc29BY3Rpb24gPSBzc29BY3Rpb24oc3RvcmVBcHApO1xyXG53aW5kb3cuZnVuZEFjdGlvbiA9IGZ1bmRBY3Rpb24oc3RvcmVBcHApO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvYXhpb3MuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4vQ2FuY2VsJyk7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLy4uL2RlZmF1bHRzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG4gIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAqL1xuQXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25maWcgPSB1dGlscy5tZXJnZSh7XG4gICAgICB1cmw6IGFyZ3VtZW50c1swXVxuICAgIH0sIGFyZ3VtZW50c1sxXSk7XG4gIH1cblxuICBjb25maWcgPSB1dGlscy5tZXJnZShkZWZhdWx0cywgdGhpcy5kZWZhdWx0cywgeyBtZXRob2Q6ICdnZXQnIH0sIGNvbmZpZyk7XG5cbiAgLy8gU3VwcG9ydCBiYXNlVVJMIGNvbmZpZ1xuICBpZiAoY29uZmlnLmJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwoY29uZmlnLnVybCkpIHtcbiAgICBjb25maWcudXJsID0gY29tYmluZVVSTHMoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICB9XG5cbiAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmxcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnMgfHwge31cbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gQCBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG4gIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIHJldHVybiBlcnJvcjtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIC8vIE5vdGU6IHN0YXR1cyBpcyBub3QgZXhwb3NlZCBieSBYRG9tYWluUmVxdWVzdFxuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS9zZXR0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbi8vIGJ0b2EgcG9seWZpbGwgZm9yIElFPDEwIGNvdXJ0ZXN5IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGNoYW1iZXJzL0Jhc2U2NC5qc1xuXG52YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG5mdW5jdGlvbiBFKCkge1xuICB0aGlzLm1lc3NhZ2UgPSAnU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyJztcbn1cbkUucHJvdG90eXBlID0gbmV3IEVycm9yO1xuRS5wcm90b3R5cGUuY29kZSA9IDU7XG5FLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cbmZ1bmN0aW9uIGJ0b2EoaW5wdXQpIHtcbiAgdmFyIHN0ciA9IFN0cmluZyhpbnB1dCk7XG4gIHZhciBvdXRwdXQgPSAnJztcbiAgZm9yIChcbiAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzO1xuICAgIC8vIGlmIHRoZSBuZXh0IHN0ciBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcbiAgICBzdHIuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuICAgIC8vIFwiOCAtIGlkeCAlIDEgKiA4XCIgZ2VuZXJhdGVzIHRoZSBzZXF1ZW5jZSAyLCA0LCA2LCA4XG4gICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICkge1xuICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaWR4ICs9IDMgLyA0KTtcbiAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG4gICAgICB0aHJvdyBuZXcgRSgpO1xuICAgIH1cbiAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ0b2E7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYXhpb3MvbGliL2hlbHBlcnMvYnRvYS5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH1cblxuICAgICAgaWYgKCF1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qc1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICB9LFxuXG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfSkoKVxuKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgfVxuXG4gICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICB9O1xuICAgIH1cblxuICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICB9KSgpXG4pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qc1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2F4aW9zL2xpYi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUuanNcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gIHZhciBwYXJzZWQgPSB7fTtcbiAgdmFyIGtleTtcbiAgdmFyIHZhbDtcbiAgdmFyIGk7XG5cbiAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblxuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanNcbi8vIG1vZHVsZSBpZCA9IDM0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhlIGNvZGUgd2FzIGV4dHJhY3RlZCBmcm9tOlxuICogaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkY2hhbWJlcnMvQmFzZTY0LmpzXG4gKi9cblxudmFyIGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcblxuZnVuY3Rpb24gSW52YWxpZENoYXJhY3RlckVycm9yKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuSW52YWxpZENoYXJhY3RlckVycm9yLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuSW52YWxpZENoYXJhY3RlckVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cbmZ1bmN0aW9uIHBvbHlmaWxsIChpbnB1dCkge1xuICB2YXIgc3RyID0gU3RyaW5nKGlucHV0KS5yZXBsYWNlKC89KyQvLCAnJyk7XG4gIGlmIChzdHIubGVuZ3RoICUgNCA9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEludmFsaWRDaGFyYWN0ZXJFcnJvcihcIidhdG9iJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZGVjb2RlZCBpcyBub3QgY29ycmVjdGx5IGVuY29kZWQuXCIpO1xuICB9XG4gIGZvciAoXG4gICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJzXG4gICAgdmFyIGJjID0gMCwgYnMsIGJ1ZmZlciwgaWR4ID0gMCwgb3V0cHV0ID0gJyc7XG4gICAgLy8gZ2V0IG5leHQgY2hhcmFjdGVyXG4gICAgYnVmZmVyID0gc3RyLmNoYXJBdChpZHgrKyk7XG4gICAgLy8gY2hhcmFjdGVyIGZvdW5kIGluIHRhYmxlPyBpbml0aWFsaXplIGJpdCBzdG9yYWdlIGFuZCBhZGQgaXRzIGFzY2lpIHZhbHVlO1xuICAgIH5idWZmZXIgJiYgKGJzID0gYmMgJSA0ID8gYnMgKiA2NCArIGJ1ZmZlciA6IGJ1ZmZlcixcbiAgICAgIC8vIGFuZCBpZiBub3QgZmlyc3Qgb2YgZWFjaCA0IGNoYXJhY3RlcnMsXG4gICAgICAvLyBjb252ZXJ0IHRoZSBmaXJzdCA4IGJpdHMgdG8gb25lIGFzY2lpIGNoYXJhY3RlclxuICAgICAgYmMrKyAlIDQpID8gb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMjU1ICYgYnMgPj4gKC0yICogYmMgJiA2KSkgOiAwXG4gICkge1xuICAgIC8vIHRyeSB0byBmaW5kIGNoYXJhY3RlciBpbiB0YWJsZSAoMC02Mywgbm90IGZvdW5kID0+IC0xKVxuICAgIGJ1ZmZlciA9IGNoYXJzLmluZGV4T2YoYnVmZmVyKTtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmF0b2IgJiYgd2luZG93LmF0b2IuYmluZCh3aW5kb3cpIHx8IHBvbHlmaWxsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2p3dC1kZWNvZGUvbGliL2F0b2IuanNcbi8vIG1vZHVsZSBpZCA9IDM1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBhdG9iID0gcmVxdWlyZSgnLi9hdG9iJyk7XG5cbmZ1bmN0aW9uIGI2NERlY29kZVVuaWNvZGUoc3RyKSB7XG4gIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoYXRvYihzdHIpLnJlcGxhY2UoLyguKS9nLCBmdW5jdGlvbiAobSwgcCkge1xuICAgIHZhciBjb2RlID0gcC5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuICAgIGlmIChjb2RlLmxlbmd0aCA8IDIpIHtcbiAgICAgIGNvZGUgPSAnMCcgKyBjb2RlO1xuICAgIH1cbiAgICByZXR1cm4gJyUnICsgY29kZTtcbiAgfSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0cikge1xuICB2YXIgb3V0cHV0ID0gc3RyLnJlcGxhY2UoLy0vZywgXCIrXCIpLnJlcGxhY2UoL18vZywgXCIvXCIpO1xuICBzd2l0Y2ggKG91dHB1dC5sZW5ndGggJSA0KSB7XG4gICAgY2FzZSAwOlxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgb3V0cHV0ICs9IFwiPT1cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzpcbiAgICAgIG91dHB1dCArPSBcIj1cIjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBcIklsbGVnYWwgYmFzZTY0dXJsIHN0cmluZyFcIjtcbiAgfVxuXG4gIHRyeXtcbiAgICByZXR1cm4gYjY0RGVjb2RlVW5pY29kZShvdXRwdXQpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gYXRvYihvdXRwdXQpO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2p3dC1kZWNvZGUvbGliL2Jhc2U2NF91cmxfZGVjb2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAzNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYXNlNjRfdXJsX2RlY29kZSA9IHJlcXVpcmUoJy4vYmFzZTY0X3VybF9kZWNvZGUnKTtcblxuZnVuY3Rpb24gSW52YWxpZFRva2VuRXJyb3IobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5JbnZhbGlkVG9rZW5FcnJvci5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcbkludmFsaWRUb2tlbkVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRUb2tlbkVycm9yJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodG9rZW4sb3B0aW9ucykge1xuICBpZiAodHlwZW9mIHRva2VuICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBJbnZhbGlkVG9rZW5FcnJvcignSW52YWxpZCB0b2tlbiBzcGVjaWZpZWQnKTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgcG9zID0gb3B0aW9ucy5oZWFkZXIgPT09IHRydWUgPyAwIDogMTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShiYXNlNjRfdXJsX2RlY29kZSh0b2tlbi5zcGxpdCgnLicpW3Bvc10pKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBJbnZhbGlkVG9rZW5FcnJvcignSW52YWxpZCB0b2tlbiBzcGVjaWZpZWQ6ICcgKyBlLm1lc3NhZ2UpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnZhbGlkVG9rZW5FcnJvciA9IEludmFsaWRUb2tlbkVycm9yO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2p3dC1kZWNvZGUvbGliL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgU3ltYm9sIGZyb20gJy4vX1N5bWJvbC5qcyc7XG5pbXBvcnQgZ2V0UmF3VGFnIGZyb20gJy4vX2dldFJhd1RhZy5qcyc7XG5pbXBvcnQgb2JqZWN0VG9TdHJpbmcgZnJvbSAnLi9fb2JqZWN0VG9TdHJpbmcuanMnO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZUdldFRhZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gtZXMvX2Jhc2VHZXRUYWcuanNcbi8vIG1vZHVsZSBpZCA9IDM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbmV4cG9ydCBkZWZhdWx0IGZyZWVHbG9iYWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoLWVzL19mcmVlR2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAzOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgb3ZlckFyZyBmcm9tICcuL19vdmVyQXJnLmpzJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgZ2V0UHJvdG90eXBlID0gb3ZlckFyZyhPYmplY3QuZ2V0UHJvdG90eXBlT2YsIE9iamVjdCk7XG5cbmV4cG9ydCBkZWZhdWx0IGdldFByb3RvdHlwZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gtZXMvX2dldFByb3RvdHlwZS5qc1xuLy8gbW9kdWxlIGlkID0gNDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFN5bWJvbCBmcm9tICcuL19TeW1ib2wuanMnO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhd1RhZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gtZXMvX2dldFJhd1RhZy5qc1xuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9iamVjdFRvU3RyaW5nO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC1lcy9fb2JqZWN0VG9TdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBvdmVyQXJnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZGFzaC1lcy9fb3ZlckFyZy5qc1xuLy8gbW9kdWxlIGlkID0gNDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGZyZWVHbG9iYWwgZnJvbSAnLi9fZnJlZUdsb2JhbC5qcyc7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuZXhwb3J0IGRlZmF1bHQgcm9vdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2Rhc2gtZXMvX3Jvb3QuanNcbi8vIG1vZHVsZSBpZCA9IDQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc09iamVjdExpa2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9kYXNoLWVzL2lzT2JqZWN0TGlrZS5qc1xuLy8gbW9kdWxlIGlkID0gNDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsWydQb2x5bWVyUmVkdXgnXSA9IGZhY3RvcnkoKTtcbiAgICB9XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgd2FybmluZyA9ICdQb2x5bWVyIFJlZHV4OiA8JXM+LiVzIGhhcyBcIm5vdGlmeVwiIGVuYWJsZWQsIHR3by13YXkgYmluZGluZ3MgZ29lcyBhZ2FpbnN0IFJlZHV4XFwncyBwYXJhZGlnbSc7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHByb3BlcnR5IGJpbmRpbmdzIGZvdW5kIG9uIGEgZ2l2ZW4gRWxlbWVudC9CZWhhdmlvci5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxPYmplY3R9IG9iaiBFbGVtZW50IG9yIEJlaGF2aW9yLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgUG9seW1lciBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdG9yZSBSZWR1eCBzdG9yZS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTdGF0ZVBhdGhQcm9wZXJ0aWVzKG9iaiwgZWxlbWVudCwgc3RvcmUpIHtcbiAgICAgICAgdmFyIHByb3BzID0gW107XG5cbiAgICAgICAgaWYgKG9iai5wcm9wZXJ0aWVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG9iai5wcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IG9iai5wcm9wZXJ0aWVzW25hbWVdO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wLmhhc093blByb3BlcnR5KCdzdGF0ZVBhdGgnKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBub3RpZnkgZmxhZywgd2FybiBhZ2FpbnN0IHR3by13YXkgYmluZGluZ3NcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3Aubm90aWZ5ICYmICFwcm9wLnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4od2FybmluZywgZWxlbWVudC5pcywgbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcHJvcHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRW1wdHkgc3RhdGVQYXRoIHJldHVybiBzdGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogcHJvcC5zdGF0ZVBhdGggfHwgc3RvcmUuZ2V0U3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkT25seTogcHJvcC5yZWFkT25seSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHByb3AudHlwZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGYWN0b3J5IGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIGxpc3RlbmVyIGZvciBhIGdpdmUgUG9seW1lciBlbGVtZW50LiBUaGVcbiAgICAgKiByZXR1cm5pbmcgbGlzdGVuZXIgc2hvdWxkIGJlIHBhc3NlZCB0byBgc3RvcmUuc3Vic2NyaWJlYC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBQb2x5bWVyIGVsZW1lbnQuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFJlZHV4IHN1YmNyaWJlIGxpc3RlbmVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZUxpc3RlbmVyKGVsZW1lbnQsIHN0b3JlKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IGdldFN0YXRlUGF0aFByb3BlcnRpZXMoZWxlbWVudCwgZWxlbWVudCwgc3RvcmUpO1xuXG4gICAgICAgIC8vIGJlaGF2aW9yIHByb3BlcnR5IGJpbmRpbmdzXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVsZW1lbnQuYmVoYXZpb3JzKSkge1xuICAgICAgICAgICAgZWxlbWVudC5iZWhhdmlvcnMuZm9yRWFjaChmdW5jdGlvbihiZWhhdmlvcikge1xuICAgICAgICAgICAgICAgIHZhciBleHRyYXMgPSBnZXRTdGF0ZVBhdGhQcm9wZXJ0aWVzKGJlaGF2aW9yLCBlbGVtZW50LCBzdG9yZSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4dHJhcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocHJvcHMsIGV4dHJhcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGRlLWR1cGUgYmVoYXZpb3IgcHJvcHNcbiAgICAgICAgICAgIHZhciBuYW1lcyA9IHByb3BzLm1hcChmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3AubmFtZTsgLy8gZ3JhYiB0aGUgcHJvcCBuYW1lc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcm9wcyA9IHByb3BzLmZpbHRlcihmdW5jdGlvbihwcm9wLCBpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVzLmluZGV4T2YocHJvcC5uYW1lKSA9PT0gaTsgLy8gaW5kaWNlcyBtdXN0IG1hdGNoXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlZHV4IGxpc3RlbmVyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHN0b3JlLmdldFN0YXRlKCk7XG4gICAgICAgICAgICBwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3BOYW1lID0gcHJvcGVydHkubmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgc3BsaWNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSwgcHJldmlvdXM7XG5cbiAgICAgICAgICAgICAgICAvLyBzdGF0ZVBhdGgsIGEgcGF0aCBvciBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IHByb3BlcnR5LnBhdGg7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXRoID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBwYXRoLmNhbGwoZWxlbWVudCwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gUG9seW1lci5CYXNlLmdldChwYXRoLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcHJldmVudCB1bm5lY2VzYXJ5IHBvbHltZXIgbm90aWZpY2F0aW9uc1xuICAgICAgICAgICAgICAgIHByZXZpb3VzID0gZWxlbWVudC5nZXQocHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBwcmV2aW91cykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gdHlwZSBvZiBhcnJheSwgd29yayBvdXQgc3BsaWNlcyBiZWZvcmUgc2V0dGluZyB0aGUgdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkudHlwZSA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSB8fCAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBbXTtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMgPSBwcmV2aW91cyB8fCAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBbXTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB0aGUgdmFsdWUgdHlwZVxuICAgICAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8JysgZWxlbWVudC5pcyArJz4uJysgcHJvcE5hbWUgKycgdHlwZSBpcyBBcnJheSBidXQgZ2l2ZW46ICcgKyAodHlwZW9mIHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNwbGljZXMgPSBQb2x5bWVyLkFycmF5U3BsaWNlLmNhbGN1bGF0ZVNwbGljZXModmFsdWUsIHByZXZpb3VzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBzZXRcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkucmVhZE9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5ub3RpZnlQYXRoKHByb3BOYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXQocHJvcE5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBub3RpZnkgZWxlbWVudCBvZiBzcGxpY2VzXG4gICAgICAgICAgICAgICAgaWYgKHNwbGljZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubm90aWZ5U3BsaWNlcyhwcm9wTmFtZSwgc3BsaWNlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbGVtZW50LmZpcmUoJ3N0YXRlLWNoYW5nZWQnLCBzdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyBhbiBnaXZlbiBQb2x5bWVyIGVsZW1lbnQgdG8gYSBSZWR1eCBzdG9yZS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBQb2x5bWVyIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0b3JlIFJlZHV4IHN0b3JlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJpbmRSZWR1eExpc3RlbmVyKGVsZW1lbnQsIHN0b3JlKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcjtcblxuICAgICAgICBpZiAoZWxlbWVudC5fcmVkdXhVbnN1YnNjcmliZSkgcmV0dXJuO1xuXG4gICAgICAgIGxpc3RlbmVyID0gY3JlYXRlTGlzdGVuZXIoZWxlbWVudCwgc3RvcmUpO1xuICAgICAgICBsaXN0ZW5lcigpOyAvLyBzdGFydCBiaW5kaW5nc1xuXG4gICAgICAgIGVsZW1lbnQuX3JlZHV4VW5zdWJzY3JpYmUgPSBzdG9yZS5zdWJzY3JpYmUobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVuYmluZHMgYSBQb2x5bWVyIGVsZW1lbnQgZnJvbSBhIFJlZHV4IHN0b3JlLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5iaW5kUmVkdXhMaXN0ZW5lcihlbGVtZW50KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5fcmVkdXhVbnN1YnNjcmliZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgZWxlbWVudC5fcmVkdXhVbnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnQuX3JlZHV4VW5zdWJzY3JpYmU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZHMgbGlzdCBvZiBhY3Rpb24gY3JlYXRvcnMgZnJvbSBhIGdpdmVuIGVsZW1lbnQgYW5kIGl0J3MgaW5oZXJpdGVkXG4gICAgICogYmVoYXZpb3JzIHNldHRpbmcgdGhlIGxpc3Qgb250byB0aGUgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBQb2x5bWVyIGVsZW1lbnQgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29tcGlsZUFjdGlvbkNyZWF0b3JzKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSB7fTtcbiAgICAgICAgdmFyIGJlaGF2aW9ycyA9IGVsZW1lbnQuYmVoYXZpb3JzO1xuXG4gICAgICAgIGlmIChlbGVtZW50Ll9yZWR1eEFjdGlvbnMpIHJldHVybjtcblxuICAgICAgICAvLyBhZGQgYmVoYXZpb3IgYWN0aW9ucyBmaXJzdCwgaW4gcmV2ZXJzZSBvcmRlciBzbyB3ZSBrZWVwIHByaW9yaXR5XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGJlaGF2aW9ycykpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBiZWhhdmlvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBvYmplY3RBc3NpZ24oYWN0aW9ucywgYmVoYXZpb3JzW2ldLmFjdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZWxlbWVudCBhY3Rpb25zIGhhdmUgcHJpb3JpdHlcbiAgICAgICAgZWxlbWVudC5fcmVkdXhBY3Rpb25zID0gb2JqZWN0QXNzaWduKGFjdGlvbnMsIGVsZW1lbnQuYWN0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2hlcyBhIFJlZHV4IGFjdGlvbiB2aWEgYSBQb2x5bWVyIGVsZW1lbnQuIFRoaXMgZ2l2ZXMgdGhlIGVsZW1lbnRcbiAgICAgKiBhIHBvbHltb3JwaGljIGRpc3BhdGNoIGZ1bmN0aW9uLiBTZWUgdGhlIHJlYWRtZSBmb3IgdGhlIHZhcmlvdXMgd2F5cyB0b1xuICAgICAqIGRpc3BhdGNoLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFBvbHltZXIgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3RvcmUgUmVkdXggc3RvcmUuXG4gICAgICogQHBhcmFtIHtBcmd1bWVudHN9IGFyZ3MgVGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gYGVsZW1lbnQuZGlzcGF0Y2hgLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNvbXB1dGVkIFJlZHV4IGFjdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXNwYXRjaFJlZHV4QWN0aW9uKGVsZW1lbnQsIHN0b3JlLCBhcmdzKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBhcmdzWzBdO1xuICAgICAgICB2YXIgYWN0aW9ucyA9IGVsZW1lbnQuX3JlZHV4QWN0aW9ucztcblxuICAgICAgICBhcmdzID0gY2FzdEFyZ3VtZW50c1RvQXJyYXkoYXJncyk7XG5cbiAgICAgICAgLy8gYWN0aW9uIG5hbWVcbiAgICAgICAgaWYgKGFjdGlvbnMgJiYgdHlwZW9mIGFjdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYWN0aW9uc1thY3Rpb25dICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUG9seW1lciBSZWR1eDogPCcgKyBlbGVtZW50LmlzICsgJz4gaGFzIG5vIGFjdGlvbiBcIicgKyBhY3Rpb24gKyAnXCInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFjdGlvbiA9IGFjdGlvbnNbYWN0aW9uXS5hcHBseShlbGVtZW50LCBhcmdzLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICEhISBERVBSRUNJQVRFRCAhISFcbiAgICAgICAgLy8gVGhpcyB3aWxsIGJlIHJlbW92ZWQgYXMgb2YgMS4wLlxuXG4gICAgICAgIC8vIGFjdGlvbiBjcmVhdG9yXG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nICYmIGFjdGlvbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yZS5kaXNwYXRjaChhY3Rpb24oKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS1cblxuICAgICAgICAvLyBtaWRkbGV3YXJlLCBtYWtlIHN1cmUgd2UgcGFzcyB0aGUgcG9seW1lci1yZWR1eCBkaXNwYXRjaFxuICAgICAgICAvLyBzbyB3ZSBoYXZlIGFjY2VzcyB0byB0aGUgZWxlbWVudHMgYWN0aW9uIGNyZWF0b3JzXG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmUuZGlzcGF0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3YgPSBjYXN0QXJndW1lbnRzVG9BcnJheShhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgcmVkdXggZGlzcGF0Y2hcbiAgICAgICAgICAgICAgICBhcmd2LnNwbGljZSgwLCAxLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoUmVkdXhBY3Rpb24oZWxlbWVudCwgc3RvcmUsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5hcHBseShlbGVtZW50LCBhcmd2KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWN0aW9uXG4gICAgICAgIHJldHVybiBzdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFR1cm5zIGFyZ3VtZW50cyBpbnRvIGFuIEFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcmd1bWVudHN9IGFyZ3NcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYXN0QXJndW1lbnRzVG9BcnJheShhcmdzKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPYmplY3QuYXNzaWduKClcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gWy4uLm9ial1cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB0YXJnZXQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gb2JqZWN0QXNzaWduKHRhcmdldCkge1xuICAgICAgICAvLyB1c2UgYnJvd3NlclxuICAgICAgICBpZiAodHlwZW9mIE9iamVjdC5hc3NpZ24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduLmFwcGx5KE9iamVjdCwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgICB2YXIgYXJnYyA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIHZhciBvYmo7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmdjOyArK2kpIHtcbiAgICAgICAgICAgIG9iaiA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGlmIChvYmogIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChvYmosIGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRba10gPSBvYmpba107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgUG9seW1lclJlZHV4IGJlaGF2aW9ycyBmcm9tIGEgZ2l2ZW4gUmVkdXggc3RvcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3RvcmUgUmVkdXggc3RvcmUuXG4gICAgICogQHJldHVybiB7UG9seW1lclJlZHV4fVxuICAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbihzdG9yZSkge1xuICAgICAgICB2YXIgUG9seW1lclJlZHV4O1xuXG4gICAgICAgIC8vIGNoZWNrIGZvciBzdG9yZVxuICAgICAgICBpZiAoIXN0b3JlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtaXNzaW5nIHJlZHV4IHN0b3JlJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogYFBvbHltZXJSZWR1eGAgYmluZHMgYSBnaXZlbiBSZWR1eCBzdG9yZSdzIHN0YXRlIHRvIGltcGxlbWVudGluZyBFbGVtZW50cy5cbiAgICAgICAgICpcbiAgICAgICAgICogRnVsbCBkb2N1bWVudGF0aW9uIGF2YWlsYWJsZSwgaHR0cHM6Ly9naXRodWIuY29tL3R1ci1uci9wb2x5bWVyLXJlZHV4LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcG9seW1lckJlaGF2aW9yIFBvbHltZXJSZWR1eFxuICAgICAgICAgKiBAZGVtbyBkZW1vL2luZGV4Lmh0bWxcbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBQb2x5bWVyUmVkdXggPSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpcmVkIHdoZW4gdGhlIFJlZHV4IHN0b3JlIHN0YXRlIGNoYW5nZXMuXG4gICAgICAgICAgICAgKiBAZXZlbnQgc3RhdGUtY2hhbmdlZFxuICAgICAgICAgICAgICogQHBhcmFtIHsqfSBzdGF0ZVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBiaW5kUmVkdXhMaXN0ZW5lcih0aGlzLCBzdG9yZSk7XG4gICAgICAgICAgICAgICAgY29tcGlsZUFjdGlvbkNyZWF0b3JzKHRoaXMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgYXR0YWNoZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGJpbmRSZWR1eExpc3RlbmVyKHRoaXMsIHN0b3JlKTtcbiAgICAgICAgICAgICAgICBjb21waWxlQWN0aW9uQ3JlYXRvcnModGhpcyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBkZXRhY2hlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdW5iaW5kUmVkdXhMaXN0ZW5lcih0aGlzKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGlzcGF0Y2hlcyBhbiBhY3Rpb24gdG8gdGhlIFJlZHV4IHN0b3JlLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxGdW5jdGlvbn0gYWN0aW9uXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBhY3Rpb24gdGhhdCB3YXMgZGlzcGF0Y2hlZC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGlzcGF0Y2g6IGZ1bmN0aW9uKGFjdGlvbiAvKiwgWy4uLmFyZ3NdICovKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoUmVkdXhBY3Rpb24odGhpcywgc3RvcmUsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldHMgdGhlIGN1cnJlbnQgc3RhdGUgaW4gdGhlIFJlZHV4IHN0b3JlLlxuICAgICAgICAgICAgICogQHJldHVybiB7Kn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0U3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9O1xufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcG9seW1lci1yZWR1eC9wb2x5bWVyLXJlZHV4LmpzXG4vLyBtb2R1bGUgaWQgPSA0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5pbXBvcnQgY29tcG9zZSBmcm9tICcuL2NvbXBvc2UnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdG9yZSBlbmhhbmNlciB0aGF0IGFwcGxpZXMgbWlkZGxld2FyZSB0byB0aGUgZGlzcGF0Y2ggbWV0aG9kXG4gKiBvZiB0aGUgUmVkdXggc3RvcmUuIFRoaXMgaXMgaGFuZHkgZm9yIGEgdmFyaWV0eSBvZiB0YXNrcywgc3VjaCBhcyBleHByZXNzaW5nXG4gKiBhc3luY2hyb25vdXMgYWN0aW9ucyBpbiBhIGNvbmNpc2UgbWFubmVyLCBvciBsb2dnaW5nIGV2ZXJ5IGFjdGlvbiBwYXlsb2FkLlxuICpcbiAqIFNlZSBgcmVkdXgtdGh1bmtgIHBhY2thZ2UgYXMgYW4gZXhhbXBsZSBvZiB0aGUgUmVkdXggbWlkZGxld2FyZS5cbiAqXG4gKiBCZWNhdXNlIG1pZGRsZXdhcmUgaXMgcG90ZW50aWFsbHkgYXN5bmNocm9ub3VzLCB0aGlzIHNob3VsZCBiZSB0aGUgZmlyc3RcbiAqIHN0b3JlIGVuaGFuY2VyIGluIHRoZSBjb21wb3NpdGlvbiBjaGFpbi5cbiAqXG4gKiBOb3RlIHRoYXQgZWFjaCBtaWRkbGV3YXJlIHdpbGwgYmUgZ2l2ZW4gdGhlIGBkaXNwYXRjaGAgYW5kIGBnZXRTdGF0ZWAgZnVuY3Rpb25zXG4gKiBhcyBuYW1lZCBhcmd1bWVudHMuXG4gKlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gbWlkZGxld2FyZXMgVGhlIG1pZGRsZXdhcmUgY2hhaW4gdG8gYmUgYXBwbGllZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBzdG9yZSBlbmhhbmNlciBhcHBseWluZyB0aGUgbWlkZGxld2FyZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXBwbHlNaWRkbGV3YXJlKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgbWlkZGxld2FyZXMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBtaWRkbGV3YXJlc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoY3JlYXRlU3RvcmUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJlZHVjZXIsIHByZWxvYWRlZFN0YXRlLCBlbmhhbmNlcikge1xuICAgICAgdmFyIHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlciwgcHJlbG9hZGVkU3RhdGUsIGVuaGFuY2VyKTtcbiAgICAgIHZhciBfZGlzcGF0Y2ggPSBzdG9yZS5kaXNwYXRjaDtcbiAgICAgIHZhciBjaGFpbiA9IFtdO1xuXG4gICAgICB2YXIgbWlkZGxld2FyZUFQSSA9IHtcbiAgICAgICAgZ2V0U3RhdGU6IHN0b3JlLmdldFN0YXRlLFxuICAgICAgICBkaXNwYXRjaDogZnVuY3Rpb24gZGlzcGF0Y2goYWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIF9kaXNwYXRjaChhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY2hhaW4gPSBtaWRkbGV3YXJlcy5tYXAoZnVuY3Rpb24gKG1pZGRsZXdhcmUpIHtcbiAgICAgICAgcmV0dXJuIG1pZGRsZXdhcmUobWlkZGxld2FyZUFQSSk7XG4gICAgICB9KTtcbiAgICAgIF9kaXNwYXRjaCA9IGNvbXBvc2UuYXBwbHkodW5kZWZpbmVkLCBjaGFpbikoc3RvcmUuZGlzcGF0Y2gpO1xuXG4gICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0b3JlLCB7XG4gICAgICAgIGRpc3BhdGNoOiBfZGlzcGF0Y2hcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4L2VzL2FwcGx5TWlkZGxld2FyZS5qc1xuLy8gbW9kdWxlIGlkID0gNDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvciwgZGlzcGF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2goYWN0aW9uQ3JlYXRvci5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG4vKipcbiAqIFR1cm5zIGFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgYXJlIGFjdGlvbiBjcmVhdG9ycywgaW50byBhbiBvYmplY3Qgd2l0aCB0aGVcbiAqIHNhbWUga2V5cywgYnV0IHdpdGggZXZlcnkgZnVuY3Rpb24gd3JhcHBlZCBpbnRvIGEgYGRpc3BhdGNoYCBjYWxsIHNvIHRoZXlcbiAqIG1heSBiZSBpbnZva2VkIGRpcmVjdGx5LiBUaGlzIGlzIGp1c3QgYSBjb252ZW5pZW5jZSBtZXRob2QsIGFzIHlvdSBjYW4gY2FsbFxuICogYHN0b3JlLmRpc3BhdGNoKE15QWN0aW9uQ3JlYXRvcnMuZG9Tb21ldGhpbmcoKSlgIHlvdXJzZWxmIGp1c3QgZmluZS5cbiAqXG4gKiBGb3IgY29udmVuaWVuY2UsIHlvdSBjYW4gYWxzbyBwYXNzIGEgc2luZ2xlIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCxcbiAqIGFuZCBnZXQgYSBmdW5jdGlvbiBpbiByZXR1cm4uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R9IGFjdGlvbkNyZWF0b3JzIEFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgYXJlIGFjdGlvblxuICogY3JlYXRvciBmdW5jdGlvbnMuIE9uZSBoYW5keSB3YXkgdG8gb2J0YWluIGl0IGlzIHRvIHVzZSBFUzYgYGltcG9ydCAqIGFzYFxuICogc3ludGF4LiBZb3UgbWF5IGFsc28gcGFzcyBhIHNpbmdsZSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBkaXNwYXRjaCBUaGUgYGRpc3BhdGNoYCBmdW5jdGlvbiBhdmFpbGFibGUgb24geW91ciBSZWR1eFxuICogc3RvcmUuXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufE9iamVjdH0gVGhlIG9iamVjdCBtaW1pY2tpbmcgdGhlIG9yaWdpbmFsIG9iamVjdCwgYnV0IHdpdGhcbiAqIGV2ZXJ5IGFjdGlvbiBjcmVhdG9yIHdyYXBwZWQgaW50byB0aGUgYGRpc3BhdGNoYCBjYWxsLiBJZiB5b3UgcGFzc2VkIGFcbiAqIGZ1bmN0aW9uIGFzIGBhY3Rpb25DcmVhdG9yc2AsIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBhbHNvIGJlIGEgc2luZ2xlXG4gKiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbkNyZWF0b3JzLCBkaXNwYXRjaCkge1xuICBpZiAodHlwZW9mIGFjdGlvbkNyZWF0b3JzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGJpbmRBY3Rpb25DcmVhdG9yKGFjdGlvbkNyZWF0b3JzLCBkaXNwYXRjaCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGFjdGlvbkNyZWF0b3JzICE9PSAnb2JqZWN0JyB8fCBhY3Rpb25DcmVhdG9ycyA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignYmluZEFjdGlvbkNyZWF0b3JzIGV4cGVjdGVkIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uLCBpbnN0ZWFkIHJlY2VpdmVkICcgKyAoYWN0aW9uQ3JlYXRvcnMgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgYWN0aW9uQ3JlYXRvcnMpICsgJy4gJyArICdEaWQgeW91IHdyaXRlIFwiaW1wb3J0IEFjdGlvbkNyZWF0b3JzIGZyb21cIiBpbnN0ZWFkIG9mIFwiaW1wb3J0ICogYXMgQWN0aW9uQ3JlYXRvcnMgZnJvbVwiPycpO1xuICB9XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhY3Rpb25DcmVhdG9ycyk7XG4gIHZhciBib3VuZEFjdGlvbkNyZWF0b3JzID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIHZhciBhY3Rpb25DcmVhdG9yID0gYWN0aW9uQ3JlYXRvcnNba2V5XTtcbiAgICBpZiAodHlwZW9mIGFjdGlvbkNyZWF0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGJvdW5kQWN0aW9uQ3JlYXRvcnNba2V5XSA9IGJpbmRBY3Rpb25DcmVhdG9yKGFjdGlvbkNyZWF0b3IsIGRpc3BhdGNoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJvdW5kQWN0aW9uQ3JlYXRvcnM7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3JlZHV4L2VzL2JpbmRBY3Rpb25DcmVhdG9ycy5qc1xuLy8gbW9kdWxlIGlkID0gNDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQWN0aW9uVHlwZXMgfSBmcm9tICcuL2NyZWF0ZVN0b3JlJztcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gJ2xvZGFzaC1lcy9pc1BsYWluT2JqZWN0JztcbmltcG9ydCB3YXJuaW5nIGZyb20gJy4vdXRpbHMvd2FybmluZyc7XG5cbmZ1bmN0aW9uIGdldFVuZGVmaW5lZFN0YXRlRXJyb3JNZXNzYWdlKGtleSwgYWN0aW9uKSB7XG4gIHZhciBhY3Rpb25UeXBlID0gYWN0aW9uICYmIGFjdGlvbi50eXBlO1xuICB2YXIgYWN0aW9uTmFtZSA9IGFjdGlvblR5cGUgJiYgJ1wiJyArIGFjdGlvblR5cGUudG9TdHJpbmcoKSArICdcIicgfHwgJ2FuIGFjdGlvbic7XG5cbiAgcmV0dXJuICdHaXZlbiBhY3Rpb24gJyArIGFjdGlvbk5hbWUgKyAnLCByZWR1Y2VyIFwiJyArIGtleSArICdcIiByZXR1cm5lZCB1bmRlZmluZWQuICcgKyAnVG8gaWdub3JlIGFuIGFjdGlvbiwgeW91IG11c3QgZXhwbGljaXRseSByZXR1cm4gdGhlIHByZXZpb3VzIHN0YXRlLic7XG59XG5cbmZ1bmN0aW9uIGdldFVuZXhwZWN0ZWRTdGF0ZVNoYXBlV2FybmluZ01lc3NhZ2UoaW5wdXRTdGF0ZSwgcmVkdWNlcnMsIGFjdGlvbiwgdW5leHBlY3RlZEtleUNhY2hlKSB7XG4gIHZhciByZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKHJlZHVjZXJzKTtcbiAgdmFyIGFyZ3VtZW50TmFtZSA9IGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gQWN0aW9uVHlwZXMuSU5JVCA/ICdwcmVsb2FkZWRTdGF0ZSBhcmd1bWVudCBwYXNzZWQgdG8gY3JlYXRlU3RvcmUnIDogJ3ByZXZpb3VzIHN0YXRlIHJlY2VpdmVkIGJ5IHRoZSByZWR1Y2VyJztcblxuICBpZiAocmVkdWNlcktleXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuICdTdG9yZSBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgcmVkdWNlci4gTWFrZSBzdXJlIHRoZSBhcmd1bWVudCBwYXNzZWQgJyArICd0byBjb21iaW5lUmVkdWNlcnMgaXMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgcmVkdWNlcnMuJztcbiAgfVxuXG4gIGlmICghaXNQbGFpbk9iamVjdChpbnB1dFN0YXRlKSkge1xuICAgIHJldHVybiAnVGhlICcgKyBhcmd1bWVudE5hbWUgKyAnIGhhcyB1bmV4cGVjdGVkIHR5cGUgb2YgXCInICsge30udG9TdHJpbmcuY2FsbChpbnB1dFN0YXRlKS5tYXRjaCgvXFxzKFthLXp8QS1aXSspLylbMV0gKyAnXCIuIEV4cGVjdGVkIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgJyArICgna2V5czogXCInICsgcmVkdWNlcktleXMuam9pbignXCIsIFwiJykgKyAnXCInKTtcbiAgfVxuXG4gIHZhciB1bmV4cGVjdGVkS2V5cyA9IE9iamVjdC5rZXlzKGlucHV0U3RhdGUpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuICFyZWR1Y2Vycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICF1bmV4cGVjdGVkS2V5Q2FjaGVba2V5XTtcbiAgfSk7XG5cbiAgdW5leHBlY3RlZEtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdW5leHBlY3RlZEtleUNhY2hlW2tleV0gPSB0cnVlO1xuICB9KTtcblxuICBpZiAodW5leHBlY3RlZEtleXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiAnVW5leHBlY3RlZCAnICsgKHVuZXhwZWN0ZWRLZXlzLmxlbmd0aCA+IDEgPyAna2V5cycgOiAna2V5JykgKyAnICcgKyAoJ1wiJyArIHVuZXhwZWN0ZWRLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiIGZvdW5kIGluICcgKyBhcmd1bWVudE5hbWUgKyAnLiAnKSArICdFeHBlY3RlZCB0byBmaW5kIG9uZSBvZiB0aGUga25vd24gcmVkdWNlciBrZXlzIGluc3RlYWQ6ICcgKyAoJ1wiJyArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiLiBVbmV4cGVjdGVkIGtleXMgd2lsbCBiZSBpZ25vcmVkLicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFJlZHVjZXJTYW5pdHkocmVkdWNlcnMpIHtcbiAgT2JqZWN0LmtleXMocmVkdWNlcnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciByZWR1Y2VyID0gcmVkdWNlcnNba2V5XTtcbiAgICB2YXIgaW5pdGlhbFN0YXRlID0gcmVkdWNlcih1bmRlZmluZWQsIHsgdHlwZTogQWN0aW9uVHlwZXMuSU5JVCB9KTtcblxuICAgIGlmICh0eXBlb2YgaW5pdGlhbFN0YXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWR1Y2VyIFwiJyArIGtleSArICdcIiByZXR1cm5lZCB1bmRlZmluZWQgZHVyaW5nIGluaXRpYWxpemF0aW9uLiAnICsgJ0lmIHRoZSBzdGF0ZSBwYXNzZWQgdG8gdGhlIHJlZHVjZXIgaXMgdW5kZWZpbmVkLCB5b3UgbXVzdCAnICsgJ2V4cGxpY2l0bHkgcmV0dXJuIHRoZSBpbml0aWFsIHN0YXRlLiBUaGUgaW5pdGlhbCBzdGF0ZSBtYXkgJyArICdub3QgYmUgdW5kZWZpbmVkLicpO1xuICAgIH1cblxuICAgIHZhciB0eXBlID0gJ0BAcmVkdXgvUFJPQkVfVU5LTk9XTl9BQ1RJT05fJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZyg3KS5zcGxpdCgnJykuam9pbignLicpO1xuICAgIGlmICh0eXBlb2YgcmVkdWNlcih1bmRlZmluZWQsIHsgdHlwZTogdHlwZSB9KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVkdWNlciBcIicgKyBrZXkgKyAnXCIgcmV0dXJuZWQgdW5kZWZpbmVkIHdoZW4gcHJvYmVkIHdpdGggYSByYW5kb20gdHlwZS4gJyArICgnRG9uXFwndCB0cnkgdG8gaGFuZGxlICcgKyBBY3Rpb25UeXBlcy5JTklUICsgJyBvciBvdGhlciBhY3Rpb25zIGluIFwicmVkdXgvKlwiICcpICsgJ25hbWVzcGFjZS4gVGhleSBhcmUgY29uc2lkZXJlZCBwcml2YXRlLiBJbnN0ZWFkLCB5b3UgbXVzdCByZXR1cm4gdGhlICcgKyAnY3VycmVudCBzdGF0ZSBmb3IgYW55IHVua25vd24gYWN0aW9ucywgdW5sZXNzIGl0IGlzIHVuZGVmaW5lZCwgJyArICdpbiB3aGljaCBjYXNlIHlvdSBtdXN0IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZSwgcmVnYXJkbGVzcyBvZiB0aGUgJyArICdhY3Rpb24gdHlwZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5IG5vdCBiZSB1bmRlZmluZWQuJyk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBUdXJucyBhbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSBkaWZmZXJlbnQgcmVkdWNlciBmdW5jdGlvbnMsIGludG8gYSBzaW5nbGVcbiAqIHJlZHVjZXIgZnVuY3Rpb24uIEl0IHdpbGwgY2FsbCBldmVyeSBjaGlsZCByZWR1Y2VyLCBhbmQgZ2F0aGVyIHRoZWlyIHJlc3VsdHNcbiAqIGludG8gYSBzaW5nbGUgc3RhdGUgb2JqZWN0LCB3aG9zZSBrZXlzIGNvcnJlc3BvbmQgdG8gdGhlIGtleXMgb2YgdGhlIHBhc3NlZFxuICogcmVkdWNlciBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHJlZHVjZXJzIEFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgY29ycmVzcG9uZCB0byBkaWZmZXJlbnRcbiAqIHJlZHVjZXIgZnVuY3Rpb25zIHRoYXQgbmVlZCB0byBiZSBjb21iaW5lZCBpbnRvIG9uZS4gT25lIGhhbmR5IHdheSB0byBvYnRhaW5cbiAqIGl0IGlzIHRvIHVzZSBFUzYgYGltcG9ydCAqIGFzIHJlZHVjZXJzYCBzeW50YXguIFRoZSByZWR1Y2VycyBtYXkgbmV2ZXIgcmV0dXJuXG4gKiB1bmRlZmluZWQgZm9yIGFueSBhY3Rpb24uIEluc3RlYWQsIHRoZXkgc2hvdWxkIHJldHVybiB0aGVpciBpbml0aWFsIHN0YXRlXG4gKiBpZiB0aGUgc3RhdGUgcGFzc2VkIHRvIHRoZW0gd2FzIHVuZGVmaW5lZCwgYW5kIHRoZSBjdXJyZW50IHN0YXRlIGZvciBhbnlcbiAqIHVucmVjb2duaXplZCBhY3Rpb24uXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIHJlZHVjZXIgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGV2ZXJ5IHJlZHVjZXIgaW5zaWRlIHRoZVxuICogcGFzc2VkIG9iamVjdCwgYW5kIGJ1aWxkcyBhIHN0YXRlIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNoYXBlLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21iaW5lUmVkdWNlcnMocmVkdWNlcnMpIHtcbiAgdmFyIHJlZHVjZXJLZXlzID0gT2JqZWN0LmtleXMocmVkdWNlcnMpO1xuICB2YXIgZmluYWxSZWR1Y2VycyA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZHVjZXJLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IHJlZHVjZXJLZXlzW2ldO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmICh0eXBlb2YgcmVkdWNlcnNba2V5XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgd2FybmluZygnTm8gcmVkdWNlciBwcm92aWRlZCBmb3Iga2V5IFwiJyArIGtleSArICdcIicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcmVkdWNlcnNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZmluYWxSZWR1Y2Vyc1trZXldID0gcmVkdWNlcnNba2V5XTtcbiAgICB9XG4gIH1cbiAgdmFyIGZpbmFsUmVkdWNlcktleXMgPSBPYmplY3Qua2V5cyhmaW5hbFJlZHVjZXJzKTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhciB1bmV4cGVjdGVkS2V5Q2FjaGUgPSB7fTtcbiAgfVxuXG4gIHZhciBzYW5pdHlFcnJvcjtcbiAgdHJ5IHtcbiAgICBhc3NlcnRSZWR1Y2VyU2FuaXR5KGZpbmFsUmVkdWNlcnMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgc2FuaXR5RXJyb3IgPSBlO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbWJpbmF0aW9uKCkge1xuICAgIHZhciBzdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuICAgIHZhciBhY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cbiAgICBpZiAoc2FuaXR5RXJyb3IpIHtcbiAgICAgIHRocm93IHNhbml0eUVycm9yO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgd2FybmluZ01lc3NhZ2UgPSBnZXRVbmV4cGVjdGVkU3RhdGVTaGFwZVdhcm5pbmdNZXNzYWdlKHN0YXRlLCBmaW5hbFJlZHVjZXJzLCBhY3Rpb24sIHVuZXhwZWN0ZWRLZXlDYWNoZSk7XG4gICAgICBpZiAod2FybmluZ01lc3NhZ2UpIHtcbiAgICAgICAgd2FybmluZyh3YXJuaW5nTWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGhhc0NoYW5nZWQgPSBmYWxzZTtcbiAgICB2YXIgbmV4dFN0YXRlID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5hbFJlZHVjZXJLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0gZmluYWxSZWR1Y2VyS2V5c1tpXTtcbiAgICAgIHZhciByZWR1Y2VyID0gZmluYWxSZWR1Y2Vyc1trZXldO1xuICAgICAgdmFyIHByZXZpb3VzU3RhdGVGb3JLZXkgPSBzdGF0ZVtrZXldO1xuICAgICAgdmFyIG5leHRTdGF0ZUZvcktleSA9IHJlZHVjZXIocHJldmlvdXNTdGF0ZUZvcktleSwgYWN0aW9uKTtcbiAgICAgIGlmICh0eXBlb2YgbmV4dFN0YXRlRm9yS2V5ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZ2V0VW5kZWZpbmVkU3RhdGVFcnJvck1lc3NhZ2Uoa2V5LCBhY3Rpb24pO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIG5leHRTdGF0ZVtrZXldID0gbmV4dFN0YXRlRm9yS2V5O1xuICAgICAgaGFzQ2hhbmdlZCA9IGhhc0NoYW5nZWQgfHwgbmV4dFN0YXRlRm9yS2V5ICE9PSBwcmV2aW91c1N0YXRlRm9yS2V5O1xuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hhbmdlZCA/IG5leHRTdGF0ZSA6IHN0YXRlO1xuICB9O1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yZWR1eC9lcy9jb21iaW5lUmVkdWNlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDQ5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBjcmVhdGVTdG9yZSBmcm9tICcuL2NyZWF0ZVN0b3JlJztcbmltcG9ydCBjb21iaW5lUmVkdWNlcnMgZnJvbSAnLi9jb21iaW5lUmVkdWNlcnMnO1xuaW1wb3J0IGJpbmRBY3Rpb25DcmVhdG9ycyBmcm9tICcuL2JpbmRBY3Rpb25DcmVhdG9ycyc7XG5pbXBvcnQgYXBwbHlNaWRkbGV3YXJlIGZyb20gJy4vYXBwbHlNaWRkbGV3YXJlJztcbmltcG9ydCBjb21wb3NlIGZyb20gJy4vY29tcG9zZSc7XG5pbXBvcnQgd2FybmluZyBmcm9tICcuL3V0aWxzL3dhcm5pbmcnO1xuXG4vKlxuKiBUaGlzIGlzIGEgZHVtbXkgZnVuY3Rpb24gdG8gY2hlY2sgaWYgdGhlIGZ1bmN0aW9uIG5hbWUgaGFzIGJlZW4gYWx0ZXJlZCBieSBtaW5pZmljYXRpb24uXG4qIElmIHRoZSBmdW5jdGlvbiBoYXMgYmVlbiBtaW5pZmllZCBhbmQgTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJywgd2FybiB0aGUgdXNlci5cbiovXG5mdW5jdGlvbiBpc0NydXNoZWQoKSB7fVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0eXBlb2YgaXNDcnVzaGVkLm5hbWUgPT09ICdzdHJpbmcnICYmIGlzQ3J1c2hlZC5uYW1lICE9PSAnaXNDcnVzaGVkJykge1xuICB3YXJuaW5nKCdZb3UgYXJlIGN1cnJlbnRseSB1c2luZyBtaW5pZmllZCBjb2RlIG91dHNpZGUgb2YgTk9ERV9FTlYgPT09IFxcJ3Byb2R1Y3Rpb25cXCcuICcgKyAnVGhpcyBtZWFucyB0aGF0IHlvdSBhcmUgcnVubmluZyBhIHNsb3dlciBkZXZlbG9wbWVudCBidWlsZCBvZiBSZWR1eC4gJyArICdZb3UgY2FuIHVzZSBsb29zZS1lbnZpZnkgKGh0dHBzOi8vZ2l0aHViLmNvbS96ZXJ0b3NoL2xvb3NlLWVudmlmeSkgZm9yIGJyb3dzZXJpZnkgJyArICdvciBEZWZpbmVQbHVnaW4gZm9yIHdlYnBhY2sgKGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzAwMzAwMzEpICcgKyAndG8gZW5zdXJlIHlvdSBoYXZlIHRoZSBjb3JyZWN0IGNvZGUgZm9yIHlvdXIgcHJvZHVjdGlvbiBidWlsZC4nKTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlU3RvcmUsIGNvbWJpbmVSZWR1Y2VycywgYmluZEFjdGlvbkNyZWF0b3JzLCBhcHBseU1pZGRsZXdhcmUsIGNvbXBvc2UgfTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmVkdXgvZXMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvaW5kZXgnKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zeW1ib2wtb2JzZXJ2YWJsZS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3BvbnlmaWxsID0gcmVxdWlyZSgnLi9wb255ZmlsbCcpO1xuXG52YXIgX3BvbnlmaWxsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BvbnlmaWxsKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgcm9vdDsgLyogZ2xvYmFsIHdpbmRvdyAqL1xuXG5cbmlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgcm9vdCA9IHNlbGY7XG59IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHJvb3QgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gIHJvb3QgPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gIHJvb3QgPSBtb2R1bGU7XG59IGVsc2Uge1xuICByb290ID0gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbn1cblxudmFyIHJlc3VsdCA9ICgwLCBfcG9ueWZpbGwyWydkZWZhdWx0J10pKHJvb3QpO1xuZXhwb3J0c1snZGVmYXVsdCddID0gcmVzdWx0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zeW1ib2wtb2JzZXJ2YWJsZS9saWIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDUyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHN5bWJvbE9ic2VydmFibGVQb255ZmlsbDtcbmZ1bmN0aW9uIHN5bWJvbE9ic2VydmFibGVQb255ZmlsbChyb290KSB7XG5cdHZhciByZXN1bHQ7XG5cdHZhciBfU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cblx0aWYgKHR5cGVvZiBfU3ltYm9sID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0aWYgKF9TeW1ib2wub2JzZXJ2YWJsZSkge1xuXHRcdFx0cmVzdWx0ID0gX1N5bWJvbC5vYnNlcnZhYmxlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHQgPSBfU3ltYm9sKCdvYnNlcnZhYmxlJyk7XG5cdFx0XHRfU3ltYm9sLm9ic2VydmFibGUgPSByZXN1bHQ7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJlc3VsdCA9ICdAQG9ic2VydmFibGUnO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N5bWJvbC1vYnNlcnZhYmxlL2xpYi9wb255ZmlsbC5qc1xuLy8gbW9kdWxlIGlkID0gNTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRpZighbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xyXG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XHJcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcclxuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxyXG5cdFx0aWYoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcclxuXHR9XHJcblx0cmV0dXJuIG1vZHVsZTtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzXG4vLyBtb2R1bGUgaWQgPSA1NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgYXhpb3MgZnJvbSAnLi4vYXhpb3MnXHJcbmltcG9ydCB7IGNvbW1vbkFjdGlvbiB9IGZyb20gJy4uL2NvbmZpZydcclxuaW1wb3J0IGp3dERlY29kZSBmcm9tICdqd3QtZGVjb2RlJ1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgdXNlcjoge31cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF1dGhSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcclxuXHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgLy8gY2FzZSAnQVVUSF9TRVRfVVNFUic6XHJcbiAgICAgICAgLy8gICAgIHZhciB1c2VySW5mbztcclxuICAgICAgICAvLyAgICAgaWYgKGFjdGlvbi5wYXlsb2FkLnRva2VuKSB7XHJcbiAgICAgICAgLy8gICAgICAgICB1c2VySW5mbyA9IGp3dERlY29kZShhY3Rpb24ucGF5bG9hZC50b2tlbilcclxuICAgICAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgICAgIHVzZXJJbmZvID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IHVzZXI6IHVzZXJJbmZvIH0pO1xyXG4gICAgICAgIC8vIGNhc2UgJ0FVVEhfSU5GTyc6XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyB1c2VyOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdhdXRoR2V0VXNlcic6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyB1c2VyOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhdXRoQWN0aW9uKHN0b3JlKSB7XHJcblxyXG4gICAgcmV0dXJuIFtjb21tb25BY3Rpb24oKSxcclxuICAgIHtcclxuICAgICAgICAvLyBBVVRIX0xPR0lOOiBmdW5jdGlvbiAoZm9ybUxvZ2luKSB7XHJcbiAgICAgICAgLy8gICAgIGF4aW9zLnBvc3QoJy4vYXV0aC9sb2dpbicsIHsgdXNlcm5hbWU6IGZvcm1Mb2dpbi51c2VyLCBwYXNzd29yZDogZm9ybUxvZ2luLnBhc3MgfSlcclxuICAgICAgICAvLyAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG5cclxuXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCByZXNwb25zZS5kYXRhLnRva2VuKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdBVVRIX1NFVF9VU0VSJywgcGF5bG9hZDogcmVzcG9uc2UuZGF0YSB9KVxyXG5cclxuICAgICAgICAvLyAgICAgICAgICAgICBsZXQgdXNlckluZm87XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEudG9rZW4pIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgdXNlckluZm8gPSBqd3REZWNvZGUocmVzcG9uc2UuZGF0YS50b2tlbilcclxuICAgICAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB1c2VySW5mbyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAgICAgICAgICAgICAvLyAgaWYodXNlckluZm8ucm9sZT09XCJ0ZWFjaGVyXCIpe1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIC8vICAgICB0aGlzLmZpcmUoJ255bG9uLWNoYW5nZS1wYWdlJyx7cGF0aDonL2V4YW1Sb29tJ30pXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgLy8gfWVsc2V7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgLy8gICAgIHRoaXMuZmlyZSgnbnlsb24tY2hhbmdlLXBhZ2UnLHtwYXRoOicvZXhhbUhpc3RvcnknfSlcclxuICAgICAgICAvLyAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vICAgICAgICAgfSlcclxuICAgICAgICAvLyAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKHsgZXJyb3IgfSk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgYWxlcnQoJ2Vycm9yJylcclxuICAgICAgICAvLyAgICAgICAgIH0pO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBhdXRoTG9naW46IGZ1bmN0aW9uIChsb2dpbikge1xyXG4gICAgICAgICAgICByZXR1cm4gYXhpb3MucG9zdCgnL2F1dGgvbG9naW4nLCBsb2dpbilcclxuICAgICAgICAgICAgLy8gLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9rZW5cIiwgcmVzLmRhdGEudG9rZW4pXHJcbiAgICAgICAgICAgIC8vICAgICAvLyB2YXIgZGVjb2RlZCA9IGp3dERlY29kZShyZXMuZGF0YS50b2tlbik7XHJcbiAgICAgICAgICAgIC8vICAgICAvLyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImVtcF9pZFwiLCBkZWNvZGVkLmVtcF9pZClcclxuICAgICAgICAgICAgLy8gICAgIC8vIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicm9sZVwiLCBkZWNvZGVkLnJvbGUpXHJcbiAgICAgICAgICAgIC8vICAgICAvLyB0aGlzLmZpcmUoJ255bG9uLWNoYW5nZS1wYWdlJywge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gICAgIHBhdGg6ICd1c2VyLXdlbGZhcmUvJyArIGRlY29kZWQuZW1wX2lkXHJcbiAgICAgICAgICAgIC8vICAgICAvLyB9KTtcclxuICAgICAgICAgICAgLy8gICAgIC8vIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0dFVF9DSEFSVF9EQVlfV0lUSE9VVF9HUk9VUCcsIHBheWxvYWQ6IHJlcy5kYXRhIH0pXHJcbiAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICAgIC8vIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgLy8gfSlcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYXV0aEdldFVzZXI6IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgICAgICAgICB2YXIgZGVjb2RlZCA9IGp3dERlY29kZSh0b2tlbik7XHJcbiAgICAgICAgICAgIC8vICAgIHJldHVybiBheGlvcy5nZXQoJy9hdXRoL3VzZXInLCB0b2tlbilcclxuICAgICAgICAgICAgLy8gICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdhdXRoR2V0VXNlcicsIHBheWxvYWQ6IGRlY29kZWQgfSlcclxuICAgICAgICAgICAgLy8gICAgICAgICB9KVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYXV0aExvZ291dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gZGlzcGF0Y2ggPT4ge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ0b2tlblwiKVxyXG4gICAgICAgICAgICAgICAgLy8gTnlsb24ucmVkaXJlY3QoJy8nKVxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnYXV0aEdldFVzZXInLCBwYXlsb2FkOiB7fSB9KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCdueWxvbi1jaGFuZ2UtcGFnZScsIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiAnLydcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gYXV0aFRyYW5zZm9ybTogZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gZGlzcGF0Y2ggPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgYXhpb3MuZ2V0KCcvYXV0aC90cmFuc2Zvcm0nKS50aGVuKFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHJlcyA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGAke3VybH0vYXV0aC90cmFuc2Zvcm0/c291cmNlPSR7cmVzLmRhdGEudG9rZW59YFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIClcclxuICAgICAgICAvLyAgICAgICAgICAgICAuY2F0Y2goXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICApXHJcbiAgICAgICAgLy8gICAgIH1cclxuXHJcbiAgICAgICAgLy8gfSxcclxuXHJcbiAgICAgICAgLy8gYXV0aFZlcmlmeVRva2VuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBkaXNwYXRjaCA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICB2YXIgZGVjb2RlID0gand0X2RlY29kZShsb2NhbFN0b3JhZ2UudG9rZW4pXHJcbiAgICAgICAgLy8gICAgICAgICBkaXNwYXRjaCh7IHR5cGU6ICdBVVRIX1ZFUklGWV9UT0tFTicsIHBheWxvYWQ6IGRlY29kZSB9KVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG4gICAgXVxyXG5cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9yZWR1Y2VyL2F1dGguanNcbi8vIG1vZHVsZSBpZCA9IDU1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBheGlvcyBmcm9tICcuLi9heGlvcydcclxuaW1wb3J0IHsgY29tbW9uQWN0aW9uIH0gZnJvbSAnLi4vY29uZmlnJ1xyXG4vLyBpbXBvcnQgZ3JvdXBBcnJheSBmcm9tICdncm91cC1hcnJheSdcclxuLy8gdmFyIGdyb3VwQXJyYXkgPSByZXF1aXJlKCk7XHJcbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcclxuICAgIG1vZHVsZTogW10sXHJcbiAgICBkYXRlOiB7fSxcclxuICAgIGNoYXJ0OiBbXVxyXG5cclxufVxyXG4vLyBjb25zdCB0b1RoYWlEYXRlID0gKGRhdGUpID0+IHtcclxuLy8gICAgIC8vIGNvbnNvbGUubG9nKHR5cGVvZiBkYXRlKTtcclxuLy8gICAgIHRyeSB7XHJcbi8vICAgICAgICAgbGV0IHllYXIgPSBwYXJzZUludChkYXRlLnNwbGl0KCctJylbMF0pICsgNTQzLFxyXG4vLyAgICAgICAgICAgICBtb250aCA9IGRhdGUuc3BsaXQoJy0nKVsxXSxcclxuLy8gICAgICAgICAgICAgZGF5ID0gZGF0ZS5zcGxpdCgnLScpWzJdO1xyXG4vLyAgICAgICAgIHJldHVybiBkYXkgKyAnLycgKyBtb250aCArICcvJyArIHllYXJcclxuLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbi8vICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcbi8vIGNvbnN0IHNwbGl0RGF0ZSA9IChkYXRhKSA9PiB7XHJcbi8vICAgICAvLyBsZXQgbmV3RGF0YSA9IFtdXHJcbi8vICAgICBkYXRhLm1hcCgobmV3cywgaW5kZXgpID0+IHtcclxuLy8gICAgICAgICBmb3IgKGxldCB2YXJpYWJsZSBpbiBuZXdzKSB7XHJcbi8vICAgICAgICAgICAgIGlmICh2YXJpYWJsZS5zZWFyY2goJ2RhdGUnKSA+PSAwKSB7XHJcbi8vICAgICAgICAgICAgICAgICBkYXRhW2luZGV4XVt2YXJpYWJsZV0gPSB0b1RoYWlEYXRlKG5ld3NbdmFyaWFibGVdLnNwbGl0KCdUJylbMF0pXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9KVxyXG4vLyAgICAgbGV0IG5ld0RhdGEgPSBncm91cEFycmF5KGRhdGEsICdkYXRlX2FwcHJvdmUnKVxyXG4vLyAgICAgbGV0IGRhdGFzID0gW11cclxuLy8gICAgIGZvciAobGV0IHZhcmlhYmxlMiBpbiBuZXdEYXRhKSB7XHJcbi8vICAgICAgICAgZGF0YXMucHVzaCh7XHJcbi8vICAgICAgICAgICAgIGlkOiB2YXJpYWJsZTIsXHJcbi8vICAgICAgICAgICAgIGRhdGE6IG5ld0RhdGFbdmFyaWFibGUyXVxyXG4vLyAgICAgICAgIH0pXHJcbi8vICAgICB9XHJcbi8vICAgICByZXR1cm4gZGF0YXNcclxuLy8gfVxyXG4vLyBjb25zdCBzdW1CYXRoID0gKGRhdGEpID0+IHtcclxuLy8gICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4vLyAgICAgbGV0IG5ld0RhdGFzID0gW11cclxuLy8gICAgIGRhdGEubWFwKChiYXRoKSA9PiB7XHJcbi8vICAgICAgICAgbGV0IHN1bSA9IFtdXHJcbi8vICAgICAgICAgYmF0aC5kYXRhLm1hcCgoZCkgPT4ge1xyXG4vLyAgICAgICAgICAgICBzdW0ucHVzaChkLnVzZV9idWRnZXQpXHJcbi8vICAgICAgICAgfSlcclxuLy8gICAgICAgIGxldCB0b3RhbD0gIHN1bS5yZWR1Y2UoKGFjYywgdmFsKT0+IHtcclxuLy8gICAgICAgICAgICAgcmV0dXJuIGFjYyArIHZhbDtcclxuLy8gICAgICAgICB9LCAwKTtcclxuLy8gICAgICAgICBuZXdEYXRhcy5wdXNoKHtpZDpiYXRoLmlkLGJhdGg6dG90YWx9KVxyXG4vLyAgICAgfSlcclxuLy8gICAgIHJldHVybiBuZXdEYXRhc1xyXG5cclxuLy8gfVxyXG5leHBvcnQgZnVuY3Rpb24gY2hhcnRSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdURVNUJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGRhdGU6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ0dFVF9DSEFSVF9EQVlfV0lUSE9VVF9HUk9VUCc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBjaGFydDogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnR0VUX0NIQVJUX1dFRUtfV0lUSE9VVF9HUk9VUCc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBjaGFydDogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnR0VUX0NIQVJUX01PTlRIX1dJVEhPVVRfR1JPVVAnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgY2hhcnQ6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ0dFVF9DSEFSVF9ZRUFSX1dJVEhPVVRfR1JPVVAnIDpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGNoYXJ0OiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFydEFjdGlvbihzdG9yZSkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBjb21tb25BY3Rpb24oKSwge1xyXG4gICAgICAgICAgICBURVNUOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGdyb3VwQXJyYXkoYXJyLCAndGFnJykpO1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnVEVTVCcsIHBheWxvYWQ6ICcxMTExJyB9KVxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgR0VUX0NIQVJUX0RBWV9XSVRIT1VUX0dST1VQKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmdldChgL2NoYXJ0L2RheS8/JHtkYXRhfWApXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnR0VUX0NIQVJUX0RBWV9XSVRIT1VUX0dST1VQJywgcGF5bG9hZDogcmVzLmRhdGEgfSlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFxyXG4gICAgICAgICAgICBHRVRfQ0hBUlRfV0VFS19XSVRIT1VUX0dST1VQKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KGAvY2hhcnQvd2Vlaz8ke2RhdGF9YClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnR0VUX0NIQVJUX1dFRUtfV0lUSE9VVF9HUk9VUCcsIHBheWxvYWQ6IHJlcy5kYXRhfSlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEdFVF9DSEFSVF9NT05USF9XSVRIT1VUX0dST1VQKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KGAvY2hhcnQvbW9udGg/JHtkYXRhfWApXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0dFVF9DSEFSVF9NT05USF9XSVRIT1VUX0dST1VQJywgcGF5bG9hZDogcmVzLmRhdGF9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgR0VUX0NIQVJUX1lFQVJfV0lUSE9VVF9HUk9VUChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmdldChgL2NoYXJ0L3llYXI/JHtkYXRhfWApXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0dFVF9DSEFSVF9ZRUFSX1dJVEhPVVRfR1JPVVAnLCBwYXlsb2FkOiByZXMuZGF0YX0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH1cclxuICAgIF1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9yZWR1Y2VyL2NoYXJ0LmpzXG4vLyBtb2R1bGUgaWQgPSA1NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgYXhpb3MgZnJvbSAnLi4vYXhpb3MnXHJcbmltcG9ydCB7Y29tbW9uQWN0aW9ufSBmcm9tICcuLi9jb25maWcnXHJcblxyXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XHJcbiAgICBsaXN0OltdLFxyXG4gICAgc2VsZWN0Ont9LFxyXG4gICAgYWNhZGVtaWM6W3tpZDowLGFjYWRlbWljOicnfV0sXHJcbiAgICBhY3RpdmU6W3tpZDowLGFjdGl2ZTonJ31dLFxyXG4gICAgZGVwYXJ0bWVudDpbe2lkOjAsZGVwYXJ0bWVudDonJ31dLFxyXG4gICAgZW1wbG95ZWU6W3tpZDowLGVtcGxveWVlOicnfV0sXHJcbiAgICBmYWN1bHR5Olt7aWQ6MCxmYWN1bHR5OicnfV0sXHJcbiAgICBnZW5kZXI6W3tpZDowLGdlbmRlcjonJ31dLFxyXG4gICAgbWF0aWVyOlt7aWQ6MCxtYXRpZXI6Jyd9XSxcclxuICAgIHBvc2l0aW9uOlt7aWQ6MCxwb3NpdGlvbjonJ31dLFxyXG4gICAgcHJlZml4bmFtZTpbe2lkOjAscHJlZml4bmFtZTonJ31dLFxyXG4gICAgcmVsYXRpb246W3tpZDowLHJlbGF0aW9uOicnfV0sXHJcbiAgICB0eXBlX2VtcGxveWVlOlt7aWQ6MCx0eXBlX2VtcGxveWVlOicnfV0sXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21tb25EYXRhUmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSxhY3Rpb24pe1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdDT01NT05EQVRBX0xJU1QnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7bGlzdDphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgJ0NPTU1PTkRBVEFfU0VMRUNUJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sc3RhdGUse3NlbGVjdDphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgICdDT01NT05EQVRBX0RBVEFfQUNBREVNSUMnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7YWNhZGVtaWM6YWN0aW9uLnBheWxvYWR9KTtcclxuICAgICAgICBjYXNlICAnQ09NTU9OREFUQV9EQVRBX0RFUEFSVE1FTlQnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7ZGVwYXJ0bWVudDphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgICdDT01NT05EQVRBX0RBVEFfQUNUSVZFJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sc3RhdGUse2FjdGl2ZTphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgICdDT01NT05EQVRBX0RBVEFfRU1QTE9ZRUUnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7ZW1wbG95ZWU6YWN0aW9uLnBheWxvYWR9KTtcclxuICAgICAgICBjYXNlICAnQ09NTU9OREFUQV9EQVRBX0ZBQ1VMVFknOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7ZmFjdWx0eTphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgICdDT01NT05EQVRBX0RBVEFfR0VOREVSJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sc3RhdGUse2dlbmRlcjphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgICdDT01NT05EQVRBX0RBVEFfTUFUSUVSJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sc3RhdGUse21hdGllcjphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgICdDT01NT05EQVRBX0RBVEFfUE9TSVRJT04nOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7cG9zaXRpb246YWN0aW9uLnBheWxvYWR9KTtcclxuICAgICAgICBjYXNlICAnQ09NTU9OREFUQV9EQVRBX1BSRUZJWE5BTUUnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7cHJlZml4bmFtZTphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgICdDT01NT05EQVRBX0RBVEFfUkVMQVRJT04nOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7cmVsYXRpb246YWN0aW9uLnBheWxvYWR9KTtcclxuICAgICAgICBjYXNlICdDT01NT05EQVRBX0RBVEFfVFlQRV9FTVBMT1lFRSc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHN0YXRlLHt0eXBlX2VtcGxveWVlOmFjdGlvbi5wYXlsb2FkfSk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29tbW9uRGF0YUFjdGlvbihzdG9yZSl7XHJcblxyXG4gICAgcmV0dXJuIFtjb21tb25BY3Rpb24oKSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfTElTVDpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coMSlcclxuICAgICAgICAgICAgICAgIC8vIGF4aW9zLmdldCgnL3Byb3ZpZGVycycpXHJcbiAgICAgICAgICAgICAgICAvLyAudGhlbihyZXM9PntcclxuICAgICAgICAgICAgICAgIC8vICAgICBzdG9yZS5kaXNwYXRjaCh7dHlwZTonQ09NTU9OREFUQV9MSVNUJyxwYXlsb2FkOnJlcy5kYXRhfSlcclxuICAgICAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICAgICAgICAvLyAuY2F0Y2goZXJyPT57XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gIENPTU1PTkRBVEFfREFUQV9BQ0FERU1JQ1xyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfQUNBREVNSUM6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmdldChgL2NvbW1vbi9hY2FkZW1pY2ApXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXM9PntcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3RGF0YSA9IHJlcy5kYXRhLm1hcCgoaXRlbSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGVjayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coMTIyMjIyMjIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidDT01NT05EQVRBX0RBVEFfQUNBREVNSUMnLHBheWxvYWQ6bmV3RGF0YX0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycj0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9BQ0FERU1JQ19JTlNFUlQ6ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidsb2FkJ30pOyBcclxuICAgICAgICAgICAgICAgIGF4aW9zLnBvc3QoYC9jb21tb24vYWNhZGVtaWMvaW5zZXJ0YCxkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01NT05EQVRBX0RBVEFfQUNBREVNSUMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfQUNBREVNSUNfVVBEQVRFOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTsgXHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoJy9jb21tb24vYWNhZGVtaWMvdXBkYXRlJyxkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lit4Lix4Lie4LmA4LiU4LiX4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTU1PTkRBVEFfREFUQV9BQ0FERU1JQygpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX0FDQURFTUlDX0RFTEVURTpmdW5jdGlvbihkZWwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmRlbGV0ZSgnL2NvbW1vbi9hY2FkZW1pYy9kZWxldGUvaWQvJytkZWwpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguKXguJrguILguYnguK3guKHguLnguKXguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NTU9OREFUQV9EQVRBX0FDQURFTUlDKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBDT01NT05EQVRBX0RBVEFfQUNUSVZFXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9BQ1RJVkU6ZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KGAvY29tbW9uL2FjdGl2ZWApXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXM9PntcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0RhdGEgPSByZXMuZGF0YS5tYXAoKGl0ZW0pPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2hlY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidDT01NT05EQVRBX0RBVEFfQUNUSVZFJyxwYXlsb2FkOm5ld0RhdGF9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnI9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfQUNUSVZFX0lOU0VSVDpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidsb2FkJ30pOyBcclxuICAgICAgICAgICAgICAgIGF4aW9zLnBvc3QoYC9jb21tb24vYWN0aXZlL2luc2VydGAsZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguJrguLHguJnguJfguLbguIHguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NTU9OREFUQV9EQVRBX0FDVElWRSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9BQ1RJVkVfVVBEQVRFOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTsgXHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoJy9jb21tb24vYWN0aXZlL3VwZGF0ZScsZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4reC4seC4nuC5gOC4lOC4l+C4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01NT05EQVRBX0RBVEFfQUNUSVZFKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfQUNUSVZFX0RFTEVURTpmdW5jdGlvbihkZWwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmRlbGV0ZSgnL2NvbW1vbi9hY3RpdmUvZGVsZXRlL2lkLycrZGVsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lil4Lia4LiC4LmJ4Lit4Lih4Li54Lil4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTU1PTkRBVEFfREFUQV9BQ1RJVkUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIENPTU1PTkRBVEFfREFUQV9ERVBBUlRNRU5UIFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfREVQQVJUTUVOVDpmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5nZXQoYC9jb21tb24vZGVwYXJ0bWVudGApXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXM9PntcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3RGF0YSA9IHJlcy5kYXRhLm1hcCgoaXRlbSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGVjayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goe3R5cGU6J0NPTU1PTkRBVEFfREFUQV9ERVBBUlRNRU5UJyxwYXlsb2FkOm5ld0RhdGF9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnI9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfREVQQVJUTUVOVF9JTlNFUlQ6ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidsb2FkJ30pOyBcclxuICAgICAgICAgICAgICAgIGF4aW9zLnBvc3QoYC9jb21tb24vZGVwYXJ0bWVudC9pbnNlcnRgLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTU1PTkRBVEFfREFUQV9ERVBBUlRNRU5UKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX0RFUEFSVE1FTlRfVVBEQVRFOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTsgXHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoJy9jb21tb24vZGVwYXJ0bWVudC91cGRhdGUnLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguK3guLHguJ7guYDguJTguJfguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NTU9OREFUQV9EQVRBX0RFUEFSVE1FTlQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9ERVBBUlRNRU5UX0RFTEVURTpmdW5jdGlvbihkZWwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmRlbGV0ZSgnL2NvbW1vbi9kZXBhcnRtZW50L2RlbGV0ZS9pZC8nK2RlbClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4peC4muC4guC5ieC4reC4oeC4ueC4peC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01NT05EQVRBX0RBVEFfREVQQVJUTUVOVCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gQ09NTU9OREFUQV9EQVRBX0ZBQ1VMVFlcclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX0ZBQ1VMVFk6ZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KGAvY29tbW9uL2ZhY3VsdHlgKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdEYXRhID0gcmVzLmRhdGEubWFwKChpdGVtKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNoZWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7dHlwZTonQ09NTU9OREFUQV9EQVRBX0ZBQ1VMVFknLHBheWxvYWQ6bmV3RGF0YX0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycj0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9GQUNVTFRZX0lOU0VSVDpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7IFxyXG4gICAgICAgICAgICAgICAgYXhpb3MucG9zdChgL2NvbW1vbi9mYWN1bHR5L2luc2VydGAsZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTU1PTkRBVEFfREFUQV9GQUNVTFRZKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX0ZBQ1VMVFlfVVBEQVRFOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTsgXHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoJy9jb21tb24vZmFjdWx0eS91cGRhdGUnLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguK3guLHguJ7guYDguJTguJfguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NTU9OREFUQV9EQVRBX0ZBQ1VMVFkoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9GQUNVTFRZX0RFTEVURTpmdW5jdGlvbihkZWwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmRlbGV0ZSgnL2NvbW1vbi9mYWN1bHR5L2RlbGV0ZS9pZC8nK2RlbClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4peC4muC4guC5ieC4reC4oeC4ueC4peC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01NT05EQVRBX0RBVEFfRkFDVUxUWSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX0dFTkRFUjpmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5nZXQoYC9jb21tb24vZ2VuZGVyYClcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcz0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdEYXRhID0gcmVzLmRhdGEubWFwKChpdGVtKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNoZWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7dHlwZTonQ09NTU9OREFUQV9EQVRBX0dFTkRFUicscGF5bG9hZDpyZXMuZGF0YX0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycj0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9HRU5ERVJfSU5TRVJUOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTsgXHJcbiAgICAgICAgICAgICAgICBheGlvcy5wb3N0KGAvY29tbW9uL2dlbmRlci9pbnNlcnRgLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTU1PTkRBVEFfREFUQV9HRU5ERVIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfR0VOREVSX1VQREFURTpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7IFxyXG4gICAgICAgICAgICAgICAgYXhpb3MucHV0KCcvY29tbW9uL2dlbmRlci91cGRhdGUnLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguK3guLHguJ7guYDguJTguJfguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NTU9OREFUQV9EQVRBX0dFTkRFUigpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX0dFTkRFUl9ERUxFVEU6ZnVuY3Rpb24oZGVsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5kZWxldGUoJy9jb21tb24vZ2VuZGVyL2RlbGV0ZS9pZC8nK2RlbClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4peC4muC4guC5ieC4reC4oeC4ueC4peC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01NT05EQVRBX0RBVEFfR0VOREVSKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfRU1QTE9ZRUU6ZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KGAvY29tbW9uL2VtcGxveWVlYClcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcz0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidDT01NT05EQVRBX0RBVEFfRU1QTE9ZRUUnLHBheWxvYWQ6cmVzLmRhdGF9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnI9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBDT01NT05EQVRBX0RBVEFfTUFUSUVSXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9NQVRJRVI6ZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KGAvY29tbW9uL21hdGllcmApXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXM9PntcclxuICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0RhdGEgPSByZXMuZGF0YS5tYXAoKGl0ZW0pPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2hlY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidDT01NT05EQVRBX0RBVEFfTUFUSUVSJyxwYXlsb2FkOnJlcy5kYXRhfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX01BVElFUl9JTlNFUlQ6ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidsb2FkJ30pOyBcclxuICAgICAgICAgICAgICAgIGF4aW9zLnBvc3QoYC9jb21tb24vbWF0aWVyL2luc2VydGAsZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguJrguLHguJnguJfguLbguIHguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NTU9OREFUQV9EQVRBX01BVElFUigpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9NQVRJRVJfVVBEQVRFOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTsgXHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoJy9jb21tb24vbWF0aWVyL3VwZGF0ZScsZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4reC4seC4nuC5gOC4lOC4l+C4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01NT05EQVRBX0RBVEFfTUFUSUVSKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfTUFUSUVSX0RFTEVURTpmdW5jdGlvbihkZWwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmRlbGV0ZSgnL2NvbW1vbi9tYXRpZXIvZGVsZXRlL2lkLycrZGVsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lil4Lia4LiC4LmJ4Lit4Lih4Li54Lil4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTU1PTkRBVEFfREFUQV9NQVRJRVIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIENPTU1PTkRBVEFfREFUQV9QT1NJVElPTlxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfUE9TSVRJT046ZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KGAvY29tbW9uL3Bvc2l0aW9uYClcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcz0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdEYXRhID0gcmVzLmRhdGEubWFwKChpdGVtKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNoZWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7dHlwZTonQ09NTU9OREFUQV9EQVRBX1BPU0lUSU9OJyxwYXlsb2FkOnJlcy5kYXRhfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX1BPU0lUSU9OX0lOU0VSVDpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7IFxyXG4gICAgICAgICAgICAgICAgYXhpb3MucG9zdChgL2NvbW1vbi9wb3NpdGlvbi9pbnNlcnRgLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTU1PTkRBVEFfREFUQV9QT1NJVElPTigpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9QT1NJVElPTl9VUERBVEU6ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidsb2FkJ30pOyBcclxuICAgICAgICAgICAgICAgIGF4aW9zLnB1dCgnL2NvbW1vbi9wb3NpdGlvbi91cGRhdGUnLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguK3guLHguJ7guYDguJTguJfguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NTU9OREFUQV9EQVRBX1BPU0lUSU9OKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfUE9TSVRJT05fREVMRVRFOmZ1bmN0aW9uKGRlbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidsb2FkJ30pO1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZGVsZXRlKCcvY29tbW9uL3Bvc2l0aW9uL2RlbGV0ZS9pZC8nK2RlbClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4peC4muC4guC5ieC4reC4oeC4ueC4peC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01NT05EQVRBX0RBVEFfUE9TSVRJT04oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIENPTU1PTkRBVEFfREFUQV9QUkVGSVhOQU1FXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9QUkVGSVhOQU1FOmZ1bmN0aW9uKGlkKXtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmdldChgL2NvbW1vbi9wcmVmaXhgKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0RhdGEgPSByZXMuZGF0YS5tYXAoKGl0ZW0pPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2hlY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidDT01NT05EQVRBX0RBVEFfUFJFRklYTkFNRScscGF5bG9hZDpyZXMuZGF0YX0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycj0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9QUkVGSVhOQU1FX0lOU0VSVDpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7IFxyXG4gICAgICAgICAgICAgICAgYXhpb3MucG9zdChgL2NvbW1vbi9wcmVmaXgvaW5zZXJ0YCxkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01NT05EQVRBX0RBVEFfUFJFRklYTkFNRSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9QUkVGSVhOQU1FX1VQREFURTpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7IFxyXG4gICAgICAgICAgICAgICAgYXhpb3MucHV0KCcvY29tbW9uL3ByZWZpeC91cGRhdGUnLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguK3guLHguJ7guYDguJTguJfguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NTU9OREFUQV9EQVRBX1BSRUZJWE5BTUUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9QUkVGSVhOQU1FX0RFTEVURTpmdW5jdGlvbihkZWwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmRlbGV0ZSgnL2NvbW1vbi9wcmVmaXgvZGVsZXRlL2lkLycrZGVsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lil4Lia4LiC4LmJ4Lit4Lih4Li54Lil4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTU1PTkRBVEFfREFUQV9QUkVGSVhOQU1FKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBDT01NT05EQVRBX0RBVEFfUkVMQVRJT05cclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX1JFTEFUSU9OOmZ1bmN0aW9uKGlkKXtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmdldChgL2NvbW1vbi9yZWxhdGlvbmApXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXM9PntcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3RGF0YSA9IHJlcy5kYXRhLm1hcCgoaXRlbSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGVjayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goe3R5cGU6J0NPTU1PTkRBVEFfREFUQV9SRUxBVElPTicscGF5bG9hZDpyZXMuZGF0YX0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycj0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9SRUxBVElPTl9JTlNFUlQ6ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidsb2FkJ30pOyBcclxuICAgICAgICAgICAgICAgIGF4aW9zLnBvc3QoYC9jb21tb24vcmVsYXRpb24vaW5zZXJ0YCxkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01NT05EQVRBX0RBVEFfUkVMQVRJT04oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfUkVMQVRJT05fVVBEQVRFOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTsgXHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoJy9jb21tb24vcmVsYXRpb24vdXBkYXRlJyxkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lit4Lix4Lie4LmA4LiU4LiX4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTU1PTkRBVEFfREFUQV9SRUxBVElPTigpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX1JFTEFUSU9OX0RFTEVURTpmdW5jdGlvbihkZWwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmRlbGV0ZSgnL2NvbW1vbi9yZWxhdGlvbi9kZWxldGUvaWQvJytkZWwpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguKXguJrguILguYnguK3guKHguLnguKXguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NTU9OREFUQV9EQVRBX1JFTEFUSU9OKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBDT01NT05EQVRBX0RBVEFfVFlQRV9FTVBMT1lFRVxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfVFlQRV9FTVBMT1lFRTpmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5nZXQoYC9jb21tb24vdHlwZV9lbXBsb3llZWApXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXM9PntcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3RGF0YSA9IHJlcy5kYXRhLm1hcCgoaXRlbSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGVjayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goe3R5cGU6J0NPTU1PTkRBVEFfREFUQV9UWVBFX0VNUExPWUVFJyxwYXlsb2FkOnJlcy5kYXRhfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09NTU9OREFUQV9EQVRBX1RZUEVfRU1QTE9ZRUVfSU5TRVJUOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTsgXHJcbiAgICAgICAgICAgICAgICBheGlvcy5wb3N0KGAvY29tbW9uL3R5cGVfZW1wbG95ZWUvaW5zZXJ0YCxkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT01NT05EQVRBX0RBVEFfVFlQRV9FTVBMT1lFRSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTU1PTkRBVEFfREFUQV9UWVBFX0VNUExPWUVFX1VQREFURTpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7IFxyXG4gICAgICAgICAgICAgICAgYXhpb3MucHV0KCcvY29tbW9uL3R5cGVfZW1wbG95ZWUvdXBkYXRlJyxkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lit4Lix4Lie4LmA4LiU4LiX4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTU1PTkRBVEFfREFUQV9UWVBFX0VNUExPWUVFKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT01NT05EQVRBX0RBVEFfVFlQRV9FTVBMT1lFRV9ERUxFVEU6ZnVuY3Rpb24oZGVsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5kZWxldGUoJy9jb21tb24vdHlwZV9lbXBsb3llZS9kZWxldGUvaWQvJytkZWwpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguKXguJrguILguYnguK3guKHguLnguKXguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ09NTU9OREFUQV9EQVRBX1RZUEVfRU1QTE9ZRUUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQ09NTU9OREFUQV9TRUxFQ1Q6ZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICAvLyAgICAgYXhpb3MuZ2V0KGAvcHJvdmlkZXJzL3Byb3ZpZGVyLyR7aWR9YClcclxuICAgICAgICAgICAgLy8gICAgIC50aGVuKHJlcz0+e1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidDT01NT05EQVRBX1NFTEVDVCcscGF5bG9hZDpyZXMuZGF0YX0pXHJcbiAgICAgICAgICAgIC8vICAgICB9KVxyXG4gICAgICAgICAgICAvLyAgICAgLmNhdGNoKGVycj0+e1xyXG5cclxuICAgICAgICAgICAgLy8gICAgIH0pXHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhpZCk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICBdXHJcblxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvY29tbW9uRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gNTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGF4aW9zIGZyb20gJy4uL2F4aW9zJ1xyXG5pbXBvcnQge2NvbW1vbkFjdGlvbn0gZnJvbSAnLi4vY29uZmlnJ1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgbW9kdWxlOltdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21tb25TeXN0ZW1SZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLGFjdGlvbil7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnQ09NTU9OX01PRFVMRSc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHN0YXRlLHttb2R1bGU6YWN0aW9uLnBheWxvYWR9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21tb25TeXN0ZW1BY3Rpb24oc3RvcmUpe1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBjb21tb25BY3Rpb24oKSx7XHJcbiAgICAgICAgICAgIENPTU1PTl9NT0RVTEU6ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgdXNlciA9IHN0b3JlLmdldFN0YXRlKCkuYXV0aC51c2VyO1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KCcvY29tbW9uL21vZHVsZS8nKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goe3R5cGU6J0NPTU1PTl9NT0RVTEUnLHBheWxvYWQ6cmVzLmRhdGF9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnI9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9yZWR1Y2VyL2NvbW1vblN5c3RlbS5qc1xuLy8gbW9kdWxlIGlkID0gNThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGF4aW9zIGZyb20gJy4uL2F4aW9zJ1xyXG5pbXBvcnQge2NvbW1vbkFjdGlvbn0gZnJvbSAnLi4vY29uZmlnJ1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgbW9kdWxlOltdLFxyXG4gICAgc2VsZWN0Ont0eXBlX2NvbnRpbnVvdXM6IFwiYWxsXCIgLGRhdGFfc291cmNlOicnLGNvbmRpdGlvbnM6W3tuYW1lOicnLHN5bWJvbDonJ31dfSxcclxuICAgIGxpc3RDb25kaXRpb25zOltdLFxyXG4gICAgbGlzdFRhYmxlOltdLFxyXG4gICAgbGlzdEZpZWxkOltdLFxyXG4gICAgZGlzYWJsZWQ6dHJ1ZSxcclxuICAgIGluc2VydF92aWV3OnRydWVcclxufVxyXG5jb25zdCBjbGVhckRhdGEgPSAoZGF0YSxjYWxsYmFjayk9PntcclxuXHJcbiAgICBsZXQge2xhYmVsLGZpZWxkLGRhdGFfc291cmNlLHR5cGVfY29udGludW91c309ZGF0YTtcclxuICAgIGxldCBuZXdEYXRhPXtsYWJlbCxmaWVsZCxkYXRhX3NvdXJjZSx0eXBlX2NvbnRpbnVvdXN9O1xyXG4gICAgbmV3RGF0YS5jb25kaXRpb25zID0gbmV3IEFycmF5KCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyh0eXBlb2YgbmV3RGF0YS5kYXRhX3NvdXJjZSA9PSAndW5kZWZpbmVkJyk7XHJcbiAgICBpZih0eXBlb2YgbmV3RGF0YS5kYXRhX3NvdXJjZSA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICBuZXdEYXRhLmRhdGFfc291cmNlID0gJydcclxuICAgIC8vIGZvciAobGV0IHByb3AgaW4gbmV3RGF0YSkge1xyXG4gICAgLy8gICAgbmV3RGF0YVtwcm9wXSA9IG5ld0RhdGFbcHJvcF0ucmVwbGFjZSgvIC9nLCcnKS50cmltKClcclxuICAgIC8vIH0gIFxyXG4gICAgZGF0YS5jb25kaXRpb25zLm1hcCgodGFnKT0+e1xyXG4gICAgICAgIG5ld0RhdGEuY29uZGl0aW9ucy5wdXNoKHtuYW1lOnRhZy5uYW1lLy8ucmVwbGFjZSgvIC9nLCcnKS50cmltKClcclxuICAgICAgICAsc3ltYm9sOnRhZy5zeW1ib2x9KTtcclxuICAgIH0pO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ld0RhdGEpXHJcbiAgICAvLyBjYWxsYmFjayhkYXRhKVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBjb25kaXRpb25SZWFkV2VsZmFyZVJlZHVjZXIoc3RhdGUgPSBpbml0aWFsU3RhdGUsYWN0aW9uKXtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdDT05ESVRJT05SRUFEV0VMRkFSRV9TRVQnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7dHlwZV9jb250aW51b3VzOiBcImFsbFwiICxzZWxlY3Q6e2NvbmRpdGlvbnM6W3tuYW1lOicnLHN5bWJvbDonJ31dfX0pO1xyXG4gICAgICAgIGNhc2UgJ0NPTkRJVElPTlJFQURXRUxGQVJFX0xJU1QnIDogXHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHN0YXRlLHtsaXN0Q29uZGl0aW9uczphY3Rpb24ucGF5bG9hZH0pOyAgICAgICAgXHJcbiAgICAgICAgY2FzZSAnQ09ORElUSU9OUkVBRFdFTEZBUkVfVEFCTEVfTElTVCcgOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7bGlzdFRhYmxlOmFjdGlvbi5wYXlsb2FkfSk7IFxyXG4gICAgICAgIGNhc2UgJ0NPTkRJVElPTlJFQURXRUxGQVJFX0ZJRUlEX0xJU1QnIDpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sc3RhdGUse2xpc3RGaWVsZDphY3Rpb24ucGF5bG9hZH0pOyBcclxuICAgICAgICBjYXNlICdDT05ESVRJT05SRUFEV0VMRkFSRV9TRUxFQ1QnIDogXHJcbiAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7c2VsZWN0OmFjdGlvbi5wYXlsb2FkfSk7IFxyXG4gICAgICAgIGNhc2UgJ0NPTkRJVElPTlJFQURXRUxGQVJFX0JUTicgOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7ZGlzYWJsZWQ6YWN0aW9uLnBheWxvYWR9KTtcclxuICAgICAgICBjYXNlICdDT05ESVRJT05SRUFEV0VMRkFSRV9JTlNFUlRfVklFVycgOiBcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sc3RhdGUse2luc2VydF92aWV3OmFjdGlvbi5wYXlsb2FkfSk7ICAgICAgICAgICAgIFxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbmRpdGlvblJlYWRXZWxmYXJlQWN0aW9uKHN0b3JlKXtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgY29tbW9uQWN0aW9uKCkse1xyXG4gICAgICAgICAgICBDT05ESVRJT05SRUFEV0VMRkFSRV9TRVQoKXtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidDT05ESVRJT05SRUFEV0VMRkFSRV9TRVQnfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09ORElUSU9OUkVBRFdFTEZBUkVfQlROKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSlcclxuICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidDT05ESVRJT05SRUFEV0VMRkFSRV9CVE4nLHBheWxvYWQ6ZGF0YX0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTkRJVElPTlJFQURXRUxGQVJFX0lOU0VSVF9WSUVXKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSlcclxuICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidDT05ESVRJT05SRUFEV0VMRkFSRV9JTlNFUlRfVklFVycscGF5bG9hZDpkYXRhfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09ORElUSU9OUkVBRFdFTEZBUkVfTElTVCgpe1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KCcvY29uZGl0aW9ucy9saXN0JylcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcz0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidDT05ESVRJT05SRUFEV0VMRkFSRV9MSVNUJyxwYXlsb2FkOnJlcy5kYXRhfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTkRJVElPTlJFQURXRUxGQVJFX1RBQkxFX0xJU1QoKXtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKDEpO1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KCcvY29uZGl0aW9ucy9UYWJsZS8nKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goe3R5cGU6J0NPTkRJVElPTlJFQURXRUxGQVJFX1RBQkxFX0xJU1QnLHBheWxvYWQ6cmVzLmRhdGF9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnI9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09ORElUSU9OUkVBRFdFTEZBUkVfRklFSURfTElTVCgpe1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KCcvY29uZGl0aW9ucy9GaWVsZC8nKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goe3R5cGU6J0NPTkRJVElPTlJFQURXRUxGQVJFX0ZJRUlEX0xJU1QnLHBheWxvYWQ6cmVzLmRhdGF9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnI9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09ORElUSU9OUkVBRFdFTEZBUkVfSU5TRVJUKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjbGVhckRhdGEoZGF0YSwobmV3RGF0YSk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5wb3N0KGAuL2NvbmRpdGlvbnMvaW5zZXJ0YCxuZXdEYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlcz0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNPTkRJVElPTlJFQURXRUxGQVJFX0xJU1QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kJCgncGFuZWwtcmlnaHQnKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnI9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENPTkRJVElPTlJFQURXRUxGQVJFX1NFTEVDVDpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goe3R5cGU6J0NPTkRJVElPTlJFQURXRUxGQVJFX1NFTEVDVCcscGF5bG9hZDpkYXRhfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ09ORElUSU9OUkVBRFdFTEZBUkVfRURJVDpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOidvcGVuRGlhbG9nJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OifguJXguYnguK3guIfguIHguLLguKPguJrguLHguJnguJfguLbguIHguILguYnguK3guKHguLnguKXguYPguIrguYjguKvguKPguLfguK3guYTguKHguYggPycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlybWVkOihyZXN1bHQpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdCA9PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyRGF0YShkYXRhLChuZXdEYXRhKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RGF0YS5pZCA9IGRhdGEuaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlvcy5wdXQoYC9jb25kaXRpb25zL3VwZGF0ZWAsbmV3RGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXM9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT05ESVRJT05SRUFEV0VMRkFSRV9MSVNUKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJCQoJ3BhbmVsLXJpZ2h0JykuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDT05ESVRJT05SRUFEV0VMRkFSRV9ERUxFVEVEOmZ1bmN0aW9uKGlkKXtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGlkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czonb3BlbkRpYWxvZycsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDon4LiV4LmJ4Lit4LiH4LiB4Liy4Lij4Lil4Lia4LiC4LmJ4Lit4Lih4Li54Lil4LmD4LiK4LmI4Lir4Lij4Li34Lit4LmE4Lih4LmIID8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm1lZDoocmVzdWx0KT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQgPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlvcy5kZWxldGUoYC4vY29uZGl0aW9ucy9kZWxldGUvaWQvJHtpZH1gKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5DT05ESVRJT05SRUFEV0VMRkFSRV9MSVNUKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lil4Lia4LiC4LmJ4Lit4Lih4Li54Lil4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJCQoJ3BhbmVsLXJpZ2h0JykuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XHJcbiAgICBdXHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9jb25kaXRpb25SZWFkV2VsZmFyZS5qc1xuLy8gbW9kdWxlIGlkID0gNTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGF4aW9zIGZyb20gJy4uL2F4aW9zJ1xyXG5pbXBvcnQge2NvbW1vbkFjdGlvbn0gZnJvbSAnLi4vY29uZmlnJ1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgbW9kdWxlOltdLFxyXG4gICAgZGF0ZTp7fSxcclxuICAgIGxpc3RZZWFyOnt9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlRGJSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLGFjdGlvbil7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnR0VUX0RBVEUnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7ZGF0ZTphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgJ0dFVF9MSVNUX1lFQVInOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7bGlzdFllYXI6YWN0aW9uLnBheWxvYWR9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlRGJBY3Rpb24oc3RvcmUpe1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBjb21tb25BY3Rpb24oKSx7XHJcbiAgICAgICAgICAgIEdFVF9EQVRFOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHVzZXIgPSBzdG9yZS5nZXRTdGF0ZSgpLmF1dGgudXNlcjtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmdldCgnL2RhdGUvY3VycmVudGRhdGUnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goe3R5cGU6J0dFVF9EQVRFJyxwYXlsb2FkOnJlcy5kYXRhfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEdFVF9MSVNUX1lFQVI6ZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgdXNlciA9IHN0b3JlLmdldFN0YXRlKCkuYXV0aC51c2VyO1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KCcvZGF0ZS9saXN0eWVhcicpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXM9PntcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7dHlwZTonR0VUX0xJU1RfWUVBUicscGF5bG9hZDpyZXMuZGF0YX0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycj0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvZGF0ZURiLmpzXG4vLyBtb2R1bGUgaWQgPSA2MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgYXhpb3MgZnJvbSAnLi4vYXhpb3MnXHJcbmltcG9ydCB7IGNvbW1vbkFjdGlvbiB9IGZyb20gJy4uL2NvbmZpZydcclxuXHJcbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcclxuICAgIGxpc3Q6IFtdLFxyXG4gICAgZGF0YToge30sXHJcbiAgICBsaXN0X3NoZWV0OiBbXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnVuZFJlZHVjZXIoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ0ZVTkRfU0VMRUNUX1VQTE9BRCc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBkYXRhOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdGVU5EX1BSRVZJRVdfREFUQSc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBsaXN0OiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdGVU5EX0dFVF9TSEVFVCc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBsaXN0X3NoZWV0OiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZ1bmRBY3Rpb24oc3RvcmUpIHtcclxuICAgIHJldHVybiBbY29tbW9uQWN0aW9uKCksIHtcclxuICAgICAgICBGVU5EX1VQTE9BREZJTEU6IGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZpbGVbMF0pO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICBkYXRhLmFwcGVuZCgnZmlsZScsIGZpbGVbMF0pO1xyXG4gICAgICAgICAgICB2YXIgY29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgb25VcGxvYWRQcm9ncmVzczogZnVuY3Rpb24gKHByb2dyZXNzRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlZCA9IE1hdGgucm91bmQoKHByb2dyZXNzRXZlbnQubG9hZGVkICogMTAwKSAvIHByb2dyZXNzRXZlbnQudG90YWwpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ3JlZi1wYXRoJzogJ2Z1bmQuZmlsZScgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBheGlvcy5wb3N0KCcuL2Z1bmQvdXBsb2FkJywgZGF0YSwgY29uZmlnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gcmVzcG9uc2UuZGF0YS5nZW5lcmF0ZWRfa2V5c1swXTtcclxuICAgICAgICAgICAgICAgICAgICBheGlvcy5nZXQoJy4vZnVuZC9kb3dubG9hZC9pZC8nICsgaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdGVU5EX1NFTEVDVF9VUExPQUQnLCBwYXlsb2FkOiByZXN1bHQuZGF0YVswXSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgRlVORF9QUkVWSUVXX0RBVEE6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pO1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy4vZnVuZC9nZXRmaWxlL25hbWUvJyArIGRhdGEubmFtZSArICcvc2hlZXQvJyArIGRhdGEuc2hlZXQpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguYLguKvguKXguJTguILguYnguK3guKHguLnguKXguKrguLPguYDguKPguYfguIgnLCBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnRlVORF9QUkVWSUVXX0RBVEEnLCBwYXlsb2FkOiByZXN1bHQuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIEZVTkRfSU5TRVJUOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KTtcclxuICAgICAgICAgICAgYXhpb3MucG9zdCgnLi9mdW5kL2luc2VydCcsIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguYDguIHguYfguJrguILguYnguK3guKHguLnguKXguKXguIfguJDguLLguJnguILguYnguK3guKHguLnguKXguKrguLPguYDguKPguYfguIgnLCBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgRlVORF9HRVRfU0hFRVQ6IGZ1bmN0aW9uIChuYW1lRmlsZSkge1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy4vZnVuZC9zaGVldC8nICsgbmFtZUZpbGUpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnRlVORF9HRVRfU0hFRVQnLCBwYXlsb2FkOiByZXN1bHQuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvZnVuZC5qc1xuLy8gbW9kdWxlIGlkID0gNjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiIGltcG9ydCBheGlvcyBmcm9tICcuLi9heGlvcydcclxuIGltcG9ydCB7IGNvbW1vbkFjdGlvbiB9IGZyb20gJy4uL2NvbmZpZydcclxuIGNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcclxuICAgICBkYXRhOnt9LFxyXG4gICAgIGRhdGFMaXN0OiBbXSxcclxuICAgICB1c2VyTGlzdDpbXVxyXG4gfVxyXG4gZXhwb3J0IGZ1bmN0aW9uIGZ1bmRSdmRSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcclxuICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ0ZVTkRfUlZEX0dFVF9MSVNUJyA6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHN0YXRlLHtkYXRhTGlzdDphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgJ0ZVTkRfUlZEX1NFTEVDVCc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHN0YXRlLHtkYXRhOmFjdGlvbi5wYXlsb2FkfSk7XHJcbiAgICAgICAgY2FzZSAnRlVORF9SVkRfQ0xFQVJfREFUQSc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHN0YXRlLHtkYXRhOnt9fSk7XHJcbiAgICAgICAgY2FzZSAnRlVORF9SVkRfR0VUX1VTRVJfTElTVCc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHN0YXRlLHt1c2VyTGlzdDphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZVxyXG4gICAgfVxyXG59XHJcbiBleHBvcnQgZnVuY3Rpb24gZnVuZFJ2ZEFjdGlvbihzdG9yZSkge1xyXG4gICAgcmV0dXJuIFtjb21tb25BY3Rpb24oKSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEZVTkRfUlZEX0dFVF9MSVNUOmZ1bmN0aW9uKG90aGVydXNlcj1mYWxzZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidsb2FkJ30pO1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KCdydmQnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW90aGVydXNlcikgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5kRm9ybS5yZXNldENvbXBvbmVudHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnRlVORF9SVkRfR0VUX0xJU1QnLCBwYXlsb2FkOiByZXNwb25zZS5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBGVU5EX1JWRF9JTlNFUlQ6ZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGF4aW9zLnBvc3QoJy4vcnZkL2luc2VydCcsZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkZVTkRfUlZEX0dFVF9MSVNUKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5kRm9ybS5lZGl0Rm9ybSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEZVTkRfUlZEX1NFTEVDVDpmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5nZXQoJy4vcnZkL2lkLycraWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYW5lbFJpZ2h0Lm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZ1bmRGb3JtLnJlc2V0Q29tcG9uZW50cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZnVuZEZvcm0uZWRpdEZvcm0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0ZVTkRfUlZEX1NFTEVDVCcsIHBheWxvYWQ6IHJlc3BvbnNlLmRhdGEgfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBGVU5EX1JWRF9ERUxFVEU6ZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmRlbGV0ZSgnL3J2ZC9kZWxldGUvaWQvJytpZClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkZVTkRfUlZEX0dFVF9MSVNUKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgRlVORF9SVkRfVVBEQVRFOmZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoJy4vcnZkL3VwZGF0ZScsZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkZVTkRfUlZEX0dFVF9MSVNUKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5kRm9ybS5lZGl0Rm9ybSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgRlVORF9SVkRfQ0xFQVJfREFUQTpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0ZVTkRfUlZEX0NMRUFSX0RBVEEnIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEZVTkRfUlZEX0dFVF9VU0VSX0xJU1Q6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmdldCgnLi9ydmQvc2lnbnVwL2xpc3QnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdEYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdEYXRhLm1hcCgoaXRlbSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uYWNhZGVtaWNfbmFtZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmZ1bGxOYW1lID0gaXRlbS5wcmVmaXhfbmFtZSArIFwiIFwiICsgaXRlbS5maXJzdG5hbWUgKyBcIiBcIiArIGl0ZW0ubGFzdG5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZnVsbE5hbWUgPSBpdGVtLmFjYWRlbWljX25hbWUgKyBcIiBcIiArIGl0ZW0uZmlyc3RuYW1lICsgXCIgXCIgKyBpdGVtLmxhc3RuYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGVjayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidGVU5EX1JWRF9HRVRfVVNFUl9MSVNUJyxwYXlsb2FkOm5ld0RhdGF9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEZVTkRfUlZEX1VQREFURV9VU0VSOmZ1bmN0aW9uKGlkKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoJy4vcnZkL3NpZ251cC91cGRhdGUnLGlkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZVTkRfUlZEX0dFVF9VU0VSX0xJU1QoKVxyXG4gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgRlVORF9SVkRfREVMRVRFX1VTRVI6ZnVuY3Rpb24oaWQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCd9KTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmRlbGV0ZSgnLi9ydmQvc2lnbnVwL2RlbGV0ZS9pZC8nK2lkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRlVORF9SVkRfR0VUX1VTRVJfTElTVCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEZVTkRfUlZEX0VYSVRfRlVORDpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoJy4vcnZkL3NpZ251cC9sZWF2ZS8nLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonc3VjY2VzcycsdGV4dDon4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5GVU5EX1JWRF9HRVRfVVNFUl9MSVNUKClcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcik9PntcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEZVTkRfUlZEX0VYSVRfV09SSzpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnfSk7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoJ3J2ZC9zaWdudXAvZnVuZC9vdXQnLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRlVORF9SVkRfR0VUX1VTRVJfTElTVCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBdXHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9mdW5kUnZkLmpzXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgYXhpb3MgZnJvbSAnLi4vYXhpb3MnXHJcbmltcG9ydCB7IGNvbW1vbkFjdGlvbiB9IGZyb20gJy4uL2NvbmZpZydcclxuXHJcbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcclxuICAgIGxpc3Q6IFtdLFxyXG4gICAgc2VsZWN0OiB7fSxcclxuICAgIGxpc3RfaWQ6IFtdLFxyXG4gICAgbGlzdF95ZWFyOiBbXSxcclxuICAgIGRhdGFfY2xvbmU6IFtdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBncm91cFdlbGZhcmVSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcclxuXHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnTElTVF9XRUxGQVJFJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGxpc3Q6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ0xJU1RfV0VMRkFSRV9JRCc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBsaXN0X2lkOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdTRUxFQ1RfREFUQSc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBzZWxlY3Q6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ0dFVF9ZRUFSJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGxpc3RfeWVhcjogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnQ0xFQVJfV0VMRkFSRSc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBzZWxlY3Q6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ0NMRUFSX1dFTEZBUkVfSUQnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgbGlzdF9pZDogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnQ0xPTkVfREFUQSc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBkYXRhX2Nsb25lOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBncm91cFdlbGZhcmVBY3Rpb24oc3RvcmUpIHtcclxuXHJcbiAgICByZXR1cm4gW2NvbW1vbkFjdGlvbigpLFxyXG4gICAge1xyXG4gICAgICAgIExJU1RfV0VMRkFSRTogZnVuY3Rpb24gKHllYXIpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coeWVhcik7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pO1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy9ncm91cC93ZWxmYXJlL3llYXIvJyArIHllYXIpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4LmC4Lir4Lil4LiU4LiC4LmJ4Lit4Lih4Li54Lil4Liq4Liz4LmA4Lij4LmH4LiIJywgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0xJU1RfV0VMRkFSRScsIHBheWxvYWQ6IHJlc3VsdC5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgTElTVF9XRUxGQVJFX0lEOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KTtcclxuICAgICAgICAgICAgYXhpb3MuZ2V0KCcvZ3JvdXAvd2VsZmFyZS8nICsgZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4LmC4Lir4Lil4LiU4LiC4LmJ4Lit4Lih4Li54Lil4Liq4Liz4LmA4Lij4LmH4LiIJywgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0xJU1RfV0VMRkFSRV9JRCcsIHBheWxvYWQ6IHJlc3VsdC5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgSU5TRVJUX1dFTEZBUkU6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciB5ZWFyTm93ID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgbGV0IHsgeWVhciwgc3RhcnRfZGF0ZSwgZW5kX2RhdGUsIGNhbF9kYXRlLCBncm91cF93ZWxmYXJlX25hbWUsIGdyb3VwX3VzZSwgZGVzY3JpcHRpb24sIG9uZXRpbWVfdXNlLCBzdGF0dXNfYXBwcm92ZSwgdHlwZV9jb250aW51b3VzLCB2b2x1bnRhcnlfc3RhdHVzLCB0eXBlX2dyb3VwfSA9IGRhdGE7XHJcbiAgICAgICAgICAgIGxldCBuZXdEYXRhID0geyB5ZWFyLCBncm91cF93ZWxmYXJlX25hbWUsIGdyb3VwX3VzZSwgZGVzY3JpcHRpb24sIG9uZXRpbWVfdXNlLCBzdGF0dXNfYXBwcm92ZSwgdHlwZV9jb250aW51b3VzLCB2b2x1bnRhcnlfc3RhdHVzLCB0eXBlX2dyb3VwfTtcclxuICAgICAgICAgICAgdmFyIHR6ID0gXCJUMDA6MDA6MDArMDc6MDBcIjtcclxuICAgICAgICAgICAgbmV3RGF0YS5zdGFydF9kYXRlID0gZGF0YS5zdGFydF9kYXRlICsgdHo7XHJcbiAgICAgICAgICAgIGlmKGRhdGEuY2FsX2RhdGUgPT09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YS5jYWxfZGF0ZSA9IGRhdGEuY2FsX2RhdGU7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YS5jYWxfZGF0ZSA9IGRhdGEuY2FsX2RhdGUgKyB0ejtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihkYXRhLmVuZF9kYXRlID09PSBudWxsKXtcclxuICAgICAgICAgICAgICAgIG5ld0RhdGEuZW5kX2RhdGUgPSBkYXRhLmVuZF9kYXRlXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YS5lbmRfZGF0ZSA9IGRhdGEuZW5kX2RhdGUgKyB0ejtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhuZXdEYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgIGF4aW9zLnBvc3QoYC4vZ3JvdXAvd2VsZmFyZS9pbnNlcnRgLCBuZXdEYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguJrguLHguJnguJfguLbguIHguKrguLPguYDguKPguYfguIgnLCBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuTElTVF9XRUxGQVJFKHllYXJOb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RZZWFyID0geWVhck5vdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkdFVF9ZRUFSKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmZpcmUoJ2Nsb3NlUGFuZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJCQoJ3dlbGZhcmUtcGFuZWwnKS5jaGVja2VkX3RhYignI3RhYjInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJCQoJ3dlbGZhcmUtcGFuZWwnKS5nZXRHcm91cFdlbGZhcmVJZChyZXN1bHQuZGF0YS5pZFswXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgREVMRVRFX1dFTEZBUkU6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICAgICAgYXhpb3MuZGVsZXRlKGAuL2dyb3VwL3dlbGZhcmUvZGVsZXRlL2lkL2AgKyBkYXRhLmlkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguKXguJrguKrguLPguYDguKPguYfguIgnLCBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJCQoJ3BhbmVsLXJpZ2h0JykuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuTElTVF9XRUxGQVJFKHllYXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RZZWFyID0geWVhcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuR0VUX1lFQVIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBFRElUX1dFTEZBUkU6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciB5ZWFyTm93ID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgbGV0IHsgaWQsIHllYXIsIHN0YXJ0X2RhdGUsIGVuZF9kYXRlLCBjYWxfZGF0ZSwgZ3JvdXBfd2VsZmFyZV9uYW1lLCBncm91cF91c2UsIGRlc2NyaXB0aW9uLCBvbmV0aW1lX3VzZSwgdHlwZV9jb250aW51b3VzLCB2b2x1bnRhcnlfc3RhdHVzLCB0eXBlX2dyb3VwfSA9IGRhdGE7XHJcbiAgICAgICAgICAgIGxldCBuZXdEYXRhID0geyBpZCwgeWVhciwgZ3JvdXBfd2VsZmFyZV9uYW1lLCBncm91cF91c2UsIGRlc2NyaXB0aW9uLCBvbmV0aW1lX3VzZSwgdHlwZV9jb250aW51b3VzLCB2b2x1bnRhcnlfc3RhdHVzLCB0eXBlX2dyb3VwfTtcclxuICAgICAgICAgICAgdmFyIHR6ID0gXCJUMDA6MDA6MDArMDc6MDBcIjtcclxuICAgICAgICAgICAgbmV3RGF0YS5zdGFydF9kYXRlID0gZGF0YS5zdGFydF9kYXRlICsgdHo7XHJcbiAgICAgICAgICAgIGlmKGRhdGEuY2FsX2RhdGUgPT09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YS5jYWxfZGF0ZSA9IGRhdGEuY2FsX2RhdGU7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YS5jYWxfZGF0ZSA9IGRhdGEuY2FsX2RhdGUgKyB0ejtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihkYXRhLmVuZF9kYXRlID09PSBudWxsKXtcclxuICAgICAgICAgICAgICAgIG5ld0RhdGEuZW5kX2RhdGUgPSBkYXRhLmVuZF9kYXRlXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YS5lbmRfZGF0ZSA9IGRhdGEuZW5kX2RhdGUgKyB0ejtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhuZXdEYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgIGF4aW9zLnB1dChgLi9ncm91cC93ZWxmYXJlL3VwZGF0ZWAsIG5ld0RhdGEpXHJcbiAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguJrguLHguJnguJfguLbguIHguKrguLPguYDguKPguYfguIgnLCBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkxJU1RfV0VMRkFSRSh5ZWFyTm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5MSVNUX1dFTEZBUkVfSUQoZGF0YS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU0VMRUNUX0RBVEEoZGF0YS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVVBEQVRFX1dFTEZBUkUobmV3RGF0YS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVVBEQVRFX1dFTEZBUkU6IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICAgICAgYXhpb3MuZ2V0KCcvZ3JvdXAvd2VsZmFyZS8nICsgaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYWxEYXRlID0gcmVzdWx0LmRhdGEuY2FsX2RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSByZXN1bHQuZGF0YS53ZWxmYXJlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlR3JvdXAgPSByZXN1bHQuZGF0YS50eXBlX2dyb3VwO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb24gPSByZXN1bHQuZGF0YS50eXBlX2NvbnRpbnVvdXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9uZSA9IHJlc3VsdC5kYXRhLm9uZXRpbWVfdXNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0eiA9IFwiVDAwOjAwOjAwKzA3OjAwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhW2ldLmNvbmRpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGVHcm91cCA9PSAnZ2VuZXJhbCcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29uID09PSB0cnVlICYmIG9uZSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXS5yb3VuZF91c2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoY29uID09PSB0cnVlICYmIG9uZSA9PT0gZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaV0ucm91bmRfdXNlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihjb24gPT09IGZhbHNlICYmIG9uZSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXS5yb3VuZF91c2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaV0ucm91bmRfdXNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29uZGl0aW9uID0gZGF0YVtpXS5jb25kaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcnIgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IGNvbmRpdGlvbi5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YTIgPSBjb25kaXRpb25bal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VhcmNoID0gZGF0YTIuZmllbGRfbmFtZS5zZWFyY2goJ2RhdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWFyY2hfYWdlID0gZGF0YTIuZmllbGRfbmFtZS5zZWFyY2goJ2FnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlYXJjaCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhMi5sb2dpY19zaG93LnNlYXJjaChcIj5cIikgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IGNhbERhdGUuc3BsaXQoXCItXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhMi52YWx1ZSA9IChwYXJzZUludChkWzBdKSAtIHBhcnNlSW50KGRhdGEyLnZhbHVlX3Nob3cpKSArIFwiLVwiICsgZFsxXSArIFwiLVwiICsgZFsyXS5zcGxpdChcIlRcIilbMF0gKyB0ejtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTIubG9naWMgPSBkYXRhMi5sb2dpY19zaG93LnJlcGxhY2UoXCI+XCIsIFwiPFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEyLmxvZ2ljX3Nob3cuc2VhcmNoKFwiPFwiKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gY2FsRGF0ZS5zcGxpdChcIi1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEyLnZhbHVlID0gKHBhcnNlSW50KGRbMF0pIC0gcGFyc2VJbnQoZGF0YTIudmFsdWVfc2hvdykpICsgXCItXCIgKyBkWzFdICsgXCItXCIgKyBkWzJdLnNwbGl0KFwiVFwiKVswXSArIHR6O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhMi5sb2dpYyA9IGRhdGEyLmxvZ2ljX3Nob3cucmVwbGFjZShcIjxcIiwgXCI+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoc2VhcmNoX2FnZSAhPSAtMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEyLmxvZ2ljX3Nob3cuc2VhcmNoKFwiPlwiKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEyLnZhbHVlID0gcGFyc2VJbnQoZGF0YTIudmFsdWVfc2hvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEyLmxvZ2ljID0gZGF0YTIubG9naWNfc2hvdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEubG9naWNfc2hvdy5zZWFyY2goXCI8XCIpID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTIudmFsdWUgPSBwYXJzZUludChkYXRhMi52YWx1ZV9zaG93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTIubG9naWMgPSBkYXRhMi5sb2dpY19zaG93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTIudmFsdWUgPSBkYXRhMi52YWx1ZV9zaG93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEyLmxvZ2ljID0gZGF0YTIubG9naWNfc2hvdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGRhdGEyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXS5jb25kaXRpb24gPSBhcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZXRXZWxmYXJlID0gZGF0YS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB7YnVkZ2V0LCBidWRnZXRfZW1wLCBjb25kaXRpb24sIGdyb3VwX2lkLCBpZCwgcm91bmRfdXNlLCB3ZWxmYXJlX25hbWV9ID0gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdpdGVtID0geyBidWRnZXQsIGNvbmRpdGlvbiwgZ3JvdXBfaWQsIGlkLCByb3VuZF91c2UsIHdlbGZhcmVfbmFtZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3aXRlbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzZXRXZWxmYXJlKTtcclxuICAgICAgICAgICAgICAgICAgICBheGlvcy5wdXQoYC4vZ3JvdXAvd2VsZmFyZS91cGRhdGVHcm91cGAsIHNldFdlbGZhcmUpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBTRUxFQ1RfREFUQTogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWwpO1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy9ncm91cC93ZWxmYXJlLycgKyB2YWwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1NFTEVDVF9EQVRBJywgcGF5bG9hZDogcmVzdWx0LmRhdGEgfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgR0VUX1lFQVIoKSB7XHJcbiAgICAgICAgICAgIGF4aW9zLmdldCgnL2dyb3VwL3dlbGZhcmUveWVhcicpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnR0VUX1lFQVInLCBwYXlsb2FkOiByZXN1bHQuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBBUFBST1ZFX1dFTEZBUkU6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciB5ZWFyTm93ID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgIGF4aW9zLnB1dChgLi9ncm91cC93ZWxmYXJlL2FwcHJvdmVgLCBkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJywgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuTElTVF9XRUxGQVJFX0lEKGRhdGEuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TRUxFQ1RfREFUQShkYXRhLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuTElTVF9XRUxGQVJFKHllYXJOb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBDTEVBUl9XRUxGQVJFOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnQ0xFQVJfV0VMRkFSRScsIHBheWxvYWQ6IGRhdGEgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIENMRUFSX1dFTEZBUkVfSUQ6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdDTEVBUl9XRUxGQVJFX0lEJywgcGF5bG9hZDogW10gfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIENMT05FX0RBVEE6ZnVuY3Rpb24gKHllYXIpe1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy9ncm91cC93ZWxmYXJlL3llYXIvJyArIHllYXIpXHJcbiAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdC5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5jaGVjayA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSByZXN1bHQuZGF0YS5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5zdGF0dXNfYXBwcm92ZSA9PSB0cnVlICYmIGl0ZW0ueWVhciAhPT0gOTk5OVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0NMT05FX0RBVEEnLCBwYXlsb2FkOiBkYXRhIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBJTlNFUlRfQ0xPTkVfREFUQTpmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pO1xyXG4gICAgICAgICAgICBheGlvcy5wb3N0KGAuL2dyb3VwL3dlbGZhcmUvY2xvbmVgLCBkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguJrguLHguJnguJfguLbguIHguKrguLPguYDguKPguYfguIgnLCBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlRGlhbG9nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkxJU1RfV0VMRkFSRShkYXRhLnllYXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RZZWFyID0gZGF0YS55ZWFyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5HRVRfWUVBUigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBdXHJcblxyXG59XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9yZWR1Y2VyL2dyb3VwV2VsZmFyZS5qc1xuLy8gbW9kdWxlIGlkID0gNjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGF4aW9zIGZyb20gJy4uL2F4aW9zJ1xyXG5pbXBvcnQge2NvbW1vbkFjdGlvbn0gZnJvbSAnLi4vY29uZmlnJ1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgbGlzdDpbXSxcclxuICAgIHNlbGVjdDp7fVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZXJSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLGFjdGlvbil7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ1BST1ZJREVSX0xJU1QnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7bGlzdDphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGNhc2UgJ1BST1ZJREVSX1NFTEVDVCc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHN0YXRlLHtzZWxlY3Q6YWN0aW9uLnBheWxvYWR9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlckFjdGlvbihzdG9yZSl7XHJcblxyXG4gICAgcmV0dXJuIFtjb21tb25BY3Rpb24oKSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBST1ZJREVSX0xJU1Q6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmdldCgnL3Byb3ZpZGVycycpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXM9PntcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7dHlwZTonUFJPVklERVJfTElTVCcscGF5bG9hZDpyZXMuZGF0YX0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycj0+e1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFBST1ZJREVSX1NFTEVDVDpmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5nZXQoYC9wcm92aWRlcnMvcHJvdmlkZXIvJHtpZH1gKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzPT57XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goe3R5cGU6J1BST1ZJREVSX1NFTEVDVCcscGF5bG9hZDpyZXMuZGF0YX0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycj0+e1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBdXHJcblxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvcHJvdmlkZXIuanNcbi8vIG1vZHVsZSBpZCA9IDY0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBheGlvcyBmcm9tICcuLi9heGlvcydcclxuaW1wb3J0IHsgY29tbW9uQWN0aW9uIH0gZnJvbSAnLi4vY29uZmlnJ1xyXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XHJcbiAgICBsaXN0OiBbXVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiByZXRpZXJSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdSRVRJRVJfU0VBUkNIJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGxpc3Q6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiByZXRpZXJBY3Rpb24oc3RvcmUpIHtcclxuICAgIHJldHVybiBbY29tbW9uQWN0aW9uKCksXHJcbiAgICB7XHJcbiAgICAgICAgUkVUSUVSX1NFQVJDSDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgLy8gdmFyIHR6ID0gXCJUMDA6MDA6MDArMDc6MDBcIjtcclxuICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgIGF4aW9zLmdldCgnL3JldGllci9saXN0P2RhdGU9JyArIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdC5kYXRhLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICByZXR1cm4gaXRlbS5jaGVjayA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAvLyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4LmC4Lir4Lil4LiU4LiC4LmJ4Lit4Lih4Li54Lil4Liq4Liz4LmA4Lij4LmH4LiIJywgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1JFVElFUl9TRUFSQ0gnLCBwYXlsb2FkOiByZXN1bHQuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBdXHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9yZXRpZXIuanNcbi8vIG1vZHVsZSBpZCA9IDY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBheGlvcyBmcm9tICcuLi9heGlvcydcclxuaW1wb3J0IHsgY29tbW9uQWN0aW9uIH0gZnJvbSAnLi4vY29uZmlnJ1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgbGlzdDogW10sXHJcbiAgICBkYXRhOiB7fSxcclxuICAgIGxpc3Rfc2hlZXQ6IFtdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzc29SZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdTU09fU0VMRUNUX1VQTE9BRCc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBkYXRhOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdTU09fUFJFVklFV19EQVRBJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGxpc3Q6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ1NTT19HRVRfU0hFRVQnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgbGlzdF9zaGVldDogYWN0aW9uLnBheWxvYWR9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNzb0FjdGlvbihzdG9yZSkge1xyXG4gICAgcmV0dXJuIFtjb21tb25BY3Rpb24oKSwge1xyXG4gICAgICAgIFNTT19VUExPQURGSUxFOiBmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmaWxlWzBdKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgZGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlWzBdKTtcclxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgIG9uVXBsb2FkUHJvZ3Jlc3M6IGZ1bmN0aW9uIChwcm9ncmVzc0V2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZWQgPSBNYXRoLnJvdW5kKChwcm9ncmVzc0V2ZW50LmxvYWRlZCAqIDEwMCkgLyBwcm9ncmVzc0V2ZW50LnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdyZWYtcGF0aCc6ICdzc28uZmlsZScgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBheGlvcy5wb3N0KCcuL3Nzby91cGxvYWQnLCBkYXRhLCBjb25maWcpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSByZXNwb25zZS5kYXRhLmdlbmVyYXRlZF9rZXlzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGF4aW9zLmdldCgnLi9zc28vZG93bmxvYWQvaWQvJyArIGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnU1NPX1NFTEVDVF9VUExPQUQnLCBwYXlsb2FkOiByZXN1bHQuZGF0YVswXSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgU1NPX1BSRVZJRVdfREFUQTogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgIGF4aW9zLmdldCgnLi9zc28vZ2V0ZmlsZS9uYW1lLycgKyBkYXRhLm5hbWUgKyAnL3NoZWV0LycgKyBkYXRhLnNoZWV0KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gcmVzdWx0LmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5kYXRhW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3VsdC5kYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5pc3N1ZWRfZGF0ZSA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkYXRhLmlzc3VlZF9kYXRlID0gZGF0YS5pc3N1ZWRfZGF0ZS5zcGxpdCgnVCcpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGF0YS5leHBpcmVkX2RhdGUgPSBkYXRhLmV4cGlyZWRfZGF0ZS5zcGxpdCgnVCcpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4LmC4Lir4Lil4LiU4LiC4LmJ4Lit4Lih4Li54Lil4Liq4Liz4LmA4Lij4LmH4LiIJywgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1NTT19QUkVWSUVXX0RBVEEnLCBwYXlsb2FkOiByZXN1bHQuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIFNTT19JTlNFUlQ6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pO1xyXG4gICAgICAgICAgICBheGlvcy5wb3N0KCcuL3Nzby9pbnNlcnQnLCBkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguYDguIHguYfguJrguILguYnguK3guKHguLnguKXguKXguIfguJDguLLguJnguILguYnguK3guKHguLnguKXguKrguLPguYDguKPguYfguIgnLCBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgU1NPX0dFVF9TSEVFVDogZnVuY3Rpb24gKG5hbWVGaWxlKSB7XHJcbiAgICAgICAgICAgIGF4aW9zLmdldCgnLi9zc28vc2hlZXQvJyArIG5hbWVGaWxlKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1NTT19HRVRfU0hFRVQnLCBwYXlsb2FkOiByZXN1bHQuZGF0YSB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1dXHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci9zc28uanNcbi8vIG1vZHVsZSBpZCA9IDY2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBheGlvcyBmcm9tICcuLi9heGlvcydcclxuaW1wb3J0IHsgY29tbW9uQWN0aW9uIH0gZnJvbSAnLi4vY29uZmlnJ1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgbW9kdWxlOiBbXSxcclxuICAgIGNvbmZpZzoge31cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN5c3RlbUNvbmZpZ3NSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdHRVRfU1lTVEVNX0NPTkZJRyc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBjb25maWc6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN5c3RlbUNvbmZpZ3NBY3Rpb24oc3RvcmUpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgY29tbW9uQWN0aW9uKCksIHtcclxuICAgICAgICAgICAgR0VUX1NZU1RFTV9DT05GSUc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIHZhciB1c2VyID0gc3RvcmUuZ2V0U3RhdGUoKS5hdXRoLnVzZXI7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5nZXQoJy9zeXN0ZW0vY29uZmlnJylcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0dFVF9TWVNURU1fQ09ORklHJywgcGF5bG9hZDogcmVzLmRhdGEgfSlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFVQREFURV9TWVNURU1fQ09ORklHOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHVzZXIgPSBzdG9yZS5nZXRTdGF0ZSgpLmF1dGgudXNlcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpb3MucG9zdCgnL3N5c3RlbS9jb25maWcvdXBkYXRlJywgZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguJrguLHguJnguJfguLbguIHguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkdFVF9TWVNURU1fQ09ORklHKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBheGlvcy5wb3N0KCcvc3lzdGVtL2NvbmZpZy91cGRhdGUnLGRhdGEpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLmRhdGEpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIC8vIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIC8vIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJywgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIC8vICAgICB0aGlzLkdFVF9TWVNURU1fQ09ORklHKClcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAvLyBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdHRVRfU1lTVEVNX0NPTkZJRycsIHBheWxvYWQ6IHJlcy5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAgICAgICAgIC8vICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvc3JjL3JlZHV4LXN0b3JlL3JlZHVjZXIvc3lzdGVtQ29uZmlncy5qc1xuLy8gbW9kdWxlIGlkID0gNjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGF4aW9zIGZyb20gJy4uL2F4aW9zJ1xyXG5pbXBvcnQge2NvbW1vbkFjdGlvbn0gZnJvbSAnLi4vY29uZmlnJ1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgc2VsZWN0Ont9LFxyXG4gICAgbGlzdDpbXSxcclxuICAgIGZpbGVJZFVwbG9hZDp7fSxcclxuICAgIC8vIGxpc3RGaWxlczpbXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkUmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSxhY3Rpb24pe1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdVUExPQURfTElTVCc6XHJcbiAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxzdGF0ZSx7bGlzdDphY3Rpb24ucGF5bG9hZH0pO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRBY3Rpb24oc3RvcmUpe1xyXG4gICAgcmV0dXJuIFtjb21tb25BY3Rpb24oKSx7XHJcbiAgICAgIFVQTE9BRF9ERUxFVEUoZGF0YSl7XHJcbiAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcse3N0YXR1czonbG9hZCcsdGV4dDon4LiB4Liz4Lil4Lix4LiH4Lia4Lix4LiZ4LiX4Li24LiB4LiC4LmJ4Lit4Lih4Li54LilLi4uJ30pXHJcbiAgICAgICAgYXhpb3MuZGVsZXRlKCcvZG9jdW1lbnQvZGVsZXRlLycrZGF0YSlcclxuICAgICAgICAudGhlbiggKHJlc3BvbnNlKT0+e1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIC8vIHN0b3JlLmRpc3BhdGNoKHt0eXBlOidVUExPQURfREVMRVRFJyxwYXlsb2FkOnJlc3BvbnNlLmRhdGF9KVxyXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguJrguLHguJnguJfguLbguIHguKrguLPguYDguKPguYfguIgnLGNhbGxiYWNrOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIFVQTE9BRF9HRVRfRklMRShmaWxlSWQpe1xyXG4gICAgICAgIC8vIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J2xvYWQnLHRleHQ6J+C4geC4s+C4peC4seC4h+C4muC4seC4meC4l+C4tuC4geC4guC5ieC4reC4oeC4ueC4pS4uLid9KVxyXG4gICAgICAgIC8vIGF4aW9zLmdldCgnL2ZpbGUvZG93bmxvYWQvJytmaWxlSWQpXHJcbiAgICAgICAgLy8gLnRoZW4oIChyZXNwb25zZSk9PntcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvLyAgICAgLy8gc3RvcmUuZGlzcGF0Y2goe3R5cGU6J1VQTE9BRF9ERUxFVEUnLHBheWxvYWQ6cmVzcG9uc2UuZGF0YX0pXHJcbiAgICAgICAgLy8gICAgIHRoaXMuZmlyZSgndG9hc3QnLHtzdGF0dXM6J3N1Y2Nlc3MnLHRleHQ6J+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsY2FsbGJhY2s6ZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyAgICAgICBjb25zb2xlLmxvZygnc3VjY2VzcycpO1xyXG4gICAgICAgIC8vICAgICB9fSk7XHJcbiAgICAgICAgLy8gfSlcclxuICAgICAgICAvLyAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAvLyB9KTtcclxuICAgICAgfVxyXG4gICB9XVxyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci91cGxvYWQuanNcbi8vIG1vZHVsZSBpZCA9IDY4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBheGlvcyBmcm9tICcuLi9heGlvcydcclxuaW1wb3J0IHsgY29tbW9uQWN0aW9uIH0gZnJvbSAnLi4vY29uZmlnJ1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgbGlzdDogW10sXHJcbiAgICBzZWxlY3Q6IHt9LFxyXG4gICAgbGlzdF9pZDogW10sXHJcbiAgICBsaXN0X3VzZXI6IFtdLFxyXG4gICAgbGlzdF9oaXN0b3J5X3dlbGZhcmU6IFtdLFxyXG4gICAgbGlzdF9oaXN0b3J5X2Z1bmQ6IFtdLFxyXG4gICAgbGlzdF9ncm91cF9mdW5kOltdLFxyXG4gICAgbGlzdF9oaXN0b3J5X3NzbzpbXSxcclxuICAgIGxpc3RTZWFyY2g6IFtdLFxyXG4gICAgd2VsZmFyZV9lbXBsb3llZTogW10sXHJcbiAgICBzZWxlY3RfdXNlX3dlbGVmYXJlczoge30sXHJcbiAgICBmYWN1bHR5X2xpc3Q6IFtdXHJcbn1cclxuY29uc3QgY2xlYXJEYXRhID0gKGRhdGEsIGNhbGxiYWNrKSA9PiB7XHJcblxyXG4gICAgbGV0IHsgcHJlZml4X2lkLCBmaXJzdG5hbWUsIGxhc3RuYW1lLCBnZW5kZXJfaWQsIHR5cGVfZW1wbG95ZWVfaWQsIGFjdGl2ZV9pZCwgcG9zaXRpb25faWQsIG1hdGllcl9pZCwgYWNhZGVtaWNfaWQsIGRlcGFydG1lbnRfaWQsIGZhY3VsdHlfaWQsIGVtcF9ubywgcGVyc29uYWxfaWQsXHJcbiAgICAgICAgYWNhZGVtaWNfbmFtZSwgYWN0aXZlX25hbWUsIGdlbmRlcl9uYW1lLCBtYXRpZXJfbmFtZSwgcG9zaXRpb25fbmFtZSwgcHJlZml4X25hbWUsIGRlcGFydG1lbnRfbmFtZSwgdHlwZV9lbXBsb3llZV9uYW1lLCBmYWN1bHR5X25hbWUsIGVuZF93b3JrX2RhdGUsIHdvcmtfYWdlLCBhZ2UsXHJcbiAgICAgICAgaG9zcGl0YWwsZW1haWwsdGVsIH0gPSBkYXRhO1xyXG4gICAgbGV0IG5ld0RhdGEgPSB7XHJcbiAgICAgICAgcHJlZml4X2lkLCBmaXJzdG5hbWUsIGxhc3RuYW1lLCBnZW5kZXJfaWQsIHR5cGVfZW1wbG95ZWVfaWQsIGFjdGl2ZV9pZCwgcG9zaXRpb25faWQsIG1hdGllcl9pZCwgYWNhZGVtaWNfaWQsIGRlcGFydG1lbnRfaWQsIGZhY3VsdHlfaWQsIGVtcF9ubywgcGVyc29uYWxfaWQsXHJcbiAgICAgICAgYWNhZGVtaWNfbmFtZSwgYWN0aXZlX25hbWUsIGdlbmRlcl9uYW1lLCBtYXRpZXJfbmFtZSwgcG9zaXRpb25fbmFtZSwgcHJlZml4X25hbWUsIGRlcGFydG1lbnRfbmFtZSwgdHlwZV9lbXBsb3llZV9uYW1lLCBmYWN1bHR5X25hbWUsIGVuZF93b3JrX2RhdGUsIHdvcmtfYWdlLCBhZ2UsXHJcbiAgICAgICAgaG9zcGl0YWwsZW1haWwsdGVsXHJcbiAgICB9O1xyXG4gICAgLy8gbmV3RGF0YS5wZXJpb2QgPSBuZXcgQXJyYXkoKTtcclxuICAgIC8vIGRhdGEucGVyaW9kLm1hcCgodGFnKT0+e1xyXG4gICAgLy8gICAgIG5ld0RhdGEucGVyaW9kLnB1c2goe25vOnRhZy5ubyxxdWFsaXR5OnRhZy5xdWFsaXR5fSk7XHJcbiAgICAvLyB9KTtcclxuICAgIGlmIChkYXRhLnN0YXJ0X3dvcmtfZGF0ZSAhPT0gdW5kZWZpbmVkICYmIGRhdGEuc3RhcnRfd29ya19kYXRlICE9PSAnJykge1xyXG4gICAgICAgIC8vIDIwMTctMDYtMDlUMTE6NTI6MTguMTU3KzA3OjAwXHJcbiAgICAgICAgbmV3RGF0YS5zdGFydF93b3JrX2RhdGUgPSBkYXRhLnN0YXJ0X3dvcmtfZGF0ZSArICdUMDA6MDA6MDAuMDAwKzA3OjAwJ1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdEYXRhLnN0YXJ0X3dvcmtfZGF0ZSA9IGRhdGEuc3RhcnRfd29ya19kYXRlXHJcbiAgICB9XHJcbiAgICBpZiAoZGF0YS5lbmRfd29ya19kYXRlICE9PSBudWxsICYmIGRhdGEuZW5kX3dvcmtfZGF0ZSAhPT0gJycpIHtcclxuICAgICAgICAvLyBsb2dcclxuICAgICAgICBuZXdEYXRhLmVuZF93b3JrX2RhdGUgPSBkYXRhLmVuZF93b3JrX2RhdGUgKyAnVDAwOjAwOjAwLjAwMCswNzowMCdcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV3RGF0YS5lbmRfd29ya19kYXRlID0gZGF0YS5lbmRfd29ya19kYXRlXHJcbiAgICB9XHJcbiAgICAvLyBjb25zb2xlLmxvZygpO1xyXG4gICAgbmV3RGF0YS5iaXJ0aGRhdGUgPSBkYXRhLmJpcnRoZGF0ZSArICdUMDA6MDA6MDAuMDAwKzA3OjAwJ1xyXG4gICAgY2FsbGJhY2sobmV3RGF0YSlcclxuICAgIC8vIGNhbGxiYWNrKGRhdGEpXHJcbn1cclxuY29uc3QgY2xlYXJEYXRhd2VsZmFyZSA9IChkYXRhLCBjYWxsYmFjaykgPT4ge1xyXG5cclxuICAgIGxldCB7IGJ1ZGdldF9iYWxhbmNlLCBidWRnZXRfY292ZXIsIGJ1ZGdldF91c2UsIGVtcF9pZCwgZ3JvdXBfaWQsIGRlc2NyaXB0aW9uX2RldGFpbCwgXHJcbiAgICAgICAgc3RhdHVzLCB3ZWxmYXJlX2lkLCBkYXRlX3VzZSwgZGF0ZV9hcHByb3ZlLCBwZXJzb25hbF9pZCxidWRnZXRfZW1wLHR5cGVfZ3JvdXAgfSA9IGRhdGE7XHJcbiAgICBsZXQgbmV3RGF0YSA9IHsgYnVkZ2V0X2JhbGFuY2UsIGJ1ZGdldF9jb3ZlciwgYnVkZ2V0X3VzZSwgZW1wX2lkLCBncm91cF9pZCwgZGVzY3JpcHRpb25fZGV0YWlsLCBcclxuICAgICAgICBzdGF0dXMsIHdlbGZhcmVfaWQsIGRhdGVfdXNlLCBkYXRlX2FwcHJvdmUsIHBlcnNvbmFsX2lkLGJ1ZGdldF9lbXAsdHlwZV9ncm91cCB9O1xyXG4gICAgLy8gY29uc29sZS5sb2coZGF0YS5kYXRlL3VzZV93ZWxmYXJlL3VwZGF0ZV91c2UgPT0gJycpO1xyXG5cclxuICAgIG5ld0RhdGEuZG9jdW1lbnRfaWRzID0gbmV3IEFycmF5KClcclxuICAgIGRhdGEuZG9jdW1lbnRfaWRzLm1hcCgoZmlsZSkgPT4ge1xyXG4gICAgICAgIG5ld0RhdGEuZG9jdW1lbnRfaWRzLnB1c2goZmlsZSlcclxuICAgIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZyhuZXdEYXRhKTtcclxuICAgIGNhbGxiYWNrKG5ld0RhdGEpXHJcbn1cclxuY29uc3QgY2hhbmdlVGltZSA9IChkYXRhLCB0aW1lWm9uZSwgY2FsbGJhY2spID0+IHtcclxuICAgIGxldCB0aW1lXHJcbiAgICBkYXRhLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHByb3AuaW5kZXhPZignZGF0ZScpID49IDAgJiYgcHJvcCAhPT0gJ3VwZGF0ZXInKSB7XHJcbiAgICAgICAgICAgICAgICB0aW1lID0gbmV3IERhdGUoaXRlbVtwcm9wXSlcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGFbaW5kZXhdW3Byb3BdKTtcclxuICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdW3Byb3BdID0gbmV3IERhdGUodGltZS5zZXRIb3Vycyh0aW1lLmdldEhvdXJzKCkgKyB0aW1lWm9uZSkpLnRvSVNPU3RyaW5nKClcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5ldyBEYXRlKGRhdGFbaW5kZXhdW3Byb3BdKS50b0lTT1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0eXBlb2YgaXRlbVtwcm9wXSA9PT0gJ29iamVjdCcpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW1bcHJvcF0gPT09ICdvYmplY3QnKVxyXG4gICAgICAgICAgICAgICAgY2hhbmdlVGltZShpdGVtW3Byb3BdLCB0aW1lWm9uZSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgY2FsbGJhY2soZGF0YSlcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdXNlcldlbGZhcmVSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcclxuXHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnV0VMRkFSRV9MSVNUX1lFQVInOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgbGlzdDogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnV0VMRkFSRV9MSVNUJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGxpc3RfaWQ6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ0xJU1RfVVNFUic6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBsaXN0X3VzZXI6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ0VNUExPWUVFX0hJU1RPUllfV0VMRkFSRSc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBsaXN0X2hpc3Rvcnlfd2VsZmFyZTogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnRU1QTE9ZRUVfSElTVE9SWV9GVU5EJzpcclxuICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBsaXN0X2hpc3RvcnlfZnVuZDogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnRU1QTE9ZRUVfTElTVF9HUk9VUF9GVU5EJzpcclxuICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBsaXN0X2dyb3VwX2Z1bmQ6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ0VNUExPWUVFX0hJU1RPUllfU1NPJzpcclxuICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBsaXN0X2hpc3Rvcnlfc3NvOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdMSVNUX1VTRVJfU0VSQVJDSCc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBsaXN0U2VhcmNoOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdMSVNUX0VNUExPWUVFX1dFTEZBUkUnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgd2VsZmFyZV9lbXBsb3llZTogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnTElTVF9FTVBMT1lFRVNfV0VMRkFSRSc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyB3ZWxmYXJlX2VtcGxveWVlOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdFTVBMT1lFRV9HRVRfV0VMRkFSRVMnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgd2VsZmFyZV9lbXBsb3llZTogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnRU1QTE9ZRUVfVVNFX1NFTEVURV9XRUxGQVJFJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IHNlbGVjdF91c2Vfd2VsZWZhcmVzOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdGQUNVTFRZX0xJU1QnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgZmFjdWx0eV9saXN0OiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdDTEVBUl9JTlNFUlQnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgd2VsZmFyZV9lbXBsb3llZTogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlcldlbGZhcmVBY3Rpb24oc3RvcmUpIHtcclxuXHJcbiAgICByZXR1cm4gW2NvbW1vbkFjdGlvbigpLFxyXG4gICAge1xyXG4gICAgICAgIFdFTEZBUkVfTElTVF9ZRUFSOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGF4aW9zLmdldCgnLi9ncm91cC93ZWxmYXJlL3llYXInKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdXRUxGQVJFX0xJU1RfWUVBUicsIHBheWxvYWQ6IHJlc3VsdC5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIFdFTEZBUkVfTElTVFM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGF4aW9zLmdldCgnLi93ZWxmYXJlL2FjdGl2ZS8nKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtLmdyb3VwX3VzZSA9PT0gdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmdyb3VwX3VzZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5sYWJlbCA9IGl0ZW0uZ3JvdXBfd2VsZmFyZV9uYW1lICsgJyAo4LmB4Lia4Lia4LiB4Lil4Li44LmI4LihKSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5sYWJlbCA9IGl0ZW0uZ3JvdXBfd2VsZmFyZV9uYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdC5kYXRhKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnV0VMRkFSRV9MSVNUJywgcGF5bG9hZDogcmVzdWx0LmRhdGEgfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgTElTVF9VU0VSOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy4vZW1wbG95ZWUvbGlzdC93b3JrJylcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0RhdGEgPSByZXN1bHQuZGF0YS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uYWNhZGVtaWNfbmFtZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmZ1bGxOYW1lID0gaXRlbS5wcmVmaXhfbmFtZSArIFwiIFwiICsgaXRlbS5maXJzdG5hbWUgKyBcIiBcIiArIGl0ZW0ubGFzdG5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZnVsbE5hbWUgPSBpdGVtLmFjYWRlbWljX25hbWUgKyBcIiBcIiArIGl0ZW0uZmlyc3RuYW1lICsgXCIgXCIgKyBpdGVtLmxhc3RuYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0xJU1RfVVNFUicsIHBheWxvYWQ6IHJlc3VsdC5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIExJU1RfVVNFUl9TRVJBUkNIOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJTZWFyY2ggPSBpZDtcclxuICAgICAgICAgICAgYXhpb3MuZ2V0KCcuL2dyb3VwL3dlbGZhcmUvYWRtaW5FbXBsb3llZS8nICsgaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdEYXRhID0gcmVzcG9uc2UuZGF0YS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uYWNhZGVtaWNfbmFtZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmZ1bGxOYW1lID0gaXRlbS5wcmVmaXhfbmFtZSArIFwiIFwiICsgaXRlbS5maXJzdG5hbWUgKyBcIiBcIiArIGl0ZW0ubGFzdG5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZnVsbE5hbWUgPSBpdGVtLmFjYWRlbWljX25hbWUgKyBcIiBcIiArIGl0ZW0uZmlyc3RuYW1lICsgXCIgXCIgKyBpdGVtLmxhc3RuYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGVjayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0xJU1RfVVNFUl9TRVJBUkNIJywgcGF5bG9hZDogbmV3RGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFVTRVJfSU5TRVJUOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KTtcclxuICAgICAgICAgICAgYXhpb3MucG9zdCgnLi9oaXN0b3J5L3JlcXVlc3QvJywgZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuTElTVF9VU0VSX1NFUkFSQ0godGhpcy51c2VyU2VhcmNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIExJU1RfRU1QTE9ZRUVfV0VMRkFSRTogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGF4aW9zLmdldCgnLi9lbXBsb3llZS8nICsgZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnTElTVF9FTVBMT1lFRV9XRUxGQVJFJywgcGF5bG9hZDogcmVzdWx0LmRhdGEgfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgTElTVF9FTVBMT1lFRVNfV0VMRkFSRTogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGF4aW9zLmdldCgnLi9lbXBsb3llZS8nICsgZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hhbmdlVGltZShyZXN1bHQuZGF0ZSwrNywoZGF0YSk9PntcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnTElTVF9FTVBMT1lFRVNfV0VMRkFSRScsIHBheWxvYWQ6IHJlc3VsdC5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIEVNUExPWUVFX0dFVF9XRUxGQVJFUzogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHllYXIpO1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy4vZW1wbG95ZWUvJyArIGlkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygyKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnRU1QTE9ZRUVfR0VUX1dFTEZBUkVTJywgcGF5bG9hZDogcmVzLmRhdGEgfSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJywgdGV4dDogJ+C5guC4q+C4peC4lOC4guC5ieC4reC4oeC4ueC4peC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdFTVBMT1lFRV9HRVRfV0VMRkFSRVMnLCBwYXlsb2FkOiByZXMuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBFTVBMT1lFRV9VU0VfU0VMRVRFX1dFTEZBUkUoZGF0YSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnRU1QTE9ZRUVfVVNFX1NFTEVURV9XRUxGQVJFJywgcGF5bG9hZDogZGF0YSB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgRU1QTE9ZRUVfVVNFX1dFTEZBUkUoZGF0YSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgY2xlYXJEYXRhd2VsZmFyZShkYXRhLCAobmV3RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobmV3RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLnBvc3QoYC4vaGlzdG9yeS9hcHByb3ZlYCwgbmV3RGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkVNUExPWUVFX0dFVF9XRUxGQVJFUyhuZXdEYXRhLmVtcF9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJywgdGV4dDogJ+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuJCQoJ3BhbmVsLXJpZ2h0JykuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLiQkKCcjd2VsZmFyZV9idWRnZXQnKS5jbG9zZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEVNUExPWUVFX1VTRV9SVkQoZGF0YSkge1xyXG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAvLyAgICAgLy8gY2xlYXJEYXRhd2VsZmFyZShkYXRhLCAobmV3RGF0YSkgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cobmV3RGF0YSk7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KTtcclxuICAgICAgICAvLyAgICAgICAgIGF4aW9zLnBvc3QoYC4vaGlzdG9yeS9ydmRgLCBkYXRhKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vIHRoaXMuRU1QTE9ZRUVfR0VUX1dFTEZBUkVTKGRhdGEuZW1wX2lkKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy4kJCgncGFuZWwtcmlnaHQnKS5jbG9zZSgpO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuJCQoJyN3ZWxmYXJlX2J1ZGdldCcpLmNsb3NlKClcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgfSlcclxuICAgICAgICAvLyAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICB9KVxyXG4gICAgICAgIC8vICAgICAvLyB9KVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgRU1QTE9ZRUVfVVNFX1JFSkVDVF9SVkQoZGF0YSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgLy8gY2xlYXJEYXRhd2VsZmFyZShkYXRhLCAobmV3RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobmV3RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLnB1dChgLi9oaXN0b3J5L3JlamVjdHJ2ZGAsIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRU1QTE9ZRUVfR0VUX1dFTEZBUkVTKGRhdGEuZW1wX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy4kJCgncGFuZWwtcmlnaHQnKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuJCQoJyN3ZWxmYXJlX2J1ZGdldCcpLmNsb3NlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAvLyB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgRU1QTE9ZRUVfVVNFX1dFTEZBUkVfR1JPVVAoZGF0YSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgYXhpb3MucG9zdChgLi9oaXN0b3J5L3VzZWdyb3VwYCwgZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLkVNUExPWUVFX0dFVF9XRUxGQVJFUyhuZXdEYXRhLmVtcF9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJywgdGV4dDogJ+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuJCQoJ3BhbmVsLXJpZ2h0JykuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLiQkKCcjd2VsZmFyZV9idWRnZXQnKS5jbG9zZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIEVNUExPWUVFX0hJU1RPUllfV0VMRkFSRShkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5nZXQoYC4vaGlzdG9yeS9saXN0L3dlbGZhcmU/YCsgZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdFTVBMT1lFRV9ISVNUT1JZX1dFTEZBUkUnLCBwYXlsb2FkOiByZXMuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIEVNUExPWUVFX0hJU1RPUllfRlVORChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5nZXQoYC4vaGlzdG9yeS9saXN0L2Z1bmQ/YCsgZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdFTVBMT1lFRV9ISVNUT1JZX0ZVTkQnLCBwYXlsb2FkOiByZXMuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIEVNUExPWUVFX0xJU1RfR1JPVVBfRlVORCgpIHtcclxuICAgICAgICAgICAgICAgIGF4aW9zLmdldChgLi9oaXN0b3J5L2xpc3QvZ3JvdXAvZnVuZD9gKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ0VNUExPWUVFX0xJU1RfR1JPVVBfRlVORCcsIHBheWxvYWQ6IHJlcy5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgRU1QTE9ZRUVfSElTVE9SWV9TU08oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgYXhpb3MuZ2V0KGAuL2hpc3RvcnkvbGlzdC9zc28/YCsgZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdFTVBMT1lFRV9ISVNUT1JZX1NTTycsIHBheWxvYWQ6IHJlcy5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgRkFDVUxUWV9MSVNUKCkge1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy4vY29tbW9uL2ZhY3VsdHknKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnRkFDVUxUWV9MSVNUJywgcGF5bG9hZDogcmVzcG9uc2UuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIEVNUExPWUVFX1VQREFURShkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KVxyXG4gICAgICAgICAgIHJldHVybiAgY2xlYXJEYXRhKGRhdGEsIChuZXdEYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhuZXdEYXRhKTtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YS5pZCA9IGRhdGEuaWRcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5ld0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgYXhpb3MucHV0KGAvZW1wbG95ZWUvdXBkYXRlYCwgbmV3RGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguJrguLHguJnguJfguLbguIHguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ2JhY2stcGFnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRU1QTE9ZRUVfR0VUX1dFTEZBUkVTKG5ld0RhdGEuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuTElTVF9FTVBMT1lFRV9XRUxGQVJFKG5ld0RhdGEuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRU1QTE9ZRUVfVVNFX1NFTEVURV9XRUxGQVJFKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5MSVNUX1VTRVIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgRU1QTE9ZRUVfVVBEQVRFX1JFVElSRU1FTlQoZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KVxyXG4gICAgICAgICAgICBjbGVhckRhdGEoZGF0YSwgKG5ld0RhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5ld0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgICAgICBuZXdEYXRhLmlkID0gZGF0YS5pZFxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobmV3RGF0YSk7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoYC9lbXBsb3llZS91cGRhdGVgLCBuZXdEYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJywgdGV4dDogJ+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDExMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIEVNUExPWUVFX0lOU0VSVChkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdvcGVuRGlhbG9nJyxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICfguJXguYnguK3guIfguIHguLLguKPguJrguLHguJnguJfguLbguIHguILguYnguK3guKHguLnguKXguYPguIrguYjguKvguKPguLfguK3guYTguKHguYggPycsXHJcbiAgICAgICAgICAgICAgICBjb25maXJtZWQ6IChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJEYXRhKGRhdGEsIChuZXdEYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXdEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF4aW9zLnBvc3QoJy4vZW1wbG95ZWUvaW5zZXJ0JywgbmV3RGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguJrguLHguJnguJfguLbguIHguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoQWN0aW9uKCdVU0VSU19MSVNUX0hJU1RPUllfV0VMRkFSRScsICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgnY2xvc2UtcGFuZWwtcmlnaHQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLkxJU1RfVVNFUigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZmlyZSgnYmFja19wYWdlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgnYmFja19wYWdlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgQ0xFQVJfSU5TRVJUKCkge1xyXG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdDTEVBUl9JTlNFUlQnLCBwYXlsb2FkOiB7fSB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIF1cclxuXHJcbiAgICAvLyAuL2VtcGxveWVlL3VzZV93ZWxmYXJlL1xyXG5cclxufVxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9zcmMvcmVkdXgtc3RvcmUvcmVkdWNlci91c2VyV2VsZmFyZS5qc1xuLy8gbW9kdWxlIGlkID0gNjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGF4aW9zIGZyb20gJy4uL2F4aW9zJ1xyXG5pbXBvcnQgeyBjb21tb25BY3Rpb24gfSBmcm9tICcuLi9jb25maWcnXHJcblxyXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XHJcbiAgICBsaXN0czogW10sXHJcbiAgICBzZWxlY3Q6IHt9LFxyXG4gICAgc2VsZWN0X3BlcnNvbmFsX2lkOiB7fSxcclxuICAgIHNlbGVjdF93ZWxlZmFyZXM6IHt9LFxyXG4gICAgc2VsZWN0X3VzZV93ZWxlZmFyZXM6IHsgZGF0ZV91c2U6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdIH0sXHJcbiAgICBkaXNhYmxlZDogdHJ1ZSxcclxuICAgIGluc2VydF92aWV3OiB0cnVlLFxyXG4gICAgbGlzeVVzZXJGYWxzZTogW10sXHJcbiAgICBsaXN5VXNlcmhpc3RvcnlXZWxmYXJlOiBbXSxcclxuICAgIGxpc3RSdnBGdW5kOiBbXSxcclxuICAgIHJ2cF9mdW5kOiBbXVxyXG59XHJcbmNvbnN0IGNsZWFyRGF0YSA9IChkYXRhLCBjYWxsYmFjaykgPT4ge1xyXG5cclxuICAgIGxldCB7IHByZWZpeF9pZCwgZmlyc3RuYW1lLCBsYXN0bmFtZSwgZ2VuZGVyX2lkLCB0eXBlX2VtcGxveWVlX2lkLCBhY3RpdmVfaWQsIHBvc2l0aW9uX2lkLCBtYXRpZXJfaWQsIGFjYWRlbWljX2lkLCBkZXBhcnRtZW50X2lkLCBmYWN1bHR5X2lkLCBlbXBfbm8sIHBlcnNvbmFsX2lkLFxyXG4gICAgICAgIGFjYWRlbWljX25hbWUsIGFjdGl2ZV9uYW1lLCBnZW5kZXJfbmFtZSwgbWF0aWVyX25hbWUsIHBvc2l0aW9uX25hbWUsIHByZWZpeF9uYW1lLCBkZXBhcnRtZW50X25hbWUsIHR5cGVfZW1wbG95ZWVfbmFtZSwgZmFjdWx0eV9uYW1lLCBlbmRfd29ya19kYXRlLCB3b3JrX2FnZSwgYWdlIH0gPSBkYXRhO1xyXG4gICAgbGV0IG5ld0RhdGEgPSB7XHJcbiAgICAgICAgcHJlZml4X2lkLCBmaXJzdG5hbWUsIGxhc3RuYW1lLCBnZW5kZXJfaWQsIHR5cGVfZW1wbG95ZWVfaWQsIGFjdGl2ZV9pZCwgcG9zaXRpb25faWQsIG1hdGllcl9pZCwgYWNhZGVtaWNfaWQsIGRlcGFydG1lbnRfaWQsIGZhY3VsdHlfaWQsIGVtcF9ubywgcGVyc29uYWxfaWQsXHJcbiAgICAgICAgYWNhZGVtaWNfbmFtZSwgYWN0aXZlX25hbWUsIGdlbmRlcl9uYW1lLCBtYXRpZXJfbmFtZSwgcG9zaXRpb25fbmFtZSwgcHJlZml4X25hbWUsIGRlcGFydG1lbnRfbmFtZSwgdHlwZV9lbXBsb3llZV9uYW1lLCBmYWN1bHR5X25hbWUsIGVuZF93b3JrX2RhdGUsIHdvcmtfYWdlLCBhZ2VcclxuICAgIH07Ly8gbmV3RGF0YS5wZXJpb2QgPSBuZXcgQXJyYXkoKTtcclxuICAgIC8vIGRhdGEucGVyaW9kLm1hcCgodGFnKT0+e1xyXG4gICAgLy8gICAgIG5ld0RhdGEucGVyaW9kLnB1c2goe25vOnRhZy5ubyxxdWFsaXR5OnRhZy5xdWFsaXR5fSk7XHJcbiAgICAvLyB9KTtcclxuICAgIGlmIChkYXRhLnN0YXJ0X3dvcmtfZGF0ZSAhPT0gdW5kZWZpbmVkICYmIGRhdGEuc3RhcnRfd29ya19kYXRlICE9PSAnJykge1xyXG4gICAgICAgIG5ld0RhdGEuc3RhcnRfd29ya19kYXRlID0gZGF0YS5zdGFydF93b3JrX2RhdGUgKyAnVDAwOjAwOjAwLjAwMCswNzowMCdcclxuICAgICAgICAvLyAyMDE3LTA2LTA5VDA0OjQ0OjA2LjE2MiswMDowMFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdEYXRhLnN0YXJ0X3dvcmtfZGF0ZSA9IGRhdGEuc3RhcnRfd29ya19kYXRlXHJcbiAgICB9XHJcbiAgICBpZiAoZGF0YS5lbmRfd29ya19kYXRlICE9PSBudWxsICYmIGRhdGEuZW5kX3dvcmtfZGF0ZSAhPT0gJycpIHtcclxuICAgICAgICAvLyBsb2dcclxuICAgICAgICBuZXdEYXRhLmVuZF93b3JrX2RhdGUgPSBkYXRhLmVuZF93b3JrX2RhdGUgKyAnVDAwOjAwOjAwLjAwMCswNzowMCdcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV3RGF0YS5lbmRfd29ya19kYXRlID0gZGF0YS5lbmRfd29ya19kYXRlXHJcbiAgICB9XHJcbiAgICAvLyBjb25zb2xlLmxvZygpO1xyXG4gICAgbmV3RGF0YS5iaXJ0aGRhdGUgPSBkYXRhLmJpcnRoZGF0ZSArICdUMDA6MDA6MDAuMDAwKzA3OjAwJ1xyXG4gICAgY2FsbGJhY2sobmV3RGF0YSlcclxuICAgIC8vIGNhbGxiYWNrKGRhdGEpXHJcbn1cclxuY29uc3QgY2xlYXJEYXRhd2VsZmFyZSA9IChkYXRhLCBjYWxsYmFjaykgPT4ge1xyXG5cclxuICAgIGxldCB7IGJ1ZGdldF9iYWxhbmNlLCBidWRnZXRfY292ZXIsIGJ1ZGdldF91c2UsIGVtcF9pZCwgZ3JvdXBfaWQsIGRlc2NyaXB0aW9uX2RldGFpbCwgXHJcbiAgICAgICAgc3RhdHVzLCB3ZWxmYXJlX2lkLCBkYXRlX3VzZSwgZGF0ZV9hcHByb3ZlLHR5cGVfZ3JvdXAgfSA9IGRhdGE7XHJcbiAgICBsZXQgbmV3RGF0YSA9IHsgYnVkZ2V0X2JhbGFuY2UsIGJ1ZGdldF9jb3ZlciwgYnVkZ2V0X3VzZSwgZW1wX2lkLCBncm91cF9pZCwgZGVzY3JpcHRpb25fZGV0YWlsLCBcclxuICAgICAgICBzdGF0dXMsIHdlbGZhcmVfaWQsIGRhdGVfdXNlLCBkYXRlX2FwcHJvdmUsdHlwZV9ncm91cCB9O1xyXG4gICAgLy8gY29uc29sZS5sb2coZGF0YS5kYXRlL3VzZV93ZWxmYXJlL3VwZGF0ZV91c2UgPT0gJycpO1xyXG5cclxuICAgIG5ld0RhdGEuZG9jdW1lbnRfaWRzID0gbmV3IEFycmF5KClcclxuICAgIGRhdGEuZG9jdW1lbnRfaWRzLm1hcCgoZmlsZSkgPT4ge1xyXG4gICAgICAgIG5ld0RhdGEuZG9jdW1lbnRfaWRzLnB1c2goZmlsZSlcclxuICAgIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZyhuZXdEYXRhKTtcclxuICAgIGNhbGxiYWNrKG5ld0RhdGEpXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZXJzUmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ1VTRVJTX0xJU1QnOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygxKVxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgbGlzdHM6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ1VTRVJfU0VMRUNUJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IHNlbGVjdDogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnVVNFUl9TRUFSQ0hfUEVSU09OQUxfSUQnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgc2VsZWN0X3BlcnNvbmFsX2lkOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdVU0VSX0dFVF9XRUxGQVJFUyc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBzZWxlY3Rfd2VsZWZhcmVzOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdVU0VSX0JUTic6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBkaXNhYmxlZDogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnVVNFUl9JTlNFUlRfVklFVyc6XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBpbnNlcnRfdmlldzogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnVVNFUl9VU0VfU0VMRVRFX1dFTEZBUkUnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgc2VsZWN0X3VzZV93ZWxlZmFyZXM6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ1VTRVJTX0ZBTFNFX0xJU1QnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgbGlzeVVzZXJGYWxzZTogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnVVNFUlNfTElTVF9ISVNUT1JZX1dFTEZBUkUnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgbGlzeVVzZXJoaXN0b3J5V2VsZmFyZTogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnVVNFUl9SVlBfRlVORF9MSVNUJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGxpc3RSdnBGdW5kOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdVU0VSX1JWUF9GVU5EJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IHJ2cF9mdW5kOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2Vyc0FjdGlvbihzdG9yZSkge1xyXG5cclxuICAgIHJldHVybiBbY29tbW9uQWN0aW9uKCksXHJcbiAgICB7XHJcbiAgICAgICAgVVNFUlNfTElTVDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygxKVxyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy4vZW1wbG95ZWUvbGlzdCcpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1VTRVJTX0xJU1QnLCBwYXlsb2FkOiByZXMuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBVU0VSX0lOU0VSVChkYXRhKSB7XHJcbiAgICAgICAgICAgIGNsZWFyRGF0YShkYXRhLCAobmV3RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5wb3N0KGAuL2VtcGxveWVlL2luc2VydGAsIG5ld0RhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5VU0VSU19MSVNUKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJywgdGV4dDogJ+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJCQoJ3BhbmVsLXJpZ2h0JykuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVVNFUl9TRUFSQ0hfUEVSU09OQUxfSUQ6IGZ1bmN0aW9uIChwaWQpIHtcclxuICAgICAgICAgICAgYXhpb3MuZ2V0KGAuL2VtcGxveWVlL3NlYXJjaC8ke3BpZH1gKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMuZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMuZGF0YS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcy5kYXRhLmxlbmd0aCA+IDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdEYXRhID0ge31cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEYXRhID0gcmVzLmRhdGFbMF1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnZXJyb3InLCB0ZXh0OiAn4LmE4Lih4LmI4Lie4Lia4LiC4LmJ4Lit4Lih4LilJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy4kJCgncGFuZWwtcmlnaHQnKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1VTRVJfU0VBUkNIX1BFUlNPTkFMX0lEJywgcGF5bG9hZDogbmV3RGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBVU0VSX1NFTEVDVDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnVVNFUl9TRUxFQ1QnLCBwYXlsb2FkOiBkYXRhIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBVU0VSX0VESVQ6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pXHJcbiAgICAgICAgICAgIGNsZWFyRGF0YShkYXRhLCAobmV3RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgICAgICBuZXdEYXRhLmlkID0gZGF0YS5pZFxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobmV3RGF0YSk7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5wdXQoYC9lbXBsb3llZS91cGRhdGVgLCBuZXdEYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVVNFUl9HRVRfV0VMRkFSRVMobmV3RGF0YS5pZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJywgdGV4dDogJ+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJCQoJ3BhbmVsLXJpZ2h0JykuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBVU0VSX0RFTEVURUQ6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpZClcclxuICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogJ29wZW5EaWFsb2cnLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogJ+C4leC5ieC4reC4h+C4geC4suC4o+C4peC4muC4guC5ieC4reC4oeC4ueC4peC5g+C4iuC5iOC4q+C4o+C4t+C4reC5hOC4oeC5iCA/JyxcclxuICAgICAgICAgICAgICAgIGNvbmZpcm1lZDogKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlvcy5kZWxldGUoYC4vZW1wbG95ZWUvZGVsZXRlLyR7aWR9YClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5VU0VSU19MSVNUKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguKXguJrguILguYnguK3guKHguLnguKXguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kJCgncGFuZWwtcmlnaHQnKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBVU0VSX0JUTihkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpXHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1VTRVJfQlROJywgcGF5bG9hZDogZGF0YSB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVVNFUl9JTlNFUlRfVklFVyhkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpXHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1VTRVJfSU5TRVJUX1ZJRVcnLCBwYXlsb2FkOiBkYXRhIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBVU0VSX0dFVF9XRUxGQVJFUyhpZCwgb3RoZXJGdW5jdGlvbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvdGhlckZ1bmN0aW9uY2RkZGQnLCB5ZWFyKVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0eXBlb2YgaWQgKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBpZCAhPT0gJ3VuZGVmaW5lZCcgJiYgaWQgIT09ICd1bmRlZmluZWQnICYmIGlkICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgICAgICBheGlvcy5nZXQoYC4vZW1wbG95ZWUvJHtpZH1gKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4LmC4Lir4Lil4LiU4LiC4LmJ4Lit4Lih4Li54Lil4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnVVNFUl9HRVRfV0VMRkFSRVMnLCBwYXlsb2FkOiByZXMuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3RoZXJGdW5jdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kJCgncGFuZWwtcmlnaHQnKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIFVTRVJfVVNFX1dFTEZBUkUoZGF0YSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgY2xlYXJEYXRhd2VsZmFyZShkYXRhLCAobmV3RGF0YSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gbmV3RGF0YS5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYXhpb3MucG9zdChgLi9oaXN0b3J5L3JlcXVlc3QvYCwgbmV3RGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlVTRVJfR0VUX1dFTEZBUkVTKG5ld0RhdGEuZW1wX2lkLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy4kJCgncGFuZWwtcmlnaHQnKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuJCQoJyN3ZWxmYXJlX2J1ZGdldCcpLmNsb3NlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVVNFUl9VU0VfV0VMRkFSRV9BUFBST1ZFKGRhdGEsIHVybCA9ICgpID0+IHsgfSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgIC8vIGxldCBteUZpcnN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIGxldCBuZXdEYXRhID0gZGF0YS5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgY2xlYXJEYXRhd2VsZmFyZShkYXRhLCAobmV3RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaXRlbSA9IG5ld0RhdGFcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuIGl0ZW1cclxuICAgICAgICAgICAgICAgIC8vICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHJlc29sdmUobmV3RGF0YSlcclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gbXlGaXJzdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKGVsKTtcclxuICAgICAgICAgICAgICAgIGF4aW9zLnB1dChgLi9oaXN0b3J5L3VwZGF0ZS9hcHByb3ZlYCwgZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZGlzcGF0Y2hBY3Rpb24oJ1VTRVJTX0ZBTFNFX0xJU1QnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codXJsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cmwoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVVNFUl9SRUpFQ1RfVVNFX1dFTEZBUkUoZGF0YSwgdXJsID0gKCkgPT4geyB9KSB7XHJcbiAgICAgICAgICAgIC8vIGNsZWFyRGF0YXdlbGZhcmUoZGF0YSwgKG5ld0RhdGEpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIG5ld0RhdGEuaWQgPSBkYXRhLmlkO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGF4aW9zLnB1dChgLi9oaXN0b3J5L3VwZGF0ZS9yZWplY3RgLCBkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmRpc3BhdGNoQWN0aW9uKCdVU0VSU19GQUxTRV9MSVNUJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coMTExMTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIC8vICB0aGlzLmZpcmUoJ3RvYXN0Jyx7XHJcbiAgICAgICAgICAgIC8vICAgICBzdGF0dXM6J29wZW5EaWFsb2cnLFxyXG4gICAgICAgICAgICAvLyAgICAgdGV4dDon4LiV4LmJ4Lit4LiH4LiB4Liy4Lij4Lil4Lia4LiC4LmJ4Lit4Lih4Li54Lil4LmD4LiK4LmI4Lir4Lij4Li34Lit4LmE4Lih4LmIID8nLFxyXG4gICAgICAgICAgICAvLyAgICAgY29uZmlybWVkOihyZXN1bHQpPT57XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYocmVzdWx0ID09IHRydWUpe1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBheGlvcy5kZWxldGUoYC4vZW1wbG95ZWUvdXNlX3dlbGZhcmUvZGVsZXRlL2lkLyR7aWR9YClcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgLnRoZW4ocmVzPT57XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoQWN0aW9uKCdVU0VSU19GQUxTRV9MSVNUJyk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jyx7c3RhdHVzOidzdWNjZXNzJyx0ZXh0OifguKXguJrguILguYnguK3guKHguLnguKXguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOigpPT57XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuJCQoJ3BhbmVsLXJpZ2h0JykuY2xvc2UoKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBVU0VSX0NBTkNFTF9VU0VfV0VMRkFSRShkYXRhLCB1cmwgPSAoKSA9PiB7IH0pIHtcclxuICAgICAgICAgICAgLy8gY2xlYXJEYXRhd2VsZmFyZShkYXRhLCAobmV3RGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgbmV3RGF0YS5pZCA9IGRhdGEuaWQ7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gYXhpb3MucHV0KGAuL2hpc3RvcnkvdXBkYXRlL2NhbmNlbGAsIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZGlzcGF0Y2hBY3Rpb24oJ1VTRVJTX0ZBTFNFX0xJU1QnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygxMTExMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsIHRleHQ6ICfguJrguLHguJnguJfguLbguIHguKrguLPguYDguKPguYfguIgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXJsKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVVNFUl9VU0VfU0VMRVRFX1dFTEZBUkUoZGF0YSkge1xyXG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdVU0VSX1VTRV9TRUxFVEVfV0VMRkFSRScsIHBheWxvYWQ6IGRhdGEgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIFVTRVJTX0ZBTFNFX0xJU1QoZGF0YSA9ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7IHN0YXR1czogJ2xvYWQnIH0pO1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoYC4vaGlzdG9yeS91bmFwcHJvdmU/YCArIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJywgdGV4dDogJ+C5guC4q+C4peC4lOC4guC5ieC4reC4oeC4ueC4peC4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdVU0VSU19GQUxTRV9MSVNUJywgcGF5bG9hZDogcmVzLmRhdGEgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKCFvdGhlckZ1bmN0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuJCQoJ3BhbmVsLXJpZ2h0Jykub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBVU0VSU19MSVNUX0hJU1RPUllfV0VMRkFSRShkYXRhID0gJycpIHtcclxuXHJcbiAgICAgICAgICAgIGF4aW9zLmdldChgLi9oaXN0b3J5L3NlYXJjaD9gICsgZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdVU0VSU19MSVNUX0hJU1RPUllfV0VMRkFSRScsIHBheWxvYWQ6IHJlcy5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBVU0VSX1JWUF9GVU5EKHBpZCkge1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoYC4vcnZkL3NpZ251cC9waWQvJHtwaWR9YClcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1VTRVJfUlZQX0ZVTkQnLCBwYXlsb2FkOiByZXMuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVVNFUl9SVlBfU0lHTlVQKGRhdGEsIHBpZCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KVxyXG4gICAgICAgICAgICBheGlvcy5wb3N0KGAuL3J2ZC9zaWdudXAvYCwgZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLmluc2VydF9zdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJywgdGV4dDogJ+C4quC4oeC4seC4hOC4o+C4quC4s+C5gOC4o+C5h+C4iCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hBY3Rpb24oJ1VTRVJfUlZQX0ZVTkQnLCBwaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ2Vycm9yJywgdGV4dDogJ+C5hOC4oeC5iOC4quC4suC4oeC4suC4o+C4luC4quC4oeC4seC4hOC4o+C5hOC4lOC5iScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVVNFUl9SVlBfTEVBVkVfRlVORChmaWQsIHBpZCkge1xyXG4gICAgICAgICAgICBheGlvcy5wdXQoYC4vcnZkL3NpZ251cC9sZWF2ZS9gLCBmaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4Lia4Lix4LiZ4LiX4Li24LiB4Liq4Liz4LmA4Lij4LmH4LiIJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hBY3Rpb24oJ1VTRVJfUlZQX0ZVTkQnLCBwaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBVU0VSX1JWUF9GVU5EX09VVChmaWQsIHBpZCkge1xyXG4gICAgICAgICAgICBheGlvcy5wdXQoYC4vcnZkL3NpZ251cC9mdW5kL291dC9gLCBmaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoQWN0aW9uKCdVU0VSX1JWUF9GVU5EJywgcGlkKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgXVxyXG5cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9yZWR1Y2VyL3VzZXJzLmpzXG4vLyBtb2R1bGUgaWQgPSA3MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgYXhpb3MgZnJvbSAnLi4vYXhpb3MnXHJcbmltcG9ydCB7IGNvbW1vbkFjdGlvbiB9IGZyb20gJy4uL2NvbmZpZydcclxuXHJcbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcclxuICAgIGxpc3Q6IFtdLFxyXG4gICAgc2VsZWN0OiB7fSxcclxuICAgIGxpc3RfaWQ6IFtdLFxyXG4gICAgZGF0YVNlbGVjdDoge1xyXG4gICAgICAgIGNvbmRpdGlvbjogW11cclxuICAgIH0sXHJcbiAgICBjb25kaXRpb246IFtdLFxyXG4gICAgZW1wbG95ZWVzOiBbXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd2VsZmFyZVJlZHVjZXIoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikge1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdXRUxGQVJFX0xJU1QnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgbGlzdDogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnV0VMRkFSRV9MSVNUX0lEJzpcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGxpc3RfaWQ6IGFjdGlvbi5wYXlsb2FkIH0pO1xyXG4gICAgICAgIGNhc2UgJ1dFTEZBUkVfREFUQV9TRUxFQ1QnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgZGF0YVNlbGVjdDogYWN0aW9uLnBheWxvYWQgfSk7XHJcbiAgICAgICAgY2FzZSAnQ09ORElUSU9OX0xJU1QnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgY29uZGl0aW9uOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBjYXNlICdXRUxGQVJFX0xJU1RfRU1QTE9ZRUUnOlxyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgZW1wbG95ZWVzOiBhY3Rpb24ucGF5bG9hZCB9KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3ZWxmYXJlQWN0aW9uKHN0b3JlKSB7XHJcblxyXG4gICAgcmV0dXJuIFtjb21tb25BY3Rpb24oKSxcclxuICAgIHtcclxuICAgICAgICBXRUxGQVJFX0xJU1Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXhpb3MuZ2V0KCcvd2VsZmFyZScpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1dFTEZBUkVfTElTVCcsIHBheWxvYWQ6IHJlc3VsdC5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIFdFTEZBUkVfTElTVF9JRDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgYXhpb3MuZ2V0KCcvd2VsZmFyZS8nICsgZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnKicsIHJlc3VsdC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdXRUxGQVJFX0xJU1RfSUQnLCBwYXlsb2FkOiByZXN1bHQuZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBXRUxGQVJFX0lOU0VSVDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0JywgeyBzdGF0dXM6ICdsb2FkJyB9KTtcclxuICAgICAgICAgICAgYXhpb3MucG9zdChgLi93ZWxmYXJlL2luc2VydGAsIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJywgdGV4dDogJ+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5MSVNUX1dFTEZBUkVfSUQoZGF0YS5ncm91cF9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3JlZnJlc2hfZ3JvdXAnLCB5ZWFyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBXRUxGQVJFX0RFTEVURTogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGF4aW9zLmRlbGV0ZShgLi93ZWxmYXJlL2RlbGV0ZS9pZC9gICsgZGF0YS5pZClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgndG9hc3QnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLCB0ZXh0OiAn4Lil4Lia4Liq4Liz4LmA4Lij4LmH4LiIJywgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkxJU1RfV0VMRkFSRV9JRChkYXRhLmdyb3VwX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBXRUxGQVJFX0VESVQ6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlKCd0b2FzdCcsIHsgc3RhdHVzOiAnbG9hZCcgfSk7XHJcbiAgICAgICAgICAgIGF4aW9zLnB1dChgLi93ZWxmYXJlL3VwZGF0ZWAsIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3RvYXN0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJywgdGV4dDogJ+C4muC4seC4meC4l+C4tuC4geC4quC4s+C5gOC4o+C5h+C4iCcsIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5XRUxGQVJFX0RBVEFfU0VMRUNUKGRhdGEuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5MSVNUX1dFTEZBUkVfSUQoZGF0YS5ncm91cF9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ3JlZnJlc2hfZ3JvdXAnLCB5ZWFyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBXRUxGQVJFX0RBVEFfU0VMRUNUOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuV0VMRkFSRV9EQVRBX1NFTEVDVF9DTEVBUigpO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmlkID0gdmFsXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0b3JlLmdldFN0YXRlKCkud2VsZmFyZS5jb25kaXRpb24pO1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy93ZWxmYXJlLycgKyB2YWwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiKlwiLHJlc3VsdC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3VsdC5kYXRhLmNvbmRpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29uZGl0aW9uID0gc3RvcmUuZ2V0U3RhdGUoKS53ZWxmYXJlLmNvbmRpdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVzZSA9IGRhdGEubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmZpZWxkXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh1c2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlmZiA9IGNvbmRpdGlvbi5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVzZS5pbmRleE9mKGl0ZW0uaWQpIDwgMDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRpZmYpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBjb25kaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb25bal0uaWQgPT0gZGF0YVtpXS5maWVsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaV0uZmllbGQgPSBjb25kaXRpb25bal1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGRpZmYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEucHVzaChkaWZmW2pdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhLnB1c2goZGF0YVtpXS5maWVsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldLml0ZW1GaWVsZCA9IGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuc2V0KCdkYXRhLmNvbmRpdGlvbi4nICsgaSArICcuaXRlbUZpZWxkJywgYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdC5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnV0VMRkFSRV9EQVRBX1NFTEVDVCcsIHBheWxvYWQ6IHJlc3VsdC5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIFdFTEZBUkVfREFUQV9TRUxFQ1RfQ0xFQVI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiAnV0VMRkFSRV9EQVRBX1NFTEVDVCcsIHBheWxvYWQ6IHsgY29uZGl0aW9uOiBbXSB9IH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBDT05ESVRJT05fTElTVDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBheGlvcy5nZXQoJy9jb25kaXRpb25zL2xpc3QnKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6ICdDT05ESVRJT05fTElTVCcsIHBheWxvYWQ6IHJlc3VsdC5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIFdFTEZBUkVfTElTVF9FTVBMT1lFRTogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGlkKTtcclxuICAgICAgICAgICAgYXhpb3MuZ2V0KCcvd2VsZmFyZS9lbXBsb3llZS8nICsgaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1dFTEZBUkVfTElTVF9FTVBMT1lFRScsIHBheWxvYWQ6IHJlc3VsdC5kYXRhIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBdXHJcblxyXG59XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL3NyYy9yZWR1eC1zdG9yZS9yZWR1Y2VyL3dlbGZhcmUuanNcbi8vIG1vZHVsZSBpZCA9IDcxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=