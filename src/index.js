class Super {
    constructor() {
        this.event = {};
        this.eventOne = {};
    }

    _bind(str, fn, event) {
        let obj = event[str];
        if (!obj) {
            obj = [];
            event[str] = obj;
        }
        obj.push(fn);
    }

    _cancel(str, num, event) {
        const obj = event[str];
        if (obj) {
            if (num && num >= 1) {
                obj.splice((num - 1), 1, function () {
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

    _trigger(str, data, event, isDestroy = false) {
        const obj = event[str];
        if (obj) {
            obj.forEach((fn) => {
                fn(data);
            });
            if (isDestroy) {
                obj.length = 0;
            }
        }
    }

    // 订阅
    on(str, fn) {
        this._bind(str, fn, this.event);
    }

    // 单次订阅
    one(str, fn) {
        this._bind(str, fn, this.eventOne);
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
    emit(str, data) {
        this._trigger(str, data, this.event);
        this._trigger(str, data, this.eventOne, true); // 发布单次订阅并销毁
    }
}

module.exports = new Super();
