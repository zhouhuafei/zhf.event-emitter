'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (name, factory) {
    if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined') {
        // nodejs - commonjs canon
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // requirejs - amd canon
        define(factory);
    } else if (window) {
        // window - browser canon
        if (Object.prototype.toString.call(window.zhf).slice(8, -1).toLowerCase() !== 'object') {
            window.zhf = {};
        }
        window.zhf[name] = factory();
    }
})('EventEmitter', function () {
    var EventEmitter = function () {
        function EventEmitter() {
            _classCallCheck(this, EventEmitter);

            this.event = {};
            this.eventOne = {};
        }

        _createClass(EventEmitter, [{
            key: '_bind',
            value: function _bind(str, fn) {
                var minNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
                var event = arguments[3];

                var arr = event[str];
                if (!arr) {
                    arr = [];
                    event[str] = arr;
                }
                arr.push({
                    isDel: false, // 是否取消了这个函数的订阅
                    minNum: minNum, // 至少触发几次才会发布订阅
                    triggerNum: 0, // 目前触发了几次
                    fn: fn // 订阅的函数
                });
            }
        }, {
            key: '_cancel',
            value: function _cancel(str, num, event) {
                var arr = event[str];
                if (arr) {
                    if (num && num >= 1) {
                        arr[num - 1].isDel = true;
                        // 取消了全部
                        if (this._isCancelAll(arr) === true) {
                            arr.length = 0;
                        }
                    } else {
                        arr.length = 0;
                    }
                }
            }
        }, {
            key: '_isCancelAll',
            value: function _isCancelAll(arr) {
                var isCancelAll = true;
                for (var i = 0; i < arr.length; i++) {
                    var json = arr[i];
                    delete json.fn.nowNum;
                    if (json.isDel === false) {
                        isCancelAll = false;
                    }
                }
                return isCancelAll;
            }
        }, {
            key: '_cancelAll',
            value: function _cancelAll(event) {
                Object.keys(event).forEach(function (key) {
                    event[key].length = 0;
                });
            }
        }, {
            key: '_trigger',
            value: function _trigger(str, data, cb, event, type) {
                var arr = event[str];
                if (arr) {
                    if (!arr.allData) {
                        arr.allData = []; // 添加了这个allData属性，以后再循环obj，请使用普通的for循环或者forEach循环，否则这个allData会被遍历出来，造成不必要的麻烦。
                    }
                    arr.allData.push(data);
                    arr.forEach(function (json) {
                        json.triggerNum++;
                        if (json.triggerNum >= json.minNum && json.isDel === false) {
                            json.fn({ nowData: data, allData: arr.allData });
                            // 销毁发布过的单次订阅
                            if (type === 'once') {
                                json.isDel = true;
                            }
                        }
                        if (Object.prototype.toString.call(cb).slice(8, -1).toLowerCase() === 'function') {
                            json.data = data;
                            cb(json);
                        }
                    });
                    // 销毁全部单次订阅
                    if (type === 'once') {
                        var isDelAll = true;
                        arr.forEach(function (json) {
                            if (json.isDel === false) {
                                isDelAll = false;
                            }
                        });
                        if (isDelAll) {
                            arr.length = 0;
                        }
                    }
                }
            }

            // 订阅 minNum - 至少发布(emit)多少次才会发消息(on)给订阅者

        }, {
            key: 'on',
            value: function on(str, fn, minNum) {
                this._bind(str, fn, minNum, this.event);
            }

            // 订阅 minNum - 至少发布(emit)多少次才会发消息(on)给订阅者

        }, {
            key: 'addEventListener',
            value: function addEventListener(str, fnName, minNum) {
                this._bind(str, fnName, minNum, this.event);
            }

            // 取消订阅 取消指定名字 以及指定名字的第几个

        }, {
            key: 'removeEventListener',
            value: function removeEventListener(str, fnName, num) {
                var arr = this.event[str];
                if (arr) {
                    // 这里用普通的for循环或者forEach循环都可以，不会循环出obj上因触发_trigger而绑定的allData属性，否则还需做特殊处理。
                    for (var i = 0; i < arr.length; i++) {
                        var json = arr[i];
                        if (json.fn.nowNum === undefined) {
                            json.fn.nowNum = 0;
                        }
                        if (num && num >= 1) {
                            // 取消指定名字的第几个
                            if (json.fn === fnName) {
                                json.fn.nowNum++;
                                if (json.fn.nowNum === num) {
                                    json.isDel = true;
                                }
                            }
                        } else {
                            // 取消指定名字的全部，并不代表取消了这个数组里的全部
                            if (json.fn === fnName) {
                                json.isDel = true;
                            }
                        }
                    }
                    // 取消了全部
                    if (this._isCancelAll(arr) === true) {
                        arr.length = 0;
                    }
                }
            }

            // 单次订阅 minNum - 至少发布(emit)多少次才会发消息(on)给订阅者

        }, {
            key: 'once',
            value: function once(str, fn, minNum) {
                this._bind(str, fn, minNum, this.eventOne);
            }

            // 取消订阅

        }, {
            key: 'off',
            value: function off(str, num, fnName) {
                if (fnName !== undefined) {
                    // 给off增加removeEventListener的功能
                    this.removeEventListener(str, fnName, num);
                    return;
                }
                if (str) {
                    this._cancel(str, num, this.event);
                    this._cancel(str, num, this.eventOne); // 取消单次订阅
                } else {
                    this._cancelAll(this.event);
                    this._cancelAll(this.eventOne); // 取消全部单次订阅
                }
            }

            // 发布

        }, {
            key: 'emit',
            value: function emit(str, data, cb) {
                this._trigger(str, data, cb, this.event);
                this._trigger(str, data, cb, this.eventOne, 'once'); // 发布单次订阅并销毁
            }

            // 数组转对象

        }, {
            key: 'arrToJson',
            value: function arrToJson(arr) {
                var json = {};
                arr.forEach(function (v, i) {
                    if (v.name) {
                        json[v.name] = v;
                    } else {
                        json[i] = v;
                    }
                });
                return json;
            }
        }]);

        return EventEmitter;
    }();

    return EventEmitter;
});