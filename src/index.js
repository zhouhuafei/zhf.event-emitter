class Super {
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

    _trigger(str, data, cb, event, isDestroy = false) {
        const obj = event[str];
        if (obj) {
            obj.forEach((json) => {
                json.triggerNum++;
                if (json.triggerNum >= json.minNum && json.isDel === false) {
                    json.fn(data);
                    if (isDestroy) {
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
            if (isDestroy) {
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
    one(str, fn, minNum) {
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
        this._trigger(str, data, cb, this.eventOne, true); // 发布单次订阅并销毁
    }
}

module.exports = new Super();
