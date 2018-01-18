const event = require('../dist/index.min');

test(
    `
    // 订阅
    event.on('hehe', function (data) {
        console.log(data); // {a: 1, b: 2}
    });
    // 发布
    event.emit('hehe', {a: 1, b: 2});
    `
    ,
    () => {
        const emitData = {a: 1, b: 2};
        // 订阅
        event.on('hehe', (data) => {
            console.log(data);
            expect(data).toEqual(emitData);
        });
        // 发布
        event.emit('hehe', emitData);
    }
);
