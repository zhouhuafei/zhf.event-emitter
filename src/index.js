(function (name, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') { // nodejs - commonjs canon
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) { // requirejs - amd canon
        define(factory);
    } else if (window) { // window - browser canon
        if (Object.prototype.toString.call(window.zhf).slice(8, -1).toLowerCase() !== 'object') {
            window.zhf = {};
        }
        window.zhf[name] = factory();
    }
})('EventEmitter', function () {
    class EventEmitter {
        constructor() {
            this.event = {};
            this.eventOne = {};
        }

        _bind(str, fn, minNum = 1, event) {
            let obj = event[str];
            if (!obj) {
                obj = [];
                event[str] = obj;
            }
            obj.push({
                isDel: false,
                minNum: minNum,
                triggerNum: 0,
                fn: fn,
            });
        }

        _cancel(str, num, event) {
            const obj = event[str];
            if (obj) {
                if (num && num >= 1) {
                    obj.splice((num - 1), 1, {
                        isDel: true,
                        fn: function () {
                        },
                    });
                } else {
                    obj.length = 0;
                }
            }
        }

        _cancelAll(event) {
            Object.keys(event).forEach((key) => {
                event[key].length = 0;
            });
        }

        _trigger(str, data, cb, event, type) {
            const obj = event[str];
            if (obj) {
                if (!obj.allData) {
                    obj.allData = [];
                }
                obj.allData.push(data);
                obj.forEach((json) => {
                    json.triggerNum++;
                    if (json.triggerNum >= json.minNum && json.isDel === false) {
                        json.fn({nowData: data, allData: obj.allData});
                        // 销毁发布过的单次订阅
                        if (type === 'once') {
                            json.isDel = true;
                            json.fn = function () {
                            };
                        }
                    }
                    if (Object.prototype.toString.call(cb).slice(8, -1).toLowerCase() === 'function') {
                        json.data = data;
                        cb(json);
                    }
                });
                // 销毁全部单次订阅
                if (type === 'once') {
                    let isDelAll = true;
                    obj.forEach((json) => {
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
        on(str, fn, minNum) {
            this._bind(str, fn, minNum, this.event);
        }

        // 单次订阅 minNum - 至少发布(emit)多少次才会发消息(on)给订阅者
        once(str, fn, minNum) {
            this._bind(str, fn, minNum, this.eventOne);
        }

        // 取消订阅
        off(str, num) {
            if (str) {
                this._cancel(str, num, this.event);
                this._cancel(str, num, this.eventOne); // 取消单次订阅
            } else {
                this._cancelAll(this.event);
                this._cancelAll(this.eventOne); // 取消全部单次订阅
            }
        }

        // 发布
        emit(str, data, cb) {
            this._trigger(str, data, cb, this.event);
            this._trigger(str, data, cb, this.eventOne, 'once'); // 发布单次订阅并销毁
        }

        // 数组转对象
        arrToJson(arr) {
            const json = {};
            arr.forEach(function (v, i) {
                if (v.name) {
                    json[v.name] = v;
                } else {
                    json[i] = v;
                }
            });
            return json;
        }
    }

    return EventEmitter;
});
