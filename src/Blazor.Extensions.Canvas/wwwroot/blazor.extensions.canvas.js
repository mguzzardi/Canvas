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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/InitializeCanvas.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/CanvasContextManager.ts":
/*!*************************************!*\
  !*** ./src/CanvasContextManager.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ContextManager {
    constructor(contextName) {
        this.contexts = new Map();
        this.webGLObject = new Array();
        this.imageDataBuffer = new Array();
        this.webGLContext = false;
        this.webGLTypes = [
            WebGLBuffer, WebGLShader, WebGLProgram, WebGLFramebuffer, WebGLRenderbuffer, WebGLTexture, WebGLUniformLocation
        ];
        this.add = (canvas, parameters) => {
            if (!canvas)
                throw new Error('Invalid canvas.');
            if (this.contexts.get(canvas.id))
                return;
            var context;
            if (parameters)
                context = canvas.getContext(this.contextName, parameters);
            else
                context = canvas.getContext(this.contextName);
            if (!context)
                throw new Error('Invalid context.');
            this.contexts.set(canvas.id, context);
        };
        this.remove = (canvas) => {
            this.contexts.delete(canvas.id);
        };
        this.setProperty = (canvas, property, value) => {
            const context = this.getContext(canvas);
            this.setPropertyWithContext(context, property, value);
        };
        this.getProperty = (canvas, property) => {
            const context = this.getContext(canvas);
            return this.serialize(context[property]);
        };
        this.call = (canvas, method, args) => {
            const context = this.getContext(canvas);
            return this.callWithContext(context, method, args);
        };
        this.callBatch = (canvas, batchedCalls) => {
            const context = this.getContext(canvas);
            for (let i = 0; i < batchedCalls.length; i++) {
                let params = batchedCalls[i].slice(2);
                if (batchedCalls[i][1]) {
                    this.callWithContext(context, batchedCalls[i][0], params);
                }
                else {
                    this.setPropertyWithContext(context, batchedCalls[i][0], Array.isArray(params) && params.length > 0 ? params[0] : null);
                }
            }
        };
        this.callWithContext = (context, method, args) => {
            return this.serialize(this.prototypes[method].apply(context, args != undefined ? args.map((value) => this.deserialize(method, value)) : []));
        };
        this.setPropertyWithContext = (context, property, value) => {
            context[property] = this.deserialize(property, value);
        };
        this.getContext = (canvas) => {
            if (!canvas)
                throw new Error('Invalid canvas.');
            const context = this.contexts.get(canvas.id);
            if (!context)
                throw new Error('Invalid context.');
            return context;
        };
        this.deserialize = (method, object) => {
            if (method === "putImageData" && object.data != undefined) {
                let newImageData = new ImageData(Uint8ClampedArray.from(object.data), object.width, object.height);
                return newImageData;
            }
            if (!this.webGLContext || object == undefined)
                return object;
            if (object.hasOwnProperty("webGLType") && object.hasOwnProperty("id")) {
                return (this.webGLObject[object["id"]]);
            }
            else if (Array.isArray(object) && !method.endsWith("v")) {
                return Int8Array.of(...object);
            }
            else if (typeof (object) === "string" && (method === "bufferData" || method === "bufferSubData")) {
                let binStr = window.atob(object);
                let length = binStr.length;
                let bytes = new Uint8Array(length);
                for (var i = 0; i < length; i++) {
                    bytes[i] = binStr.charCodeAt(i);
                }
                return bytes;
            }
            else
                return object;
        };
        this.serialize = (object) => {
            if (object instanceof TextMetrics) {
                return { width: object.width };
            }
            if (object instanceof ImageData) {
                return {
                    width: object.width,
                    height: object.height,
                    data: Object.assign([], object.data)
                };
            }
            if (!this.webGLContext || object == undefined)
                return object;
            const type = this.webGLTypes.find((type) => object instanceof type);
            if (type != undefined) {
                const id = this.webGLObject.length;
                this.webGLObject.push(object);
                return {
                    webGLType: type.name,
                    id: id
                };
            }
            else
                return object;
        };
        this.contextName = contextName;
        if (contextName === "2d")
            this.prototypes = CanvasRenderingContext2D.prototype;
        else if (contextName === "webgl" || contextName === "experimental-webgl") {
            this.prototypes = WebGLRenderingContext.prototype;
            this.webGLContext = true;
        }
        else
            throw new Error(`Invalid context name: ${contextName}`);
    }
}
exports.ContextManager = ContextManager;


/***/ }),

/***/ "./src/InitializeCanvas.ts":
/*!*********************************!*\
  !*** ./src/InitializeCanvas.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CanvasContextManager_1 = __webpack_require__(/*! ./CanvasContextManager */ "./src/CanvasContextManager.ts");
var Canvas;
(function (Canvas) {
    const blazorExtensions = 'BlazorExtensions';
    const extensionObject = {
        Canvas2d: new CanvasContextManager_1.ContextManager("2d"),
        WebGL: new CanvasContextManager_1.ContextManager("webgl")
    };
    function initialize() {
        if (typeof window !== 'undefined' && !window[blazorExtensions]) {
            window[blazorExtensions] = Object.assign({}, extensionObject);
        }
        else {
            window[blazorExtensions] = Object.assign(Object.assign({}, window[blazorExtensions]), extensionObject);
        }
    }
    Canvas.initialize = initialize;
})(Canvas || (Canvas = {}));
Canvas.initialize();


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NhbnZhc0NvbnRleHRNYW5hZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9Jbml0aWFsaXplQ2FudmFzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQSxNQUFhLGNBQWM7SUFXekIsWUFBbUIsV0FBbUI7UUFWckIsYUFBUSxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7UUFDbEMsZ0JBQVcsR0FBRyxJQUFJLEtBQUssRUFBTyxDQUFDO1FBQy9CLG9CQUFlLEdBQUcsSUFBSSxLQUFLLEVBQU8sQ0FBQztRQUU1QyxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUVaLGVBQVUsR0FBRztZQUM1QixXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxZ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VyxLQUFLLE9BQU8sSUFBSSxXQUFXLEtBQUssb0JBQW9CLEVBQUU7WUFDeEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQyxTQUFTLENBQUM7WUFDbEQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDMUI7O1lBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDO0NBc0hGO0FBMUlELHdDQTBJQzs7Ozs7Ozs7Ozs7Ozs7O0FDMUlELGtIQUF3RDtBQUV4RCxJQUFVLE1BQU0sQ0FzQmY7QUF0QkQsV0FBVSxNQUFNO0lBQ2QsTUFBTSxnQkFBZ0IsR0FBVyxrQkFBa0IsQ0FBQztJQUVwRCxNQUFNLGVBQWUsR0FBRztRQUN0QixRQUFRLEVBQUUsSUFBSSxxQ0FBYyxDQUFDLElBQUksQ0FBQztRQUNsQyxLQUFLLEVBQUUsSUFBSSxxQ0FBYyxDQUFDLE9BQU8sQ0FBQztLQUNuQyxDQUFDO0lBRUYsU0FBZ0IsVUFBVTtRQUN4QixJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBRzlELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFDbkIsZUFBZSxDQUNuQixDQUFDO1NBQ0g7YUFBTTtZQUNMLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxtQ0FDbkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQ3hCLGVBQWUsQ0FDbkIsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQWJlLGlCQUFVLGFBYXpCO0FBQ0gsQ0FBQyxFQXRCUyxNQUFNLEtBQU4sTUFBTSxRQXNCZjtBQUVELE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyIsImZpbGUiOiJibGF6b3IuZXh0ZW5zaW9ucy5jYW52YXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9Jbml0aWFsaXplQ2FudmFzLnRzXCIpO1xuIiwiZXhwb3J0IGNsYXNzIENvbnRleHRNYW5hZ2VyIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IGNvbnRleHRzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcclxuICBwcml2YXRlIHJlYWRvbmx5IHdlYkdMT2JqZWN0ID0gbmV3IEFycmF5PGFueT4oKTtcclxuICBwcml2YXRlIHJlYWRvbmx5IGltYWdlRGF0YUJ1ZmZlciA9IG5ldyBBcnJheTxhbnk+KCk7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBjb250ZXh0TmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgd2ViR0xDb250ZXh0ID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBwcm90b3R5cGVzOiBhbnk7XHJcbiAgcHJpdmF0ZSByZWFkb25seSB3ZWJHTFR5cGVzID0gW1xyXG4gICAgV2ViR0xCdWZmZXIsIFdlYkdMU2hhZGVyLCBXZWJHTFByb2dyYW0sIFdlYkdMRnJhbWVidWZmZXIsIFdlYkdMUmVuZGVyYnVmZmVyLCBXZWJHTFRleHR1cmUsIFdlYkdMVW5pZm9ybUxvY2F0aW9uXHJcbiAgXTtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGNvbnRleHROYW1lOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuY29udGV4dE5hbWUgPSBjb250ZXh0TmFtZTtcclxuICAgIGlmIChjb250ZXh0TmFtZSA9PT0gXCIyZFwiKVxyXG4gICAgICB0aGlzLnByb3RvdHlwZXMgPSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlO1xyXG4gICAgZWxzZSBpZiAoY29udGV4dE5hbWUgPT09IFwid2ViZ2xcIiB8fCBjb250ZXh0TmFtZSA9PT0gXCJleHBlcmltZW50YWwtd2ViZ2xcIikge1xyXG4gICAgICB0aGlzLnByb3RvdHlwZXMgPSBXZWJHTFJlbmRlcmluZ0NvbnRleHQucHJvdG90eXBlO1xyXG4gICAgICB0aGlzLndlYkdMQ29udGV4dCA9IHRydWU7XHJcbiAgICB9IGVsc2VcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNvbnRleHQgbmFtZTogJHtjb250ZXh0TmFtZX1gKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGQgPSAoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgcGFyYW1ldGVyczogYW55KSA9PiB7XHJcbiAgICBpZiAoIWNhbnZhcykgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNhbnZhcy4nKTtcclxuICAgIGlmICh0aGlzLmNvbnRleHRzLmdldChjYW52YXMuaWQpKSByZXR1cm47XHJcblxyXG4gICAgdmFyIGNvbnRleHQ7XHJcbiAgICBpZiAocGFyYW1ldGVycylcclxuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KHRoaXMuY29udGV4dE5hbWUsIHBhcmFtZXRlcnMpO1xyXG4gICAgZWxzZVxyXG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQodGhpcy5jb250ZXh0TmFtZSk7XHJcblxyXG4gICAgaWYgKCFjb250ZXh0KSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29udGV4dC4nKTtcclxuXHJcbiAgICB0aGlzLmNvbnRleHRzLnNldChjYW52YXMuaWQsIGNvbnRleHQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZSA9IChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSA9PiB7XHJcbiAgICB0aGlzLmNvbnRleHRzLmRlbGV0ZShjYW52YXMuaWQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldFByb3BlcnR5ID0gKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHtcclxuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmdldENvbnRleHQoY2FudmFzKTtcclxuICAgIHRoaXMuc2V0UHJvcGVydHlXaXRoQ29udGV4dChjb250ZXh0LCBwcm9wZXJ0eSwgdmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldFByb3BlcnR5ID0gKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHByb3BlcnR5OiBzdHJpbmcpID0+IHtcclxuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmdldENvbnRleHQoY2FudmFzKTtcclxuICAgIHJldHVybiB0aGlzLnNlcmlhbGl6ZShjb250ZXh0W3Byb3BlcnR5XSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2FsbCA9IChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBtZXRob2Q6IHN0cmluZywgYXJnczogYW55KSA9PiB7XHJcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5nZXRDb250ZXh0KGNhbnZhcyk7XHJcbiAgICByZXR1cm4gdGhpcy5jYWxsV2l0aENvbnRleHQoY29udGV4dCwgbWV0aG9kLCBhcmdzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjYWxsQmF0Y2ggPSAoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgYmF0Y2hlZENhbGxzOiBhbnlbXVtdKSA9PiB7XHJcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5nZXRDb250ZXh0KGNhbnZhcyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJhdGNoZWRDYWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgcGFyYW1zID0gYmF0Y2hlZENhbGxzW2ldLnNsaWNlKDIpO1xyXG4gICAgICBpZiAoYmF0Y2hlZENhbGxzW2ldWzFdKSB7XHJcbiAgICAgICAgdGhpcy5jYWxsV2l0aENvbnRleHQoY29udGV4dCwgYmF0Y2hlZENhbGxzW2ldWzBdLCBwYXJhbXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0UHJvcGVydHlXaXRoQ29udGV4dChcclxuICAgICAgICAgIGNvbnRleHQsXHJcbiAgICAgICAgICBiYXRjaGVkQ2FsbHNbaV1bMF0sXHJcbiAgICAgICAgICBBcnJheS5pc0FycmF5KHBhcmFtcykgJiYgcGFyYW1zLmxlbmd0aCA+IDAgPyBwYXJhbXNbMF0gOiBudWxsKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWxsV2l0aENvbnRleHQgPSAoY29udGV4dDogYW55LCBtZXRob2Q6IHN0cmluZywgYXJnczogYW55KSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5zZXJpYWxpemUodGhpcy5wcm90b3R5cGVzW21ldGhvZF0uYXBwbHkoY29udGV4dCwgYXJncyAhPSB1bmRlZmluZWQgPyBhcmdzLm1hcCgodmFsdWUpID0+IHRoaXMuZGVzZXJpYWxpemUobWV0aG9kLCB2YWx1ZSkpIDogW10pKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0UHJvcGVydHlXaXRoQ29udGV4dCA9IChjb250ZXh0OiBhbnksIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHtcclxuICAgIGNvbnRleHRbcHJvcGVydHldID0gdGhpcy5kZXNlcmlhbGl6ZShwcm9wZXJ0eSwgdmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRDb250ZXh0ID0gKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpID0+IHtcclxuICAgIGlmICghY2FudmFzKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY2FudmFzLicpO1xyXG5cclxuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmNvbnRleHRzLmdldChjYW52YXMuaWQpO1xyXG4gICAgaWYgKCFjb250ZXh0KSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29udGV4dC4nKTtcclxuXHJcbiAgICByZXR1cm4gY29udGV4dDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZGVzZXJpYWxpemUgPSAobWV0aG9kOiBzdHJpbmcsIG9iamVjdDogYW55KSA9PiB7XHJcbiAgICBpZiAobWV0aG9kID09PSBcInB1dEltYWdlRGF0YVwiICYmIG9iamVjdC5kYXRhICE9IHVuZGVmaW5lZCAgKSB7XHJcbiAgICAgIGxldCBuZXdJbWFnZURhdGEgPSBuZXcgSW1hZ2VEYXRhKFVpbnQ4Q2xhbXBlZEFycmF5LmZyb20ob2JqZWN0LmRhdGEpLCBvYmplY3Qud2lkdGgsIG9iamVjdC5oZWlnaHQpO1xyXG4gICAgICByZXR1cm4gbmV3SW1hZ2VEYXRhOyBcclxuICAgIH1cclxuICAgIGlmICghdGhpcy53ZWJHTENvbnRleHQgfHwgb2JqZWN0ID09IHVuZGVmaW5lZCkgcmV0dXJuIG9iamVjdDsgLy9kZXNlcmlhbGl6YXRpb24gb25seSBuZWVkcyB0byBoYXBwZW4gZm9yIHdlYkdMXHJcblxyXG4gICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShcIndlYkdMVHlwZVwiKSAmJiBvYmplY3QuaGFzT3duUHJvcGVydHkoXCJpZFwiKSkge1xyXG4gICAgICByZXR1cm4gKHRoaXMud2ViR0xPYmplY3Rbb2JqZWN0W1wiaWRcIl1dKTtcclxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpICYmICFtZXRob2QuZW5kc1dpdGgoXCJ2XCIpKSB7XHJcbiAgICAgIHJldHVybiBJbnQ4QXJyYXkub2YoLi4uKG9iamVjdCBhcyBudW1iZXJbXSkpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2Yob2JqZWN0KSA9PT0gXCJzdHJpbmdcIiAmJiAobWV0aG9kID09PSBcImJ1ZmZlckRhdGFcIiB8fCBtZXRob2QgPT09IFwiYnVmZmVyU3ViRGF0YVwiKSkge1xyXG4gICAgICBsZXQgYmluU3RyID0gd2luZG93LmF0b2Iob2JqZWN0KTtcclxuICAgICAgbGV0IGxlbmd0aCA9IGJpblN0ci5sZW5ndGg7XHJcbiAgICAgIGxldCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbmd0aCk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGJ5dGVzW2ldID0gYmluU3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGJ5dGVzO1xyXG4gICAgfSBlbHNlXHJcbiAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlcmlhbGl6ZSA9IChvYmplY3Q6IGFueSkgPT4ge1xyXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIFRleHRNZXRyaWNzKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgd2lkdGg6IG9iamVjdC53aWR0aCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEltYWdlRGF0YSkge1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcclxuICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKFtdLCBvYmplY3QuZGF0YSlcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMud2ViR0xDb250ZXh0IHx8IG9iamVjdCA9PSB1bmRlZmluZWQpIHJldHVybiBvYmplY3Q7IC8vc2VyaWFsaXphdGlvbiBvbmx5IG5lZWRzIHRvIGhhcHBlbiBmb3Igd2ViR0xcclxuXHJcbiAgICBjb25zdCB0eXBlID0gdGhpcy53ZWJHTFR5cGVzLmZpbmQoKHR5cGUpID0+IG9iamVjdCBpbnN0YW5jZW9mIHR5cGUpO1xyXG4gICAgaWYgKHR5cGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGNvbnN0IGlkID0gdGhpcy53ZWJHTE9iamVjdC5sZW5ndGg7XHJcbiAgICAgIHRoaXMud2ViR0xPYmplY3QucHVzaChvYmplY3QpO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB3ZWJHTFR5cGU6IHR5cGUubmFtZSxcclxuICAgICAgICBpZDogaWRcclxuICAgICAgICB9O1xyXG4gICAgfSBlbHNlXHJcbiAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbnRleHRNYW5hZ2VyIH0gZnJvbSAnLi9DYW52YXNDb250ZXh0TWFuYWdlcic7XHJcblxyXG5uYW1lc3BhY2UgQ2FudmFzIHtcclxuICBjb25zdCBibGF6b3JFeHRlbnNpb25zOiBzdHJpbmcgPSAnQmxhem9yRXh0ZW5zaW9ucyc7XHJcbiAgLy8gZGVmaW5lIHdoYXQgdGhpcyBleHRlbnNpb24gYWRkcyB0byB0aGUgd2luZG93IG9iamVjdCBpbnNpZGUgQmxhem9yRXh0ZW5zaW9uc1xyXG4gIGNvbnN0IGV4dGVuc2lvbk9iamVjdCA9IHtcclxuICAgIENhbnZhczJkOiBuZXcgQ29udGV4dE1hbmFnZXIoXCIyZFwiKSxcclxuICAgIFdlYkdMOiBuZXcgQ29udGV4dE1hbmFnZXIoXCJ3ZWJnbFwiKVxyXG4gIH07XHJcblxyXG4gIGV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplKCk6IHZvaWQge1xyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICF3aW5kb3dbYmxhem9yRXh0ZW5zaW9uc10pIHtcclxuICAgICAgLy8gd2hlbiB0aGUgbGlicmFyeSBpcyBsb2FkZWQgaW4gYSBicm93c2VyIHZpYSBhIDxzY3JpcHQ+IGVsZW1lbnQsIG1ha2UgdGhlXHJcbiAgICAgIC8vIGZvbGxvd2luZyBBUElzIGF2YWlsYWJsZSBpbiBnbG9iYWwgc2NvcGUgZm9yIGludm9jYXRpb24gZnJvbSBKU1xyXG4gICAgICB3aW5kb3dbYmxhem9yRXh0ZW5zaW9uc10gPSB7XHJcbiAgICAgICAgLi4uZXh0ZW5zaW9uT2JqZWN0XHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3aW5kb3dbYmxhem9yRXh0ZW5zaW9uc10gPSB7XHJcbiAgICAgICAgLi4ud2luZG93W2JsYXpvckV4dGVuc2lvbnNdLFxyXG4gICAgICAgIC4uLmV4dGVuc2lvbk9iamVjdFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuQ2FudmFzLmluaXRpYWxpemUoKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==