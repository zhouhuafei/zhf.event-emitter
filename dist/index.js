"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Super = function () {
    function Super() {
        _classCallCheck(this, Super);

        this.event = {};
        this.eventOne = {};
    }

    _createClass(Super, [{
        key: "_bind",
        value: function _bind(str, fn, event) {
            var obj = event[str];
            if (!obj) {
                obj = [];
                event[str] = obj;
            }
            obj.push(fn);
        }
    }, {
        key: "_cancel",
        value: function _cancel(str, num, event) {
            var obj = event[str];
            if (obj) {
                if (num && num >= 1) {
                    obj.splice(num - 1, 1, function () {});
                } else {
                    obj.length = 0;
                }
            }
        }
    }, {
        key: "_cancelAll",
        value: function _cancelAll(event) {
            Object.keys(event).forEach(function (key) {
                event[key].length = 0;
            });
        }
    }, {
        key: "_trigger",
        value: function _trigger(str, data, event) {
            var isDestroy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var obj = event[str];
            if (obj) {
                obj.forEach(function (fn) {
                    fn(data);
                });
                if (isDestroy) {
                    obj.length = 0;
                }
            }
        }

        // 订阅

    }, {
        key: "on",
        value: function on(str, fn) {
            this._bind(str, fn, this.event);
        }

        // 单次订阅

    }, {
        key: "one",
        value: function one(str, fn) {
            this._bind(str, fn, this.eventOne);
        }

        // 取消订阅

    }, {
        key: "off",
        value: function off(str, num) {
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
        key: "emit",
        value: function emit(str, data) {
            this._trigger(str, data, this.event);
            this._trigger(str, data, this.eventOne, true); // 发布单次订阅并销毁
        }
    }]);

    return Super;
}();

module.exports = new Super();