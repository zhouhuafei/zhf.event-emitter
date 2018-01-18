class Super {
    constructor() {
        this.event = {};
        this.eventOne = {};
    }

    // 订阅
    on(str, fn) {
        let obj = this.event[str];
        if (!obj) {
            obj = [];
            this.event[str] = obj;
        }
        obj.push(fn);
    }

    // 单次订阅
    one(str, fn) {
        if (str) {
            this.eventOne[str] = fn;
        }
    }

    // 取消订阅
    off(str, num) {
        if (str) {
            const obj = this.event[str];
            if (obj) {
                if (num && num >= 1) {
                    obj.splice((num - 1), 1, function () {
                    });
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
    emit(str, data) {
        const obj = this.event[str];
        if (obj) {
            obj.forEach((fn) => {
                fn(data);
            });
        }
        // 发布单次订阅并销毁
        const one = this.eventOne[str];
        if (one) {
            one(data);
            delete this.eventOne[str];
        }
    }
}

module.exports = new Super();
