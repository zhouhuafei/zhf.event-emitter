'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Super = function () {
    function Super() {
        _classCallCheck(this, Super);

        this.event = {};
        this.eventOne = {};
    }

    _createClass(Super, [{
        key: '_bind',
        value: function _bind(str, fn) {
            var minNum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
            var event = arguments[3];

            var obj = event[str];
            if (!obj) {
                obj = [];
                event[str] = obj;
            }
            obj.push({
                isDel: false,
                minNum: minNum,
                triggerNum: 0,
                fn: fn
            });
        }
    }, {
        key: '_cancel',
        value: function _cancel(str, num, event) {
            var obj = event[str];
            if (obj) {
                if (num && num >= 1) {
                    obj.splice(num - 1, 1, {
                        isDel: true,
                        fn: function fn() {}
                    });
                } else {
                    obj.length = 0;
                }
            }
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
            var obj = event[str];
            if (obj) {
                if (!obj.allData) {
                    obj.allData = [];
                }
                obj.allData.push(data);
                obj.forEach(function (json) {
                    json.triggerNum++;
                    if (json.triggerNum >= json.minNum && json.isDel === false) {
                        json.fn({ nowData: data, allData: obj.allData });
                        // 销毁发布过的单次订阅
                        if (type === 'one') {
                            json.isDel = true;
                            json.fn = function () {};
                        }
                    }
                    if (Object.prototype.toString.call(cb).slice(8, -1).toLowerCase() === 'function') {
                        json.data = data;
                        cb(json);
                    }
                });
                // 销毁全部单次订阅
                if (type === 'one') {
                    var isDelAll = true;
                    obj.forEach(function (json) {
                        if (json.isDel === false) {
                            isDelAll = false;
                        }
                    });
                    if (isDelAll) {
                        obj.length = 0;
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

        // 单次订阅 minNum - 至少发布(emit)多少次才会发消息(on)给订阅者

    }, {
        key: 'one',
        value: function one(str, fn, minNum) {
            this._bind(str, fn, minNum, this.eventOne);
        }

        // 取消订阅

    }, {
        key: 'off',
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
        key: 'emit',
        value: function emit(str, data, cb) {
            this._trigger(str, data, cb, this.event);
            this._trigger(str, data, cb, this.eventOne, 'one'); // 发布单次订阅并销毁
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

    return Super;
}();

module.exports = new Super();