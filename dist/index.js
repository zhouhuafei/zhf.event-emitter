"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Super = function () {
    function Super() {
        _classCallCheck(this, Super);

        this.event = {};
        this.eventOne = {};
    }

    // 订阅


    _createClass(Super, [{
        key: "on",
        value: function on(str, fn) {
            var obj = this.event[str];
            if (!obj) {
                obj = [];
                this.event[str] = obj;
            }
            obj.push(fn);
        }

        // 单次订阅

    }, {
        key: "one",
        value: function one(str, fn) {
            if (str) {
                this.eventOne[str] = fn;
            }
        }

        // 取消订阅

    }, {
        key: "off",
        value: function off(str, num) {
            if (str) {
                var obj = this.event[str];
                if (obj) {
                    if (num && num >= 1) {
                        obj.splice(num - 1, 1);
                    } else {
                        obj.length = 0;
                    }
                }
                delete this.eventOne[str]; // 取消单次订阅
            } else {
                this.event = {};
                this.eventOne = {}; // 取消全部单次订阅
            }
        }

        // 发布

    }, {
        key: "emit",
        value: function emit(str, data) {
            var obj = this.event[str];
            if (obj) {
                obj.forEach(function (fn) {
                    fn(data);
                });
            }
            // 发布单次订阅并销毁
            var one = this.eventOne[str];
            if (one) {
                one(data);
                delete this.eventOne[str];
            }
        }
    }]);

    return Super;
}();

module.exports = new Super();