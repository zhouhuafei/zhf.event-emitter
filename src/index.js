class Super {
    constructor() {
        this.event = {};
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

    // 取消订阅
    off(str, num) {
        if (str) {
            const obj = this.event[str];
            if (obj) {
                if (num && num >= 1) {
                    obj.splice((num - 1), 1);
                } else {
                    obj.length = 0;
                }
            }
        } else {
            this.event = {};
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
    }
}

module.exports = new Super();
