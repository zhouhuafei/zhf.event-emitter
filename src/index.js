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
