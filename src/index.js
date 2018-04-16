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
            let arr = event[str];
            if (!arr) {
                arr = [];
                event[str] = arr;
            }
            arr.push({
                isDel: false, // 是否取消了这个函数的订阅
                minNum: minNum, // 至少触发几次才会发布订阅
                triggerNum: 0, // 目前触发了几次
                fn: fn, // 订阅的函数
            });
        }

        _cancel(str, num, event) {
            const arr = event[str];
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

        _isCancelAll(arr) {
            let isCancelAll = true;
            for (let i = 0; i < arr.length; i++) {
                const json = arr[i];
                delete json.fn.nowNum;
                if (json.isDel === false) {
                    isCancelAll = false;
                }
            }
            return isCancelAll;
        }

        _cancelAll(event) {
            Object.keys(event).forEach((key) => {
                event[key].length = 0;
            });
        }

        _trigger(str, data, cb, event, type) {
            const arr = event[str];
            if (arr) {
                if (!arr.allData) {
                    arr.allData = []; // 添加了这个allData属性，以后再循环obj，请使用普通的for循环或者forEach循环，否则这个allData会被遍历出来，造成不必要的麻烦。
                }
                arr.allData.push(data);
                arr.forEach((json) => {
                    json.triggerNum++;
                    if (json.triggerNum >= json.minNum && json.isDel === false) {
                        json.fn({nowData: data, allData: arr.allData});
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
                    let isDelAll = true;
                    arr.forEach((json) => {
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
        on(str, fn, minNum) {
            this._bind(str, fn, minNum, this.event);
        }

        // 订阅 minNum - 至少发布(emit)多少次才会发消息(on)给订阅者
        addEventListener(str, fnName, minNum) {
            this._bind(str, fnName, minNum, this.event);
        }

        // 取消订阅 取消指定名字 以及指定名字的第几个
        removeEventListener(str, fnName, num) {
            const arr = this.event[str];
            if (arr) {
                // 这里用普通的for循环或者forEach循环都可以，不会循环出obj上因触发_trigger而绑定的allData属性，否则还需做特殊处理。
                for (let i = 0; i < arr.length; i++) {
                    const json = arr[i];
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
        once(str, fn, minNum) {
            this._bind(str, fn, minNum, this.eventOne);
        }

        // 取消订阅
        off(str, num, fnName) {
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
